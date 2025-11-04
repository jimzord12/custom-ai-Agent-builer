import type { AgentConfig } from '../core/schema/agent.schema';

/**
 * ============================================================================
 * AGENT CONFIGURATION TEMPLATE
 * ============================================================================
 *
 * This template helps you create custom AI agents for VS Code Copilot.
 * Copy this file and customize it for your specific agent needs.
 *
 * QUICK START:
 * 1. Copy this file to your project
 * 2. Modify the values below to match your agent's purpose
 * 3. Run the generator script to create your chatmode file
 * 4. Your agent will be available in VS Code Copilot!
 *
 * AVAILABLE OPTIONS:
 * - Roles: analyst, architect, implementer, reviewer, guide, orchestrator
 * - Behaviors: concise, detailed, interactive, autonomous, creative, conservative
 * - Permissions: read-only, documentation, controlled, full
 *
 * ============================================================================
 */

// ============================================================================
// YOUR AGENT CONFIGURATION
// ============================================================================

export const myAgent: AgentConfig = {
  // ----------------------------------------------------------------------------
  // REQUIRED FIELDS
  // ----------------------------------------------------------------------------

  /**
   * Agent Name
   *
   * A human-readable name for your agent.
   * This will appear in VS Code's chat interface.
   *
   * Example: "Code Reviewer", "Feature Builder", "Documentation Writer"
   */
  name: 'My Custom Agent',

  /**
   * Version
   *
   * Semantic version number (major.minor.patch)
   * Increment when making changes to your agent configuration.
   *
   * Example: "1.0.0", "2.1.3"
   */
  version: '1.0.0',

  /**
   * Description
   *
   * Brief explanation of what your agent does.
   * This appears in the chat interface and helps users understand the agent's purpose.
   *
   * Max length: 500 characters
   * Example: "Reviews code for quality, best practices, and potential issues"
   */
  description: 'Brief description of what this agent does',

  /**
   * Role
   *
   * Defines the agent's primary function and perspective.
   *
   * Available roles:
   * - 'analyst'      : Examines code/data, identifies patterns, provides insights
   * - 'architect'    : Designs systems, suggests structure, makes architectural decisions
   * - 'implementer'  : Writes code, builds features, executes tasks
   * - 'reviewer'     : Reviews code, provides feedback, ensures quality
   * - 'guide'        : Teaches, explains concepts, provides learning support
   * - 'orchestrator' : Coordinates workflows, manages complex tasks, delegates
   */
  role: 'implementer',

  /**
   * Permissions
   *
   * Controls what tools and capabilities the agent can access.
   *
   * Available levels:
   * - 'read-only'     : Can only read code and search (7 tools)
   *                     Tools: search, fetch, githubRepo, usages, problems, changes, testFailure
   *
   * - 'documentation' : Can read code and create docs (10 tools)
   *                     Adds: vscodeAPI, runTasks, plus markdown editing
   *
   * - 'controlled'    : Can read and make limited edits (13 tools)
   *                     Adds: edit, new, runCommands (with restrictions)
   *
   * - 'full'          : Unrestricted access to all tools
   *                     All tools available without limitations
   */
  permissions: {
    level: 'controlled',
  },

  /**
   * Behavior
   *
   * Defines how the agent communicates and interacts.
   *
   * Available profiles:
   * - 'concise'      : Brief responses, minimal explanation, gets straight to the point
   * - 'detailed'     : Thorough explanations, comprehensive analysis, educational
   * - 'interactive'  : Asks clarifying questions, confirms before acting, collaborative
   * - 'autonomous'   : Takes initiative, makes decisions independently, minimal questions
   * - 'creative'     : Explores alternatives, suggests innovative solutions, flexible
   * - 'conservative' : Safe, proven approaches, prefers stability, risk-averse
   */
  behavior: {
    profile: 'detailed',
  },

  // ----------------------------------------------------------------------------
  // OPTIONAL CONTEXT (Customize for your project)
  // ----------------------------------------------------------------------------

  /**
   * Context Chips
   *
   * Reference external markdown files using the registry-based context chips system.
   * Each registry (e.g., 'frontend') contains predefined chip IDs that map to markdown files.
   *
   * USAGE:
   * context: {
   *   registryName: new Set(['chipId1', 'chipId2'])
   * }
   *
   * AVAILABLE REGISTRIES:
   * - 'frontend' - Contains chips for frontend projects
   *
   * AVAILABLE CHIP IDs (frontend registry):
   * - 'constitution'      - Project goals, values, non-negotiable rules
   * - 'architecture'      - System design, module structure, data flow
   * - 'api-guidelines'    - REST API design standards
   * - 'testing-standards' - Testing guidelines and best practices
   * - 'code-style'        - Code formatting and naming conventions
   *
   * See: registries/frontend.registry.ts for the full registry
   * Chip files location: contexts/*.context.md
   */
  context: {
    // Example: Include constitution and architecture chips from frontend registry
    frontend: new Set(['constitution', 'architecture']),
  },
};

