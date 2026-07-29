# SamGhanemCMO.com - Master Build Document
Prepared via Web Dev Step 1: The Architect
Handoff target: Web Dev Step 2 - Project Startup (Astro + Sanity + Vercel + GitHub)

---

## 1. BUSINESS SNAPSHOT

**Business name:** Sam Ghanem, Fractional CMO (brand: IASG)
**Founder:** Sam Ghanem (she/her)
**Production domain:** samghanemcmo.com
**Working slug:** samghanemcmo

**Positioning:** Fractional CMO for companies doing $10M-$200M in annual revenue. Not a generalist marketing consultant - a filtered, high-ticket offer for businesses past the "we need a marketing person" stage and into the "we need someone who can run marketing like an executive" stage.

**Founder credibility stack:**
- Founder and CMO of SG INK, a full-service printing, branding, and marketing agency (team of 21, second Orlando division in development). Career began in 2002.
- Enterprise brand clients through SG INK: Lockheed Martin, IBM, Danaher, Mercedes-Benz, Carrier, Thermo Fisher
- Utilizes the StoryBrand framework in her messaging work
- TEDx speaker (TEDxApex - "It's Contagious - The Way You Treat Yourself Spreads")
- MIBA, minors in Marketing and Spanish
- Mentored by Ken "Spanky" Moskowitz, founder of Ad Zombies (40+ years in advertising, $460B+ in client revenue generated, 100,000+ ads created, 10 Super Bowl campaigns)
- Proprietary frameworks: Congruent Brands Convert, The Why Pathway, Magnetic Marketing
- Core philosophy: most businesses have a messaging problem, not a marketing problem - brand congruence drives conversion

**Brand voice:** Bold, direct-response. Confident, filtered, zero corporate filler. Short sentences. No em dashes (use periods or colons instead). Sounds like a strategist talking to a peer CEO, not an agency pitching a prospect.

**Location:** Orlando, FL (recently relocated from South Florida)

**Site personality:** Bold direct-response, modeled on the Ad Zombies structural pattern - credibility-first, mechanism-driven, gated by qualification, not a generic services brochure.

---

## 2. TECH STACK ARCHITECTURE

Default stack: **Astro + Sanity CMS + Vercel + GitHub**

### Repository file tree

```
samghanemcmo/
├── .gitignore
├── README.md
├── web/
│   ├── astro.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── og-default.jpg
│   └── src/
│       ├── layouts/
│       │   └── BaseLayout.astro
│       ├── components/
│       │   ├── Header.astro
│       │   ├── Footer.astro
│       │   ├── CTAButton.astro
│       │   ├── ProofBar.astro
│       │   ├── QualificationGate.astro
│       │   └── FAQAccordion.astro
│       ├── lib/
│       │   └── sanity.ts
│       └── pages/
│           ├── index.astro
│           ├── how-it-works.astro
│           ├── results.astro
│           ├── about.astro
│           ├── apply.astro
│           └── privacy-policy.astro
└── studio/
    ├── sanity.config.ts
    ├── sanity.cli.ts
    ├── package.json
    ├── schemas/
    │   ├── index.ts
    │   ├── siteSettings.ts
    │   ├── navigation.ts
    │   ├── page.ts
    │   ├── testimonial.ts
    │   └── faq.ts
    └── scripts/
        └── seed.ts
```

### astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://samghanemcmo.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
});
```

### package.json (web/)

```json
{
  "name": "samghanemcmo-web",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/sitemap": "^3.1.0",
    "@sanity/client": "^6.21.0",
    "@sanity/image-url": "^1.0.2"
  }
}
```

### src/lib/sanity.ts

```ts
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

---

## 3. SANITY CMS SCHEMA

### schemas/siteSettings.ts (singleton)
- `title` (string)
- `defaultDescription` (text)
- `phone` (string) - optional, not primary CTA channel for this brand
- `applyUrl` (string) - link to apply form/Calendly/Typeform
- `socialLinks` (array of {platform, url})
- `logo` (image)
- `ogImage` (image)

### schemas/navigation.ts (singleton)
- `items` (array of {label, path})

### schemas/page.ts
- `title` (string)
- `slug` (slug)
- `seoTitle` (string)
- `seoDescription` (text)
- `noindex` (boolean, default false)
- `hero` (object: eyebrow, headline, subheadline, ctaLabel, ctaUrl)
- `sections` (array of blocks: richText, statBlock, proofBlock, mechanismStep, qualificationGate, faqBlock)

