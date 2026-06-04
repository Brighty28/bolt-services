import { defineField, defineType } from 'sanity'

export const partnership = defineType({
  name: 'partnership',
  title: 'Partnership',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client / Company Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: false } }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
