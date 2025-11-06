# Quickstart: Template and Event Enhancements

**Feature**: 003-template-enhancements
**Date**: November 6, 2025
**For**: Developers implementing and testing the enhancements

## Overview

This guide provides practical examples and patterns for implementing and testing the four template/event enhancements in AppBlocks.

---

## 1. Event Selectors with Spaces

### What Changed

Event selectors now support CSS descendant combinators (spaces) and other complex selectors.

### Before (Current Limitation)

```javascript
const app = new AppBlock({
  el: '#my-app',
  events: {
    // ❌ This doesn't work with current parser:
    // 'click #nav .menu-item': handleMenuClick

    // Workaround required:
    'click': function(e) {
      if (e.target.matches('#nav .menu-item')) {
        this.handleMenuClick(e);
      }
    }
  },
  methods: {
    handleMenuClick(app, e) {
      console.log('Menu clicked:', e.target);
    }
  }
});
```

### After (With Enhancement)

```javascript
const app = new AppBlock({
  el: '#my-app',
  events: {
    // ✅ Complex selectors now work directly:
    'click #nav .menu-item': function(e) {
      console.log('Menu clicked:', e.target);
    },

    // ✅ Multi-level nesting:
    'click .container .section .button': function(e) {
      console.log('Nested button clicked');
    },

    // ✅ Attribute selectors:
    'click [data-action="delete"]': function(e) {
      this.handleDelete(e);
    },

    // ✅ Child combinator:
    'click .parent > .direct-child': function(e) {
      console.log('Direct child clicked');
    }
  }
});
```

### Implementation Notes

**Parsing**: In `core.js`, update event parsing:

```javascript
// OLD: Split on all spaces
const parts = eventString.split(' ');
const eventType = parts[0];
const selector = parts[1]; // ❌ Only gets first word

// NEW: Split on first space only
const firstSpaceIndex = eventString.indexOf(' ');
const eventType = eventString.substring(0, firstSpaceIndex);
const selector = eventString.substring(firstSpaceIndex + 1); // ✅ Gets full selector
```

**Scoping**: Use `comp.el.querySelectorAll(selector)` to restrict to component:

```javascript
// Ensure events only attach to elements inside the component
const elements = comp.el.querySelectorAll(selector);
elements.forEach(el => {
  el.addEventListener(eventType, handler);
});
```

### Testing Examples

```javascript
// tests/core/events.test.js

test('should attach event to nested elements with space-separated selector', () => {
  const handler = jest.fn();
  const app = new AppBlock({
    el: document.getElementById('app'),
    events: {
      'click #parent .child': handler
    }
  });

  const childElement = document.querySelector('#parent .child');
  childElement.click();

  expect(handler).toHaveBeenCalled();
});

test('should scope selector to component element only', () => {
  // Create two components with same selector
  const handler1 = jest.fn();
  const handler2 = jest.fn();

  const app1 = new AppBlock({
    el: '#app1',
    events: { 'click .button': handler1 }
  });

  const app2 = new AppBlock({
    el: '#app2',
    events: { 'click .button': handler2 }
  });

  document.querySelector('#app1 .button').click();

  expect(handler1).toHaveBeenCalled();
  expect(handler2).not.toHaveBeenCalled(); // ✅ Isolated
});
```

---

## 2. Object Iteration in c-for

### What Changed

c-for now supports iterating over objects with developer-defined pointer names for keys and values.

### Before (Current Limitation)

```javascript
const app = new AppBlock({
  el: '#user-profile',
  data: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin'
    }
  },
  template: `
    <!-- ❌ Can't iterate object directly -->
    <!-- Workaround: Convert to array in methods -->
    <div c-for="field in getUserFields()">
      <strong>{field.key}:</strong> {field.value}
    </div>
  `,
  methods: {
    getUserFields(app) {
      return Object.entries(app.data.user).map(([key, value]) => ({ key, value }));
    }
  }
});
```

### After (With Enhancement)

