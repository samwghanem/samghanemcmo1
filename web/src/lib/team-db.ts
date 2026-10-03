import { createPool } from '@vercel/postgres';

export type JobStatus = 'running' | 'waiting_on_sam' | 'approved' | 'rejected' | 'error';

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
    SET status = 'waiting_on_sam', result = ${resultText}, completed_at = now()
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

export async function setJobDecision(
  id: number,
  decision: 'approved' | 'rejected'
): Promise<TeamJob | null> {
  const result = await sql<TeamJob>`
    UPDATE team_jobs SET status = ${decision} WHERE id = ${id} RETURNING *;
  `;
  return result.rows[0] ?? null;
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
