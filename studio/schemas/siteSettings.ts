import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site Title', type: 'string' }),
    defineField({ name: 'defaultDescription', title: 'Default Meta Description', type: 'text' }),
    defineField({
      name: 'applyUrl',
      title: 'Apply Destination URL',
      type: 'string',
      description:
        'Where the Apply button/form ultimately sends applicants once the destination (native form, Typeform, Calendly) is decided.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform' },
            { name: 'url', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'ogImage', title: 'Default OG Image', type: 'image' }),
  ],
});
