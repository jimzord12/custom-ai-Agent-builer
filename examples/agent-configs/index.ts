/**
 * EXAMPLE AGENTS INDEX
 *
 * Exports all example agent configurations for easy importing.
 */

export { codeReviewerAgent } from './code-reviewer.js';
export { featureBuilderAgent } from './feature-builder.js';

// Re-export type for convenience
export type { AgentConfig } from '../../core/schema/agent.schema.js';
