/**
 * TEST CASE 002: AGENT WITH REGISTRY CONTEXT CHIPS
 *
 * Tests that an agent using context chips from the registry:
 * - Correctly resolves chip IDs to file paths
 * - Loads chip content from markdown files
 * - Injects chip content into the generated chatmode
 * - Maintains proper separation between chips
 */

import * as path from 'path';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';
import { BEHAVIOR_PROMPTS } from '../../../../prompts/injectable/behavior-prompts.js';
import { ROLE_PROMPTS } from '../../../../prompts/injectable/role-prompts.js';
import { assert, assertContains, cleanTestOutput, exitWithResults, getTestCaseDir, getTestOutputDir, printResults, readFile, runTestSuite } from '../../../utils/index.js';

// ============================================================================
// SETUP
// ============================================================================

const TEST_CASE_NAME = 'context/002-registry-chips';
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

async function testInjectsRoleAndBehavior() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'registry-chips-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Check for reviewer role prompt
  const expectedRolePrompt = ROLE_PROMPTS.reviewer;
  assertContains(content, expectedRolePrompt, 'Expected reviewer role prompt');

  // Check for concise behavior prompt
  const expectedBehaviorPrompt = BEHAVIOR_PROMPTS.concise;
  assertContains(content, expectedBehaviorPrompt, 'Expected concise behavior prompt');
}

async function testLoadsConstitutionChip() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'registry-chips-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Constitution chip content should be present
  assertContains(content, '# Project Constitution', 'Expected constitution chip title');
  assertContains(content, 'Core Mission', 'Expected constitution core mission section');
  assertContains(content, 'Guiding Principles', 'Expected constitution guiding principles');
  assertContains(content, 'Non-Negotiable Rules', 'Expected constitution non-negotiable rules');
  assertContains(content, '**User First**', 'Expected specific constitution principle');
}

async function testLoadsArchitectureChip() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'registry-chips-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Architecture chip content should be present
  assertContains(content, '# Architecture Overview', 'Expected architecture chip title');
  assertContains(content, 'System Architecture', 'Expected system architecture section');
  assertContains(content, 'Component Breakdown', 'Expected component breakdown section');
  assertContains(content, 'Design Patterns', 'Expected design patterns section');
  assertContains(content, 'Schema-Driven Validation', 'Expected specific design pattern');
}

async function testChipsSeparatedByDivider() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'registry-chips-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Chips should be separated by markdown divider (---)
  // Find both chips and verify separator exists between them
  const constitutionIndex = content.indexOf('# Project Constitution');
  const architectureIndex = content.indexOf('# Architecture Overview');

  assert(constitutionIndex !== -1, 'Expected constitution chip to be present');
  assert(architectureIndex !== -1, 'Expected architecture chip to be present');

  // Extract content between the two chips
  const betweenChips = content.substring(constitutionIndex, architectureIndex);

  // Should contain separator
  assertContains(betweenChips, '---', 'Expected separator between chips');
}

async function testNoInlineContext() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'registry-chips-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Since this agent has no inline context, these sections should NOT be present
  // (unless they're part of the chip content, which they're not in our test chips)

  // Look for inline context markers that shouldn't be there
  // const lines = content.split('\n');

  // Filter out chip content by looking between role/behavior prompts and chips
  const promptEndIndex = content.indexOf('## Communication Style');
  const chipStartIndex = content.indexOf('# Project Constitution');

  if (promptEndIndex !== -1 && chipStartIndex !== -1) {
    const betweenSection = content.substring(promptEndIndex, chipStartIndex);

    // This section should not contain inline context sections
    // Allow for Tech Stack/Conventions/Patterns in chips, but not standalone
    const hasTechStackSection = betweenSection.includes('## Tech Stack\n\n-');
    const hasConventionsSection = betweenSection.includes('## Conventions\n\n-');
    const hasPatternsSection = betweenSection.includes('## Patterns\n\n**Preferred');

    assert(!hasTechStackSection, 'Should not have standalone Tech Stack section');
    assert(!hasConventionsSection, 'Should not have standalone Conventions section');
    assert(!hasPatternsSection, 'Should not have standalone Patterns section');
  }
}

// ============================================================================
// RUN TESTS
// ============================================================================

async function main() {
  const suite = await runTestSuite('Test Case 002: Agent with Registry Context Chips', [
    { name: 'Generates chatmode file', fn: testGeneratesChatmodeFile },
    { name: 'Injects role and behavior prompts', fn: testInjectsRoleAndBehavior },
    { name: 'Loads constitution chip content', fn: testLoadsConstitutionChip },
    { name: 'Loads architecture chip content', fn: testLoadsArchitectureChip },
    { name: 'Separates chips with dividers', fn: testChipsSeparatedByDivider },
    { name: 'Does not include inline context', fn: testNoInlineContext }
  ]);

  printResults(suite);
  exitWithResults(suite);
}

main().catch(console.error);
