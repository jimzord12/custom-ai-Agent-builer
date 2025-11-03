# Code Style Guide

**Purpose**: Consistent code formatting and styling conventions.

---

## General Principles

### 1. **Readability First**

Code is read more often than written. Prioritize clarity over cleverness.

### 2. **Consistency Over Preference**

Follow project conventions even if you personally prefer something different.

### 3. **Automated Where Possible**

Use formatters and linters to enforce style automatically.

---

## File Organization

### File Naming

- **TypeScript/JavaScript**: `kebab-case.ts`, `user-service.ts`
- **React Components**: `PascalCase.tsx`, `UserProfile.tsx`
- **Test Files**: Match source file + `.test` or `.spec`
- **Type Definitions**: `*.types.ts` or `*.d.ts`
- **Constants**: `UPPER_SNAKE_CASE` within files, `kebab-case.ts` for file

### Directory Structure

```
src/
├── components/       # UI components
├── services/         # Business logic
├── utils/            # Pure utility functions
├── types/            # Type definitions
├── constants/        # App constants
├── hooks/            # Custom hooks (React)
└── __tests__/        # Test files
```

---

## Naming Conventions

### Variables & Functions

```typescript
// ✅ Good - camelCase for variables and functions
const userName = 'John';
const maxRetries = 3;

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad
const UserName = 'John'; // Wrong case
const MAX_RETRIES = 3; // This is a constant, not a variable
function CalculateTotal() {} // Wrong case
```

### Constants

```typescript
// ✅ Good - UPPER_SNAKE_CASE for true constants
const MAX_UPLOAD_SIZE = 5242880; // 5MB
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 30000;

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
```

### Classes & Types

```typescript
// ✅ Good - PascalCase for classes, interfaces, types
class UserService {}
interface UserProfile {}
type UserId = string;

// ❌ Bad
class userService {}
interface user_profile {}
type userId = string;
```

### Boolean Variables

Prefix with `is`, `has`, `should`, `can`:

```typescript
// ✅ Good
const isActive = true;
const hasPermission = false;
const shouldRetry = true;
const canEdit = false;

// ❌ Bad
const active = true;
const permission = false;
```

### Private Members

Use `#` or prefix with `_`:

```typescript
class User {
  #password: string; // Private field
  private _id: string; // Also acceptable

  public name: string; // Public (explicit)
}
```

---

## Code Formatting

### Indentation

- **2 spaces** for TypeScript/JavaScript
- **No tabs**
- Configure in `.editorconfig`:

```ini
[*.{ts,js,tsx,jsx}]
indent_style = space
indent_size = 2
```

### Line Length

- **Max 100 characters**
- Break long lines for readability

```typescript
// ✅ Good
const message =
  'This is a very long message that exceeds the line length limit ' +
  'so we break it across multiple lines for better readability';

// ❌ Bad
const message =
  'This is a very long message that exceeds the line length limit so we keep it on one line which is hard to read';
```

### Spacing

```typescript
// ✅ Good
function add(a: number, b: number): number {
  return a + b;
}

const obj = { name: 'John', age: 30 };
const arr = [1, 2, 3];

if (condition) {
  doSomething();
}

// ❌ Bad
function add(a: number, b: number): number {
  return a + b;
}

const obj = { name: 'John', age: 30 };
const arr = [1, 2, 3];

if (condition) {
  doSomething();
}
```

### Semicolons

**Always use semicolons** (or configure Prettier to add them):

```typescript
// ✅ Good
const name = 'John';
const age = 30;

function greet() {
  return 'Hello';
}

// ❌ Bad
const name = 'John';
const age = 30;

function greet() {
  return 'Hello';
}
```

### Quotes

**Single quotes** for strings, **backticks** for templates:

```typescript
// ✅ Good
const name = 'John';
const greeting = `Hello, ${name}!`;

// ❌ Bad
const name = 'John';
const greeting = 'Hello, ' + name + '!';
```

---

## TypeScript Specific

### Type Annotations

Be explicit with types:

