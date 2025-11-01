/**
 * TEST CASE 005: DIFFERENT ROLES, BEHAVIORS, AND PERMISSIONS
 *
 * Tests that different combinations of:
 * - Roles (analyst, architect, guide, orchestrator, etc.)
 * - Behaviors (concise, creative, interactive, conservative, etc.)
 * - Permissions (read-only, documentation, controlled, full)
 *
 * Correctly inject their respective prompts and tool mappings.
 */

import * as path from 'path';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';
import { BEHAVIOR_PROMPTS } from '../../../../prompts/injectable/behavior-prompts.js';
import { getPromptForPermission, getToolsForPermission } from '../../../../prompts/injectable/permission-prompts.js';
import { ROLE_PROMPTS } from '../../../../prompts/injectable/role-prompts.js';
import { assert, assertContains, cleanTestOutput, exitWithResults, extractFrontmatter, fileExists, getTestOutputDir, parseTools, printResults, readFile, runTestSuite } from '../../../utils/index.js';
import { analystAgent, architectAgent, guideAgent, orchestratorAgent } from './agent.configs.js';

// ============================================================================
// SETUP
// ============================================================================

const TEST_CASE_NAME = 'prompts/005-role-behavior-permissions';

// ============================================================================
// TESTS
// ============================================================================

// Test #1: Analyst Agent
async function testAnalystAgent() {
  cleanTestOutput(TEST_CASE_NAME);

  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const result = await generateChatmode({
    agentConfig: analystAgent,
    outputDir,
    overwrite: true
  });

  assert(result.success, 'Expected analyst agent generation to succeed');

  const content = readFile(result.outputPath!);

  // Check role prompt
  assertContains(content, ROLE_PROMPTS['analyst'], 'Expected analyst role prompt');

  // Check behavior prompt
  assertContains(content, BEHAVIOR_PROMPTS['concise'], 'Expected concise behavior prompt');

  // Check permission prompt
  assertContains(content, getPromptForPermission('read-only'), 'Expected read-only permission prompt');

  // Check tools
  const { frontmatter } = extractFrontmatter(content);
  const tools = parseTools(frontmatter);
  const expectedTools = getToolsForPermission('read-only');

  for (const tool of expectedTools) {
    assert(tools.includes(tool), `Expected tool '${tool}' for read-only permission`);
  }

  // Should NOT have edit/new tools
  assert(!tools.includes('edit'), 'Should not have edit tool for read-only');
  assert(!tools.includes('new'), 'Should not have new tool for read-only');
}

// Test #2: Architect Agent
async function testArchitectAgent() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const result = await generateChatmode({
    agentConfig: architectAgent,
    outputDir,
    overwrite: true
  });

  assert(result.success, 'Expected architect agent generation to succeed');

  const content = readFile(result.outputPath!);

  // Check role prompt
  assertContains(content, ROLE_PROMPTS['architect'], 'Expected architect role prompt');

  // Check behavior prompt
  assertContains(content, BEHAVIOR_PROMPTS['creative'], 'Expected creative behavior prompt');

  // Check permission prompt
  assertContains(content, getPromptForPermission('documentation'), 'Expected documentation permission prompt');

  // Check tools
  const { frontmatter } = extractFrontmatter(content);
  const tools = parseTools(frontmatter);
  const expectedTools = getToolsForPermission('documentation');

  for (const tool of expectedTools) {
    assert(tools.includes(tool), `Expected tool '${tool}' for documentation permission`);
  }

  // Should have edit/new tools for documentation
  assert(tools.includes('edit'), 'Should have edit tool for documentation');
  assert(tools.includes('new'), 'Should have new tool for documentation');

  // Should NOT have runCommands
  assert(!tools.includes('runCommands'), 'Should not have runCommands for documentation');
}

// Test #3: Guide Agent
async function testGuideAgent() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const result = await generateChatmode({
    agentConfig: guideAgent,
    outputDir,
    overwrite: true
  });

  assert(result.success, 'Expected guide agent generation to succeed');

  const content = readFile(result.outputPath!);

  // Check role prompt
  assertContains(content, ROLE_PROMPTS['guide'], 'Expected guide role prompt');

  // Check behavior prompt
  assertContains(content, BEHAVIOR_PROMPTS['interactive'], 'Expected interactive behavior prompt');

  // Check permission prompt
  assertContains(content, getPromptForPermission('read-only'), 'Expected read-only permission prompt');
}

// Test #4: Orchestrator Agent
async function testOrchestratorAgent() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const result = await generateChatmode({
    agentConfig: orchestratorAgent,
    outputDir,
    overwrite: true
  });

  assert(result.success, 'Expected orchestrator agent generation to succeed');

  const content = readFile(result.outputPath!);

  // Check role prompt
  assertContains(content, ROLE_PROMPTS['orchestrator'], 'Expected orchestrator role prompt');

  // Check behavior prompt
  assertContains(content, BEHAVIOR_PROMPTS['conservative'], 'Expected conservative behavior prompt');

  // Check permission prompt
  assertContains(content, getPromptForPermission('full'), 'Expected full permission prompt');

  // Check tools
  const { frontmatter } = extractFrontmatter(content);
  const tools = parseTools(frontmatter);
  const expectedTools = getToolsForPermission('full');

  for (const tool of expectedTools) {
    assert(tools.includes(tool), `Expected tool '${tool}' for full permission`);
  }

  // Should have ALL tools for full permission
  assert(tools.includes('edit'), 'Should have edit tool for full');
  assert(tools.includes('new'), 'Should have new tool for full');
  assert(tools.includes('runCommands'), 'Should have runCommands tool for full');
  assert(tools.includes('vscodeAPI'), 'Should have vscodeAPI tool for full');
}

// Test #5: All agent files generated
async function testAllAgentsGenerated() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);

  // Check that all agent files were created
  const analystPath = path.join(outputDir, 'analyst-agent.chatmode.md');
  const architectPath = path.join(outputDir, 'architect-agent.chatmode.md');
  const guidePath = path.join(outputDir, 'guide-agent.chatmode.md');
  const orchestratorPath = path.join(outputDir, 'orchestrator-agent.chatmode.md');

  assert(fileExists(analystPath), 'Expected analyst agent file to exist');
  assert(fileExists(architectPath), 'Expected architect agent file to exist');
  assert(fileExists(guidePath), 'Expected guide agent file to exist');
  assert(fileExists(orchestratorPath), 'Expected orchestrator agent file to exist');
}

// ============================================================================
// RUN TESTS
// ============================================================================

async function main() {
  const suite = await runTestSuite('Test Case 005: Different Roles, Behaviors, and Permissions', [
    { name: 'Analyst (analyst + concise + read-only)', fn: testAnalystAgent },
    { name: 'Architect (architect + creative + documentation)', fn: testArchitectAgent },
    { name: 'Guide (guide + interactive + read-only)', fn: testGuideAgent },
    { name: 'Orchestrator (orchestrator + conservative + full)', fn: testOrchestratorAgent },
    { name: 'All agent files generated', fn: testAllAgentsGenerated }
  ]);

  printResults(suite);
  exitWithResults(suite);
}

main().catch(console.error);
