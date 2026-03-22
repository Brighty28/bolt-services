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

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Build + start server on port 3000 (CMS saving enabled) |
| `npm run dev` | Build + watch SASS + start server (for development) |
| `npm run build` | Compile SASS and copy all files to `dist/` |
| `npm run serve` | Serve `dist/` statically (no CMS save support) |
| `npm run sass` | Compile SASS only |

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/save-content` | Save site content JSON |
| `POST` | `/api/upload-image` | Upload an image (multipart form-data) |
| `GET` | `/api/images` | List all uploaded images |
| `DELETE` | `/api/images/:filename` | Delete an image |

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

## Site Sections

- **Hero** — full-viewport with industrial background image, headline, and CTA
- **About** — company intro with stat highlights
- **Services** — 6 service cards (Project Management, Electrical, Mechanical, H&S, Labour, Lean)
- **Industries** — 11 industry tags (FMCG, Food, Cement, Refrigeration, etc.)
- **Testimonials** — client quotes (Omya UK, Integral Refrigeration)
- **Contact** — phone, email, address + contact form
