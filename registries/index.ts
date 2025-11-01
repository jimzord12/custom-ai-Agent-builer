import { ContextChipRegistries, ContextChipRegistriesKeys } from '../core/schema/context.schema.js';
import { FrontendContextChipRegistry } from './frontend.registry.js';
import { ContextChipEntry, ContextChipRegistry } from './types.js';

// ============================================================================
// REGISTRY ENTRY TYPE
// ============================================================================

// ============================================================================
// REGISTRY DEFINITION
// ============================================================================

/**
 * Context Chip Registry
 *
 * Add new chips here to make them available across all agents.
 * Chips are referenced by their ID in agent configurations.
 */

export const contextChipRegistries = {
  frontend: FrontendContextChipRegistry
} as const;

// ============================================================================
// REGISTRY UTILITIES
// ============================================================================

/**
 * Get all available registry names
 */
export function getAllRegistryNames(): (keyof typeof contextChipRegistries)[] {
  return Object.keys(contextChipRegistries) as (keyof typeof contextChipRegistries)[];
}

/**
 * Get a context chip entry by ID
 * @example
 * const chip = getChipById('frontend', 'constitution'); ✅ (Both registry and ID are valid)
 * const chip = getChipById('frontend2', 'constitution'); ❌ (Invalid registry)
 * const chip = getChipById('frontend', 'someChipId'); ❌ (Invalid chip ID)
 */
export function getChipById<T extends ContextChipRegistriesKeys>(registryName: T, id: keyof (typeof contextChipRegistries)[T]): ContextChipEntry | undefined {
  return contextChipRegistries[registryName]?.[id] as ContextChipEntry | undefined;
}

/**
 * Get all available chip IDs
 */
export function getAllChipIds<T extends ContextChipRegistriesKeys>(registryName: T): (keyof ContextChipRegistries[T])[] {
  const registry = contextChipRegistries[registryName];
  const chipIds = Object.keys(registry) as (keyof ContextChipRegistries[T])[];
  return chipIds;
}

/**
 * Get all chips in a category
 */
export function getChipsByCategory(category: ContextChipEntry['category'], registryName: keyof typeof contextChipRegistries): ContextChipEntry[] {
  if (!category) return [];
  return Object.values(contextChipRegistries[registryName]).filter(chip => chip.category === category);
}

/**
 * Search chips by tag
 */
export function getChipsByTag(tag: string, registryName: keyof typeof contextChipRegistries): ContextChipEntry[] {
  return Object.values(contextChipRegistries[registryName]).filter(chip => chip.tags?.includes(tag));
}

/**
 * Get all chips as an array
 */
export function getAllChips(): { id: string; chip: ContextChipEntry; registryName: keyof typeof contextChipRegistries }[] {
  const registriesEntries = Object.entries(contextChipRegistries) as [keyof typeof contextChipRegistries, ContextChipRegistry][];
  return registriesEntries.flatMap(([registryName, registry]) => Object.entries(registry).map(([id, chip]) => ({ id, chip, registryName })));
}

/**
 * Validate if a chip ID exists in the registry
 */
export function existsInRegistry(id: string, registryName: keyof typeof contextChipRegistries): boolean {
  return id in contextChipRegistries[registryName];
}

export function resolveChipPath<T extends ContextChipRegistriesKeys>(registryName: T, id: keyof (typeof contextChipRegistries)[T]): string | undefined {
  const chip = contextChipRegistries[registryName]?.[id] as ContextChipEntry | undefined;
  return chip?.path;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/** Type-safe chip IDs from registry */
export type RegisteredChipId = keyof (typeof contextChipRegistries)[keyof typeof contextChipRegistries];

/** Type for chip metadata without the path (for external APIs) */
export type ChipMetadata = Omit<ContextChipEntry, 'path'>;

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  registries: contextChipRegistries,
  getChipById,
  getAllChipIds,
  getChipsByCategory,
  getChipsByTag,
  getAllChips,
  existsInRegistry,
  resolveChipPath
};
