/**
 * TEST CASE 001: BASIC AGENT WITH INLINE CONTEXT
 *
 * Tests that an agent with inline context (techStack, conventions, patterns)
 * generates a valid chatmode file with:
 * - Correct YAML frontmatter
 * - Injected role prompt
 * - Injected behavior prompt
 * - Injected permission prompt
 * - Rendered inline context sections
 */

import * as path from 'path';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';
import { BEHAVIOR_PROMPTS } from '../../../../prompts/injectable/behavior-prompts.js';
import { getPromptForPermission } from '../../../../prompts/injectable/permission-prompts.js';
import { ROLE_PROMPTS } from '../../../../prompts/injectable/role-prompts.js';
import {
  assert,
  assertContains,
  cleanTestOutput,
  exitWithResults,
  extractFrontmatter,
  getTestCaseDir,
  getTestOutputDir,
  parseDescription,
  parseTools,
  printResults,
  readFile,
  runTestSuite
} from '../../../utils/index.js';

// ============================================================================
// SETUP
// ============================================================================

const TEST_CASE_NAME = 'context/001-inline-context';
const CONFIG_PATH = path.join(getTestCaseDir(TEST_CASE_NAME), 'agent.config.ts');

// ============================================================================
// TESTS
// ============================================================================

async function testGeneratesChatmodeFile() {
  // Clean up previous test output
  cleanTestOutput(TEST_CASE_NAME);

  // Generate chatmode
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const result = await generateChatmode({
    agentConfig: CONFIG_PATH,
    outputDir,
    overwrite: true
  });

  // Log error for debugging
  if (!result.success) {
    console.error('Generation failed:', result.error);
  }

  // Assert generation succeeded
  assert(result.success, `Expected chatmode generation to succeed. Error: ${result.error || 'unknown'}`);
  assert(result.outputPath !== undefined, 'Expected output path to be defined');

  // Read generated file
  const content = readFile(result.outputPath!);

  // Assert file is not empty
  assert(content.length > 0, 'Expected generated file to have content');
}

async function testValidFrontmatter() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Extract frontmatter
  const { frontmatter } = extractFrontmatter(content);

  // Assert frontmatter contains expected fields
  assertContains(frontmatter, 'description:', 'Expected frontmatter to contain description');
  assertContains(frontmatter, 'tools:', 'Expected frontmatter to contain tools');

  // Parse and validate description
  const description = parseDescription(frontmatter);
  assert(description.length > 0, 'Expected description to be non-empty');
  assertContains(description, 'simple agent for testing', 'Expected correct description');

  // Parse and validate tools
  const tools = parseTools(frontmatter);
  assert(tools.length > 0, 'Expected tools array to be non-empty');
  assertContains(tools.join(','), 'search', 'Expected tools to include search');
  assertContains(tools.join(','), 'edit', 'Expected tools to include edit');
}

async function testInjectsRolePrompt() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Get expected role prompt for 'implementer'
  const expectedPrompt = ROLE_PROMPTS.implementer;

  // Assert role prompt is in the content
  assertContains(content, expectedPrompt, 'Expected chatmode to contain implementer role prompt');
}

async function testInjectsBehaviorPrompt() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Get expected behavior prompt for 'detailed'
  const expectedPrompt = BEHAVIOR_PROMPTS.detailed;

  // Assert behavior prompt is in the content
  assertContains(content, expectedPrompt, 'Expected chatmode to contain detailed behavior prompt');
}

async function testInjectsPermissionPrompt() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Get expected permission prompt for 'controlled'
  const expectedPrompt = getPromptForPermission('controlled');

  // Assert permission prompt is in the content
  assertContains(content, expectedPrompt, 'Expected chatmode to contain controlled permission prompt');
}

async function testRendersTechStack() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Assert tech stack section is rendered
  assertContains(content, '## Tech Stack', 'Expected Tech Stack section header');
  assertContains(content, '**Framework**: React', 'Expected Framework to be rendered');
  assertContains(content, '**Language**: TypeScript', 'Expected Language to be rendered');
  assertContains(content, '**Runtime**: Node.js', 'Expected Runtime to be rendered');
  assertContains(content, '**Testing**: Jest', 'Expected Testing to be rendered');
}

async function testRendersConventions() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Assert conventions section is rendered
  assertContains(content, '## Conventions', 'Expected Conventions section header');
  assertContains(content, '**File Naming**: kebab-case', 'Expected File Naming convention');
  assertContains(content, '**Component Naming**: PascalCase', 'Expected Component Naming convention');
  assertContains(content, '**Function Naming**: camelCase', 'Expected Function Naming convention');
  assertContains(content, '**Test Pattern**: **/*.test.ts', 'Expected Test Pattern convention');
}

async function testRendersPatterns() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Assert patterns section is rendered
  assertContains(content, '## Patterns', 'Expected Patterns section header');
  assertContains(content, '**Preferred Patterns:**', 'Expected Preferred Patterns subsection');
  assertContains(content, 'Functional components', 'Expected preferred pattern: Functional components');
  assertContains(content, 'Composition over inheritance', 'Expected preferred pattern: Composition over inheritance');

  assertContains(content, '**Forbidden Patterns:**', 'Expected Forbidden Patterns subsection');
  assertContains(content, 'Class components', 'Expected forbidden pattern: Class components');
  assertContains(content, 'Global state mutation', 'Expected forbidden pattern: Global state mutation');

  assertContains(content, '**Architectural Style:** Layered architecture', 'Expected architectural style');
}

async function testIncludesAgentVersion() {
  const outputDir = getTestOutputDir(TEST_CASE_NAME);
  const chatmodePath = path.join(outputDir, 'basic-test-agent.chatmode.md');
  const content = readFile(chatmodePath);

  // Assert version is included at the end
  assertContains(content, '**Agent Version**: 1.0.0', 'Expected agent version to be included');
}

// ============================================================================
// RUN TESTS
// ============================================================================

async function main() {
  const suite = await runTestSuite('Test Case 001: Basic Agent with Inline Context', [
    { name: 'Generates chatmode file', fn: testGeneratesChatmodeFile },
    { name: 'Has valid YAML frontmatter', fn: testValidFrontmatter },
    { name: 'Injects role prompt', fn: testInjectsRolePrompt },
    { name: 'Injects behavior prompt', fn: testInjectsBehaviorPrompt },
    { name: 'Injects permission prompt', fn: testInjectsPermissionPrompt },
    { name: 'Renders tech stack section', fn: testRendersTechStack },
    { name: 'Renders conventions section', fn: testRendersConventions },
    { name: 'Renders patterns section', fn: testRendersPatterns },
    { name: 'Includes agent version', fn: testIncludesAgentVersion }
  ]);

  printResults(suite);
  exitWithResults(suite);
}

main().catch(console.error);
