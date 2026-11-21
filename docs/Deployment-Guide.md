# Deployment Guide

This guide covers how to deploy the Bolt Services website to production using DirectAdmin and GitHub.

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
        │  GitHub Actions → SSH → git pull + build
        ▼
   DirectAdmin Hosting
   (The Hosting Heroes)
        │
        │  Node.js app restart
        ▼
  Live Website
  (boltservices.co.uk)
```

> **Content changes** made in Sanity Studio are live instantly — no deployment needed.

---

## Initial Setup

### Step 1 — Find the Node.js section in DirectAdmin

1. Log in to DirectAdmin
2. Click your domain (`boltservices.co.uk`) to open its management area
3. Look for **Node.js** — it may appear under:
   - **Extra Features → Node.js**
   - **Advanced Features → Node.js**
   - Or directly on the domain dashboard as a "Node.js" tile

If you cannot find it, contact The Hosting Heroes and ask them to point you to the Node.js app manager for your domain.

---

### Step 2 — Create the Node.js Application

In the Node.js section:

| Setting | Value |
|---------|-------|
| **Node.js version** | 18 (or highest available) |
| **Application mode** | production |
| **Application root** | the folder where your site files live (e.g. `/home/abright/domains/boltservices.co.uk/public_html`) |
| **Application startup file** | `server.js` |

Save / Create the app.

---

### Step 3 — Get the Code onto the Server

#### Option A — SSH (recommended if available)

Ask The Hosting Heroes to confirm your SSH hostname and whether SSH access is enabled. Then:

```bash
# Connect to the server
ssh yourusername@boltservices.co.uk

# Navigate to your domain root (path may differ — ask hosting if unsure)
cd ~/domains/boltservices.co.uk/public_html

# Clone the repository (replaces any existing files)
git clone https://github.com/Brighty28/bolt-services.git .

# Install dependencies and build
npm run deploy
```

#### Option B — File Manager

1. In DirectAdmin → **Files** (or File Manager)
2. Navigate to your domain's public root folder
3. Download a ZIP of the repo from GitHub: `https://github.com/Brighty28/bolt-services/archive/refs/heads/main.zip`
4. Upload and extract the ZIP into the public root

---

### Step 4 — Create the `.env` File

The server reads SMTP credentials from a `.env` file. This file must **never** be committed to git — create it directly on the server.

**Via File Manager:**

1. DirectAdmin → **Files** → navigate to the public root folder
2. Click **New File**, name it `.env`
3. Paste the following with your real values:

```
SMTP_HOST=send.one.com
SMTP_PORT=587
SMTP_USER=contact@boltservices.co.uk
SMTP_PASS=yourpassword
SMTP_FROM=contact@boltservices.co.uk
SMTP_TO=karl@boltservices.co.uk
NODE_ENV=production
```

4. Save

**Via SSH:**

```bash
nano ~/domains/boltservices.co.uk/public_html/.env
# paste the values above, then Ctrl+O to save, Ctrl+X to exit
```

---

### Step 5 — Run the Build

If you used SSH to clone, the build already ran in Step 3. If you used File Manager:

1. In DirectAdmin, look for a **Terminal** or **Run command** feature in the Node.js section
2. Run: `npm run deploy`

Or via SSH:

```bash
cd ~/domains/boltservices.co.uk/public_html
npm run deploy
```

`npm run deploy` runs `npm ci && npm run build` — installs packages and compiles SASS to `dist/`.

---

### Step 6 — Restart the App

In the DirectAdmin Node.js section, click **Restart** (or **Restart App**). The site should now be live at `http://boltservices.co.uk`.

---

## Automatic Deployment (GitHub → Server on Push)

To make `git push` automatically deploy the site, set up a GitHub Action that SSHes into the server and runs `git pull && npm run deploy`.

### 1. Generate a Deploy Key

On your local machine (or via SSH on the server):

```bash
ssh-keygen -t ed25519 -C "deploy@boltservices.co.uk" -f deploy_key -N ""
```

This creates `deploy_key` (private) and `deploy_key.pub` (public).

### 2. Add the Public Key to the Server

Copy the contents of `deploy_key.pub` and add it to `~/.ssh/authorized_keys` on the server (via SSH or DirectAdmin's SSH Key Manager if available).

### 3. Add the Private Key to GitHub

1. Go to `https://github.com/Brighty28/bolt-services/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `SSH_PRIVATE_KEY`
4. Value: paste the full contents of `deploy_key`

Also add these secrets:

| Secret | Value |
|--------|-------|
| `SSH_HOST` | Your server hostname (e.g. `boltservices.co.uk`) |
| `SSH_USER` | Your DirectAdmin username |
| `SSH_PATH` | Path to site root (e.g. `/home/abright/domains/boltservices.co.uk/public_html`) |

### 4. Create the GitHub Actions Workflow

The file `.github/workflows/deploy.yml` in the repo handles this automatically on every push to `main`. See that file for the full workflow.

---

## Manual Deployment (SSH)

If you need to deploy manually at any time:

```bash
ssh yourusername@boltservices.co.uk
cd ~/domains/boltservices.co.uk/public_html
git pull origin main
npm run deploy
# Then restart via DirectAdmin Node.js panel
```

---

## Content Updates (No Deployment Needed)

Changes in **Sanity Studio** (`https://bolt-services.sanity.studio`) are live within seconds of publishing. No git push or server restart needed.

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | Email server hostname |
| `SMTP_PORT` | Email port (usually `587`) |
| `SMTP_USER` | Email account username |
| `SMTP_PASS` | Email account password |
| `SMTP_FROM` | Sender address shown on contact emails |
| `SMTP_TO` | Where contact form enquiries are delivered |
| `NODE_ENV` | Set to `production` |

---

## Verifying the Deployment

After deploying:

1. **Homepage loads** — visit `https://boltservices.co.uk`
2. **Content visible** — all sections populated from Sanity
3. **Contact form works** — submit a test message and confirm receipt at `karl@boltservices.co.uk`
4. **HTTPS** — padlock shows in the browser address bar

---

## Rollback

```bash
ssh yourusername@boltservices.co.uk
cd ~/domains/boltservices.co.uk/public_html
git log --oneline -5       # find the commit to go back to
git revert HEAD            # creates a safe revert commit
git push origin main       # triggers auto-deploy if webhook is set up
```
