import { z } from 'zod';
import { ContextSchema } from './context.schema.js';
import { BehaviorProfileName, PermissionLevelName, RoleName } from './primitives.schema.js';

/**
 * MINIMAL AGENT CONFIGURATION SCHEMA
 *
 * Simplified schema with only essential fields for MVP.
 * Advanced features (workflows, validation, traits) deferred to later versions.
 */

// ============================================================================
// PERMISSIONS (Simplified)
// ============================================================================

export const PermissionsSchema = z.object({
  level: PermissionLevelName
});

export type Permissions = z.infer<typeof PermissionsSchema>;

// ============================================================================
// BEHAVIOR (Simplified)
// ============================================================================

export const BehaviorSchema = z.object({
  profile: BehaviorProfileName
});

export type Behavior = z.infer<typeof BehaviorSchema>;

// ============================================================================
// MAIN AGENT CONFIGURATION
// ============================================================================

/**
 * Minimal Agent Configuration Schema
 *
 * Only essential fields required to create functional agents.
 */
export const AgentConfigSchema = z.object({
  // Required core fields
  name: z.string().min(1).max(100).describe('Human-readable agent name'),

  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .describe('Semantic version (e.g., 1.0.0)'),

  description: z.string().max(500).describe('Brief description of agent purpose'),

  role: RoleName.describe('Primary role defining agent function'),

  permissions: PermissionsSchema.describe('Permission level for agent operations'),

  behavior: BehaviorSchema.describe('Communication and interaction style'),

  // Optional context
  context: ContextSchema.describe('Project-specific context (tech stack, conventions, patterns)')
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates an agent configuration and returns typed result
 */
export function validateAgentConfig(config: unknown): {
  success: boolean;
  data?: AgentConfig;
  errors?: z.ZodError;
} {
  const result = AgentConfigSchema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data
    };
  } else {
    return {
      success: false,
      errors: result.error
    };
  }
}

/**
 * Parses an agent configuration (throws on error)
 */
export function parseAgentConfig(config: unknown): AgentConfig {
  return AgentConfigSchema.parse(config);
}

export default AgentConfigSchema;
