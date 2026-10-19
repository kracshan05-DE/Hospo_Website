import type { Product } from './types';
// Written by scripts/fetch-products.mjs, which runs before every build and
// dev start (see package.json). Not committed: it is always fetched fresh.
import raw from '@/.generated/products.json';

/**
 * The published Tapro products, in the order set in the Studio.
 * Normalises empty values so components can rely on `undefined`.
 */
export function getProducts(): Product[] {
  const list: unknown = raw;
  if (!Array.isArray(list)) {
    throw new Error('.generated/products.json is not a list. Run `npm run fetch:products`.');
  }

  return list.map((item) => {
    const p = item as Record<string, unknown>;
    const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
    const hotspot = p.hotspot as { x?: unknown; y?: unknown } | null;

    return {
      id: String(p._id),
      name: String(p.name).trim(),
      volume: text(p.volume),
      description: text(p.description),
      image: text(p.image),
      alt: text(p.alt),
      focus:
        hotspot && typeof hotspot.x === 'number' && typeof hotspot.y === 'number'
          ? { x: hotspot.x, y: hotspot.y }
          : undefined,
    };
  });
}
