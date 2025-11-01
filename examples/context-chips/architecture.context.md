# Architecture Overview

**Purpose**: This document provides a high-level view of the system architecture, module structure, and data flow patterns.

---

## System Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Agent System (MVP)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Agent      │      │  Injectable  │                   │
│  │   Configs    │─────▶│   Prompts    │                   │
│  └──────────────┘      └──────────────┘                   │
│         │                      │                           │
│         │                      ▼                           │
│         │              ┌──────────────┐                   │
│         └─────────────▶│  Generator   │                   │
│                        └──────────────┘                   │
│                               │                           │
│                               ▼                           │
│                        ┌──────────────┐                   │
│                        │  VS Code     │                   │
│                        │  Chatmode    │                   │
│                        │  Files       │                   │
│                        └──────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

1. **Core Schema Layer** (`core/schema/`)
   - Defines data structures and validation rules
   - Uses Zod for type-safe schema validation
   - Exports TypeScript types for consumers

2. **Injectable Prompts Layer** (`prompts/injectable/`)
   - Role-based prompts (analyst, architect, implementer, etc.)
   - Behavior profiles (concise, detailed, interactive, etc.)
   - Permission mappings (read-only, documentation, controlled, full)

3. **Context Layer** (`contexts/`)
   - Context chip registry for centralized management
   - External markdown files for large documentation
   - Inline context (tech stack, conventions, patterns)

4. **Generator Layer** (`generators/vscode-copilot/`)
   - Reads agent configurations
   - Injects appropriate prompts based on role/behavior/permissions
   - Generates VS Code chatmode files with YAML + Markdown

5. **Template Layer** (`templates/`)
   - Reusable template structures
   - Context section renderers
   - User-facing configuration templates

---

## Module Structure

### Directory Layout

```
.github/agent-system-minimal/
│
├── core/                      # Core schemas and types
│   └── schema/
│       ├── agent.schema.ts    # Main agent configuration
│       ├── context.schema.ts  # Context structure
│       └── primitives.schema.ts # Enums and basic types
│
├── prompts/                   # Injectable prompt library
│   └── injectable/
│       ├── role-prompts.ts    # Role-based prompts
│       ├── behavior-prompts.ts # Behavior profiles
│       └── permission-prompts.ts # Permission + tools
│
├── contexts/                  # Context chips
│   ├── registry.ts            # Centralized chip registry
│   ├── constitution.context.md
│   └── architecture.context.md
│
├── generators/                # Code generators
│   └── vscode-copilot/
│       ├── generate-chatmode.ts # Main generator
│       └── index.ts
│
├── templates/                 # Template structures
│   ├── chatmode-output.template.ts
│   ├── context-sections.template.ts
│   ├── agent-config.template.ts
│   └── index.ts
│
├── examples/                  # Example agent configs
│   ├── code-reviewer.ts
│   ├── feature-builder.ts
│   └── index.ts
│
└── scripts/                   # Automation scripts
    ├── generate.ps1
    └── generate.sh
```

---

## Data Flow

### Agent Creation Flow

```
1. User creates agent config
   ├─ Defines role, behavior, permissions
   ├─ Optionally adds context (inline or chips)
   └─ Exports as TypeScript object

2. Generator reads config
   ├─ Validates against schema
   ├─ Resolves context chip IDs from registry
   └─ Loads external markdown files

3. Prompt injection
   ├─ Maps role → role prompt
   ├─ Maps behavior → behavior prompt
   ├─ Maps permissions → permission prompt + tools
   └─ Combines all prompts

4. Template rendering
   ├─ Generates YAML frontmatter (description, tools)
   ├─ Generates Markdown body (prompts + context)
   └─ Combines into final chatmode file

5. Output
   └─ Writes .chatmode.md to .github/chatmodes/
```

### Context Resolution Flow

