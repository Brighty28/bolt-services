import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 5, validation: (R) => R.required() }),
    defineField({ name: 'author', title: 'Author Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'company' },
  },
})
