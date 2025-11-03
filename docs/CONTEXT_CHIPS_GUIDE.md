# Context Chips & Registry System Guide

**Last Updated**: November 3, 2025

---

## Overview

Context chips are reusable markdown files that provide agents with project-specific knowledge. Instead of embedding large blocks of context directly in agent configurations, you reference chips by ID from a centralized registry.

---

## How It Works

### 1. **Registry** (Type-Safe Catalog)

Registries are TypeScript files that catalog available context chips:

- **Location**: `registries/*.registry.ts`
- **Purpose**: Map chip IDs to markdown file paths
- **Benefits**: Type-safe references, centralized management, metadata support

**Example** (`registries/frontend.registry.ts`):

```typescript
export const FrontendContextChipRegistry = {
  constitution: {
    id: 'constitution',
    name: 'Project Constitution',
    description: "Project's core goals, values, and non-negotiable rules",
    path: 'contexts/constitution.context.md',
    tags: ['governance', 'principles'],
    category: 'governance',
    version: '1.0.0',
  },

  architecture: {
    id: 'architecture',
    name: 'Architecture Overview',
    description: 'High-level system design and module structure',
    path: 'contexts/architecture.context.md',
    tags: ['architecture', 'design'],
    category: 'technical',
    version: '1.0.0',
  },
} as const;
```

### 2. **Context Chips** (Markdown Files)

Context chips are markdown files containing the actual documentation:

- **Location**: `contexts/*.context.md`
- **Format**: Standard markdown
- **Content**: Project principles, architecture docs, coding standards, etc.

**Example** (`contexts/constitution.context.md`):

```markdown
# Project Constitution

**Purpose**: Core principles and non-negotiable rules

## Guiding Principles

1. **User First** - Every feature must serve a clear user need
2. **Code Quality Over Speed** - Maintainable code is priority
3. **Test Everything** - All features require tests

## Non-Negotiable Rules

- Never commit secrets or credentials
- All code requires review before merging
- Security cannot be compromised
```

### 3. **Agent Configuration** (Usage)

Reference chips in your agent configs using registry name + chip IDs:

```typescript
export const myAgent: AgentConfig = {
  name: 'Feature Builder',
  version: '1.0.0',
  description: 'Implements features following project standards',
  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' },

  context: {
    // Reference chips from the 'frontend' registry
    frontend: new Set(['constitution', 'architecture', 'code-style']),
  },
};
```

### 4. **Generator** (Injection)

When generating chatmode files, the generator:

1. Reads the agent's context configuration
2. Resolves chip IDs to file paths using the registry
3. Loads the markdown content from disk
4. Injects the content into the generated chatmode file

---

## Available Registries

### Frontend Registry

**Registry File**: `registries/frontend.registry.ts`

**Available Chips**:

| Chip ID             | Name                  | Description                                |
| ------------------- | --------------------- | ------------------------------------------ |
| `constitution`      | Project Constitution  | Core goals, values, non-negotiable rules   |
| `architecture`      | Architecture Overview | System design, module structure, data flow |
| `api-guidelines`    | API Design Guidelines | REST API standards and conventions         |
| `testing-standards` | Testing Standards     | Testing guidelines and best practices      |
| `code-style`        | Code Style Guide      | Formatting and naming conventions          |

---

## Usage Examples

### Minimal Agent (No Context)

```typescript
export const minimalAgent: AgentConfig = {
  name: 'Quick Helper',
  version: '1.0.0',
  description: 'Simple helper without project context',
  role: 'guide',
  permissions: { level: 'read-only' },
  behavior: { profile: 'concise' },
  // No context needed
};
```

### Code Reviewer (Constitution + Code Style)

```typescript
export const reviewerAgent: AgentConfig = {
  name: 'Code Reviewer',
  version: '1.0.0',
  description: 'Reviews code for quality and standards',
  role: 'reviewer',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' },

  context: {
    frontend: new Set(['constitution', 'code-style']),
  },
};
```

### Feature Builder (Full Context)

