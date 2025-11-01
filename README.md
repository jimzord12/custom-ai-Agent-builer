# Minimal Agent Framework

> **Simple, type-safe AI agent configurations for GitHub Copilot CLI**

A lightweight framework for creating specialized AI coding agents with just the essentials: roles, permissions, and behaviors.

---

## 🎯 What Is This?

This framework lets you define **custom AI agents** (like GitHub Copilot assistants) using simple TypeScript configurations instead of freeform markdown files.

**Example**: Instead of manually writing agent instructions, you define:

```typescript
const myAgent = {
  name: "Feature Builder",
  role: "implementer",        // What it does
  permissions: { level: "controlled" },  // What it can access
  behavior: { profile: "autonomous" },   // How it communicates
  context: { techStack: {...}, conventions: {...} }  // Project info
};
```

The framework then **generates GitHub Copilot CLI agent files** automatically.

---

## ✨ Why Use This?

✅ **Type-safe** - TypeScript + Zod validation catches errors early
✅ **Simple** - Only 3 required fields (role, permissions, behavior)
✅ **Consistent** - Standardized structure for all agents
✅ **Minimal** - No complex workflows, traits, or inheritance
✅ **Extensible** - Easy to add features later when needed

---

## 🚀 Quick Start

### 1. Create an Agent Configuration

Create `config/my-agent.ts`:

```typescript
import type { AgentConfig } from '../.github/agent-system-prototype/core/schema';

export const myAgent: AgentConfig = {
  name: 'My Agent',
  version: '1.0.0',
  description: 'Helps with feature implementation',

  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' }
};

export default myAgent;
```

### 2. Generate Agent Files

```bash
# Using npx
npx tsx .github/agent-system-prototype/generators/copilot-cli/generate-agent.ts config/my-agent.ts

# Or using ts-node
ts-node .github/agent-system-prototype/generators/copilot-cli/generate-agent.ts config/my-agent.ts
```

### 3. Use with GitHub Copilot CLI

```bash
copilot --agent=my-agent --prompt "Add user authentication"
```

---

## 📚 Core Concepts

### Roles (What the agent does)

| Role           | Description                          | Default Permission |
| -------------- | ------------------------------------ | ------------------ |
| `analyst`      | Examines code, finds patterns        | `read-only`        |
| `architect`    | Designs solutions, plans             | `documentation`    |
| `implementer`  | Builds features, writes code         | `controlled`       |
| `reviewer`     | Validates quality, gives feedback    | `read-only`        |
| `guide`        | Explains concepts, documents         | `documentation`    |
| `orchestrator` | Coordinates tasks, manages workflows | `documentation`    |

### Permission Levels (What it can access)

| Level           | Description     | Can Do                                |
| --------------- | --------------- | ------------------------------------- |
| `read-only`     | Analysis only   | Read, search, analyze                 |
| `documentation` | Docs only       | Above + create/edit `.md` files       |
| `controlled`    | Limited write   | Above + create/edit in specific paths |
| `full`          | Complete access | Everything (with confirmations)       |

### Behavior Profiles (How it communicates)

| Profile        | Description                   | Best For                      |
| -------------- | ----------------------------- | ----------------------------- |
| `concise`      | Brief, minimal explanation    | Experienced devs, quick fixes |
| `detailed`     | Comprehensive with examples   | Learning, complex features    |
| `interactive`  | Asks questions, seeks clarity | Ambiguous requirements        |
| `autonomous`   | Makes decisions independently | Well-defined tasks            |
| `creative`     | Explores alternatives         | Architecture, brainstorming   |
| `conservative` | Follows patterns strictly     | Production, legacy code       |

---

## 📖 Complete Configuration

```typescript
import type { AgentConfig } from '../.github/agent-system-prototype/core/schema';

export const fullExample: AgentConfig = {
  // Required fields
  name: 'Full Example',
  version: '1.0.0',
  description: 'Demonstrates all available fields',
  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' },

  // Optional: Project context
  context: {
    techStack: {
      framework: 'React Native',
      language: 'TypeScript',
      testing: 'Jest',
      database: 'SQLite'
      // ... more tech stack info
    },

    conventions: {
      fileNaming: 'kebab-case',
      componentNaming: 'PascalCase',
      functionNaming: 'camelCase',
      testPattern: '*.test.ts',
      importOrder: ['external', 'internal', 'relative']
    },

    patterns: {
      preferred: ['Functional components with hooks', 'TypeORM entities', 'Service layer pattern'],
      forbidden: ['Any types', 'console.log in production'],
      architectural: 'Clean Architecture'
    }
  }
};
```

---

## 📁 Project Structure

```
agent-system-prototype/
├── README.md                    # This file
├── QUICK_START.md               # 5-minute tutorial
│
├── core/
│   └── schema/
│       ├── primitives.ts        # Role, permission, behavior enums
│       ├── agent-schema.ts      # Main configuration schema
│       └── index.ts             # Exports
│
├── generators/
│   └── copilot-cli/
│       ├── generate-agent.ts    # Generates .github/agents/*.md
│       └── index.ts
│
└── examples/
    ├── project-base.ts          # Example: project context
    ├── feature-builder.ts       # Example: feature implementer
    ├── code-reviewer.ts         # Example: code reviewer
    └── index.ts                 # All examples
```

---

## 💡 Examples

See the `examples/` directory for ready-to-use configurations:

