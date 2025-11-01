/**
 * INJECTABLE PROMPTS
 *
 * Centralized exports for all injectable prompts used by generators.
 */

export { BEHAVIOR_PROMPTS } from './behavior-prompts.js';
export { getPromptForPermission, getToolsForPermission, PERMISSION_DEFINITIONS, type PermissionDefinition, type VSCodeTool } from './permission-prompts.js';
export { ROLE_PROMPTS } from './role-prompts.js';

export type { BehaviorProfileName, PermissionLevelName, RoleName } from '../../core/schema/primitives.schema.js';
