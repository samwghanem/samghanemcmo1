/**
 * Idempotent seed script. Reads SANITY_TOKEN from process.env - never relies
 * on `sanity exec --with-user-token`, which requires interactive login and
 * hangs in non-TTY environments (see Web Dev Step 2, Phase 2).
 *
 * Run with: npx tsx scripts/seed.ts
 * Requires studio/.env with SANITY_TOKEN=<robot editor token> (gitignored).
 */
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID';
const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error('SANITY_TOKEN is not set. Create a robot "Editor" token at ' +
    'sanity.io/manage and add it to studio/.env before running the seed script.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'Sam Ghanem, Fractional CMO',
  defaultDescription:
    'Sam Ghanem is a Fractional CMO for companies generating $10M-$200M in revenue.',
  applyUrl: '/apply', // placeholder - update once form destination is decided
};

const navigation = {
  _id: 'navigation',
  _type: 'navigation',
  items: [
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Results', path: '/results' },
    { label: 'About', path: '/about' },
    { label: 'Apply', path: '/apply' },
  ],
};

const faqs = [
  {
    _id: 'faq-what-is-fcmo',
    _type: 'faq',
    question: "What exactly does a Fractional CMO do that an agency doesn't?",
    answer:
      "An agency executes tasks. A Fractional CMO owns outcomes: diagnosing why marketing isn't converting, rebuilding the message, and running the system with the same accountability a full-time executive would carry.",
  },
  {
    _id: 'faq-who-is-this-for',
    _type: 'faq',
    question: 'Who is this actually for?',
    answer:
      "Companies who've moved well past the startup stage - real revenue, an actual sales team, a P&L to defend - but haven't built out a full in-house marketing leadership team yet. If you're pre-revenue or still finding product-market fit, this isn't the right fit. If you're a public enterprise with a marketing department twelve layers deep, you probably don't need this either.",
  },
  {
    _id: 'faq-how-fast',
    _type: 'faq',
    question: 'How fast will I see results?',
    answer:
      'The diagnostic phase alone typically surfaces the gap within the first few weeks. Full system deployment and measurable pipeline impact follows the four-phase process outlined on the How It Works page.',
  },
];

async function seed() {
  console.log('Seeding siteSettings and navigation...');
  await client.createOrReplace(siteSettings);
  await client.createOrReplace(navigation);

  console.log('Seeding FAQs...');
  for (const faq of faqs) {
    await client.createOrReplace(faq);
  }

  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
