import type { AgentConfig } from '../../core/schema/agent.schema.js';

/**
 * FEATURE BUILDER AGENT
 *
 * Implements new features from requirements to deployment.
 * Full permissions with autonomous behavior.
 */
export const featureBuilderAgent: AgentConfig = {
  id: 'd4f5e6a7-b8c9-4d0e-9f1a-2b3c4d5e6f70',
  name: 'Feature Builder',
  version: '1.0.0',
  description: 'Implements new features from requirements to deployment',

  context: {
    frontend: new Set(['architecture', 'constitution']),
  },
};

export default featureBuilderAgent;
