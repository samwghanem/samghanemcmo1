// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const NOINDEX_PATHS = ['/privacy-policy'];

// https://astro.build/config
export default defineConfig({
  site: 'https://www.samghanemcmo.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((p) => page.includes(p)),
    }),
  ],
});
