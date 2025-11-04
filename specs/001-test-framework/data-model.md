# Data Model: Testing Framework

**Date**: 2025-11-04
**Feature**: Testing Framework Setup
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data structures and entities for the AppBlocks testing framework. Since this is infrastructure focused on enabling testing, the "data model" primarily describes test fixtures, mockup data, and configuration structures.

## Core Entities

### Test Group

**Description**: Logical collection of related test files

**Attributes**:
- `name`: String - Group identifier (e.g., "core", "directives", "filters")
- `path`: String - Directory path (e.g., "tests/core/")
- `testFiles`: Array<String> - List of test file paths in this group

**Relationships**:
- Contains multiple Test Cases
- Maps to one AppBlocks source module

**Validation Rules**:
- Name must match AppBlocks module name
- Path must exist in tests/ directory
- Must be auto-discoverable by Jest

**Example**:
```javascript
{
  name: "core",
  path: "tests/core/",
  testFiles: ["tests/core/initialization.test.js"]
}
```

---

### Test Case

**Description**: Individual test that verifies specific behavior

**Attributes**:
- `description`: String - Human-readable test description
- `setup`: Function - Test setup/arrangement
- `execution`: Function - Action being tested
- `assertion`: Function - Verification of expected outcome
- `cleanup`: Function - Optional cleanup/teardown

**Relationships**:
- Belongs to one Test Group
- May use Mockup Data

**Jest Implementation**:
```javascript
test('description', () => {
  // setup
  const config = createMockAppBlockConfig();

  // execution
  const app = new AppBlock(config);

  // assertion
  expect(app.data).toEqual(config.data);

  // cleanup (if needed)
});
```

---

### Mockup Data

**Description**: Shared test fixtures for common testing scenarios

**Structure**: Exported factory functions that return fresh data

**Attributes** (per fixture type):
- Factory function name
- Return type
- Default values
- Customization options

**Purpose**:
- Prevent test data duplication
- Ensure data isolation between tests
- Provide realistic test scenarios

---

## Mockup Data Specifications

### DOM Element Fixtures

#### `createMockElement()`

**Purpose**: Create a mock container element for AppBlock

**Returns**: HTMLDivElement

**Structure**:
```javascript
{
  tagName: 'DIV',
  id: 'test-app',
  innerHTML: '', // Empty by default
  // Standard DOM element methods available
}
```

**Usage**:
```javascript
const el = createMockElement();
// Customize if needed
el.innerHTML = '<p>Custom content</p>';
```

---

#### `createMockTemplate()`

**Purpose**: Create a mock template element

**Returns**: HTMLTemplateElement

**Structure**:
```javascript
{
  tagName: 'TEMPLATE',
  id: 'test-template',
  content: DocumentFragment {
    // Default template content
    innerHTML: '<p>{data.message}</p>'
  }
}
```

**Variants**:
- `createMockTemplate(htmlString)` - Custom template content
- `createEmptyTemplate()` - Empty template

**Usage**:
```javascript
const template = createMockTemplate('<div>{data.name}</div>');
```

---

### Configuration Fixtures

#### `createMockAppBlockConfig(overrides)`

**Purpose**: Create a complete AppBlock configuration object

**Parameters**:
- `overrides`: Object (optional) - Properties to override defaults

**Returns**: AppBlock Configuration Object

**Default Structure**:
```javascript
{
  el: createMockElement(),
  template: createMockTemplate(),
  name: 'test-app',
  data: {
    message: 'Test message',
    count: 0,
    items: ['item1', 'item2']
  },
  methods: {},
  directives: {},
  filters: {},
  events: {}
}
```

**Usage Examples**:
```javascript
// Default config
const config = createMockAppBlockConfig();

// Custom data
const config = createMockAppBlockConfig({
  data: { customField: 'value' }
});

// Minimal config (el only)
const config = createMockAppBlockConfig({
  template: undefined,
  data: undefined
});
```

---

### Data Object Fixtures

#### `createMockData()`

**Purpose**: Create sample data object for AppBlock

**Returns**: Object

**Structure**:
```javascript
{
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
}
```

**Purpose**: Covers common use cases and edge cases for testing

---

## Verification Test Data

### Initialization Test Scenarios

#### Scenario 1: Valid Configuration

**Config**:
```javascript
{
  el: <div id="app"></div>,
  template: <template><p>{data.message}</p></template>,
  data: { message: 'Hello' }
}
```

**Expected Outcome**:
- AppBlock instance created successfully
- `app.el` references the element
- `app.data.message` equals 'Hello'
- `app.template` contains the template content

---

#### Scenario 2: Empty Data

**Config**:
```javascript
{
  el: <div id="app"></div>,
  template: <template><p>{data.message}</p></template>,
  data: {} // or undefined
}
```

