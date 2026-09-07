import nodemailer from 'nodemailer';
import type { Lead } from './db';

function getTransporter() {
  const user = process.env.NOTIFY_EMAIL_USER;
  const pass = process.env.NOTIFY_EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      'Missing NOTIFY_EMAIL_USER or NOTIFY_EMAIL_APP_PASSWORD environment variables.'
    );
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

const REVENUE_LABELS: Record<string, string> = {
  'under-10m': 'Under $10M',
  '10m-50m': '$10M - $50M',
  '50m-100m': '$50M - $100M',
  '100m-200m': '$100M - $200M',
  'over-200m': 'Over $200M',
};

// Internal notification to the site owner when a new application comes in.
export async function sendLeadNotification(lead: Lead) {
  const to = process.env.NOTIFY_EMAIL_USER;
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Fractional CMO Applications" <${process.env.NOTIFY_EMAIL_USER}>`,
    to,
    replyTo: lead.email,
    subject: `New Application: ${lead.company}`,
    text: `
New application received.

Name: ${lead.name}
Company: ${lead.company}
Revenue Range: ${REVENUE_LABELS[lead.revenue_range] ?? lead.revenue_range}
Role: ${lead.role}
Email: ${lead.email}
Phone: ${lead.phone ?? '(not provided)'}

The Problem:
${lead.problem}

View and manage this applicant in your dashboard: https://www.samghanemcmo.com/dashboard
    `.trim(),
  });
}

// Sent to the applicant immediately after they submit, confirming receipt
// and setting expectations for what happens next.
export async function sendApplicantReceivedEmail(lead: Lead) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Sam Ghanem" <${process.env.NOTIFY_EMAIL_USER}>`,
    to: lead.email,
    subject: 'Your application has been received',
    text: `
Hi ${lead.name},

Thanks for applying. This isn't a queue that runs through an assistant or an algorithm - I review every application personally.

Here's what happens next: I'll go through what you shared about ${lead.company} and get back to you directly within 3-5 business days, whether it's a fit or not. If it looks like a fit, you'll get a follow-up email with a link to book time directly on my calendar. If it's not, I'll tell you that too, so you're not left waiting.

Talk soon,
Sam Ghanem
    `.trim(),
  });
}

// Sent to the applicant once the site owner moves them to "Approved" -
// includes the calendar link so they can book a call directly.
export async function sendApprovalBookingEmail(lead: Lead) {
  const transporter = getTransporter();
  const calendarUrl = process.env.CALENDAR_BOOKING_URL;

  if (!calendarUrl) {
    throw new Error('Missing CALENDAR_BOOKING_URL environment variable.');
  }

  await transporter.sendMail({
    from: `"Sam Ghanem" <${process.env.NOTIFY_EMAIL_USER}>`,
    to: lead.email,
    subject: "Let's find time to talk",
    text: `
Hi ${lead.name},

Good news - based on what you shared about ${lead.company}, this looks like a fit worth a real conversation.

Here's my calendar - grab whatever time works for you:
${calendarUrl}

Talk soon,
Sam Ghanem
    `.trim(),
  });
}
