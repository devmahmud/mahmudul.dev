import fs from 'fs';
import tailwind from '@astrojs/tailwind';
import sitemap, { type SitemapItem, ChangeFreqEnum } from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { rehypePrettyCode } from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code';
import Icons from 'unplugin-icons/vite';
import { SITE_URL } from './src/data/config';
import { remarkReadingTime } from './src/plugins';
import rehypeTableWrapper from './src/plugins/rehype-table-wrapper';
import partytown from '@astrojs/partytown';

const prettyCodeOptions: PrettyCodeOptions = {
  keepBackground: false,
  theme: JSON.parse(fs.readFileSync('./src/data/md-themes/moonlight.json', 'utf8')),
  transformers: [
    transformerCopyButton({
      visibility: 'hover',
      feedbackDuration: 2_500,
    }),
  ],
};

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    mdx(),
    tailwind(),
    sitemap({
      filter: (pageUrl: string) => {
        try {
          const pathname = new URL(pageUrl).pathname;
          // Exclude OG image endpoints and API routes
          if (pathname.startsWith('/open-graph')) return false;
          if (pathname.startsWith('/api/')) return false;
          return true;
        } catch {
          return true;
        }
      },
      customPages: [
        // Add important hierarchical pages that may not be discovered otherwise
        new URL('/posts', SITE_URL).toString(),
        new URL('/planned', SITE_URL).toString(),
        new URL('/til', SITE_URL).toString(),
        new URL('/series', SITE_URL).toString(),
        new URL('/resume', SITE_URL).toString(),
      ],
      serialize: (item: SitemapItem) => {
        // Hint hierarchy via changefreq/priority
        let priority = 0.5;
        let changefreq: ChangeFreqEnum | undefined = undefined;

        const urlStr = item.url || '';
        let pathname = urlStr;
        try {
          pathname = new URL(urlStr).pathname;
        } catch {}
        if (pathname === '/') {
          priority = 1.0;
          changefreq = ChangeFreqEnum.WEEKLY;
        } else if (pathname.endsWith('/posts') || pathname.startsWith('/posts/')) {
          priority = 0.9;
          changefreq = pathname.endsWith('/posts') ? ChangeFreqEnum.DAILY : ChangeFreqEnum.MONTHLY;
        } else if (pathname.endsWith('/til') || pathname.startsWith('/til/')) {
          priority = 0.6;
          changefreq = pathname.endsWith('/til') ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY;
        } else if (pathname.endsWith('/series')) {
          priority = 0.5;
          changefreq = ChangeFreqEnum.WEEKLY;
        } else if (pathname.endsWith('/planned')) {
          priority = 0.4;
          changefreq = ChangeFreqEnum.WEEKLY;
        } else if (pathname.endsWith('/resume')) {
          priority = 0.3;
          changefreq = ChangeFreqEnum.YEARLY;
        }
        return {
          ...item,
          changefreq,
          priority,
        };
      },
    }),
    prefetch(),
    preact({
      compat: true,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeTableWrapper as any],
    remarkPlugins: [remarkReadingTime],
  },
  output: 'server',
  adapter: vercel({}),
  vite: {
    plugins: [
      Icons({
        compiler: 'jsx',
        jsx: 'preact',
        autoInstall: true,
      }),
    ],
  },
});
