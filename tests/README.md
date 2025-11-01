# Tests Directory# Tests Directory# Tests Directory

This directory contains all test files for the AI Agent Builder Framework.This directory contains all test files for the AI Agent Builder Framework.This directory contains all test files for the AI Agent Builder Framework.

------## Structure Convention

## 🆕 Testing Convention: Isolated Test Cases## 🆕 Testing Convention: Isolated Test CasesTests mirror the project's source structure:

We use **isolated test cases** that are self-contained and independent from the `/examples` folder.We use **isolated test cases** that are self-contained and independent from the `/examples` folder.```

### Why Isolated Test Cases?Project Root

- **Independence**: Each test case is completely self-contained### Why Isolated Test Cases?├── generators/

- **Clarity**: All test artifacts are in one place

- **Reproducibility**: Easy to understand what's being tested│ └── vscode-copilot/

- **Framework Integrity**: Injectable prompts are never mocked or rewritten

- **Independence**: Each test case is completely self-contained│ └── generate-chatmode.ts

---

- **Clarity**: All test artifacts are in one place└── tests/

## Directory Structure

- **Reproducibility**: Easy to understand what's being tested └── generators/

Tests are organized by category:

- **Framework Integrity**: Injectable prompts are never mocked or rewritten └── vscode-copilot/

````

tests/            └── tests/

├── utils/                          # Test utilities (assertions, file helpers)

│   ├── test-runner.ts### Test Case Structure └── test-generator.ts

│   ├── file-helpers.ts

│   └── index.ts```

├── cases/                          # All test cases organized by category

│   ├── context/                    # Context-related testsEach test case is a directory under `tests/cases/` with:

│   │   ├── 001-inline-context/

│   │   ├── 002-registry-chips/## Naming Patterns

│   │   ├── 003-direct-path-chips/

│   │   └── 004-mixed-context/```

│   ├── prompts/                    # Prompt injection tests

│   │   └── 005-role-behavior-permissions/tests/cases/001-basic-inline-context/Two acceptable patterns:

│   ├── generators/                 # (Future) Generator tests

│   ├── registries/                 # (Future) Registry tests├── agent.config.ts # Agent configuration for this test

│   ├── templates/                  # (Future) Template tests

│   └── agent-config/               # (Future) Config validation tests├── index.ts # Test runner with assertions1. **Direct Mirror**: `tests/{same-path-as-source}/{filename}.test.ts`

└── run-all-tests.ts                # Main test runner with category support

```├── output/ # Generated chatmode files (gitignored) - Example: `tests/core/schema/agent.schema.test.ts`



### Test Case Structure└── [custom-chips.md] # Custom context chips (if needed)



Each test case directory contains:```2. **Tests Subfolder**: `tests/{path}/tests/test-{feature}.ts`



```- Example: `tests/generators/vscode-copilot/tests/test-generator.ts`

tests/cases/category/001-test-name/

├── agent.config.ts        # Agent configuration for this test### Important Rules - Use when multiple test files needed for one source file

├── index.ts               # Test runner with assertions

├── output/                # Generated chatmode files (gitignored)1. **✅ DO**: Write agent configs, context chips, and test assertions from scratch## Running Tests

└── [custom-chips.md]      # Custom context chips (if needed)

```2. **❌ DON'T**: Import from `/examples` folder



---3. **🚫 NEVER**: Mock or rewrite injectable prompts (`.github/agent-system-minimal/prompts/injectable`)```bash



## Running Tests4. **✓ ALWAYS**: Use the framework's actual generators and prompts# Run all tests



**IMPORTANT**: Always run tests from the **workspace root**, not from `.github/agent-system-minimal/`.npm test



### Run All Tests---



```bash# Run specific test file

# From workspace root (e.g., C:\Users\...\ics-vcr)

npx tsx .github\agent-system-minimal\tests\run-all-tests.ts## Running Testsnpx tsx tests/generators/vscode-copilot/tests/test-generator.ts

````

### Run All Tests# Run tests with watch mode

### Run Tests by Category

npm run test:watch

```bash

# Context tests only`bash`

npx tsx .github\agent-system-minimal\tests\run-all-tests.ts context

# PowerShell

# Prompts tests only

npx tsx .github\agent-system-minimal\tests\run-all-tests.ts promptsnpx tsx .github/agent-system-minimal/tests/run-all-tests.ts## Test File Template

```

# Alternative (if script added to package.json)```typescript

### Run Individual Test Case

npm test/\*\*

`````bash

# By test number````* Tests for [Feature Name]

npx tsx .github\agent-system-minimal\tests\cases\context\001-inline-context\index.ts

 */

# Different category

npx tsx .github\agent-system-minimal\tests\cases\prompts\005-role-behavior-permissions\index.ts### Run Individual Test Caseimport { describe, it, expect } from 'your-test-framework';

`````

