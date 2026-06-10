const sass = require('sass');
const fs = require('fs');

fs.mkdirSync('dist/css', { recursive: true });

try {
  const result = sass.compile('src/sass/main.scss', { style: 'compressed' });
  fs.writeFileSync('dist/css/style.css', result.css);
  console.log('SASS compiled to dist/css/style.css');
} catch (e) {
  console.error('SASS error:', e.message);
  process.exit(1);
}
