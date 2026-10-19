import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'b4txwihh',
    dataset: 'production',
  },
  project: {
    // Served at /studio on the website, so the build's asset URLs must start
    // with /studio (must match basePath in sanity.config.ts).
    basePath: '/studio',
  },
  deployment: {
    // The Studio is built into the website (out/studio) with the exact
    // versions in package-lock.json. Auto-updates would instead load newer
    // Studio code from Sanity's CDN at runtime, outside our review.
    autoUpdates: false,
  },
});
