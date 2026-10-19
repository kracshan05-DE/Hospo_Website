import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

// A Tapro product as shown on the website's Collection grid.
// Field names match what the website reads in lib/products.ts.
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    // Hidden field that stores the drag-and-drop position.
    orderRankField({ type: 'product' }),

    defineField({
      name: 'name',
      title: 'Product name',
      type: 'string',
      validation: (rule) => rule.required().error('Please enter a product name.').max(200),
    }),
    defineField({
      name: 'volume',
      title: 'Size / volume',
      description: 'For example: 250ml Bottle, 500g Pouch',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A short line or two about the product.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(2000),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      description:
        'Any size is fine; the website resizes it. Click the crop icon to choose which part of the photo stays in view.',
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
      fields: [
        defineField({
          name: 'alt',
          title: 'Photo description (for blind visitors)',
          description: 'Optional. For example: Red Kochchi Sauce in a 250ml glass bottle.',
          type: 'string',
          validation: (rule) => rule.max(200),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'volume', media: 'image' },
  },
});
