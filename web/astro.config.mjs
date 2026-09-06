// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const NOINDEX_PATHS = ['/privacy-policy', '/dashboard'];

// https://astro.build/config
export default defineConfig({
  site: 'https://www.samghanemcmo.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((p) => page.includes(p)),
    }),
  ],
});
