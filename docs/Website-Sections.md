# Website Sections

The Bolt Services website is a single-page application with 11 distinct sections. All content is managed through the [CMS](CMS-Guide.md) — no code changes needed.

---

## 1. Hero

The full-viewport opening section visitors see first.

- **Background image** — uploadable via CMS Media Library (`hero.backgroundImage`)
- **Headline & sub-headline** — editable in CMS → Hero tab
- **Call-to-action button** — text and link target editable in CMS
- Dark gradient overlay with Bolt orange accents and animated badge

---

## 2. About Bolt Services

Two-column layout introducing the company.

- **Heading & intro text** — editable in CMS → About tab
- **Highlight stats** — three stat/label pairs (e.g. "Est. 2017 / Established"). Add or remove via CMS
- Accreditation badges (IOSH, SMSTS, First Aid, Safe Contractor Approved) displayed automatically
- Insurance badges (Professional Indemnity, Employers Liability, Public Liability) displayed automatically

---

## 3. Our Services

Dark-background section with a 3-column card grid.

- **Up to 6+ service cards** — each has a title, description, and icon
- Icons available: `clipboard`, `users`, `shield`, `bar-chart`, `zap`, `cog`
- Cards animate in on scroll
- Add or remove service items via CMS → Services tab

---

## 4. Project Management Methodology

A four-stage visual timeline showing how Bolt manages projects end-to-end.

| Stage | Title |
|-------|-------|
| 1 | Statement of Requirements |
| 2 | Basis of Design |
| 3 | Detailed Design & Procurement |
| 4 | Construction & Commissioning |

- Stage titles and descriptions editable in CMS → Methodology tab

---

## 5. Industries We Serve

A responsive tag cloud of industry sectors on a light grey background.

- 12 industry tags: Engineering, Construction, FMCG, Food Industry, Cement, Building Aggregates, Industrial Refrigeration, Agricultural & Farming, Print & Packaging, Data Shredding, Recycling & Waste to Energy, Warehousing
- Add or remove tags freely in CMS → Industries tab

---

## 6. Client Partnerships

A 7-column logo grid showing all client brands Bolt has worked with.

- **14 client logos** currently loaded: Lidl, GEA, McCormick, Integral, ETEX, J&E Hall, Tyrrells, Pentadel, Tesco, Charlie Bigham's, EJM, Dalehead Foods, Morrisons, Müller
- Each logo is a PNG file in `src/assets/`
- Logos are assigned per partner via CMS → Partnerships tab using the image picker
- Cards have a hover lift animation
- Responsive: 2 columns on mobile → 3 on tablet → 7 on desktop

---

## 7. Company Insurances

Dark-background section with three insurance cards, each with a shield icon.

| Insurance | Description |
|-----------|-------------|
| Professional Indemnity | Covers claims related to professional advice or services |
| Employers Liability | Covers work-related injury or illness claims |
| Public Liability | Covers accidental damage or injury to third parties |

- Titles and descriptions editable in CMS → Insurances tab

---

## 8. Client Testimonials

Quote cards on a light grey background.

- Two testimonials currently loaded (Malcolm Brown / ETEX, Alyson Canning / GEA)
- Each quote has: quote text, author name, company name
- Add new testimonials any time in CMS → Testimonials tab

---

## 9. Meet the Team

A 5-column grid of circular team member cards.

| Name | Role |
|------|------|
| Karl Jest | Managing Director |
| Mel Jest | Director of Administration |
| Shane Steenson | Site Manager |
| Paul Edwards | Site Manager |
| Iain Mcdonald | Site Manager |

- Photos are assigned via CMS → Team tab using the image picker
- If no photo is set, the member's initials are displayed as a fallback
- Add or remove team members in CMS → Team tab

---

## 10. News & Insights (Blog)

A blog/news section where you can publish posts directly from the CMS.

- Post cards show: date, title, excerpt, author
- Clicking a card opens the full article in a modal overlay
- Posts are automatically sorted newest-first
- Manage all posts in CMS → Blog tab

---

## 11. Contact & Footer

Two-column contact section with a working email form.

**Contact details (left column):**
- Phone: 07885 729188
- Email: karl@boltservices.co.uk
- Address: 4 Hawthorn Way, St. Ives, Cambridgeshire, PE27 3YP

**Contact form (right column):**
- Fields: Name, Email, Subject, Message
- Submissions are delivered to your inbox via SMTP
- Reply-to is automatically set to the sender's email

**Footer:**
- Social media icons (Facebook, LinkedIn) link to your company pages
- URLs managed in CMS → Social tab
- Leave blank to hide an icon
