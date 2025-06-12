import { build } from 'esbuild';
import nodeExternalsPlugin from 'esbuild-plugin-node-externals';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Setup paths
const distDir = path.resolve('dist');
const artifactsDir = path.resolve('artifacts');
const zipFile = path.join(artifactsDir, 'api.bcfreeflight.com.zip');

// Clean old dist & artifacts
if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true, force: true });
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir);
if (fs.existsSync(zipFile)) fs.rmSync(zipFile);

// Run esbuild
await build({
    entryPoints: ['src/index.ts'],
    outfile: path.join(distDir, 'bundle.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18', // Adjust for your runtime
    sourcemap: false,
    external: [
        '@aws-sdk/client-dynamodb',
        '@aws-sdk/util-dynamodb',
        '@aws-sdk/lib-dynamodb',
        'nanoid'
    ],
    plugins: [nodeExternalsPlugin()],
});

// Zip the result
execSync(`cd ${distDir} && zip -r ${zipFile} .`, { stdio: 'inherit' });

console.log(`✅ Build complete. Zip created at: ${zipFile}`);