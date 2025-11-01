# Custom AI Agent Builder Framework - Brief

## What Is It?

A TypeScript-based framework for creating specialized AI agents tailored to software development projects. It targets VS Code Copilot chatmodes and Copilot CLI, focusing on making AI assistance more modular, efficient, and project-aware.

## The Problem It Solves

Generic AI agents are powerful but lack project-specific context. This framework addresses that by:

- Providing structured ways to inject project knowledge into AI agents
- Standardizing agent creation and configuration
- Ensuring type safety and validation through TypeScript and Zod
- Making it easier to create specialized agents for different development tasks

## Core Components

### 1. Agents

TypeScript configuration files that define an AI agent's characteristics:

- **Role**: The agent's personality and function (e.g., analyst, developer, reviewer)
- **Description**: What the agent does
- **Behavior**: How the agent should act
- **Permissions**: What the agent can and cannot do (guidance-based, not enforced)
- **Context**: Project-specific knowledge the agent should have

These configurations use enums for role, behavior, and permissions, which map to predefined prompts ("Injectable Prompts").

### 2. Context Chips

Small, focused markdown files that provide reusable context. Context chips can be referenced either:

- **Via Registry ID** (recommended): Reference pre-registered chips by ID from the central registry
- **Via Direct Path**: Specify file path directly for custom/ad-hoc chips

**Registry System:**

The framework includes a centralized Context Chip Registry (`contexts/registry.ts`) that:

- Provides a single source of truth for available context chips
- Enables type-safe chip references using IDs
- Includes metadata (description, tags, categories, versions)
- Simplifies chip management and discovery

**Good Examples:**

- Tech Stack: Technologies used in the project
- Conventions: Coding standards and best practices
- Patterns: Design patterns and architectural approaches
- Architecture Overview: High-level system design
- Constitution: Project goals, values, non-negotiable rules

**Avoid:**

- Feature-specific details (better suited for Feature Requirements Documents)

**Usage:**

```typescript
// Option 1: Use registry (recommended)
chips: new Set([
  { id: 'constitution', name: 'Project Constitution' },
  { id: 'architecture', name: 'Architecture Overview' }
]);

// Option 2: Direct path (for custom chips)
chips: new Set([{ name: 'Custom Chip', pathFromRoot: './my-chip.md' }]);
```

**Context Hierarchy:**

- **General/Common**: Universal best practices (clean code, maintainability)
- **Framework Related**: How the framework itself works
- **Project Specific**:
  - **Global**: Overall project info (tech stack, architecture, constitution)
  - **Local**: Feature-level nuances (via FRDs, not context chips)

### 3. Schemas & Validation

Uses Zod schemas to:

- Define the structure of all framework entities
- Validate agent configurations before generation
- Ensure type safety throughout the framework

### 4. Generators

Convert agent configurations into platform-specific formats:

- Read TypeScript agent definitions
- Inject mapped prompts based on role/behavior/permissions
- Produce final output files (e.g., VS Code chatmode files)

### 5. Templates

Structural blueprints for various file types:

**Framework Templates (Platform-agnostic):**

- Context Chip Template
- Development Document Templates:
  - Base Template
  - FRD (Feature Requirements Document)
  - FTD (Feature Technical Document)
  - README for features
  - COMPLETION_SUMMARY.md
  - Phase templates with implementation plans

**Platform Templates:**

- VS Code Copilot chatmode agent definitions
- Context chip formats for specific platforms

### 6. Scripts

Automation tools for ease of use:

- Execute with parameters (platform, agent name)
- Trigger generators to create required files
- Simplify the agent creation workflow

### 7. Injectable Prompts

Hardcoded, standardized prompts mapped to configuration options:

**Purpose:**

- Ensure consistency across agents
- Define how roles should act (e.g., "analyst" behavior)
- Standardize behaviors and permissions

**Mappings:**

- Role → Role Prompts
- Behavior → Behavior Prompts
- Permissions → Permission Prompts

Generators validate that agent configs reference valid injectable prompts.

## How It Works

### Typical Workflow

1. **Setup Context Chips**
   - Create essential context chips (tech stack, conventions, patterns)
   - Store as reusable markdown files

2. **Define an Agent**
   - Create a TypeScript file specifying role, behavior, permissions, context
   - Reference relevant context chips
   - Use enums for role/behavior/permissions

3. **Generate Output**
   - Run a script with target platform and agent name
   - Generator reads the agent configuration
   - Injects mapped prompts based on role/behavior/permissions
   - Uses templates to structure output
   - Produces platform-specific files

4. **Use the Agent**
   - Import generated files into VS Code Copilot
   - Interact with the specialized, context-aware AI agent

### Example Agent Flow

```
Agent Config (TypeScript)
    ↓
[role: "code-reviewer", behavior: "thorough", permissions: "read-only"]
    ↓
Generator
    ↓
Inject prompts: reviewer_role_prompt + thorough_behavior_prompt + read_only_permissions_prompt
    ↓
Apply template
    ↓
VS Code Chatmode File
```

## Proposed Default Agents

### Standard Agents

- **Code Reviewer Agent**: Reviews code for quality and standards
- **Bug Fixer Agent**: Diagnoses and fixes issues
- **Feature Developer Agent**: Implements new features
- **QA Tester Agent**: Tests and validates functionality

### Advanced Concept: Reviewer Agents

For large tasks where agents might drift from conventions:

- Create a **sibling reviewer agent** to audit another agent's work
- Example: Feature Architect Reviewer Agent checks Feature Architect Agent's output
- Produces reports on inconsistencies
- Enables creating a fresh agent instance to fix issues

### Factory Agents

Agents that create other agents on demand:

- **Feature Architect Factory Agent**
- **Feature Developer Factory Agent**
- **QA Tester Factory Agent**

These would dynamically generate specialized agents based on specific needs.

## Development Strategy

**Current Phase:** Targeting VS Code Copilot chatmodes only
**Future:** Expand to other platforms once the base is solid

## Key Benefits

1. **Type Safety**: TypeScript + Zod ensures valid configurations
2. **Modularity**: Reusable context chips and templates
3. **Consistency**: Injectable prompts standardize behavior
4. **Efficiency**: Scripts and generators automate agent creation
5. **Project Awareness**: Agents have structured access to project knowledge
6. **Scalability**: Easy to create new specialized agents
7. **Quality Control**: Reviewer agents can audit other agents' work

## Implementation Priorities

1. Create templates for context chips and development documents
2. Build default context chips (tech stack, conventions, patterns, architecture)
3. Implement core agents (code reviewer, bug fixer, feature developer, QA tester)
4. Define injectable prompts and mappings
5. Develop generators for VS Code Copilot chatmodes
6. Create automation scripts
7. Explore advanced concepts (reviewer agents, factory agents)

## Philosophy

The framework embraces the idea that **context-aware, specialized agents outperform generic ones** in software development. By providing structured, validated, and modular ways to inject project knowledge, it aims to make AI assistance faster, more accurate, and more reliable.
