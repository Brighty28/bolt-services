require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// ---- SMTP Configuration ----
// Set these environment variables in production (Plesk Node.js settings)
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || '';
const SMTP_TO   = process.env.SMTP_TO   || '';

function isSmtpConfigured() {
  return SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM && SMTP_TO;
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  const jsonResponse = (code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // ---- Contact form ----
  if (req.method === 'POST' && req.url === '/api/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { name, email, subject, message } = JSON.parse(body);

        if (!name || !email || !message) {
          jsonResponse(400, { error: 'Name, email, and message are required' });
          return;
        }

        if (!isSmtpConfigured()) {
          jsonResponse(500, { error: 'Email is not configured on this server' });
          return;
        }

        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        await transporter.sendMail({
          from: SMTP_FROM,
          to: SMTP_TO,
          replyTo: email,
          subject: `[Bolt Services] ${subject || 'Contact Form Enquiry'} — from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
          html: `
            <h2>New Contact Form Enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <hr>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });

        jsonResponse(200, { success: true });
      } catch (err) {
        jsonResponse(500, { error: 'Failed to send email' });
      }
    });
    return;
  }

  // ---- Static file serving from dist/ ----
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath);

  // Prevent path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Bolt Services running at http://localhost:${PORT}`);
});
