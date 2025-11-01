import type { AgentConfig } from '../../../../core/schema/agent.schema.js';

/**
 * TEST AGENT CONFIG - BASIC WITH INLINE CONTEXT
 * > _Inline context means techStack, conventions, and patterns are defined directly in the config_
 *
 * This agent demonstrates:
 * - Minimal required fields
 * - Inline techStack context
 * - Inline conventions context
 * - Inline patterns context
 * - No context chips
 */
export const basicAgentConfig: AgentConfig = {
  name: 'Basic Test Agent',
  version: '1.0.0',
  description: 'A simple agent for testing inline context rendering',

  role: 'implementer',

  permissions: {
    level: 'controlled'
  },

  behavior: {
    profile: 'detailed'
  }
};

export default basicAgentConfig;
