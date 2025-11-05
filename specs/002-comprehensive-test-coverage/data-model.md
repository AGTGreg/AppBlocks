# Data Model: Test Fixtures and Mock Data

**Feature**: 002-comprehensive-test-coverage
**Date**: 2025-11-04
**Purpose**: Define test data structures, fixture patterns, and mock object schemas

## Overview

This document specifies the test fixtures and mock data structures used across all comprehensive test cases. It extends the existing `tests/fixtures/mockData.js` with additional factory functions to support testing all AppBlocks modules.

---

## Existing Fixtures (from 001-test-framework)

Current fixture factories in `tests/fixtures/mockData.js`:

```javascript
// DOM Element Factories
export function createMockElement(config = {}) {
  const { tag = 'div', id = '', classes = [], attributes = {} } = config;
  const element = document.createElement(tag);
  if (id) element.id = id;
  classes.forEach(cls => element.classList.add(cls));
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

// Template Factory
export function createMockTemplate(content = '<div>{data.message}</div>') {
  const template = document.createElement('template');
  template.innerHTML = content;
  return template;
}

// AppBlock Config Factory
export function createMockAppBlockConfig(overrides = {}) {
  return {
    name: 'test-app',
    el: createMockElement({ id: 'test-el' }),
    template: createMockTemplate(),
    data: {},
    ...overrides
  };
}

// Data Factory
export function createEmptyData() {
  return {};
}

// DOM Cleanup
export function resetDOM() {
  document.body.innerHTML = '';
}

// Directive Factory
export function createMockDirective(returnValue = true) {
  return jest.fn(() => returnValue);
}
```

---

## New Fixture Factories

### AppBlock Instance Factories

```javascript
/**
 * Creates a configured AppBlock instance with data
 * @param {Object} data - Data object to populate AppBlock
 * @param {Object} config - Optional config overrides
 * @returns {AppBlock} Initialized AppBlock instance
 */
export function createMockAppBlockWithData(data = {}, config = {}) {
  const fullConfig = createMockAppBlockConfig({
    data,
    ...config
  });
  return new AppBlock(fullConfig);
}
```

**Usage**:
```javascript
const app = createMockAppBlockWithData({ message: 'Hello' });
```

---

### DOM Element Factories (Extended)

```javascript
/**
 * Creates an element with child nodes
 * @param {number} count - Number of child elements
 * @param {Object} config - Parent element config
 * @returns {HTMLElement} Element with children
 */
export function createMockElementWithChildren(count = 3, config = {}) {
  const parent = createMockElement(config);
  for (let i = 0; i < count; i++) {
    const child = createMockElement({
      tag: 'div',
      classes: ['child'],
      attributes: { 'data-index': i }
    });
    child.textContent = `Child ${i + 1}`;
    parent.appendChild(child);
  }
  return parent;
}

/**
 * Creates an element with specific directive attribute
 * @param {string} directiveName - Directive attribute (e.g., 'c-if')
 * @param {string} directiveValue - Directive value (e.g., 'data.show')
 * @param {Object} config - Additional element config
 * @returns {HTMLElement} Element with directive
 */
export function createMockElementWithDirective(directiveName, directiveValue, config = {}) {
  return createMockElement({
    ...config,
    attributes: {
      [directiveName]: directiveValue,
      ...(config.attributes || {})
    }
  });
}

/**
 * Creates an element with placeholder
 * @param {string} placeholder - Placeholder text (e.g., '{data.message}')
 * @param {Object} config - Element config
 * @returns {HTMLElement} Element with text content
 */
export function createMockElementWithPlaceholder(placeholder, config = {}) {
  const element = createMockElement(config);
  element.textContent = placeholder;
  return element;
}
```

---

### Template Factories (Extended)

```javascript
/**
 * Creates a template with c-if directive
 * @param {string} condition - c-if condition value
 * @param {string} content - Inner content
 * @returns {HTMLTemplateElement} Template with c-if
 */
export function createTemplateWithCIf(condition, content = 'Content') {
  return createMockTemplate(`<div c-if="${condition}">${content}</div>`);
}

/**
 * Creates a template with c-for directive
 * @param {string} loopVar - Loop variable (e.g., 'item in items')
 * @param {string} itemContent - Content template for each item
 * @returns {HTMLTemplateElement} Template with c-for
 */
export function createTemplateWithCFor(loopVar, itemContent = '{item}') {
  return createMockTemplate(`<div c-for="${loopVar}">${itemContent}</div>`);
}

/**
 * Creates a template with multiple placeholders
 * @param {Array<string>} placeholders - Placeholder expressions
 * @returns {HTMLTemplateElement} Template with placeholders
 */
export function createTemplateWithPlaceholders(placeholders = []) {
  const content = placeholders.map(p => `<span>${p}</span>`).join('');
  return createMockTemplate(`<div>${content}</div>`);
}
```

