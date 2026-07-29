import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'Sam Ghanem CMO',

  // REPLACE_WITH_PROJECT_ID once the Sanity project exists.
  projectId: 'REPLACE_WITH_PROJECT_ID',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('faq').title('FAQs'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
