# MVP TODOs - Custom AI Agent Builder Framework

**Target Platform**: VS Code Copilot Chatmodes **ONLY**

Reference: [VS Code Custom Chat Modes Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-chat-modes)

---

## Project Conventions

### 📝 Implementation Reports

After completing 1+ tasks, create a concise summary (max 500 lines):

- **Location**: `.github/agent-system-minimal/history/`
- **Naming**: `{index}-{brief-description}.md` (e.g., `001-vscode-gen-plus-prompts.md`)
- **Content**: Timestamp, tasks completed (before/after state), what was done, how (if complex)
- **Reference**: Must include link to `MVP_TODOS.md` so other agents can find remaining tasks
- **Principle**: LESS is MORE

### 🧪 Test File Structure

Tests mirror the project structure:

- **Pattern**: `tests/{same-path-as-source}/{filename}.test.ts` or `tests/{path}/tests/test-{feature}.ts`
- **Example**: Source at `generators/vscode-copilot/generate-chatmode.ts` → Test at `tests/generators/vscode-copilot/tests/test-generator.ts`

---

## 1. Core Implementation

### 1.1 VS Code Copilot Generator

- [x] 1.1.1 Create base generator file: `generators/vscode-copilot/generate-chatmode.ts`
- [x] 1.1.2 Implement agent config reader
- [x] 1.1.3 Implement role/behavior/permission prompt injection logic
- [x] 1.1.4 Implement chatmode file renderer (YAML frontmatter + Markdown body)
- [x] 1.1.5 Output to `.github/chatmodes/[agent-name].chatmode.md`
- [x] 1.1.6 Add error handling and validation

---

## 2. Templates

### 2.1 VS Code Chatmode Output Template

- [x] 2.1.1 Create template structure with YAML frontmatter
  - [x] 2.1.1.1 Define `description` field mapping
  - [x] 2.1.1.2 Define `tools` field mapping (from permissions)
  - [x] 2.1.1.3 Add optional `model` field support
  - [x] 2.1.1.4 Add optional `handoffs` field support (future feature)
- [x] 2.1.2 Create Markdown body template structure
  - [x] 2.1.2.1 Role-based introduction section
  - [x] 2.1.2.2 Behavior-based communication style section
  - [x] 2.1.2.3 Context injection sections (tech stack, conventions, patterns)
  - [x] 2.1.2.4 Permissions-based capabilities section

### 2.2 Agent Config Template (For Users)

- [x] 2.2.1 Create template file: `templates/agent-config.template.ts`
- [x] 2.2.2 Add inline documentation and examples
- [x] 2.2.3 Include all required and optional fields

---

## 3. Injectable Prompts

### 3.1 Role Prompts

- [x] 3.1.1 Define `analyst` role prompt
- [x] 3.1.2 Define `architect` role prompt
- [x] 3.1.3 Define `implementer` role prompt
- [x] 3.1.4 Define `reviewer` role prompt
- [x] 3.1.5 Define `guide` role prompt
- [x] 3.1.6 Define `orchestrator` role prompt

### 3.2 Behavior Prompts

- [x] 3.2.1 Define `concise` behavior prompt
- [x] 3.2.2 Define `detailed` behavior prompt
- [x] 3.2.3 Define `interactive` behavior prompt
- [x] 3.2.4 Define `autonomous` behavior prompt
- [x] 3.2.5 Define `creative` behavior prompt
- [x] 3.2.6 Define `conservative` behavior prompt

### 3.3 Permission Prompts

- [x] 3.3.1 Define `read-only` permission prompt + tools mapping
- [x] 3.3.2 Define `documentation` permission prompt + tools mapping
- [x] 3.3.3 Define `controlled` permission prompt + tools mapping
- [x] 3.3.4 Define `full` permission prompt + tools mapping

### 3.4 Prompt Mappings

- [x] 3.4.1 Create role → prompt mapping file
- [x] 3.4.2 Create behavior → prompt mapping file
- [x] 3.4.3 Create permission → prompt + tools mapping file
- [x] 3.4.4 Add validation in generator to check valid enum values

---

## 4. Context Chips

**Note**: Tech Stack, Conventions, and Patterns are now handled as inline context in agent configs (implemented in Phase 2). Context chips are for larger, external documentation.

### 4.1 Context Chip Examples

- [x] 4.1.1 Create **Constitution** context chip

  - Path: `contexts/constitution.context.md`
  - Content: Project's core goals, values, non-negotiable rules

- [x] 4.1.2 Create **Architecture Overview** context chip
  - Path: `contexts/architecture.context.md`
  - Content: High-level system design, module structure, data flow

### 4.2 Context Loading Mechanism