import { featureToTest } from '../../../path/to/source';

---

`````bash

## Existing Test Cases

# PowerShelldescribe('Feature Name', () => {

### Context Category

npx tsx .github/agent-system-minimal/tests/cases/001-basic-inline-context/index.ts  it('should do something', () => {

#### 001: Basic Agent with Inline Context

```    // Test implementation

Tests inline context rendering (techStack, conventions, patterns).

  });

**Tests:**

- ✅ Inline tech stack rendering### Run Specific Test Case by Number});

- ✅ Inline conventions rendering

- ✅ Inline patterns rendering````

- ✅ Role/behavior/permission prompt injection

- ✅ YAML frontmatter validation```bash



**Run:**npx tsx .github/agent-system-minimal/tests/cases/003-direct-path-context-chips/index.ts## Guidelines

```bash

npx tsx .github\agent-system-minimal\tests\cases\context\001-inline-context\index.ts```

`````

- Keep test files focused and organized

---

---- Mirror source structure for easy navigation

#### 002: Agent with Registry Context Chips

- Use descriptive test names

Tests context chips referenced by registry ID.

## Existing Test Cases- Include both unit and integration tests

**Tests:**

- ✅ Registry chip resolution (ID → file path)- Mock external dependencies appropriately

- ✅ Loading chip content from registry

- ✅ Multiple chips with separators### 001: Basic Agent with Inline Context

- ✅ No inline context when using only chips

Tests inline context rendering (techStack, conventions, patterns).

**Run:**

````bash**What it tests:**

npx tsx .github\agent-system-minimal\tests\cases\context\002-registry-chips\index.ts

```- Inline tech stack rendering

- Inline conventions rendering

---- Inline patterns rendering

- Role/behavior/permission prompt injection

#### 003: Agent with Direct Path Context Chips

**Run:**

Tests context chips with direct `pathFromRoot`.

```bash

**Tests:**npx tsx tests/cases/001-basic-inline-context/index.ts

- ✅ Loading chips from direct file paths```

- ✅ Custom chips not in registry

- ✅ Works without registry IDs---



**Run:**### 002: Agent with Registry Context Chips

```bash

npx tsx .github\agent-system-minimal\tests\cases\context\003-direct-path-chips\index.tsTests context chips referenced by registry ID.

````

**What it tests:**

---

- Registry chip resolution (ID → file path)

#### 004: Agent with Mixed Context- Loading chip content from registry

- Multiple chips with separators

Tests combining ALL context types together.- No inline context when using chips

**Tests:\*\***Run:\*\*

- ✅ Inline context + registry chips + direct path chips

- ✅ Proper context ordering```bash

- ✅ All context types coexist correctlynpx tsx tests/cases/002-registry-context-chips/index.ts

````

**Run:**

```bash---

npx tsx .github\agent-system-minimal\tests\cases\context\004-mixed-context\index.ts

```### 003: Agent with Direct Path Context Chips



---Tests context chips with direct `pathFromRoot`.



### Prompts Category**What it tests:**



#### 005: Different Roles, Behaviors, and Permissions- Loading chips from direct file paths

- Custom chips not in registry

Tests various role/behavior/permission combinations.- Works without registry IDs



**Tests:****Run:**

- ✅ Different role prompts (analyst, architect, guide, orchestrator)

- ✅ Different behavior prompts (concise, creative, interactive, conservative)```bash

- ✅ Different permission levels (read-only, documentation, full)npx tsx tests/cases/003-direct-path-context-chips/index.ts

- ✅ Correct tool mappings for each permission level```



**Run:**---

```bash

npx tsx .github\agent-system-minimal\tests\cases\prompts\005-role-behavior-permissions\index.ts### 004: Agent with Mixed Context

````

Tests combining ALL context types together.

---

**What it tests:**

## Creating a New Test Case

- Inline context + registry chips + direct path chips

### Step 1: Choose a Category- Proper context ordering

- All context types coexist correctly

Decide which category your test belongs to:

- `context/` - Context rendering (inline, chips, registry)**Run:**

- `prompts/` - Prompt injection (roles, behaviors, permissions)

- `generators/` - Generator functionality```bash

- `registries/` - Registry resolutionnpx tsx tests/cases/004-mixed-context/index.ts

- `templates/` - Template rendering```

- `agent-config/` - Config validation

---

### Step 2: Create Directory

### 005: Different Roles, Behaviors, and Permissions

Find the next available test number globally (e.g., if 005 is the latest, use 006):