### schemas/testimonial.ts
- `clientName` (string)
- `clientCompany` (string)
- `quote` (text)
- `resultStat` (string, e.g. "$2.4M added pipeline in 90 days")
- `logo` (image, optional)

### schemas/faq.ts
- `question` (string)
- `answer` (text)
- `page` (reference to page, so FAQs can be scoped per page)

Register every schema in `schemas/index.ts` and the structure sidebar in `sanity.config.ts` in the same commit it's created, per the Iron Rules in Step 2.

---

## 4. VERCEL.JSON REDIRECT MAP

No prior live site exists at samghanemcmo.com - this is a greenfield build, so there is no legacy URL migration required. `vercel.json` ships with an empty redirect array as scaffold, ready for future use:

```json
{
  "redirects": []
}
```

---

## 5. GLOBAL SCHEMA JSON (structured data)

Use `@type: ProfessionalService` (Sam operates a personal fractional-executive practice, not a local storefront business), plus `Person` for founder authority signal.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Sam Ghanem, Fractional CMO",
  "url": "https://samghanemcmo.com",
  "founder": {
    "@type": "Person",
    "name": "Sam Ghanem",
    "jobTitle": "Fractional CMO",
    "sameAs": [
      "https://www.linkedin.com/in/samghanem"
    ]
  },
  "areaServed": "US",
  "description": "Fractional CMO services for companies generating $10M-$200M in annual revenue."
}
```

Add `FAQPage` schema on any page carrying the FAQ block, and `BreadcrumbList` on all non-home pages.

---

## 6. SEO PRESERVATION REQUIREMENTS

Since this is greenfield, there's no legacy SEO equity to preserve. Requirements instead focus on launching correctly the first time:

1. GA4 measurement ID - wire into BaseLayout analytics slot once provided
2. Meta Pixel ID - wire into BaseLayout once provided (likely relevant given DR-style paid traffic plans)
3. LinkedIn Insight Tag - high relevance given B2B executive audience
4. Canonical tags on every page, built from `https://samghanemcmo.com`
5. OG/Twitter card tags on every page, using page-specific `ogImage` where set, falling back to `og-default.jpg`
6. Favicon and site icon set
7. `robots.txt` allowing full indexing except any future `/thank-you` confirmation page

---

## 7. COMPLETE COPY - ALL PAGES

### PAGE: Home (`/`)

**SEO Title:** Fractional CMO for $10M-$200M Companies | Sam Ghanem
**Meta Description:** Sam Ghanem is a Fractional CMO for companies generating $10M-$200M in revenue. Enterprise-grade marketing leadership, without the enterprise headcount.

**Hero**
- Eyebrow: FRACTIONAL CMO FOR SERIOUS COMPANIES
- Headline: Your Marketing Doesn't Need Another Hire. It Needs An Executive.
- Subheadline: You built a company doing $10M-$200M in revenue. Your marketing still runs like it's a $2M startup. That gap is costing you every quarter it stays open.
- CTA: See If You Qualify

**Proof Bar (stat block)**
- 25+ Years in Brand and Marketing Strategy
- 21-Person Agency Built and Run (SG INK)
- Enterprise Clients: Lockheed Martin, IBM, Danaher, Mercedes-Benz, Carrier, Thermo Fisher
- Mentored by Ken "Spanky" Moskowitz, Founder of Ad Zombies and a 10-Time Super Bowl Advertising Veteran

**Problem Section**
Headline: You Don't Have a Marketing Problem. You Have a Messaging Problem.
Body: Most companies at your revenue level didn't stall because they stopped advertising. They stalled because the brand stopped being congruent - what you say, what you sell, and what your team actually delivers pulled apart. No amount of ad spend fixes that. A Fractional CMO does.

**Mechanism Section**
Headline: The Congruent Brands Convert System
Body: This isn't a grab-bag of marketing tactics. It's a repeatable system built over 25 years and sharpened by enterprise clients who don't tolerate guesswork.
Steps:
1. Diagnose the Gap - audit brand, messaging, and go-to-market against what's actually converting
2. Rebuild the Why Pathway - rebuild your core message so every channel says the same true thing
3. Install Magnetic Marketing - deploy the systems and campaigns that pull the right buyers in, not just more traffic
4. Run It Like an Executive - ongoing fractional leadership, not a one-time deliverable

**Proof / Results Section**
Headline: Enterprise Brands Trust This System
Body: The same frameworks used to build a 21-person agency and serve brands like Lockheed Martin and IBM now run inside your marketing team, without you needing to hire a full C-suite marketing department.

