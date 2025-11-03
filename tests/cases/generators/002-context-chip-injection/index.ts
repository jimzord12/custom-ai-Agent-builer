import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import YAML from 'yaml';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';

// Create a test agent that references a registry context chip (frontend: constitution)
const agentWithContext: any = {
  name: 'Context Injection Test Agent',
  version: '0.1.0',
  description: 'Agent used to test context chip injection',
  role: 'analyst',
  permissions: { level: 'read-only' },
  behavior: { profile: 'concise' },
  // Reference the registry 'frontend' and chip id 'constitution' (exists in registry)
  context: {
    frontend: new Set(['constitution']),
  },
};

async function run() {
  console.log('🧪 Generators: 002-context-chip-injection');

  const testDir = path.join(
    process.cwd(),
    'tests',
    'cases',
    'generators',
    '002-context-chip-injection',
    'output'
  );

  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  fs.mkdirSync(testDir, { recursive: true });

  const result = await generateChatmode({
    agentConfig: agentWithContext,
    outputDir: testDir,
    overwrite: true,
  });

  if (!result.success) {
    console.error('Generator failed:', result.error);
    process.exit(1);
  }

  const content = fs.readFileSync(result.outputPath!, 'utf-8');

  // Parse frontmatter strictly
  assert.ok(content.startsWith('---'), 'Frontmatter must start with ---');
  const secondSeparatorIndex = content.indexOf('\n---', 3);
  assert.ok(secondSeparatorIndex > 0, 'Frontmatter must be closed with ---');

  const frontmatterRaw = content.slice(3, secondSeparatorIndex).trim();
  const frontmatter = YAML.parse(frontmatterRaw);

  // Basic frontmatter checks
  assert.equal(
    frontmatter.description,
    agentWithContext.description,
    'Frontmatter description should match agent description'
  );
  assert.ok(Array.isArray(frontmatter.tools), 'Frontmatter.tools must be an array');

  // The 'constitution' chip file exists per registry and should be present on disk
  const chipPath = path.resolve('contexts', 'constitution.context.md');
  assert.ok(fs.existsSync(chipPath), `Expected context chip file at ${chipPath}`);

  const chipContent = fs.readFileSync(chipPath, 'utf-8').trim();

  // Ensure the generated output includes a chunk of the chip content (injected after prompts)
  const snippet = chipContent.slice(0, Math.min(200, chipContent.length));
  assert.ok(
    content.includes(snippet),
    'Expected context chip content to be injected into generated chatmode file'
  );

  console.log('  ✓ Context chip injection validated:', path.basename(result.outputPath!));
  console.log('\nContext chip injection test passed.');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

export {};
