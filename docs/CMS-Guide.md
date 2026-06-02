# CMS Guide

The Bolt Services website includes a built-in Content Management System (CMS) that lets you update all website content without touching any code.

---

## Accessing the CMS

Navigate to:

```
https://yourdomain.co.uk/admin/
```

You will be prompted for a username and password. These are set as environment variables on the server — contact your developer or check the Plesk environment variable settings if you need the credentials.

> **Local development:** the CMS is available at `http://localhost:3000/admin/` with no authentication required.

---

## CMS Tabs Overview

The admin panel is organised into tabs — one per section of the website:

| Tab | What you can edit |
|-----|-------------------|
| **Hero** | Headline, sub-headline, CTA button text and link, background image |
| **About** | Heading, intro/description text, stat highlights (add/remove) |
| **Services** | Service cards — title, description, icon (add/remove) |
| **Methodology** | Stage titles and descriptions |
| **Industries** | Industry sector tags (add/remove) |
| **Partnerships** | Client names and logos (add/remove) |
| **Insurances** | Insurance type titles and descriptions (add/remove) |
| **Testimonials** | Quote, author, company (add/remove) |
| **Team** | Name, role, photo (add/remove) |
| **Blog** | Post title, date, author, excerpt, full body (add/remove) |
| **Contact** | Phone, email, address |
| **Social** | Facebook and LinkedIn URLs |
| **Media** | Upload, browse, and delete images |

---

## Editing Text Content

1. Click the relevant tab (e.g. **Services**)
2. Edit the text fields directly in the form
3. Click **Save Changes** at the bottom of the page
4. The website updates immediately — no refresh or restart needed

---

## Uploading Images

### Via the Media Library

1. Click the **Media** tab
2. Drag and drop an image onto the upload area, or click to browse
3. The image is saved to `src/assets/` on the server
4. It becomes available in all image picker dropdowns (hero background, team photos, partner logos)

**Supported formats:** JPG, PNG, SVG, WebP, GIF  
**Maximum file size:** 10MB

### Assigning a Team Photo

1. Go to the **Team** tab
2. Find the team member you want to update
3. Use the **Photo** dropdown to select an image from the media library
4. Click **Save Changes**

### Assigning a Partner Logo

1. Go to the **Partnerships** tab
2. Find the client you want to update
3. Use the **Logo** dropdown to select an image from the media library
4. Click **Save Changes**

---

## Adding New Items

Most sections support adding new items dynamically:

1. Scroll to the bottom of a section in the CMS
2. Click the **+ Add [Item]** button (e.g. "+ Add Service", "+ Add Team Member")
3. Fill in the new item's fields
4. Click **Save Changes**

**Sections that support adding items:**
- About (stat highlights)
- Services
- Industries
- Partnerships
- Insurances
- Testimonials
- Team
- Blog

---

## Removing Items

1. Find the item you want to remove in the relevant CMS tab
2. Click the **Remove** button next to it
3. Click **Save Changes** to confirm

---

## Publishing a Blog Post

1. Go to the **Blog** tab
2. Click **+ Add Post**
3. Fill in:
   - **Title** — headline of the post
   - **Date** — publication date (YYYY-MM-DD format)
   - **Author** — e.g. "Bolt Services" or a team member's name
   - **Excerpt** — short summary shown on the post card (1-2 sentences)
   - **Body** — full article text (plain text, new lines create paragraphs)
4. Click **Save Changes**

Posts appear on the site immediately, sorted newest-first.

---

## How Content is Stored

All site content is stored in a single JSON file:

```
content/site-content.json
```

The CMS reads this file on load and writes to it on save. There is no database. This makes the content easy to back up — just copy the JSON file.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Login prompt appears even locally | Check `NODE_ENV` — authentication is only enforced in production |
| Changes not saving | Check the browser console for errors; verify the server is running |
| Image not appearing in picker | Confirm the upload succeeded in the Media tab |
| Contact form not sending email | Check SMTP environment variables in Plesk (see [Deployment Guide](Deployment-Guide.md)) |