**Expected Outcome**:
- AppBlock initializes with empty data object
- No errors thrown
- Template renders with undefined placeholders (empty strings)

---

#### Scenario 3: Empty Template

**Config**:
```javascript
{
  el: <div id="app"><p>Inline content</p></div>,
  template: undefined,
  data: { message: 'Hello' }
}
```

**Expected Outcome**:
- AppBlock uses el's existing content as template
- Template fragment created from el's children
- el's innerHTML is moved to template

---

#### Scenario 4: Empty/Null Element

**Config**:
```javascript
{
  el: null, // or undefined
  template: <template><p>Test</p></template>,
  data: { message: 'Hello' }
}
```

**Expected Outcome**:
- Error logged via logError function
- Initialization fails gracefully
- AppBlock instance not created or returns false

---

## Test Configuration Structure

### jest.config.js

**Purpose**: Jest configuration file

**Structure**:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js'],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
};
```

**Key Properties**:
- `testEnvironment`: 'jsdom' for DOM simulation
- `testMatch`: Pattern for auto-discovering test files
- `collectCoverageFrom`: Source files for coverage (future use)
- `verbose`: Detailed test output for clarity

---

### package.json Test Scripts

**Structure**:
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

**Purpose**:
- Single command for all tests (FR-001)
- Group-specific test execution (FR-002)
- Development workflow support (watch mode)
- Future coverage reporting capability

---

## File Structure Reference

### Mockup Data Module

**File**: `tests/fixtures/mockData.js`

**Exports**:
```javascript
// DOM element factories
export { createMockElement };
export { createMockTemplate };
export { createEmptyTemplate };

// Configuration factories
export { createMockAppBlockConfig };

// Data factories
export { createMockData };
export { createEmptyData };

// Helper utilities (if needed)
export { resetDOM }; // Clean up JSDOM between tests
```

---

### Verification Test File

**File**: `tests/core/initialization.test.js`

**Structure**:
```javascript
import AppBlock from '../../src/core';
import {
  createMockElement,
  createMockTemplate,
  createMockAppBlockConfig
} from '../fixtures/mockData';

describe('AppBlock Initialization', () => {
  test('initializes correctly with valid config', () => {
    // Test implementation
  });

  test('handles empty data gracefully', () => {
    // Test implementation
  });

  test('handles missing template', () => {
    // Test implementation
  });

  test('handles missing element', () => {
    // Test implementation
  });
});
```

---

## Data Isolation Strategy

### Fresh Copy Pattern

**Problem**: Test pollution when tests share mutable objects

**Solution**: Factory functions return new instances

**Implementation**:
```javascript
// ❌ BAD: Shared reference
export const sharedConfig = { el: element, data: {} };
// All tests mutate the same object!

// ✅ GOOD: Factory function
export const createMockAppBlockConfig = () => ({
  el: createMockElement(), // Fresh element
  data: { ...defaultData }  // Fresh data object
});
// Each test gets isolated copy
```

**Enforcement**: All fixture exports must be functions, not objects

---

## Extensibility Plan

### Adding New Fixtures

**Process**:
1. Add new factory function to `tests/fixtures/mockData.js`
2. Export the function
3. Import in test files as needed
4. Document in this data-model.md file

**Example** (future filter fixture):
```javascript
export const createMockFilter = (name, implementation) => ({
  name,
  apply: implementation || ((app, value) => value)
});
```

### Adding New Test Groups

**Process**:
1. Create directory under `tests/` (e.g., `tests/newmodule/`)
2. Add test files with `.test.js` suffix
3. Jest auto-discovers them (FR-008)
4. Add npm script for convenience: `"test:newmodule": "jest tests/newmodule"`

---

## Validation & Constraints

### Test File Naming

**Pattern**: `*.test.js`

**Rules**:
- Must end with `.test.js` for Jest discovery
- Should describe what's being tested (e.g., `initialization.test.js`)
- Located in appropriate group directory

### Fixture Naming

**Pattern**: `create<Entity><Variant>`

**Examples**:
- `createMockElement()` - Generic element
- `createMockAppBlockConfig()` - Generic config
- `createEmptyData()` - Specific variant

**Rules**:
- All fixtures are functions (not objects)
- Names clearly indicate what they create
- Return types match AppBlocks expectations

---

## Summary

This data model defines:
- **7 fixture factories** for test data (elements, templates, configs, data)
- **4 verification test scenarios** for AppBlock initialization
- **6 test groups** matching AppBlocks modules
- **Test configuration structures** (jest.config.js, package.json scripts)
- **Data isolation strategy** using factory functions
- **Extensibility patterns** for future growth

All structures support the constitutional requirements for test organization, shared data, and zero-configuration extensibility.
