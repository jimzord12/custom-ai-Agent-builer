# v2 Brainstorming Session - Context Registry Architecture

**Date:** November 4, 2025
**Focus:** Registry-Based Schema Builder Implementation

---

## Session Objectives

Brainstorm the next version of the Framework with focus on:

- Context Registry architecture and conventions
- Making the framework modular and flexible
- Enabling Internal AI Agents to manage the framework

---

## Key Insights from Discussion

### The Core Challenge

**Current Framework:** Static, user-driven configurations
**v2 Vision:** Modular, dynamic, AI-agent-managed framework

The framework needs to adapt to different project structures (monorepo vs single-repo, frontend-only vs full-stack) without forcing a rigid pattern.

### The Solution: Registry-Based Architecture

We agreed on a **three-tier hierarchy** for registries:

1. **Framework Registries** (Static) - Universal, always present

   - `framework-core`, `framework-roles`, `framework-permissions`, `framework-behaviors`

2. **Project Registries** (Persistent) - Adapts to project structure

   - Monorepo: `frontend-stack`, `backend-stack`, `mobile-conventions`
   - Single-repo: `project-stack`, `project-conventions`

3. **Feature Registries** (Dynamic) - Created/destroyed on-demand
   - `feature-authentication`, `feature-payment-processing`

### Naming Convention

**Pattern:** `<scope>-<aspect>`

Where:

- **Scope:** framework, domain name, project, or feature-<name>
- **Aspect:** stack, structure, conventions, governance, integration, infrastructure, domain

Examples:

- `frontend-stack`
- `backend-conventions`
- `project-governance`
- `feature-auth-implementation`

---

## What We Implemented

### ✅ Registry-Based Schema Builder

A system that automatically generates Zod validation schemas from Context Chip Registries.

**Key Features:**

1. **Type Safety** - Registry keys become valid schema properties
2. **Dynamic Validation** - Schemas adapt as registries grow
3. **Flexible Constraints** - Single vs multi-selection, min/max, required/optional
4. **Clear Separation** - Framework traits vs project context

**Files Created:**

- `core/schema/registry-schema-builder.ts` - Main implementation
- `docs/REGISTRY_SCHEMA_BUILDER.md` - Comprehensive guide
- `docs/REGISTRY_SCHEMA_QUICK_REFERENCE.md` - Quick reference
- `examples/agent-configs/enhanced-agent-example.ts` - Usage example
- `brainstorming/v2/REGISTRY_SCHEMA_IMPLEMENTATION.md` - Implementation summary

### Core Functions

```typescript
// Single selection (roles, permissions)
createSingleSelectionSchema(RoleRegistry, 'role', true);

// Multiple selection (behaviors, context)
createMultiSelectionSchema(BehaviorRegistry, 'behaviors', { min: 1, max: 3 });

// Complete context schema
createContextSchema(registries, {
  role: { required: true, allowMultiple: false },
  behaviors: { required: false, allowMultiple: true },
});
```

### Updated Agent Schema

```typescript
character: createContextSchema(internalContextChipRegistries, {
  role: { required: true, allowMultiple: false },          // ONE role
  permissions: { required: true, allowMultiple: false },   // ONE permission
  behaviors: { required: false, allowMultiple: true },     // MULTIPLE behaviors
}),

context: createContextSchema(exampleContextChipRegistries), // All optional
```

---

## How This Supports v2 Goals

### 1. Modular & Flexible ✅

- Registries can be added/removed dynamically
- Schemas auto-generate from structure
- No hardcoded dependencies

### 2. Agent-Friendly ✅

- Internal agents discover constraints programmatically
- Schema metadata tells agents requirements
- Validation before generation

### 3. Single Source of Truth ✅

- Registries define data AND validation
- No duplication
- Changes propagate automatically

### 4. Enables Internal AI Agents ✅

Internal agents can:

- Query registry metadata
- Understand constraints (single vs multi-selection)
- Generate valid configurations
- Validate before file creation

---

## Proposed Conventions (From Discussion)

### 1. Registry Lifecycle States

```typescript
enum RegistryState {
  STATIC = 'static', // Framework-managed
  PERSISTENT = 'persistent', // Project-level
  DYNAMIC = 'dynamic', // Feature-level
  ARCHIVED = 'archived', // Old features
}
```

### 2. Registry Composition

Registries can extend other registries:

```typescript
const frontendConventions = {
  extends: ['project-conventions'],
  aspect: 'conventions',
  state: 'persistent',
};
```

### 3. Chip Scoping Rules

```typescript
// Chip IDs indicate scope
'global:constitution';
'domain:frontend:react-patterns';
'feature:auth:jwt-implementation';
```

### 4. Registry Discovery API

```typescript
interface RegistryDiscoveryAPI {
  findByAspect(aspect: RegistryAspect): RegistryDefinition[];
  findByDomain(domain: string): RegistryDefinition[];
  searchChips(query: string): ContextChipEntry[];
}
```

