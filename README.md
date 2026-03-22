# Bolt Industrial Engineering Services

One-page website for Bolt Industrial Engineering Services Ltd — providing electrical and mechanical engineering services across the UK.

## Tech Stack

- **SASS** with 7-1 architecture
- **Built-in CMS** admin panel for managing all site content and images
- **Node.js server** with content save and image upload APIs
- **Vanilla JS** for dynamic content rendering
- **Responsive** mobile-first design

## Getting Started

```bash
# Install dependencies
npm install

# Build and start the server (with CMS support)
npm start

# Or run in development mode (SASS watch + server)
npm run dev
```

The site runs at `http://localhost:3000` and the CMS admin panel at `http://localhost:3000/admin/`.

## CMS Admin Panel

Access the content management system at `/admin/` to edit all site content without touching code.

### Content Editing

- **Hero** — headline, subheadline, background image, CTA button
- **About** — heading, intro text, description, stat highlights
- **Services** — section heading/intro, add/remove/edit service cards with icons
- **Industries** — add/remove industry tags
- **Testimonials** — add/remove client quotes with author and company
- **Contact** — phone, email, address, intro text

### Media Library

- **Upload** images via drag & drop or file browser (JPG, PNG, SVG, WebP, GIF)
- **Select** uploaded images for the hero background directly from the CMS
- **Delete** images from the media library
- Max file size: 10MB

### How It Works

All content is stored in `content/site-content.json`. The CMS admin panel reads and writes to this file via the Node.js server API. The frontend JavaScript fetches this JSON at runtime and renders every section dynamically.

## Authentication

The CMS admin panel and all API endpoints are protected by HTTP Basic Auth in production.

### Setup

Set two environment variables on your server (in Plesk: Node.js settings > Environment Variables):

```
CMS_ADMIN_USER=your-username
CMS_ADMIN_PASS=your-secure-password
```

When both are set, visiting `/admin/` or calling any `/api/` endpoint will prompt for credentials. When both are empty (local development), auth is disabled.

See `.env.example` for all available environment variables.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Build + start server on port 3000 (CMS saving enabled) |
| `npm run dev` | Build + watch SASS + start server (for development) |
| `npm run build` | Compile SASS and copy all files to `dist/` |
| `npm run deploy` | Clean install + build (used by Plesk post-deploy action) |
| `npm run production` | Start server in production mode (no build, NODE_ENV=production) |
| `npm run serve` | Serve `dist/` statically (no CMS save support) |
| `npm run sass` | Compile SASS only |

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/save-content` | Save site content JSON |
| `POST` | `/api/upload-image` | Upload an image (multipart form-data) |
| `GET` | `/api/images` | List all uploaded images |
| `DELETE` | `/api/images/:filename` | Delete an image |
| `POST` | `/api/contact` | Send a contact form email via SMTP |

## Project Structure

```
bolt-services/
├── content/
│   └── site-content.json      # CMS content (single source of truth)
├── src/
│   ├── index.html              # Main HTML page
│   ├── admin/                  # CMS admin panel
│   │   ├── index.html          # Admin UI
│   │   ├── cms.js              # CMS logic (editors, uploaders)
│   │   └── styles.css          # Admin styles
│   ├── assets/                 # Images (logo, hero background)
│   ├── js/
│   │   └── app.js              # Content renderer & UI interactions
│   └── sass/                   # 7-1 SASS architecture
│       ├── abstracts/          # Variables, mixins, functions
│       ├── base/               # Reset, typography, base styles
│       ├── components/         # Buttons, cards, testimonials
│       ├── layout/             # Header, hero, grid, contact, footer
│       ├── pages/              # Home page specifics
│       ├── themes/             # Default theme
│       ├── vendors/            # Normalize
│       └── main.scss           # Main entry point
├── server.js                   # Node.js server (static files + CMS API)
├── scripts/
│   └── copy.js                 # Build script (copies files to dist/)
├── dist/                       # Built output
├── package.json
└── README.md
```

## Deploying to Plesk (The Hosting Heroes)

### Prerequisites

1. **Node.js Toolkit** enabled on your Plesk domain
2. **SSH access** set to `/bin/bash` for the domain's system user
3. **Git extension** available in Plesk

### Setup Steps

1. **Connect the repo** — In Plesk: Websites & Domains > your-domain > Git. Add the SSH URL `git@github.com:Brighty28/bolt-services.git`. Copy Plesk's generated SSH key and add it as a Deploy Key in GitHub.

2. **Set the branch** — Point Plesk at your `main` branch and enable automatic deployment.

3. **Add the webhook** — Copy the Webhook URL from Plesk's Git settings and add it in GitHub under Settings > Webhooks (push events only).

4. **Configure Node.js** — In Plesk: Websites & Domains > your-domain > Node.js:
   - Application root: `/`
   - Startup file: `server.js`
   - Document root: `/dist`
   - Application mode: `production`

5. **Set environment variables** — In the Node.js settings:
   - `CMS_ADMIN_USER` = your chosen username
   - `CMS_ADMIN_PASS` = a strong password
   - `SMTP_HOST` = `send.one.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `assist@boltservices.co.uk`
   - `SMTP_PASS` = your SMTP password
   - `SMTP_FROM` = `assist@boltservices.co.uk`
   - `SMTP_TO` = `info@boltservices.co.uk` (or wherever you want enquiries delivered)

6. **Post-deploy actions** — In Git > Repository Settings > Enable additional deploy actions:
   ```bash
   export PATH="/opt/plesk/node/18/bin:$PATH"
   cd $DEPLOYDIR
   npm run deploy
   touch tmp/restart.txt
   ```

### Deploy Flow

```
Push to main → GitHub webhook → Plesk pulls code → npm run deploy → Node.js restarts
```

## Site Sections

- **Hero** — full-viewport with industrial background image, headline, and CTA
- **About** — company intro with stat highlights
- **Services** — 6 service cards (Project Management, Electrical, Mechanical, H&S, Labour, Lean)
- **Industries** — 11 industry tags (FMCG, Food, Cement, Refrigeration, etc.)
- **Testimonials** — client quotes (Omya UK, Integral Refrigeration)
- **Contact** — phone, email, address + contact form
