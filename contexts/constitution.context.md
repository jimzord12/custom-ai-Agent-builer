# Project Constitution

**Purpose**: This document defines the core principles, values, and non-negotiable rules that guide all development decisions in this project.

---

## Core Mission

To build reliable, maintainable, and user-focused software that solves real problems efficiently.

---

## Guiding Principles

### 1. **User First**

- Every feature must serve a clear user need
- User experience takes priority over technical elegance
- Accessibility and inclusivity are requirements, not options

### 2. **Code Quality Over Speed**

- Write code that is easy to understand and maintain
- Prefer clarity over cleverness
- Technical debt must be acknowledged and addressed

### 3. **Test Everything**

- All new features require tests
- Breaking changes must be caught by tests
- Tests are documentation of expected behavior

### 4. **Documentation as Code**

- If it's not documented, it doesn't exist
- Keep documentation close to the code
- Update docs with every change

### 5. **Collaboration & Communication**

- Code reviews are about learning and quality, not criticism
- Ask questions when unclear
- Share knowledge freely

---

## Non-Negotiable Rules

### ✅ **Must Always Do**

1. **Security First**
   - Never commit secrets or credentials
   - Validate all user input
   - Follow security best practices

2. **Backward Compatibility**
   - Breaking changes require major version bump
   - Deprecate before removing
   - Provide migration paths

3. **Error Handling**
   - All errors must be handled gracefully
   - Users should never see raw error messages
   - Log errors for debugging

4. **Performance Awareness**
   - Profile before optimizing
   - Don't sacrifice readability for micro-optimizations
   - Monitor production performance

### ❌ **Must Never Do**

1. **Direct Production Access**
   - No direct database modifications in production
   - All changes go through proper deployment pipeline
   - Emergency fixes still require review

2. **Unreviewed Code**
   - No merging your own PRs
   - All code requires at least one review
   - Critical changes require multiple reviews

3. **Copy-Paste Programming**
   - Duplicated code must be refactored
   - If you copy more than 5 lines, extract a function
   - Shared logic belongs in shared modules

4. **Ignoring Warnings**
   - Linter warnings must be addressed
   - Type errors must be fixed, not suppressed
   - Build warnings are bugs waiting to happen

---

## Decision-Making Framework

When faced with a technical decision, consider in this order:

1. **Does it serve the user?** - If no, reconsider
2. **Is it secure?** - Security cannot be compromised
3. **Is it maintainable?** - Code lives longer than you think
4. **Is it testable?** - Untestable code is unprovable code
5. **Is it performant enough?** - Good enough is often good enough
6. **Is it documented?** - Future you (and others) will thank you

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
