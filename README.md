# Bolt Industrial Engineering Services

One-page website for Bolt Industrial Engineering Services Ltd — providing electrical and mechanical engineering services across the UK.

## Tech Stack

- **SASS** with 7-1 architecture
- **Headless CMS** content layer (JSON, swappable to Contentful/Strapi/Sanity)
- **Vanilla JS** for dynamic content rendering
- **Responsive** mobile-first design

## 7-1 SASS Architecture

```
src/sass/
├── abstracts/    # Variables, mixins, functions
├── base/         # Reset, typography, base styles
├── components/   # Buttons, cards, testimonials, industries, highlights
├── layout/       # Header, hero, grid, contact, footer
├── pages/        # Home page specifics
├── themes/       # Default theme (extensible)
├── vendors/      # Normalize
└── main.scss     # Main entry point
```

## Headless CMS

All site content lives in `content/site-content.json`. The JavaScript app fetches this file at runtime and renders every section dynamically.

To connect a headless CMS (Contentful, Strapi, Sanity, etc.), update the `CMS_ENDPOINT` constant in `src/js/app.js` to point at your CMS API.

## Getting Started

```bash
# Install dependencies
npm install

# Build the site (compiles SASS, copies assets to dist/)
npm run build

# Start dev server on http://localhost:3000 with SASS watch
npm run dev

# Or just serve the built site on http://localhost:3000
npm start
```

## Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run build`   | Compile SASS and copy HTML/JS/content to `dist/` |
| `npm run dev`     | Build + watch SASS + serve on port 3000          |
| `npm start`       | Build + serve on port 3000                       |
| `npm run sass`    | Compile SASS only                                |

## Site Sections

- **Hero** — Full-viewport gradient with CTA
- **About** — Company intro with stat highlights
- **Services** — 6 service cards (Project Management, Electrical, Mechanical, H&S, Labour, Lean)
- **Industries** — 11 industry tags (FMCG, Food, Cement, Refrigeration, etc.)
- **Testimonials** — Client quotes (Omya UK, Integral Refrigeration)
- **Contact** — Phone, email, address + contact form

## Project Structure

```
bolt-services/
├── content/
│   └── site-content.json    # CMS content layer
├── src/
│   ├── index.html           # Main HTML page
│   ├── js/
│   │   └── app.js           # CMS fetcher & renderer
│   └── sass/                # 7-1 SASS architecture
├── dist/                    # Built output (gitignored)
├── package.json
└── README.md
```
