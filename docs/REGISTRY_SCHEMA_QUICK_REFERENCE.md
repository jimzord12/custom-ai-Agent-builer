# Registry Schema Builder - Quick Reference

## Import

```typescript
import {
  createValidatedRegistrySchema,
  createSingleSelectionSchema,
  createMultiSelectionSchema,
  createContextSchema,
  createStrictContextSchema,
} from './core/schema/registry-schema-builder.js';
```

## Common Patterns

### Single Selection (Role, Permission)

```typescript
// Must select exactly ONE
const schema = createSingleSelectionSchema(RoleRegistry, 'role', true);

// Usage
character: {
  role: new Set(['implementer']); // ✅ One item
}
```

### Multiple Selection (Behaviors)

```typescript
// Can select multiple, 1-3 items
const schema = createMultiSelectionSchema(BehaviorRegistry, 'behaviors', {
  min: 1,
  max: 3,
  required: false,
});

// Usage
character: {
  behaviors: new Set(['autonomous', 'creative']); // ✅ 2 items
}
```

### Custom Constraints

```typescript
// Fine-grained control
const schema = createValidatedRegistrySchema(MyRegistry, 'myRegistry', {
  required: true, // Must have selection
  allowMultiple: true, // Can select multiple
  minChips: 2, // At least 2 chips
  maxChips: 5, // At most 5 chips
});
```

### Complete Context Schema

```typescript
// Combine multiple registries
const schema = createContextSchema(
  {
    role: RoleRegistry,
    permissions: PermissionsRegistry,
    behaviors: BehaviorRegistry,
  },
  {
    role: { required: true, allowMultiple: false },
    permissions: { required: true, allowMultiple: false },
    behaviors: { required: false, minChips: 1, maxChips: 3 },
  }
);
```

## Validation Messages

### Invalid Chip ID

```
Invalid chip ID 'xyz' for registry 'role'. Available chips: analyst, architect, implementer, ...
```

### Minimum Chips

```
Registry 'behaviors': Must select at least 1 chip(s)
```

### Maximum Chips

```
Registry 'behaviors': Cannot select more than 3 chip(s)
```

### Single Selection Violation

```
Registry 'role': Only one chip allowed
```

## Type Inference

```typescript
import { InferContextType } from './core/schema/registry-schema-builder.js';

type MyContext = InferContextType<{
  frontend: typeof FrontendRegistry;
  backend: typeof BackendRegistry;
}>;

// Result:
// {
//   frontend?: Set<'architecture' | 'code-style' | ...>,
//   backend?: Set<'api-design' | 'database' | ...>
// }
```

## Common Use Cases

### Framework Registries (Single Selection)

```typescript
// Role: Pick ONE
role: new Set(['implementer']);

// Permissions: Pick ONE
permissions: new Set(['controlled']);
```

### Behavior Registries (Multiple Selection)

```typescript
// Behaviors: Pick 1-3
behaviors: new Set(['autonomous', 'creative', 'detailed']);
```

### Project Registries (Optional Multiple)

```typescript
// Context: Any number (optional)
context: {
  frontend: new Set(['architecture', 'code-style', 'testing-standards']);
}
```

## Error Handling

```typescript
import { validateAgentConfig } from './core/schema/agent.schema.js';

const result = validateAgentConfig(myConfig);

if (!result.success) {
  console.error('Validation failed:', result.errors);
  // Handle errors
} else {
  console.log('Valid config:', result.data);
  // Proceed with generation
}
```

## Best Practices

✅ **DO:**

- Use single selection for exclusive choices (role, permission)
- Use multiple selection for combinable traits (behaviors)
- Set min/max constraints when there are limits
- Make project context optional
- Validate configs before generation

❌ **DON'T:**

- Allow multiple selections for roles/permissions
- Hardcode chip IDs - use registry keys
- Skip validation - always validate first
- Mix framework and project registries
- Forget to update examples when adding constraints

## Quick Checklist

- [ ] Import the schema builder
- [ ] Define registry constraints
- [ ] Create schema with `createContextSchema()`
- [ ] Use Sets for chip selections
- [ ] Validate config before use
- [ ] Handle validation errors
- [ ] Update documentation
- [ ] Add tests for new constraints

---

**Version:** 1.0.0
**Date:** November 4, 2025
