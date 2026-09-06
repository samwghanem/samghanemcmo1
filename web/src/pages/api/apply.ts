import type { APIRoute } from 'astro';
import { insertLead } from '../../lib/db';
import { sendLeadNotification } from '../../lib/email';

export const prerender = false;

const VALID_REVENUE_RANGES = new Set([
  'under-10m',
  '10m-50m',
  '50m-100m',
  '100m-200m',
  'over-200m',
]);

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const company = String(body.company ?? '').trim();
  const revenueRange = String(body.revenueRange ?? '').trim();
  const role = String(body.role ?? '').trim();
  const problem = String(body.problem ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = body.phone ? String(body.phone).trim() : undefined;

  // Basic server-side validation - never trust the client alone.
  if (!company || !role || !problem || !email) {
    return new Response(
      JSON.stringify({ error: 'Company, role, problem, and email are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!VALID_REVENUE_RANGES.has(revenueRange)) {
    return new Response(JSON.stringify({ error: 'Invalid revenue range.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const lead = await insertLead({ company, revenueRange, role, problem, email, phone });

    // Don't let an email hiccup fail the whole submission - the lead is
    // already saved. Log it so it's visible in Vercel's function logs.
    try {
      await sendLeadNotification(lead);
    } catch (emailErr) {
      console.error('Lead saved but notification email failed:', emailErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to save lead:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again or email directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