```javascript
const app = new AppBlock({
  el: '#user-profile',
  data: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin'
    }
  },
  template: `
    <!-- ✅ Iterate object directly with custom pointer names -->
    <div c-for="field, info in data.user">
      <strong>{field}:</strong> {info}
    </div>

    <!-- Renders: -->
    <!-- <div><strong>name:</strong> John Doe</div> -->
    <!-- <div><strong>email:</strong> john@example.com</div> -->
    <!-- <div><strong>role:</strong> Admin</div> -->
  `
});
```

### Custom Pointer Names

```javascript
// Use meaningful names for your domain:

// Product SKUs:
template: `<div c-for="sku, product in data.inventory">{sku}: {product.name}</div>`

// Contact IDs:
template: `<div c-for="id, contact in data.contacts">{contact.name} ({id})</div>`

// Configuration keys:
template: `<div c-for="setting, value in data.config">{setting} = {value}</div>`
```

### Implementation Notes

**Parsing**: In `directives.js`, detect 2-pointer vs 1-pointer syntax:

```javascript
function parseCForDirective(directiveValue) {
  // Check for comma (object iteration)
  if (directiveValue.includes(',')) {
    // Object syntax: "key, value in data.object"
    const parts = directiveValue.split(' in ');
    const pointers = parts[0].split(',').map(p => p.trim());
    return {
      type: 'object',
      keyName: pointers[0],
      valueName: pointers[1],
      sourcePath: parts[1].trim()
    };
  } else {
    // Array syntax: "item in data.array"
    const parts = directiveValue.split(' in ');
    return {
      type: 'array',
      itemName: parts[0].trim(),
      sourcePath: parts[1].trim()
    };
  }
}
```

**Runtime Type Detection**:

```javascript
function iterateTarget(target, config, templateFn) {
  if (Array.isArray(target)) {
    // Array iteration (existing logic)
    target.forEach((item, index) => {
      const pointers = { [config.itemName]: item, $index: index };
      templateFn(pointers);
    });
  } else {
    // Object iteration (new logic)
    Object.keys(target).forEach(key => {
      const pointers = {
        [config.keyName]: key,
        [config.valueName]: target[key]
      };
      templateFn(pointers);
    });
  }
}
```

### Testing Examples

```javascript
// tests/directives/c-for.test.js

test('should iterate over object properties with custom pointer names', () => {
  const app = new AppBlock({
    el: '#app',
    data: { user: { name: 'Alice', age: 30 } },
    template: `<div c-for="field, value in data.user">{field}:{value}</div>`
  });

  const divs = document.querySelectorAll('#app div');
  expect(divs.length).toBe(2);
  expect(divs[0].textContent).toBe('name:Alice');
  expect(divs[1].textContent).toBe('age:30');
});

test('should handle empty object gracefully', () => {
  const app = new AppBlock({
    el: '#app',
    data: { empty: {} },
    template: `<div c-for="k, v in data.empty">Should not render</div>`
  });

  const divs = document.querySelectorAll('#app div');
  expect(divs.length).toBe(0); // ✅ No elements rendered
});
```

---

## 3. Method Calls with Parameters

### What Changed

Methods can now be called with parameters from templates. Parameters support strings (single quotes), numbers, booleans, and property references.

### Before (Current Limitation)

```javascript
const app = new AppBlock({
  el: '#product-list',
  data: {
    products: [
      { name: 'Widget', price: 29.99, currency: 'USD' },
      { name: 'Gadget', price: 49.99, currency: 'EUR' }
    ]
  },
  template: `
    <div c-for="product in data.products">
      <!-- ❌ Can't call method with parameters -->
      {product.name}: {product.price} {product.currency}
      <!-- Must format manually or use filters only -->
    </div>
  `
});
```

### After (With Enhancement)

