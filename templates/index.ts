/**
 * TEMPLATE EXPORTS
 *
 * Central export point for all template modules.
 */

// Chatmode output template
export * from './chatmode-output.template';

// Context sections template
export * from './context-sections.template';

// Agent config template (for users)
export type { AgentConfig } from '../core/schema/agent.schema';
export { default as agentConfigTemplate } from '../docs/agent-config';
