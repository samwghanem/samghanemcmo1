import { createPool } from '@vercel/postgres';

export type LeadStatus = 'new' | 'reviewing' | 'approved' | 'call_booked' | 'client' | 'not_a_fit';

export interface Lead {
  id: number;
  name: string;
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
const pool = createPool({ connectionString: process.env.POSTGRES_DATABASE_URL });
const sql = pool.sql.bind(pool);

// Creates the leads table if it doesn't already exist, and safely adds the
// `name` column to any existing table from before this field existed -
// nullable so it doesn't break the handful of test rows already in there.
export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT,
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
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS name TEXT;`;
}

export async function insertLead(data: {
  name: string;
  company: string;
  revenueRange: string;
  role: string;
  problem: string;
  email: string;
  phone?: string;
}): Promise<Lead> {
  await ensureSchema();
  const result = await sql<Lead>`
    INSERT INTO leads (name, company, revenue_range, role, problem, email, phone)
    VALUES (${data.name}, ${data.company}, ${data.revenueRange}, ${data.role}, ${data.problem}, ${data.email}, ${data.phone ?? null})
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

export async function getLeadById(id: number): Promise<Lead | null> {
  const result = await sql<Lead>`
    SELECT * FROM leads WHERE id = ${id};
  `;
  return result.rows[0] ?? null;
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<Lead | null> {
  const result = await sql<Lead>`
    UPDATE leads SET status = ${status} WHERE id = ${id} RETURNING *;
  `;
  return result.rows[0] ?? null;
}

export async function deleteLead(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM leads WHERE id = ${id};
  `;
  return (result.rowCount ?? 0) > 0;
}
