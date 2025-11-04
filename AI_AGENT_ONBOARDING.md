# AI Agent Framework - Quick Onboarding Guide

**Created**: November 1, 2025
**Version**: 1.0.0
**Target**: AI Agents joining this project

---

## 🎯 What Is This Project?

A **TypeScript framework** for creating specialized AI coding agents for **VS Code Copilot** (chatmodes). Instead of writing freeform markdown agent instructions, developers define agents using type-safe TypeScript configurations that get validated and compiled into platform-specific formats.

In a nutshell, this project provides a structured and modular way to define AI agents with:

- **Agent Config**, that specifies:
  - role, Its an enum can can one of the defined archetypes: `analyst`, `architect`, `implementer`, `reviewer`, `guide`, `orchestrator`. The user can define custom roles as well but they won't have predefined prompts.
  - permissions,
  - behavior, and
  - context

### Core Value Proposition

- ✅ **Type-safe** agent definitions with Zod validation
- ✅ **Standardized** prompts ensure consistent behavior
- ✅ **Modular** context system for project knowledge
- ✅ **Validated** configurations prevent errors early
- ✅ **Generated** output files from single source of truth

---

## 📁 Project Structure

```
agent-system-minimal/
├── core/schema/              # Type definitions & validation
│   ├── primitives.schema.ts  # Role, permission, behavior enums
│   ├── agent.schema.ts       # Main agent configuration schema
│   └── context.schema.ts     # Context system types
│
├── prompts/injectable/       # Standardized prompt definitions
│   ├── role-prompts.ts       # Role behavior mappings
│   ├── behavior-prompts.ts   # Communication style mappings
│   └── permission-prompts.ts # Permission & tool mappings
│
├── generators/vscode-copilot/  # Output file generators
│   └── generate-chatmode.ts    # Converts configs → chatmode files
│
├── templates/                # File structure templates
│   ├── chatmode-output.template.ts  # VS Code output format
│   └── context-sections.template.ts # Context rendering
│
├── registries/               # Context chip registries
│   ├── frontend.registry.ts  # Frontend context chips
│   ├── types.ts             # Registry type definitions
│   └── index.ts             # Registry utilities
│
├── contexts/                 # Reusable context markdown files
│   ├── architecture.context.md    # System design overview
│   └── constitution.context.md    # Project principles & rules
│
├── examples/agent-configs/   # Example agent configurations
│   ├── feature-builder.ts    # Full-permission implementer
│   └── code-reviewer.ts      # Read-only reviewer
│
├── tests/                    # Comprehensive test suite
│   ├── run-all-tests.ts      # Main test runner
│   ├── utils/                # Test utilities
│   └── cases/                # Test case implementations
│
└── scripts/                  # Automation scripts
    ├── generate.ps1          # PowerShell generator
    └── generate.sh           # Bash generator
```

---

## 🏗️ Core Architecture

### 1. **Schema Layer** (Core Definitions)

**Location**: `core/schema/`

Defines the structure of all agent configurations using Zod schemas:

```typescript
// Primitives (core/schema/primitives.schema.ts)
RoleName = 'analyst' | 'architect' | 'implementer' | 'reviewer' | 'guide' | 'orchestrator';
PermissionLevelName = 'read-only' | 'documentation' | 'controlled' | 'full';
BehaviorProfileName =
  'concise' | 'detailed' | 'interactive' | 'autonomous' | 'creative' | 'conservative';

// Agent Config (core/schema/agent.schema.ts)
interface AgentConfig {
  name: string; // Human-readable name
  version: string; // Semver (e.g., "1.0.0")
  description: string; // Brief purpose
  role: RoleName; // Primary function
  permissions: { level: PermissionLevelName };
  behavior: { profile: BehaviorProfileName };
  context?: Context; // Optional project context
}
```

**Key Functions**:

- `validateAgentConfig(config)` - Validates configuration
- `parseAgentConfig(config)` - Parses and throws on error

---

### 2. **Injectable Prompts** (Standardized Behaviors)

**Location**: `prompts/injectable/`

Pre-defined prompts that get injected based on enum selections. **NEVER modify these** - they maintain framework integrity.

#### Role Prompts (`role-prompts.ts`)

Maps each role to specific behavioral guidelines:

