import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { isAuthenticated } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Not authenticated. Log into /dashboard first.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = process.env.NOTIFY_EMAIL_USER;
  const pass = process.env.NOTIFY_EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return new Response(
      JSON.stringify({ error: 'NOTIFY_EMAIL_USER or NOTIFY_EMAIL_APP_PASSWORD is missing.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Verify the connection/credentials before attempting to send.
    await transporter.verify();

    await transporter.sendMail({
      from: `"Dashboard Test" <${user}>`,
      to: user,
      subject: 'Test email from samghanemcmo.com',
      text: 'If you got this, email notifications are working correctly.',
    });

    return new Response(JSON.stringify({ success: true, message: 'Test email sent successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