**Qualification Gate**
Headline: This Is Built For A Specific Kind Of Company
Body: This isn't for early-stage startups and it isn't for public enterprises with a marketing department twelve layers deep. This is for companies generating between $10M and $200M in annual revenue who need executive-level marketing leadership without adding a six-figure hire. If that's you, keep going.
CTA: Apply to Work Together

**FAQ (see FAQ block below, home page carries the top 3)**
1. What exactly does a Fractional CMO do that an agency doesn't?
2. Why the $10M-$200M revenue range specifically?
3. How fast will I see results?

**Final CTA**
Headline: See If You Qualify
Body: A quick application, not a sales call. If it's a fit, we'll talk. If it's not, I'll tell you that too.
CTA: Start My Application

---

### PAGE: How It Works (`/how-it-works`)

**SEO Title:** How Fractional CMO Engagements Work | Sam Ghanem
**Meta Description:** A full breakdown of the Congruent Brands Convert system - how a Fractional CMO engagement with Sam Ghanem actually runs, phase by phase.

**Hero**
- Eyebrow: THE MECHANISM
- Headline: One System. Four Phases. No Guesswork.
- Subheadline: Here's exactly what happens when you bring in a Fractional CMO instead of another agency or another internal hire.

**Phase 1: Diagnose the Gap**
What it is: A full audit of your current brand congruence - messaging, positioning, current marketing spend, and where the story your company tells stops matching what your team delivers.
What you get: A written findings document naming exactly where the gap is costing you pipeline.

**Phase 2: Rebuild the Why Pathway**
What it is: Your core message, rebuilt from the ground up using the Why Pathway framework, so every piece of marketing - website, sales deck, ads, hiring pages - says the same true thing.
What you get: A single messaging foundation every future asset gets built from.

**Phase 3: Install Magnetic Marketing**
What it is: Deployment of the specific campaigns and systems built to pull qualified buyers toward you, instead of chasing broad, expensive, low-intent traffic.
What you get: Live campaigns and systems, not a strategy deck that sits in a drawer.

**Phase 4: Run It Like An Executive**
What it is: Ongoing fractional leadership - the same accountability and judgment a full-time CMO brings, at a fraction of the cost and without a long hiring cycle.
What you get: A marketing function that runs itself instead of running through you.

**CTA:** Apply to Work Together

---

### PAGE: Results (`/results`)

**SEO Title:** Results and Proof | Sam Ghanem, Fractional CMO
**Meta Description:** Real numbers, real brands, real outcomes from Sam Ghanem's fractional CMO and agency work.

**Hero**
- Eyebrow: PROOF
- Headline: The Track Record Behind The System

**Stat Block**
- 25+ Years building brand and marketing strategy
- 21-person agency built and operated (SG INK)
- Enterprise clients served: Lockheed Martin, IBM, Danaher, Mercedes-Benz, Carrier, Thermo Fisher
- Utilizes the StoryBrand messaging framework
- TEDx speaker credential (TEDxApex)

**Testimonial block:** Populated from Sanity `testimonial` documents. Placeholder copy until real client results are supplied:
"[Client name and result to be added - do not launch with placeholder testimonials live. Populate from real client engagements before go-live.]"

**CTA:** Apply to Work Together

---

### PAGE: About Sam (`/about`)

**SEO Title:** About Sam Ghanem | Fractional CMO
**Meta Description:** Sam Ghanem is a Fractional CMO, agency founder, and speaker with 25+ years building brand and marketing systems for enterprise clients.

**Hero**
- Eyebrow: ABOUT
- Headline: I Live One Big Life. My Business Results Reflect It.

**Body**
Sam Ghanem's career began in 2002. She is the Founder and CMO of SG INK, a full-service printing, branding, and marketing agency she built into a 21-person team serving enterprise brands including Lockheed Martin, IBM, Danaher, Mercedes-Benz, Carrier, and Thermo Fisher. She holds an MIBA with minors in Marketing and Spanish, utilizes the StoryBrand framework in her messaging work, and delivered a TEDx talk at TEDxApex titled "It's Contagious - The Way You Treat Yourself Spreads."

Sam is mentored directly by Ken "Spanky" Moskowitz, founder of Ad Zombies, a 40-year advertising veteran behind 10 Super Bowl campaigns and $460B+ in client revenue generated. That mentorship shapes how she builds every fractional CMO engagement: bold, direct, and built on proof, not theory.

Her frameworks - Congruent Brands Convert, The Why Pathway, and Magnetic Marketing - come from one core belief: most companies don't have a marketing problem. They have a messaging problem. Fix the congruence between what you say and what you deliver, and conversion follows.

