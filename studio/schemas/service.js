import { defineField, defineType } from 'sanity'

const ICON_OPTIONS = [
  { title: 'Clipboard (Project Management)', value: 'clipboard' },
  { title: 'Users (CDM / Team)', value: 'users' },
  { title: 'Shield (Health & Safety)', value: 'shield' },
  { title: 'Bar Chart (Quality Control)', value: 'bar-chart' },
  { title: 'Zap (Communication)', value: 'zap' },
  { title: 'Cog (Additional Services)', value: 'cog' },
]

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: ICON_OPTIONS, layout: 'radio' },
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'icon' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `Icon: ${subtitle}` : '' }),
  },
})
