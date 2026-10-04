import { createPool } from '@vercel/postgres';

export type JobStatus = 'running' | 'done' | 'error';

export interface TeamJob {
  id: number;
  role_key: string;
  department: string;
  request: string;
  status: JobStatus;
  result: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

const pool = createPool({ connectionString: process.env.POSTGRES_DATABASE_URL });
const sql = pool.sql.bind(pool);

export async function ensureTeamSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS team_jobs (
      id SERIAL PRIMARY KEY,
      role_key TEXT NOT NULL,
      department TEXT NOT NULL,
      request TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'running',
      result TEXT,
      error_message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      completed_at TIMESTAMPTZ
    );
  `;
  // Jobs used to wait for Sam's approval. They now finish as 'done', so fold
  // any older review-era rows into that status.
  await sql`UPDATE team_jobs SET status = 'done' WHERE status IN ('waiting_on_sam', 'approved', 'rejected');`;
}

export async function createJob(data: {
  roleKey: string;
  department: string;
  request: string;
}): Promise<TeamJob> {
  await ensureTeamSchema();
  const result = await sql<TeamJob>`
    INSERT INTO team_jobs (role_key, department, request, status)
    VALUES (${data.roleKey}, ${data.department}, ${data.request}, 'running')
    RETURNING *;
  `;
  return result.rows[0];
}

export async function completeJob(id: number, resultText: string): Promise<TeamJob | null> {
  const result = await sql<TeamJob>`
    UPDATE team_jobs
    SET status = 'done', result = ${resultText}, error_message = NULL, completed_at = now()
    WHERE id = ${id}
    RETURNING *;
  `;
  return result.rows[0] ?? null;
}

export async function failJob(id: number, errorMessage: string): Promise<TeamJob | null> {
  const result = await sql<TeamJob>`
    UPDATE team_jobs
    SET status = 'error', error_message = ${errorMessage}, completed_at = now()
    WHERE id = ${id}
    RETURNING *;
  `;
  return result.rows[0] ?? null;
}

// Puts a failed job back in the 'running' state so it can be run again.
export async function restartJob(id: number): Promise<TeamJob | null> {
  const result = await sql<TeamJob>`
    UPDATE team_jobs
    SET status = 'running', error_message = NULL, result = NULL, completed_at = NULL, created_at = now()
    WHERE id = ${id}
    RETURNING *;
  `;
  return result.rows[0] ?? null;
}

// A job that has been 'running' for 5+ minutes was cut off (for example the
// server timed out). Mark it failed so it never sits in "Being made" forever.
export async function failStaleJobs(): Promise<void> {
  await sql`
    UPDATE team_jobs
    SET status = 'error',
        error_message = 'This job timed out before it finished. Press Retry to run it again.',
        completed_at = now()
    WHERE status = 'running' AND created_at < now() - interval '5 minutes';
  `;
}

export async function getRunningCount(): Promise<number> {
  const result = await sql`SELECT COUNT(*)::int AS n FROM team_jobs WHERE status = 'running';`;
  return result.rows[0]?.n ?? 0;
}

export async function getAllJobs(): Promise<TeamJob[]> {
  await ensureTeamSchema();
  const result = await sql<TeamJob>`
    SELECT * FROM team_jobs ORDER BY created_at DESC;
  `;
  return result.rows;
}

export async function getJobById(id: number): Promise<TeamJob | null> {
  const result = await sql<TeamJob>`SELECT * FROM team_jobs WHERE id = ${id};`;
  return result.rows[0] ?? null;
}

export async function deleteJob(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM team_jobs WHERE id = ${id};`;
  return (result.rowCount ?? 0) > 0;
}