- **analyst**: Code examination, pattern identification, issue detection
- **architect**: Solution design, technical planning, architecture
- **implementer**: Code writing, feature building, file creation
- **reviewer**: Quality validation, standards enforcement, feedback
- **guide**: Concept explanation, documentation, teaching
- **orchestrator**: Workflow coordination, task management

#### Behavior Prompts (`behavior-prompts.ts`)

Defines communication styles:

- **concise**: Brief, actionable responses
- **detailed**: Comprehensive explanations with context
- **interactive**: Question-driven, collaborative approach
- **autonomous**: Independent decision-making
- **creative**: Multiple solution exploration
- **conservative**: Strict pattern adherence

#### Permission Prompts (`permission-prompts.ts`)

Maps permissions to allowed tools and capabilities:

| Permission      | Tools                                                             | Use Case                               |
| --------------- | ----------------------------------------------------------------- | -------------------------------------- |
| `read-only`     | search, fetch, githubRepo, usages, problems, changes, testFailure | Analysis, recommendations              |
| `documentation` | + edit, new (docs only)                                           | Documentation creation/updates         |
| `controlled`    | + edit, new, runTasks (limited)                                   | Feature implementation with guardrails |
| `full`          | + runCommands, vscodeAPI                                          | Complete access with confirmations     |

---

### 3. **Context System** (Project Knowledge)

Two mechanisms for providing context to agents:

#### A. Context Chips (Recommended for Large Context)

**Reusable markdown files** that can be referenced by ID or path.

**Registry System** (`registries/`):

```typescript
// Register chips centrally
FrontendContextChipRegistry = {
  constitution: {
    id: 'constitution',
    name: 'Project Constitution',
    path: 'contexts/constitution.context.md',
    description: "Project's core goals, values, rules",
    tags: ['governance', 'principles'],
    category: 'governance',
    version: '1.0.0',
  },
  architecture: {
    /* ... */
  },
};

// Reference in agent config
context: {
  frontend: new Set(['constitution', 'architecture']);
}
```

**Available Chips**:

- `constitution` - Project goals, values, non-negotiable rules
- `architecture` - System design, module structure, patterns

**Best Practices**:

- ✅ Use for: Tech stack, conventions, patterns, architecture, governance
- ❌ Avoid for: Feature-specific details (use FRDs instead)

#### B. Inline Context (Deprecated)

Previously supported `techStack`, `conventions`, `patterns` fields - now handled via context chips.

---

### 4. **Generator** (Output Creation)

**Location**: `generators/vscode-copilot/generate-chatmode.ts`

Converts agent configs into VS Code chatmode files.

**Process**:

1. Read & validate agent configuration
2. Inject role/behavior/permission prompts
3. Load context chips from registry/paths
4. Render YAML frontmatter + Markdown body
5. Write to `.github/chatmodes/[agent-name].chatmode.md`

**Output Format**:

```yaml
---
description: Brief description for VS Code UI
tools: ['search', 'edit', 'new', 'fetch']
---

# Agent Name

Agent description

## Role: [Role Name]
[Role prompt injected here]

## Communication Style: [Behavior]
[Behavior prompt injected here]

## Permissions: [Level]
[Permission prompt injected here]

[Context chips content inserted here]

---

**Agent Version**: 1.0.0
```

---

### 5. **Templates** (Structure Definitions)

**Location**: `templates/`

Define output file structures:

- `chatmode-output.template.ts` - VS Code chatmode format
- `context-sections.template.ts` - Context rendering helpers

**Key Functions**:

- `generateFrontmatter()` - YAML header creation
- `generateBody()` - Markdown body assembly
- `generateChatmodeFile()` - Complete file generation

---

## 🔧 How to Use

### Creating a New Agent

**Step 1**: Define Configuration

```typescript
// examples/my-agent.ts
import type { AgentConfig } from '../core/schema/agent.schema';

export const myAgent: AgentConfig = {
  name: 'My Agent',
  version: '1.0.0',
  description: 'Helps with feature implementation',

  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' },

  context: {
    frontend: new Set(['constitution', 'architecture']),
  },
};

export default myAgent;
```

**Step 2**: Generate Chatmode File

```bash
# Using npx
npx tsx generators/vscode-copilot/generate-chatmode.ts examples/my-agent.ts --overwrite

# Output: .github/chatmodes/my-agent.chatmode.md
```

