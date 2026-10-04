import { waitUntil } from '@vercel/functions';
import { completeJob, failJob } from './team-db';
import { runJob } from './team-engine';

// Runs a job in the background. The caller returns to the browser right away,
// so the job shows up on the board as "Being made" while this finishes.
// waitUntil keeps the server function alive until the work is done.
export function startJob(jobId: number, roleKey: string, request: string): void {
  const work = (async () => {
    try {
      const resultText = await runJob(roleKey, request);
      await completeJob(jobId, resultText);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Team job ${jobId} failed:`, message);
      await failJob(jobId, message);
    }
  })();
  waitUntil(work);
}
