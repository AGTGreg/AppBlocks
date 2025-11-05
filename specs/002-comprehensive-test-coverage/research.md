# Research: Comprehensive Test Coverage

**Feature**: 002-comprehensive-test-coverage
**Date**: 2025-11-04
**Status**: Complete

## Overview

This document captures research findings for implementing comprehensive test coverage across all AppBlocks modules. Since the testing framework (Jest + JSDOM) is already configured from feature 001-test-framework, this research focuses on test patterns, fixture strategies, and coverage approaches specific to testing a DOM manipulation library.

## Test Organization Patterns

### Decision: Module-Based Organization with Feature Grouping

**Chosen Approach**: Tests organized by module (core, directives, filters, etc.) with multiple test files per module grouped by feature.

**Structure**:
```
tests/
├── core/
│   ├── initialization.test.js  # Initialization scenarios
│   ├── rendering.test.js       # Both render engines
│   ├── data.test.js            # Data management (setData, resetState)
│   └── events.test.js          # Event handling
├── directives/
│   ├── c-if.test.js            # c-if with all operators
│   ├── c-ifnot.test.js         # c-ifnot directive
│   ├── c-for.test.js           # Loops and iterations
│   └── custom.test.js          # Custom directives
...
```

**Rationale**:
- Mirrors source code structure for easy navigation
- Each test file focuses on a specific feature area (5-15 tests per file)
- Supports independent test execution via npm scripts (test:core, test:directives, etc.)
- Allows incremental development - can complete one module at a time

**Alternatives Considered**:
- **Single file per module**: Rejected - would create huge files (15+ tests in core.test.js alone)
- **Flat structure**: Rejected - 20+ test files in one directory would be hard to navigate
- **By test type** (unit/integration): Rejected - AppBlocks tests are all integration-style (testing behavior, not isolated units)

---

## Test Naming Conventions

### Decision: Descriptive BDD-Style Test Names

**Pattern**:
```javascript
describe('ModuleName - Feature', () => {
  test('should [expected behavior] when [condition]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**Examples**:
```javascript
describe('AppBlock - Initialization', () => {
  test('should set all properties when initialized with valid config', () => {...});
  test('should log error when el is null', () => {...});
});

describe('c-if directive', () => {
  test('should remove node when condition is false', () => {...});
  test('should keep node when condition evaluates to true', () => {...});
  test('should handle comparison operators (==, ===, !=, !==)', () => {...});
});
```

**Rationale**:
- Clear what is being tested without reading test code
- BDD style matches acceptance scenarios from spec
- Jest's describe/test output is readable and creates good documentation
- "should" statements are testable and specific

**Alternatives Considered**:
- **Function names only**: Rejected - doesn't explain the scenario being tested
- **"it" instead of "test"**: Either works, but "test" is more explicit and searchable

---

## Shared Fixture Strategy

### Decision: Extend Existing Fixture Pattern with Domain-Specific Factories

**Current Fixtures** (from 001-test-framework):
```javascript
// tests/fixtures/mockData.js
export function createMockElement() { ... }
export function createMockTemplate() { ... }
export function createMockAppBlockConfig() { ... }
export function createEmptyData() { ... }
export function resetDOM() { ... }
export function createMockDirective() { ... }
```

**Extensions Needed**:
```javascript
// Add to mockData.js
export function createMockAppBlockWithData(data = {}) { ... }
export function createMockElementWithChildren(count = 3) { ... }
export function createMockArrayData(length = 3) { ... }
export function createMockCustomDirective(returnValue = true) { ... }
export function createMockCustomFilter(transform = (v) => v) { ... }
export function createMockCustomMethod(returnValue) { ... }
```

**Rationale**:
- Builds on proven pattern from existing tests
- Factory functions ensure fresh instances (no test pollution)
- Parameterized factories allow customization while maintaining DRY principle
- Centralized location makes fixtures easy to discover and reuse

**Fixture Design Principles**:
1. **Minimal by default**: Fixtures create minimal valid objects
2. **Parameterizable**: Accept options to customize as needed
3. **Independent**: Each call returns fresh instance
4. **Well-named**: Name describes what it creates, not how

**Alternatives Considered**:
- **Test builders**: Rejected - adds unnecessary complexity for simple DOM objects
- **Fixtures as constants**: Rejected - causes test pollution (shared mutable state)
- **Inline mocks**: Rejected - violates DRY, makes tests verbose

---

## Mocking Strategy for External Dependencies

### Decision: Mock at the Boundary with Jest Mocks

**External Dependencies to Mock**:
1. **Idiomorph** - Already mocked in `__mocks__/idiomorph.js`
2. **fetch API** - Mock with `jest.fn()` or `global.fetch = jest.fn()`
3. **axios** - Mock with `jest.mock('axios')` (if needed)
4. **console methods** - Spy with `jest.spyOn(console, 'error')`

**Pattern**:
```javascript
// For fetch requests
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: 'test' })
    })
  );
});

