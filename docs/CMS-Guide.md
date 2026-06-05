# CMS Guide

The Bolt Services website uses **Sanity.io** as its headless CMS. All content is edited through Sanity Studio — a secure, hosted back office — and delivered to the site via the Sanity CDN. No server restart or deployment is needed when you make content changes.

---

## Accessing the Studio

**Hosted (production):**
```
https://bolt-services.sanity.studio
```

Log in with your Sanity account. If you don't have one yet, create a free account at [sanity.io](https://sanity.io) and ask your developer to invite you at:
`https://sanity.io/manage/project/773dau1s/members`

**Local (development):**
```bash
cd studio
npm install
npm run dev
# Opens at http://localhost:3333
```

---

## Studio Navigation

The left sidebar contains:

| Section | What's managed here |
|---------|---------------------|
| **Site Settings** | Meta/SEO, hero, about, methodology, industries, contact, social links |
| **Services** | Individual service cards (title, description, icon) |
| **Team Members** | Name, role, photo for each team member |
| **Testimonials** | Client quotes with author and company |
| **Insurances** | Insurance type cards (title and description) |
| **Partnerships** | Client logos and company names |
| **Blog Posts** | News & Insights articles |

---

## Site Settings (Singleton)

**Site Settings** is a single document that controls all section-level content. Click it in the sidebar to open. It is divided into tabs:

| Tab | Controls |
|-----|----------|
| **Meta & Branding** | Page title, meta description, site logo |
| **Hero** | Headline, sub-headline, background image, CTA button text and link |
| **About** | Heading, intro text, description, stat highlights (Est. 2017, Nationwide, MCIOB) |
| **Services** | Section heading and intro text |
| **Methodology** | Section heading and all 4 stage definitions |
| **Industries** | Section heading and list of industry tag strings |
| **Section Headings** | Headings and intro text for Testimonials, Team, Insurances, Partnerships, Blog |
| **Contact & Social** | Phone, email, address, Facebook URL, LinkedIn URL |

---

## Editing Content

1. Click the relevant item in the left sidebar
2. Edit the fields directly
3. Click **Publish** (top right) to make changes live immediately

> **Important:** Clicking "Save" only saves a draft. You must click **Publish** for changes to appear on the website.

---

## Uploading Images

When editing a document that has an image field (hero background, team photo, partner logo, site logo):

1. Click the image field
2. Click **Upload** to select a file from your computer
3. The image is stored on Sanity's CDN and will appear on the website immediately after publishing

**Supported formats:** JPG, PNG, SVG, WebP  
**No file size limit** (Sanity handles optimisation automatically)

### Changing the Hero Background

1. Open **Site Settings** → **Hero** tab
2. Click the **Background Image** field
3. Upload a new image or select an existing one
4. Click **Publish**

### Updating a Team Photo

1. Click **Team Members** in the sidebar
2. Select the team member
3. Click the **Photo** field and upload or select an image
4. Click **Publish**

### Updating a Partner Logo

1. Click **Partnerships** in the sidebar
2. Select the partner
3. Click the **Logo** field and upload or select an image
4. Click **Publish**

---

## Adding New Items

### New Team Member
1. Click **Team Members** → click **Create new document** (pencil icon or + button)
2. Fill in Name, Role, Initials (used as fallback if no photo), Photo, and Display Order
3. Click **Publish**

### New Testimonial
1. Click **Testimonials** → **Create new document**
2. Fill in Quote, Author Name, Company
3. Click **Publish**

### New Blog Post
1. Click **Blog Posts** → **Create new document**
2. Fill in Title, Slug (auto-generated from title), Date, Author, Excerpt, Body
3. Click **Publish** — the post appears on the site immediately, sorted newest-first

### New Partner
1. Click **Partnerships** → **Create new document**
2. Fill in Company Name, Logo image, Display Order
3. Click **Publish**

### New Service Card
1. Click **Services** → **Create new document**
2. Fill in Title, Description, Icon (select from list), Display Order
3. Click **Publish**

---

## Removing Items

1. Open the document you want to remove
2. Click the **three-dot menu** (⋮) in the top right
3. Select **Delete**
4. Confirm the deletion

---

## Display Order

Documents with an **Order** field (Services, Team Members, Insurances, Partnerships) are sorted by that number ascending. Set `order: 1` to appear first, `order: 2` second, etc.

To re-order, simply edit the Order field on each document and publish.

---

## Adding Industries

Industries are a simple list of strings managed inside **Site Settings → Industries** tab:

1. Open **Site Settings** → **Industries** tab
2. Click **Add item** in the Industry Tags list
3. Type the industry name
4. Click **Publish**

---

## Real-Time Updates

Changes published in Sanity Studio appear on the live website within a few seconds — the site fetches content from the Sanity CDN on every page load. No deployment, restart, or rebuild is needed.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Published a change but site hasn't updated | Hard refresh the site (Ctrl+Shift+R) — the CDN may be cached for a few seconds |
| Can't log in to Studio | Check you're using the correct Sanity account; ask developer to check member access at `sanity.io/manage/project/773dau1s/members` |
| Image not appearing after upload | Ensure you clicked **Publish** (not just Save) |
| Contact form not working | Check SMTP environment variables in Plesk — see [Deployment Guide](Deployment-Guide.md) |
| Studio shows "No documents found" | Run the seed script — see [Home](Home.md) for instructions |
