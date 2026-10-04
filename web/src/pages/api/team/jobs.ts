import type { APIRoute } from 'astro';
import { isTeamAuthenticated } from '../../../lib/team-auth';
import { createJob } from '../../../lib/team-db';
import { getMember } from '../../../lib/team-roster';
import { startJob } from '../../../lib/team-runner';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) {
    return json({ error: 'Not authenticated.' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const roleKey = String(body.roleKey ?? '').trim();
  const jobRequest = String(body.request ?? '').trim();

  const member = getMember(roleKey);
  if (!member) return json({ error: 'Unknown team role.' }, 400);
  if (!jobRequest) return json({ error: 'A request description is required.' }, 400);

  const job = await createJob({ roleKey, department: member.department, request: jobRequest });

  // Kick the work off in the background and answer right away.
  startJob(job.id, roleKey, jobRequest);

  return json({ success: true, job }, 202);
};