```javascript
const app = new AppBlock({
  el: '#product-list',
  data: {
    products: [
      { name: 'Widget', price: 29.99, currency: 'USD' },
      { name: 'Gadget', price: 49.99, currency: 'EUR' }
    ]
  },
  template: `
    <div c-for="product in data.products">
      <!-- ✅ Call method with parameters -->
      {product.name}: {formatPrice(product.price, product.currency)}
    </div>
  `,
  methods: {
    // Note: First parameter (app) is auto-injected
    formatPrice(app, amount, currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  }
});
```

### Parameter Types

```javascript
methods: {
  // String literals (single quotes)
  greet(app, message, name) {
    return `${message}, ${name}!`;
  }
  // Called as: {greet('Hello', data.user.name)}

  // Numeric literals
  calculate(app, value, multiplier, offset) {
    return value * multiplier + offset;
  }
  // Called as: {calculate(data.amount, 1.5, 10)}

  // Boolean literals
  formatStatus(app, isActive, showIcon) {
    return isActive && showIcon ? '✓ Active' : 'Inactive';
  }
  // Called as: {formatStatus(data.user.isActive, true)}

  // Nested method calls
  displayDate(app, timestamp) {
    return new Date(timestamp).toLocaleDateString();
  },
  getCurrentTimestamp(app) {
    return Date.now();
  }
  // Called as: {displayDate(getCurrentTimestamp())}
}
```

### Methods in Directives

```javascript
// c-for with method call
template: `
  <div c-for="item in getFilteredItems('active')">
    {item.name}
  </div>
`

// c-if with method call
template: `
  <div c-if="isAuthorized(data.user.role, 'admin')">
    Admin panel
  </div>
`

methods: {
  getFilteredItems(app, status) {
    return app.data.items.filter(item => item.status === status);
  },
  isAuthorized(app, userRole, requiredRole) {
    return userRole === requiredRole;
  }
}
```

### Implementation Notes

**Parsing**: Create tokenizer in `processing.js`:

```javascript
function parseMethodCall(expression) {
  // Extract method name
  const methodMatch = expression.match(/^(\w+)\((.*)\)$/);
  if (!methodMatch) return null;

  const methodName = methodMatch[1];
  const paramsString = methodMatch[2];

  // Tokenize parameters
  const parameters = [];
  let current = '';
  let inString = false;

  for (let i = 0; i < paramsString.length; i++) {
    const char = paramsString[i];

    if (char === "'" && (i === 0 || paramsString[i-1] !== '\\')) {
      inString = !inString;
      current += char;
    } else if (char === ',' && !inString) {
      parameters.push(parseParameter(current.trim()));
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parameters.push(parseParameter(current.trim()));
  }

  return { methodName, parameters };
}

function parseParameter(param) {
  // String literal
  if (param.startsWith("'") && param.endsWith("'")) {
    return { type: 'string', value: param.slice(1, -1) };
  }
  // Numeric literal
  if (/^-?\d+(\.\d+)?$/.test(param)) {
    return { type: 'number', value: parseFloat(param) };
  }
  // Boolean literal
  if (param === 'true' || param === 'false') {
    return { type: 'boolean', value: param === 'true' };
  }
  // Property reference
  return { type: 'property', value: param };
}
```

**Execution**: Auto-inject app instance:

```javascript
function executeMethodCall(comp, methodCallExpression) {
  const { methodName, parameters } = methodCallExpression;

  if (!comp.methods[methodName]) {
    console.error(`AppBlocks: Method '${methodName}' not found`);
    return '';
  }

  // Resolve parameters
  const resolvedParams = parameters.map(param => {
    if (param.type === 'property') {
      return getProp(comp.data, param.value);
    }
    return param.value;
  });

  try {
    // Auto-inject comp as first parameter
    return comp.methods[methodName](comp, ...resolvedParams);
  } catch (error) {
    console.error(`AppBlocks: Method '${methodName}' threw error:`, error);
    return ''; // Graceful degradation
  }
}
```

### Testing Examples

