import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Extracts documentation from TypeScript interfaces
 * @param srcDir - The source directory containing TypeScript files
 * @returns A map of interface method signatures to their documentation
 */
async function extractInterfaceDocumentation(srcDir: string): Promise<Map<string, string>> {
  const docMap = new Map<string, string>();
  // Expanded search to find all interface files
  const interfaceFiles = await glob.glob(path.join(srcDir, '**', 'interfaces', '*.ts'));
  // Also search for interface files that might be in other directories
  const otherInterfaceFiles = await glob.glob(path.join(srcDir, '**', 'I*.ts'));
  // Also search for service interfaces that might not be in the interfaces directory
  const serviceInterfaceFiles = await glob.glob(path.join(srcDir, '**', '*Service.ts'));

  // Process all interface files (both standard interfaces and service interfaces)
  const allInterfaceFiles = [...interfaceFiles, ...otherInterfaceFiles, ...serviceInterfaceFiles];

  for (const filePath of allInterfaceFiles) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract interface name(s) from the file
    const interfaceMatches = [...content.matchAll(/export\s+interface\s+(\w+)/g)];
    if (interfaceMatches.length === 0) continue;

    for (const interfaceMatch of interfaceMatches) {
      const interfaceName = interfaceMatch[1];
      console.log(`Found interface: ${interfaceName} in ${path.basename(filePath)}`);

      // Find all method documentation blocks for this interface
      // Look for the section after the interface declaration
      const interfaceStartIndex = interfaceMatch.index;
      const nextInterfaceIndex = content.indexOf('interface', interfaceStartIndex + 10);
      const interfaceSection = nextInterfaceIndex > 0 
        ? content.substring(interfaceStartIndex, nextInterfaceIndex)
        : content.substring(interfaceStartIndex);

      // Find methods within this interface section
      const methodDocs = interfaceSection.match(/\/\*\*[\s\S]*?\*\/\s*([\w]+)\s*\([^)]*\)/g) || [];

      for (const methodDoc of methodDocs) {
        // Extract method name
        const methodNameMatch = methodDoc.match(/\*\/\s*([\w]+)\s*\(/);
        if (!methodNameMatch) continue;

        const methodName = methodNameMatch[1];
        const docComment = methodDoc.match(/\/\*\*([\s\S]*?)\*\//)![1];

        // Store with interface.method signature for lookup
        docMap.set(`${interfaceName}.${methodName}`, `/**${docComment}*/`);
        console.log(`Added doc for method: ${interfaceName}.${methodName}`);
      }

      // Also store the interface-level documentation
      const interfaceSectionStart = content.lastIndexOf('/**', interfaceStartIndex);
      if (interfaceSectionStart >= 0) {
        const interfaceDocComment = content.substring(
          interfaceSectionStart, 
          content.indexOf('*/', interfaceSectionStart) + 2
        );
        const interfaceDocMatch = interfaceDocComment.match(/\/\*\*([\s\S]*?)\*\//);
        if (interfaceDocMatch) {
          docMap.set(interfaceName, `/**${interfaceDocMatch[1]}*/`);
          console.log(`Added doc for interface: ${interfaceName}`);
        }
      }
    }
  }

  return docMap;
}

/**
 * Processes a JavaScript bundle to replace @inheritDoc comments with actual documentation
 * @param bundlePath - Path to the bundle file
 * @param docMap - Map containing documentation blocks
 */
function processBundle(bundlePath: string, docMap: Map<string, string>): void {
  let bundleContent = fs.readFileSync(bundlePath, 'utf8');

  // Find all classes that implement interfaces
  // Improved regex to handle any whitespace, including newlines
  const implementsMatches = bundleContent.match(/class\s+(\w+)[\s\n]*implements[\s\n]*(I\w+)/g) || [];
  const classToInterface = new Map<string, string>();

  for (const match of implementsMatches) {
    const parts = match.match(/class\s+(\w+)[\s\n]*implements[\s\n]*(I\w+)/);
    if (parts) {
      classToInterface.set(parts[1], parts[2]);
      console.log(`Mapped class ${parts[1]} to interface ${parts[2]}`);
    }
  }

  // Replace @inheritDoc comments
  bundleContent = bundleContent.replace(
    /\/\*\*\s*\n\s*\*\s*@inherit[dD]oc\s*\n?\s*\*\/\s*(?:export\s+)?(?:class\s+(\w+)|constructor|(async\s+)?\w+\s*\()/gi,
    (match, className, asyncKeyword, offset) => {
      // Determine if this is a class, constructor, or method
      if (className) {
        // This is a class doc
        const interfaceName = classToInterface.get(className);
        if (interfaceName && docMap.has(interfaceName)) {
          return docMap.get(interfaceName) + ` export class ${className}`;
        }
      } else if (match.includes('constructor')) {
        // Find the containing class
        const beforeMatch = bundleContent.substring(0, offset);
        const classMatch = beforeMatch.match(/class\s+(\w+)\s+implements\s+(\w+)[^{]*{[^]*$/i);
        if (classMatch) {
          const [, className, interfaceName] = classMatch;
          const docKey = `${interfaceName}.constructor`;
          if (docMap.has(docKey)) {
            return docMap.get(docKey) + ' constructor';
          }
        }
      } else {
        // This is a method doc
        // Extract method name and find the containing class
        const methodMatch = match.match(/\/\*\*[\s\S]*?\*\/\s*(?:async\s+)?(\w+)\s*\(/);
        if (methodMatch) {
          const methodName = methodMatch[1];
          const beforeMatch = bundleContent.substring(0, offset);
          const classMatch = beforeMatch.match(/class\s+(\w+)[\s\n]*implements[\s\n]*(I\w+)[^{]*{[^]*$/i);
          if (classMatch) {
            const [, className, interfaceName] = classMatch;
            const docKey = `${interfaceName}.${methodName}`;
            if (docMap.has(docKey)) {
              console.log(`Replaced @inheritDoc for ${className}.${methodName} with documentation from ${interfaceName}.${methodName}`);
              return docMap.get(docKey) + ` ${methodName}(`;
            } else {
              console.warn(`Warning: Could not find documentation for ${docKey} in the documentation map`);
            }
          }
        }
      }
      return match;
    }
  );

  fs.writeFileSync(bundlePath, bundleContent);
}

/**
 * Main function to process a bundle file
 * @param bundlePath - Path to the bundle file
 */
export async function processInheritDoc(bundlePath: string): Promise<void> {
  console.log(`Processing @inheritDoc comments in ${bundlePath}...`);
  const docMap = await extractInterfaceDocumentation('src');

  // Debug: Log how many @inheritDoc instances are in the bundle before processing
  const bundleContent = fs.readFileSync(bundlePath, 'utf8');
  const inheritDocCount = (bundleContent.match(/@inherit[dD]oc/g) || []).length;
  console.log(`Found ${inheritDocCount} @inheritDoc instances before processing`);

  // Log documentation map keys for debugging
  console.log(`Extracted documentation for ${docMap.size} symbols:`, Array.from(docMap.keys()));

  processBundle(bundlePath, docMap);

  // Check if any @inheritDoc instances remain after processing
  const processedContent = fs.readFileSync(bundlePath, 'utf8');
  const remainingCount = (processedContent.match(/@inherit[dD]oc/g) || []).length;
  if (remainingCount > 0) {
    console.warn(`⚠️ Warning: ${remainingCount} @inheritDoc instances remain in the processed bundle`);
  } else {
    console.log(`✅ Successfully processed all @inheritDoc comments in bundle`);
  }
}
