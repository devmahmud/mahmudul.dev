import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '@/data/config';

export const prerender = true;

const escapeXml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.planned)
    .sort((a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime())
    .slice(0, 50);

  const items = posts
    .map((post) => {
      const url = new URL(`/posts/${post.slug}/`, SITE_URL).toString();
      const title = escapeXml(post.data.title);
      const description = escapeXml(post.data.description || '');
      const pubDate = new Date(post.data.publishedAt).toUTCString();
      return `\n    <item>\n      <title>${title}</title>\n      <link>${url}</link>\n      <guid>${url}</guid>\n      <description>${description}</description>\n      <pubDate>${pubDate}</pubDate>\n    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Mahmudul Alam</title>\n    <link>${SITE_URL}</link>\n    <description>Latest posts from Mahmudul Alam</description>\n    <language>en</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}\n  </channel>\n</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  });
};
