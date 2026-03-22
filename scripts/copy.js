const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Ensure dist directories exist
fs.mkdirSync('dist/js', { recursive: true });
fs.mkdirSync('dist/css', { recursive: true });

// Copy files
fs.copyFileSync('src/index.html', 'dist/index.html');
copyRecursive('content', 'dist/content');
fs.copyFileSync('src/js/app.js', 'dist/js/app.js');

console.log('Files copied to dist/');
