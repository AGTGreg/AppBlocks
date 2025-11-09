# Test Contract: Object Iteration

**Feature**: c-for directive object iteration
**File**: `tests/directives/c-for.objects.test.js`

## Test Coverage Requirements

All tests MUST follow the pattern established in existing c-for tests:
- Use fixtures from `tests/fixtures/mockData.js`
- Call `resetDOM()` in `afterEach()`
- Follow Arrange-Act-Assert pattern
- Use descriptive test names: "should [behavior] when [condition]"

## Required Test Cases

### 1. Basic Object Iteration

**Contract**: Dual-pointer syntax iterates over object properties

```javascript
describe('c-for object iteration', () => {
  test('should iterate over simple object with dual pointers', () => {
    // Arrange
    const template = createTemplateWithCFor('key, value in data.settings', '{key}: {value}');
    const settings = { theme: 'dark', lang: 'en' };
    const config = createMockAppBlockConfig({ template, data: { settings } });

    // Act
    const app = new AppBlock(config);

    // Assert
    expect(app.el.textContent).toContain('theme: dark');
    expect(app.el.textContent).toContain('lang: en');
  });
});
```

**Expected Behavior**:
- Object properties are iterated in enumeration order
- Key and value are both accessible in template
- Output contains all key-value pairs

### 2. Single Pointer with Object

**Contract**: Single pointer syntax with object provides value only

```javascript
test('should iterate over object with single pointer (value only)', () => {
  // Arrange
  const template = createTemplateWithCFor('value in data.colors', '{value}');
  const colors = { primary: 'blue', secondary: 'green' };
  const config = createMockAppBlockConfig({ template, data: { colors } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('blue');
  expect(app.el.textContent).toContain('green');
  expect(app.el.textContent).not.toContain('primary');
  expect(app.el.textContent).not.toContain('secondary');
});
```

**Expected Behavior**:
- Only values are accessible in template
- Keys are not accessible (single pointer)
- All values are rendered

### 3. Empty Object

**Contract**: Empty object renders nothing

```javascript
test('should render nothing for empty object', () => {
  // Arrange
  const template = createTemplateWithCFor('key, value in data.empty', '{key}: {value}');
  const config = createMockAppBlockConfig({ template, data: { empty: {} } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent.trim()).toBe('');
});
```

**Expected Behavior**:
- No elements rendered
- No errors thrown
- Empty DOM subtree

### 4. Null Object

**Contract**: Null object is handled gracefully

```javascript
test('should handle null object gracefully', () => {
  // Arrange
  const template = createTemplateWithCFor('key, value in data.missing', '{key}: {value}');
  const config = createMockAppBlockConfig({ template, data: { missing: null } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent.trim()).toBe('');
  // If debug enabled, error should be logged (test with spy if needed)
});
```

**Expected Behavior**:
- No elements rendered
- Error logged if debug enabled
- No exception thrown

### 5. Undefined Object

**Contract**: Undefined object is handled gracefully

```javascript
test('should handle undefined object gracefully', () => {
  // Arrange
  const template = createTemplateWithCFor('key, value in data.notDefined', '{key}: {value}');
  const config = createMockAppBlockConfig({ template, data: {} });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent.trim()).toBe('');
  // No error logged for undefined (missing data is normal)
});
```

**Expected Behavior**:
- No elements rendered
- No error logged (undefined is normal)
- No exception thrown

### 6. Object with Falsy Values

**Contract**: All properties iterate, including falsy values

```javascript
test('should iterate over object with falsy values', () => {
  // Arrange
  const template = createTemplateWithCFor('key, value in data.flags', '{key}: {value}');
  const flags = {
    zero: 0,
    empty: '',
    isFalse: false,
    isNull: null,
    isUndefined: undefined
  };
  const config = createMockAppBlockConfig({ template, data: { flags } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('zero: 0');
  expect(app.el.textContent).toContain('empty: ');
  expect(app.el.textContent).toContain('isFalse: false');
  expect(app.el.textContent).toContain('isNull: null');
  // Note: undefined may render as empty string
});
```

**Expected Behavior**:
- All properties are iterated
- Falsy values are rendered as-is
- No properties skipped

### 7. Nested Object Values

**Contract**: Values can be nested objects

```javascript
test('should handle nested object values', () => {
  // Arrange
  const template = createTemplateWithCFor('key, user in data.users', '{key}: {user.name}');
  const users = {
    user1: { name: 'Alice', age: 30 },
    user2: { name: 'Bob', age: 25 }
  };
  const config = createMockAppBlockConfig({ template, data: { users } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('user1: Alice');
  expect(app.el.textContent).toContain('user2: Bob');
});
```

**Expected Behavior**:
- Value pointer contains nested object
- Nested properties accessible via dot notation
- All nested objects iterated

### 8. Method Returning Object

