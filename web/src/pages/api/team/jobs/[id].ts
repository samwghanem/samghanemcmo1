import type { APIRoute } from 'astro';
import { isTeamAuthenticated } from '../../../../lib/team-auth';
import { deleteJob, getJobById, restartJob } from '../../../../lib/team-db';
import { startJob } from '../../../../lib/team-runner';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Retry a failed job: put it back in "Being made" and run it again.
export const POST: APIRoute = async ({ params, cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) return json({ error: 'Not authenticated.' }, 401);

  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: 'Invalid job id.' }, 400);

  const existing = await getJobById(id);
  if (!existing) return json({ error: 'Job not found.' }, 404);
  if (existing.status !== 'error') return json({ error: 'Only failed jobs can be retried.' }, 400);

  const job = await restartJob(id);
  if (!job) return json({ error: 'Job not found.' }, 404);

  startJob(job.id, job.role_key, job.request);
  return json({ success: true, job }, 202);
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!(await isTeamAuthenticated(cookies))) return json({ error: 'Not authenticated.' }, 401);

  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: 'Invalid job id.' }, 400);

  const deleted = await deleteJob(id);
  if (!deleted) return json({ error: 'Job not found.' }, 404);
  return json({ success: true });
};
