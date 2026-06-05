/**
 * Sanity seed script — migrates content/site-content.json + src/assets/ images
 * to the Bolt Services Sanity project (773dau1s, dataset: production).
 *
 * Prerequisites:
 *   1. npm install @sanity/client (root package, or run: npx @sanity/cli@latest login first)
 *   2. Set SANITY_WRITE_TOKEN env var — create a token at:
 *      https://sanity.io/manage/project/773dau1s/api → Tokens → Add API Token (Editor)
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> node scripts/sanity-seed.js
 */

'use strict';

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = '773dau1s';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('ERROR: Set SANITY_WRITE_TOKEN environment variable before running this script.');
  console.error('Create a token at https://sanity.io/manage/project/773dau1s/api');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const CONTENT_FILE = path.join(__dirname, '..', 'content', 'site-content.json');

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
           '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif' }[ext] || 'image/png';
}

async function uploadImage(filename) {
  const filepath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`  SKIP (not found): ${filename}`);
    return null;
  }
  const buffer = fs.readFileSync(filepath);
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: getMimeType(filename),
  });
  console.log(`  Uploaded: ${filename} → ${asset._id}`);
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

function imageRef(filename) {
  // Returns a thunk so we can call uploadImage lazily
  return () => uploadImage(filename);
}

function assetFilename(assetPath) {
  // "assets/logo-lidl.png" → "logo-lidl.png"
  return assetPath ? path.basename(assetPath) : null;
}

async function deleteExisting(type) {
  const docs = await client.fetch(`*[_type == "${type}"]._id`);
  if (docs.length === 0) return;
  const tx = client.transaction();
  docs.forEach(id => tx.delete(id));
  await tx.commit();
  console.log(`  Deleted ${docs.length} existing ${type} document(s)`);
}

