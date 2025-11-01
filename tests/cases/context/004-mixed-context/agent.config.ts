import type { AgentConfig } from '../../../../core/schema/agent.schema.js';

/**
 * TEST AGENT CONFIG - MIXED CONTEXT
 *
 * This agent demonstrates combining ALL context types:
 * - Inline context (techStack, conventions, patterns)
 * - Registry context chips (by ID)
 * - Direct path context chips (pathFromRoot)
 */
export const mixedContextAgentConfig: AgentConfig = {
  name: 'Mixed Context Agent',
  version: '1.0.0',
  description: 'Agent combining inline context, registry chips, and direct path chips',

  role: 'architect',

  permissions: {
    level: 'full'
  },

  behavior: {
    profile: 'autonomous'
  },

  context: {
    // Mixed context chips
    frontend: new Set(['constitution'])
  }
};

export default mixedContextAgentConfig;
