# Architecture Overview

**Purpose**: High-level system design and architectural patterns.

---

## System Architecture

### Component Breakdown

1. **Core Schema Layer** - Defines data structures and validation rules
2. **Injectable Prompts Layer** - Role, behavior, and permission mappings
3. **Context Layer** - Context chips and inline context
4. **Generator Layer** - Generates platform-specific agent files
5. **Template Layer** - Reusable template structures

---

## Design Patterns

### 1. **Schema-Driven Validation**

- All configurations validated with Zod schemas
- Type safety enforced at compile time

### 2. **Registry Pattern (Context Chips)**

- Centralized registry for reusable components
- ID-based references with path resolution

### 3. **Factory Pattern (Prompt Injection)**

- Prompt factories based on role/behavior/permissions
- Centralized mapping of enums to prompts

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
