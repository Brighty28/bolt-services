const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const CONTENT_FILE = path.join(__dirname, 'content', 'site-content.json');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const ASSETS_SRC = path.join(__dirname, 'src', 'assets');
const ASSETS_DIST = path.join(DIST_DIR, 'assets');
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

const server = http.createServer((req, res) => {
  // CORS-safe JSON response helper
  const jsonResponse = (code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Handle CMS save endpoint
  if (req.method === 'POST' && req.url === '/api/save-content') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const content = JSON.parse(body);
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
        const distContent = path.join(DIST_DIR, 'content', 'site-content.json');
        fs.writeFileSync(distContent, JSON.stringify(content, null, 2));
        jsonResponse(200, { success: true });
      } catch (err) {
        jsonResponse(500, { error: err.message });
      }
    });
    return;
  }

  // Handle image upload
  if (req.method === 'POST' && req.url === '/api/upload-image') {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      jsonResponse(400, { error: 'Expected multipart/form-data' });
      return;
    }

    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      jsonResponse(400, { error: 'No boundary found' });
      return;
    }

    const chunks = [];
    let totalSize = 0;

    req.on('data', chunk => {
      totalSize += chunk.length;
      if (totalSize > MAX_UPLOAD_SIZE) {
        req.destroy();
        jsonResponse(413, { error: 'File too large (max 10MB)' });
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const parsed = parseMultipart(buffer, boundary);

        if (!parsed) {
          jsonResponse(400, { error: 'Could not parse upload' });
          return;
        }

        // Sanitise filename
        const safeName = parsed.filename
          .replace(/[^a-zA-Z0-9._-]/g, '-')
          .toLowerCase();

        const allowedExts = ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'];
        const ext = path.extname(safeName);
        if (!allowedExts.includes(ext)) {
          jsonResponse(400, { error: `File type not allowed: ${ext}` });
          return;
        }

        // Save to both src/assets and dist/assets
        fs.mkdirSync(ASSETS_SRC, { recursive: true });
        fs.mkdirSync(ASSETS_DIST, { recursive: true });
        fs.writeFileSync(path.join(ASSETS_SRC, safeName), parsed.data);
        fs.writeFileSync(path.join(ASSETS_DIST, safeName), parsed.data);

        jsonResponse(200, { success: true, filename: safeName, path: `assets/${safeName}` });
      } catch (err) {
        jsonResponse(500, { error: err.message });
      }
    });
    return;
  }

  // List uploaded images
  if (req.method === 'GET' && req.url === '/api/images') {
    try {
      fs.mkdirSync(ASSETS_DIST, { recursive: true });
      const files = fs.readdirSync(ASSETS_DIST)
        .filter(f => /\.(jpg|jpeg|png|svg|webp|gif)$/i.test(f))
        .map(f => ({
          filename: f,
          path: `assets/${f}`,
          size: fs.statSync(path.join(ASSETS_DIST, f)).size
        }));
      jsonResponse(200, { images: files });
    } catch (err) {
      jsonResponse(500, { error: err.message });
    }
    return;
  }

  // Delete an image
  if (req.method === 'DELETE' && req.url.startsWith('/api/images/')) {
    const filename = decodeURIComponent(req.url.split('/api/images/')[1]);
    const safeName = path.basename(filename);

    // Prevent deleting the logo
    if (safeName === 'logo.svg') {
      jsonResponse(400, { error: 'Cannot delete the site logo' });
      return;
    }

    try {
      const srcFile = path.join(ASSETS_SRC, safeName);
      const distFile = path.join(ASSETS_DIST, safeName);
      if (fs.existsSync(srcFile)) fs.unlinkSync(srcFile);
      if (fs.existsSync(distFile)) fs.unlinkSync(distFile);
      jsonResponse(200, { success: true });
    } catch (err) {
      jsonResponse(500, { error: err.message });
    }
    return;
  }

  // Serve static files from dist/
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // If path is a directory, serve index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// ---- Multipart form-data parser ----

function parseMultipart(buffer, boundary) {
  const boundaryBuf = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = buffer.indexOf(boundaryBuf);

  while (start !== -1) {
    start += boundaryBuf.length;
    // Skip \r\n after boundary
    if (buffer[start] === 0x0d && buffer[start + 1] === 0x0a) start += 2;
    // Check for closing boundary (--)
    if (buffer[start] === 0x2d && buffer[start + 1] === 0x2d) break;

    const nextBoundary = buffer.indexOf(boundaryBuf, start);
    if (nextBoundary === -1) break;

    const partBuf = buffer.slice(start, nextBoundary);

    // Split headers from body at \r\n\r\n
    const headerEnd = partBuf.indexOf('\r\n\r\n');
    if (headerEnd === -1) { start = nextBoundary; continue; }

    const headerStr = partBuf.slice(0, headerEnd).toString();
    // Body ends 2 bytes before boundary (\r\n before boundary)
    const body = partBuf.slice(headerEnd + 4, partBuf.length - 2);

    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    const nameMatch = headerStr.match(/name="([^"]+)"/);

    if (filenameMatch) {
      return {
        fieldName: nameMatch ? nameMatch[1] : 'file',
        filename: filenameMatch[1],
        data: body
      };
    }

    start = nextBoundary;
  }

  return null;
}

server.listen(PORT, () => {
  console.log(`Bolt Services running at http://localhost:${PORT}`);
  console.log(`CMS admin panel at http://localhost:${PORT}/admin/`);
});