---

### Data Object Factories

```javascript
/**
 * Creates an array of mock objects
 * @param {number} length - Array length
 * @param {Function} factory - Factory function for each item (index) => object
 * @returns {Array} Array of objects
 */
export function createMockArrayData(length = 3, factory = (i) => ({ id: i, name: `Item ${i + 1}` })) {
  return Array.from({ length }, (_, i) => factory(i));
}

/**
 * Creates nested data structure
 * @param {number} depth - Nesting depth
 * @returns {Object} Nested object
 */
export function createMockNestedData(depth = 3) {
  let obj = { value: 'leaf' };
  for (let i = 0; i < depth; i++) {
    obj = { nested: obj };
  }
  return obj;
}

/**
 * Creates data with all falsy values for edge case testing
 * @returns {Object} Object with falsy values
 */
export function createMockFalsyData() {
  return {
    undefined: undefined,
    null: null,
    false: false,
    zero: 0,
    emptyString: '',
    emptyArray: [],
    emptyObject: {}
  };
}
```

**Usage Examples**:
```javascript
const items = createMockArrayData(5); // [{ id: 0, name: 'Item 1' }, ...]
const nested = createMockNestedData(3); // { nested: { nested: { nested: { value: 'leaf' } } } }
const falsy = createMockFalsyData(); // Test edge cases
```

---

### Custom Extension Factories

```javascript
/**
 * Creates a mock custom directive function
 * @param {*} returnValue - Value directive should return
 * @returns {Function} Mocked directive function
 */
export function createMockCustomDirective(returnValue = true) {
  return jest.fn((appInstance, node, pointers) => returnValue);
}

/**
 * Creates a mock custom filter function
 * @param {Function} transform - Transformation function (value) => transformedValue
 * @returns {Function} Mocked filter function
 */
export function createMockCustomFilter(transform = (value) => value) {
  return jest.fn((appInstance, value) => transform(value));
}

/**
 * Creates a mock custom method
 * @param {*} returnValue - Value method should return
 * @returns {Function} Mocked method function
 */
export function createMockCustomMethod(returnValue) {
  return jest.fn(() => returnValue);
}
```

**Usage Examples**:
```javascript
// Custom directive that always returns true
const greetDirective = createMockCustomDirective(true);

// Custom filter that uppercases values
const upperFilter = createMockCustomFilter(v => v.toUpperCase());

// Custom method that returns full name
const fullNameMethod = createMockCustomMethod('Alice Smith');
```

---

### Request Mocking Factories

```javascript
/**
 * Creates a mock successful fetch response
 * @param {Object} data - Response data
 * @returns {Promise} Mocked fetch response
 */
export function createMockFetchSuccess(data = {}) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data)
  });
}

/**
 * Creates a mock failed fetch response
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @returns {Promise} Mocked fetch error response
 */
export function createMockFetchError(status = 500, message = 'Server error') {
  return Promise.resolve({
    ok: false,
    status,
    statusText: message
  });
}

/**
 * Sets up global fetch mock
 * @param {Object} response - Response data or mock response
 * @returns {jest.Mock} The global fetch mock
 */
export function setupFetchMock(response) {
  global.fetch = jest.fn(() => {
    if (response instanceof Promise) {
      return response;
    }
    return createMockFetchSuccess(response);
  });
  return global.fetch;
}
```

**Usage Examples**:
```javascript
// Mock successful API call
beforeEach(() => {
  setupFetchMock({ users: ['Alice', 'Bob'] });
});

// Mock API error
beforeEach(() => {
  global.fetch = jest.fn(() => createMockFetchError(404, 'Not found'));
});
```

---

### Console Spy Helpers

```javascript
/**
 * Creates a console spy for logging tests
 * @param {string} method - Console method to spy on ('log', 'error', 'warn')
 * @returns {jest.SpyInstance} Console spy
 */
export function createConsoleSpy(method = 'error') {
  return jest.spyOn(console, method).mockImplementation(() => {});
}

/**
 * Cleans up console spy
 * @param {jest.SpyInstance} spy - Spy to restore
 */
export function restoreConsoleSpy(spy) {
  spy.mockRestore();
}
```

**Usage Example**:
```javascript
test('should log error when el is null', () => {
  const spy = createConsoleSpy('error');
  const config = createMockAppBlockConfig({ el: null });
  new AppBlock(config);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('test-app'));
  restoreConsoleSpy(spy);
});
```

---

## Test Data Schemas

