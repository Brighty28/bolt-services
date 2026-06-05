import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/index.js'
import { structure } from './structure.js'

export default defineConfig({
  name: 'bolt-services',
  title: 'Bolt Services CMS',
  projectId: '773dau1s',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
