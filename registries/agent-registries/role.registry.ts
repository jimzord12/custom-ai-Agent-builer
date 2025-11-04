import type { RoleName } from '../../core/schema/primitives.schema.js';
import { ContextChipEntry } from '../types.js';

/**
 * Role Registry
 *
 * Centralized registry of all available agent roles.
 * Each role defines a specific agent function and behavior pattern.
 */
export const RoleRegistry: Record<RoleName, ContextChipEntry> = {
  analyst: {
    id: 'analyst',
    name: 'Analyst',
    path: 'contexts/roles/analyst.context.md',
    description: 'Examines code, identifies patterns, and uncovers issues',
    tags: ['analysis', 'quality', 'security', 'performance'],
    version: '1.0.0',
  },

  architect: {
    id: 'architect',
    name: 'Architect',
    path: 'contexts/roles/architect.context.md',
    description: 'Designs solutions and plans technical implementations',
    tags: ['architecture', 'design', 'planning', 'systems'],
    version: '1.0.0',
  },

  implementer: {
    id: 'implementer',
    name: 'Implementer',
    path: 'contexts/roles/implementer.context.md',
    description: 'Writes code and creates implementations',
    tags: ['development', 'implementation', 'coding'],
    version: '1.0.0',
  },

  reviewer: {
    id: 'reviewer',
    name: 'Reviewer',
    path: 'contexts/roles/reviewer.context.md',
    description: 'Ensures quality and adherence to standards',
    tags: ['review', 'quality', 'standards', 'feedback'],
    version: '1.0.0',
  },

  guide: {
    id: 'guide',
    name: 'Guide',
    path: 'contexts/roles/guide.context.md',
    description: 'Explains concepts and provides documentation',
    tags: ['education', 'documentation', 'guidance', 'teaching'],
    version: '1.0.0',
  },

  orchestrator: {
    id: 'orchestrator',
    name: 'Orchestrator',
    path: 'contexts/roles/orchestrator.context.md',
    description: 'Manages workflows and coordinates tasks',
    tags: ['coordination', 'workflow', 'management', 'orchestration'],
    version: '1.0.0',
  },
};

export default RoleRegistry;
