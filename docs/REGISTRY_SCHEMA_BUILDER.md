# Registry-Based Schema Builder

## Overview

The Registry-Based Schema Builder automatically generates Zod validation schemas from Context Chip Registries. This ensures type safety, runtime validation, and consistency across agent configurations.

## Key Benefits

✅ **Type Safety** - Registry keys become valid schema properties
✅ **Dynamic Validation** - Schemas adapt as registries grow
✅ **Single Source of Truth** - Registries define both data AND validation
✅ **No Duplication** - Don't manually write schemas for each registry
✅ **Flexible Constraints** - Control single vs multi-selection, min/max, required/optional

## Core Functions

### `createValidatedRegistrySchema()`

Creates a validated schema for a single registry with constraints.

```typescript
import { createValidatedRegistrySchema } from './core/schema/registry-schema-builder.js';
import { RoleRegistry } from './registries/agent-registries/role.registry.js';

// Single selection (exactly one chip)
const roleSchema = createValidatedRegistrySchema(RoleRegistry, 'role', {
  required: true,
  allowMultiple: false,
});

// Multiple selection with constraints
const behaviorSchema = createValidatedRegistrySchema(BehaviorRegistry, 'behaviors', {
  required: false,
  minChips: 1,
  maxChips: 3,
  allowMultiple: true,
});
```

**Options:**

- `required` - Is chip selection required? (default: false)
- `minChips` - Minimum number of chips to select
- `maxChips` - Maximum number of chips to select
- `allowMultiple` - Allow multiple chip selection? (default: true)

---

### `createSingleSelectionSchema()`

Creates a schema for single-selection registries (roles, permissions).

```typescript
import { createSingleSelectionSchema } from './core/schema/registry-schema-builder.js';

const roleSchema = createSingleSelectionSchema(RoleRegistry, 'role', true);
// Validates: must be exactly one chip ID from RoleRegistry
```

---

### `createMultiSelectionSchema()`

Creates a schema for multi-selection registries (behaviors, context chips).

```typescript
import { createMultiSelectionSchema } from './core/schema/registry-schema-builder.js';

// Require 1-3 behaviors
const behaviorSchema = createMultiSelectionSchema(BehaviorRegistry, 'behaviors', {
  min: 1,
  max: 3,
  required: false,
});
```

---

### `createContextSchema()`

Creates a complete context schema from multiple registries.

```typescript
import { createContextSchema } from './core/schema/registry-schema-builder.js';
import { internalContextChipRegistries } from './registries/index.js';

// Character schema with specific constraints
const characterSchema = createContextSchema(internalContextChipRegistries, {
  role: { required: true, allowMultiple: false }, // Must pick ONE role
  permissions: { required: true, allowMultiple: false }, // Must pick ONE permission
  behaviors: { required: false, allowMultiple: true }, // Can pick MULTIPLE behaviors
});
```

---

### `createStrictContextSchema()`

Creates a strict context schema where at least one registry must have selections.

```typescript
import { createStrictContextSchema } from './core/schema/registry-schema-builder.js';

const contextSchema = createStrictContextSchema(projectRegistries, {
  frontend: { minChips: 1 },
});

// ✅ Valid: { frontend: new Set(['architecture']) }
// ❌ Invalid: {} or { frontend: new Set() }
```

---

## Usage in Agent Schema

The agent schema uses registry-based schemas to separate framework-managed traits from user-managed context:

```typescript
import { z } from 'zod';
import { createContextSchema } from './registry-schema-builder.js';
import {
  internalContextChipRegistries,
  exampleContextChipRegistries,
} from '../../registries/index.js';

export const AgentConfigSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().max(500),

  // Framework-managed character traits
  character: createContextSchema(internalContextChipRegistries, {
    role: { required: true, allowMultiple: false },
    permissions: { required: true, allowMultiple: false },
    behaviors: { required: false, allowMultiple: true },
  }),

  // User-managed project context (all optional)
  context: createContextSchema(exampleContextChipRegistries),
});
```

## Example Agent Configuration

