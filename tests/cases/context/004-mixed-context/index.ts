/**
 * TEST CASE 004: AGENT WITH MIXED CONTEXT
 *
 * Tests that an agent can combine all context types:
 * - Inline context (techStack, conventions, patterns)
 * - Registry context chips (by ID)
 * - Direct path context chips (pathFromRoot)
 *
 * Verifies proper ordering and separation of all context types.
 */

import * as path from 'path';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';
import { BEHAVIOR_PROMPTS } from '../../../../prompts/injectable/behavior-prompts.js';
import { ROLE_PROMPTS } from '../../../../prompts/injectable/role-prompts.js';
import { assert, assertContains, cleanTestOutput, exitWithResults, getTestCaseDir, getTestOutputDir, printResults, readFile, runTestSuite } from '../../../utils/index.js';

// ============================================================================
// SETUP
// ============================================================================

const TEST_CASE_NAME = 'context/004-mixed-context';
const CONFIG_PATH = path.join(getTestCaseDir(TEST_CASE_NAME), 'agent.config.ts');

// ============================================================================
// TESTS
// ============================================================================

async function testGeneratesChatmodeFile() {
  cleanTestOutput(TEST_CASE_NAME);

  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const result = await generateChatmode({
    agentConfig: CONFIG_PATH,
    outputDir,
    overwrite: true
  });

  assert(result.success, 'Expected chatmode generation to succeed');
  assert(result.outputPath !== undefined, 'Expected output path to be defined');
}

async function testInjectsCorrectPrompts() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'mixed-context-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Check for architect role prompt
  const expectedRolePrompt = ROLE_PROMPTS['architect'];
  assertContains(content, expectedRolePrompt, 'Expected architect role prompt');

  // Check for autonomous behavior prompt
  const expectedBehaviorPrompt = BEHAVIOR_PROMPTS['autonomous'];
  assertContains(content, expectedBehaviorPrompt, 'Expected autonomous behavior prompt');
}

async function testRendersInlineContext() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'mixed-context-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Tech Stack
  assertContains(content, '## Tech Stack', 'Expected Tech Stack section');
  assertContains(content, '**Framework**: Next.js', 'Expected Framework');
  assertContains(content, '**Language**: TypeScript', 'Expected Language');
  assertContains(content, '**Database**: PostgreSQL', 'Expected Database');

  // Conventions
  assertContains(content, '## Conventions', 'Expected Conventions section');
  assertContains(content, '**File Naming**: kebab-case', 'Expected File Naming');
  assertContains(content, '**Component Naming**: PascalCase', 'Expected Component Naming');

  // Patterns
  assertContains(content, '## Patterns', 'Expected Patterns section');
  assertContains(content, 'Server components', 'Expected preferred pattern');
  assertContains(content, 'API routes', 'Expected preferred pattern');
  assertContains(content, 'Microservices architecture', 'Expected architectural style');
}

async function testLoadsRegistryChip() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'mixed-context-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Constitution chip (from registry)
  assertContains(content, '# Project Constitution', 'Expected constitution chip');
  assertContains(content, 'Core Mission', 'Expected constitution content');
  assertContains(content, 'Guiding Principles', 'Expected constitution content');
}

async function testLoadsDirectPathChip() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'mixed-context-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Performance chip (direct path)
  assertContains(content, '# Performance Guidelines', 'Expected performance chip');
  assertContains(content, 'Performance Principles', 'Expected performance content');
  assertContains(content, 'Measure First', 'Expected performance content');
  assertContains(content, 'Common Optimizations', 'Expected performance content');
}

async function testProperContextOrdering() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'mixed-context-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Get positions of different context elements
  const rolePromptPos = content.indexOf('## Role:');
  const behaviorPromptPos = content.indexOf('## Communication Style:');
  const techStackPos = content.indexOf('## Tech Stack');
  const constitutionPos = content.indexOf('# Project Constitution');
  const performancePos = content.indexOf('# Performance Guidelines');

  // Verify ordering: role -> behavior -> inline context -> chips
  assert(rolePromptPos < behaviorPromptPos, 'Role prompt should come before behavior prompt');
  assert(behaviorPromptPos < techStackPos, 'Behavior prompt should come before inline context');

  // Chips should come after inline context
  if (constitutionPos !== -1) {
    assert(techStackPos < constitutionPos, 'Inline context should come before registry chip');
  }

  if (performancePos !== -1) {
    assert(techStackPos < performancePos, 'Inline context should come before direct path chip');
  }
}

async function testAllContextTypesPresent() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'mixed-context-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Verify all three context types are present
  const hasInlineContext = content.includes('## Tech Stack') || content.includes('## Conventions') || content.includes('## Patterns');
  const hasRegistryChip = content.includes('# Project Constitution');
  const hasDirectPathChip = content.includes('# Performance Guidelines');

  assert(hasInlineContext, 'Expected inline context to be present');
  assert(hasRegistryChip, 'Expected registry chip to be present');
  assert(hasDirectPathChip, 'Expected direct path chip to be present');
}

// ============================================================================
// RUN TESTS
// ============================================================================

async function main() {
  const suite = await runTestSuite('Test Case 004: Agent with Mixed Context', [
    { name: 'Generates chatmode file', fn: testGeneratesChatmodeFile },
    { name: 'Injects correct role and behavior prompts', fn: testInjectsCorrectPrompts },
    { name: 'Renders inline context (tech stack, conventions, patterns)', fn: testRendersInlineContext },
    { name: 'Loads registry chip (constitution)', fn: testLoadsRegistryChip },
    { name: 'Loads direct path chip (performance)', fn: testLoadsDirectPathChip },
    { name: 'Maintains proper context ordering', fn: testProperContextOrdering },
    { name: 'All context types present', fn: testAllContextTypesPresent }
  ]);

  printResults(suite);
  exitWithResults(suite);
}

main().catch(console.error);
