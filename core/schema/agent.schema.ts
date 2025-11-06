import { z } from 'zod';
import {
  exampleContextChipRegistries,
  internalContextChipRegistries,
} from '../../registries/index.js';
import { ChipIdsForRegistry, createContextSchema } from './registry-schema-builder.js';

/**
 * MINIMAL AGENT CONFIGURATION SCHEMA
 *
 * Simplified schema with only essential fields for MVP.
 * Advanced features (workflows, validation, traits) deferred to later versions.
 */

// ============================================================================
// TYPE-SAFE CHARACTER AND CONTEXT TYPES
// ============================================================================

/**
 * Type-safe character definition with IntelliSense support
 */
export type AgentCharacter = {
  role: Set<ChipIdsForRegistry<typeof internalContextChipRegistries.role>>;
  permissions: Set<ChipIdsForRegistry<typeof internalContextChipRegistries.permissions>>;
  behaviors?: Set<ChipIdsForRegistry<typeof internalContextChipRegistries.behaviors>>;
};

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
  id: z.uuid().describe('Unique agent identifier (UUID)'),
  name: z.string().min(1).max(100).describe('Human-readable agent name'),

  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .describe('Semantic version (e.g., 1.0.0)'),

  description: z.string().max(500).describe('Brief description of agent purpose'),

  // Character traits and personality (framework-managed)
  character: createContextSchema(internalContextChipRegistries, {
    role: { required: true, allowMultiple: false }, // Must select exactly ONE role
    permissions: { required: true, allowMultiple: false }, // Must select exactly ONE permission level
    behaviors: { required: false, allowMultiple: true }, // Can select MULTIPLE behaviors (optional)
  }).describe('Character traits and personality'),

  // Optional project-specific context (user-managed)
  context: createContextSchema(exampleContextChipRegistries).describe(
    'Project-specific context (tech stack, conventions, patterns)'
  ),
});

/**
 * Type-safe agent configuration with IntelliSense
 */
export type AgentConfig = {
  id: string;
  name: string;
  version: string;
  description: string;
  character: AgentCharacter;
  context?: AgentContext;
};

/**
 * Zod-inferred type (less strict, used for validation)
 */
export type AgentConfigZod = z.infer<typeof AgentConfigSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates an agent configuration and returns typed result
 */
export function validateAgentConfig(config: unknown): {
  success: boolean;
  data?: AgentConfigZod;
  errors?: z.ZodError;
} {
  const result = AgentConfigSchema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      errors: result.error,
    };
  }
}

/**
 * Parses an agent configuration (throws on error)
 * Returns Zod-validated type
 */
export function parseAgentConfig(config: unknown): AgentConfigZod {
  return AgentConfigSchema.parse(config);
}

/**
 * Type guard to check if config is a valid AgentConfig
 */
export function isAgentConfig(config: unknown): config is AgentConfig {
  const result = AgentConfigSchema.safeParse(config);
  return result.success;
}

export default AgentConfigSchema;

