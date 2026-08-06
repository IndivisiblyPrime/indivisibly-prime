'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    // homepageSettings is a singleton — every query reads `[0]`, so a second copy
    // would make the live site pick one at random. Remove the actions that could
    // create or destroy one.
    actions: (prev, {schemaType}) =>
      schemaType === 'homepageSettings'
        ? prev.filter(
            ({action}) =>
              action !== 'duplicate' && action !== 'delete' && action !== 'unpublish'
          )
        : prev,
  },
})
