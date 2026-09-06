import type { APIRoute } from 'astro';

export const prerender = false;

// Reports which required environment variables are present at runtime,
// without ever exposing their actual values. Useful for diagnosing
// configuration issues without guessing through screenshots.
export const GET: APIRoute = async () => {
  const status = {
    DASHBOARD_PASSWORD: Boolean(process.env.DASHBOARD_PASSWORD),
    NOTIFY_EMAIL_USER: Boolean(process.env.NOTIFY_EMAIL_USER),
    NOTIFY_EMAIL_APP_PASSWORD: Boolean(process.env.NOTIFY_EMAIL_APP_PASSWORD),
    POSTGRES_DATABASE_URL: Boolean(process.env.POSTGRES_DATABASE_URL),
  };

  return new Response(JSON.stringify(status, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
