# Quickstart: AppBlocks Testing Guide

**Feature**: 002-comprehensive-test-coverage
**Purpose**: Developer guide for running tests and writing new test cases

---

## Running Tests

### Run All Tests
```bash
npm test
```

Expected output: ~80+ tests passing across all modules.

### Run Specific Module
```bash
npm run test:core          # Core functionality tests
npm run test:directives    # Directive tests (c-if, c-for, etc.)
npm run test:filters       # Filter tests
npm run test:utils         # Utility function tests
npm run test:processing    # Template processing tests
npm run test:requests      # Request method tests
npm run test:placeholders  # Placeholder tests
npm run test:logger        # Logger tests
```

### Run Specific Test File
```bash
npx jest tests/core/initialization.test.js
npx jest tests/directives/c-if.test.js
```

### Watch Mode (Auto-Rerun on Changes)
```bash
npm test -- --watch
```

### Coverage Report (Optional)
```bash
npm test -- --coverage
```

---

## Writing Your First Test

### 1. Choose the Module

Determine which module your test belongs to:
- `tests/core/` - AppBlock initialization, rendering, data management, events
- `tests/directives/` - Built-in directives (c-if, c-for, etc.) and custom directives
- `tests/filters/` - Filter system and custom filters
- `tests/utils/` - Utility functions (debounce, getObjectValueByPath, etc.)
- `tests/processing/` - Template processing (placeholders, directives)
- `tests/requests/` - HTTP requests (getJSON, getText, etc.)
- `tests/placeholders/` - Placeholder parsing and replacement
- `tests/logger/` - Logging functionality

### 2. Create Test File

Create a file named `<feature>.test.js` in the appropriate directory:

```javascript
// tests/core/example.test.js
import { createMockAppBlockConfig, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('AppBlock - Example Feature', () => {
  afterEach(() => {
    resetDOM(); // Clean up DOM after each test
  });

  test('should do something when condition is met', () => {
    // Your test here
  });
});
```

### 3. Write Test Using AAA Pattern

**Arrange-Act-Assert** pattern:

```javascript
test('should render message in template', () => {
  // Arrange: Set up test data and config
  const config = createMockAppBlockConfig({
    template: createMockTemplate('<div>{data.message}</div>'),
    data: { message: 'Hello, World!' }
  });

  // Act: Execute the behavior being tested
  const app = new AppBlock(config);
  app.render();

  // Assert: Verify the expected outcome
  expect(app.el.textContent).toContain('Hello, World!');
});
```

---

## Common Test Patterns

### Pattern 1: Testing AppBlock Initialization

```javascript
import { createMockAppBlockConfig, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('AppBlock - Initialization', () => {
  afterEach(() => resetDOM());

  test('should set all properties when initialized with valid config', () => {
    const config = createMockAppBlockConfig({
      name: 'my-app',
      data: { count: 5 }
    });

    const app = new AppBlock(config);

    expect(app.name).toBe('my-app');
    expect(app.data.count).toBe(5);
    expect(app.el).toBeDefined();
  });

  test('should use default render engine when renderEngine not specified', () => {
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);

    expect(app.renderEngine).toBe('appblocks'); // or 'idiomorph'
  });
});
```

---

### Pattern 2: Testing Directives

```javascript
import {
  createMockAppBlockConfig,
  createTemplateWithCIf,
  resetDOM
} from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('c-if directive', () => {
  afterEach(() => resetDOM());

  test('should remove node when condition is false', () => {
    const template = createTemplateWithCIf('data.show', 'Content');
    const config = createMockAppBlockConfig({
      template,
      data: { show: false }
    });

    const app = new AppBlock(config);
    app.render();

    const node = app.el.querySelector('[c-if]');
    expect(node).toBeNull(); // Node should be removed
  });

  test('should keep node when condition is true', () => {
    const template = createTemplateWithCIf('data.show', 'Content');
    const config = createMockAppBlockConfig({
      template,
      data: { show: true }
    });

    const app = new AppBlock(config);
    app.render();

    const node = app.el.querySelector('[c-if]');
    expect(node).not.toBeNull(); // Node should exist
    expect(node.textContent).toContain('Content');
  });
});
```

---

### Pattern 3: Testing Placeholders

```javascript
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('Placeholder Replacement', () => {
  afterEach(() => resetDOM());

  test('should replace simple placeholder with data value', () => {
    const template = createMockTemplate('<div>{data.name}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { name: 'Alice' }
    });

    const app = new AppBlock(config);
    app.render();

    expect(app.el.textContent).toContain('Alice');
  });

  test('should replace nested property placeholder', () => {
    const template = createMockTemplate('<div>{data.user.name}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { user: { name: 'Bob' } }
    });

    const app = new AppBlock(config);
    app.render();

    expect(app.el.textContent).toContain('Bob');
  });
});
```

---

### Pattern 4: Testing Filters