### Minimal User Object
```javascript
{
  name: 'Alice',
  age: 30,
  active: true
}
```

### Minimal Item List
```javascript
[
  { id: 1, title: 'First', completed: false },
  { id: 2, title: 'Second', completed: true },
  { id: 3, title: 'Third', completed: false }
]
```

### Nested Data Structure
```javascript
{
  user: {
    profile: {
      name: 'Alice',
      settings: {
        theme: 'dark'
      }
    }
  }
}
```

### Conditional Data
```javascript
{
  show: true,
  hide: false,
  count: 5,
  items: ['A', 'B', 'C']
}
```

### Comparison Operators Data
```javascript
{
  age: 25,
  name: 'Alice',
  active: true,
  count: 0
}
```

---

## Fixture Usage Patterns

### Pattern 1: Simple Test with Fresh Fixture
```javascript
test('should render data', () => {
  const config = createMockAppBlockConfig({ data: { message: 'Hello' } });
  const app = new AppBlock(config);
  expect(app.data.message).toBe('Hello');
});
```

### Pattern 2: Template + Data Testing
```javascript
test('should replace placeholder', () => {
  const template = createMockTemplate('<div>{data.message}</div>');
  const config = createMockAppBlockConfig({
    template,
    data: { message: 'Hello' }
  });
  const app = new AppBlock(config);
  app.render();
  expect(app.el.textContent).toContain('Hello');
});
```

### Pattern 3: Directive Testing
```javascript
test('should remove node when c-if is false', () => {
  const template = createTemplateWithCIf('data.show', 'Content');
  const config = createMockAppBlockConfig({
    template,
    data: { show: false }
  });
  const app = new AppBlock(config);
  app.render();
  expect(app.el.querySelector('[c-if]')).toBeNull();
});
```

### Pattern 4: Custom Extension Testing
```javascript
test('should apply custom filter', () => {
  const upperFilter = createMockCustomFilter(v => v.toUpperCase());
  const config = createMockAppBlockConfig({
    data: { name: 'alice' },
    filters: { upper: upperFilter }
  });
  // Test that filter is called and transforms value
});
```

### Pattern 5: Request Testing
```javascript
test('should fetch and update data', async () => {
  setupFetchMock({ result: 'success' });
  const config = createMockAppBlockConfig();
  const app = new AppBlock(config);

  await app.getJSON('https://api.test/data');

  expect(global.fetch).toHaveBeenCalledWith('https://api.test/data');
  expect(app.data.result).toBe('success');
});
```

### Pattern 6: Error Testing
```javascript
test('should log error when config is invalid', () => {
  const spy = createConsoleSpy('error');
  const config = { name: 'test', el: null }; // Invalid
  new AppBlock(config);
  expect(spy).toHaveBeenCalled();
  restoreConsoleSpy(spy);
});
```

---

## DOM State Management

### Test Independence Pattern
```javascript
describe('Module Tests', () => {
  afterEach(() => {
    resetDOM(); // Clean up DOM after each test
  });

  test('first test', () => {
    const config = createMockAppBlockConfig(); // Fresh fixture
    document.body.appendChild(config.el);
    // Test logic
  });

  test('second test', () => {
    const config = createMockAppBlockConfig(); // Another fresh fixture
    document.body.appendChild(config.el);
    // Test logic - clean DOM, no pollution
  });
});
```

---

## Edge Case Test Data

### Falsy Values
```javascript
const edgeCases = {
  undefined: undefined,
  null: null,
  false: false,
  zero: 0,
  emptyString: '',
  NaN: NaN
};
```

### Boundary Conditions
```javascript
const boundaries = {
  emptyArray: [],
  emptyObject: {},
  singleItem: [{ id: 1 }],
  largeArray: createMockArrayData(100)
};
```

### Missing Properties
```javascript
const incomplete = {
  user: { name: 'Alice' } // missing age, profile, etc.
};
```

---

## Summary

**Total Fixture Functions**: 20+ (existing + new)

**Key Additions**:
- AppBlock instance factories (with data)
- Extended DOM element factories (children, directives, placeholders)
- Extended template factories (c-if, c-for, placeholders)
- Data object factories (arrays, nested, falsy values)
- Custom extension factories (directives, filters, methods)
- Request mocking factories (fetch success/error)
- Console spy helpers

**Design Principles**:
1. **Minimal by default** - Factories create minimal valid objects
2. **Parameterizable** - Accept options to customize behavior
3. **Independent** - Each call returns fresh instance (no shared state)
4. **Well-named** - Name describes what it creates
5. **DRY** - Reuse across all test files

**Next Phase**: Use these fixtures in quickstart.md examples and actual test implementation.
