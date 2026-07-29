import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Fallbacks here matter: a Sanity outage or missing env var must never break
// the build. Replace REPLACE_WITH_PROJECT_ID once the Sanity project exists.
const projectId = import.meta.env.SANITY_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID';
const dataset = import.meta.env.SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Safe fetch wrapper: every page template should call through this so a
 * Sanity outage degrades to `null` (triggering fallback copy) instead of
 * failing the whole build.
 */
export async function safeFetch<T>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err) {
    console.warn('[sanity] fetch failed, falling back to hardcoded copy:', err);
    return null;
  }
}