**Contract**: Methods can return objects for iteration

```javascript
test('should iterate over object returned from method', () => {
  // Arrange
  const template = createTemplateWithCFor('key, value in getConfig()', '{key}: {value}');
  const methods = {
    getConfig: (app) => ({
      apiUrl: 'https://api.example.com',
      timeout: 5000
    })
  };
  const config = createMockAppBlockConfig({ template, methods });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('apiUrl: https://api.example.com');
  expect(app.el.textContent).toContain('timeout: 5000');
});
```

**Expected Behavior**:
- Method is called and result iterated
- Object properties from method accessible
- Same behavior as data properties

### 9. Inherited Properties Excluded

**Contract**: Only own properties are iterated (no prototype chain)

```javascript
test('should exclude inherited properties from iteration', () => {
  // Arrange
  function Config() {
    this.ownProp = 'own';
  }
  Config.prototype.inheritedProp = 'inherited';

  const instance = new Config();
  const template = createTemplateWithCFor('key, value in data.config', '{key}: {value}');
  const config = createMockAppBlockConfig({ template, data: { config: instance } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('ownProp: own');
  expect(app.el.textContent).not.toContain('inheritedProp');
  expect(app.el.textContent).not.toContain('inherited');
});
```

**Expected Behavior**:
- Only own enumerable properties iterated
- Prototype properties excluded
- Object.entries() behavior preserved

### 10. Nested c-for with Objects

**Contract**: Nested c-for works with object within object iteration

```javascript
test('should support nested c-for with objects', () => {
  // Arrange
  const innerTemplate = '<span c-for="empId, emp in employees">{empId}: {emp.name}</span>';
  const outerTemplate = `<div c-for="dept, employees in data.company">${innerTemplate}</div>`;
  const template = document.createElement('template');
  template.innerHTML = outerTemplate;

  const company = {
    Engineering: {
      E001: { name: 'Alice' },
      E002: { name: 'Bob' }
    },
    Sales: {
      S001: { name: 'Carol' }
    }
  };
  const config = createMockAppBlockConfig({ template, data: { company } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('E001: Alice');
  expect(app.el.textContent).toContain('E002: Bob');
  expect(app.el.textContent).toContain('S001: Carol');
});
```

**Expected Behavior**:
- Outer object iteration sets dept and employees pointers
- Inner object iteration sets empId and emp pointers
- All pointers accessible in nested context

### 11. Backward Compatibility - Arrays Still Work

**Contract**: Existing array iteration is unchanged

```javascript
test('should not break existing array iteration with single pointer', () => {
  // Arrange
  const template = createTemplateWithCFor('item in data.items', '{item}');
  const items = ['a', 'b', 'c'];
  const config = createMockAppBlockConfig({ template, data: { items } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('a');
  expect(app.el.textContent).toContain('b');
  expect(app.el.textContent).toContain('c');
});
```

**Expected Behavior**:
- Array iteration works exactly as before
- No regression in existing functionality
- All existing tests pass

### 12. Dual Pointer with Array (Edge Case)

**Contract**: Dual pointer syntax with array uses second pointer for item

```javascript
test('should use second pointer for array items when dual pointer syntax used', () => {
  // Arrange
  const template = createTemplateWithCFor('ignored, item in data.items', '{item}');
  const items = ['x', 'y', 'z'];
  const config = createMockAppBlockConfig({ template, data: { items } });

  // Act
  const app = new AppBlock(config);

  // Assert
  expect(app.el.textContent).toContain('x');
  expect(app.el.textContent).toContain('y');
  expect(app.el.textContent).toContain('z');
  // First pointer is not used/accessible
});
```

**Expected Behavior**:
- Array detected (higher priority than object)
- Second pointer gets item value
- First pointer is ignored (not assigned)
- Works but not recommended usage

## Fixture Requirements

Add to `tests/fixtures/mockData.js`:

```javascript
/**
 * Create mock object data for testing
 * @param {Object} obj - Object to use as data
 * @returns {Object} - Object for testing
 */
export function createMockObjectData(obj = {}) {
  return obj;
}

/**
 * Create template with c-for directive for objects
 * @param {string} forExpr - The c-for expression (e.g., "key, value in data.obj")
 * @param {string} content - Template content with placeholders
 * @returns {HTMLTemplateElement}
 */
// Note: createTemplateWithCFor already exists, should support dual-pointer syntax
```

## Test Execution

All tests MUST:
- Run independently (no shared state)
- Pass in any order
- Clean up DOM using `resetDOM()`
- Use fresh fixtures for each test

## Success Criteria

- [ ] All 12 test cases pass
- [ ] All existing c-for tests still pass (no regressions)
- [ ] Code coverage for new object iteration branch > 90%
- [ ] Tests run in <100ms total

---

**Contract Complete**: ✅
**Next**: Implement tests, then implementation