**Step 3**: Use in VS Code

```
@my-agent Implement user authentication
```

---

## 🎓 Role Selection Guide

| Role             | When to Use                    | Permission Default | Example Tasks                        |
| ---------------- | ------------------------------ | ------------------ | ------------------------------------ |
| **analyst**      | Code analysis, issue detection | read-only          | Bug investigation, code review prep  |
| **architect**    | System design, planning        | documentation      | Architecture design, technical specs |
| **implementer**  | Feature building, coding       | controlled         | Feature implementation, bug fixes    |
| **reviewer**     | Quality checks, validation     | read-only          | PR reviews, standards enforcement    |
| **guide**        | Documentation, teaching        | documentation      | README updates, concept explanation  |
| **orchestrator** | Workflow management            | documentation      | Task breakdown, coordination         |

---

## 🛡️ Permission Levels Explained

### read-only (7 tools)

**Tools**: search, fetch, githubRepo, usages, problems, changes, testFailure
**Use**: Analysis, recommendations, investigation
**Cannot**: Create/modify files, run commands

### documentation (10 tools)

**Tools**: read-only + edit, new (docs only)
**Use**: Documentation creation/updates
**Cannot**: Modify source code, run commands

### controlled (13 tools)

**Tools**: documentation + edit, new, runTasks (limited)
**Use**: Feature implementation with guardrails
**Cannot**: Run arbitrary commands, access VS Code APIs

### full (All tools)

**Tools**: All available tools
**Use**: Complete project control
**Safety**: Requires confirmations for destructive operations

---

## 📝 Development Workflow

### Standard Development Process

1. **Plan**: Use `orchestrator` role with `interactive` behavior
2. **Implement**: Use `implementer` role with `autonomous` behavior
3. **Review**: Use `reviewer` role with `detailed` behavior
4. **Document**: Use `guide` role with `detailed` behavior

### Agent Configuration Best Practices

1. **Start with base agent** containing project-wide context
2. **Use specific roles** that match the task
3. **Match permissions to needs** - start restrictive, expand if needed
4. **Choose appropriate behavior** - autonomous for clear tasks, interactive for exploration
5. **Version your agents** using semantic versioning

---

## 🧪 Testing Framework

**Location**: `tests/`

Comprehensive test suite with 5 test cases covering all features.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test case
npm run test:001  # Inline context
npm run test:002  # Registry chips
npm run test:003  # Direct path chips
npm run test:004  # Mixed context
npm run test:005  # Role/behavior/permissions
```

### Test Structure

```
tests/
├── utils/
│   ├── test-runner.ts     # Assertions & test execution
│   └── file-helpers.ts    # File operations
└── cases/
    ├── 001-inline-context/
    ├── 002-registry-chips/
    ├── 003-direct-path-chips/
    ├── 004-mixed-context/
    └── 005-role-behavior-permissions/
