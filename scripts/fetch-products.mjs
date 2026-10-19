// Fetches the published Tapro products from Sanity and writes them to
// .generated/products.json, which the Tapro page imports at build time.
//
// Runs before `next build` (see package.json). Why a separate step instead of
// fetch() inside the page: Next.js 14 either marks a page using an uncached
// fetch as dynamic (which a static export silently skips), or caches the
// response in .next/cache, which Netlify keeps between builds, so new edits
// could be ignored. A plain script has neither problem.
//
// If Sanity is unreachable or answers with an error, this exits non-zero and
// the build fails. Netlify then keeps the previous deploy live, so an outage
// can never publish an empty product grid.

import { mkdir, writeFile } from 'node:fs/promises';

// Must match lib/sanity.ts and studio/sanity.config.ts.
const PROJECT_ID = 'b4txwihh';
const DATASET = 'production';
const API_VERSION = '2025-02-19';

// Overridable only so tests can point at a local mock.
const API_ORIGIN = process.env.SANITY_API_ORIGIN || `https://${PROJECT_ID}.apicdn.sanity.io`;

// Published products in the drag-and-drop order set in the Studio.
const QUERY = `*[_type == "product" && defined(name)] | order(orderRank asc, _createdAt asc) {
  _id,
  name,
  volume,
  description,
  "image": image.asset->url,
  "alt": image.alt,
  "hotspot": image.hotspot { x, y }
}`;

const url = new URL(`${API_ORIGIN}/v${API_VERSION}/data/query/${DATASET}`);
url.searchParams.set('query', QUERY);
url.searchParams.set('perspective', 'published'); // never include unpublished drafts

const res = await fetch(url, { signal: AbortSignal.timeout(30_000) }).catch((err) => {
  console.error(`[products] Could not reach Sanity: ${err.message}`);
  process.exit(1);
});
if (!res.ok) {
  console.error(`[products] Sanity returned HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const { result } = await res.json();
if (!Array.isArray(result)) {
  console.error('[products] Unexpected response from Sanity (no result array).');
  process.exit(1);
}

await mkdir('.generated', { recursive: true });
await writeFile('.generated/products.json', JSON.stringify(result, null, 2) + '\n');
console.log(`[products] Fetched ${result.length} published product(s) from Sanity.`);
