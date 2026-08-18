import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://nikhil-gautam-dev.github.io',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
  ],
  output: 'static',
});
