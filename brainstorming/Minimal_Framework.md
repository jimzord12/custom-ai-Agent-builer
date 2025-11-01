We are in Brainstorming mode, do NOT edit files!

# Custom AI Agent Builder Framework

I am in the middle of developing a simple framework for creating custom AI Agents. The frameworks targets the Software development domain specifically.

For now I only target VS Code Copilot (chatmodes) and Copilot CLI.

## Main idea

Even though generic Agents are quite powerful, providing them with project specific context and instructions seems to increase speed and quality.

The framework aims at making this process more modular, easier, faster and more efficient.

## Core Concepts

The framework will be composed of the following core concepts:

- Agents: Typescript files that define the Agent's personality, role, instructions and tools. By using TS and Zod we can have type safety and validation. Finally, we can generate the target format (eg: VS Code Copilot chatmode or Copilot CLI ) through the scripts and generators.

### Agents

Agents will be defined using Typescript files. Each Agent will have the following structure:

- **role**: A description of the Agent's personality and role.
- **description**: A set of instructions that guide the Agent's behavior and responses.
- **behavior**: A set of instructions that guide the Agent's behavior and responses.
- **permissions**: A set of instructions that guide the Agent's behavior and responses.
- **context**: A set of instructions that guide the Agent's behavior and responses.

Some of these are enums that describe predefined options (role, behavior, permissions). When the generator reads the Agent config based on these options it will inject the mapped prompts to achieve the desired behavior.

Notes:

- The context is more complex and will be described later.
- Permissions currently cannot truly be enforced, but they can guide the Agent's behavior.

### Schemas & Validation

The framework will use Zod schemas to define and validate the structure of all its entities. This will ensure that all configurations are correct and consistent.

Validation function will be provided to validate the Agent configurations before generating the final output.

### Generators

Generators play a critical part in the framework. They will read the Agent configurations and produce the final output format required by the target platform (eg: VS Code Copilot chatmode or Copilot CLI).

### Scripts

They are simple tools to provide automation and ease of use. For example, the user can call a bash or powershell script by providing some parameters (eg: target platform, agent name) and the script in turn will generate the required files by using the framework's generators.

### Templates

Another crucial part of the framework are templates. They will be used to define the structure of the final output files. The generators will use these templates to produce the final files by injecting the Agent's configuration data.

There will be templated for other kinds of files too, for example context files, feature development files (to standardize the process of developing a new feature by providing a template with instructions and sections to fill in).

### Context

The Framework should provide ways to organize context. Here are a few ideas:

- **General/Common Contexts**: This can be staff like, write clean code, maintainable and testable code.
- **Framework Related Contexts**: The Agents should have knowledge on how the Framework works and what is their role in it.
- **Project Specific Contexts**: Here we can have 2 sub categories: Global & Local.
  - **Global**: General info about the project, like techstack, conversions, architecture, etc.
  - **Local**: Small Contexts about how a feature works or we want it work. Feature level nuances.

A great question is how to provide this context to the Agents in an efficient way. Here is my idea:

- **Context Chips**: Small markdown files that provide context about a specific topic. These can be linked to the Agents and can also be used to provide context on demand. (Also if you have a better idea for the name please share it 😊).

**Context Chip Registry System:**

To improve context chip management, the framework implements a centralized registry system:

- **Registry File**: `contexts/registry.ts` - Single source of truth for all available chips
- **Type-Safe References**: Use chip IDs instead of file paths for better safety
- **Metadata Support**: Each chip includes description, tags, categories, and versions
- **Dual Reference Methods**:
  - **Registry ID** (recommended): `{ id: 'constitution', name: 'Project Constitution' }`
  - **Direct Path** (for custom chips): `{ name: 'Custom', pathFromRoot: './my-chip.md' }`

**Benefits of Registry:**

- Centralized chip discovery and management
- Type-safe chip references with autocomplete
- Prevents duplicate paths across agent configs
- Easier to move/rename chip files (update once in registry)
- Supports metadata for searching and categorization

A few good examples of context chips:

- Tech Stack: Describes the technologies used in the project.
- Conventions: Coding conventions and best practices followed in the project.
- Patterns: Design patterns and architectural patterns used in the project.
- Architecture: High-level system design and module structure.
- Constitution: Project goals, values, and non-negotiable rules.

