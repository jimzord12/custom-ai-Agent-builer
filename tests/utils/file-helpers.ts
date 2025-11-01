/**
 * FILE HELPER UTILITIES
 *
 * Utilities for working with files in tests.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// FILE OPERATIONS
// ============================================================================

/**
 * Read a file and return its contents
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Check if a file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Create a directory recursively
 */
export function createDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Delete a file if it exists
 */
export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Delete a directory recursively
 */
export function deleteDir(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * Write content to a file
 */
export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  createDir(dir);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Get the absolute path from a relative path
 */
export function getAbsolutePath(...pathSegments: string[]): string {
  return path.resolve(...pathSegments);
}

/**
 * Get the test case directory path
 * @param caseName - Format: "category/001-test-name" or "001-test-name" (legacy)
 */
export function getTestCaseDir(caseName: string): string {
  // Get the workspace root (parent of .github)
  const currentPath = process.cwd();

  // Check if we're already in the agent-system-minimal directory
  if (currentPath.includes('agent-system-minimal')) {
    // We're in the agent system directory, find the root of agent-system-minimal
    const parts = currentPath.split(path.sep);
    const agentSystemIndex = parts.findIndex(p => p === 'agent-system-minimal');
    const agentSystemRoot = parts.slice(0, agentSystemIndex + 1).join(path.sep);

    // Check if we're already in the tests directory
    if (currentPath.includes('tests')) {
      // Navigate up from current test case to the tests root, then to cases
      const testsIndex = parts.findIndex(p => p === 'tests');
      const testsRoot = parts.slice(0, testsIndex + 1).join(path.sep);
      return path.join(testsRoot, 'cases', caseName);
    }

    // We're in agent-system-minimal but not in tests yet
    return path.join(agentSystemRoot, 'tests', 'cases', caseName);
  }

  // We're in the workspace root
  return path.join(currentPath, '.github', 'agent-system-minimal', 'tests', 'cases', caseName);
}

/**
 * Get the output directory for test artifacts
 */
export function getTestOutputDir(caseName: string): string {
  return path.join(getTestCaseDir(caseName), 'output');
}

/**
 * Clean up test output directory
 */
export function cleanTestOutput(caseName: string): void {
  const outputDir = getTestOutputDir(caseName);
  deleteDir(outputDir);
}

/**
 * Extract YAML frontmatter from a chatmode file
 */
export function extractFrontmatter(content: string): { frontmatter: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    throw new Error('Invalid chatmode file: missing YAML frontmatter');
  }

  return {
    frontmatter: match[1],
    body: match[2]
  };
}

/**
 * Parse tools from YAML frontmatter
 */
export function parseTools(frontmatter: string): string[] {
  const match = frontmatter.match(/tools:\s*\[(.*?)\]/);

  if (!match) {
    return [];
  }

  return match[1]
    .split(',')
    .map(t => t.trim().replace(/['"]/g, ''))
    .filter(t => t.length > 0);
}

/**
 * Parse description from YAML frontmatter
 */
export function parseDescription(frontmatter: string): string {
  const match = frontmatter.match(/description:\s*(.+)/);
  return match ? match[1].trim() : '';
}
