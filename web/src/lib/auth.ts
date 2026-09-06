import { createHash } from 'node:crypto';
import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'dashboard_auth';
const SALT = 'samghanemcmo-dashboard-v1';

function hashPassword(password: string): string {
  return createHash('sha256').update(password + SALT).digest('hex');
}

export function checkPassword(candidate: string): boolean {
  const correct = process.env.DASHBOARD_PASSWORD;
  if (!correct) {
    throw new Error('Missing DASHBOARD_PASSWORD environment variable.');
  }
  return candidate === correct;
}

export function setAuthCookie(cookies: AstroCookies) {
  const correct = process.env.DASHBOARD_PASSWORD;
  cookies.set(COOKIE_NAME, hashPassword(correct), {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearAuthCookie(cookies: AstroCookies) {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const correct = process.env.DASHBOARD_PASSWORD;
  if (!correct) return false;
  const cookie = cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  return cookie === hashPassword(correct);
}
