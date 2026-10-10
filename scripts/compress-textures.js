#!/usr/bin/env node
/**
 * Texture Compression Utility Script
 * Converts high-resolution JPEG/PNG textures to KTX2 (Basis Universal / UASTC)
 * for GPU texture compression, reducing memory footprint and load times.
 *
 * Requirements:
 * - toktx CLI (from KTX-Software: https://github.com/KhronosGroup/KTX-Software)
 *   OR basisu CLI (from Basis Universal: https://github.com/BinomialLLC/basis_universal)
 *
 * Usage:
 *   node scripts/compress-textures.js
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { resolve, join, extname } from 'path';

const ASSETS_DIR = resolve(process.cwd(), 'public/assets');

console.log('--- KTX2 Texture Compression Pipeline ---');
console.log(`Scanning assets in: ${ASSETS_DIR}\n`);

if (!existsSync(ASSETS_DIR)) {
  console.error(`Assets directory not found at: ${ASSETS_DIR}`);
  process.exit(1);
}

const files = readdirSync(ASSETS_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

if (files.length === 0) {
  console.log('No image assets found to compress.');
  process.exit(0);
}

console.log(`Found ${files.length} textures to process:`);
files.forEach((f) => console.log(`  - ${f}`));

// Check for available CLI tools
let tool = null;
try {
  execSync('toktx --version', { stdio: 'ignore' });
  tool = 'toktx';
} catch {
  try {
    execSync('basisu -version', { stdio: 'ignore' });
    tool = 'basisu';
  } catch {
    tool = null;
  }
}

if (!tool) {
  console.log('\n[NOTICE] Neither "toktx" nor "basisu" CLI was detected on your system PATH.');
  console.log('The application automatically runs in seamless fallback mode using standard JPEG/PNG textures.');
  console.log('\nTo generate .ktx2 compressed textures for production deployments:');
  console.log('  1. Install KTX-Software (https://github.com/KhronosGroup/KTX-Software/releases)');
  console.log('  2. Run:');
  files.forEach((f) => {
    const ext = extname(f);
    const out = f.replace(new RegExp(`\\${ext}$`, 'i'), '.ktx2');
    console.log(`     toktx --bcmp --genmipmap "public/assets/${out}" "public/assets/${f}"`);
  });
  process.exit(0);
}

console.log(`\nCompressing textures using ${tool}...`);
for (const f of files) {
  const ext = extname(f);
  const out = f.replace(new RegExp(`\\${ext}$`, 'i'), '.ktx2');
  const srcPath = join(ASSETS_DIR, f);
  const dstPath = join(ASSETS_DIR, out);

  try {
    if (tool === 'toktx') {
      execSync(`toktx --bcmp --genmipmap "${dstPath}" "${srcPath}"`, { stdio: 'inherit' });
    } else {
      execSync(`basisu -ktx2 "${srcPath}" -output_path "${ASSETS_DIR}"`, { stdio: 'inherit' });
    }
    console.log(`✓ Generated: ${out}`);
  } catch (err) {
    console.error(`✗ Failed to compress ${f}:`, err);
  }
}

console.log('\nKTX2 compression pipeline completed.');
