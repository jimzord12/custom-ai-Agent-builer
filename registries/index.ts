import { ContextChipRegistries, ContextChipRegistriesKeys } from '../core/schema/context.schema.js';
import { FrontendContextChipRegistry } from '../examples/registries/frontend.registry.js';
import BehaviorRegistry from './agent-registries/behavior.registry.js';
import PermissionsRegistry from './agent-registries/permissions.registry.js';
import RoleRegistry from './agent-registries/role.registry.js';
import { ContextChipEntry, ContextChipRegistry } from './types.js';

// ============================================================================
// REGISTRY ENTRY TYPE
// ============================================================================

// ============================================================================
// REGISTRY DEFINITION
// ============================================================================

export const internalContextChipRegistries = {
  role: RoleRegistry,
  permissions: PermissionsRegistry,
  behaviors: BehaviorRegistry,
} as const;

export const exampleContextChipRegistries = {
  frontend: FrontendContextChipRegistry,
} as const;
/**
 * Context Chip Registry
 *
 * Add new chips here to make them available across all agents.
 * Chips are referenced by their ID in agent configurations.
 */
export const allContextChipRegistries = {
  ...exampleContextChipRegistries,
  ...internalContextChipRegistries,
} as const;

// ============================================================================
// REGISTRY UTILITIES
// ============================================================================

/**
 * Get all available registry names
 */
export function getAllRegistryNames(): (keyof typeof allContextChipRegistries)[] {
  return Object.keys(allContextChipRegistries) as (keyof typeof allContextChipRegistries)[];
}

/**
 * Get a context chip entry by ID
 * @example
 * const chip = getChipById('frontend', 'constitution'); ✅ (Both registry and ID are valid)
 * const chip = getChipById('frontend2', 'constitution'); ❌ (Invalid registry)
 * const chip = getChipById('frontend', 'someChipId'); ❌ (Invalid chip ID)
 */
export function getChipById<T extends ContextChipRegistriesKeys>(
  registryName: T,
  id: keyof (typeof allContextChipRegistries)[T]
): ContextChipEntry | undefined {
  return allContextChipRegistries[registryName]?.[id] as ContextChipEntry | undefined;
}

/**
 * Get all available chip IDs
 */
export function getAllChipIds<T extends ContextChipRegistriesKeys>(
  registryName: T
): (keyof ContextChipRegistries[T])[] {
  const registry = allContextChipRegistries[registryName];
  const chipIds = Object.keys(registry) as (keyof ContextChipRegistries[T])[];
  return chipIds;
}

/**
 * Get all chips in a category
 */
export function getChipsByCategory(
  category: ContextChipEntry['category'],
  registryName: keyof typeof allContextChipRegistries
): ContextChipEntry[] {
  if (!category) return [];
  return Object.values(allContextChipRegistries[registryName]).filter(
    chip => chip.category === category
  );
}

/**
 * Search chips by tag
 */
export function getChipsByTag(
  tag: string,
  registryName: keyof typeof allContextChipRegistries
): ContextChipEntry[] {
  return Object.values(allContextChipRegistries[registryName]).filter(chip =>
    chip.tags?.includes(tag)
  );
}

/**
 * Get all chips as an array
 */
export function getAllChips(): {
  id: string;
  chip: ContextChipEntry;
  registryName: keyof typeof allContextChipRegistries;
}[] {
  const registriesEntries = Object.entries(allContextChipRegistries) as [
    keyof typeof allContextChipRegistries,
    ContextChipRegistry
  ][];
  return registriesEntries.flatMap(([registryName, registry]) =>
    Object.entries(registry).map(([id, chip]) => ({ id, chip, registryName }))
  );
}

/**
 * Validate if a chip ID exists in the registry
 */
export function existsInRegistry(
  id: string,
  registryName: keyof typeof allContextChipRegistries
): boolean {
  return id in allContextChipRegistries[registryName];
}

export function resolveChipPath<T extends ContextChipRegistriesKeys>(
  registryName: T,
  id: keyof (typeof allContextChipRegistries)[T]
): string | undefined {
  const chip = allContextChipRegistries[registryName]?.[id] as ContextChipEntry | undefined;
  return chip?.path;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/** Type-safe chip IDs from registry */
export type RegisteredChipId =
  keyof (typeof allContextChipRegistries)[keyof typeof allContextChipRegistries];

/** Type for chip metadata without the path (for external APIs) */
export type ChipMetadata = Omit<ContextChipEntry, 'path'>;

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  registries: allContextChipRegistries,
  getChipById,
  getAllChipIds,
  getChipsByCategory,
  getChipsByTag,
  getAllChips,
  existsInRegistry,
  resolveChipPath,
};
