import type { AgentConfig } from '../../../../core/schema/agent.schema.js';

/**
 * TEST AGENT CONFIG - REGISTRY CONTEXT CHIPS
 *
 * This agent demonstrates:
 * - Using context chips from the registry
 * - Referencing chips by ID
 * - No inline context
 */
export const registryChipsAgentConfig: AgentConfig = {
  name: 'Registry Chips Agent',
  version: '1.0.0',
  description: 'Agent using context chips from the registry',

  role: 'reviewer',

  permissions: {
    level: 'read-only'
  },

  behavior: {
    profile: 'concise'
  },

  context: {
    chips: new Set(['constitution', 'architecture'])
  }
};

export default registryChipsAgentConfig;
