// ============================================================================
// CONTEXT
// ============================================================================

/**
 * This schema should be used to in conjuction with generators and templates to create markdown files that are links to `ContextChip`s.
 */

import z from 'zod';
import { contextChipRegistries } from '../../registries/index.js';

// ============================================================================
// TYPE-SAFE CONTEXT REGISTRY TYPES
// ============================================================================

/**
 * Extract registry names from the context chip registries
 */
export type ContextChipRegistries = typeof contextChipRegistries;
export type ContextChipRegistriesKeys = keyof ContextChipRegistries;

/**
 * Extract chip IDs for a specific registry
 */
export type ChipIdsForRegistry<T extends ContextChipRegistriesKeys> = keyof ContextChipRegistries[T];

/**
 * Union of all possible chip IDs across all registries
 */
export type AnyChipId = {
  [K in ContextChipRegistriesKeys]: keyof (typeof contextChipRegistries)[K];
}[ContextChipRegistriesKeys];

// export const TechStackSchema = z
//   .object({
//     framework: z.string().optional(),
//     language: z.string().optional(),
//     runtime: z.string().optional(),
//     packageManager: z.string().optional(),
//     testing: z.string().optional(),
//     linting: z.string().optional(),
//     database: z.string().optional(),
//     orm: z.string().optional(),
//     stateManagement: z.array(z.string()).optional(),
//     styling: z.string().optional(),
//     buildTool: z.string().optional()
//   })
//   .optional();

// export type TechStack = z.infer<typeof TechStackSchema>;

// export const ConventionsSchema = z
//   .object({
//     fileNaming: z.enum(['kebab-case', 'camelCase', 'PascalCase', 'snake_case']).optional(),
//     componentNaming: z.enum(['PascalCase', 'camelCase']).optional(),
//     functionNaming: z.enum(['camelCase', 'snake_case', 'PascalCase']).optional(),
//     testPattern: z.string().optional(),
//     importOrder: z.array(z.string()).optional()
//   })
//   .optional();

// export type Conventions = z.infer<typeof ConventionsSchema>;

// export const PatternsSchema = z
//   .object({
//     preferred: z.array(z.string()).optional(),
//     forbidden: z.array(z.string()).optional(),
//     architectural: z.string().optional()
//   })
//   .optional();

// export type Patterns = z.infer<typeof PatternsSchema>;

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
export const ContextSchema = z
  .object({
    // Dynamically create schema properties for each registry
    ...Object.fromEntries(
      Object.keys(contextChipRegistries).map(registryName => [
        registryName,
        z.set(z.string()).optional() // Will be validated against actual chip IDs at runtime
      ])
    )
  })
  .optional();

/**
 * Runtime-validated context schema with chip ID validation
 * This ensures chip IDs actually exist in their respective registries
 */
export const ValidatedContextSchema = z
  .object({
    ...Object.fromEntries(
      Object.entries(contextChipRegistries).map(([registryName, registry]) => [
        registryName,
        z.set(z.string().refine(chipId => chipId in registry, { message: `Invalid chip ID for registry '${registryName}'. Available chips: ${Object.keys(registry).join(', ')}` })).optional()
      ])
    )
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
export type ContextSchemaType = z.infer<typeof ContextSchema>;
