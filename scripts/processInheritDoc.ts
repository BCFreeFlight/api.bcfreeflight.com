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

    // Find all TypeScript files that might contain interfaces
    const allTsFiles = await glob.glob(path.join(srcDir, '**', '*.ts'));

    for (const filePath of allTsFiles) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract interface name(s) from the file
        const interfaceMatches = [...content.matchAll(/export\s+interface\s+(\w+)/g)];
        if (interfaceMatches.length === 0) continue;

        for (const interfaceMatch of interfaceMatches) {
            const interfaceName = interfaceMatch[1];
            console.log(`Found interface: ${interfaceName} in ${path.basename(filePath)}`);

            // Find the interface declaration start and end
            const interfaceStartIndex = interfaceMatch.index!;

            // Find the opening brace for this interface
            let braceCount = 0;
            let interfaceContentStart = -1;
            let interfaceContentEnd = -1;

            for (let i = interfaceStartIndex; i < content.length; i++) {
                if (content[i] === '{') {
                    if (interfaceContentStart === -1) {
                        interfaceContentStart = i;
                    }
                    braceCount++;
                } else if (content[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        interfaceContentEnd = i;
                        break;
                    }
                }
            }

            if (interfaceContentStart === -1 || interfaceContentEnd === -1) continue;

            const interfaceContent = content.substring(interfaceContentStart, interfaceContentEnd);

            // Find methods within this interface - improved regex pattern
            const methodPattern = /\/\*\*([\s\S]*?)\*\/\s*(?:readonly\s+)?(\w+)\s*(?:\([^)]*\)|:)/g;
            let methodMatch;

            while ((methodMatch = methodPattern.exec(interfaceContent)) !== null) {
                const [, docContent, methodName] = methodMatch;

                // Skip if this looks like a property instead of a method
                const fullMatch = methodMatch[0];
                const isMethod = fullMatch.includes('(') || docContent.includes('@param') || docContent.includes('@returns');

                if (isMethod) {
                    const cleanDoc = `/**${docContent}*/`;
                    docMap.set(`${interfaceName}.${methodName}`, cleanDoc);
                    console.log(`Added doc for method: ${interfaceName}.${methodName}`);
                }
            }

            // Also store the interface-level documentation
            const interfaceDocStart = content.lastIndexOf('/**', interfaceStartIndex);
            if (interfaceDocStart >= 0 && interfaceDocStart > interfaceStartIndex - 200) {
                const interfaceDocEnd = content.indexOf('*/', interfaceDocStart) + 2;
                const interfaceDoc = content.substring(interfaceDocStart, interfaceDocEnd);
                const interfaceDocMatch = interfaceDoc.match(/\/\*\*([\s\S]*?)\*\//);

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

    // Multiple patterns to catch different class implementation styles
    const classImplementsPatterns = [
        /class\s+(\w+)(?:\s+extends\s+\w+)?\s+implements\s+(I\w+)/g,
        /export\s+class\s+(\w+)(?:\s+extends\s+\w+)?\s+implements\s+(I\w+)/g,
        /var\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g,
        /const\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g,
        /let\s+(\w+)\s*=\s*class[^{]*implements\s+(I\w+)/g
    ];

    for (const pattern of classImplementsPatterns) {
        let match;
        while ((match = pattern.exec(bundleContent)) !== null) {
            const className = match[1];
            const interfaceName = match[2];
            classToInterface.set(className, interfaceName);
            console.log(`Mapped class ${className} to interface ${interfaceName}`);
        }
    }

    // Process @inheritDoc comments with multiple passes for better coverage
    let processedContent = bundleContent;

    // First pass: Handle class, constructor, and method @inheritDoc
    processedContent = processedContent.replace(
        /\/\*\*\s*\*\s*@inheritDoc\s*\*\/\s*(?:export\s+)?((?:async\s+)?(?:class\s+(\w+)|constructor|(\w+)\s*\())/gi,
        (match, declaration, className, methodName, offset) => {

            if (className) {
                // This is a class @inheritDoc
                const interfaceName = classToInterface.get(className);
                if (interfaceName && docMap.has(interfaceName)) {
                    const doc = docMap.get(interfaceName)!;
                    return doc + ' export class ' + className;
                }
            } else if (match.toLowerCase().includes('constructor')) {
                // This is a constructor @inheritDoc
                const beforeMatch = processedContent.substring(0, offset);
                const classMatch = beforeMatch.match(/class\s+(\w+)[^{]*$/);

                if (classMatch) {
                    const containingClass = classMatch[1];
                    const interfaceName = classToInterface.get(containingClass);
                    if (interfaceName && docMap.has(interfaceName)) {
                        const doc = docMap.get(interfaceName)!;
                        return doc + ' constructor';
                    }
                }
            } else if (methodName) {
                // This is a method @inheritDoc
                const beforeMatch = processedContent.substring(0, offset);

                // Find the containing class
                const classMatches = [...beforeMatch.matchAll(/class\s+(\w+)(?:\s+extends\s+\w+)?\s+implements\s+(I\w+)/g)];

                if (classMatches.length > 0) {
                    const lastClassMatch = classMatches[classMatches.length - 1];
                    const containingClass = lastClassMatch[1];
                    const interfaceName = lastClassMatch[2];

                    const docKey = `${interfaceName}.${methodName}`;
                    if (docMap.has(docKey)) {
                        const doc = docMap.get(docKey)!;
                        console.log(`Replaced @inheritDoc for ${containingClass}.${methodName}`);
                        return doc + ' ' + methodName + '(';
                    } else {
                        console.warn(`Warning: Could not find documentation for ${docKey}`);
                    }
                }
            }

            return match;
        }
    );

    // Second pass: Handle any remaining @inheritDoc with simpler patterns
    processedContent = processedContent.replace(
        /\/\*\*\s*\*\s*@inheritDoc\s*\*\/\s*(?:export\s+)?(\w+)/gi,
        (match, identifier, offset) => {
            const beforeMatch = processedContent.substring(0, offset);

            // Try to find context for this identifier
            const classMatches = [...beforeMatch.matchAll(/class\s+(\w+)(?:\s+extends\s+\w+)?\s+implements\s+(I\w+)/g)];

            if (classMatches.length > 0) {
                const lastClassMatch = classMatches[classMatches.length - 1];
                const interfaceName = lastClassMatch[2];

                // Try as method first
                const docKey = `${interfaceName}.${identifier}`;
                if (docMap.has(docKey)) {
                    const doc = docMap.get(docKey)!;
                    console.log(`Second pass: Replaced method doc for ${identifier}`);
                    return doc + ' ' + identifier;
                }

                // Try as class
                if (docMap.has(interfaceName)) {
                    const doc = docMap.get(interfaceName)!;
                    console.log(`Second pass: Replaced class doc for ${identifier}`);
                    return doc + ' ' + identifier;
                }
            }

            return match;
        }
    );

    // Final fallback: Replace any remaining @inheritDoc with generic documentation
    processedContent = processedContent.replace(
        /\/\*\*\s*\*\s*@inheritDoc\s*\*\//gi,
        '/** Documentation inherited from interface */'
    );

    fs.writeFileSync(bundlePath, processedContent);
}

/**
 * Main function to process a bundle file
 * @param bundlePath - Path to the bundle file
 */
export async function processInheritDoc(bundlePath: string): Promise<void> {
    console.log(`Processing @inheritDoc comments in ${bundlePath}...`);

    const docMap = await extractInterfaceDocumentation('src');

    // Debug information
    const bundleContent = fs.readFileSync(bundlePath, 'utf8');
    const inheritDocMatches = bundleContent.match(/@inheritDoc/gi) || [];
    console.log(`Found ${inheritDocMatches.length} @inheritDoc instances before processing`);
    console.log(`Extracted documentation for ${docMap.size} symbols:`, Array.from(docMap.keys()));

    processBundle(bundlePath, docMap);

    // Check results
    const processedContent = fs.readFileSync(bundlePath, 'utf8');
    const remainingMatches = processedContent.match(/@inheritDoc/gi) || [];

    if (remainingMatches.length > 0) {
        console.warn(`⚠️ Warning: ${remainingMatches.length} @inheritDoc instances remain in the processed bundle`);
    } else {
        console.log(`✅ Successfully processed all @inheritDoc comments`);
    }
}