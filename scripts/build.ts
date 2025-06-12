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

// --- Symlink creation for bcfreeflight.js ---
const symlinkTarget = path.join(distDir, 'bundle.js');
const symlinkLocation = path.join('node_modules', 'bcfreeflight.js');

// Remove existing symlink or file
if (fs.existsSync(symlinkLocation)) {
    try {
        const stat = fs.lstatSync(symlinkLocation);
        if (stat.isSymbolicLink() || stat.isFile()) {
            fs.unlinkSync(symlinkLocation);
        } else {
            throw new Error(`${symlinkLocation} exists and is not a file or symlink.`);
        }
    } catch (err) {
        console.error(`Failed to remove existing ${symlinkLocation}:`, err);
        process.exit(1);
    }
}

// Create new symlink
try {
    fs.symlinkSync(path.relative(path.dirname(symlinkLocation), symlinkTarget), symlinkLocation);
    console.log(`✅ Symlink created: ${symlinkLocation} -> ${symlinkTarget}`);
} catch (err) {
    console.error(`Failed to create symlink ${symlinkLocation} -> ${symlinkTarget}:`, err);
    process.exit(1);
}