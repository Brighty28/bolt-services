# Deployment Guide

This guide covers how to deploy the Bolt Services website to production using Plesk and GitHub.

---

## Architecture Overview

```
Your machine / Claude Code
        │
        │  git push
        ▼
  GitHub Repository
  (Brighty28/bolt-services)
        │
        │  webhook → Plesk pulls & builds
        ▼
   Plesk Hosting
   (The Hosting Heroes)
        │
        │  Node.js app restart
        ▼
  Live Website
  (yourdomain.co.uk)
```

When you push code to the `main` branch on GitHub, Plesk automatically pulls the changes, runs the build script, and restarts the Node.js application. The site is updated with zero downtime.

---

## Prerequisites

Before the site can go live, confirm the following with The Hosting Heroes:

- [ ] Node.js extension is enabled on your Plesk hosting plan (Node.js 18+)
- [ ] The domain DNS is pointing to the Plesk server
- [ ] An SSL certificate is configured for your domain (for HTTPS)

---

## Initial Setup on Plesk

### 1. Create the Node.js Application

1. Log in to your Plesk control panel
2. Go to **Websites & Domains** → your domain → **Node.js**
3. Set the following:
   - **Document root:** `/httpdocs` (or your domain root)
   - **Application root:** `/httpdocs` (where the code lives)
   - **Application startup file:** `server.js`
   - **Node.js version:** 18 (or latest available)

### 2. Connect GitHub via Git

1. In Plesk, go to **Git** (under your domain)
2. Click **Add Repository**
3. Enter the repository URL: `https://github.com/Brighty28/bolt-services.git`
4. Set the deploy branch to `main`
5. Tick **Deploy automatically when changes are pushed to repository**
6. Copy the **webhook URL** Plesk provides

### 3. Add the Webhook on GitHub

1. Go to `https://github.com/Brighty28/bolt-services/settings/hooks`
2. Click **Add webhook**
3. Paste the Plesk webhook URL into **Payload URL**
4. Set **Content type** to `application/json`
5. Select **Just the push event**
6. Click **Add webhook**

From this point on, every `git push` to `main` will trigger an automatic deployment.

### 4. Run the Build Script

The site requires a build step to compile SASS. In Plesk's Node.js settings, set:

- **Custom startup script** (or use `package.json` scripts):

```
npm install && npm run build
```

Plesk will run this after each pull before restarting the app.

---

## Environment Variables

These **must** be set in Plesk before the site can function correctly in production. Go to **Node.js** → **Environment variables** in Plesk and add each one:

| Variable | Description | Example |
|----------|-------------|---------|
| `CMS_ADMIN_USER` | Username for the `/admin/` panel | `admin` |
| `CMS_ADMIN_PASS` | Password for the `/admin/` panel | `yourpassword` |
| `SMTP_HOST` | Your email server hostname | `send.one.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email account username | `contact@boltservices.co.uk` |
| `SMTP_PASS` | Email account password | `yourpassword` |
| `SMTP_FROM` | Sender address for contact form emails | `"Bolt Services" <contact@boltservices.co.uk>` |
| `SMTP_TO` | Where contact form enquiries are delivered | `karl@boltservices.co.uk` |
| `NODE_ENV` | Set to production to enable CMS auth | `production` |

> **Security:** Never put these values in the code or commit them to GitHub. They must only be set in Plesk's environment variable panel.

---

## Deploying Updates

Once the initial setup is complete, deploying an update is simply:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

Plesk will automatically:
1. Pull the new code from GitHub
2. Run `npm install && npm run build`
3. Restart the Node.js server
4. Serve the updated site

This typically takes 30–60 seconds.

---

## Deploying Content-Only Changes via CMS

Content changes made through the CMS admin panel (`/admin/`) take effect **immediately** — no deployment needed. The CMS writes directly to `content/site-content.json` on the server.

If you want to back up content changes or sync them to GitHub, you can SSH into the server and commit the updated JSON file, but this is optional.

---

## Manual Deployment (SSH)

If the webhook isn't set up or you need to force a deployment manually:

```bash
# SSH into your server, then:
cd /var/www/vhosts/yourdomain.co.uk/httpdocs
git pull origin main
npm install
npm run build
# Restart Node.js via Plesk UI, or:
pm2 restart all   # if PM2 is managing the process
```

---

## File Structure on the Server

```
httpdocs/
├── server.js              # Node.js entry point
├── package.json
├── content/
│   └── site-content.json  # All CMS content (editable via admin panel)
├── src/
│   └── assets/            # Uploaded images (team photos, logos, hero bg)
├── dist/                  # Compiled CSS (built by 'npm run build')
│   └── css/
│       └── style.css
└── src/admin/             # CMS admin panel files
```

---

## Verifying the Deployment

After deploying, check:

1. **Homepage loads** — visit `https://yourdomain.co.uk`
2. **CMS accessible** — visit `https://yourdomain.co.uk/admin/` and log in
3. **Contact form works** — submit a test message and confirm receipt
4. **Mobile view** — check on a phone or use browser dev tools
5. **HTTPS** — confirm the padlock shows in the browser address bar

---

## Rollback

If a deployment causes an issue, roll back to the previous commit:

```bash
# On the server (SSH):
git log --oneline -5       # find the commit to roll back to
git checkout <commit-hash>  # or git reset --hard HEAD~1
npm run build
```

Or revert the change on GitHub and push — Plesk will auto-deploy the revert.
