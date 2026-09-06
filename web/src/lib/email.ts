import nodemailer from 'nodemailer';
import type { Lead } from './db';

// Sends via the site owner's own email account (Gmail or Google Workspace),
// authenticated with an app-specific password. No third-party email service
// involved - this is just her own inbox sending the message.
function getTransporter() {
  const user = import.meta.env.NOTIFY_EMAIL_USER;
  const pass = import.meta.env.NOTIFY_EMAIL_APP_PASSWORD;

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

export async function sendLeadNotification(lead: Lead) {
  const to = import.meta.env.NOTIFY_EMAIL_USER;
  const transporter = getTransporter();

  const revenueLabels: Record<string, string> = {
    'under-10m': 'Under $10M',
    '10m-50m': '$10M - $50M',
    '50m-100m': '$50M - $100M',
    '100m-200m': '$100M - $200M',
    'over-200m': 'Over $200M',
  };

  await transporter.sendMail({
    from: `"Fractional CMO Applications" <${import.meta.env.NOTIFY_EMAIL_USER}>`,
    to,
    replyTo: lead.email,
    subject: `New Application: ${lead.company}`,
    text: `
New application received.

Company: ${lead.company}
Revenue Range: ${revenueLabels[lead.revenue_range] ?? lead.revenue_range}
Role: ${lead.role}
Email: ${lead.email}
Phone: ${lead.phone ?? '(not provided)'}

The Problem:
${lead.problem}

View and manage this applicant in your dashboard: https://www.samghanemcmo.com/dashboard
    `.trim(),
  });
}
