import type { PermissionLevelName } from '../../core/schema/primitives.schema.js';

/**
 * PERMISSION PROMPTS AND TOOLS MAPPING
 *
 * Defines what each permission level allows and maps to VS Code Copilot tools.
 * These are injected into generated chatmode files based on agent configuration.
 */

/**
 * Available VS Code Copilot tools
 */
export type VSCodeTool =
  | 'search' // Search codebase
  | 'edit' // Edit files
  | 'new' // Create files
  | 'fetch' // Fetch web content
  | 'githubRepo' // Access GitHub repos
  | 'usages' // Find code usages
  | 'runCommands' // Execute terminal commands
  | 'runTasks' // Run VS Code tasks
  | 'vscodeAPI' // Access VS Code APIs
  | 'problems' // View errors/warnings
  | 'changes' // View git changes
  | 'testFailure'; // View test failures

/**
 * Permission level definitions with tools and prompts
 */
export interface PermissionDefinition {
  tools: VSCodeTool[];
  prompt: string;
}

export const PERMISSION_DEFINITIONS: Record<PermissionLevelName, PermissionDefinition> = {
  'read-only': {
    tools: ['search', 'fetch', 'githubRepo', 'usages', 'problems', 'changes', 'testFailure'],
    prompt: `## Permissions: Read-Only

You have read-only access to the codebase:

**Allowed:**
- Search and analyze code
- Read files and documentation
- Find code usages and references
- View errors, warnings, and test failures
- Examine git changes
- Fetch external documentation

**Not Allowed:**
- Creating or modifying files
- Running commands or tasks
- Making any changes to the codebase

Focus on analysis, recommendations, and documentation. If changes are needed, describe what should be changed and why, but do not attempt to make the changes yourself.`
  },

  documentation: {
    tools: ['search', 'edit', 'new', 'fetch', 'githubRepo', 'usages', 'problems', 'changes'],
    prompt: `## Permissions: Documentation

You can create and modify documentation:

**Allowed:**
- All read-only capabilities
- Create and edit documentation files (*.md, *.txt, docs/*)
- Update README files
- Create inline code comments and JSDoc
- Update development documentation

**Not Allowed:**
- Modifying source code files
- Running commands or tasks
- Changing configuration files

Focus on clear, accurate, and helpful documentation. Keep documentation synchronized with code changes when reviewing.`
  },

  controlled: {
    tools: ['search', 'edit', 'new', 'fetch', 'githubRepo', 'usages', 'runTasks', 'problems', 'changes', 'testFailure'],
    prompt: `## Permissions: Controlled

You can create and modify files with limitations:

**ALLOWED:**
- All read and documentation capabilities
- Create and edit source code files
- Modify configuration files
- Run VS Code tasks (build, test, lint)
- Create tests and test files

**NOT ALLOWED:**
- Running arbitrary terminal commands
- Accessing VS Code APIs directly
- Making destructive changes without confirmation

**BEFORE** making significant changes:
1. Explain what you plan to do and why
2. Consider the impact on existing code
3. Ensure changes follow project conventions
4. Write or update tests as needed

When in doubt, **ASK** for confirmation.`
  },

  full: {
    tools: ['search', 'edit', 'new', 'fetch', 'githubRepo', 'usages', 'runCommands', 'runTasks', 'vscodeAPI', 'problems', 'changes', 'testFailure'],
    prompt: `## Permissions: Full Access

You have full access with safety confirmations:

**ALLOWED:**
- All controlled capabilities
- Run terminal commands
- Access VS Code APIs
- Make system-level changes
- Install dependencies
- Modify build configurations

**SAFETY GUIDELINES:**

1. **CONFIRM DESTRUCTIVE OPERATIONS**: Always confirm before:
   - Deleting files or directories
   - Modifying critical configuration files
   - Running commands that modify system state
   - Installing or updating dependencies

2. **Explain Impact**: Describe the impact of significant changes before proceeding

3. **Validate Changes**: Run tests and checks after making changes

4. **Maintain Quality**: Follow all project conventions and best practices

With great power comes great responsibility. Use full access judiciously and always prioritize code quality and project stability.`
  }
};

/**
 * Get tools array for a permission level
 */
export function getToolsForPermission(permission: PermissionLevelName): VSCodeTool[] {
  return PERMISSION_DEFINITIONS[permission].tools;
}

/**
 * Get prompt for a permission level
 */
export function getPromptForPermission(permission: PermissionLevelName): string {
  return PERMISSION_DEFINITIONS[permission].prompt;
}

export default PERMISSION_DEFINITIONS;