Tests various role/behavior/permission combinations.

```bash

mkdir .github\agent-system-minimal\tests\cases\your-category\006-your-test-name**What it tests:**

```

- Different role prompts (analyst, architect, guide, orchestrator)

### Step 3: Create Agent Config- Different behavior prompts (concise, creative, interactive, conservative)

- Different permission levels (read-only, documentation, full)

Create `agent.config.ts`:- Correct tool mappings for each permission level

````typescript**Run:**

import type { AgentConfig } from '../../../../core/schema';

```bash

export const yourTestAgentConfig: AgentConfig = {npx tsx tests/cases/005-role-behavior-permissions/index.ts

  name: 'Your Test Agent',```

  version: '1.0.0',

  description: 'Description of what you are testing',---



  role: 'implementer',## Creating a New Test Case



  permissions: {### Step 1: Create Directory

    level: 'controlled'

  },```bash

  mkdir tests/cases/006-your-test-name

  behavior: {```

    profile: 'detailed'

  }### Step 2: Create Agent Config



  // Add context as neededCreate `agent.config.ts`:

};

```typescript

export default yourTestAgentConfig;import type { AgentConfig } from '../../../../core/schema/agent.schema.js';

````

export const yourTestAgent: AgentConfig = {

### Step 4: Create Test Runner name: 'Your Test Agent',

version: '1.0.0',

Create `index.ts`: description: 'Description of what you are testing',

role: 'implementer',

````typescript permissions: { level: 'controlled' },

import * as path from 'path';  behavior: { profile: 'detailed' }

import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';  // Add context as needed

import {};

  runTestSuite,

  printResults,export default yourTestAgent;

  exitWithResults,```

  assert,

  assertContains,### Step 3: Create Test Runner

  getTestCaseDir,

  getTestOutputDir,Create `index.ts`:

  cleanTestOutput,

  readFile```typescript

} from '../../../utils/index.js';import { generateChatmode } from '../../../generators/vscode-copilot/generate-chatmode.js';

import { runTestSuite, printResults, exitWithResults, assert, assertContains } from '../../utils/index.js';

// ============================================================================

// SETUPasync function testYourFeature() {

// ============================================================================  // Your test implementation

}

const TEST_CASE_NAME = 'your-category/006-your-test-name';

const CONFIG_PATH = path.join(getTestCaseDir(TEST_CASE_NAME), 'agent.config.ts');async function main() {

  const suite = await runTestSuite('Your Test Case Name', [{ name: 'Test description', fn: testYourFeature }]);

// ============================================================================

// TESTS  printResults(suite);

// ============================================================================  exitWithResults(suite);

}

async function testYourFeature() {

  cleanTestOutput(TEST_CASE_NAME);main().catch(console.error);

````

const outputDir = getTestOutputDir(TEST_CASE_NAME);

const result = await generateChatmode({### Step 4: Add Custom Context (Optional)

    agentConfig: CONFIG_PATH,

    outputDir,If testing custom context chips:

    overwrite: true

});```markdown

# Your Custom Chip

assert(result.success, 'Expected chatmode generation to succeed');

Content here...

// Add more assertions```

}

### Step 5: Run Your Test

// ============================================================================

// RUN```bash

// ============================================================================npx tsx tests/cases/006-your-test-name/index.ts

````

async function main() {

  const suite = await runTestSuite(---

    'Test Case 006: Your Test Name',

    [## Test Utilities

      { name: 'Feature description', fn: testYourFeature }

    ]The framework provides utilities in `tests/utils/`:

  );

### Assertion Helpers

  printResults(suite);

  exitWithResults(suite);```typescript

}import {

  assert, // Assert condition is true

main().catch(console.error);  assertEqual, // Assert strict equality

```  assertContains, // Assert string contains substring

  assertNotContains, // Assert string does NOT contain substring

### Step 5: Run Your Test  assertMatches, // Assert regex match

  assertThrows, // Assert function throws error

```bash  assertTruthy, // Assert truthy value

npx tsx .github\agent-system-minimal\tests\cases\your-category\006-your-test-name\index.ts  assertFalsy // Assert falsy value

```} from '../../utils/index.js';

````

---

### File Helpers

## Test Utilities

````typescript

