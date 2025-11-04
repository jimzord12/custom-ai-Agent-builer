import { z } from 'zod';
import { ContextChipRegistry } from '../../registries/types.js';

// ============================================================================
// REGISTRY SCHEMA BUILDER OPTIONS
// ============================================================================

export interface RegistrySchemaOptions {
  /** Is chip selection required? */
  required?: boolean;
  /** Minimum number of chips to select */
  minChips?: number;
  /** Maximum number of chips to select */
  maxChips?: number;
  /** Allow multiple chip selection? */
  allowMultiple?: boolean;
}

export type RegistryOptionsMap<T extends Record<string, ContextChipRegistry>> = {
  [K in keyof T]?: RegistrySchemaOptions;
};

// ============================================================================
// SCHEMA BUILDERS
// ============================================================================

export function createValidatedRegistrySchema<T extends ContextChipRegistry>(
  registry: T,
  registryName: string,
  options: RegistrySchemaOptions = {}
) {
  const { required = false, minChips, maxChips, allowMultiple = true } = options;

  // Validate chip IDs exist in registry
  const chipIdSchema = z.string().refine((chipId: string) => chipId in registry, {
    message: `Invalid chip ID for registry '${registryName}'. Available chips: ${Object.keys(
      registry
    ).join(', ')}`,
  });

  // Build set schema with constraints
  let setSchema: z.ZodType = z.set(chipIdSchema);

  // Apply minimum chips constraint
  if (minChips !== undefined) {
    setSchema = setSchema.refine((set: unknown) => (set as Set<string>).size >= minChips, {
      message: `Registry '${registryName}': Must select at least ${minChips} chip(s)`,
    });
  }

  // Apply maximum chips constraint
  if (maxChips !== undefined) {
    setSchema = setSchema.refine((set: unknown) => (set as Set<string>).size <= maxChips, {
      message: `Registry '${registryName}': Cannot select more than ${maxChips} chip(s)`,
    });
  }

  // Enforce single selection
  if (!allowMultiple) {
    setSchema = setSchema.refine((set: unknown) => (set as Set<string>).size <= 1, {
      message: `Registry '${registryName}': Only one chip allowed`,
    });
  }

  // Make optional if not required
  return required ? setSchema : setSchema.optional();
}

/**
 * Creates a schema for single-selection registries (roles, permissions)
 *
 * @example
 * ```typescript
 * const roleSchema = createSingleSelectionSchema(RoleRegistry, 'role', true);
 * // Validates: must be exactly one chip ID from RoleRegistry
 * ```
 */
export function createSingleSelectionSchema<T extends ContextChipRegistry>(
  registry: T,
  registryName: string,
  required: boolean = true
) {
  const chipKeys = Object.keys(registry);

  if (chipKeys.length === 0) {
    throw new Error(`Registry '${registryName}' has no chips defined`);
  }

  // Create a string schema with enum validation
  const enumSchema = z
    .string()
    .refine((val: string) => chipKeys.includes(val), {
      message: `Must select one of: ${chipKeys.join(', ')}`,
    })
    .describe(`Must select one ${registryName}`);

  return required ? enumSchema : enumSchema.optional();
}

/**
 * Creates a schema for multi-selection registries (behaviors, context chips)
 *
 * @example
 * ```typescript
 * // Require 1-3 behaviors
 * const behaviorSchema = createMultiSelectionSchema(
 *   BehaviorRegistry,
 *   'behaviors',
 *   { min: 1, max: 3, required: false }
 * );
 * ```
 */
