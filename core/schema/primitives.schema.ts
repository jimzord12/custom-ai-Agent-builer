import { z } from 'zod';

/**
 * PRIMITIVES - Minimal Agent Framework Building Blocks
 *
 * Simplified to only essential enums for the MVP.
 */

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
