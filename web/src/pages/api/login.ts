import type { APIRoute } from 'astro';
import { checkPassword, setAuthCookie } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const password = String(body.password ?? '');

  if (!checkPassword(password)) {
    return new Response(JSON.stringify({ error: 'Incorrect password.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAuthCookie(cookies);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
