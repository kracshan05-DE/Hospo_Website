// A Tapro product, as edited in the Sanity Studio
// (schema: studio/schemaTypes/product.ts).
export type Product = {
  id: string;
  name: string;
  volume?: string;
  description?: string;
  /** Original image URL on Sanity's CDN; resized via sanityImageUrl(). */
  image?: string;
  /** Alternative text for screen readers; falls back to the product name. */
  alt?: string;
  /** The photo's focal point chosen in the Studio (0–1 on each axis). */
  focus?: { x: number; y: number };
};
