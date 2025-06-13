import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to extract JSDoc comments from a file
function extractJSDocComments(filePath: string): Record<string, string> {
    const content = fs.readFileSync(filePath, 'utf8');
    const comments: Record<string, string> = {};

    // Extract interface method JSDoc comments
    const interfaceMethodRegex = /\/\*\*[\s\S]*?\*\/\s*(\w+)\s*\(/g;
    let match;

    while ((match = interfaceMethodRegex.exec(content)) !== null) {
        const methodName = match[1];
        const comment = match[0].split('(')[0].trim();
        comments[methodName] = comment;
    }

    // Extract interface class JSDoc comments
    const interfaceClassRegex = /\/\*\*[\s\S]*?\*\/\s*export\s+interface\s+(\w+)/g;
    while ((match = interfaceClassRegex.exec(content)) !== null) {
        const interfaceName = match[1];
        const comment = match[0].split('export')[0].trim();
        comments[interfaceName] = comment;
    }

    return comments;
}

// Function to process a file and replace @inheritdoc tags
function processFile(filePath: string, interfaceComments: Record<string, Record<string, string>>): void {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find which interfaces this class implements
    const implementsRegex = /class\s+(\w+)\s+implements\s+([\w,\s]+)/g;
    let implementsMatch;
    const implementedInterfaces: string[] = [];

    while ((implementsMatch = implementsRegex.exec(content)) !== null) {
        const interfaces = implementsMatch[2].split(',').map(i => i.trim());
        implementedInterfaces.push(...interfaces);
    }

    // Replace @inheritdoc tags in class comments
    for (const interfaceName of implementedInterfaces) {
        if (interfaceComments[interfaceName]) {
            const classInheritDocRegex = /\/\*\*\s*\n\s*\*\s*@inheritdoc\s*\n\s*\*\/\s*export\s+class/g;
            content = content.replace(classInheritDocRegex, (match) => {
                return interfaceComments[interfaceName][interfaceName] + '\nexport class';
            });
        }
    }

    // Replace @inheritdoc tags in method comments
    for (const interfaceName of implementedInterfaces) {
        if (interfaceComments[interfaceName]) {
            const methodInheritDocRegex = /\/\*\*\s*\n\s*\*\s*@inheritdoc\s*\n\s*\*\/\s*(\w+)\s*\(/g;
            content = content.replace(methodInheritDocRegex, (match, methodName) => {
                if (interfaceComments[interfaceName][methodName]) {
                    return interfaceComments[interfaceName][methodName] + '\n' + methodName + '(';
                }
                return match;
            });
        }
    }

    // Also handle case-insensitive variant @inheritDoc
    for (const interfaceName of implementedInterfaces) {
        if (interfaceComments[interfaceName]) {
            const methodInheritDocRegex = /\/\*\*\s*\n\s*\*\s*@inheritDoc\s*\n\s*\*\/\s*(\w+)\s*\(/g;
            content = content.replace(methodInheritDocRegex, (match, methodName) => {
                if (interfaceComments[interfaceName][methodName]) {
                    return interfaceComments[interfaceName][methodName] + '\n' + methodName + '(';
                }
                return match;
            });
        }
    }

    fs.writeFileSync(filePath, content);
}

// Main function to process all TypeScript files
function processAllFiles(): void {
    // Get all interface files
    const interfaceFiles = glob.sync('src/interfaces/*.ts');
    const interfaceComments: Record<string, Record<string, string>> = {};

    // Extract comments from interface files
    for (const file of interfaceFiles) {
        const interfaceName = path.basename(file, '.ts');
        interfaceComments[interfaceName] = extractJSDocComments(file);
    }

    // Process all implementation files
    const implementationFiles = glob.sync('src/**/*.ts', { ignore: 'src/interfaces/*.ts' });
    for (const file of implementationFiles) {
        processFile(file, interfaceComments);
    }

    console.log('✅ Processed @inheritdoc tags in all files');
}

// Run the processor
processAllFiles();