- [x] 4.2.1 Implement context chip file reader
- [x] 4.2.2 Implement context chip injection into chatmode template
- [x] 4.2.3 Add context chip reference resolution (by path or ID)
- [x] 4.2.4 Handle missing context chip files gracefully

### 4.3 Context Chip Registry (Added in Phase 4)

- [x] 4.3.1 Create centralized registry file (`contexts/registry.ts`)
- [x] 4.3.2 Update schema to support both registry ID and direct path
- [x] 4.3.3 Implement registry resolution in generator
- [x] 4.3.4 Add registry metadata (description, tags, categories, versions)
- [x] 4.3.5 Create utility functions (getChipById, resolveChipPath, etc.)
- [x] 4.3.6 Update documentation with registry information

---

## 5. Scripts & Automation

### 5.1 PowerShell Script Updates

- [x] 5.1.1 Update `scripts/generate.ps1` to call VS Code generator
- [x] 5.1.2 Add parameter for agent config path
- [x] 5.1.3 Add validation and helpful error messages

### 5.2 Bash Script Updates (Optional for MVP)

- [x] 5.2.1 Update `scripts/generate.sh` to call VS Code generator
- [x] 5.2.2 Mirror PowerShell script functionality

---

## 6. Testing & Validation

**Note**: We will complete this section together

- [ ] 6.1 Test end-to-end workflow: config → generator → chatmode file
- [ ] 6.2 Validate generated chatmode works in VS Code
- [ ] 6.3 Test all role variations
- [ ] 6.4 Test all behavior variations
- [ ] 6.5 Test all permission variations
- [ ] 6.6 Test context chip injection
- [ ] 6.7 Verify YAML frontmatter syntax
- [ ] 6.8 Verify Markdown body structure

---

## 7. Documentation

### 7.1 Update Existing Docs

- [ ] 7.1.1 Update README with VS Code chatmode instructions
- [ ] 7.1.2 Update QUICK_START with new generator usage
- [ ] 7.1.3 Add context chip creation guide

### 7.2 Example Files

- [ ] 7.2.1 Ensure example agents work with new generator
- [ ] 7.2.2 Create sample generated chatmode file for reference

---

## Progress Tracking

- **Total Tasks**: 61
- **Completed**: 48
- **In Progress**: 0
- **Blocked**: 0

---

## Notes

### VS Code Chatmode Format Reference

**YAML Frontmatter Structure**:

```yaml
---
description: Brief description shown in chat input placeholder
tools: ['search', 'edit', 'fetch', 'usages'] # Available tools
model: Claude Sonnet 4 # Optional: AI model selection
handoffs: # Optional: Workflow transitions
  - label: Next Step
    agent: target-mode
    prompt: Suggested prompt text
    send: false
---
```

**Markdown Body**:

- Contains instructions, guidelines, and context
- Can reference other files using Markdown links
- Gets prepended to user prompts when mode is active

### Chatmode File Locations

- **Workspace**: `.github/chatmodes/*.chatmode.md` (default)
- **User Profile**: For personal agents across workspaces

### Tools Available in VS Code Copilot

Common tools to map from permissions:

- `search` - Search codebase
- `edit` - Edit files
- `new` - Create files
- `fetch` - Fetch web content
- `githubRepo` - Access GitHub repos
- `usages` - Find code usages
- `runCommands` - Execute terminal commands
- `runTasks` - Run VS Code tasks
- `vscodeAPI` - Access VS Code APIs
- `problems` - View errors/warnings
- `changes` - View git changes
- `testFailure` - View test failures

---

## Dependencies Between Tasks

```
1.1 (Generator) depends on:
  - 3.1, 3.2, 3.3 (Injectable Prompts)
  - 3.4 (Mappings)
  - 2.1 (Output Template)

2.1 (Output Template) depends on:
  - 3.4 (Prompt Mappings)

4.2 (Context Loading) depends on:
  - 4.1 (Context Chips exist)

5.1 (Scripts) depends on:
  - 1.1 (Generator exists)
```

### Recommended Implementation Order

1. **Phase 1**: Injectable Prompts & Mappings (3.1 → 3.4) ✅
2. **Phase 2**: Output Template (2.1 → 2.2) ✅
3. **Phase 3**: Generator Implementation (1.1) ✅
4. **Phase 4**: Context Chips (4.1 → 4.2) - Partially complete (loader done, examples needed)
5. **Phase 5**: Scripts (5.1)
6. **Phase 6**: Testing & Validation (6.1 → 6.8)
7. **Phase 7**: Documentation (7.1 → 7.2)

---

**Last Updated**: November 1, 2025
**Status**: 🚧 Ready to Start Implementation
