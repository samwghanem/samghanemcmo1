import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { updateLeadStatus, getLeadById, deleteLead, type LeadStatus } from '../../../lib/db';
import { sendApprovalBookingEmail } from '../../../lib/email';

export const prerender = false;

const VALID_STATUSES: LeadStatus[] = [
  'new',
  'reviewing',
  'approved',
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

  // Check the lead's current status before updating, so we only fire the
  // approval email the moment it *changes* to "approved" - not every time
  // the card is re-saved while already in that column.
  const before = await getLeadById(id);
  if (!before) {
    return new Response(JSON.stringify({ error: 'Lead not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const isNewlyApproved = status === 'approved' && before.status !== 'approved';

  const updated = await updateLeadStatus(id, status);
  if (!updated) {
    return new Response(JSON.stringify({ error: 'Lead not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (isNewlyApproved) {
    try {
      await sendApprovalBookingEmail(updated);
    } catch (emailErr) {
      console.error('Status updated but approval booking email failed:', emailErr);
    }
  }

  return new Response(JSON.stringify({ success: true, lead: updated }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
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

  const deleted = await deleteLead(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Lead not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
