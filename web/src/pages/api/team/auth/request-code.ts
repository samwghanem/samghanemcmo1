import type { APIRoute } from 'astro';
import { isAllowedEmail, requestLoginCode } from '../../../../lib/team-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isAllowedEmail(email)) {
    return new Response(
      JSON.stringify({ error: 'Only @iamsamghanem.com email addresses can access this dashboard.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await requestLoginCode(email);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Failed to send login code:', message);
    return new Response(JSON.stringify({ error: 'Failed to send login code. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
