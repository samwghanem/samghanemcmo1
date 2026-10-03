import { createPool } from '@vercel/postgres';
import { randomInt, randomBytes } from 'node:crypto';
import type { AstroCookies } from 'astro';
import nodemailer from 'nodemailer';

const pool = createPool({ connectionString: process.env.POSTGRES_DATABASE_URL });
const sql = pool.sql.bind(pool);

const SESSION_COOKIE = 'team_session';
const ALLOWED_DOMAIN = '@samghanemcmo.com';
const CODE_TTL_MINUTES = 10;
const SESSION_TTL_DAYS = 14;

export async function ensureAuthSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS team_login_codes (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS team_sessions (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
}

export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().trim().endsWith(ALLOWED_DOMAIN);
}

export async function requestLoginCode(email: string): Promise<void> {
  await ensureAuthSchema();
  const normalizedEmail = email.toLowerCase().trim();
  const code = randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await sql`
    INSERT INTO team_login_codes (email, code, expires_at)
    VALUES (${normalizedEmail}, ${code}, ${expiresAt.toISOString()});
  `;

  const user = process.env.NOTIFY_EMAIL_USER;
  const pass = process.env.NOTIFY_EMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error('Missing NOTIFY_EMAIL_USER or NOTIFY_EMAIL_APP_PASSWORD environment variables.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Sam Ghanem, CMO - The Floor" <${user}>`,
    to: normalizedEmail,
    subject: `Your login code: ${code}`,
    text: `Your login code for The Floor is: ${code}\n\nThis code expires in ${CODE_TTL_MINUTES} minutes. If you didn't request this, you can ignore this email.`,
  });
}

export async function verifyLoginCode(email: string, code: string): Promise<string | null> {
  await ensureAuthSchema();
  const normalizedEmail = email.toLowerCase().trim();

  const result = await sql`
    SELECT * FROM team_login_codes
    WHERE email = ${normalizedEmail}
      AND code = ${code}
      AND used_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  if (result.rows.length === 0) {
    return null;
  }

  await sql`UPDATE team_login_codes SET used_at = now() WHERE id = ${result.rows[0].id};`;

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO team_sessions (token, email, expires_at)
    VALUES (${token}, ${normalizedEmail}, ${expiresAt.toISOString()});
  `;

  return token;
}

export function setTeamSessionCookie(cookies: AstroCookies, token: string) {
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export function clearTeamSessionCookie(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function isTeamAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  await ensureAuthSchema();
  const result = await sql`
    SELECT * FROM team_sessions WHERE token = ${token} AND expires_at > now();
  `;
  return result.rows.length > 0;
}

export async function getTeamSessionEmail(cookies: AstroCookies): Promise<string | null> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = await sql`
    SELECT email FROM team_sessions WHERE token = ${token} AND expires_at > now();
  `;
  return result.rows[0]?.email ?? null;
}