The framework provides utilities in `tests/utils/`:import {

  readFile, // Read file contents

### Assertion Helpers (`test-runner.ts`)  fileExists, // Check if file exists

  cleanTestOutput, // Clean test output directory

```typescript  getTestOutputDir, // Get output directory path

import {  extractFrontmatter, // Extract YAML frontmatter

  assert,              // Assert condition is true  parseTools, // Parse tools from frontmatter

  assertEqual,         // Assert strict equality  parseDescription // Parse description from frontmatter

  assertContains,      // Assert string contains substring} from '../../utils/index.js';

  assertNotContains,   // Assert string does NOT contain substring```

  assertMatches,       // Assert regex match

  assertThrows,        // Assert function throws error### Test Runner

  assertTruthy,        // Assert truthy value

  assertFalsy          // Assert falsy value```typescript

} from '../../../utils/index.js';import {

```  runTest, // Run single test

  runTestSuite, // Run suite of tests

### File Helpers (`file-helpers.ts`)  printResults, // Print test results

  exitWithResults // Exit with appropriate code

```typescript} from '../../utils/index.js';

import {```

  readFile,            // Read file contents

  fileExists,          // Check if file exists---

  cleanTestOutput,     // Clean test output directory

  getTestCaseDir,      // Get test case directory path## Guidelines

  getTestOutputDir,    // Get output directory path

  extractFrontmatter,  // Extract YAML frontmatter### ✅ Best Practices

  parseTools,          // Parse tools from frontmatter

  parseDescription     // Parse description from frontmatter- Write clear, descriptive test names

} from '../../../utils/index.js';- Test one feature/behavior per test case

```- Clean up generated files between test runs

- Use the actual framework code (no mocks)

### Test Runner (`test-runner.ts`)- Assert both positive and negative cases



```typescript### 🚫 What to Avoid

import {

  runTest,             // Run single test- Don't import from `/examples` folder

  runTestSuite,        // Run suite of tests- Don't mock injectable prompts

  printResults,        // Print test results- Don't create overly complex test cases

  exitWithResults      // Exit with appropriate code- Don't skip cleanup (can interfere with other tests)

} from '../../../utils/index.js';

```### 💡 Tips



---- Start with the simplest case and build up

- Use existing test cases as reference

## Important Rules- Run all tests before committing changes

- Keep test cases focused and independent

### ✅ DO:

---

1. Write agent configs and test assertions from scratch

2. Use the framework's actual generators and prompts## Troubleshooting

3. Test one feature/behavior per test case

4. Clean up generated files between test runs (`cleanTestOutput`)### Test Fails to Run

5. Run tests from workspace root

6. Use descriptive test case names- Check that `index.ts` exists in the test case directory

7. Place tests in the appropriate category directory- Verify all imports use correct relative paths

- Ensure `agent.config.ts` exports the config

### ❌ DON'T:

### Generated Chatmode Not Found

1. Import from `/examples` folder

2. Mock or rewrite injectable prompts (`.github/agent-system-minimal/prompts/injectable`)- Check that output directory exists: `tests/cases/[case-name]/output/`

3. Create overly complex test cases- Verify generator succeeded (check `result.success`)

4. Skip cleanup (can interfere with other tests)- Use `cleanTestOutput()` before generating

5. Run tests from `.github/agent-system-minimal/` directory (paths will break!)

### Context Chip Not Loading

---

- Verify file path is correct (use absolute or from project root)

## Troubleshooting- Check registry ID exists in `registries/registry.ts`

- Ensure markdown file has `.context.md` extension

### Path Errors / Files Not Found

---

**Problem**: Paths are doubled (e.g., `.github/agent-system-minimal/.github/agent-system-minimal/...`)

**Last Updated**: November 1, 2025

**Solution**: Make sure you're running tests from the **workspace root**, not from `.github/agent-system-minimal/`.

```bash
# ❌ WRONG (from agent-system-minimal directory)
cd .github\agent-system-minimal
npx tsx tests\cases\context\001-inline-context\index.ts

# ✅ CORRECT (from workspace root)
cd C:\Users\...\ics-vcr
npx tsx .github\agent-system-minimal\tests\cases\context\001-inline-context\index.ts
````

### Test Fails to Run

- Check that `index.ts` exists in the test case directory
- Verify all imports use correct relative paths (4 levels up for generators/prompts, 3 for utils)
- Ensure `agent.config.ts` exports the config

### Generated Chatmode Not Found

- Check that output directory exists: `tests/cases/category/test-name/output/`
- Verify generator succeeded (check `result.success`)
- Use `cleanTestOutput()` before generating

### Context Chip Not Loading

- Verify file path in `pathFromRoot` includes the category folder
- Check registry ID exists in `registries/contexts/registry.ts`
- Ensure markdown file has `.context.md` extension

---

## Test Numbering

- Tests use **global sequential numbering** across all categories (001, 002, 003, ...)
- When adding a new test, use the next available number globally
- Category is part of the path, not the test number
- Example: `context/001-xxx`, `context/002-xxx`, `prompts/005-xxx`

---

**Last Updated**: January 2025