afterEach(() => {
  global.fetch.mockClear();
});

// For console logging
test('should log error with component name', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  logError(mockComp, 'test message');
  expect(spy).toHaveBeenCalledWith('test-app: test message');
  spy.mockRestore();
});
```

**Rationale**:
- Jest's built-in mocking is sufficient for our needs
- Mocking at the boundary (fetch, axios) allows testing AppBlocks' integration logic
- Console spies validate logging without polluting test output
- No additional mocking libraries needed

**Alternatives Considered**:
- **MSW (Mock Service Worker)**: Rejected - overkill for unit tests, better for E2E
- **Nock**: Rejected - adds dependency, Jest mocks sufficient
- **Real fetch calls**: Rejected - makes tests slow and flaky

---

## DOM Assertion Strategies

### Decision: Direct JSDOM Queries with Jest Matchers

**Pattern**:
```javascript
test('should render element with correct content', () => {
  const config = createMockAppBlockConfig({
    data: { message: 'Hello' }
  });
  const app = new AppBlock(config);

  // Query the DOM directly
  const element = app.el.querySelector('.message');

  // Assert using Jest matchers
  expect(element).toBeDefined();
  expect(element.textContent).toBe('Hello');
});

test('should remove node when c-if is false', () => {
  // ... setup
  app.render();

  const node = app.el.querySelector('[c-if]');
  expect(node).toBeNull(); // Node removed from DOM
});
```

**Rationale**:
- JSDOM provides real DOM API - can use querySelector, textContent, etc.
- Jest matchers (toBe, toEqual, toBeDefined, toBeNull) are clear and expressive
- Direct DOM queries match how AppBlocks actually works
- No testing library abstraction needed

**Alternatives Considered**:
- **Testing Library (@testing-library/dom)**: Rejected - adds dependency and abstraction for minimal benefit
- **Enzyme-style wrappers**: Rejected - not needed for vanilla JS library
- **String matching on innerHTML**: Rejected - brittle and hard to maintain

---

## Test Independence and Cleanup

### Decision: resetDOM() + Fresh Fixtures Pattern

**Implementation**:
```javascript
describe('Module Tests', () => {
  afterEach(() => {
    // Clean up DOM between tests
    resetDOM();
  });

  test('first test', () => {
    const config = createMockAppBlockConfig(); // Fresh fixture
    const app = new AppBlock(config);
    // Test logic
  });

  test('second test', () => {
    const config = createMockAppBlockConfig(); // Another fresh fixture
    const app = new AppBlock(config);
    // Test logic - not affected by first test
  });
});
```

**Rationale**:
- `resetDOM()` (existing fixture) clears document.body between tests
- Factory functions ensure no shared state
- Each test is truly independent - can run in any order
- Prevents cascading failures from one test affecting another

**Alternatives Considered**:
- **beforeEach setup**: Rejected - afterEach cleanup is clearer and handles failures better
- **Shared test instance**: Rejected - creates test dependencies
- **Manual cleanup in each test**: Rejected - easy to forget, error-prone

---

## Edge Case Testing Approach

### Decision: Explicit Edge Case Tests + Inline Edge Cases

**Pattern**:
```javascript
describe('c-if directive', () => {
  // Happy path tests
  test('should keep node when value is truthy', () => {...});

  // Edge cases
  describe('edge cases', () => {
    test('should remove node when value is undefined', () => {...});
    test('should remove node when value is null', () => {...});
    test('should remove node when value is 0', () => {...});
    test('should remove node when value is empty string', () => {...});
    test('should remove node when value is false', () => {...});
  });

  // Error scenarios
  describe('error handling', () => {
    test('should handle comparison with non-boolean gracefully', () => {...});
  });
});
```

**Rationale**:
- Spec identifies 15 specific edge cases to test
- Grouping edge cases makes them easy to identify and review
- Each edge case is independently testable
- Matches the "Edge Cases" section from spec

**Coverage Targets**:
- All falsy values (undefined, null, false, 0, '')
- Empty arrays/objects
- Deeply nested properties
- Non-existent properties
- Error conditions (null elements, missing config, etc.)
- Boundary conditions (empty data, no template, etc.)

---

## Custom Extension Testing Patterns

### Decision: Parameterized Factories + Integration Tests

**Custom Directive Testing**:
```javascript
describe('Custom Directives', () => {
  test('should call custom directive with correct parameters', () => {
    const mockDirective = jest.fn(() => true);
    const config = createMockAppBlockConfig({
      directives: {
        'c-custom': mockDirective
      }
    });
    const app = new AppBlock(config);

    // Verify directive called with (appInstance, node, pointers)
    expect(mockDirective).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'test-app' }),
      expect.any(Node),
      expect.any(Object)
    );
  });

  test('should keep node when custom directive returns true', () => {...});
  test('should remove node when custom directive returns false', () => {...});
});
```

**Custom Filter Testing**:
```javascript
describe('Custom Filters', () => {
  test('should apply custom filter in placeholder', () => {
    const config = createMockAppBlockConfig({
      data: { price: 19.5 },
      filters: {
        currency: (app, value) => `$${parseFloat(value).toFixed(2)}`
      }
    });
    // Setup template with {data.price|currency}
    // Assert output is "$19.50"
  });
});
```

**Rationale**:
- Tests verify the extension SYSTEM works, not specific user extensions
- Examples from spec (c-greeting, getFullName, currency) serve as test cases
- Mock functions verify correct parameter passing
- Integration tests verify extensions work in templates

---

## Test Data Realism

### Decision: Minimal Synthetic Data with Semantic Names

**Pattern**:
```javascript
// Good - semantic and minimal
const user = { name: 'Alice', age: 30 };
const items = [
  { id: 1, title: 'First' },
  { id: 2, title: 'Second' }
];

