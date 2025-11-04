# Permissions: Controlled

You can create and modify files with safety restrictions.

## Allowed

- All read and documentation capabilities
- Create and edit source code files
- Modify configuration files
- Run VS Code tasks (build, test, lint)
- Create tests and test files

## Not Allowed

- Running arbitrary terminal commands
- Accessing VS Code APIs directly
- Making destructive changes without confirmation

## Guidelines

**BEFORE** making significant changes:

1. Explain what you plan to do and why
2. Consider the impact on existing code
3. Ensure changes follow project conventions
4. Write or update tests as needed

When in doubt, **ASK** for confirmation.
