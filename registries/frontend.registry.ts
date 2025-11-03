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
    path: 'contexts/constitution.context.md',
    tags: ['governance', 'principles', 'values'],
    category: 'governance',
    version: '1.0.0',
  } as ContextChipEntry,

  // ============================================================================
  // TECHNICAL DOCUMENTATION
  // ============================================================================

  architecture: {
    id: 'architecture',
    name: 'Architecture Overview',
    description: 'High-level system design, module structure, and data flow',
    path: 'contexts/architecture.context.md',
    tags: ['architecture', 'design', 'system'],
    category: 'technical',
    version: '1.0.0',
  } as ContextChipEntry,

  'api-guidelines': {
    id: 'api-guidelines',
    name: 'API Design Guidelines',
    description: 'REST API design standards, conventions, and best practices',
    path: 'contexts/api-guidelines.context.md',
    tags: ['api', 'rest', 'guidelines', 'standards'],
    category: 'technical',
    version: '1.0.0',
  } as ContextChipEntry,

  'testing-standards': {
    id: 'testing-standards',
    name: 'Testing Standards',
    description: 'Comprehensive testing guidelines, patterns, and best practices',
    path: 'contexts/testing-standards.context.md',
    tags: ['testing', 'quality', 'standards', 'tdd'],
    category: 'technical',
    version: '1.0.0',
  } as ContextChipEntry,

  'code-style': {
    id: 'code-style',
    name: 'Code Style Guide',
    description: 'Code formatting, naming conventions, and style standards',
    path: 'contexts/code-style.context.md',
    tags: ['style', 'formatting', 'conventions', 'linting'],
    category: 'technical',
    version: '1.0.0',
  } as ContextChipEntry,

  // Add more chips here as needed
} as const;
