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
    return new Response(JSON.stringify({ upvotes: 0 }), { status: 200 });
  }

  try {
    const upvotes = await kv.hget(`post:${slug}`, 'upvotes');
    return new Response(JSON.stringify({ upvotes: Number(upvotes) || 0 }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ upvotes: 0 }), { status: 200 });
  }
};

export const POST: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) return new Response(null, { status: 404 });

  if (!isKvConfigured) {
    return new Response(JSON.stringify({ upvotes: 1 }), { status: 200 });
  }

  try {
    const upvotes = await kv.hget(`post:${slug}`, 'upvotes');
    await kv.hincrby(`post:${slug}`, 'upvotes', 1);
    return new Response(JSON.stringify({ upvotes: Number(upvotes) + 1 || 1 }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ upvotes: 0 }), { status: 200 });
  }
};
