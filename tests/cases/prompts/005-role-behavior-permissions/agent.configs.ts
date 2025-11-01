import type { AgentConfig } from '../../../../core/schema/agent.schema.js';

/**
 * TEST AGENT CONFIGS - DIFFERENT ROLE/BEHAVIOR/PERMISSION COMBINATIONS
 *
 * These configs test various combinations of roles, behaviors, and permissions
 * to ensure correct prompt injection and tool mappings.
 */

// Analyst + Concise + Read-Only
export const analystAgent: AgentConfig = {
  name: 'Analyst Agent',
  version: '1.0.0',
  description: 'Analyzes code with concise feedback',
  role: 'analyst',
  permissions: { level: 'read-only' },
  behavior: { profile: 'concise' }
};

// Architect + Creative + Documentation
export const architectAgent: AgentConfig = {
  name: 'Architect Agent',
  version: '1.0.0',
  description: 'Designs solutions creatively',
  role: 'architect',
  permissions: { level: 'documentation' },
  behavior: { profile: 'creative' }
};

// Guide + Interactive + Read-Only
export const guideAgent: AgentConfig = {
  name: 'Guide Agent',
  version: '1.0.0',
  description: 'Provides interactive guidance',
  role: 'guide',
  permissions: { level: 'read-only' },
  behavior: { profile: 'interactive' }
};

// Orchestrator + Conservative + Full
export const orchestratorAgent: AgentConfig = {
  name: 'Orchestrator Agent',
  version: '1.0.0',
  description: 'Manages workflows conservatively',
  role: 'orchestrator',
  permissions: { level: 'full' },
  behavior: { profile: 'conservative' }
};

export default {
  analyst: analystAgent,
  architect: architectAgent,
  guide: guideAgent,
  orchestrator: orchestratorAgent
};
