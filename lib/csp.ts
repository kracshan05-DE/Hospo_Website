// Content-Security-Policy for the public pages, delivered as a <meta> tag in
// each root layout.
//
// Why <meta> instead of a response header: the Sanity Studio at /studio is
// served from the same site and needs a different, looser policy (it talks
// to Sanity's APIs from the browser). Netlify does not document how
// overlapping header rules combine, so each public page carries its own
// policy instead. Clickjacking protection (frame-ancestors) cannot be set via
// <meta>, so it comes from the X-Frame-Options header in netlify.toml.
//
// 'unsafe-inline' on script-src/style-src: Next.js inlines its hydration
// payload in <script> tags and the components use inline style props. A
// nonce-based policy needs a server per request, which a static site has none
// of. There is no user-generated HTML on these pages, which keeps XSS risk low.
//
// Product photos load from Sanity's image CDN (cdn.sanity.io). Product data
// itself is fetched at build time, so the browser never calls the Sanity API.
const isDev = process.env.NODE_ENV === 'development';

export const SITE_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com",
  "font-src 'self'",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');