```

### Testing Convention

✅ **DO**:

- Write agent configs from scratch per test
- Use actual framework generators and prompts
- Clean up between test runs

❌ **DON'T**:

- Import from `/examples` folder
- Share state between test cases

🚫 **NEVER**:

- Mock injectable prompts (maintain framework integrity)

---

## 📚 Key Files Reference

### Configuration & Schemas

| File                               | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `core/schema/primitives.schema.ts` | Role, permission, behavior enums  |
| `core/schema/agent.schema.ts`      | Main agent configuration schema   |
| `core/schema/context.schema.ts`    | Context system types & validation |

### Prompts (NEVER MODIFY)

| File                                       | Purpose                         |
| ------------------------------------------ | ------------------------------- |
| `prompts/injectable/role-prompts.ts`       | Role → behavior mappings        |
| `prompts/injectable/behavior-prompts.ts`   | Communication style definitions |
| `prompts/injectable/permission-prompts.ts` | Permission → tools mappings     |

### Generators & Templates

| File                                             | Purpose                   |
| ------------------------------------------------ | ------------------------- |
| `generators/vscode-copilot/generate-chatmode.ts` | Main generator            |
| `templates/chatmode-output.template.ts`          | Output format definitions |

### Context & Registries

| File                               | Purpose                        |
| ---------------------------------- | ------------------------------ |
| `registries/frontend.registry.ts`  | Frontend context chip registry |
| `contexts/constitution.context.md` | Project principles & values    |
| `contexts/architecture.context.md` | System architecture overview   |

### Examples

| File                                        | Purpose                     |
| ------------------------------------------- | --------------------------- |
| `examples/agent-configs/feature-builder.ts` | Full-permission implementer |
| `examples/agent-configs/code-reviewer.ts`   | Read-only reviewer          |

---

## 🎯 Current Status (MVP)

### ✅ Completed Features

1. **Core Schema System**

   - Agent configuration validation
   - Primitive types (role, permission, behavior)
   - Context system with registry support

2. **Injectable Prompts**

   - All 6 role prompts
   - All 6 behavior prompts
   - All 4 permission prompts with tool mappings

3. **Generator**

   - VS Code chatmode file generation
   - Prompt injection logic
   - Context chip loading
   - YAML frontmatter generation
   - Markdown body rendering

4. **Context System**

   - Registry-based chip management
   - Direct path chip support
   - Type-safe chip references
   - Context chip loader

5. **Templates**

   - Chatmode output template
   - Context sections template

6. **Testing Framework**

   - 5 comprehensive test cases
   - Test utilities (assertions, file helpers)
   - Test runner with reporting

7. **Documentation**
   - README.md (comprehensive guide)
   - QUICK_START.md (5-minute tutorial)
   - Framework_Brief.md (architectural overview)
   - TESTING_FRAMEWORK_SUMMARY.md

### 🚧 Pending Tasks (from MVP_TODOS.md)

**Phase 5**: Scripts & Automation

- [ ] PowerShell script updates (generate.ps1)
- [ ] Bash script updates (generate.sh)

**Phase 6**: Testing & Validation

- [ ] End-to-end workflow validation
- [ ] VS Code integration testing
- [ ] All variation testing (roles, behaviors, permissions)

**Phase 7**: Documentation Updates

- [ ] README with VS Code chatmode instructions
- [ ] QUICK_START updates
- [ ] Context chip creation guide
- [ ] Sample generated chatmode files

---

## 🔮 Future Enhancements (Not in MVP)

Intentionally **excluded** from minimal version:

- ❌ `allowedPaths` / `deniedPaths` - Granular file access control
- ❌ `workflows` - Automated onCreate/onModify/onComplete steps
- ❌ `validation` - Output validation rules
- ❌ `traits` - Composable behavior mixing
- ❌ `extends` - Agent inheritance
- ❌ Pre-built archetypes

---

## 💡 Project Principles (from constitution.context.md)

### Core Mission

Build reliable, maintainable, and user-focused software that solves real problems efficiently.

### Guiding Principles

1. **User First** - Every feature must serve a clear user need
2. **Code Quality Over Speed** - Maintainability > cleverness
3. **Test Everything** - All features require tests
4. **Documentation as Code** - If it's not documented, it doesn't exist
5. **Collaboration** - Code reviews are about learning, not criticism

### Non-Negotiable Rules

✅ **Must Always Do**:

- Security first (never commit secrets)
- Backward compatibility (deprecate before removing)
- Error handling (graceful failures)
- Performance awareness (profile before optimizing)

❌ **Must Never Do**:

- Direct production access
- Unreviewed code merges
- Copy-paste programming
- Ignoring warnings

---

## 🛠️ Common Tasks

### Add a New Context Chip

**Step 1**: Create markdown file

```bash
# Create file in contexts/
# e.g., contexts/api-guidelines.context.md
```

**Step 2**: Register in registry

```typescript
// registries/frontend.registry.ts
export const FrontendContextChipRegistry = {
  // ... existing chips
  'api-guidelines': {
    id: 'api-guidelines',
    name: 'API Design Guidelines',
    description: 'REST API design standards',
    path: 'contexts/api-guidelines.context.md',
    tags: ['api', 'rest', 'guidelines'],
    category: 'technical',
    version: '1.0.0',
  },
};
```

**Step 3**: Use in agent config

```typescript
context: {
  frontend: new Set(['api-guidelines']);
}
```

### Create a New Agent Variation

**Analyst Agent** (Read-only, Detailed):

```typescript
{
  role: 'analyst',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' }
}
```

**Feature Builder** (Full access, Autonomous):

```typescript
{
  role: 'implementer',
  permissions: { level: 'full' },
  behavior: { profile: 'autonomous' }
}
```

**Interactive Guide** (Documentation, Interactive):

```typescript
{
  role: 'guide',
  permissions: { level: 'documentation' },
  behavior: { profile: 'interactive' }
}
```

### Debug Agent Output

1. **Check generated file**: `.github/chatmodes/[agent-name].chatmode.md`
2. **Validate YAML frontmatter**: Proper syntax, tools array
3. **Verify prompt injection**: Role, behavior, permission prompts present
4. **Check context loading**: Context chips properly included
5. **Test in VS Code**: Use `@[agent-name]` to verify

---

## 🤝 Contributing Guidelines

### Implementation Reports

After completing 1+ tasks, create summary in `.github/agent-system-minimal/history/`:

**Format**: `{index}-{brief-description}.md`
**Content** (max 500 lines):

- Timestamp
- Tasks completed (before/after state)
- What was done
- How (if complex)
- Link to MVP_TODOS.md

**Principle**: LESS is MORE

### Test File Structure

Tests mirror source structure:

```
Source: generators/vscode-copilot/generate-chatmode.ts
Test:   tests/generators/vscode-copilot/tests/test-generator.ts
```

---

## 📖 Quick Reference

### Agent Config Template

```typescript
import type { AgentConfig } from '../core/schema/agent.schema';

