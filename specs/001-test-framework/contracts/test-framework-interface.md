# Testing Framework Contracts

**Date**: 2025-11-04
**Feature**: Testing Framework Setup

## Overview

This directory would typically contain API contracts for service endpoints. However, the testing framework is infrastructure-focused and doesn't expose external APIs or service contracts. Instead, this document describes the "contracts" or interfaces that the testing framework guarantees.

## Test Framework Interface Contract

### Command Line Interface

#### Run All Tests

**Command**: `npm test`

**Contract**:
- **Input**: None (executes all test files matching `**/tests/**/*.test.js`)
- **Output**:
  - Test results printed to console
  - Summary: total tests, passed, failed
  - Details for failed tests (error messages, stack traces)
- **Exit Code**:
  - `0` if all tests pass
  - Non-zero if any tests fail
- **Performance**: Completes in <10 seconds for initial test set

---

#### Run Specific Test Group

**Command**: `npm run test:<group>` (e.g., `npm run test:core`)

**Contract**:
- **Input**: Group name via npm script
- **Output**:
  - Test results for specified group only
  - Clear indication of which group was tested
- **Exit Code**:
  - `0` if all tests in group pass
  - Non-zero if any tests in group fail
- **Performance**: Completes in <3 seconds

---

#### Watch Mode

**Command**: `npm run test:watch`

**Contract**:
- **Behavior**: Continuously watches for file changes and re-runs related tests
- **Output**: Real-time test results on each change
- **Interaction**: User can press keys to filter tests, quit, etc.

---

### Fixture Module Contract

**Module**: `tests/fixtures/mockData.js`

#### createMockElement()

**Signature**: `createMockElement() => HTMLDivElement`

**Contract**:
- **Returns**: Fresh DOM div element with id='test-app'
- **Guarantees**:
  - New instance on each call (not shared reference)
  - Valid JSDOM element
  - Empty innerHTML by default
- **Usage**: Safe to mutate without affecting other tests

---

#### createMockTemplate(htmlString?)

**Signature**: `createMockTemplate(htmlString?: string) => HTMLTemplateElement`

**Contract**:
- **Parameters**:
  - `htmlString` (optional): Custom template HTML content
- **Returns**: Fresh template element with DocumentFragment content
- **Default Content**: `<p>{data.message}</p>`
- **Guarantees**:
  - New instance on each call
  - Valid JSDOM template element
  - Content accessible via `.content` property

---

#### createMockAppBlockConfig(overrides?)

**Signature**: `createMockAppBlockConfig(overrides?: object) => AppBlockConfig`

**Contract**:
- **Parameters**:
  - `overrides` (optional): Object with properties to override defaults
- **Returns**: Complete AppBlock configuration object
- **Default Properties**:
  ```javascript
  {
    el: HTMLDivElement,
    template: HTMLTemplateElement,
    name: 'test-app',
    data: { message: string, count: number, items: array },
    methods: {},
    directives: {},
    filters: {},
    events: {}
  }
  ```
- **Guarantees**:
  - Fresh DOM elements on each call
  - Deep copy of data objects (no shared state)
  - Overrides merged with defaults
  - Valid config for AppBlock constructor

---

#### createMockData()

**Signature**: `createMockData() => object`

**Contract**:
- **Returns**: Sample data object with realistic test values
- **Includes**:
  - Primitive types (string, number, boolean)
  - Collections (arrays)
  - Nested objects
  - Edge cases (empty string, null, undefined, 0, false)
- **Guarantees**: New object instance on each call

---

### Test File Structure Contract

#### File Naming

**Pattern**: `<descriptive-name>.test.js`

**Examples**:
- `initialization.test.js`
- `data-binding.test.js`
- `custom-directives.test.js`

**Contract**:
- Must end with `.test.js` to be discovered by Jest
- Must be in a subdirectory of `tests/`
- Automatically included in test runs (zero configuration)

---

#### Test Organization

**Structure**:
```javascript
import AppBlock from '../../src/<module>';
import { fixtures } from '../fixtures/mockData';

describe('<Module> - <Feature>', () => {
  test('should <expected behavior>', () => {
    // Arrange
    const config = createMockAppBlockConfig();

    // Act
    const result = new AppBlock(config);

    // Assert
    expect(result).toBeDefined();
  });
});
```

**Contract**:
- `describe` blocks group related tests
- `test` or `it` defines individual test cases
- Arrange-Act-Assert pattern for clarity
- Import fixtures from `../fixtures/mockData`
- Import AppBlocks code from `../../src/`

---

## Test Group Contracts

### Core Group (`tests/core/`)

**Responsibility**: Tests for `src/core.js`

**Includes**:
- AppBlock initialization
- Data management (setData, data updates)
- Rendering (prepareTmpDom, render methods)
- State management (loading, error, success)
- Lifecycle hooks (beforeRender, afterRender)

**Verification Tests** (initial):
- Successful initialization with valid config
- Handling empty/undefined data
- Handling missing template
- Handling missing/null element

---

### Directives Group (`tests/directives/`)

**Responsibility**: Tests for `src/directives.js`

**Includes** (future):
- c-if directive behavior
- c-ifnot directive behavior
- c-for loops and iteration
- Custom directives

