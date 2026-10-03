import type { APIRoute } from 'astro';
import { isTeamAuthenticated } from '../../../lib/team-auth';
import { createJob, completeJob, failJob } from '../../../lib/team-db';
import { getMember } from '../../../lib/team-roster';
import { runJob } from '../../../lib/team-engine';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) {
    return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const roleKey = String(body.roleKey ?? '').trim();
  const jobRequest = String(body.request ?? '').trim();

  const member = getMember(roleKey);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unknown team role.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!jobRequest) {
    return new Response(JSON.stringify({ error: 'A request description is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const job = await createJob({
    roleKey,
    department: member.department,
    request: jobRequest,
  });

  try {
    const resultText = await runJob(roleKey, jobRequest);
    const updated = await completeJob(job.id, resultText);
    return new Response(JSON.stringify({ success: true, job: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await failJob(job.id, message);
    return new Response(JSON.stringify({ error: `Job failed: ${message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