### 5. Path Organization

```
registries/
  ├── framework/      # Static framework registries
  ├── project/        # Persistent project registries
  ├── features/       # Dynamic feature registries
  └── archived/       # Archived registries

contexts/
  ├── framework/      # Framework context chips
  ├── project/        # Project context chips
  └── features/       # Feature context chips
```

---

## TypeScript Utility Types (Proposed)

```typescript
// Extract chips for specific aspect
type ChipsForAspect<A extends RegistryAspect>;

// Get registries for domain
type RegistriesForDomain<D extends string>;

// Union of all chip IDs
type AllChipIds;

// Type-safe registry access
function getRegistry<T extends keyof AllRegistries>(id: T): AllRegistries[T];

// Type-safe chip access
function getChip<R, C>(registryId: R, chipId: C): Chip;
```

---

## Next Steps

### Immediate (Can Start Now)

1. ✅ **Update generators** - Use new schema system in chatmode generator
2. ✅ **Create tests** - Validate schema builder functionality
3. ✅ **Add validation utilities** - Helper functions for config validation

### Near Term (v2 Phase 1)

4. **Registry Metadata System** - Self-describing registries
5. **Auto-Schema Generation** - Generate from metadata
6. **Smart Registry Detection** - Infer structure from project

### Long Term (v2 Phase 2)

7. **Registry Manager Agent** - AI manages registry lifecycle
8. **Dynamic Registry Creation** - Agents create registries on-the-fly
9. **Cross-Registry Validation** - Validate relationships

---

## Key Decisions Made

### ✅ Registry-Based Schemas

Instead of manual Zod schemas, generate from registries automatically.

**Rationale:**

- Single source of truth
- Reduces duplication
- Adapts to registry changes
- Agent-friendly

### ✅ Separation of Concerns

Framework traits (character) separate from project context.

**Rationale:**

- Clear ownership
- Different validation rules
- Framework manages character, user manages context

### ✅ Flexible Constraints

Support both single and multi-selection per registry.

**Rationale:**

- Some traits are exclusive (role, permission)
- Others are combinable (behaviors, context chips)
- Constraints enforce correct usage

### ✅ Three-Tier Registry Hierarchy

Framework → Project → Feature registries.

**Rationale:**

- Clear lifecycle management
- Different persistence levels
- Enables dynamic creation/deletion

---

## Open Questions for Future Sessions

### Context Registry Architecture

1. How should registry inheritance work?
2. Should chips be able to reference other chips?
3. How to handle registry versioning?

### Internal AI Agents

1. Which agents do we need first?
2. How should agents communicate?
3. What tools do they need?

### Prompting Strategy

1. How to make prompts composable?
2. Should prompts be in TypeScript or Markdown?
3. How to version prompts?

### Tools/MCP Servers

1. Build custom MCP or use existing?
2. What endpoints do agents need?
3. How to manage cross-platform scripts?

---

## Resources Created

### Documentation

- `docs/REGISTRY_SCHEMA_BUILDER.md` - Full guide
- `docs/REGISTRY_SCHEMA_QUICK_REFERENCE.md` - Quick ref
- `brainstorming/v2/REGISTRY_SCHEMA_IMPLEMENTATION.md` - Implementation notes
- `brainstorming/v2/BRAINSTORMING_SESSION_SUMMARY.md` - This file

### Code

- `core/schema/registry-schema-builder.ts` - Schema builder
- `core/schema/agent.schema.ts` - Updated agent schema
- `examples/agent-configs/enhanced-agent-example.ts` - Example

### Tests Needed

- Schema validation tests
- Registry constraint tests
- Agent config validation tests
- Edge case handling

---

## Success Metrics

### Implementation ✅

- [x] Schema builder created
- [x] Agent schema updated
- [x] Documentation written
- [x] Example provided
- [x] TypeScript compiles without errors

### Quality ✅

- [x] Type safe
- [x] Zod v4 compatible
- [x] Clear error messages
- [x] Well documented
- [x] Follows conventions

### v2 Readiness 🎯

- [x] Modular design
- [x] Agent-friendly API
- [x] Extensible architecture
- [ ] Tested (pending)
- [ ] Integrated into generators (pending)

---

## Conclusion

We successfully implemented the **Registry-Based Schema Builder**, a critical foundation for v2's vision of a modular, AI-agent-managed framework.

**Key Achievement:** Transformed static, manual schemas into dynamic, registry-driven validation that adapts to project structure and supports internal AI agents.

**Next Focus Area:** Choose from:

- **B)** Design Internal AI Agents and their responsibilities
- **C)** Map out composable prompting system
- **D)** Explore tools/MCP Server strategy

**Status:** Ready to continue brainstorming! 🚀

---

**Date:** November 4, 2025
**Status:** ✅ Session Complete
**Next Session:** TBD