```typescript
export const builderAgent: AgentConfig = {
  name: 'Feature Builder',
  version: '1.0.0',
  description: 'Implements features end-to-end',
  role: 'implementer',
  permissions: { level: 'full' },
  behavior: { profile: 'autonomous' },

  context: {
    frontend: new Set(['constitution', 'architecture', 'code-style', 'testing-standards']),
  },
};
```

---

## Adding New Context Chips

### Step 1: Create the Markdown File

Create a new file in `contexts/`:

```bash
# Example: contexts/security-guidelines.context.md
```

```markdown
# Security Guidelines

**Purpose**: Security best practices and requirements

## Authentication

- Use JWT tokens for API authentication
- Tokens expire after 1 hour
  ...
```

### Step 2: Register the Chip

Add an entry to the appropriate registry (`registries/frontend.registry.ts`):

```typescript
export const FrontendContextChipRegistry = {
  // ... existing chips

  'security-guidelines': {
    id: 'security-guidelines',
    name: 'Security Guidelines',
    description: 'Security best practices and requirements',
    path: 'contexts/security-guidelines.context.md',
    tags: ['security', 'authentication', 'authorization'],
    category: 'technical',
    version: '1.0.0',
  } as ContextChipEntry,
} as const;
```

### Step 3: Use in Agent Configs

```typescript
context: {
  frontend: new Set(['constitution', 'security-guidelines']);
}
```

---

## Benefits

### ✅ Reusability

- Write once, use across multiple agents
- Update in one place, affects all agents

### ✅ Type Safety

- TypeScript ensures chip IDs exist
- Autocomplete support in IDEs
- Compile-time validation

### ✅ Maintainability

- Centralized registry for all chips
- Version tracking per chip
- Easy to audit what context agents have

### ✅ Modularity

- Mix and match chips per agent
- Different agents get different context
- Clean separation of concerns

---

## Best Practices

### 1. Keep Chips Focused

Each chip should cover one topic (e.g., architecture, testing, security).

### 2. Update Versions

Increment the `version` field when making significant changes to a chip.

### 3. Use Descriptive IDs

Chip IDs should be kebab-case and self-explanatory: `api-guidelines`, `security-standards`.

### 4. Tag Appropriately

Add relevant tags to help discover and filter chips: `['governance', 'principles']`.

### 5. Document Dependencies

If a chip references another, mention it in the markdown content.

---

## File Structure

```
project/
├── contexts/                      # Markdown chip files
│   ├── constitution.context.md
│   ├── architecture.context.md
│   ├── api-guidelines.context.md
│   └── code-style.context.md
│
├── registries/                    # Registry catalogs
│   ├── frontend.registry.ts
│   ├── types.ts
│   └── index.ts
│
└── examples/
    └── agent-configs/             # Agent configurations
        ├── code-reviewer.ts       # Uses: constitution, code-style
        └── feature-builder.ts     # Uses: architecture, testing-standards
```

---

## Troubleshooting

### Chip Not Found Error

**Error**: `Warning: Context chip ID "xyz" not found in registry`

**Solution**: Check that:

1. Chip ID is registered in the correct registry file
2. Spelling matches exactly (case-sensitive)
3. Registry is exported from `registries/index.ts`

### File Not Found Error

**Error**: `Warning: Context chip file not found: contexts/xyz.context.md`

**Solution**:

1. Verify the markdown file exists at the path specified in the registry
2. Check file path uses forward slashes: `contexts/my-chip.context.md`

### TypeScript Error

**Error**: Type error when referencing chip ID

**Solution**:

1. Ensure registry is defined with `as const`
2. Rebuild TypeScript: `npx tsc --noEmit`
3. Restart your IDE/TypeScript server

---

## Related Documentation

- **Agent Configuration Template**: `docs/agent-config.ts`
- **Registry Types**: `registries/types.ts`
- **Context Schema**: `core/schema/context.schema.ts`
- **Generator**: `generators/vscode-copilot/generate-chatmode.ts`

---

**Questions?** Check existing examples in `examples/agent-configs/` or registry entries in `registries/frontend.registry.ts`.
