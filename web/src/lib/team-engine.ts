import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getMember } from './team-roster';

const AGENTS_DIR = path.join(process.cwd(), 'src/lib/team-agents');
const KNOWLEDGE_DIR = path.join(process.cwd(), 'src/lib/team-knowledge');

function readAgentFile(roleKey: string): string {
  const filePath = path.join(AGENTS_DIR, `${roleKey}.md`);
  return readFileSync(filePath, 'utf-8');
}

function readKnowledgeFile(name: string): string {
  const filePath = path.join(KNOWLEDGE_DIR, name);
  return readFileSync(filePath, 'utf-8');
}

export async function runJob(roleKey: string, request: string): Promise<string> {
  const member = getMember(roleKey);
  if (!member) {
    throw new Error(`Unknown team role: ${roleKey}`);
  }

  const agentInstructions = readAgentFile(roleKey);
  const brand = readKnowledgeFile('brand.md');
  const voiceGuide = readKnowledgeFile('voice-guide.md');
  const icp = readKnowledgeFile('icp.md');

  const systemPrompt = `You are ${member.name}, the ${member.role} on Sam Ghanem's creative team (department: ${member.department}).

Your role instructions:
${agentInstructions}

---

The brand facts you must follow for every piece of work:
${brand}

---

The personal voice guide (use when the piece is signed by Sam personally; otherwise follow the brand voice above):
${voiceGuide}

---

The ideal customer profile (use only if this job involves prospecting or qualification):
${icp}

---

Important: You never publish, send, deploy, delete, or spend anything. You cannot open files or run tools in this setting: the brand facts, voice guide, and customer profile you need are already included above. Apply them silently. Do not say that you are reading files or running checks - just do the work. You produce drafts and recommendations only. End your response with a clear structure: STATUS, OUTPUT, SUMMARY, FLAGS (anything that needs Sam's input or confirmation), and NEXT (what would happen next once Sam says go).`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: request }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((block: any) => block.type === 'text');
  let text = textBlock?.text ?? '(No text response received.)';
  if (data.stop_reason === 'max_tokens') {
    text +=
      '\n\n[This reached the length limit and was cut off. Ask for it in smaller pieces, for example one section at a time.]';
  }
  return text;
}