- **[project-base.ts](examples/project-base.ts)** - Project context with tech stack and conventions
- **[feature-builder.ts](examples/feature-builder.ts)** - Autonomous feature implementer
- **[code-reviewer.ts](examples/code-reviewer.ts)** - Detailed code review agent

### Generate All Examples

```bash
npx tsx .github/agent-system-prototype/generators/copilot-cli/generate-agent.ts .github/agent-system-prototype/examples/index.ts
```

---

## 🛠️ Usage Patterns

### Single Agent

```typescript
// config/my-agent.ts
import type { AgentConfig } from '../.github/agent-system-prototype/core/schema';

export const agent: AgentConfig = { ... };
export default agent;
```

### Multiple Agents

```typescript
// config/all-agents.ts
import type { AgentConfig } from '../.github/agent-system-prototype/core/schema';

export const baseAgent: AgentConfig = { ... };
export const builderAgent: AgentConfig = { ... };
export const reviewerAgent: AgentConfig = { ... };

// Export as array for batch generation
export default [baseAgent, builderAgent, reviewerAgent];
```

### Project Base Pattern

Create a base agent with project context, then specialized agents for tasks:

```typescript
// config/agents.ts
import type { AgentConfig } from '../.github/agent-system-prototype/core/schema';

// Base agent with project context
export const base: AgentConfig = {
  name: 'Project Base',
  role: 'guide',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' },
  context: {
    techStack: {
      /* full tech stack */
    },
    conventions: {
      /* coding conventions */
    },
    patterns: {
      /* preferred patterns */
    }
  }
};

// Specialized agents reference the base
export const builder: AgentConfig = {
  name: 'Feature Builder',
  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' }
  // Inherits context from base when both are loaded
};

export default [base, builder];
```

---

## 🔧 Customization

### Adding Custom Context

```typescript
const agent: AgentConfig = {
  // ... required fields

  context: {
    techStack: {
      framework: 'Next.js',
      language: 'TypeScript',
      testing: 'Vitest',
      styling: 'Tailwind CSS'
    },

    conventions: {
      fileNaming: 'kebab-case',
      componentNaming: 'PascalCase'
    },

    patterns: {
      preferred: ['Server Components', 'App Router'],
      forbidden: ['Pages Router'],
      architectural: 'Serverless Architecture'
    }
  }
};
```

### Validation

All configurations are validated with Zod:

```typescript
import { parseAgentConfig, validateAgentConfig } from './core/schema';

// Throws on invalid config
const config = parseAgentConfig(myConfig);

// Returns success/error
const result = validateAgentConfig(myConfig);
if (!result.success) {
  console.error(result.errors);
}
```

---

## 🎓 Best Practices

1. **Start with a base agent** containing project-wide context
2. **Use specific roles** that match the task
3. **Match permissions to needs** - start restrictive, expand if needed
4. **Choose appropriate behavior** - autonomous for clear tasks, interactive for exploration
5. **Document patterns** in context to guide agent responses
6. **Version your agents** using semantic versioning

---

## 🔮 Future Enhancements (Not in MVP)

The following features are intentionally **not** included in this minimal version but can be added later:

- ❌ `allowedPaths` / `deniedPaths` - Granular file access control
- ❌ `workflows` - Automated onCreate/onModify/onComplete steps
- ❌ `validation` - Output validation rules
- ❌ `traits` - Composable behavior mixing
- ❌ `extends` - Agent inheritance
- ❌ Pre-built archetypes - Just use examples instead

---

## 📝 Schema Reference

### AgentConfig

```typescript
{
  // Required
  name: string;                    // Agent name (1-100 chars)
  version: string;                 // Semver (e.g., "1.0.0")
  description: string;             // Brief description (max 500 chars)
  role: RoleName;                  // Primary function
  permissions: { level: PermissionLevelName };
  behavior: { profile: BehaviorProfileName };

  // Optional
  context?: {
    techStack?: { ... };
    conventions?: { ... };
    patterns?: { ... };
  };
}
```

### Enums

```typescript
type RoleName = 'analyst' | 'architect' | 'implementer' | 'reviewer' | 'guide' | 'orchestrator';
type PermissionLevelName = 'read-only' | 'documentation' | 'controlled' | 'full';
type BehaviorProfileName = 'concise' | 'detailed' | 'interactive' | 'autonomous' | 'creative' | 'conservative';
```

---

## 🐛 Troubleshooting

### "Configuration file not found"

Ensure the path is correct relative to where you run the generator:

```bash
npx tsx .github/agent-system-prototype/generators/copilot-cli/generate-agent.ts config/my-agent.ts
```

### "Zod validation error"

Check the error message for the specific field. Common issues:

- Invalid role/permission/behavior value (must match enum)
- Missing required fields (name, version, description, role, permissions, behavior)
- Invalid version format (must be semver like "1.0.0")

### "Generated agent not appearing in Copilot"

1. Verify file exists in `.github/agents/`
2. Check YAML frontmatter syntax
3. Restart Copilot CLI: `copilot --help`

---

## 📄 License

MIT - Use freely in your projects

---

## 🤝 Contributing

This is a minimal prototype. Contributions welcome for:

- Bug fixes
- Better error messages
- More examples
- Documentation improvements

Keep it simple! Complex features go in future versions.

---

**Version**: 1.0.0
**Status**: ✅ Prototype Ready
**Last Updated**: October 30, 2025
