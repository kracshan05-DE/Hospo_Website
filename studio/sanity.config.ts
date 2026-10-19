import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { schemaTypes } from './schemaTypes';

// The Tapro product editor, served at https://<site>/studio.
//
// Sign-in is handled entirely by Sanity (email and password, or Google).
// Only people invited to the Sanity project can sign in. Invite editors as
// "Administrator": on Sanity's Free plan every other role is read-only.
export default defineConfig({
  name: 'default',
  title: 'Tapro Products',
  projectId: 'b4txwihh',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    structureTool({
      title: 'Products',
      // One list only: the products, in the order shown on the website.
      // Drag the handle on the left of a product to reorder.
      structure: (S, context) =>
        S.list()
          .title('Tapro')
          .items([
            orderableDocumentListDeskItem({
              type: 'product',
              title: 'Products',
              S,
              context,
            }),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Keep the editor simple: Publish, Discard changes, Unpublish, Delete,
    // and Restore (to undo a mistake from the History panel).
    actions: (prev) =>
      prev.filter(({ action }) =>
        ['publish', 'discardChanges', 'unpublish', 'delete', 'restore'].includes(action ?? '')
      ),
  },
});
