import type { APIRoute } from 'astro';
import { verifyLoginCode, setTeamSessionCookie } from '../../../../lib/team-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = String(body.email ?? '').trim();
  const code = String(body.code ?? '').trim();

  if (!email || !code) {
    return new Response(JSON.stringify({ error: 'Email and code are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = await verifyLoginCode(email, code);
  if (!token) {
    return new Response(JSON.stringify({ error: 'Invalid or expired code.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setTeamSessionCookie(cookies, token);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
