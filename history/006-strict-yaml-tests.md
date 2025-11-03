# 006 - Stricter tests using YAML parser

- **Date:** 2025-11-03
- **Author:** automated change (developer assistant)
- **Related:** `tests/cases/generators/001-generate-chatmode`, `tests/cases/generators/002-context-chip-injection`, `brainstorming/MVP_TODOS.md`

## Summary

I updated the generator tests to use the `yaml` package for strict frontmatter parsing and validation. This makes the tests more robust and stricter about the expected chatmode structure (YAML frontmatter fields and types).

## Changes

- Installed `yaml` package (user ran `npm i yaml` in the workspace).
- Updated tests to parse YAML frontmatter instead of doing string inclusion checks:
  - `tests/cases/generators/001-generate-chatmode/index.ts`
  - `tests/cases/generators/002-context-chip-injection/index.ts`
- Updated the `brainstorming/MVP_TODOS.md` file to mark testing items (6.1–6.8) complete and bumped the "Last Updated" date.

## Why

Using a proper YAML parser avoids brittle string matching and gives more precise assertions:

- Ensures `description` is exactly what the agent config expects
- Ensures `tools` is an array and contains the tools mapped from permissions

## Test run

Command executed:

```pwsh
npx tsx tests/cases/generators/001-generate-chatmode/index.ts
npx tsx tests/cases/generators/002-context-chip-injection/index.ts
```

Results: both tests passed locally (exit code 0).

## Next steps

- Optionally convert tests into a formal test runner (Jest/Mocha) for richer reporting.
- Add these tests to CI so the YAML frontmatter validation runs on PRs.
