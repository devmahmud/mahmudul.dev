import type { APIRoute } from 'astro';
import { createClient } from '@vercel/kv';

export const prerender = false;

const { KV_REST_API_URL, KV_REST_API_TOKEN } = import.meta.env;

const isKvConfigured = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
const kv = isKvConfigured
  ? createClient({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN })
  : (null as unknown as ReturnType<typeof createClient>);

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) return new Response(null, { status: 404 });

  if (!isKvConfigured) {
    return new Response(JSON.stringify({ views: 0 }), { status: 200 });
  }

  try {
    const views = await kv.hget(`post:${slug}`, 'views');
    return new Response(JSON.stringify({ views: Number(views) || 0 }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ views: 0 }), { status: 200 });
  }
};

export const POST: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) return new Response(null, { status: 404 });

  if (!isKvConfigured) {
    return new Response(JSON.stringify({ views: 1 }), { status: 200 });
  }

  try {
    const views = await kv.hget(`post:${slug}`, 'views');
    await kv.hincrby(`post:${slug}`, 'views', 1);
    return new Response(JSON.stringify({ views: Number(views) + 1 || 1 }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ views: 0 }), { status: 200 });
  }
};
