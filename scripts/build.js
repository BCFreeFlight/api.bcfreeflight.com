import { build } from 'esbuild';
import nodeExternalsPlugin from 'esbuild-plugin-node-externals';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distDir = path.resolve('dist');
const artifactsDir = path.resolve('artifacts');
const zipFile = path.join(artifactsDir, 'api.bcfreeflight.com.zip');

// Step 1: Clean dist and artifacts
if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true, force: true });
if (fs.existsSync(zipFile)) fs.rmSync(zipFile);
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir);

// Step 2: Bundle the app
await build({
    entryPoints: ['src/index.mjs'],
    outfile: path.join(distDir, 'bundle.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    sourcemap: false,
    external: [
        '@aws-sdk/client-dynamodb',
        '@aws-sdk/util-dynamodb',
        '@aws-sdk/lib-dynamodb',
        'nanoid'
    ],
    plugins: [nodeExternalsPlugin()],
});

// Step 3: Zip the dist into artifacts
execSync(`cd ${distDir} && zip -r ${zipFile} .`, { stdio: 'inherit' });

console.log(`✅ Build complete. Zip file created at: ${zipFile}`);