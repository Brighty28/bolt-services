import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Prevent creating additional copies of this singleton
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'meta', title: 'Meta & Branding' },
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'services', title: 'Services' },
    { name: 'methodology', title: 'Methodology' },
    { name: 'industries', title: 'Industries' },
    { name: 'sections', title: 'Section Headings' },
    { name: 'contact', title: 'Contact & Social' },
  ],
  fields: [
    // ---- Meta ----
    defineField({ name: 'siteTitle', title: 'Page Title', type: 'string', group: 'meta' }),
    defineField({ name: 'siteDescription', title: 'Meta Description', type: 'text', rows: 3, group: 'meta' }),
    defineField({ name: 'logo', title: 'Site Logo', type: 'image', group: 'meta' }),

    // ---- Hero ----
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subheadline', title: 'Sub-headline', type: 'text', rows: 3 }),
        defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
        defineField({ name: 'ctaHref', title: 'CTA Button Link', type: 'string' }),
      ],
    }),

    // ---- About ----
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'about',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 4 }),
        defineField({ name: 'description', title: 'Description Paragraph', type: 'text', rows: 4 }),
        defineField({
          name: 'highlights',
          title: 'Stat Highlights',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'stat', title: 'Stat', type: 'string' }),
              defineField({ name: 'label', title: 'Label', type: 'string' }),
            ],
            preview: { select: { title: 'stat', subtitle: 'label' } },
          }],
        }),
      ],
    }),

    // ---- Services heading/intro (items are separate documents) ----
    defineField({ name: 'servicesHeading', title: 'Services — Section Heading', type: 'string', group: 'services' }),
    defineField({ name: 'servicesIntro', title: 'Services — Section Intro', type: 'text', rows: 2, group: 'services' }),

    // ---- Methodology ----
    defineField({
      name: 'methodology',
      title: 'Methodology Section',
      type: 'object',
      group: 'methodology',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'stages',
          title: 'Stages',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'stage', title: 'Stage Label', type: 'string' }),
              defineField({ name: 'title', title: 'Title', type: 'string' }),
              defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            ],
            preview: { select: { title: 'title', subtitle: 'stage' } },
          }],
        }),
      ],
    }),

    // ---- Industries ----
    defineField({
      name: 'industries',
      title: 'Industries Section',
      type: 'object',
      group: 'industries',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'items',
          title: 'Industry Tags',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),

    // ---- Section headings for document-driven sections ----
    defineField({ name: 'testimonialsHeading', title: 'Testimonials — Heading', type: 'string', group: 'sections' }),
    defineField({ name: 'teamHeading', title: 'Team — Heading', type: 'string', group: 'sections' }),
    defineField({ name: 'teamIntro', title: 'Team — Intro', type: 'text', rows: 2, group: 'sections' }),
    defineField({ name: 'insurancesHeading', title: 'Insurances — Heading', type: 'string', group: 'sections' }),
    defineField({ name: 'partnershipsHeading', title: 'Partnerships — Heading', type: 'string', group: 'sections' }),
    defineField({ name: 'partnershipsIntro', title: 'Partnerships — Intro', type: 'text', rows: 2, group: 'sections' }),
    defineField({ name: 'blogHeading', title: 'Blog — Heading', type: 'string', group: 'sections' }),
    defineField({ name: 'blogIntro', title: 'Blog — Intro', type: 'text', rows: 2, group: 'sections' }),

    // ---- Contact ----
    defineField({
      name: 'contact',
      title: 'Contact Section',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
      ],
    }),

    // ---- Social ----
    defineField({
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
      ],
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
