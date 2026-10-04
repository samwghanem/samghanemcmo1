import type { APIRoute } from 'astro';
import { isTeamAuthenticated } from '../../../lib/team-auth';
import { failStaleJobs, getRunningCount } from '../../../lib/team-db';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) {
    return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  await failStaleJobs();
  const running = await getRunningCount();
  return new Response(JSON.stringify({ running, checkedAt: new Date().toISOString() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
