# Testing Standards

**Purpose**: Comprehensive testing guidelines and best practices.

---

## Testing Philosophy

### Core Principles

1. **Tests are First-Class Code** - Maintain them with the same care as production code
2. **Fast Feedback** - Tests should run quickly and fail clearly
3. **Confidence over Coverage** - 100% coverage means nothing if tests are poor quality
4. **Test Behavior, Not Implementation** - Focus on what code does, not how

---

## Test Organization

### Directory Structure

```
src/
  components/
    Button.ts
    Button.test.ts
  utils/
    math.ts
    math.test.ts
tests/
  integration/
  e2e/
```

### Naming Conventions

- Test files: `*.test.ts` or `*.spec.ts`
- Test suites: Describe the unit being tested
- Test cases: Describe the behavior being verified

**Example:**

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {
      // test
    });

    it('should throw error when email is invalid', () => {
      // test
    });
  });
});
```

---

## Test Types

### 1. Unit Tests

**Purpose**: Test individual functions/methods in isolation

**Characteristics:**

- Fast (milliseconds)
- No external dependencies
- Mock/stub dependencies
- High volume (70% of tests)

**Example:**

```typescript
describe('calculateTotal', () => {
  it('should sum array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### 2. Integration Tests

**Purpose**: Test interactions between components

**Characteristics:**

- Moderate speed
- May use real dependencies (databases, APIs)
- Test realistic scenarios
- Medium volume (20% of tests)

**Example:**

```typescript
describe('UserController Integration', () => {
  it('should create user and save to database', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const response = await request(app).post('/users').send(userData);

    expect(response.status).toBe(201);

    const user = await database.users.findById(response.body.id);
    expect(user.name).toBe('John');
  });
});
```

### 3. End-to-End Tests

**Purpose**: Test complete user workflows

**Characteristics:**

- Slow (seconds to minutes)
- Full stack integration
- Simulates real user behavior
- Low volume (10% of tests)

**Example:**

```typescript
describe('User Registration Flow', () => {
  it('should allow user to register and login', async () => {
    await page.goto('/register');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'SecurePass123');
    await page.click('#submit');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('.welcome')).toContainText('Welcome');
  });
});
```

---

## Test Quality Guidelines

### AAA Pattern

Structure tests with Arrange, Act, Assert:

```typescript
it('should calculate discount correctly', () => {
  // Arrange
  const price = 100;
  const discountPercent = 20;

  // Act
  const finalPrice = applyDiscount(price, discountPercent);

  // Assert
  expect(finalPrice).toBe(80);
});
```

### One Assertion Per Test (When Possible)

```typescript
// ✅ Good - focused test
it('should return user name', () => {
  expect(user.getName()).toBe('John');
});

it('should return user email', () => {
  expect(user.getEmail()).toBe('john@example.com');
});

// ⚠️ Acceptable for related assertions
it('should return user full profile', () => {
  const profile = user.getProfile();
  expect(profile.name).toBe('John');
  expect(profile.email).toBe('john@example.com');
});
```

### Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => {});
it('test1', () => {});

// ✅ Good
it('should return empty array when no users exist', () => {});
it('should throw ValidationError when email format is invalid', () => {});
it('should cache results for 5 minutes after first request', () => {});
```

---

## Mocking & Stubbing

### When to Mock

- External APIs
- Databases
- File system operations
- Time-dependent operations
- Random number generation

### Mock Example

```typescript
// Mock external API
jest.mock('../services/PaymentAPI', () => ({
  processPayment: jest.fn().mockResolvedValue({ success: true }),
}));

it('should process payment successfully', async () => {
  const result = await checkout.processOrder(order);

  expect(PaymentAPI.processPayment).toHaveBeenCalledWith({
    amount: 100,
    currency: 'USD',
  });
  expect(result.status).toBe('completed');
});
```

---

## Test Data Management

### Use Factories/Builders

```typescript
// test/factories/user.factory.ts
export const createTestUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
});

// In tests
const admin = createTestUser({ role: 'admin' });
const premium = createTestUser({ subscription: 'premium' });
```

### Avoid Magic Numbers

```typescript
// ❌ Bad
expect(users.length).toBe(3);

// ✅ Good
const EXPECTED_USER_COUNT = 3;
expect(users.length).toBe(EXPECTED_USER_COUNT);
```

---

## Testing Best Practices

### ✅ DO

- Test edge cases and error conditions
- Test public APIs, not private methods
- Keep tests independent and isolated
- Clean up after tests (database, files, etc.)
- Use descriptive variable names
- Write tests first (TDD) when possible

### ❌ DON'T

- Test framework internals
- Have tests depend on execution order
- Use sleep/wait in tests (use proper async handling)
- Duplicate test logic (use helpers/utilities)
- Ignore flaky tests (fix or remove them)

---

## Coverage Guidelines

### Minimum Coverage Targets

- **Overall**: 80%
- **Critical paths**: 100%
- **Utilities**: 90%
- **UI components**: 70%

### Coverage is Not Everything

```typescript
// 100% coverage but poor test
it('should work', () => {
  myFunction(); // no assertions!
});

// Lower coverage but better test
it('should calculate correct total with tax', () => {
  expect(calculateTotal(100, 0.2)).toBe(120);
});
```

---

## Continuous Integration

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

### CI Pipeline

1. Run linter
2. Run unit tests
3. Run integration tests
4. Check coverage thresholds
5. Run E2E tests (on main branch)

---

## Tools & Frameworks

### Recommended Stack

- **Unit/Integration**: Jest, Vitest
- **E2E**: Playwright, Cypress
- **Mocking**: Jest mocks, MSW
- **Coverage**: Istanbul (built into Jest/Vitest)
- **Test Data**: Faker.js, Factory functions

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
