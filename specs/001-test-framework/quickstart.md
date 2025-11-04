# Quickstart: Testing Framework Setup

**Date**: 2025-11-04
**Feature**: Testing Framework
**Goal**: Get the testing framework running in under 15 minutes

## Prerequisites

- Node.js and npm installed
- AppBlocks repository cloned
- On branch `001-test-framework`

## Step 1: Install Dependencies (2 minutes)

### Install Jest and Babel support

```bash
npm install --save-dev jest babel-jest
```

**Expected output**:
```
added 150 packages in 30s
```

**Verify installation**:
```bash
npx jest --version
```

Should show Jest version (e.g., `29.7.0`)

---

## Step 2: Create Jest Configuration (1 minute)

### Create `jest.config.js` in project root

```bash
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
};
EOF
```

**Verify**: File created at `./jest.config.js`

---

## Step 3: Add Test Scripts to package.json (2 minutes)

### Update package.json scripts section

Add these scripts to the `"scripts"` object in `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:core": "jest tests/core",
    "test:directives": "jest tests/directives",
    "test:filters": "jest tests/filters",
    "test:utils": "jest tests/utils",
    "test:processing": "jest tests/processing",
    "test:requests": "jest tests/requests"
  }
}
```

**Note**: Merge with existing scripts if any. Don't replace the entire object.

---

## Step 4: Create Test Directory Structure (1 minute)

### Create all test group directories

```bash
mkdir -p tests/{fixtures,core,directives,filters,utils,processing,requests}
```

### Add .gitkeep files to empty directories

```bash
touch tests/directives/.gitkeep
touch tests/filters/.gitkeep
touch tests/utils/.gitkeep
touch tests/processing/.gitkeep
touch tests/requests/.gitkeep
```

**Verify structure**:
```bash
tree tests/ -L 1
```

Should show:
```
tests/
├── core/
├── directives/
├── filters/
├── fixtures/
├── processing/
├── requests/
└── utils/
```

---

## Step 5: Create Shared Test Fixtures (3 minutes)

### Create `tests/fixtures/mockData.js`

```javascript
/**
 * Shared test fixtures for AppBlocks tests
 * All functions return fresh instances to prevent test pollution
 */

/**
 * Creates a fresh mock DOM element for AppBlock container
 */
export const createMockElement = () => {
  const el = document.createElement('div');
  el.id = 'test-app';
  return el;
};

/**
 * Creates a fresh mock template element
 * @param {string} htmlString - Optional custom template HTML
 */
export const createMockTemplate = (htmlString = '<p>{data.message}</p>') => {
  const template = document.createElement('template');
  template.innerHTML = htmlString;
  return template;
};

/**
 * Creates an empty template element
 */
export const createEmptyTemplate = () => {
  return createMockTemplate('');
};

/**
 * Creates a complete AppBlock configuration object
 * @param {object} overrides - Optional properties to override defaults
 */
export const createMockAppBlockConfig = (overrides = {}) => {
  const defaults = {
    el: createMockElement(),
    template: createMockTemplate(),
    name: 'test-app',
    data: {
      message: 'Test message',
      count: 0,
      items: ['item1', 'item2', 'item3']
    },
    methods: {},
    directives: {},
    filters: {},
    events: {}
  };

  return { ...defaults, ...overrides };
};

/**
 * Creates sample data object with realistic test values
 */
export const createMockData = () => ({
  // Primitive types
  message: 'Hello world',
  count: 42,
  isActive: true,

  // Collections
  items: ['item1', 'item2', 'item3'],

  // Nested objects
  user: {
    name: 'Test User',
    email: 'test@example.com'
  },

  // Edge cases
  emptyString: '',
  nullValue: null,
  undefinedValue: undefined,
  zero: 0,
  falseValue: false
});

/**
 * Creates an empty data object
 */
export const createEmptyData = () => ({});
```

**Verify**: File created at `tests/fixtures/mockData.js`

---

## Step 6: Create Verification Tests (4 minutes)

### Create `tests/core/initialization.test.js`

```javascript
/**
 * Verification tests for AppBlock initialization
 * These tests validate that the testing framework works correctly
 */

import { AppBlock } from '../../src/core.js';
import {
  createMockElement,
  createMockTemplate,
  createMockAppBlockConfig,
  createEmptyData
} from '../fixtures/mockData.js';

describe('AppBlock Initialization', () => {

  test('initializes correctly with valid config', () => {
    // Arrange
    const config = createMockAppBlockConfig();

    // Act
    const app = new AppBlock(config);

    // Assert
    expect(app).toBeDefined();
    expect(app.el).toBe(config.el);
    expect(app.data).toEqual(config.data);
    expect(app.name).toBe('test-app');
  });

  test('handles empty data gracefully', () => {
    // Arrange
    const config = createMockAppBlockConfig({
      data: createEmptyData()
    });

    // Act
    const app = new AppBlock(config);

    // Assert
    expect(app).toBeDefined();
    expect(app.data).toEqual({});
  });

  test('handles missing template by using el content', () => {
    // Arrange
    const el = createMockElement();
    el.innerHTML = '<p>Inline content</p>';
    const config = createMockAppBlockConfig({
      el,
      template: undefined
    });

    // Act
    const app = new AppBlock(config);

    // Assert
    expect(app).toBeDefined();
    expect(app.template).toBeDefined();
    // Template should have been created from el's content
  });

  test('handles missing element with error', () => {
    // Arrange
    const config = createMockAppBlockConfig({
      el: null
    });

    // Act
    const app = new AppBlock(config);

    // Assert
    // AppBlock should fail initialization or log error
    // Based on core.js code, it returns early/false
    expect(app).toBeFalsy();
  });

});
```

