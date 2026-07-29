import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Answer', type: 'text' }),
    defineField({
      name: 'page',
      title: 'Scoped To Page',
      type: 'reference',
      to: [{ type: 'page' }],
      description: 'Optional - scope this FAQ to a specific page rather than showing it everywhere.',
    }),
  ],
});
