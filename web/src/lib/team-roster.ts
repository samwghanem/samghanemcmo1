export interface TeamMember {
  key: string; // matches the agent .md filename (without extension)
  name: string;
  role: string;
  department: string;
  // The ceiling for this role's level. Broader-judgment roles (creative
  // direction, strategy, senior review) can grow through more stages than
  // narrow, single-function roles (a QC check, a pass/flag/block reviewer).
  // Current level is computed from real completed-job history, not set by hand.
  maxLevel: number;
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
  { key: 'foreman', name: 'Marcus', role: 'Foreman', department: 'Web / Page', maxLevel: 2 },
  { key: 'seo-strategist', name: 'Mira', role: 'SEO Strategist', department: 'Web / Page', maxLevel: 2 },
  { key: 'buyer', name: 'Sloane', role: 'Buyer', department: 'Web / Page', maxLevel: 1 },
  { key: 'builder', name: 'Sawyer', role: 'Builder', department: 'Web / Page', maxLevel: 2 },
  { key: 'inspector', name: 'Annika', role: 'Inspector', department: 'Web / Page', maxLevel: 1 },
  { key: 'publisher', name: 'Sutton', role: 'Publisher', department: 'Web / Page', maxLevel: 1 },

  // Brand / Campaign
  { key: 'creative-director', name: 'Mara', role: 'Creative Director', department: 'Brand / Campaign', maxLevel: 3 },
  { key: 'senior-strategist', name: 'Malik', role: 'Senior Strategist', department: 'Brand / Campaign', maxLevel: 3 },
  { key: 'junior-strategist', name: 'Ava', role: 'Junior Strategist', department: 'Brand / Campaign', maxLevel: 2 },
  { key: 'senior-copywriter', name: 'Asher', role: 'Senior Copywriter', department: 'Brand / Campaign', maxLevel: 3 },
  { key: 'junior-copywriter', name: 'Sadie', role: 'Junior Copywriter', department: 'Brand / Campaign', maxLevel: 1 },
  { key: 'senior-art-director', name: 'Soren', role: 'Senior Art Director', department: 'Brand / Campaign', maxLevel: 3 },
  { key: 'junior-art-director', name: 'Mina', role: 'Junior Art Director', department: 'Brand / Campaign', maxLevel: 1 },
  { key: 'visual-designer', name: 'Samir', role: 'Visual Designer', department: 'Brand / Campaign', maxLevel: 2 },
  { key: 'paid-media-specialist', name: 'Sol', role: 'Paid Media Specialist', department: 'Brand / Campaign', maxLevel: 1 },
  { key: 'producer', name: 'Maeve', role: 'Producer', department: 'Brand / Campaign', maxLevel: 2 },

  // Social & Content
  { key: 'content-strategist', name: 'Autumn', role: 'Content Strategist', department: 'Social & Content', maxLevel: 3 },
  { key: 'social-media-manager', name: 'Milo', role: 'Social Media Manager', department: 'Social & Content', maxLevel: 2 },

  // Video / Broadcast
  { key: 'broadcast-producer', name: 'Simone', role: 'Broadcast Producer', department: 'Video / Broadcast', maxLevel: 2 },
  { key: 'assistant-editor', name: 'Asa', role: 'Assistant Editor', department: 'Video / Broadcast', maxLevel: 1 },
  { key: 'motion-designer', name: 'Marisol', role: 'Motion Designer', department: 'Video / Broadcast', maxLevel: 2 },
  { key: 'sound-designer', name: 'Shay', role: 'Sound Designer', department: 'Video / Broadcast', maxLevel: 2 },
  { key: 'finisher', name: 'Avery', role: 'Finisher', department: 'Video / Broadcast', maxLevel: 1 },

  // Web Development
  { key: 'ux-designer', name: 'Amara', role: 'UX Designer', department: 'Web Development', maxLevel: 3 },
  { key: 'senior-web-developer', name: 'Mateo', role: 'Senior Web Developer', department: 'Web Development', maxLevel: 3 },
  { key: 'junior-web-developer', name: 'Skye', role: 'Junior Web Developer', department: 'Web Development', maxLevel: 1 },

  // Growth
  { key: 'prospect-researcher', name: 'Margo', role: 'Prospect Researcher', department: 'Growth', maxLevel: 2 },
  { key: 'lifecycle-marketer', name: 'Santiago', role: 'Lifecycle Marketer', department: 'Growth', maxLevel: 2 },

  // Shared QA
  { key: 'editor', name: 'Sienna', role: 'Editor', department: 'Shared QA', maxLevel: 3 },
  { key: 'fact-checker', name: 'Adrian', role: 'Fact-Checker', department: 'Shared QA', maxLevel: 1 },
  { key: 'compliance-reviewer', name: 'Myles', role: 'Compliance Reviewer', department: 'Shared QA', maxLevel: 1 },
  { key: 'insights-analyst', name: 'Aidan', role: 'Insights Analyst', department: 'Shared QA', maxLevel: 2 },
];

export function getMember(key: string): TeamMember | undefined {
  return TEAM_ROSTER.find((m) => m.key === key);
}

