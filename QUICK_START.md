# Quick Start - Minimal Agent Framework

Get started with AI agent configurations for **VS Code Copilot** in **5 minutes**.

---

## Step 1: Create Your First Agent

Create `examples/my-agent.ts`:

```typescript
import type { AgentConfig } from '../core/schema/agent.schema';

export const myAgent: AgentConfig = {
  name: 'My First Agent',
  version: '1.0.0',
  description: 'A helpful coding assistant',

  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' }
};

export default myAgent;
```

---

## Step 2: Generate Chatmode File

Run the generator:

```bash
# From the agent-system-minimal directory
npx tsx generators/vscode-copilot/generate-chatmode.ts examples/my-agent.ts --overwrite
```

This creates `.github/chatmodes/my-first-agent.chatmode.md`.

---

## Step 3: Use with VS Code Copilot

1. Open VS Code
2. Start a new chat (`Ctrl/Cmd + I` or chat icon)
3. Type `@` to see available agents
4. Select your custom agent: `@my-first-agent`
5. Start chatting!

```
@my-first-agent Help me implement user authentication
```

---

## Choose Your Agent Type

### 🔍 Code Analyst

```typescript
{
  role: 'analyst',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' }
}
```

**Use for**: Finding patterns, analyzing code quality, identifying issues

---

### 🏗️ Feature Builder

```typescript
{
  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' }
}
```

**Use for**: Building features, writing code, creating files

---

### 📝 Documentation Writer

```typescript
{
  role: 'guide',
  permissions: { level: 'documentation' },
  behavior: { profile: 'detailed' }
}
```

**Use for**: Writing docs, explaining concepts, creating guides

---

### ✅ Code Reviewer

```typescript
{
  role: 'reviewer',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' }
}
```

**Use for**: Reviewing PRs, quality checks, providing feedback

---

## Add Project Context (Optional)

### Using Inline Context

```typescript
export const agent: AgentConfig = {
  name: 'Project Assistant',
  version: '1.0.0',
  description: 'Knows our project tech stack',
  role: 'guide',
  permissions: { level: 'read-only' },
  behavior: { profile: 'detailed' },

  context: {
    techStack: {
      framework: 'React Native',
      language: 'TypeScript',
      testing: 'Jest',
      database: 'SQLite'
    },

    conventions: {
      fileNaming: 'kebab-case',
      componentNaming: 'PascalCase',
      functionNaming: 'camelCase'
    },

    patterns: {
      preferred: ['Hooks', 'Functional components'],
      forbidden: ['Any types', 'console.log']
    }
  }
};
```

### Using Context Chips (Recommended for Large Context)

```typescript
export const agent: AgentConfig = {
  name: 'Project Assistant',
  version: '1.0.0',
  description: 'Knows project architecture and values',
  role: 'implementer',
  permissions: { level: 'controlled' },
  behavior: { profile: 'autonomous' },

  context: {
    // Use chips from the registry
    chips: new Set([
      { id: 'constitution', name: 'Project Constitution' },
      { id: 'architecture', name: 'Architecture Overview' }
    ])

    // Or use custom chips with direct paths
    // chips: new Set([
    //   { name: 'Custom Chip', pathFromRoot: './contexts/my-chip.md' }
    // ])
  }
};
```

**Available Registry Chips:**

- `constitution` - Project goals, values, non-negotiable rules
- `architecture` - System design, module structure, data flow

**Add New Chips:**
Register them in `contexts/registry.ts` and create markdown files.

---

## Quick Reference

### Roles

- `analyst` - Examines code, finds patterns, provides insights
- `architect` - Designs solutions, plans system structure
- `implementer` - Writes code, builds features, creates files
- `reviewer` - Reviews code, ensures quality, provides feedback
- `guide` - Explains concepts, provides documentation
- `orchestrator` - Coordinates tasks, manages workflows

### Permission Levels

- `read-only` - Search, analyze, read files (7 tools)
- `documentation` - Read + create/edit markdown (10 tools)
- `controlled` - Read + limited code editing (13 tools)
- `full` - Unrestricted access with safety confirmations

**Tools by Permission:**

- Read-only: `search`, `fetch`, `githubRepo`, `usages`, `problems`, `changes`, `testFailure`
- Documentation: Adds `vscodeAPI`, `runTasks`, markdown editing
- Controlled: Adds `edit`, `new`, `runCommands` (restricted)
- Full: All tools unrestricted

### Behavior Profiles

- `concise` - Brief, to-the-point responses
- `detailed` - Comprehensive explanations with context
- `interactive` - Asks clarifying questions, collaborative
- `autonomous` - Makes decisions independently, minimal questions
- `creative` - Explores alternatives, innovative solutions
- `conservative` - Follows patterns strictly, risk-averse

---

## Context Options

### Inline Context (Small Projects)

Best for simple tech stack and conventions:

```typescript
context: {
  techStack: { framework: 'React', language: 'TypeScript' },
  conventions: { fileNaming: 'kebab-case' },
  patterns: { preferred: ['Hooks', 'Functional components'] }
}
```

### Context Chips (Large Projects)

Best for extensive documentation:

```typescript
context: {
  chips: new Set([
    { id: 'constitution', name: 'Project Constitution' },
    { id: 'architecture', name: 'Architecture Overview' }
  ]);
}
```

### Hybrid Approach

Combine both for maximum context:

```typescript
context: {
  techStack: { framework: 'React Native' },
  chips: new Set([
    { id: 'architecture', name: 'Architecture' }
  ])
}
```

---

## Examples

See complete examples in `examples/`:

- `code-reviewer.ts` - Reviews code for quality and best practices
- `feature-builder.ts` - Implements features with full context

**Generate an example:**

```bash
# Generate code reviewer chatmode
npx tsx generators/vscode-copilot/generate-chatmode.ts examples/code-reviewer.ts --overwrite

# Generate feature builder chatmode
npx tsx generators/vscode-copilot/generate-chatmode.ts examples/feature-builder.ts --overwrite
```

**Use in VS Code:**

```
@code-reviewer Review this pull request for security issues
@feature-builder Implement user authentication with JWT
```

---

## Scripts (Coming Soon)

Simplified generation with PowerShell/Bash scripts:

```bash
# PowerShell
.\scripts\generate.ps1 examples/my-agent.ts

# Bash
./scripts/generate.sh examples/my-agent.ts
```

---

## Next Steps

1. ✅ Create your first agent
2. ✅ Generate and test it in VS Code
3. 📚 Read [README.md](README.md) for full documentation
4. 🎯 Explore the [template](templates/agent-config.template.ts) for all options
5. 🔧 Add context chips for your project in `contexts/registry.ts`
6. 🚀 Create specialized agents for your workflow

---

## Tips

**Start Simple:** Begin with just role, permissions, and behavior. Add context later.

**Test Incrementally:** Generate and test after each change to see the impact.

**Use Registry Chips:** For large context, create chips and register them instead of inline context.

**Check Generated Files:** Look at `.github/chatmodes/*.chatmode.md` to see what the agent receives.

**Iterate:** Adjust role, behavior, and permissions based on how the agent performs.

---

**That's it!** You're ready to create custom AI agents for VS Code Copilot. 🎉