export const agent: AgentConfig = {
  // Required
  name: 'Agent Name',
  version: '1.0.0',
  description: 'Brief description',
  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' },

  // Optional
  context: {
    frontend: new Set(['constitution', 'architecture']),
  },
};

export default agent;
```

### Generator Command

```bash
npx tsx generators/vscode-copilot/generate-chatmode.ts <config-path> --overwrite
```

### Validation

```typescript
import { validateAgentConfig } from './core/schema/agent.schema';

const result = validateAgentConfig(config);
if (!result.success) {
  console.error(result.errors);
}
```

---

## 🔍 Troubleshooting

### "Configuration file not found"

✓ Check file path is correct relative to execution directory
✓ Ensure file has .ts extension
✓ Verify file exports default or named export

### "Zod validation error"

✓ Check role/permission/behavior values match enums
✓ Verify all required fields present
✓ Ensure version is valid semver (e.g., "1.0.0")

### "Context chip not found"

✓ Verify chip ID exists in registry
✓ Check file path is correct (for direct path chips)
✓ Ensure markdown file exists at specified location

### "Generated agent not working in VS Code"

✓ File exists in `.github/chatmodes/`
✓ YAML frontmatter syntax correct
✓ Restart VS Code or reload window
✓ Check VS Code Copilot chat mode selection

---

## 📞 Getting Help

1. **Read the docs**: `README.md`, `QUICK_START.md`
2. **Check examples**: `examples/agent-configs/`
3. **Review tests**: `tests/cases/`
4. **Check history**: `.github/agent-system-minimal/history/`
5. **Review MVP TODOs**: `brainstorming/MVP_TODOS.md`

---

## 📊 Project Stats

- **Total Lines of Code**: ~3,500+
- **Test Coverage**: 5 comprehensive test cases
- **Documentation**: 1,800+ lines
- **Context Chips**: 2 (constitution, architecture)
- **Injectable Prompts**: 16 (6 roles + 6 behaviors + 4 permissions)
- **Completion**: ~72% of MVP (44/61 tasks)

---

## 🎓 Learning Resources

### Essential Reading (Priority Order)

1. **QUICK_START.md** - Get started in 5 minutes
2. **This file** - Complete framework overview
3. **README.md** - Comprehensive documentation
4. **Framework_Brief.md** - Architectural deep-dive
5. **MVP_TODOS.md** - Current status & next steps

### Code Examples

1. `examples/agent-configs/feature-builder.ts` - Full-featured agent
2. `examples/agent-configs/code-reviewer.ts` - Read-only agent
3. `tests/cases/` - All variations tested

### Architecture

1. `contexts/architecture.context.md` - System design
2. `core/schema/` - Type definitions
3. `prompts/injectable/` - Standardized prompts

---

**End of Onboarding Guide**

_This document provides a complete overview for AI agents to quickly understand and contribute to the framework. For detailed implementation guidance, refer to the specific files mentioned throughout._