```javascript
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('Filters', () => {
  afterEach(() => resetDOM());

  test('should apply built-in filter to placeholder', () => {
    const template = createMockTemplate('<div>{data.message|uppercase}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { message: 'hello' }
    });

    const app = new AppBlock(config);
    app.render();

    expect(app.el.textContent).toContain('HELLO');
  });

  test('should apply custom filter', () => {
    const currencyFilter = (app, value) => `$${parseFloat(value).toFixed(2)}`;
    const template = createMockTemplate('<div>{data.price|currency}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { price: 19.5 },
      filters: { currency: currencyFilter }
    });

    const app = new AppBlock(config);
    app.render();

    expect(app.el.textContent).toContain('$19.50');
  });
});
```

---

### Pattern 5: Testing Request Methods

```javascript
import { createMockAppBlockConfig, setupFetchMock, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('Request Methods', () => {
  afterEach(() => {
    resetDOM();
    if (global.fetch.mockClear) {
      global.fetch.mockClear();
    }
  });

  test('should fetch JSON and update data', async () => {
    setupFetchMock({ users: ['Alice', 'Bob'] });

    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);

    await app.getJSON('https://api.test/users');

    expect(global.fetch).toHaveBeenCalledWith('https://api.test/users');
    expect(app.data.users).toEqual(['Alice', 'Bob']);
  });

  test('should handle fetch error gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);

    await expect(app.getJSON('https://api.test/fail')).rejects.toThrow('Network error');
  });
});
```

---

### Pattern 6: Testing Custom Extensions

```javascript
import {
  createMockAppBlockConfig,
  createMockCustomDirective,
  createMockCustomFilter,
  createMockTemplate,
  resetDOM
} from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('Custom Directives', () => {
  afterEach(() => resetDOM());

  test('should call custom directive with correct parameters', () => {
    const customDirective = createMockCustomDirective(true);
    const template = createMockTemplate('<div c-custom="data.value">Content</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { value: true },
      directives: { 'c-custom': customDirective }
    });

    const app = new AppBlock(config);
    app.render();

    expect(customDirective).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'test-app' }),
      expect.any(Node),
      expect.any(Object)
    );
  });
});

describe('Custom Filters', () => {
  afterEach(() => resetDOM());

  test('should apply custom filter transformation', () => {
    const upperFilter = (app, value) => value.toUpperCase();
    const template = createMockTemplate('<div>{data.name|upper}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { name: 'alice' },
      filters: { upper: upperFilter }
    });

    const app = new AppBlock(config);
    app.render();

    expect(app.el.textContent).toContain('ALICE');
  });
});
```

---

### Pattern 7: Testing Error Cases

```javascript
import { createMockAppBlockConfig, createConsoleSpy, restoreConsoleSpy, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('Error Handling', () => {
  afterEach(() => resetDOM());

  test('should log error when el is null', () => {
    const spy = createConsoleSpy('error');

    const config = createMockAppBlockConfig({ el: null });
    new AppBlock(config);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('test-app'));
    restoreConsoleSpy(spy);
  });

  test('should handle missing data property gracefully', () => {
    const template = createMockTemplate('<div>{data.missing}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: {} // missing property
    });

    const app = new AppBlock(config);
    app.render();

    // Should not throw, should handle gracefully
    expect(app.el.textContent).toBeTruthy();
  });
});
```

---

### Pattern 8: Testing Edge Cases

```javascript
import { createMockAppBlockConfig, createMockFalsyData, createMockTemplate, resetDOM } from '../fixtures/mockData.js';
import AppBlock from '../../src/index.js';

describe('Edge Cases', () => {
  afterEach(() => resetDOM());

  test('should handle all falsy values in c-if', () => {
    const falsyData = createMockFalsyData();

    Object.entries(falsyData).forEach(([key, value]) => {
      const template = createMockTemplate(`<div c-if="data.${key}">Content</div>`);
      const config = createMockAppBlockConfig({
        template,
        data: { [key]: value }
      });

      const app = new AppBlock(config);
      app.render();

      const node = app.el.querySelector('[c-if]');
      expect(node).toBeNull(); // All falsy values should remove node
    });
  });

  test('should handle empty array in c-for', () => {
    const template = createMockTemplate('<div c-for="item in items">{item}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { items: [] }
    });

    const app = new AppBlock(config);
    app.render();

    const nodes = app.el.querySelectorAll('[c-for]');
    expect(nodes.length).toBe(0); // No items rendered
  });
});
```

---

## Best Practices