A few bad examples of context chips:

- Feature Context: This should be avoided as this information is better suited at FRD.md files or similar. The context chips should provide general context that can be reused across multiple features.

In the future we can also expand on this by providing types of context chips.

## Workflow Example

1. The user should create a few vital context chips for the project (eg: tech stack, conventions, patterns). Note: in the future we can create Agents, scripts, templated, etc to help with this process.
2. Define an Agent using a Typescript file, specifying its role, description, behavior, permissions, and context.
3. Use the provided scripts to generate the final output files for the target platform (eg: VS Code Copilot chatmode or Copilot CLI).
4. The generated files can then be used directly in the target platform to interact with the AI.

## TODOs

**IMPORTANT**: We will start by **ONLY** targeting VS Code Copilot chatmodes. Once we have a solid base we can expand to other platforms.

### Templates Creation

- [ ] Brainstorm how to create the Templates. What information should be included, how to structure them, etc.
  - [ ] Framework Specific Templates (These are platform agnostic, eg: context chips, feature development templates, etc)
    - [ ] Context Chip Template
    - [ ] Development Document templates:
      - [ ] Base Template, other Development Document templates will build upon this one:
        - [ ] Feature Level: FRD (Feature Requirements Document) template
        - [ ] FTD (Feature Technical Document) template
        - [ ] README template, entry point for feature development
        - [ ] COMPLETION_SUMMARY.md template (Created after feature is done)
        - Phases templates:
          - [ ] Phase base template:
            - [ ] IMPLEMENTATION_PLAN.md template
            - [ ] COMPLETION_SUMMARY.md template (Created after phase is done)
  - [ ] VS Code Copilot chatmode
    - [ ] Agent definition template
    - [ ] Context chip template

### Default

#### Content Chips

- [ ] Create Default Context Chips
  - [ ] Tech Stack
  - [ ] Conventions
  - [ ] Patterns
  - [ ] Architecture Overview
  - your suggestions?

#### Agents

- [ ] Create Default Agents
  - [ ] Code Reviewer Agent
  - [ ] Bug Fixer Agent
  - [ ] Feature Developer Agent
  - [ ] QA Tester Agent

Some more intresting ones. If noticed that in Huge tasks that require a big context window, agents start to go a bit of track. They change the file names wewe have aggreed upon, or they forget to follow the conventions, etc.

I believe that by creating an Agent whose sole purpose is to review the work of its sibling Agent would yield high results.

For Instance, let's say that we have a Feature Architect Agent who create all the necessary documentation for a feature (FRD, FTD, README, etc). While we work with that Agent we start to see some inconsistencies in the naming conventions of the files it creates. At that point we can create the Feature Architect Reviewer Agent, who will review the work of the Feature Architect Agent and ensure that everything is in line with the project's conventions and standards. This Agents can then produce a report with the issues, afterwards we can create a fresh Feature Architect Agent instance to fix the issues.

That leads us to the need of a new type of Agents, the Factory Agents. These Agents will be responsible for creating other Agents on demand.

- [ ] Create Factory Agents
  - [ ] Feature Architect Factory Agent
  - [ ] Feature Developer Factory Agent
  - [ ] QA Tester Factory Agent
  - ...

#### Injectable Prompts

What are Injectable Prompts? These are prompts that can be injected into the Agent's configuration based on the selected options (role, behavior, permissions). They help to standardize the Agent's behavior and ensure consistency across different Agents. These are hardcoded in the primitives schema. This is done to ensure consistency.

For example, if we have a "analyst" role, we can have a one (or set of prompts) that defines how an `analyst` should act.

Therefore, apart from the prompts themselves, we need to create a mapping between roles and their corresponding prompts. This applies to behavior and permissions too.

Generators should validate that values specified in the Agent's config do exist in the Injectable Prompts list and if not throw an error.

- [ ] Create Built-in Injectable Prompts
  - [ ] Agent prompts:
    - [ ] Role Prompts
    - [ ] Behavior Prompts
    - [ ] Permissions Prompts
- [ ] Create Built-in Mappings
  - [ ] Role to Prompts Mapping
  - [ ] Behavior to Prompts Mapping
  - [ ] Permissions to Prompts Mapping
