// Sanity project settings. The same values appear in
// scripts/fetch-products.mjs and studio/sanity.config.ts.
//
// These are not secrets. The dataset is public-read, as the products are
// shown on the public website anyway. Writing requires signing in to the
// Studio as a project member.
export const SANITY_PROJECT_ID = 'b4txwihh';
export const SANITY_DATASET = 'production';

/**
 * Builds a resized image URL on Sanity's image CDN. The CDN resizes and
 * converts (WebP/AVIF) on the fly, so large photos uploaded from a phone are
 * still delivered small.
 */
export function sanityImageUrl(assetUrl: string, width: number): string {
  const url = new URL(assetUrl);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', '80');
  url.searchParams.set('fit', 'max');
  url.searchParams.set('auto', 'format');
  return url.toString();
}