### 1. Test Independence
- Always use `resetDOM()` in `afterEach()` to clean up DOM
- Create fresh fixtures for each test (don't reuse instances)
- Tests should pass in any order

```javascript
afterEach(() => {
  resetDOM(); // ✅ Clean slate for next test
});
```

### 2. Use Descriptive Test Names
- Follow "should...when..." pattern
- Test name should explain what's being tested

```javascript
test('should remove node when c-if condition is false', () => { /* ... */ }); // ✅ Clear
test('c-if test', () => { /* ... */ }); // ❌ Vague
```

### 3. Arrange-Act-Assert Pattern
- Separate setup, execution, and verification
- Makes tests easy to read and understand

```javascript
test('example', () => {
  // Arrange
  const config = createMockAppBlockConfig({ data: { count: 5 } });

  // Act
  const app = new AppBlock(config);
  app.setData({ count: 10 });

  // Assert
  expect(app.data.count).toBe(10);
});
```

### 4. Use Fixture Factories
- Import from `tests/fixtures/mockData.js`
- Don't create DOM elements manually in tests
- Keeps tests DRY and consistent

```javascript
const config = createMockAppBlockConfig({ /* overrides */ }); // ✅ Use factory
const config = { name: 'test', el: document.createElement('div'), /* ... */ }; // ❌ Manual setup
```

### 5. Test One Thing Per Test
- Each test should verify one behavior
- Makes failures easier to diagnose

```javascript
test('should set name property', () => {
  const app = new AppBlock(createMockAppBlockConfig({ name: 'my-app' }));
  expect(app.name).toBe('my-app'); // ✅ Single assertion
});

test('should set all properties', () => {
  const app = new AppBlock(createMockAppBlockConfig());
  expect(app.name).toBe('test-app');
  expect(app.data).toEqual({});
  expect(app.el).toBeDefined();
  expect(app.template).toBeDefined();
  // ❌ Too many unrelated assertions
});
```

### 6. Mock External Dependencies
- Use `setupFetchMock()` for HTTP requests
- Use `createConsoleSpy()` for console methods
- Don't make real network calls in tests

```javascript
setupFetchMock({ result: 'success' }); // ✅ Mocked
await app.getJSON('https://real-api.com/data'); // ❌ Real network call
```

---

## Debugging Tests

### Run Single Test
```bash
npx jest tests/core/initialization.test.js -t "should set name property"
```

### Enable Verbose Output
```bash
npm test -- --verbose
```

### Debug with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand tests/core/initialization.test.js
```

Then open `chrome://inspect` in Chrome.

### Console Logging in Tests
```javascript
test('debug example', () => {
  const app = new AppBlock(createMockAppBlockConfig());
  console.log('App state:', app); // View in test output
  expect(app.name).toBe('test-app');
});
```

---

## Adding New Test Fixtures

If you need a new fixture pattern:

1. Add factory function to `tests/fixtures/mockData.js`:
```javascript
export function createMyNewFixture(config = {}) {
  // Create and return your fixture
  return { /* ... */ };
}
```

2. Document it in `data-model.md`

3. Use in your tests:
```javascript
import { createMyNewFixture } from '../fixtures/mockData.js';

test('example', () => {
  const fixture = createMyNewFixture();
  // Test with fixture
});
```

---

## Test File Checklist

When creating a new test file, ensure:

- [ ] File is in correct module directory (`tests/core/`, `tests/directives/`, etc.)
- [ ] File name ends with `.test.js`
- [ ] Imports necessary fixtures from `../fixtures/mockData.js`
- [ ] Imports source code being tested
- [ ] Uses `describe()` to group related tests
- [ ] Uses `afterEach(() => resetDOM())` for cleanup
- [ ] Test names follow "should...when..." pattern
- [ ] Tests use Arrange-Act-Assert pattern
- [ ] Tests are independent (no shared state)
- [ ] All tests pass: `npm test`

---

## Getting Help

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **JSDOM Documentation**: https://github.com/jsdom/jsdom
- **AppBlocks Testing Docs**: `/docs/testing.md`
- **Test Fixtures Reference**: `/specs/002-comprehensive-test-coverage/data-model.md`
- **Research & Strategy**: `/specs/002-comprehensive-test-coverage/research.md`

---

## Quick Reference

### Fixture Imports
```javascript
import {
  // Config factories
  createMockAppBlockConfig,
  createMockAppBlockWithData,

  // Element factories
  createMockElement,
  createMockElementWithChildren,
  createMockElementWithDirective,

  // Template factories
  createMockTemplate,
  createTemplateWithCIf,
  createTemplateWithCFor,

  // Data factories
  createMockArrayData,
  createMockNestedData,
  createMockFalsyData,

  // Extension factories
  createMockCustomDirective,
  createMockCustomFilter,
  createMockCustomMethod,

  // Request mocking
  setupFetchMock,
  createMockFetchSuccess,
  createMockFetchError,

  // Console spies
  createConsoleSpy,
  restoreConsoleSpy,

  // DOM cleanup
  resetDOM
} from '../fixtures/mockData.js';
```

### Jest Matchers
```javascript
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeDefined();            // Not undefined
expect(value).toBeNull();               // Null
expect(value).toBeTruthy();             // Truthy
expect(value).toBeFalsy();              // Falsy
expect(value).toContain(item);          // Array/string contains
expect(fn).toHaveBeenCalled();          // Mock called
expect(fn).toHaveBeenCalledWith(arg);   // Mock called with arg
expect(promise).rejects.toThrow();      // Promise rejection
```

---

**Ready to write tests!** Start with a simple test file and expand from there. Remember: test coverage is about behavior, not lines of code.
