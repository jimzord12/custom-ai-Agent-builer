// ============================================================================
// CONTEXT
// ============================================================================

/**
 * This schema should be used to in conjuction with generators and templates to create markdown files that are links to `ContextChip`s.
 */

import z from 'zod';
import { allContextChipRegistries } from '../../registries/index.js';
import { ContextChipRegistry } from '../../registries/types.js';

// ============================================================================
// TYPE-SAFE CONTEXT REGISTRY TYPES
// ============================================================================

/**
 * Extract registry names from the context chip registries
 */
export type ContextChipRegistries = typeof allContextChipRegistries;
export type ContextChipRegistriesKeys = keyof ContextChipRegistries;

/**
 * Extract chip IDs for a specific registry
 */
export type ChipIdsForRegistry<T extends ContextChipRegistriesKeys> =
  keyof ContextChipRegistries[T];

/**
 * Union of all possible chip IDs across all registries
 */
export type AnyChipId = {
  [K in ContextChipRegistriesKeys]: keyof (typeof allContextChipRegistries)[K];
}[ContextChipRegistriesKeys];

// ============================================================================
// LEGACY INLINE CONTEXT SCHEMAS (DEPRECATED)
// ============================================================================
// These schemas were used for inline context definitions (techStack, conventions, patterns)
// that were directly embedded in agent configurations.
//
// MIGRATION NOTE:
// The framework has migrated to a registry-based context chip system for better:
// - Reusability across agents
// - Type safety with validated chip IDs
// - Single source of truth for context definitions
// - Easier maintenance and updates
//
// To add new context, create context chips in the registry instead.
// See: registries/frontend.registry.ts and contexts/*.context.md
//
// These schemas are preserved only for legacy test cases and will be removed in v2.0.0
// ============================================================================

// ============================================================================
// ZOD SCHEMA
// ============================================================================

/**
 * Example of what this enables:
 * ```typescript
 * const contextExample: Context = {
 *   frontend: new Set(['architecture', 'constitution']) // ✅ Type-safe! Only valid chip IDs allowed
 * }
 * ```
 */

/**
 * Type-safe context schema that ensures:
 * 1. Keys must be valid registry names (e.g., 'frontend')
 * 2. Values must be sets of valid chip IDs from that registry
 */
export const createContextSchema = <
  T extends Record<string, ContextChipRegistry> = ContextChipRegistries
>(
  registries?: T
) =>
  z
    .object({
      ...Object.fromEntries(
        Object.keys(registries ?? allContextChipRegistries).map(registryName => [
          registryName,
          z.set(z.string()).optional(),
        ])
      ),
    })
    .optional();

/**
 * Runtime-validated context schema with chip ID validation
 * This ensures chip IDs actually exist in their respective registries
 */
export const ValidatedContextSchema = z
  .object({
    ...Object.fromEntries(
      Object.entries(allContextChipRegistries).map(([registryName, registry]) => [
        registryName,
        z
          .set(
            z.string().refine((chipId: string) => chipId in registry, {
              message: `Invalid chip ID for registry '${registryName}'. Available chips: ${Object.keys(
                registry
              ).join(', ')}`,
            })
          )
          .optional(),
      ])
    ),
  })
  .optional();

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

/**
 * Type-safe context type that ensures chip IDs match their registry
 */
export type Context = {
  [K in ContextChipRegistriesKeys]?: Set<ChipIdsForRegistry<K>>;
};

/**
 * Inferred type from Zod schema (less strict, used for parsing)
 */
export type ContextSchemaType = z.infer<ReturnType<typeof createContextSchema>>;