```javascript
// tests/placeholders/textNodes.test.js

test('should call method with string literal parameter', () => {
  const app = new AppBlock({
    el: '#app',
    data: { name: 'World' },
    template: `<div>{greet('Hello')}</div>`,
    methods: {
      greet(app, message) {
        return `${message}, ${app.data.name}!`;
      }
    }
  });

  expect(document.querySelector('#app div').textContent).toBe('Hello, World!');
});

test('should call method with property reference parameter', () => {
  const app = new AppBlock({
    el: '#app',
    data: { value: 10 },
    template: `<div>{double(data.value)}</div>`,
    methods: {
      double(app, num) {
        return num * 2;
      }
    }
  });

  expect(document.querySelector('#app div').textContent).toBe('20');
});

test('should handle method not found gracefully', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

  const app = new AppBlock({
    el: '#app',
    template: `<div>{unknownMethod()}</div>`
  });

  expect(document.querySelector('#app div').textContent).toBe(''); // Empty string
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("Method 'unknownMethod' not found")
  );

  consoleSpy.mockRestore();
});
```

---

## 4. Logical Operators in c-if

### What Changed

c-if conditions now support `and`, `or`, and `not` logical operators with proper precedence.

### Before (Current Limitation)

```javascript
const app = new AppBlock({
  el: '#dashboard',
  data: {
    user: { isActive: true, role: 'admin', isVerified: true }
  },
  template: `
    <!-- ❌ Can't combine conditions, need nested directives -->
    <div c-if="data.user.isActive">
      <div c-if="data.user.role == 'admin'">
        Admin Dashboard
      </div>
    </div>
  `
});
```

### After (With Enhancement)

```javascript
const app = new AppBlock({
  el: '#dashboard',
  data: {
    user: { isActive: true, role: 'admin', isVerified: true }
  },
  template: `
    <!-- ✅ Combine conditions with logical operators -->
    <div c-if="data.user.isActive and data.user.role == 'admin'">
      Admin Dashboard
    </div>

    <!-- ✅ OR conditions -->
    <div c-if="data.user.role == 'admin' or data.user.role == 'moderator'">
      Management Tools
    </div>

    <!-- ✅ NOT operator -->
    <div c-if="not data.user.isBlocked">
      Welcome!
    </div>

    <!-- ✅ Complex with parentheses -->
    <div c-if="data.user.isActive and (data.user.isVerified or data.user.isTrusted)">
      Full Access
    </div>
  `
});
```

### Operator Precedence

```javascript
// 1. Comparisons (highest)
// 2. not
// 3. and
// 4. or (lowest)

// Example: data.age > 18 and not data.isBlocked or data.isAdmin
// Evaluates as: ((data.age > 18) and (not data.isBlocked)) or data.isAdmin

// Use parentheses for clarity:
template: `
  <div c-if="(data.age > 18 and not data.isBlocked) or data.isAdmin">
    Content
  </div>
`
```

### Implementation Notes

**Parsing**: Build expression tree with precedence:

```javascript
function parseLogicalExpression(conditionString) {
  // Tokenize
  const tokens = tokenize(conditionString);

  // Build expression tree
  return parseOr(tokens); // Start with lowest precedence
}

function parseOr(tokens) {
  let left = parseAnd(tokens);

  while (tokens[0] === 'or') {
    tokens.shift(); // Consume 'or'
    const right = parseAnd(tokens);
    left = { type: 'logical', operator: 'or', left, right };
  }

  return left;
}

function parseAnd(tokens) {
  let left = parseNot(tokens);

  while (tokens[0] === 'and') {
    tokens.shift(); // Consume 'and'
    const right = parseNot(tokens);
    left = { type: 'logical', operator: 'and', left, right };
  }

  return left;
}

function parseNot(tokens) {
  if (tokens[0] === 'not') {
    tokens.shift(); // Consume 'not'
    return { type: 'unary', operator: 'not', operand: parseNot(tokens) };
  }

  return parseComparison(tokens);
}

function parseComparison(tokens) {
  let left = parsePrimary(tokens);

  const comparisonOps = ['==', '!=', '>', '<', '>=', '<='];
  if (comparisonOps.includes(tokens[0])) {
    const operator = tokens.shift();
    const right = parsePrimary(tokens);
    return { type: 'comparison', operator, left, right };
  }

  return left;
}

function parsePrimary(tokens) {
  // Handle parentheses
  if (tokens[0] === '(') {
    tokens.shift(); // Consume '('
    const expr = parseOr(tokens);
    tokens.shift(); // Consume ')'
    return expr;
  }

  // Identifier or literal
  return { type: 'identifier', value: tokens.shift() };
}
```

