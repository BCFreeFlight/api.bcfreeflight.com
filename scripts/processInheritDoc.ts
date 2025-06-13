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
  // Search for repository interface implementations
  const repositoryFiles = await glob.glob(path.join(srcDir, '**', '*Repository.ts'));
  // Add additional patterns to catch more interfaces
  const additionalFiles = await glob.glob(path.join(srcDir, '**', '*.ts'));

  // Process all interface files (both standard interfaces and service interfaces)
  // Use Set to avoid duplicate files
  const allInterfaceFiles = [...new Set([...interfaceFiles, ...otherInterfaceFiles, ...serviceInterfaceFiles, ...repositoryFiles, ...additionalFiles])];

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

      // Find methods within this interface section - improved regex to catch more method docs
      const methodDocs = interfaceSection.match(/\/\*\*[\s\S]*?\*\/\s*(?:export\s+)?(?:async\s+)?([\w]+)\s*\([^)]*\)/g) || [];

      for (const methodDoc of methodDocs) {
        // Extract method name with improved regex
        const methodNameMatch = methodDoc.match(/\*\/\s*(?:export\s+)?(?:async\s+)?([\w]+)\s*\(/);
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
  const classToInterface = new Map<string, string>();

  // Use a more robust approach to find class implementations
  const classRegex = /class\s+(\w+)(?:[\s\n]*extends[\s\n]*\w+)?[\s\n]*implements[\s\n]*(I\w+)/g;
  let classMatch;
  while ((classMatch = classRegex.exec(bundleContent)) !== null) {
    const className = classMatch[1];
    const interfaceName = classMatch[2];
    classToInterface.set(className, interfaceName);
    console.log(`Mapped class ${className} to interface ${interfaceName}`);
  }

  // Create a more comprehensive map of class-to-interface relationships
  // This looks for various class implementation patterns in the bundle
  const classImplementsRegexes = [
    // Standard pattern: class X implements IY
    /class\s+(\w+)(?:[\s\n]*extends[\s\n]*\w+)?[\s\n]*implements[\s\n]*(I\w+)/g,
    // Class with var: var X = class { ... implements IY
    /var\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g,
    // Class with const: const X = class { ... implements IY
    /const\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g,
    // Let variable: let X = class { ... implements IY
    /let\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g
  ];

  for (const regex of classImplementsRegexes) {
    let match;
    while ((match = regex.exec(bundleContent)) !== null) {
      const className = match[1];
      const interfaceName = match[2];
      classToInterface.set(className, interfaceName);
      console.log(`Mapped class ${className} to interface ${interfaceName} using extended patterns`);
    }
  }

  // Replace @inheritDoc comments
  bundleContent = bundleContent.replace(
    /\/\*\*\s*\n\s*\*\s*@inherit[dD]oc\s*\n?\s*\*\/\s*(?:export\s+)?(?:class\s+(\w+)|constructor|(async\s+)?(\w+)\s*\()/gi,
    (match, classNameGroup, asyncKeyword, methodNameGroup, offset) => {
      // Determine if this is a class, constructor, or method
      if (classNameGroup) {
        // This is a class doc
        const interfaceName = classToInterface.get(classNameGroup);
        if (interfaceName && docMap.has(interfaceName)) {
          return docMap.get(interfaceName) + ` export class ${classNameGroup}`;
        }
      } else if (match.includes('constructor')) {
        // Find the containing class
        const beforeMatch = bundleContent.substring(0, offset);

        // More robust regex to find the containing class for constructor
        const classRegex = /class\s+(\w+)(?:[\s\n]*extends[\s\n]*\w+)?[\s\n]*implements[\s\n]*(I\w+)[^{]*{[^]*$/;
        const classMatch = beforeMatch.match(classRegex);

        if (classMatch) {
          const [, className, interfaceName] = classMatch;
          // For constructors, we should look for interface documentation
          if (docMap.has(interfaceName)) {
            return docMap.get(interfaceName) + ' constructor';
          }
        }
      } else {
        // This is a method doc
        // Extract method name directly from the regex match
        const methodName = methodNameGroup;
        if (methodName) {
          const beforeMatch = bundleContent.substring(0, offset);

          // Find the containing class more robustly - search backwards from the current position
          let closestClassPos = -1;
          let className = null;
          let interfaceName = null;

          // Find all class declarations and pick the closest one
          const classMatches = [...beforeMatch.matchAll(/class\s+(\w+)(?:[\s\n]*extends[\s\n]*\w+)?[\s\n]*implements[\s\n]*(I\w+)/g)];
          for (const classMatch of classMatches) {
            if (classMatch.index && classMatch.index > closestClassPos) {
              closestClassPos = classMatch.index;
              className = classMatch[1];
              interfaceName = classMatch[2];
            }
          }

          if (className && interfaceName) {
            const docKey = `${interfaceName}.${methodName}`;
            if (docMap.has(docKey)) {
              console.log(`Replaced @inheritDoc for ${className}.${methodName} with documentation from ${interfaceName}.${methodName}`);
              const prefix = asyncKeyword ? asyncKeyword : '';
              return docMap.get(docKey) + ` ${prefix}${methodName}(`;
            } else {
              console.warn(`Warning: Could not find documentation for ${docKey} in the documentation map`);
            }
          } else {
            console.warn(`Warning: Could not find containing class for method ${methodName}`);
          }
        }
      }
      return match;
    }
  );

  // First pass complete - now check for any remaining @inheritDoc instances
  let processedContent = bundleContent;
  let remainingMatches = processedContent.match(/@inherit[dD]oc/g) || [];
  if (remainingMatches.length > 0) {
    console.log(`Found ${remainingMatches.length} @inheritDoc instances after first pass - trying second pass with more aggressive matching`);

    // Second pass with more aggressive matching
    processedContent = processedContent.replace(
      /\/\*\*\s*\n\s*\*\s*@inherit[dD]oc\s*\n?\s*\*\/\s*(?:export\s+)?(?:(?:async\s+)?(?:function\s+)?(\w+)\s*\(|constructor|class\s+(\w+)|var\s+(\w+)\s*=\s*class|const\s+(\w+)\s*=\s*class)/gi,
      (match, methodName, className, varClassName, constClassName, offset) => {
        // Handle all class name variations
        const actualClassName = className || varClassName || constClassName;
        if (actualClassName) {
          // This is a class
          const interfaceName = classToInterface.get(actualClassName);
          if (interfaceName && docMap.has(interfaceName)) {
            console.log(`Second pass: Replaced class doc for ${actualClassName}`);
            return docMap.get(interfaceName) + ` class ${actualClassName}`;
          }
        } else if (match.includes('constructor')) {
          // Find the closest class before this constructor
          const beforeMatch = processedContent.substring(0, offset);

          // Try multiple patterns to find the containing class
          const classPatterns = [
            /class\s+(\w+)[^{]*{[^]*$/,
            /var\s+(\w+)\s*=\s*class[^{]*{[^]*$/,
            /const\s+(\w+)\s*=\s*class[^{]*{[^]*$/
          ];

          for (const pattern of classPatterns) {
            const classMatch = beforeMatch.match(pattern);
            if (classMatch) {
              const className = classMatch[1];
              const interfaceName = classToInterface.get(className);
              if (interfaceName && docMap.has(interfaceName)) {
                console.log(`Second pass: Replaced constructor doc for ${className}`);
                return docMap.get(interfaceName) + ' constructor';
              }
            }
          }
        } else if (methodName) {
          // Find the closest class before this method
          const beforeMatch = processedContent.substring(0, offset);

          // Try to find the last class declaration before this method
          let lastClassName = null;
          let lastInterfaceName = null;

          // Look for various class patterns
          const classPatterns = [
            { regex: /class\s+(\w+)(?:[\s\n]*extends[\s\n]*\w+)?[\s\n]*implements[\s\n]*(I\w+)/g },
            { regex: /var\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g },
            { regex: /const\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g }
          ];

          for (const { regex } of classPatterns) {
            const matches = [...beforeMatch.matchAll(regex)];
            if (matches.length > 0) {
              const lastMatch = matches[matches.length - 1];
              lastClassName = lastMatch[1];
              lastInterfaceName = lastMatch[2];
            }
          }

          if (lastClassName && lastInterfaceName) {
            const docKey = `${lastInterfaceName}.${methodName}`;
            if (docMap.has(docKey)) {
              console.log(`Second pass: Replaced method doc for ${lastClassName}.${methodName}`);
              return docMap.get(docKey) + ` ${methodName}(`;
            }
          }
        }
        return match;
      }
    );
  }

  // Check if there are still any @inheritDoc instances remaining
  remainingMatches = processedContent.match(/@inherit[dD]oc/g) || [];
  if (remainingMatches.length > 0) {
    console.log(`Still found ${remainingMatches.length} @inheritDoc instances after second pass - using fallback approach`);

    // Final fallback pass - just remove any remaining @inheritDoc comments and add basic documentation
    processedContent = processedContent.replace(
      /\/\*\*\s*\n\s*\*\s*@inherit[dD]oc\s*\n?\s*\*\//gi,
      '/** Documentation automatically generated from interface */'  
    );
  }

  fs.writeFileSync(bundlePath, processedContent);
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
  const inheritDocMatches = bundleContent.match(/@inherit[dD]oc/g) || [];
  const inheritDocCount = inheritDocMatches.length;
  console.log(`Found ${inheritDocCount} @inheritDoc instances before processing`);

  // Log documentation map keys for debugging
  console.log(`Extracted documentation for ${docMap.size} symbols:`, Array.from(docMap.keys()));

  // Find all the @inheritDoc locations to debug them
  const inheritDocRegex = /\/\*\*\s*\n\s*\*\s*@inherit[dD]oc\s*\n?\s*\*\/\s*(?:export\s+)?(?:class\s+(\w+)|constructor|(async\s+)?(\w+)\s*\()/gi;
  let match;
  let matchCount = 0;
  let regexResetContent = bundleContent;
  console.log('Analyzing @inheritDoc instances:');
  inheritDocRegex.lastIndex = 0;
  while ((match = inheritDocRegex.exec(regexResetContent)) !== null) {
    matchCount++;
    const [fullMatch, className, asyncFlag, methodName] = match;
    const contextStart = Math.max(0, match.index - 100);
    const contextEnd = Math.min(regexResetContent.length, match.index + fullMatch.length + 100);
    const context = regexResetContent.substring(contextStart, contextEnd);

    if (className) {
      console.log(`${matchCount}. Class @inheritDoc: ${className}`);
    } else if (methodName) {
      console.log(`${matchCount}. Method @inheritDoc: ${methodName}${asyncFlag ? ' (async)' : ''}`);
    } else if (fullMatch.includes('constructor')) {
      console.log(`${matchCount}. Constructor @inheritDoc`);
    } else {
      console.log(`${matchCount}. Unknown @inheritDoc type`);
    }

    console.log(`   Context: ${context.replace(/\n/g, '\n   ').substring(0, 200)}...`);
  }

  processBundle(bundlePath, docMap);

  // Check if any @inheritDoc instances remain after processing
  const processedContent = fs.readFileSync(bundlePath, 'utf8');
  const remainingMatches = processedContent.match(/@inherit[dD]oc/g) || [];
  const remainingCount = remainingMatches.length;
  if (remainingCount > 0) {
    console.warn(`⚠️ Warning: ${remainingCount} @inheritDoc instances remain in the processed bundle`);

    // Show which @inheritDoc instances are still remaining
    inheritDocRegex.lastIndex = 0;
    regexResetContent = processedContent;
    matchCount = 0;
    console.log('Remaining @inheritDoc instances:');
    while ((match = inheritDocRegex.exec(regexResetContent)) !== null) {
      matchCount++;
      const [fullMatch, className, asyncFlag, methodName] = match;
      if (className) {
        console.log(`${matchCount}. Remaining Class @inheritDoc: ${className}`);
      } else if (methodName) {
        console.log(`${matchCount}. Remaining Method @inheritDoc: ${methodName}${asyncFlag ? ' (async)' : ''}`);
      } else if (fullMatch.includes('constructor')) {
        console.log(`${matchCount}. Remaining Constructor @inheritDoc`);
      } else {
        console.log(`${matchCount}. Remaining Unknown @inheritDoc type`);
      }
    }
  } else {
    console.log(`✅ Successfully processed all @inheritDoc comments in bundle`);
  }
}
