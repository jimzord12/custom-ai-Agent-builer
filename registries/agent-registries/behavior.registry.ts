import type { BehaviorProfileName } from '../../core/schema/primitives.schema.js';
import { ContextChipEntry } from '../types.js';

/**
 * Behavior Registry
 *
 * Centralized registry of all behavior profiles.
 * Each profile defines a communication and interaction style.
 */
export const BehaviorRegistry: Record<BehaviorProfileName, ContextChipEntry> = {
  concise: {
    id: 'concise',
    name: 'Concise',
    path: 'contexts/behaviors/concise.context.md',
    description: 'Brief, to-the-point communication',
    tags: ['concise', 'brief', 'efficient'],
    version: '1.0.0',
  },

  detailed: {
    id: 'detailed',
    name: 'Detailed',
    path: 'contexts/behaviors/detailed.context.md',
    description: 'Comprehensive, thorough explanations',
    tags: ['detailed', 'thorough', 'educational'],
    version: '1.0.0',
  },

  interactive: {
    id: 'interactive',
    name: 'Interactive',
    path: 'contexts/behaviors/interactive.context.md',
    description: 'Collaborative dialogue and feedback',
    tags: ['interactive', 'collaborative', 'questioning'],
    version: '1.0.0',
  },

  autonomous: {
    id: 'autonomous',
    name: 'Autonomous',
    path: 'contexts/behaviors/autonomous.context.md',
    description: 'Independent decision-making and execution',
    tags: ['autonomous', 'independent', 'self-directed'],
    version: '1.0.0',
  },

  creative: {
    id: 'creative',
    name: 'Creative',
    path: 'contexts/behaviors/creative.context.md',
    description: 'Innovative and exploratory approaches',
    tags: ['creative', 'innovative', 'exploratory'],
    version: '1.0.0',
  },

  conservative: {
    id: 'conservative',
    name: 'Conservative',
    path: 'contexts/behaviors/conservative.context.md',
    description: 'Strict adherence to established patterns',
    tags: ['conservative', 'stable', 'conventional'],
    version: '1.0.0',
  },
};

/**
 * Get behavior entry by ID
 */
export function getBehaviorById(id: BehaviorProfileName): ContextChipEntry {
  return BehaviorRegistry[id];
}

/**
 * Get all available behavior profiles
 */
export function getAllBehaviors(): ContextChipEntry[] {
  return Object.values(BehaviorRegistry);
}

export default BehaviorRegistry;
