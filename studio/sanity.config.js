import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { mediaPlugin } from 'sanity-plugin-media'
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
    mediaPlugin(),
  ],
  schema: {
    types: schemaTypes,
  },
})