// Avoid - overly realistic adds noise
const user = {
  name: 'John Richardson Smith',
  email: 'john.smith@example-domain.com',
  address: '123 Main Street, Apartment 4B...'
};
```

**Rationale**:
- Minimal data keeps tests readable and fast
- Semantic names (Alice, Bob, First, Second) make test intent clear
- Avoid realistic data that adds complexity without value
- Test data should highlight what's being tested, not obscure it

---

## Coverage Measurement

### Decision: Qualitative Coverage via Spec Mapping (No Coverage Tools Required)

**Approach**:
- Map each spec requirement (FR-001 through FR-051) to test(s)
- Track in tasks.md which requirements have tests
- Success criteria define minimum test counts per module
- All 80+ tests passing = adequate coverage for current needs

**Rationale**:
- Spec already defines comprehensive coverage targets
- Line coverage metrics can be misleading (high coverage ≠ good tests)
- Focus on behavior coverage (does it meet requirements?) not line coverage
- Constitution says "test coverage reporting is not required"

**Future Consideration**:
- Can add `jest --coverage` later if needed for CI/CD
- Current focus is getting comprehensive tests written first

---

## Test Execution Strategy

### Decision: Parallel Execution with Module Isolation

**Configuration** (existing in jest.config.js):
```javascript
{
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  maxWorkers: '50%' // Run tests in parallel for speed
}
```

**Module Commands** (existing in package.json):
```json
{
  "test": "jest",
  "test:core": "jest tests/core",
  "test:directives": "jest tests/directives",
  "test:filters": "jest tests/filters",
  ...
}
```

**Rationale**:
- Jest runs tests in parallel by default - faster execution
- Module commands allow focused testing during development
- Independent tests (via resetDOM()) make parallel execution safe
- Existing setup already optimized

---

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| **Organization** | Module-based with feature grouping | Mirrors source structure, easy navigation |
| **Naming** | BDD-style "should...when..." | Clear, testable, documentation-quality |
| **Fixtures** | Extend existing factory pattern | DRY, no test pollution, easy reuse |
| **Mocking** | Jest built-in mocks | No extra dependencies, sufficient for needs |
| **DOM Assertions** | Direct JSDOM queries + Jest matchers | Simple, matches AppBlocks API usage |
| **Independence** | resetDOM() + fresh fixtures | True test isolation, any execution order |
| **Edge Cases** | Explicit edge case test groups | Maps to spec requirements, easy to verify |
| **Custom Extensions** | Parameterized factories + integration | Tests the system, not specific extensions |
| **Test Data** | Minimal semantic data | Readable, fast, focused on behavior |
| **Coverage** | Qualitative spec mapping | Behavior-focused, not line-focused |
| **Execution** | Parallel with module isolation | Fast feedback, incremental development |

---

## Next Steps

All research questions resolved. Proceeding to Phase 1: Design & Data Model.

**Key Deliverables for Phase 1**:
1. `data-model.md` - Test data structures and fixtures specification
2. `quickstart.md` - Developer guide for running and writing tests
3. Update `.github/copilot-instructions.md` with test patterns