**Evaluation**: Recursive tree traversal:

```javascript
function evaluateLogicalExpression(comp, expressionTree) {
  switch (expressionTree.type) {
    case 'logical':
      const left = evaluateLogicalExpression(comp, expressionTree.left);
      const right = evaluateLogicalExpression(comp, expressionTree.right);
      if (expressionTree.operator === 'and') return left && right;
      if (expressionTree.operator === 'or') return left || right;
      break;

    case 'unary':
      const operand = evaluateLogicalExpression(comp, expressionTree.operand);
      return !operand;

    case 'comparison':
      const leftVal = resolveValue(comp, expressionTree.left);
      const rightVal = resolveValue(comp, expressionTree.right);
      return compare(leftVal, expressionTree.operator, rightVal);

    case 'identifier':
      return resolveValue(comp, expressionTree);
  }
}

function resolveValue(comp, node) {
  if (node.type === 'identifier') {
    return getProp(comp.data, node.value);
  }
  return node.value; // Literal
}
```

### Testing Examples

```javascript
// tests/directives/c-if.test.js

test('should evaluate AND operator correctly', () => {
  const app = new AppBlock({
    el: '#app',
    data: { a: true, b: true },
    template: `<div c-if="data.a and data.b">Show</div>`
  });

  expect(document.querySelector('#app div')).toBeTruthy();
});

test('should evaluate OR operator correctly', () => {
  const app = new AppBlock({
    el: '#app',
    data: { a: false, b: true },
    template: `<div c-if="data.a or data.b">Show</div>`
  });

  expect(document.querySelector('#app div')).toBeTruthy();
});

test('should evaluate NOT operator correctly', () => {
  const app = new AppBlock({
    el: '#app',
    data: { blocked: false },
    template: `<div c-if="not data.blocked">Show</div>`
  });

  expect(document.querySelector('#app div')).toBeTruthy();
});

test('should respect operator precedence', () => {
  const app = new AppBlock({
    el: '#app',
    data: { a: true, b: false, c: false },
    template: `<div c-if="data.a and data.b or data.c">Show</div>`
  });

  // (true and false) or false = false or false = false
  expect(document.querySelector('#app div')).toBeFalsy();
});

test('should respect parentheses grouping', () => {
  const app = new AppBlock({
    el: '#app',
    data: { a: true, b: false, c: true },
    template: `<div c-if="data.a and (data.b or data.c)">Show</div>`
  });

  // true and (false or true) = true and true = true
  expect(document.querySelector('#app div')).toBeTruthy();
});
```

---

## Development Workflow

### Step 1: Write Tests First (TDD)

```bash
# Run tests for specific module while developing
npm run test:core          # Event selector tests
npm run test:directives    # c-for and c-if tests
npm run test:processing    # Method call parsing tests
npm run test:watch         # Watch mode during development
```

### Step 2: Implement Features

1. **Event Selectors**: Update `src/core.js`
2. **c-for Objects**: Update `src/directives.js`
3. **Method Calls**: Update `src/processing.js` and `src/placeholders.js`
4. **Logical Operators**: Update `src/directives.js` (c-if handler)

### Step 3: Integration Testing

