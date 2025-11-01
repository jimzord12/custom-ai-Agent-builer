import { z } from 'zod';

/**
 * PRIMITIVES - Minimal Agent Framework Building Blocks
 *
 * Simplified to only essential enums for the MVP.
 */

// ============================================================================
// ROLES - Agent Types
// ============================================================================

/**
 * Available agent roles that define primary function
 */
export const RoleName = z.enum([
  'analyst', // Examines code, finds patterns, identifies issues
  'architect', // Designs solutions, plans implementations
  'implementer', // Writes code, creates files, modifies systems
  'reviewer', // Validates work, ensures quality, provides feedback
  'guide', // Explains concepts, provides documentation
  'orchestrator' // Coordinates tasks, manages workflows
]);

export type RoleName = z.infer<typeof RoleName>;

// ============================================================================
// PERMISSION LEVELS
// ============================================================================

/**
 * Permission levels controlling what agents can do
 */
export const PermissionLevelName = z.enum([
  'read-only', // Can only read and analyze, no modifications
  'documentation', // Can create/modify documentation only
  'controlled', // Can create/modify files with restrictions
  'full' // Full access with safety confirmations
]);

export type PermissionLevelName = z.infer<typeof PermissionLevelName>;

// ============================================================================
// BEHAVIOR PROFILES
// ============================================================================

/**
 * Behavior profiles defining communication style and approach
 */
export const BehaviorProfileName = z.enum([
  'concise', // Brief, to-the-point responses
  'detailed', // Comprehensive explanations with context
  'interactive', // Asks questions, seeks clarification
  'autonomous', // Makes decisions independently
  'creative', // Explores multiple solutions
  'conservative' // Follows established patterns strictly
]);

export type BehaviorProfileName = z.infer<typeof BehaviorProfileName>;

// ============================================================================
// CONTEXT CHIPS - Context Building Blocks
// ============================================================================

/**
 * Context chip reference - supports both registry ID and direct path
 *
 * Use registry ID (recommended) for centralized management,
 * or pathFromRoot for ad-hoc custom chips.
 */
export const ContextChipSchema = z
  .object({
    /** Registry ID - references a chip in the context chip registry */
    id: z.string().optional(),
    /** Human-readable name for the chip */
    name: z.string().min(1).max(100),
    /** Optional description */
    description: z.string().max(500).optional(),
    /** Direct file path from project root (alternative to registry ID) */
    pathFromRoot: z.string().optional()
  })
  .refine(data => data.id || data.pathFromRoot, {
    message: "Either 'id' (registry reference) or 'pathFromRoot' (direct path) must be provided"
  });

export type ContextChip = z.infer<typeof ContextChipSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

export const Primitives = {
  RoleName,
  PermissionLevelName,
  BehaviorProfileName
} as const;

export default Primitives;