```typescript
import { AgentConfig } from './core/schema/agent.schema.js';

const myAgent: AgentConfig = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Feature Builder',
  version: '1.0.0',
  description: 'Builds features autonomously',

  // Character: Framework traits (required)
  character: {
    role: new Set(['implementer']), // ✅ Exactly ONE role
    permissions: new Set(['controlled']), // ✅ Exactly ONE permission
    behaviors: new Set(['autonomous', 'creative']), // ✅ Multiple behaviors OK
  },

  // Context: Project-specific (optional)
  context: {
    frontend: new Set(['architecture', 'code-style']), // ✅ Optional
  },
};
```

## Validation Examples

### ✅ Valid Configurations

```typescript
// Single role (required)
character: {
  role: new Set(['implementer']),
  permissions: new Set(['controlled']),
}

// Multiple behaviors
character: {
  role: new Set(['architect']),
  permissions: new Set(['documentation']),
  behaviors: new Set(['detailed', 'creative', 'interactive']),
}

// No context (optional)
context: undefined

// Multiple context chips
context: {
  frontend: new Set(['architecture', 'code-style', 'testing-standards']),
}
```

### ❌ Invalid Configurations

```typescript
// Multiple roles (not allowed)
character: {
  role: new Set(['implementer', 'architect']), // ❌ Only one allowed
  permissions: new Set(['controlled']),
}

// Missing required role
character: {
  permissions: new Set(['controlled']), // ❌ Role is required
}

// Invalid chip ID
character: {
  role: new Set(['invalid-role']), // ❌ Not in registry
  permissions: new Set(['controlled']),
}

// Too many behaviors (if max is set)
character: {
  role: new Set(['implementer']),
  permissions: new Set(['controlled']),
  behaviors: new Set(['concise', 'detailed', 'creative', 'autonomous']), // ❌ If max=3
}
```

## Benefits for Internal AI Agents

Internal agents can leverage this system to:

1. **Discover Constraints** - Query schema metadata to understand rules
2. **Generate Valid Configs** - Create agent configurations that always pass validation
3. **Validate Before Creation** - Catch errors before file generation
4. **Understand Relationships** - Know which registries require single vs multi-selection

Example:

```typescript
// Internal agent discovers that role requires exactly one selection
const roleOptions = createValidatedRegistrySchema(RoleRegistry, 'role', {
  required: true,
  allowMultiple: false,
});

// Agent knows to select exactly ONE role
const validConfig = {
  character: {
    role: new Set(['implementer']), // ✅ Exactly one
  },
};
```

## Type Utilities

```typescript
import { InferContextType, InferStrictContextType } from './core/schema/registry-schema-builder.js';

// Infer type from registry structure
type MyContext = InferContextType<typeof myRegistries>;
// Result: { frontend?: Set<'architecture' | 'code-style'> }

// Infer strict type (at least one required)
type StrictContext = InferStrictContextType<typeof myRegistries>;
// Result: At least one registry must have selections
```

## Migration from Old System

### Before (Manual Schemas)

```typescript
// Had to manually define each property
const ContextSchema = z.object({
  frontend: z.set(z.string()).optional(),
  backend: z.set(z.string()).optional(),
});
```

### After (Registry-Based)

```typescript
// Auto-generated from registries
const ContextSchema = createContextSchema({
  frontend: FrontendRegistry,
  backend: BackendRegistry,
});
```

**Benefits:**

- ✅ No manual updates when adding chips to registries
- ✅ Runtime validation ensures chip IDs exist
- ✅ Type safety through registry keys
- ✅ Centralized constraint management

## Future Enhancements

### Registry Metadata (Planned for v2)

```typescript
interface EnhancedRegistry {
  metadata: {
    selectionMode: 'single' | 'multiple' | 'optional-multiple';
    required?: boolean;
    minSelections?: number;
    maxSelections?: number;
  };
  chips: ContextChipRegistry;
}

// Schema auto-generated from metadata
const schema = generateSchemaFromRegistry(enhancedRegistry);
```

This will enable:

- Self-describing registries
- Auto-schema generation
- Dynamic constraint updates
- Better agent understanding

---

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** November 4, 2025
