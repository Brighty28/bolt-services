# Bolt Services Ltd — Website

One-page website for Bolt Services Ltd — Project & CDM Site Management, UK.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Styling | SASS (7-1 architecture), compiled to CSS |
| Frontend | Vanilla JavaScript |
| Server | Node.js (static files + contact form) |
| CMS | [Sanity.io](https://sanity.io) — project `773dau1s` |
| Email | Nodemailer (SMTP) |
| Deployment | Plesk + GitHub webhook |

---

## Getting Started (Local Development)

```bash
npm install
npm run dev
```

Site runs at `http://localhost:3000`. Content is fetched live from the Sanity CDN.

---

## Content Management

All content is managed through **Sanity Studio** — a hosted, authenticated back office.

### Accessing the Studio

```
https://bolt-services.sanity.studio
```

Log in with your Sanity account. Karl Jest should be invited as an Editor at:
`https://sanity.io/manage/project/773dau1s/members`

### Running the Studio Locally

```bash
cd studio
npm install
npm run dev
```

Studio runs at `http://localhost:3333`.

### Deploying the Studio

```bash
cd studio
npm run deploy
```

This pushes the studio to `https://bolt-services.sanity.studio`.

---

## One-time Seed (Data Migration)

To seed all content and images from `content/site-content.json` into Sanity:

```powershell
# Get a write token from https://sanity.io/manage/project/773dau1s/api → Tokens
$env:SANITY_WRITE_TOKEN="sk_your_token_here"; node scripts/sanity-seed.js
```

After seeding, open Sanity Studio and **Publish** all draft documents.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Build + watch SASS + start server |
| `npm start` | Build + start server |
| `npm run build` | Compile SASS and copy files to `dist/` |
| `npm run deploy` | Clean install + build (used by Plesk post-deploy) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Send contact form email via SMTP |

---

## Environment Variables (Plesk)

Set these in Plesk → Node.js → Environment Variables:

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | Email server hostname (e.g. `send.one.com`) |
| `SMTP_PORT` | Email port (e.g. `587`) |
| `SMTP_USER` | Email account username |
| `SMTP_PASS` | Email account password |
| `SMTP_FROM` | Sender address for contact form emails |
| `SMTP_TO` | Destination address for contact enquiries |
| `NODE_ENV` | Set to `production` |

---

## Project Structure

```
bolt-services/
├── content/
│   └── site-content.json      # Seed data (source of truth is now Sanity)
├── src/
│   ├── index.html              # Main HTML page
│   ├── assets/                 # Local images (logos, team photos, hero bg)
│   ├── js/
│   │   └── app.js              # Content renderer — fetches from Sanity CDN
│   └── sass/                   # 7-1 SASS architecture
├── studio/                     # Sanity Studio (CMS back office)
│   ├── sanity.config.js        # Studio config (projectId, dataset, plugins)
│   ├── structure.js            # Custom sidebar navigation
│   └── schemas/                # Content type definitions
│       ├── siteSettings.js     # Singleton: meta, hero, about, contact, social
│       ├── service.js
│       ├── teamMember.js
│       ├── testimonial.js
│       ├── insurance.js
│       ├── partnership.js
│       └── blogPost.js
├── scripts/
│   ├── copy.js                 # Build script
│   └── sanity-seed.js          # One-time data migration to Sanity
├── server.js                   # Node.js server (static files + contact form)
├── docs/                       # Wiki documentation
└── dist/                       # Built output (git-ignored)
```

---

## Deploying to Plesk (The Hosting Heroes)

### Prerequisites

1. Node.js Toolkit enabled on your Plesk domain
2. Git extension available in Plesk

### Setup Steps

1. **Connect the repo** — Plesk → Websites & Domains → your domain → Git → add `https://github.com/Brighty28/bolt-services.git`, branch `main`, enable automatic deployment.

2. **Copy the webhook URL** from Plesk's Git settings and add it in GitHub under Settings → Webhooks (push events only, `application/json`).

3. **Configure Node.js** — Plesk → Node.js:
   - Application startup file: `server.js`
   - Application mode: `production`

4. **Set environment variables** — see table above.

5. **Post-deploy action** in Plesk Git settings:
   ```bash
   export PATH="/opt/plesk/node/18/bin:$PATH"
   cd $DEPLOYDIR && npm run deploy
   touch tmp/restart.txt
   ```

### Deploy Flow

```
git push main → GitHub webhook → Plesk pulls → npm run deploy → Node.js restarts
```

> Content changes made in Sanity Studio take effect immediately — no deployment needed.

---

## Site Sections

| # | Section | Dark bg |
|---|---------|---------|
| 1 | Hero | ✓ |
| 2 | About Bolt Services | |
| 3 | Our Services | ✓ |
| 4 | Project Management Methodology | |
| 5 | Industries We Serve | |
| 6 | Client Partnerships | |
| 7 | Company Insurances | ✓ |
| 8 | Client Testimonials | |
| 9 | Meet the Team | |
| 10 | News & Insights (Blog) | |
| 11 | Contact & Footer | ✓ |
