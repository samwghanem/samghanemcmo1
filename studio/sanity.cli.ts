import { defineCliConfig } from 'sanity/cli';

// REPLACE_WITH_PROJECT_ID once the Sanity project exists (sanity.io/manage).
// studioHost makes `npx sanity deploy` non-interactive forever, deploying to
// https://samghanemcmo.sanity.studio
export default defineCliConfig({
  api: {
    projectId: 'REPLACE_WITH_PROJECT_ID',
    dataset: 'production',
  },
  studioHost: 'samghanemcmo',
});
