import { defineField, defineType } from 'sanity'

export const insurance = defineType({
  name: 'insurance',
  title: 'Insurance',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Insurance Type', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title' },
  },
})
