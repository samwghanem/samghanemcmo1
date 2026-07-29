# samghanemcmo.com

Fractional CMO site for Sam Ghanem. Stack: Astro + Sanity CMS + Vercel + GitHub.
Built from the Web Dev Step 1 master plan (`samghanemcmo-master-plan.md`).

## Structure

- `web/` - Astro static site (6 pages: Home, How It Works, Results, About, Apply, Privacy Policy)
- `studio/` - Sanity Studio (schemas: siteSettings, navigation, page, testimonial, faq)

## Status (as of initial scaffold)

- [x] Astro app scaffolded, builds clean (`npm run build` in `web/`)
- [x] All 6 pages implemented per master plan copy
- [x] Sanity schemas written and registered
- [x] Seed script written (idempotent, reads `SANITY_TOKEN` from env)
- [ ] Sanity project created (sanity.io/manage) - **not done, requires browser/account access**
- [ ] Studio deployed (`npx sanity deploy`) - **not done, blocked on project creation**
- [ ] Robot API token generated and stored in `studio/.env` - **not done**
- [ ] Vercel project linked (`vercel link --project samghanemcmo`) - **not done, requires account access**
- [ ] GitHub repo connected to Vercel for auto-deploy from `main`
- [ ] Apply form destination decided (native Sanity form / Typeform / Calendly) - **pending, see master plan handoff note**
- [ ] Analytics IDs (GA4, Meta Pixel) - **not yet provided**
- [ ] Real client testimonials to replace Results page placeholder
- [ ] DNS cutover to samghanemcmo.com

## Setup (remaining steps - require your Sanity/Vercel accounts)

### 1. Sanity

```
cd studio
npm install
npx sanity init --project-plan free --create-project "Sam Ghanem CMO" --dataset production
```

This gives you a real `projectId`. Replace `REPLACE_WITH_PROJECT_ID` in:
- `studio/sanity.cli.ts`
- `studio/sanity.config.ts`
- `web/src/lib/sanity.ts` (via `SANITY_PROJECT_ID` env var, or edit the fallback directly)

Then:

```
npx sanity deploy
```

Verify `https://samghanemcmo.sanity.studio` returns 200.

Create a robot "Editor" token at sanity.io/manage → your project → API → Tokens.
Add it to `studio/.env`:

```
SANITY_PROJECT_ID=<your-project-id>
SANITY_TOKEN=<your-robot-token>
```

Then seed:

```
npm run seed
```

### 2. Vercel

```
cd web
vercel link --yes --project samghanemcmo
```

Do NOT run bare `vercel link --yes` without `--project` - it will silently
create a new project named after the folder.

Connect the GitHub repo in the Vercel dashboard for auto-deploy from `main`,
set root directory to `web/`. Add `SANITY_PROJECT_ID` as an env var.

### 3. Sanity → Vercel deploy webhook

In Sanity Studio: Settings → API → Webhooks → create a webhook pointed at the
Vercel Deploy Hook URL (Vercel Project Settings → Git → Deploy Hooks). Filter
on `page`, `siteSettings`, `navigation`, `testimonial`, `faq` document types.
Without this, every content edit requires a manual redeploy.

### 4. DNS cutover

Only after the production URL renders correctly on the `*.vercel.app` domain.
Leave MX/SPF/DKIM records untouched.
