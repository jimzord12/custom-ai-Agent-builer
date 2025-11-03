import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import YAML from 'yaml';
import codeReviewerAgent from '../../../../examples/agent-configs/code-reviewer.js';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';
import promptsAgents from '../../prompts/005-role-behavior-permissions/agent.configs.js';

import { BEHAVIOR_PROMPTS } from '../../../../prompts/injectable/behavior-prompts.js';
import { getToolsForPermission } from '../../../../prompts/injectable/permission-prompts.js';
import { ROLE_PROMPTS } from '../../../../prompts/injectable/role-prompts.js';

async function run() {
  console.log('🧪 Generators: 001-generate-chatmode');

  const testDir = path.join(
    process.cwd(),
    'tests',
    'cases',
    'generators',
    '001-generate-chatmode',
    'output'
  );

  // Ensure clean output directory
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  fs.mkdirSync(testDir, { recursive: true });

  // Agents to test: codeReviewer + role/behavior/permission variants
  const agents = [
    codeReviewerAgent,
    promptsAgents.analyst,
    promptsAgents.architect,
    promptsAgents.guide,
    promptsAgents.orchestrator,
  ];

  for (const agent of agents) {
    console.log(`
-> Testing agent: ${agent.name}`);

    const result = await generateChatmode({
      agentConfig: agent,
      outputDir: testDir,
      overwrite: true,
    });
    if (!result.success) {
      console.error('Generator failed:', result.error);
      process.exit(1);
    }

    assert.ok(result.outputPath, 'Expected outputPath to be returned');

    const content = fs.readFileSync(result.outputPath!, 'utf-8');

    // 6.2 - Validate frontmatter exists and contains description & tools (use YAML parser for stricter checks)
    assert.ok(content.startsWith('---'), 'Frontmatter must start with ---');

    const secondSeparatorIndex = content.indexOf('\n---', 3);
    assert.ok(secondSeparatorIndex > 0, 'Frontmatter must be closed with ---');

    const frontmatterRaw = content.slice(3, secondSeparatorIndex).trim();
    const frontmatter = YAML.parse(frontmatterRaw);

    // description
    assert.equal(
      frontmatter.description,
      agent.description,
      'Frontmatter description should match agent.description'
    );

    // tools
    assert.ok(Array.isArray(frontmatter.tools), 'Frontmatter.tools must be an array');

    // Verify tools map to permission level
    const expectedTools = getToolsForPermission(agent.permissions.level);
    for (const t of expectedTools) {
      assert.ok(
        frontmatter.tools.includes(t),
        `Expected tool '${t}' to be present in frontmatter.tools`
      );
    }

    // Verify prompts injected in body
    // Role prompt
    const rolePrompt = ROLE_PROMPTS[agent.role];
    assert.ok(content.includes(rolePrompt), `Role prompt for '${agent.role}' must be injected`);

    // Behavior prompt
    const behaviorPrompt = BEHAVIOR_PROMPTS[agent.behavior.profile];
    assert.ok(
      content.includes(behaviorPrompt),
      `Behavior prompt for '${agent.behavior.profile}' must be injected`
    );

    // Permission prompt
    // Instead of checking the full permission prompt text (large), verify a known marker (e.g., 'Permissions') is present
    assert.ok(
      content.match(/Permissions:/i) || content.includes('## Permissions'),
      'Permission information should be present in the body'
    );

    // Markdown body structure - header with name and version
    assert.ok(content.includes(`# ${agent.name}`), 'Body must contain header with agent name');
    assert.ok(
      content.includes(`Agent Version: ${agent.version}`) || content.includes(`Agent Version`),
      'Body must include agent version information'
    );

    // If context chips referenced, content should include marker (we rely on existing context tests for deeper checks)
    if (agent.context && Object.keys(agent.context).length > 0) {
      // At minimum, ensure the body contains '##' separators or some extra content after prompts
      const afterFrontmatter = content.slice(secondSeparatorIndex + 4).trim();
      assert.ok(
        afterFrontmatter.length > 50,
        'Expected chatmode body to contain injected context/prompts'
      );
    }

    console.log(`  ✓ ${agent.name} -> ${path.basename(result.outputPath!)}`);
  }

  console.log('\nAll generator tests passed.');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

export {};
