import type { APIRoute } from 'astro';

// Ensure this is served dynamically so the redirect works on the server
export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 301,
    headers: {
      Location: '/sitemap-index.xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
