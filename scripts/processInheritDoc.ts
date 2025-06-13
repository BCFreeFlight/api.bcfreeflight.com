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
  const interfaceFiles = await glob.glob(path.join(srcDir, '**', 'interfaces', '*.ts'));

  for (const filePath of interfaceFiles) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract interface name
    const interfaceMatch = content.match(/export\s+interface\s+(\w+)/);
    if (!interfaceMatch) continue;

    const interfaceName = interfaceMatch[1];

    // Find all method documentation blocks
    const methodDocs = content.match(/\/\*\*[\s\S]*?\*\/\s*([\w]+)\s*\([^)]*\)/g) || [];

    for (const methodDoc of methodDocs) {
      // Extract method name
      const methodNameMatch = methodDoc.match(/\*\/\s*([\w]+)\s*\(/);
      if (!methodNameMatch) continue;

      const methodName = methodNameMatch[1];
      const docComment = methodDoc.match(/\/\*\*([\s\S]*?)\*\//)![1];

      // Store with interface.method signature for lookup
      docMap.set(`${interfaceName}.${methodName}`, `/**${docComment}*/`);
    }

    // Also store the interface-level documentation
    const interfaceDocMatch = content.match(/\/\*\*([\s\S]*?)\*\/\s*export\s+interface/);
    if (interfaceDocMatch) {
      docMap.set(interfaceName, `/**${interfaceDocMatch[1]}*/`);
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
  const implementsMatches = bundleContent.match(/class\s+(\w+)\s+implements\s+(\w+)/g) || [];
  const classToInterface = new Map<string, string>();

  for (const match of implementsMatches) {
    const parts = match.match(/class\s+(\w+)\s+implements\s+(\w+)/);
    if (parts) {
      classToInterface.set(parts[1], parts[2]);
    }
  }

  // Replace @inheritDoc comments
  bundleContent = bundleContent.replace(
    /\/\*\*\s*\n\s*\*\s*@inheritdoc\s*\n\s*\*\/\s*(?:export\s+)?(?:class\s+(\w+)|constructor|\w+\s*\()/gi,
    (match, className, offset) => {
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
        const methodMatch = match.match(/\/\*\*[\s\S]*?\*\/\s*(\w+)\s*\(/);
        if (methodMatch) {
          const methodName = methodMatch[1];
          const beforeMatch = bundleContent.substring(0, offset);
          const classMatch = beforeMatch.match(/class\s+(\w+)\s+implements\s+(\w+)[^{]*{[^]*$/i);
          if (classMatch) {
            const [, className, interfaceName] = classMatch;
            const docKey = `${interfaceName}.${methodName}`;
            if (docMap.has(docKey)) {
              return docMap.get(docKey) + ` ${methodName}(`;
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
  processBundle(bundlePath, docMap);
  console.log(`✅ Successfully processed @inheritDoc comments in bundle`);
}
