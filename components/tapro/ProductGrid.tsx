import Reveal from './Reveal';
import { sanityImageUrl } from '@/lib/sanity';
import type { Product } from '@/lib/types';

const WIDTHS = [480, 720, 960, 1280];

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="collection" aria-labelledby="collection-title">
      <div className="wrap">
        <Reveal as="div" delay={0} className="section-head">
          <div className="eyebrow">The Collection</div>
          <h2 id="collection-title">
            Lift the velvet.
            <br />
            Reveal the flavour.
          </h2>
          <p>
            {products.length
              ? `${products.length} signature products, each one veiled the way Tapro presents them to the world — drawn back to show the craft beneath.`
              : 'Signature products, veiled the way Tapro presents them to the world — drawn back to show the craft beneath.'}
          </p>
        </Reveal>
      </div>

      <ul className="grid" role="list">
        {products.length === 0 && <li className="empty-collection">More products are on the way.</li>}
        {products.map((p, i) => (
          // tabIndex lets keyboard users focus a card, which expands its
          // description the same way hovering does (see .card:focus-visible).
          <Reveal as="li" delay={i % 3} key={p.id} className="card" tabIndex={0}>
            <div className="num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="card-art">
              {p.image ? (
                // Sanity's image CDN resizes on request, so each device downloads
                // only the width it needs (srcSet + sizes).
                // eslint-disable-next-line @next/next/no-img-element -- static export; resizing is done by Sanity's CDN
                <img
                  src={sanityImageUrl(p.image, 960)}
                  srcSet={WIDTHS.map((w) => `${sanityImageUrl(p.image!, w)} ${w}w`).join(', ')}
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                  alt={p.alt || `${p.name}${p.volume ? ` – ${p.volume}` : ''}`}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  style={p.focus ? { objectPosition: `${p.focus.x * 100}% ${p.focus.y * 100}%` } : undefined}
                />
              ) : (
                <span className="placeholder">
                  <span className="placeholder-mark">Tapro</span>
                  <span className="placeholder-note">Photo coming soon</span>
                </span>
              )}
            </div>
            <div className="card-caption">
              {p.volume && <div className="vol">{p.volume}</div>}
              <h3>{p.name}</h3>
              {p.description && <p>{p.description}</p>}
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
