/**
 * EXAMPLES - Demonstrating Type-Safe Context Schema
 *
 * This file shows how the type-safe Context schema works in practice.
 * Uncomment the error examples to see TypeScript catch invalid usage.
 */

import { Context, ContextSchema, ValidatedContextSchema } from '../../core/schema/context.schema.js';

// ============================================================================
// ✅ VALID USAGE EXAMPLES
// ============================================================================

// Example 1: Type-safe context with correct chip IDs
const validContext: Context = {
  frontend: new Set(['architecture', 'constitution'] as const)
};

// Example 2: Empty sets are fine
const validContextEmpty: Context = {
  frontend: new Set()
};

// Example 3: Single chip
const validContextSingle: Context = {
  frontend: new Set(['architecture'] as const)
};

// ============================================================================
// ❌ INVALID USAGE EXAMPLES (Uncomment to see TypeScript errors)
// ============================================================================

// Example 4: Wrong chip ID - TypeScript will error!
// const invalidContext1: Context = {
//   frontend: new Set(['nonexistent']) // ❌ Error: Type '"nonexistent"' is not assignable to type '"architecture" | "constitution"'
// };

// Example 5: Wrong registry name - TypeScript will error!
// const invalidContext2: Context = {
//   backend: new Set(['architecture']) // ❌ Error: Object literal may only specify known properties
// };

// Example 6: Mixing chips from wrong registry - TypeScript will error!
// const invalidContext3: Context = {
//   frontend: new Set(['someOtherChip']) // ❌ Error: Type '"someOtherChip"' is not assignable
// };

// ============================================================================
// RUNTIME VALIDATION WITH ZOD
// ============================================================================

// Basic schema validation (validates structure, not chip IDs)
const basicValidation = ContextSchema.safeParse({
  frontend: new Set(['architecture', 'constitution'])
});

console.log('Basic validation:', basicValidation.success); // true

// Validated schema (validates both structure AND chip IDs)
const validatedSuccess = ValidatedContextSchema.safeParse({
  frontend: new Set(['architecture', 'constitution'])
});

console.log('Validated (correct chips):', validatedSuccess.success); // true

const validatedFailure = ValidatedContextSchema.safeParse({
  frontend: new Set(['nonexistent'])
});

console.log('Validated (wrong chip):', validatedFailure.success); // false
if (!validatedFailure.success) {
  console.log('Error:', validatedFailure.error.issues[0].message);
}

// ============================================================================
// INTELLISENSE DEMONSTRATION
// ============================================================================

/**
 * Try typing this in your editor to see IntelliSense in action:
 *
 * const myContext: Context = {
 *   frontend: new Set(['   <-- IntelliSense will suggest 'architecture' and 'constitution'
 * }
 */
