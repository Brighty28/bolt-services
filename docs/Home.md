# Bolt Services — Website Documentation

Welcome to the Bolt Services website documentation. This wiki covers everything you need to know to manage the site content, upload images, and deploy updates.

---

## Pages

| Page | Description |
|------|-------------|
| [Website Sections](Website-Sections.md) | Walkthrough of all 11 sections on the website |
| [CMS Guide](CMS-Guide.md) | How to log in to Sanity Studio and manage all site content |
| [Deployment Guide](Deployment-Guide.md) | How to deploy the site to production (Plesk) |

---

## Quick Reference

| Item | Value |
|------|-------|
| **CMS Studio (hosted)** | `https://bolt-services.sanity.studio` |
| **CMS Studio (local)** | `http://localhost:3333` (run `cd studio && npm run dev`) |
| **Sanity Project** | `773dau1s` — `production` dataset |
| **Manage access / tokens** | `https://sanity.io/manage/project/773dau1s` |
| **Site (local dev)** | `http://localhost:3000` |
| **Contact Email** | karl@boltservices.co.uk |
| **Phone** | 07885 729188 |
| **Git Repository** | `Brighty28/bolt-services` — deploy branch `main` |

---

## How Content Works

```
Sanity Studio (back office)
        │
        │  Publish content
        ▼
  Sanity CDN (cloud)
        │
        │  GROQ query on page load
        ▼
  Website (visitor's browser)
```

Content changes in Sanity Studio are live within seconds of publishing — no deployment required. Code changes (styling, layout, new features) require a git push to trigger the Plesk deployment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Styling | SASS (7-1 architecture), compiled to CSS |
| Frontend | Vanilla JavaScript (no frameworks) |
| Server | Node.js with http module |
| CMS | Sanity.io (headless, API-based) |
| Email | Nodemailer (SMTP) |
| Deployment | Plesk Git integration + GitHub webhook |

---

## One-Time Seed (First Setup)

If content needs to be reseeded from the local JSON file:

```powershell
# From the project root
$env:SANITY_WRITE_TOKEN="sk_your_editor_token"; node scripts/sanity-seed.js
```

Create a write token at: `https://sanity.io/manage/project/773dau1s/api` → Tokens → Add API Token (Editor role).

After running the seed, open Sanity Studio and publish all draft documents.
