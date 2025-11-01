import { ContextChipEntry } from './types.js';
/**
 * Context Chip Registry
 *
 * Add new chips here to make them available across all agents.
 * Chips are referenced by their ID in agent configurations.
 */
export const FrontendContextChipRegistry = {
  // ============================================================================
  // PROJECT GOVERNANCE
  // ============================================================================

  constitution: {
    id: 'constitution',
    name: 'Project Constitution',
    description: "Project's core goals, values, and non-negotiable rules",
    path: '.github/agent-system-minimal/contexts/constitution.context.md',
    tags: ['governance', 'principles', 'values'],
    category: 'governance',
    version: '1.0.0'
  } as ContextChipEntry,

  // ============================================================================
  // TECHNICAL DOCUMENTATION
  // ============================================================================

  architecture: {
    id: 'architecture',
    name: 'Architecture Overview',
    description: 'High-level system design, module structure, and data flow',
    path: '.github/agent-system-minimal/contexts/architecture.context.md',
    tags: ['architecture', 'design', 'system'],
    category: 'technical',
    version: '1.0.0'
  } as ContextChipEntry

  // Add more chips here as needed
  // Example:
  // 'api-guidelines': {
  //   id: 'api-guidelines',
  //   name: 'API Design Guidelines',
  //   description: 'REST API design standards and conventions',
  //   path: '.github/agent-system-minimal/contexts/api-guidelines.context.md',
  //   tags: ['api', 'rest', 'guidelines'],
  //   category: 'technical',
  //   version: '1.0.0'
  // }
} as const;
