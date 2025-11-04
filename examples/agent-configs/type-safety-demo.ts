import { randomUUID } from 'crypto';
import { AgentConfig } from '../../core/schema/agent.schema.js';

/**
 * DEMONSTRATION: Type Safety & IntelliSense
 *
 * This file demonstrates how the registry-based schema provides:
 * 1. Compile-time type checking
 * 2. IntelliSense autocomplete
 * 3. Invalid value detection
 */

// ============================================================================
// ✅ VALID EXAMPLES (These compile without errors)
// ============================================================================

export const validExample1: AgentConfig = {
  id: randomUUID(),
  name: 'Valid Agent 1',
  version: '1.0.0',
  description: 'Demonstrates valid single role selection',

  character: {
    role: new Set(['guide']), // ✅ IntelliSense shows all valid roles
    permissions: new Set(['controlled']),
    behaviors: new Set(['autonomous']),
  },
};

export const validExample2: AgentConfig = {
  id: randomUUID(),
  name: 'Valid Agent 2',
  version: '1.0.0',
  description: 'Demonstrates multiple behaviors',

  character: {
    role: new Set(['architect']), // ✅ Different role
    permissions: new Set(['documentation']), // ✅ Different permission
    behaviors: new Set(['detailed', 'creative', 'interactive']), // ✅ Multiple behaviors OK
  },
};

export const validExample3: AgentConfig = {
  id: randomUUID(),
  name: 'Valid Agent 3',
  version: '1.0.0',
  description: 'Optional context and behaviors',

  character: {
    role: new Set(['reviewer']),
    permissions: new Set(['read-only']),
    // behaviors is optional, can be omitted
  },

  context: {
    frontend: new Set(['architecture', 'code-style', 'testing-standards']), // ✅ Multiple chips
  },
};

// ============================================================================
// ❌ INVALID EXAMPLES (These will show compile-time errors)
// ============================================================================

// Uncomment to see TypeScript errors:

/*
// ❌ ERROR: Invalid role
export const invalidRole: AgentConfig = {
  id: randomUUID(),
  name: 'Invalid Role',
  version: '1.0.0',
  description: 'Invalid role value',

  character: {
    role: new Set(['designer']), // ❌ 'designer' is not a valid role
    permissions: new Set(['controlled']),
  },
};
*/

/*
// ❌ ERROR: Invalid permission
export const invalidPermission: AgentConfig = {
  id: randomUUID(),
  name: 'Invalid Permission',
  version: '1.0.0',
  description: 'Invalid permission value',

  character: {
    role: new Set(['implementer']),
    permissions: new Set(['super-admin']), // ❌ 'super-admin' is not valid
  },
};
*/

/*
// ❌ ERROR: Invalid behavior
export const invalidBehavior: AgentConfig = {
  id: randomUUID(),
  name: 'Invalid Behavior',
  version: '1.0.0',
  description: 'Invalid behavior value',

  character: {
    role: new Set(['implementer']),
    permissions: new Set(['controlled']),
    behaviors: new Set(['super-fast']), // ❌ 'super-fast' is not valid
  },
};
*/

/*
// ❌ ERROR: Invalid context chip
export const invalidContextChip: AgentConfig = {
  id: randomUUID(),
  name: 'Invalid Context',
  version: '1.0.0',
  description: 'Invalid context chip',

  character: {
    role: new Set(['implementer']),
    permissions: new Set(['controlled']),
  },

  context: {
    frontend: new Set(['nonexistent-chip']), // ❌ Not in registry
  },
};
*/

/*
// ❌ ERROR: Missing required field
export const missingRole: AgentConfig = {
  id: randomUUID(),
  name: 'Missing Role',
  version: '1.0.0',
  description: 'Missing required role',

  character: {
    // role is required but missing
    permissions: new Set(['controlled']),
  },
};
*/

// ============================================================================
// INTELLISENSE DEMONSTRATION
// ============================================================================

/**
 * Try this:
 * 1. Type `character: { role: new Set(['` and wait
 * 2. IntelliSense will show: 'analyst' | 'architect' | 'implementer' | 'reviewer' | 'guide' | 'orchestrator'
 * 3. Same for permissions and behaviors
 * 4. For context chips, type `context: { frontend: new Set(['` and see all available chips
 */
export const intelliSenseDemo: AgentConfig = {
  id: randomUUID(),
  name: 'IntelliSense Demo',
  version: '1.0.0',
  description: 'Try typing in character.role, permissions, behaviors to see autocomplete',

  character: {
    // Try deleting 'implementer' and retyping - IntelliSense will show all valid roles
    role: new Set(['implementer']),
    // Try adding another value - TypeScript will show error for invalid values
    permissions: new Set(['controlled']),
    // Try adding multiple behaviors - IntelliSense helps you pick valid ones
    behaviors: new Set(['autonomous']),
  },

  context: {
    // Try adding chips - IntelliSense shows: 'constitution' | 'architecture' | 'api-guidelines' | 'testing-standards' | 'code-style'
    frontend: new Set(['architecture']),
  },
};

// ============================================================================
// SUMMARY
// ============================================================================

/**
 * Benefits Demonstrated:
 *
 * ✅ Compile-Time Safety
 *    - TypeScript catches invalid values before runtime
 *    - No need to run validation to find typos
 *
 * ✅ IntelliSense Support
 *    - Autocomplete shows all valid options
 *    - Reduces need to check documentation
 *    - Faster development
 *
 * ✅ Registry-Driven
 *    - Add chip to registry → automatically available in IntelliSense
 *    - Remove chip from registry → TypeScript shows error if used
 *    - Single source of truth
 *
 * ✅ Self-Documenting
 *    - Types show what's valid
 *    - No guessing about allowed values
 *    - Clear separation: character vs context
 */
