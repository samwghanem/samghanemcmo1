import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'clientName', title: 'Client Name', type: 'string' }),
    defineField({ name: 'clientCompany', title: 'Client Company', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text' }),
    defineField({
      name: 'resultStat',
      title: 'Result Stat',
      type: 'string',
      description: 'e.g. "$2.4M added pipeline in 90 days" - a concrete number, not a soft quote.',
    }),
    defineField({ name: 'logo', title: 'Client Logo', type: 'image' }),
  ],
});
