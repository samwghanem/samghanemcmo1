export interface TeamMember {
  key: string; // matches the agent .md filename (without extension)
  name: string;
  role: string;
  department: string;
}

export const DEPARTMENTS = [
  'Web / Page',
  'Brand / Campaign',
  'Social & Content',
  'Video / Broadcast',
  'Web Development',
  'Growth',
  'Shared QA',
] as const;

export const TEAM_ROSTER: TeamMember[] = [
  // Web / Page
  { key: 'foreman', name: 'Marcus', role: 'Foreman', department: 'Web / Page' },
  { key: 'seo-strategist', name: 'Mira', role: 'SEO Strategist', department: 'Web / Page' },
  { key: 'buyer', name: 'Sloane', role: 'Buyer', department: 'Web / Page' },
  { key: 'builder', name: 'Sawyer', role: 'Builder', department: 'Web / Page' },
  { key: 'inspector', name: 'Annika', role: 'Inspector', department: 'Web / Page' },
  { key: 'publisher', name: 'Sutton', role: 'Publisher', department: 'Web / Page' },

  // Brand / Campaign
  { key: 'creative-director', name: 'Mara', role: 'Creative Director', department: 'Brand / Campaign' },
  { key: 'senior-strategist', name: 'Malik', role: 'Senior Strategist', department: 'Brand / Campaign' },
  { key: 'junior-strategist', name: 'Ava', role: 'Junior Strategist', department: 'Brand / Campaign' },
  { key: 'senior-copywriter', name: 'Asher', role: 'Senior Copywriter', department: 'Brand / Campaign' },
  { key: 'junior-copywriter', name: 'Sena', role: 'Junior Copywriter', department: 'Brand / Campaign' },
  { key: 'senior-art-director', name: 'Soren', role: 'Senior Art Director', department: 'Brand / Campaign' },
  { key: 'junior-art-director', name: 'Mina', role: 'Junior Art Director', department: 'Brand / Campaign' },
  { key: 'visual-designer', name: 'Samir', role: 'Visual Designer', department: 'Brand / Campaign' },
  { key: 'paid-media-specialist', name: 'Sol', role: 'Paid Media Specialist', department: 'Brand / Campaign' },
  { key: 'producer', name: 'Maeve', role: 'Producer', department: 'Brand / Campaign' },

  // Social & Content
  { key: 'content-strategist', name: 'Autumn', role: 'Content Strategist', department: 'Social & Content' },
  { key: 'social-media-manager', name: 'Milo', role: 'Social Media Manager', department: 'Social & Content' },

  // Video / Broadcast
  { key: 'broadcast-producer', name: 'Simone', role: 'Broadcast Producer', department: 'Video / Broadcast' },
  { key: 'assistant-editor', name: 'Asa', role: 'Assistant Editor', department: 'Video / Broadcast' },
  { key: 'motion-designer', name: 'Marisol', role: 'Motion Designer', department: 'Video / Broadcast' },
  { key: 'sound-designer', name: 'Shay', role: 'Sound Designer', department: 'Video / Broadcast' },
  { key: 'finisher', name: 'Avery', role: 'Finisher', department: 'Video / Broadcast' },

  // Web Development
  { key: 'ux-designer', name: 'Amara', role: 'UX Designer', department: 'Web Development' },
  { key: 'senior-web-developer', name: 'Mateo', role: 'Senior Web Developer', department: 'Web Development' },
  { key: 'junior-web-developer', name: 'Skye', role: 'Junior Web Developer', department: 'Web Development' },

  // Growth
  { key: 'prospect-researcher', name: 'Margo', role: 'Prospect Researcher', department: 'Growth' },
  { key: 'lifecycle-marketer', name: 'Santiago', role: 'Lifecycle Marketer', department: 'Growth' },

  // Shared QA
  { key: 'editor', name: 'Senna', role: 'Editor', department: 'Shared QA' },
  { key: 'fact-checker', name: 'Amos', role: 'Fact-Checker', department: 'Shared QA' },
  { key: 'compliance-reviewer', name: 'Magnus', role: 'Compliance Reviewer', department: 'Shared QA' },
  { key: 'insights-analyst', name: 'Aidan', role: 'Insights Analyst', department: 'Shared QA' },
];

export function getMember(key: string): TeamMember | undefined {
  return TEAM_ROSTER.find((m) => m.key === key);
}
