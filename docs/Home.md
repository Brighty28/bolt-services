# Bolt Services — Website Documentation

Welcome to the Bolt Services website documentation. This wiki covers everything you need to know to manage the site content, upload images, and deploy updates.

---

## Pages

| Page | Description |
|------|-------------|
| [Website Sections](Website-Sections.md) | Walkthrough of all 11 sections on the website |
| [CMS Guide](CMS-Guide.md) | How to log in and manage all site content |
| [Deployment Guide](Deployment-Guide.md) | How to deploy the site to production (Plesk) |

---

## Quick Reference

| Item | Value |
|------|-------|
| **CMS Admin URL** | `https://yourdomain.co.uk/admin/` |
| **Contact Email** | karl@boltservices.co.uk |
| **Phone** | 07885 729188 |
| **Node.js version** | 18+ |
| **Git branch (main)** | `main` |
| **Repository** | `Brighty28/bolt-services` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Styling | SASS (7-1 architecture), compiled to CSS |
| Frontend | Vanilla JavaScript (no frameworks) |
| Server | Node.js with Express |
| Content | JSON file (`content/site-content.json`) |
| Email | Nodemailer (SMTP) |
| Images | Uploaded to `src/assets/` via CMS |
| Deployment | Plesk Git integration + GitHub webhook |