**Verify**: File created at `tests/core/initialization.test.js`

---

## Step 7: Run Tests (1 minute)

### Run all tests

```bash
npm test
```

**Expected output**:
```
PASS tests/core/initialization.test.js
  AppBlock Initialization
    ✓ initializes correctly with valid config (Xms)
    ✓ handles empty data gracefully (Xms)
    ✓ handles missing template by using el content (Xms)
    ✓ handles missing element with error (Xms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        X.XXXs
```

### Run specific group

```bash
npm run test:core
```

**Expected**: Same output (only core tests exist currently)

---

## Step 8: Verify Auto-Discovery (1 minute)

### Create a simple test to verify auto-discovery

```bash
cat > tests/core/example.test.js << 'EOF'
test('framework auto-discovers this test', () => {
  expect(true).toBe(true);
});
EOF
```

### Run tests again

```bash
npm test
```

**Expected**: Now shows 5 passed tests (4 initialization + 1 example)

### Clean up example test

```bash
rm tests/core/example.test.js
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] `npm test` runs successfully
- [ ] All 4 initialization tests pass
- [ ] Tests complete in <10 seconds
- [ ] `npm run test:core` runs only core tests
- [ ] Test structure mirrors source code (tests/core → src/core.js)
- [ ] Shared fixtures in tests/fixtures/mockData.js work
- [ ] New test files auto-discovered without configuration

---

## Next Steps

### Add More Tests

1. Create new `.test.js` file in appropriate group directory
2. Import fixtures from `../fixtures/mockData.js`
3. Import AppBlocks code from `../../src/`
4. Write tests using `describe()` and `test()`
5. Run with `npm test` or `npm run test:<group>`

**Example** (future directive test):

```bash
# Create new test file
touch tests/directives/c-if.test.js
```

```javascript
// tests/directives/c-if.test.js
import { directives } from '../../src/directives.js';
import { createMockElement } from '../fixtures/mockData.js';

describe('c-if Directive', () => {
  test('shows element when condition is true', () => {
    // Test implementation
  });
});
```

### Add More Fixtures

Edit `tests/fixtures/mockData.js` to add new factory functions:

```javascript
export const createMockDirective = (name, handler) => ({
  name,
  handler: handler || ((comp, node) => true)
});
```

### Watch Mode for Development

```bash
npm run test:watch
```

- Tests re-run automatically on file changes
- Press `a` to run all tests
- Press `p` to filter by filename pattern
- Press `q` to quit

---

## Troubleshooting

### Tests fail with "Cannot find module"

**Problem**: Import paths incorrect

**Solution**: Ensure imports use correct relative paths:
- From `tests/core/`: `../../src/core.js`
- From fixtures: `../fixtures/mockData.js`

### JSDOM not available

**Problem**: `document is not defined`

**Solution**: Verify `jest.config.js` has `testEnvironment: 'jsdom'`

### Tests not discovered

**Problem**: File doesn't end with `.test.js`

**Solution**: Rename file to match pattern `*.test.js`

### Slow test execution

**Problem**: Tests taking >10 seconds

**Solution**:
- Check for heavy operations in tests
- Ensure fixtures use fresh copies (no shared state cleanup)
- Use Jest's parallel execution (default)

---

## Time Estimate Summary

| Step | Time | Cumulative |
|------|------|------------|
| Install dependencies | 2 min | 2 min |
| Create Jest config | 1 min | 3 min |
| Update package.json | 2 min | 5 min |
| Create directory structure | 1 min | 6 min |
| Create shared fixtures | 3 min | 9 min |
| Create verification tests | 4 min | 13 min |
| Run tests | 1 min | 14 min |
| Verify auto-discovery | 1 min | 15 min |

**Total**: ~15 minutes (meets SC-007 requirement)

---

## Success Criteria Validation

After completing this quickstart:

- ✅ **SC-001**: Test suite runs in <10 seconds
- ✅ **SC-002**: Single group runs in <3 seconds
- ✅ **SC-003**: New tests require zero configuration
- ✅ **SC-004**: Clear pass/fail output with error details
- ✅ **SC-005**: Verification tests demonstrate framework works
- ✅ **SC-006**: Shared fixtures reduce duplication
- ✅ **SC-007**: Setup completed in 15 minutes

---

## Reference

- **Spec**: [spec.md](../spec.md)
- **Data Model**: [data-model.md](../data-model.md)
- **Contracts**: [contracts/test-framework-interface.md](../contracts/test-framework-interface.md)
- **Research**: [research.md](../research.md)
- **Jest Documentation**: https://jestjs.io/docs/getting-started
