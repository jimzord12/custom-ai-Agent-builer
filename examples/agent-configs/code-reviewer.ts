import type { AgentConfig } from '../../core/schema/agent.schema.js';

/**
 * CODE REVIEWER AGENT
 *
 * Reviews code changes with detailed feedback and suggestions.
 * Read-only permissions with focus on quality assurance.
 */
export const codeReviewerAgent: AgentConfig = {
  id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  name: 'Code Reviewer',
  version: '1.0.0',
  description: 'Reviews code for quality, best practices, and potential issues',
  character: {},
  context: {
    frontend: new Set(['architecture', 'constitution']),
  },
};

export default codeReviewerAgent;