export function createMultiSelectionSchema<T extends ContextChipRegistry>(
  registry: T,
  registryName: string,
  options: { min?: number; max?: number; required?: boolean } = {}
) {
  const { min, max, required = false } = options;
  const chipKeys = Object.keys(registry);

  if (chipKeys.length === 0) {
    throw new Error(`Registry '${registryName}' has no chips defined`);
  }

  // Create a string schema that validates against chip keys
  const chipSchema = z.string().refine((val: string) => chipKeys.includes(val), {
    message: `Invalid chip. Must be one of: ${chipKeys.join(', ')}`,
  });

  let schema: z.ZodType = z.set(chipSchema);

  // Apply minimum constraint
  if (min !== undefined) {
    schema = schema.refine((set: unknown) => (set as Set<string>).size >= min, {
      message: `Registry '${registryName}': Must select at least ${min} chip(s)`,
    });
  }

  // Apply maximum constraint
  if (max !== undefined) {
    schema = schema.refine((set: unknown) => (set as Set<string>).size <= max, {
      message: `Registry '${registryName}': Cannot select more than ${max} chip(s)`,
    });
  }

  return required ? schema : schema.optional();
}

/**
 * Creates a complete context schema from multiple registries
 *
 * @example
 * ```typescript
 * const characterSchema = createContextSchema(internalContextChipRegistries, {
 *   role: { required: true, allowMultiple: false },
 *   permissions: { required: true, allowMultiple: false },
 *   behaviors: { required: false, minChips: 1, maxChips: 3 }
 * });
 * ```
 */
export function createContextSchema<T extends Record<string, ContextChipRegistry>>(
  registries?: T,
  registryOptions?: RegistryOptionsMap<T>
) {
  // Use empty object if no registries provided (for optional context)
  const regs = registries ?? ({} as T);

  const schemaObject: Record<string, z.ZodType> = Object.fromEntries(
    Object.entries(regs).map(([registryName, registry]) => [
      registryName,
      createValidatedRegistrySchema(registry, registryName, registryOptions?.[registryName] ?? {}),
    ])
  );

  return z.object(schemaObject).optional();
}

/**
 * Creates a strict context schema where at least one registry must have selections
 *
 * @example
 * ```typescript
 * const contextSchema = createStrictContextSchema(projectRegistries, {
 *   frontend: { minChips: 1 }
 * });
 * // Valid: { frontend: new Set(['architecture']) }
 * // Invalid: {} or { frontend: new Set() }
 * ```
 */
export function createStrictContextSchema<T extends Record<string, ContextChipRegistry>>(
  registries: T,
  registryOptions?: RegistryOptionsMap<T>
) {
  const baseSchema = createContextSchema(registries, registryOptions);

  return baseSchema.refine(
    context => {
      if (!context) return false;
      // Check if at least one registry has selections
      return Object.values(context).some(
        chips =>
          chips && typeof chips === 'object' && 'size' in chips && (chips as Set<unknown>).size > 0
      );
    },
    {
      message: 'At least one registry must have chip selections',
    }
  );
}

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Infer the type of a context schema created from registries
 */
export type InferContextType<T extends Record<string, ContextChipRegistry>> = {
  [K in keyof T]?: Set<keyof T[K]>;
};

/**
 * Infer the type of a required context schema
 */
export type InferStrictContextType<T extends Record<string, ContextChipRegistry>> = {
  [K in keyof T]?: Set<keyof T[K]>;
} & { [K in keyof T]: Set<keyof T[K]> }[keyof T]; // At least one must be defined

/**
 * Helper type to extract valid chip IDs for a registry
 */
export type ChipIdsForRegistry<T extends ContextChipRegistry> = keyof T;

/**
 * Helper type to create type-safe context from registries with constraints
 */
export type TypedContext<
  T extends Record<string, ContextChipRegistry>,
  Options extends RegistryOptionsMap<T> = {}
> = {
  [K in keyof T]: Options[K] extends { required: true }
    ? Options[K] extends { allowMultiple: false }
      ? Set<ChipIdsForRegistry<T[K]>> // Required single: Set with exactly one item
      : Set<ChipIdsForRegistry<T[K]>> // Required multiple: Set with items
    : Options[K] extends { allowMultiple: false }
    ? Set<ChipIdsForRegistry<T[K]>> | undefined // Optional single
    : Set<ChipIdsForRegistry<T[K]>> | undefined; // Optional multiple
};
