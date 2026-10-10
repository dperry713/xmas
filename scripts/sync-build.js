import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const rootAssetsDir = path.join(rootDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
const docsAssetsDir = path.join(docsDir, 'assets');

// 1. Ensure directories exist
fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(rootAssetsDir, { recursive: true });
fs.mkdirSync(docsAssetsDir, { recursive: true });

// 2. Ensure .nojekyll in root, dist, and docs to disable Jekyll static processing
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

// 3. Read generated dist/index.html
const distHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Sync to docs/index.html and root index.html
fs.writeFileSync(path.join(docsDir, 'index.html'), distHtml);
fs.writeFileSync(path.join(rootDir, 'index.html'), distHtml);

// 4. Clean stale JS/CSS bundles in root assets and docs assets before copying
const cleanBundles = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f.startsWith('index-') && (f.endsWith('.js') || f.endsWith('.js.map') || f.endsWith('.css'))) {
        fs.unlinkSync(path.join(dir, f));
      }
    }
  }
};

cleanBundles(rootAssetsDir);
cleanBundles(docsAssetsDir);

// 5. Copy dist/assets to root assets and docs assets
fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });
fs.cpSync(distAssetsDir, docsAssetsDir, { recursive: true });

console.log('Build synchronized across root, docs, and dist successfully.');
