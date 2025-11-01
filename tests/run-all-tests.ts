/**
 * RUN ALL TESTS
 *
 * Executes all test cases and aggregates results.
 * Use this to run the full test suite.
 *
 * Usage:
 *   npx tsx tests/run-all-tests.ts              # Run all tests
 *   npx tsx tests/run-all-tests.ts context      # Run only context tests
 *   npx tsx tests/run-all-tests.ts prompts      # Run only prompts tests
 */

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface TestCaseResult {
  name: string;
  category: string;
  passed: boolean;
  duration: number;
  output?: string;
  error?: string;
}

interface TestCase {
  category: string;
  name: string;
  path: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Available test categories
 * Auto-discovered from tests/cases/ directories
 * MUST be kept in sync with actual directories
 */
const VALID_CATEGORIES = ['agent-config', 'context', 'generators', 'prompts', 'registries', 'templates'];

// ============================================================================
// PATH RESOLUTION
// ============================================================================

/**
 * Get the tests directory regardless of CWD
 */
function getTestsDir(): string {
  const currentPath = process.cwd();

  // Check if we're in the agent-system-minimal directory
  if (currentPath.includes('agent-system-minimal')) {
    const parts = currentPath.split(path.sep);
    const agentSystemIndex = parts.findIndex(p => p === 'agent-system-minimal');
    const agentSystemRoot = parts.slice(0, agentSystemIndex + 1).join(path.sep);
    return path.join(agentSystemRoot, 'tests');
  }

  // We're in the workspace root
  return path.join(currentPath, '.github', 'agent-system-minimal', 'tests');
}

// ============================================================================
// TEST DISCOVERY
// ============================================================================

/**
 * Discover all test cases, optionally filtered by category
 */
function discoverTestCases(filterCategory?: string): TestCase[] {
  const testsDir = getTestsDir();
  const casesDir = path.join(testsDir, 'cases');

  if (!fs.existsSync(casesDir)) {
    console.error(`Test cases directory not found: ${casesDir}`);
    return [];
  }

  const testCases: TestCase[] = [];

  // Get categories to scan
  const categories = filterCategory
    ? [filterCategory]
    : fs
        .readdirSync(casesDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && entry.name !== '.git')
        .map(entry => entry.name);

  // Scan each category
  for (const category of categories) {
    const categoryPath = path.join(casesDir, category);

    if (!fs.existsSync(categoryPath)) {
      console.warn(`Category not found: ${category}`);
      continue;
    }

    const testDirs = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const testName of testDirs) {
      const testPath = path.join(categoryPath, testName);
      const indexPath = path.join(testPath, 'index.ts');

      if (fs.existsSync(indexPath)) {
        testCases.push({
          category,
          name: testName,
          path: indexPath
        });
      }
    }
  }

  return testCases.sort((a, b) => {
    // Sort by test number extracted from name (e.g., "001-..." -> 1)
    const aNum = parseInt(a.name.split('-')[0], 10) || 999;
    const bNum = parseInt(b.name.split('-')[0], 10) || 999;
    return aNum - bNum;
  });
}

// ============================================================================
// TEST EXECUTION
// ============================================================================

/**
 * Run a single test case
 */
function runTestCase(testCase: TestCase): Promise<TestCaseResult> {
  return new Promise(resolve => {
    const startTime = Date.now();

    console.log(`\n${'='.repeat(80)}`);
    console.log(`Running: [${testCase.category}] ${testCase.name}`);
    console.log('='.repeat(80));

    const child = spawn('npx', ['tsx', testCase.path], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', code => {
      const duration = Date.now() - startTime;

      resolve({
        name: testCase.name,
        category: testCase.category,
        passed: code === 0,
        duration
      });
    });

    child.on('error', error => {
      const duration = Date.now() - startTime;

      resolve({
        name: testCase.name,
        category: testCase.category,
        passed: false,
        duration,
        error: error.message
      });
    });
  });
}

// ============================================================================
// RESULT REPORTING
// ============================================================================

/**
 * Print summary of all test results
 */
function printSummary(results: TestCaseResult[], filterCategory?: string): void {
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n' + '='.repeat(80));
  console.log(filterCategory ? `TEST SUMMARY - ${filterCategory.toUpperCase()}` : 'TEST SUMMARY - ALL CATEGORIES');
  console.log('='.repeat(80) + '\n');

  // Group by category
  const byCategory = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    },
    {} as Record<string, TestCaseResult[]>
  );

  for (const [category, categoryResults] of Object.entries(byCategory)) {
    console.log(`\n📁 ${category.toUpperCase()}\n`);

    for (const result of categoryResults) {
      const status = result.passed ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
      const duration = `${(result.duration / 1000).toFixed(2)}s`;

      console.log(`${status} ${result.name.padEnd(40)} ${duration}`);

      if (result.error) {
        console.log(`  \x1b[31mError: ${result.error}\x1b[0m`);
      }
    }
  }

  console.log('\n' + '-'.repeat(80));
  console.log(`Total: ${results.length} test cases`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`Duration: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const filterCategory = args[0];

  // Validate category filter
  if (filterCategory && !VALID_CATEGORIES.includes(filterCategory)) {
    console.error(`Invalid category: ${filterCategory}`);
    console.error(`Valid categories: ${VALID_CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  console.log(filterCategory ? `\n🧪 Running ${filterCategory.toUpperCase()} Tests...\n` : '\n🧪 Running All Test Cases...\n');

  // Discover test cases
  const testCases = discoverTestCases(filterCategory);

  if (testCases.length === 0) {
    console.error('No test cases found!');
    process.exit(1);
  }

  console.log(`Found ${testCases.length} test case(s):\n`);
  testCases.forEach((tc, i) => console.log(`  ${i + 1}. [${tc.category}] ${tc.name}`));

  // Run all test cases
  const results: TestCaseResult[] = [];

  for (const testCase of testCases) {
    const result = await runTestCase(testCase);
    results.push(result);
  }

  // Print summary
  printSummary(results, filterCategory);

  // Exit with appropriate code
  const failed = results.filter(r => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
