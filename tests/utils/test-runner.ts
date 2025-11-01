/**
 * TEST RUNNER UTILITIES
 *
 * Simple test runner for isolated test cases.
 * Provides assertion helpers and result reporting.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  duration: number;
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

/**
 * Assert that a condition is true
 */
export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new AssertionError(message);
  }
}

/**
 * Assert that two values are strictly equal
 */
export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`;
    throw new AssertionError(msg);
  }
}

/**
 * Assert that a string contains a substring
 */
export function assertContains(haystack: string, needle: string, message?: string): void {
  if (!haystack.includes(needle)) {
    const msg = message || `Expected string to contain "${needle}"`;
    throw new AssertionError(msg);
  }
}

/**
 * Assert that a string does NOT contain a substring
 */
export function assertNotContains(haystack: string, needle: string, message?: string): void {
  if (haystack.includes(needle)) {
    const msg = message || `Expected string to NOT contain "${needle}"`;
    throw new AssertionError(msg);
  }
}

/**
 * Assert that a value matches a regex pattern
 */
export function assertMatches(value: string, pattern: RegExp, message?: string): void {
  if (!pattern.test(value)) {
    const msg = message || `Expected string to match pattern ${pattern}`;
    throw new AssertionError(msg);
  }
}

/**
 * Assert that a function throws an error
 */
export async function assertThrows(fn: () => Promise<void> | void, expectedError?: string | RegExp, message?: string): Promise<void> {
  let thrown = false;
  let error: Error | undefined;

  try {
    await fn();
  } catch (e) {
    thrown = true;
    error = e as Error;
  }

  if (!thrown) {
    throw new AssertionError(message || 'Expected function to throw an error');
  }

  if (expectedError) {
    if (typeof expectedError === 'string') {
      assertContains(error!.message, expectedError);
    } else {
      assertMatches(error!.message, expectedError);
    }
  }
}

/**
 * Assert that a value is truthy
 */
export function assertTruthy(value: unknown, message?: string): void {
  if (!value) {
    throw new AssertionError(message || `Expected truthy value, but got ${JSON.stringify(value)}`);
  }
}

/**
 * Assert that a value is falsy
 */
export function assertFalsy(value: unknown, message?: string): void {
  if (value) {
    throw new AssertionError(message || `Expected falsy value, but got ${JSON.stringify(value)}`);
  }
}

// ============================================================================
// TEST RUNNER
// ============================================================================

/**
 * Run a single test function
 */
export async function runTest(name: string, testFn: () => Promise<void> | void): Promise<TestResult> {
  const startTime = Date.now();

  try {
    await testFn();
    const duration = Date.now() - startTime;

    return {
      name,
      passed: true,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration
    };
  }
}

/**
 * Run a suite of tests
 */
export async function runTestSuite(name: string, tests: Array<{ name: string; fn: () => Promise<void> | void }>): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];

  for (const test of tests) {
    const result = await runTest(test.name, test.fn);
    results.push(result);
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const duration = Date.now() - startTime;

  return {
    name,
    tests: results,
    passed,
    failed,
    duration
  };
}

/**
 * Format and print test results
 */
export function printResults(suite: TestSuite): void {
  console.log('\n' + '='.repeat(80));
  console.log(`TEST SUITE: ${suite.name}`);
  console.log('='.repeat(80) + '\n');

  for (const test of suite.tests) {
    const status = test.passed ? '✓' : '✗';
    const color = test.passed ? '\x1b[32m' : '\x1b[31m'; // Green or red
    const reset = '\x1b[0m';

    console.log(`${color}${status}${reset} ${test.name} (${test.duration}ms)`);

    if (!test.passed && test.error) {
      console.log(`  ${color}Error: ${test.error}${reset}`);
    }
  }

  console.log('\n' + '-'.repeat(80));
  console.log(`Results: ${suite.passed} passed, ${suite.failed} failed (${suite.duration}ms total)`);
  console.log('='.repeat(80) + '\n');
}

/**
 * Exit with appropriate code based on results
 */
export function exitWithResults(suite: TestSuite): void {
  process.exit(suite.failed > 0 ? 1 : 0);
}
