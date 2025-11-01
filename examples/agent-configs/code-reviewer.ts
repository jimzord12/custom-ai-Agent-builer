import type { AgentConfig } from '../../core/schema/agent.schema.js';

/**
 * CODE REVIEWER AGENT
 *
 * Reviews code changes with detailed feedback and suggestions.
 * Read-only permissions with focus on quality assurance.
 */
export const codeReviewerAgent: AgentConfig = {
  name: 'Code Reviewer',
  version: '1.0.0',
  description: 'Reviews code for quality, best practices, and potential issues',

  role: 'reviewer',

  permissions: {
    level: 'read-only'
  },

  behavior: {
    profile: 'detailed'
  },

  context: {
    frontend: new Set(['architecture', 'constitution'])
  }
};

export default codeReviewerAgent;
