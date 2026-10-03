import type { APIRoute } from 'astro';
import { isTeamAuthenticated, createShareLink } from '../../../lib/team-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) {
    return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // body is optional - defaults below cover it
  }

  const label = String(body.label ?? 'Guest').trim();
  const hoursValid = 48;

  const token = await createShareLink(label, hoursValid);
  const url = `https://www.samghanemcmo.com/team/share/${token}`;

  return new Response(JSON.stringify({ success: true, url, expiresInHours: hoursValid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
