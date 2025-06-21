import { build } from 'esbuild';
import nodeExternalsPlugin from 'esbuild-plugin-node-externals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Setup paths
const distDir = path.resolve('dist');
const artifactsDir = path.resolve('artifacts');
const zipFile = path.join(artifactsDir, 'api.bcfreeflight.com.zip');
const nestedDir = path.join(distDir, 'nodejs', 'node_modules', 'bcfreeflight');

// Clean old dist & artifacts
if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true, force: true });
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir);
if (fs.existsSync(zipFile)) fs.rmSync(zipFile);

// Create nested directory structure
fs.mkdirSync(nestedDir, { recursive: true });

// Run esbuild
await build({
    entryPoints: ['src/index.ts'],
    outfile: path.join(nestedDir, 'index.mjs'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    sourcemap: false,
    external: [
        '@aws-sdk/client-dynamodb',
        '@aws-sdk/util-dynamodb',
        '@aws-sdk/lib-dynamodb',
        'nanoid'
    ],
    plugins: [nodeExternalsPlugin()],
    keepNames: true,
    minify: false,
    legalComments: 'inline',
    // Add these options to ensure proper ESM export handling
    splitting: false,
    treeShaking: true
});

// Create package.json for the bcfreeflight package
const packageJsonContent = {
    name: 'bcfreeflight',
    version: '1.0.0',
    type: 'module',
    main: 'index.mjs',
    exports: {
        '.': {
            'import': './index.mjs',
            'default': './index.mjs'
        }
    }
};

fs.writeFileSync(
    path.join(nestedDir, 'package.json'),
    JSON.stringify(packageJsonContent, null, 2)
);

console.log(`✅ Created package.json for bcfreeflight module`);

// Zip the result
execSync(`cd ${distDir} && zip -r ${zipFile} .`, { stdio: 'inherit' });

console.log(`✅ Build complete. Zip created at: ${zipFile}`);