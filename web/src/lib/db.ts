import { createPool } from '@vercel/postgres';

export type LeadStatus = 'new' | 'reviewing' | 'call_booked' | 'client' | 'not_a_fit';

export interface Lead {
  id: number;
  company: string;
  revenue_range: string;
  role: string;
  problem: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  created_at: string;
}

// Vercel's Postgres marketplace integration (via Neon) named the connection
// string POSTGRES_DATABASE_URL for this project (prefix "POSTGRES" + Neon's
// default "DATABASE_URL"), not the plain POSTGRES_URL @vercel/postgres
// defaults to - so we point it there explicitly instead.
const pool = createPool({ connectionString: import.meta.env.POSTGRES_DATABASE_URL });
const sql = pool.sql.bind(pool);

// Creates the leads table if it doesn't already exist. Safe to call on every
// cold start - CREATE TABLE IF NOT EXISTS is a no-op once the table is there.
export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      company TEXT NOT NULL,
      revenue_range TEXT NOT NULL,
      role TEXT NOT NULL,
      problem TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
}

export async function insertLead(data: {
  company: string;
  revenueRange: string;
  role: string;
  problem: string;
  email: string;
  phone?: string;
}): Promise<Lead> {
  await ensureSchema();
  const result = await sql<Lead>`
    INSERT INTO leads (company, revenue_range, role, problem, email, phone)
    VALUES (${data.company}, ${data.revenueRange}, ${data.role}, ${data.problem}, ${data.email}, ${data.phone ?? null})
    RETURNING *;
  `;
  return result.rows[0];
}

export async function getAllLeads(): Promise<Lead[]> {
  await ensureSchema();
  const result = await sql<Lead>`
    SELECT * FROM leads ORDER BY created_at DESC;
  `;
  return result.rows;
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<Lead | null> {
  const result = await sql<Lead>`
    UPDATE leads SET status = ${status} WHERE id = ${id} RETURNING *;
  `;
  return result.rows[0] ?? null;
}