```javascript
// Test multiple features together
test('should use method calls in c-for with object iteration', () => {
  const app = new AppBlock({
    el: '#app',
    data: {
      prices: { small: 10, medium: 20, large: 30 }
    },
    template: `
      <div c-for="size, price in data.prices">
        {size}: {formatCurrency(price)}
      </div>
    `,
    methods: {
      formatCurrency(app, amount) {
        return `$${amount.toFixed(2)}`;
      }
    }
  });

  const divs = document.querySelectorAll('#app div');
  expect(divs[0].textContent).toBe('small: $10.00');
  expect(divs[1].textContent).toBe('medium: $20.00');
  expect(divs[2].textContent).toBe('large: $30.00');
});
```

### Step 4: Performance Testing

```javascript
// Benchmark rendering time
test('should render within performance budget', () => {
  const start = performance.now();

  const app = new AppBlock({
    el: '#app',
    data: { items: new Array(1000).fill({ name: 'Test', price: 10 }) },
    template: `
      <div c-for="item in data.items">
        {formatPrice(item.price, 'USD')}
      </div>
    `,
    methods: {
      formatPrice(app, price, currency) {
        return `${currency} ${price}`;
      }
    }
  });

  const duration = performance.now() - start;
  expect(duration).toBeLessThan(100); // Adjust threshold as needed
});
```

---

## Common Patterns

### Pattern 1: Filtered Lists with Method Calls

```javascript
template: `
  <div c-for="item in getActiveItems()">
    {formatItem(item)}
  </div>
`,
methods: {
  getActiveItems(app) {
    return app.data.items.filter(item => item.active);
  },
  formatItem(app, item) {
    return `${item.name} - ${item.status}`;
  }
}
```

### Pattern 2: Conditional Rendering with Complex Logic

```javascript
template: `
  <div c-if="isEligible(data.user.age, data.user.membership) and not data.user.suspended">
    Premium Content
  </div>
`,
methods: {
  isEligible(app, age, membership) {
    return age >= 18 && membership === 'premium';
  }
}
```

### Pattern 3: Dynamic Event Handlers

```javascript
events: {
  'click .item[data-category="electronics"] .delete-btn': function(e) {
    this.handleElectronicsDelete(e);
  },
  'click .item[data-category="books"] .delete-btn': function(e) {
    this.handleBooksDelete(e);
  }
}
```

### Pattern 4: Object Metadata Display

```javascript
template: `
  <table>
    <tr c-for="key, value in data.metadata">
      <td>{formatKey(key)}</td>
      <td>{formatValue(value)}</td>
    </tr>
  </table>
`,
methods: {
  formatKey(app, key) {
    return key.replace(/_/g, ' ').toUpperCase();
  },
  formatValue(app, value) {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
}
```

---

## Troubleshooting

### Issue: Event not firing with complex selector

**Check**:
1. Selector is scoped to component element
2. Selector is valid CSS syntax
3. Check browser console for selector errors

```javascript
// Debug: Log matched elements
const elements = comp.el.querySelectorAll(selector);
console.log('Matched elements:', elements);
```

### Issue: c-for not iterating object

**Check**:
1. Syntax uses 2 pointers: `key, value in ...`
2. Data path resolves to object (not array)
3. Object has own enumerable properties

```javascript
// Debug: Check object type and contents
console.log('Type:', Array.isArray(target));
console.log('Keys:', Object.keys(target));
```

### Issue: Method call returns empty string

**Check browser console** for error messages:
- Method not found → Check method name spelling
- Parameter error → Check parameter types (quotes for strings)
- Method throws error → Check method implementation

### Issue: Logical expression not evaluating correctly

**Check**:
1. Operator precedence (use parentheses for clarity)
2. Property paths resolve correctly
3. Truthy/falsy values (empty strings, 0, etc.)

```javascript
// Debug: Log expression evaluation
console.log('Condition result:', evaluateExpression(comp, expression));
```

---

## Next Steps

After implementing features:

1. **Run full test suite**: `npm test`
2. **Check coverage**: `npm run test:coverage`
3. **Build library**: `npm run build`
4. **Update documentation**: See documentation section in plan.md
5. **Update changelog**: Add entries to `docs/changelog.md`

Ready to proceed to Phase 2 (Task Decomposition).
