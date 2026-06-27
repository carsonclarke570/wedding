// @ts-check
import { defineConfig } from 'astro/config';

// Static output for now: the homepage and editorial sections are fully static.
// When RSVP (persistence) and Gallery (blob storage) land, add a server adapter
// (e.g. @astrojs/node or a platform adapter) and switch the relevant routes to
// `export const prerender = false`.
export default defineConfig({
  site: 'https://warrenandcarson.wedding',
  devToolbar: { enabled: false },
});
