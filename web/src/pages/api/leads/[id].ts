import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { updateLeadStatus, type LeadStatus } from '../../../lib/db';

export const prerender = false;

const VALID_STATUSES: LeadStatus[] = [
  'new',
  'reviewing',
  'call_booked',
  'client',
  'not_a_fit',
];

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Not authenticated.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return new Response(JSON.stringify({ error: 'Invalid lead id.' }), {
      status: 400,
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

  const status = String(body.status ?? '') as LeadStatus;
  if (!VALID_STATUSES.includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const updated = await updateLeadStatus(id, status);
  if (!updated) {
    return new Response(JSON.stringify({ error: 'Lead not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, lead: updated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