**Initial State**: Empty (ready for future tests)

---

### Filters Group (`tests/filters/`)

**Responsibility**: Tests for `src/filters.js`

**Includes** (future):
- Custom filter application
- Filter chaining
- asHTML filter

**Initial State**: Empty (ready for future tests)

---

### Utils Group (`tests/utils/`)

**Responsibility**: Tests for `src/utils.js`

**Includes** (future):
- getProp function
- Helper functions (getNode, getNodes, appendIn, prependIn)

**Initial State**: Empty (ready for future tests)

---

### Processing Group (`tests/processing/`)

**Responsibility**: Tests for `src/processing.js`

**Includes** (future):
- processNode recursive evaluation
- Directive processing
- Attribute updates

**Initial State**: Empty (ready for future tests)

---

### Requests Group (`tests/requests/`)

**Responsibility**: Tests for `src/requests.js`

**Includes** (future):
- fetchRequest behavior
- axiosRequest behavior
- Request state management

**Initial State**: Empty (ready for future tests)

---

## Configuration Contracts

### jest.config.js

**Contract**:
```javascript
module.exports = {
  testEnvironment: 'jsdom',           // DOM simulation enabled
  testMatch: ['**/tests/**/*.test.js'], // Auto-discover pattern
  collectCoverageFrom: ['src/**/*.js'], // Coverage scope (if enabled)
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: true                       // Detailed output
};
```

**Guarantees**:
- All files matching `**/tests/**/*.test.js` are executed
- JSDOM environment available in all tests
- Coverage collection ready (but not run by default)

---

### package.json Scripts

**Contract**:
```json
{
  "scripts": {
    "test": "jest",                          // Run all tests
    "test:watch": "jest --watch",            // Watch mode
    "test:coverage": "jest --coverage",      // With coverage
    "test:core": "jest tests/core",          // Core group only
    "test:directives": "jest tests/directives",
    "test:filters": "jest tests/filters",
    "test:utils": "jest tests/utils",
    "test:processing": "jest tests/processing",
    "test:requests": "jest tests/requests"
  }
}
```

**Guarantees**:
- All scripts work from project root
- Group-specific scripts execute only that group's tests
- Exit codes properly propagated for CI/CD integration

---

## Extensibility Contract

### Adding New Test Files

**Contract**:
1. Create file in appropriate `tests/<group>/` directory
2. Name file `<description>.test.js`
3. File automatically discovered and executed
4. **Zero configuration changes required** (FR-008)

**Example**:
```bash
# Add new test file
touch tests/filters/custom-filters.test.js

# Runs automatically with:
npm test
# Or specifically:
npm run test:filters
```

---

### Adding New Test Groups

**Contract**:
1. Create new directory under `tests/` (e.g., `tests/newfeature/`)
2. Add test files with `.test.js` suffix
3. Files automatically discovered by Jest
4. Optionally add npm script for convenience

**Example**:
```bash
# Add new group
mkdir tests/events
touch tests/events/event-handling.test.js

# Auto-discovered by:
npm test

# Add convenience script to package.json:
"test:events": "jest tests/events"
```

---

### Adding New Fixtures

**Contract**:
1. Add factory function to `tests/fixtures/mockData.js`
2. Export the function
3. Import in test files as needed
4. **No configuration changes required**

**Example**:
```javascript
// In tests/fixtures/mockData.js
export const createMockDirective = (name, handler) => ({
  name,
  handler: handler || ((comp, node) => true)
});

// In tests/directives/custom.test.js
import { createMockDirective } from '../fixtures/mockData';
```

---

## Performance Contracts

### Execution Speed

**All Tests**:
- Target: <10 seconds (SC-001)
- Initial 3-4 tests: <1 second expected

**Single Group**:
- Target: <3 seconds (SC-002)
- Enables rapid feedback during development

**Factors**:
- JSDOM startup: ~100-200ms
- Individual test execution: <50ms each
- Parallel execution: Jest runs groups concurrently

---

## Error Reporting Contract

### Failed Test Output

**Contract**:
```
FAIL tests/core/initialization.test.js
  AppBlock Initialization
    ✕ initializes correctly with valid config (Xms)

  ● AppBlock Initialization › initializes correctly with valid config

    expect(received).toBeDefined()

    Expected value to be defined, but received:
      undefined

      at Object.<anonymous> (tests/core/initialization.test.js:15:21)

Test Suites: 1 failed, 0 passed, 1 total
Tests:       1 failed, 0 passed, 1 total
```

**Guarantees**:
- Clear indication of which test failed
- Expected vs actual values
- File and line number reference
- Stack trace for debugging
- Summary counts (failed/passed)

---

## Summary

This testing framework provides guaranteed contracts for:
- **Command execution** (all tests, specific groups, watch mode)
- **Fixture factories** (DOM elements, configs, data)
- **Test organization** (6 groups matching modules)
- **Auto-discovery** (zero configuration for new tests)
- **Performance** (<10s all, <3s group)
- **Error reporting** (clear, actionable output)
- **Extensibility** (add tests/groups/fixtures without config changes)

All contracts support constitutional requirements for simplicity, test-first development, and browser compatibility.