```
Agent Config
    │
    ├─ Has context.chips?
    │       │
    │       ├─ Chip has ID?
    │       │       │
    │       │       └─ Resolve from registry → Get path
    │       │
    │       └─ Chip has pathFromRoot?
    │               │
    │               └─ Use direct path
    │
    └─ Has inline context?
            │
            ├─ techStack → Render as Markdown list
            ├─ conventions → Render as Markdown list
            └─ patterns → Render as Markdown sections
```

---

## Design Patterns

### 1. **Schema-Driven Validation**

- All configurations validated with Zod schemas
- Type safety enforced at compile time
- Runtime validation for external inputs

### 2. **Registry Pattern (Context Chips)**

- Centralized registry for reusable components
- ID-based references with path resolution
- Metadata support (tags, categories, versions)

### 3. **Template Method Pattern**

- Base generator defines algorithm structure
- Individual renderers handle specific sections
- Easy to extend with new sections

### 4. **Factory Pattern (Prompt Injection)**

- Prompt factories based on role/behavior/permissions
- Centralized mapping of enums to prompts
- Easy to add new roles or behaviors

### 5. **Composition Over Inheritance**

- Agent config composed of smaller schemas
- Context built from multiple optional pieces
- Flexible combinations without deep hierarchies

---

## Key Architectural Decisions

### Why TypeScript?

- Type safety for configurations
- Better IDE support (autocomplete, validation)
- Compile-time error catching

### Why Zod for Schemas?

- Runtime validation + TypeScript types
- Better error messages than JSON Schema
- Functional composition of schemas

### Why Markdown for Context Chips?

- Easy to read and write
- Version control friendly
- Can be rendered in documentation

### Why YAML Frontmatter?

- Standard for VS Code chatmodes
- Clear separation of metadata and content
- Easy to parse and validate

### Why Registry Pattern?

- Centralized management of context chips
- Prevents path duplication across configs
- Enables metadata and discoverability

---

## Extension Points

The architecture is designed to be extensible:

### 1. **New Roles**

Add to `core/schema/primitives.schema.ts` and `prompts/injectable/role-prompts.ts`

### 2. **New Behaviors**

Add to `core/schema/primitives.schema.ts` and `prompts/injectable/behavior-prompts.ts`

### 3. **New Permission Levels**

Add to `core/schema/primitives.schema.ts` and `prompts/injectable/permission-prompts.ts`

### 4. **New Context Chips**

Add entry to `contexts/registry.ts` and create markdown file

### 5. **New Generators**

Create new directory under `generators/` following same pattern

### 6. **Custom Templates**

Add to `templates/` and import in generator

---

## Performance Considerations

### File I/O

- Context chips loaded synchronously during generation
- Cached in memory for duration of generation
- No caching between runs (keeps files fresh)

### Validation

- Schema validation happens once per config
- Fast with Zod (compiled schemas)
- Early exit on validation errors

### Template Rendering

- String concatenation for Markdown (fast)
- Minimal processing of loaded content
- No complex transformations

---

## Security Considerations

### Input Validation

- All external configs validated against schemas
- File paths resolved securely (no directory traversal)
- Registry IDs validated against allowlist

### File Access

- Read-only access to context chip files
- Write access only to designated output directory
- No execution of loaded content

### Error Handling

- Graceful degradation for missing chips
- Warnings logged but don't break generation
- Clear error messages for debugging

---

## Future Architecture Evolution

### Potential Enhancements

1. **Plugin System**
   - Allow third-party prompt libraries
   - Custom context chip loaders
   - Alternative template engines

2. **Caching Layer**
   - Cache loaded context chips
   - Cache generated chatmodes
   - Invalidate on file changes

3. **Configuration Merging**
   - Inherit from base configs
   - Override specific properties
   - Compose multiple configs

4. **Validation CLI**
   - Validate configs without generating
   - Lint agent configurations
   - Check for common issues

5. **Web UI**
   - Visual agent configuration builder
   - Live preview of generated chatmodes
   - Registry browser for context chips

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
