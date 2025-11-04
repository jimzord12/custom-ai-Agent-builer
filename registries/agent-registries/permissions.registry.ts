import type { PermissionLevelName } from '../../core/schema/primitives.schema.js';
import { ContextChipEntry } from '../types.js';

/**
 * Permissions Registry
 *
 * Centralized registry of all permission levels.
 * Each level defines what operations an agent can perform.
 */
export const PermissionsRegistry: Record<PermissionLevelName, ContextChipEntry> = {
  'read-only': {
    id: 'read-only',
    name: 'Read-Only',
    path: 'contexts/permissions/read-only.context.md',
    description: 'Analysis and examination without modifications',
    tags: ['read-only', 'analysis', 'safe'],
    version: '1.0.0',
  },

  documentation: {
    id: 'documentation',
    name: 'Documentation',
    path: 'contexts/permissions/documentation.context.md',
    description: 'Create and modify documentation files only',
    tags: ['documentation', 'limited-write', 'safe'],
    version: '1.0.0',
  },

  controlled: {
    id: 'controlled',
    name: 'Controlled',
    path: 'contexts/permissions/controlled.context.md',
    description: 'Create and modify files with safety restrictions',
    tags: ['controlled', 'development', 'supervised'],
    version: '1.0.0',
  },

  full: {
    id: 'full',
    name: 'Full Access',
    path: 'contexts/permissions/full.context.md',
    description: 'Complete access with safety confirmations',
    tags: ['full-access', 'powerful', 'requires-confirmation'],
    version: '1.0.0',
  },
};

/**
 * Get permission entry by ID
 */
export function getPermissionById(id: PermissionLevelName): ContextChipEntry {
  return PermissionsRegistry[id];
}

/**
 * Get all available permission levels
 */
export function getAllPermissions(): ContextChipEntry[] {
  return Object.values(PermissionsRegistry);
}

export default PermissionsRegistry;