// ============================================================================
// EXPORT YOUR AGENT
// ============================================================================

export default myAgent;

// ============================================================================
// EXAMPLE CONFIGURATIONS
// ============================================================================

/**
 * Example 1: Minimal Agent (only required fields)
 */
export const minimalAgent: AgentConfig = {
  name: 'Quick Helper',
  version: '1.0.0',
  description: 'A simple helper agent with minimal configuration',
  role: 'guide',
  permissions: { level: 'read-only' },
  behavior: { profile: 'concise' },
};

/**
 * Example 2: Code Reviewer Agent
 */
export const codeReviewerExample: AgentConfig = {
  name: 'Code Reviewer',
  version: '1.0.0',
  description: 'Reviews code for quality, best practices, and potential issues',
  role: 'reviewer',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' },
  context: {
    // Use constitution chip to provide project values and standards
    frontend: new Set(['constitution', 'code-style']),
  },
};

/**
 * Example 3: Feature Builder Agent
 */
export const featureBuilderExample: AgentConfig = {
  name: 'Feature Builder',
  version: '1.0.0',
  description: 'Implements new features from requirements to deployment',
  role: 'implementer',
  permissions: { level: 'full' },
  behavior: { profile: 'autonomous' },
  context: {
    // Include architecture and code style for implementation guidance
    frontend: new Set(['architecture', 'code-style', 'testing-standards']),
  },
};

/**
 * Example 4: Documentation Writer Agent
 */
export const docWriterExample: AgentConfig = {
  name: 'Documentation Writer',
  version: '1.0.0',
  description: 'Creates and maintains comprehensive project documentation',
  role: 'guide',
  permissions: { level: 'documentation' },
  behavior: { profile: 'detailed' },
  context: {
    patterns: {
      preferred: [
        'Clear and concise explanations',
        'Include code examples',
        'Use proper markdown formatting',
        'Keep documentation up-to-date',
      ],
    },
  } as any,
};

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

/*
 * HOW TO USE THIS TEMPLATE:
 *
 * 1. Copy this file:
 *    - For project-specific agents: Copy to your examples/ directory
 *    - For personal agents: Copy anywhere in your project
 *
 * 2. Customize the configuration:
 *    - Update name, description, and version
 *    - Choose appropriate role, permissions, and behavior
 *    - Fill in context (techStack, conventions, patterns)
 *    - Add context chips if needed
 *
 * 3. Generate chatmode file:
 *    PowerShell:  .\scripts\generate.ps1 path/to/your-agent.ts
 *    Bash:        ./scripts/generate.sh path/to/your-agent.ts
 *
 *    Or programmatically:
 *    import { generateChatmode } from './generators/vscode-copilot';
 *    await generateChatmode({ agentConfig: './your-agent.ts' });
 *
 * 4. Test your agent:
 *    - Open VS Code
 *    - Start a new chat
 *    - Type @ to see available agents
 *    - Select your custom agent and test it!
 *
 * 5. Iterate and improve:
 *    - Adjust settings based on how the agent performs
 *    - Update version number when making changes
 *    - Regenerate chatmode file after edits
 *
 * TIPS:
 * - Start with minimal configuration and add context as needed
 * - Use read-only permissions for review/analysis agents
 * - Use full permissions only for trusted implementation agents
 * - Test behavior profiles to find the right communication style
 * - Document your agent's purpose clearly in the description
 *
 * TROUBLESHOOTING:
 * - Agent not showing in VS Code? Check the .github/chatmodes/ directory
 * - Validation errors? Ensure all required fields are present
 * - Tool errors? Verify permissions level matches agent needs
 * - Unexpected behavior? Review role and behavior profile choices
 */