```typescript
// ✅ Good
function getUser(id: string): User | null {
  return database.findUser(id);
}

const users: User[] = [];
const config: AppConfig = loadConfig();

// ⚠️ Acceptable when type is obvious
const count = 5; // number is inferred
const name = 'John'; // string is inferred
```

### Interfaces vs Types

- **Interfaces**: For object shapes, especially public APIs
- **Types**: For unions, intersections, primitives

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

type UserId = string;
type Status = 'active' | 'inactive';
type UserWithRole = User & { role: string };

// ❌ Avoid
type User = {
  // Use interface instead
  id: string;
  name: string;
};
```

### Avoid `any`

```typescript
// ❌ Bad
function process(data: any) {
  return data.value;
}

// ✅ Good
function process(data: unknown) {
  if (isValidData(data)) {
    return data.value;
  }
  throw new Error('Invalid data');
}

// ✅ Better with generics
function process<T extends { value: string }>(data: T) {
  return data.value;
}
```

---

## Comments & Documentation

### When to Comment

```typescript
// ✅ Good - Explain WHY, not WHAT
// Retry 3 times because API has transient failures
const MAX_RETRIES = 3;

// Cache for 5 minutes to reduce database load
const CACHE_TTL = 300000;

// ❌ Bad - Obvious comments
// Set the name to John
const name = 'John';

// Add a and b
function add(a: number, b: number) {
  return a + b;
}
```

### JSDoc for Public APIs

````typescript
/**
 * Calculates the total price including tax
 * @param price - Base price before tax
 * @param taxRate - Tax rate as decimal (e.g., 0.2 for 20%)
 * @returns Total price with tax applied
 * @throws {ValidationError} If price is negative
 *
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.2);
 * // Returns: 120
 * ```
 */
function calculateTotal(price: number, taxRate: number): number {
  if (price < 0) {
    throw new ValidationError('Price cannot be negative');
  }
  return price * (1 + taxRate);
}
````

### TODO Comments

```typescript
// TODO: Implement caching (ticket: ABC-123)
// FIXME: Handle edge case when user is null
// HACK: Temporary workaround until API is updated
// NOTE: This must match the API contract in v2
```

---

## Imports Organization

```typescript
// 1. External dependencies
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal modules (absolute paths)
import { UserService } from '@/services/user-service';
import { Button } from '@/components/Button';

// 3. Types
import type { User, UserRole } from '@/types/user';

// 4. Relative imports
import { helper } from './utils';
import styles from './styles.module.css';
```

---

## Error Handling

```typescript
// ✅ Good - Specific error types
try {
  await processPayment(order);
} catch (error) {
  if (error instanceof PaymentError) {
    logger.error('Payment failed', { orderId: order.id, error });
    throw new UserFacingError('Payment processing failed');
  }
  throw error;
}

// ❌ Bad - Silent failures
try {
  await processPayment(order);
} catch (error) {
  // Do nothing
}

// ❌ Bad - Catching but not handling
try {
  await processPayment(order);
} catch (error) {
  console.log(error);
}
```

---

## Functions

### Function Length

- **Max 50 lines** per function
- If longer, break into smaller functions
- Each function should do ONE thing

### Parameters

- **Max 3-4 parameters**
- Use object parameter for more:

```typescript
// ✅ Good
interface CreateUserParams {
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

function createUser(params: CreateUserParams) {
  // ...
}

// ❌ Bad
function createUser(name: string, email: string, role: UserRole, department: string) {
  // ...
}
```

### Return Early

```typescript
// ✅ Good
function getDiscount(user: User): number {
  if (!user.isActive) return 0;
  if (user.isPremium) return 0.2;
  if (user.loyaltyYears > 5) return 0.1;
  return 0.05;
}

// ❌ Bad - nested ifs
function getDiscount(user: User): number {
  if (user.isActive) {
    if (user.isPremium) {
      return 0.2;
    } else {
      if (user.loyaltyYears > 5) {
        return 0.1;
      } else {
        return 0.05;
      }
    }
  }
  return 0;
}
```

---

## Tooling Configuration

### ESLint

```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Prettier

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