**CTA:** Apply to Work Together

---

### PAGE: Apply (`/apply`)

**SEO Title:** Apply to Work With Sam Ghanem, Fractional CMO
**Meta Description:** Apply for a Fractional CMO engagement. For companies generating $10M-$200M in annual revenue.

**Hero**
- Eyebrow: APPLICATION
- Headline: Let's See If This Is A Fit
- Subheadline: This is a short qualification application, not a sales call. Answer honestly. If your company is in the $10M-$200M revenue range and the marketing gap is real, you'll hear back directly from Sam.

**Form fields (wire to Sanity or a form service - specify in Step 2 Phase 0):**
- Company name
- Annual revenue range (dropdown, must include $10M-$200M bands)
- Your role
- What's not working in marketing right now (long text)
- Best email
- Best phone

**Post-submit:** Confirmation copy - "Got it. If it's a fit, expect to hear from Sam within 2 business days."

---

### PAGE: Privacy Policy (`/privacy-policy`)

Standard privacy policy content. Populate with legal-reviewed language before launch - not written here, since this requires actual legal review rather than templated copy.

---

## 8. IMAGE ASSETS TO PRESERVE / SOURCE

- Sam headshot (professional, confident - matches bold DR tone, not overly corporate)
- SG INK logo (for credibility mention, if used as a visual proof element)
- Enterprise client logos: Lockheed Martin, IBM, Danaher, Mercedes-Benz, Carrier, Thermo Fisher (confirm usage rights/logo guidelines before publishing any client logo)
- TEDx talk thumbnail or embed asset
- Favicon / site icon
- Default OG image (1200x630) for social sharing

---

## 9. SANITY WEBHOOK + VERCEL DEPLOY TRIGGER SETUP

1. In Sanity Studio: Settings > API > Webhooks > create a webhook that fires on document publish/update
2. Target URL: the Vercel Deploy Hook URL (generated in Vercel Project Settings > Git > Deploy Hooks)
3. Filter: trigger on `page`, `siteSettings`, `navigation`, `testimonial`, and `faq` document types
4. Without this, every content edit in Sanity requires a developer to manually trigger a rebuild - this is exactly the failure mode Step 2's Iron Rules exist to prevent

---

## 10. GOOGLE SEARCH CONSOLE POST-LAUNCH CHECKLIST

- [ ] Verify domain ownership in Search Console before DNS cutover
- [ ] Submit sitemap.xml after deploy
- [ ] Request indexing for Home, How It Works, and Apply pages first (highest priority)
- [ ] Monitor Coverage report for crawl errors in first 72 hours
- [ ] Validate ProfessionalService and FAQPage schema at search.google.com/test/rich-results
- [ ] Confirm GA4 and any pixel IDs are firing correctly post-launch

---

## 11. PAGE COUNT SUMMARY

| Page | Path | Indexed | Priority |
|---|---|---|---|
| Home | `/` | Yes | Highest |
| How It Works | `/how-it-works` | Yes | High |
| Results | `/results` | Yes | High |
| About Sam | `/about` | Yes | Medium |
| Apply | `/apply` | Yes | Highest |
| Privacy Policy | `/privacy-policy` | No (noindex) | Low |

Total pages at launch: 6

---

## 12. INTERNAL LINKING RULES

- Every page links to `/apply` at least twice: once in the header nav, once in a final CTA block
- Home links to `/how-it-works` immediately after the Problem section, and to `/results` immediately after the Mechanism section
- `/how-it-works` links to `/results` at the bottom as the proof follow-up
- `/about` links to `/how-it-works` after the mentorship paragraph, framing the system as the direct output of that credibility
- `/results` links to `/apply` as its only CTA - no secondary links, since this page's job is proof, not exploration
- Footer on every page: `/about`, `/how-it-works`, `/results`, `/apply`, `/privacy-policy`

---

## HANDOFF NOTE

This document pre-answers Web Dev Step 2's Phase 0 interview:
- Client + slug: Sam Ghanem / samghanemcmo
- Production domain: samghanemcmo.com
- Hosting: Vercel (static Astro site, no long-running server or background jobs needed)
- Page inventory: see Section 11
- Editors: Sam Ghanem (confirm email before Sanity invite)
- Analytics: GA4 and Meta Pixel recommended given DR/paid traffic strategy - IDs not yet provided, wire the slot now and fill in when available

Outstanding items to confirm before Step 2 begins: analytics IDs, real client testimonials/results to replace placeholders in Section 7, and the destination service for the Apply form (native Sanity-backed form vs. Typeform/Calendly).
