import type { APIRoute } from 'astro';
import { isTeamAuthenticated, createShareLink, getTeamSessionEmail } from '../../../lib/team-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) {
    return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // A guest session must not be able to create more guest links, or one
  // 48-hour link could be chained into permanent access.
  const sessionEmail = await getTeamSessionEmail(cookies);
  if (!sessionEmail || sessionEmail.startsWith('guest:')) {
    return new Response(JSON.stringify({ error: 'Only a signed-in team member can create guest links.' }), {
      status: 403,
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
