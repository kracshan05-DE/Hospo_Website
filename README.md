# Hospo Fresh Group website

The Hospo Fresh and Tapro websites, built as a **static site** on **Netlify**,
with Tapro products edited in **Sanity**. There is no database or server code
to maintain.

| Path        | What it is                                          |
| ----------- | --------------------------------------------------- |
| `/`         | Hospo Fresh public site                             |
| `/tapro`    | Tapro public site                                   |
| `/privacy`  | Shared privacy policy                               |
| `/studio`   | Product editor (Sanity Studio) for the owner        |

Non-technical guide for the owner: [OWNER-GUIDE.md](OWNER-GUIDE.md).

## How it works

| Need | How it is done |
| --- | --- |
| Product catalogue | Stored in Sanity (project `b4txwihh`, public dataset `production`). |
| Editing products | Sanity Studio at `/studio`. Sign-in is managed by Sanity (email/password or Google); only invited project members can sign in. |
| Updating the website | On Publish, a Sanity webhook calls a Netlify build hook. Netlify rebuilds in about 1–2 minutes. |
| Product photos | Served by Sanity's image CDN, which resizes and converts them, so phone photos are fine. |
| Contact forms | Netlify Forms (`hospo-enquiry`, `tapro-enquiry`), emailed to the business. |
| Hosting | One build writes the site and the Studio to `out/`; Netlify serves it from its CDN. |

### Build steps (`npm run build`)

1. `scripts/fetch-products.mjs` reads the published products from Sanity into
   `.generated/products.json`. If Sanity cannot be reached, the build stops
   and Netlify keeps the previous version live.
2. `next build` renders the public pages to static HTML in `out/`.
3. `studio/` (its own package, React 19) is built into `out/studio/`.

Why the separate fetch step: in Next.js 14, an uncached `fetch` inside a page
makes it dynamic, and a static export then silently omits the page. A cached
`fetch` instead persists in `.next/cache`, which Netlify keeps between builds,
so new products could be ignored. The script avoids both.

### Important files

| File | Purpose |
| --- | --- |
| `studio/schemaTypes/product.ts` | Product fields the owner edits. |
| `studio/sanity.config.ts` | Studio setup: products list with drag-to-reorder, `/studio` base path. |
| `scripts/fetch-products.mjs` | Build-time product query (GROQ). |
| `lib/products.ts`, `lib/sanity.ts` | Product normalising and image URL helper. |
| `public/__forms.html` | Hidden copies of both forms for Netlify's form detection. Keep field names in sync with the React forms. |
| `lib/enquiry.ts` | Form validation and submission. |
| `lib/csp.ts` | Content-Security-Policy for the public pages. |
| `netlify.toml` | Build settings, Node version, headers, Studio routing. |

## One-time setup

Do these in accounts you or the business own. Never share passwords; use invites.

### 1. Sanity dataset

sanity.io/manage → project **Hospo_Fresh** → **Datasets** → **Add dataset**:
name `production`, visibility **Public**. (Products are public on the website
anyway. New projects start on a 30-day Growth trial and then move to the Free
plan automatically, which turns private datasets public.)

### 2. Netlify site

1. Sign up at netlify.com with **Sign up with GitHub**.
2. **Add new site → Import an existing project → GitHub → `Hospo_Website`**.
   Build settings come from `netlify.toml`; leave them as detected.
3. The first build fails until the dataset exists (step 1); after that it
   builds with zero products. Note the site address, e.g. `https://<name>.netlify.app`.

### 3. Allow the Studio to sign in (CORS)

sanity.io/manage → **API** → **CORS origins** → **Add CORS origin**, with
**Allow credentials** ticked, for each address the Studio is opened from:

- `https://<name>.netlify.app`
- `https://www.<your-domain>` and `https://<your-domain>` (after the domain moves)
- `http://localhost:3333` (only if developing the Studio locally)

### 4. Publish → rebuild (webhook)

1. Netlify → **Site configuration → Build & deploy → Build hooks → Add build hook**:
   name `Sanity publish`, branch `main`. Copy the URL.
2. sanity.io/manage → **API** → **Webhooks** → **Create webhook**:
   - URL: the build hook URL
   - Dataset: `production`
   - Trigger on: **Create**, **Update**, **Delete**
   - Filter: `_type == "product"`
   - HTTP method: `POST`; leave drafts unchecked
3. Test: publish a product in `/studio`; a new deploy appears in Netlify within seconds.

Each publish is one production deploy. On Netlify's free credit plan that is
roughly 15 of 300 monthly credits, so about 20 publishes a month alongside
normal traffic.

### 5. Invite the owner

sanity.io/manage → **Members** → **Invite project members** → his email, role
**Administrator**. On the Free plan every other role is read-only, so an
"Editor" invited during the trial would lose editing when the trial ends.

### 6. Enquiry emails

Netlify → **Forms**. If no forms are listed: **Enable form detection**, then
**Deploys → Trigger deploy**. Then **Form notifications → Add notification →
Email** to `info@hospofresh.com.au`, once per form.

### 7. Domain (GoDaddy)

1. The previous host removes the domain from their Netlify site.
2. This site: **Domain management → Add a domain**; make `www` the primary
   domain. Add any TXT verification record Netlify asks for in GoDaddy.
3. GoDaddy DNS (with GoDaddy nameservers):

   | Type  | Name  | Value                          |
   | ----- | ----- | ------------------------------ |
   | A     | `@`   | `75.2.60.5`                    |
   | CNAME | `www` | `<name>.netlify.app`           |

   Delete other `A`/`AAAA` records on `@` (GoDaddy's "parked" record).
4. Netlify issues HTTPS automatically once DNS resolves. Add the new
   addresses to Sanity's CORS origins (step 3).

### 8. Security

- Two-factor authentication on the GitHub, Netlify and Sanity accounts.
- Keep this repository private.
- Review Sanity members occasionally (sanity.io/manage → Members).

## Moving data from the old Supabase project (one time)

Resume the paused Supabase project, then:

- **Products:** Table Editor → `products` → Export → CSV. Re-enter them in
  `/studio` (name, size, description) and upload each photo from
  Storage → `product-images`. Drag them into the right order.
- **Enquiries:** Table Editor → `inquiries` → Export → CSV. Store it privately,
  never in this repository: it contains customer personal data.

Delete the Supabase project and the old Vercel project once the new site is
live and both exports are safe.

## Local development

Requires Node 22.12+.

```bash
npm install
npm run dev            # fetches products, then http://localhost:3000 and /tapro
npm run studio         # Studio at http://localhost:3333 (needs the CORS origin above)
npm run build          # full build into out/
npm run lint && npm run typecheck
```

Contact forms only work on Netlify; locally they show the "could not be
sent" message. Use `npx netlify dev` to test them.

## Known limitations

- Next.js 14 is past its support window. As a static export it only runs at
  build time on our own code, which removes the runtime risks in its security
  advisories. Upgrading to a current major is still a recommended follow-up.
- No server-side form validation (there is no server). Browser validation helps
  genuine visitors; Netlify filters spam, and supports reCAPTCHA if needed.
- Hospo Fresh category photos are hotlinked from Unsplash. Self-host the ones you keep.
- The Tapro logo in the Hospo Fresh header is cropped from the hero artwork
  (120×49 px). Replace `public/tapro-logo.png` with the original logo file when available.
