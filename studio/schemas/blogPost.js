import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL ID)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'date', title: 'Publication Date', type: 'date' }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Excerpt (shown on card)', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'Body (full article)', type: 'text', rows: 12 }),
  ],
  orderings: [{ title: 'Date (newest first)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})
