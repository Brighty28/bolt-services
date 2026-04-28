const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure dist/js directory exists
fs.mkdirSync('dist/js', { recursive: true });

// Bundle the analytics initialization
esbuild.build({
  entryPoints: ['src/js/analytics.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  outfile: 'dist/js/analytics.js',
  platform: 'browser',
}).then(() => {
  console.log('Analytics script bundled successfully');
}).catch((error) => {
  console.error('Analytics bundling failed:', error);
  process.exit(1);
});
