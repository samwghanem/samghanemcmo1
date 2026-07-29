import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),
    defineField({
      name: 'noindex',
      title: 'Noindex',
      type: 'boolean',
      initialValue: false,
      description: 'Set true for pages that should not appear in search results (e.g. Privacy Policy).',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'string', title: 'Eyebrow' },
        { name: 'headline', type: 'string', title: 'Headline' },
        { name: 'subheadline', type: 'text', title: 'Subheadline' },
        { name: 'ctaLabel', type: 'string', title: 'CTA Label' },
        { name: 'ctaUrl', type: 'string', title: 'CTA URL' },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'block' }, // richText
        {
          type: 'object',
          name: 'statBlock',
          title: 'Stat Block',
          fields: [
            {
              name: 'stats',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'value', type: 'string', title: 'Value' },
                    { name: 'label', type: 'string', title: 'Label' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'qualificationGate',
          title: 'Qualification Gate',
          fields: [
            { name: 'headline', type: 'string', title: 'Headline' },
            { name: 'body', type: 'text', title: 'Body' },
            { name: 'ctaLabel', type: 'string', title: 'CTA Label' },
            { name: 'ctaUrl', type: 'string', title: 'CTA URL' },
          ],
        },
        {
          type: 'object',
          name: 'mechanismStep',
          title: 'Mechanism Step',
          fields: [
            { name: 'number', type: 'string', title: 'Step Number' },
            { name: 'title', type: 'string', title: 'Step Title' },
            { name: 'what', type: 'text', title: 'What It Is' },
            { name: 'get', type: 'text', title: 'What You Get' },
          ],
        },
        {
          type: 'object',
          name: 'faqBlock',
          title: 'FAQ Block',
          fields: [
            {
              name: 'items',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'faq' }] }],
            },
          ],
        },
      ],
    }),
  ],
});