async function seed() {
  console.log('\n=== Bolt Services → Sanity Seed ===\n');
  const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));

  // ---- 1. Upload all images referenced in content ----
  console.log('Uploading images...');
  const imageCache = {};

  async function getImage(assetPath) {
    if (!assetPath) return undefined;
    const filename = assetFilename(assetPath);
    if (!imageCache[filename]) {
      imageCache[filename] = await uploadImage(filename);
    }
    return imageCache[filename];
  }

  // Pre-upload all images we know about
  const allImagePaths = [
    content.meta?.logo,
    content.hero?.backgroundImage,
    ...((content.team?.members || []).map(m => m.photo)),
    ...((content.partnerships?.clients || []).map(c => c.logo)),
  ].filter(Boolean);

  for (const p of allImagePaths) {
    await getImage(p);
  }

  // ---- 2. Build & upsert siteSettings singleton ----
  console.log('\nCreating siteSettings...');
  const heroImg = await getImage(content.hero?.backgroundImage);
  const logoImg = await getImage(content.meta?.logo);

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: content.meta?.title,
    siteDescription: content.meta?.description,
    ...(logoImg && { logo: logoImg }),
    hero: {
      headline: content.hero?.headline,
      subheadline: content.hero?.subheadline,
      ...(heroImg && { backgroundImage: heroImg }),
      ctaText: content.hero?.cta?.text,
      ctaHref: content.hero?.cta?.href,
    },
    about: {
      heading: content.about?.heading,
      intro: content.about?.intro,
      description: content.about?.description,
      highlights: (content.about?.highlights || []).map(h => ({ _key: h.stat.replace(/\W/g, ''), stat: h.stat, label: h.label })),
    },
    servicesHeading: content.services?.heading,
    servicesIntro: content.services?.intro,
    methodology: {
      heading: content.methodology?.heading,
      stages: (content.methodology?.stages || []).map((s, i) => ({
        _key: `stage${i + 1}`, stage: s.stage, title: s.title, description: s.description,
      })),
    },
    industries: {
      heading: content.industries?.heading,
      items: content.industries?.items || [],
    },
    testimonialsHeading: content.testimonials?.heading,
    teamHeading: content.team?.heading,
    teamIntro: content.team?.intro,
    insurancesHeading: content.insurances?.heading,
    partnershipsHeading: content.partnerships?.heading,
    partnershipsIntro: content.partnerships?.intro,
    blogHeading: content.blog?.heading,
    blogIntro: content.blog?.intro,
    contact: {
      heading: content.contact?.heading,
      intro: content.contact?.intro,
      phone: content.contact?.phone,
      email: content.contact?.email,
      address: content.contact?.address,
    },
    social: {
      facebook: content.social?.facebook || '',
      linkedin: content.social?.linkedin || '',
    },
  });
  console.log('  siteSettings saved.');

  // ---- 3. Services ----
  console.log('\nMigrating services...');
  await deleteExisting('service');
  const tx1 = client.transaction();
  (content.services?.items || []).forEach((s, i) => {
    tx1.create({ _type: 'service', title: s.title, description: s.description, icon: s.icon, order: i + 1 });
  });
  await tx1.commit();
  console.log(`  Created ${(content.services?.items || []).length} services.`);

  // ---- 4. Team members ----
  console.log('\nMigrating team members...');
  await deleteExisting('teamMember');
  const tx2 = client.transaction();
  for (const [i, m] of (content.team?.members || []).entries()) {
    const photo = await getImage(m.photo);
    tx2.create({
      _type: 'teamMember',
      name: m.name,
      role: m.role,
      initials: m.initials,
      ...(photo && { photo }),
      order: i + 1,
    });
  }
  await tx2.commit();
  console.log(`  Created ${(content.team?.members || []).length} team members.`);

  // ---- 5. Testimonials ----
  console.log('\nMigrating testimonials...');
  await deleteExisting('testimonial');
  const tx3 = client.transaction();
  (content.testimonials?.items || []).forEach(t => {
    tx3.create({ _type: 'testimonial', quote: t.quote, author: t.author, company: t.company });
  });
  await tx3.commit();
  console.log(`  Created ${(content.testimonials?.items || []).length} testimonials.`);

  // ---- 6. Insurances ----
  console.log('\nMigrating insurances...');
  await deleteExisting('insurance');
  const tx4 = client.transaction();
  (content.insurances?.items || []).forEach((item, i) => {
    tx4.create({ _type: 'insurance', title: item.title, description: item.description, order: i + 1 });
  });
  await tx4.commit();
  console.log(`  Created ${(content.insurances?.items || []).length} insurances.`);

  // ---- 7. Partnerships ----
  console.log('\nMigrating partnerships...');
  await deleteExisting('partnership');
  for (const [i, c] of (content.partnerships?.clients || []).entries()) {
    const logo = await getImage(c.logo);
    await client.create({
      _type: 'partnership',
      name: c.name,
      ...(logo && { logo }),
      order: i + 1,
    });
  }
  console.log(`  Created ${(content.partnerships?.clients || []).length} partnerships.`);

  // ---- 8. Blog posts ----
  console.log('\nMigrating blog posts...');
  await deleteExisting('blogPost');
  const tx5 = client.transaction();
  (content.blog?.posts || []).forEach(post => {
    tx5.create({
      _type: 'blogPost',
      title: post.title,
      slug: { _type: 'slug', current: post.id },
      date: post.date,
      author: post.author,
      excerpt: post.excerpt,
      body: post.body,
    });
  });
  await tx5.commit();
  console.log(`  Created ${(content.blog?.posts || []).length} blog posts.`);

  console.log('\n=== Seed complete! ===');
  console.log(`\nNext steps:`);
  console.log(`  1. Open Sanity Studio: cd studio && npm install && npm run dev`);
  console.log(`  2. Review content at http://localhost:3333`);
  console.log(`  3. Publish all drafts in the Studio`);
  console.log(`  4. Deploy studio: cd studio && npm run deploy`);
}

seed().catch(err => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
