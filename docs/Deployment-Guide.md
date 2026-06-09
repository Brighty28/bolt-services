# Deployment Guide

This guide covers how to deploy the Bolt Services website to production using Plesk and GitHub.

---

## Architecture Overview

```
Your machine / Claude Code
        │
        │  git push origin main
        ▼
  GitHub Repository
  (Brighty28/bolt-services)
        │
        │  webhook → Plesk pulls & runs post-deploy script
        ▼
   Plesk Hosting
   (The Hosting Heroes)
        │
        │  Node.js app restart
        ▼
  Live Website
  (boltservices.co.uk)
```

When you push code to the `main` branch on GitHub, Plesk automatically pulls the changes, runs the build script, and restarts the Node.js application.

> **Content changes** made in Sanity Studio are live instantly — no deployment needed.

---

## Prerequisites

Before the site can go live, confirm the following with The Hosting Heroes:

- [ ] Node.js extension is enabled on your Plesk hosting plan (Node.js 18+)
- [ ] The domain DNS is pointing to the Plesk server
- [ ] An SSL certificate is configured for your domain (for HTTPS)

---

## Initial Setup on Plesk

### 1. Enable Node.js

1. Log in to Plesk → **Websites & Domains** → your domain → **Node.js**
2. Click **Enable Node.js**
3. Set the following:
   - **Application startup file:** `server.js`
   - **Application mode:** `production`

### 2. Upgrade Node.js Version

The app requires Node.js 18+. If the dashboard shows an older version (e.g. 10.x):

1. Click the version number on the Node.js dashboard
2. Select **18** (or the highest available)
3. Save / Apply

If no newer version is available, contact The Hosting Heroes to enable Node.js 18+ on the plan.

### 3. Set Environment Variables via `.env` File

The server reads SMTP credentials from environment variables. If Plesk's Node.js dashboard does not show an Environment Variables section, create a `.env` file directly on the server using **File Manager**:

1. In Plesk, go to **Files** (or **File Manager** under your domain)
2. Navigate to `/httpdocs` (the application root)
3. Click **New File**, name it `.env`
4. Paste the following, replacing each value with your real credentials:

```
SMTP_HOST=send.one.com
SMTP_PORT=587
SMTP_USER=contact@boltservices.co.uk
SMTP_PASS=yourpassword
SMTP_FROM=contact@boltservices.co.uk
SMTP_TO=karl@boltservices.co.uk
NODE_ENV=production
```

5. Save the file

> **Security:** The `.env` file is listed in `.gitignore` and will never be committed to GitHub. It exists only on the server. Never paste credentials into any file that is tracked by git.

### 3. Connect GitHub via Git

1. In Plesk, go to **Git** (under your domain)
2. Click **Add Repository**
3. Enter: `https://github.com/Brighty28/bolt-services.git`
4. Set deploy branch to `main`
5. Tick **Deploy automatically when changes are pushed to repository**
6. Copy the **webhook URL** Plesk provides

### 4. Add the Webhook on GitHub

1. Go to `https://github.com/Brighty28/bolt-services/settings/hooks`
2. Click **Add webhook**
3. Paste the Plesk webhook URL into **Payload URL**
4. Set **Content type** to `application/json`
5. Select **Just the push event**
6. Click **Add webhook**

### 5. Set the Post-Deploy Script

In Plesk → **Git** → your repository settings, find **Additional deploy actions** (sometimes labelled "Post-receive" or in the repository's Advanced settings). Add:

```bash
export PATH="/opt/plesk/node/18/bin:$PATH"
cd $DEPLOYDIR && npm run deploy
touch tmp/restart.txt
```

`npm run deploy` runs `npm ci && npm run build`, which installs dependencies and compiles SASS to `dist/`. The `touch tmp/restart.txt` signals Plesk to restart the Node.js process.

> If Plesk uses a different Node.js version path (e.g. Node 20), adjust the PATH line accordingly. The Hosting Heroes can confirm the correct path.

---

## Deploying Updates

Once setup is complete, deploying is simply:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

Plesk will automatically:
1. Pull the new code from GitHub
2. Run `npm ci && npm run build` (compiles SASS, copies files to `dist/`)
3. Restart the Node.js server
4. Serve the updated site

This typically takes 30–60 seconds.

---

## Content Updates (No Deployment Needed)

Content changes made in **Sanity Studio** appear live within seconds of publishing — the site fetches from the Sanity CDN on every page load. No git push, no deployment.

Go to: `https://bolt-services.sanity.studio`

---

## Manual Deployment (SSH)

If the webhook isn't set up or you need to force a deployment:

```bash
# SSH into the server, then:
cd /var/www/vhosts/boltservices.co.uk/httpdocs
git pull origin main
npm run deploy
touch tmp/restart.txt
```

---

## File Structure on the Server

```
httpdocs/
├── server.js              # Node.js entry point (static files + contact form)
├── package.json
├── src/
│   ├── index.html
│   ├── assets/            # Images (logos, team photos, hero bg)
│   └── js/app.js          # Fetches content from Sanity CDN
├── dist/                  # Compiled output (built by npm run build)
│   ├── index.html
│   ├── assets/
│   └── css/style.css
└── scripts/               # Build and seed utilities
```

> The `studio/` directory (Sanity Studio) is deployed separately via `sanity deploy` and hosted at `bolt-services.sanity.studio` — it is **not** part of the Plesk deployment.

---

## Verifying the Deployment

After deploying, check:

1. **Homepage loads** — visit `https://boltservices.co.uk`
2. **Content visible** — sections (hero, services, team, etc.) all populated from Sanity
3. **Contact form works** — submit a test message and confirm receipt
4. **Mobile view** — check on a phone or browser dev tools
5. **HTTPS** — confirm the padlock shows in the browser address bar

---

## Rollback

If a deployment causes an issue, revert on GitHub and push — Plesk will auto-deploy the revert. Or via SSH:

```bash
git log --oneline -5
git revert HEAD        # creates a new revert commit (safe)
git push origin main
```
