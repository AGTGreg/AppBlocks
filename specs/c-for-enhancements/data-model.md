# Data Model: c-for Object Iteration

**Phase**: 1 - Design | **Date**: 2025-11-09

## Syntax Grammar

### Formal Definition

```ebnf
c-for-attribute ::= pointer-declaration " in " expression

pointer-declaration ::= single-pointer | dual-pointer

single-pointer ::= identifier

dual-pointer ::= identifier "," whitespace* identifier

expression ::= data-path | method-call

identifier ::= [a-zA-Z_$][a-zA-Z0-9_$]*
```

### Valid Syntax Examples

```html
<!-- Single pointer (existing - arrays/iterables) -->
<li c-for="item in data.items">...</li>
<li c-for="user in data.users">...</li>
<li c-for="value in getValue()">...</li>

<!-- Dual pointer (new - objects) -->
<li c-for="key, value in data.config">...</li>
<li c-for="name, user in data.userMap">...</li>
<li c-for="prop, val in getSettings()">...</li>

<!-- Whitespace variations (all valid) -->
<li c-for="key,value in data.obj">...</li>
<li c-for="key , value in data.obj">...</li>
<li c-for="key, value in data.obj">...</li>
```

### Invalid Syntax (not supported in v1)

```html
<!-- Destructuring - NOT SUPPORTED -->
<li c-for="key, {id, name} in data.users">...</li>

<!-- Triple pointer - NOT SUPPORTED -->
<li c-for="key, value, index in data.obj">...</li>

<!-- No pointer - INVALID -->
<li c-for="in data.items">...</li>
```

## Pointer Model

### Pointer Lifecycle

The `pointers` object is an ephemeral data structure that exists during template rendering to provide iteration context.

```javascript
// Initial state
pointers = {}; // or existing pointers from parent c-for

// During iteration (single pointer - array)
pointers[pointer] = item;
// Example: pointers.item = { id: 1, name: 'John' }

// During iteration (dual pointer - object)
pointers[keyPointer] = key;
pointers[valuePointer] = value;
// Example: pointers.userId = 'user_123'
//          pointers.user = { id: 1, name: 'John' }

// After iteration completes
// pointers is passed to processNode() for nested processing
```

### Pointer Scope

**Single c-for**:
```html
<template>
  <li c-for="key, value in data.settings">
    {key}: {value}
    <!-- key and value are available here -->
  </li>
  <!-- key and value are NOT available here -->
</template>
```

**Nested c-for** (pointers accumulate):
```html
<template>
  <div c-for="category, items in data.products">
    <h2>{category}</h2>
    <ul>
      <li c-for="item in items">
        {category} - {item.name}
        <!-- Both 'category' and 'item' available -->
      </li>
    </ul>
  </div>
</template>
```

**Data Structure**:
```javascript
{
  products: {
    electronics: [
      { name: 'Laptop' },
      { name: 'Phone' }
    ],
    books: [
      { name: 'JavaScript Guide' }
    ]
  }
}

// Outer iteration:
// pointers = { category: 'electronics', items: [...] }

// Inner iteration (first item):
// pointers = { category: 'electronics', items: [...], item: { name: 'Laptop' } }
```

## Type Detection Logic

### Decision Tree

```javascript
const iterable = evaluateTemplateExpression(comp, pointers, node, iterableExpr, cache);

// Step 1: Check for null/undefined
if (iterable === null || iterable === undefined) {
  // Log error if expression returned something (not just missing data)
  if (iterable !== undefined) {
    logError(comp, `[c-for] Expression '${iterableExpr}' is null`);
  }
  return false; // Remove node
}

// Step 2: Arrays (highest priority - most common)
if (Array.isArray(iterable)) {
  → Use array iteration logic (existing)
  → Supports single pointer only in v1
  → If dual pointer provided, second pointer gets item (first ignored)
}

// Step 3: Iterables (Map, Set, custom iterables)
else if (typeof iterable[Symbol.iterator] === 'function') {
  → Use iterable iteration logic (existing)
  → Supports single pointer only in v1
  → Iterates using for...of or length-based loop
}

// Step 4: Plain Objects (new)
else if (typeof iterable === 'object') {
  → Use object iteration logic (new)
  → Supports single pointer (value only) or dual pointer (key, value)
  → Uses Object.entries()
}

// Step 5: Not iterable
else {
  logError(comp, `[c-for] Result is not iterable: ${iterableExpr}`);
  return false; // Remove node
}
```

### Type Detection Priority Rationale

1. **Arrays first**: ~80% of use cases, fastest check (`Array.isArray`)
2. **Iterables second**: Map/Set are explicitly iterable, check before objects
3. **Objects last**: Catch-all for plain objects (most permissive check)

### Edge Cases

| Input | Type Detection | Behavior |
|-------|---------------|----------|
| `[]` | Array | Iterate (0 iterations) |
| `{}` | Object | Iterate (0 iterations) |
| `null` | null | Log error, remove node |
| `undefined` | undefined | Silent fail, remove node (data missing) |
| `new Map()` | Iterable | Use iterable logic |
| `new Set()` | Iterable | Use iterable logic |
| `'string'` | Not iterable | Log error, remove node |
| `123` | Not iterable | Log error, remove node |
| `true` | Not iterable | Log error, remove node |

## Iteration Algorithms

### Array Iteration (Existing - No Changes)

```javascript
// Single pointer syntax: "item in data.items"
if (Array.isArray(iterable)) {
  node.removeAttribute('c-for');
  const parentNode = node.parentNode;

  for (let i = 0; i < iterable.length; i++) {
    const item = iterable[i];
    pointers[pointer] = item;

    const newNode = node.cloneNode(true);
    processNode(comp, newNode, pointers, cache);
    updateAttributePlaceholders(comp, newNode, pointers, cache);
    updateTextNodePlaceholders(comp, newNode, pointers, cache);

    // Reset pointer for next iteration
    stParts = attr.split(' in ');
    pointer = stParts[0];
    parentNode.appendChild(newNode);
  }
  node.remove();
  return true;
}
```

### Object Iteration (New)

```javascript
// Dual pointer syntax: "key, value in data.config"
// Single pointer syntax: "value in data.config" (key ignored)

if (typeof iterable === 'object' && iterable !== null) {
  node.removeAttribute('c-for');
  const parentNode = node.parentNode;

  const entries = Object.entries(iterable);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    // Assign based on pointer count
    if (isDualPointer) {
      pointers[keyPointer] = key;
      pointers[valuePointer] = value;
    } else {
      pointers[valuePointer] = value; // Single pointer gets value only
    }

    const newNode = node.cloneNode(true);
    processNode(comp, newNode, pointers, cache);
    updateAttributePlaceholders(comp, newNode, pointers, cache);
    updateTextNodePlaceholders(comp, newNode, pointers, cache);

    parentNode.appendChild(newNode);
  }

  node.remove();
  return true;
}
```

## Parsing Implementation

### Attribute Parsing

```javascript
const attr = node.getAttribute('c-for');
// Example: "key, value in data.myObject"

// Step 1: Split on ' in '
const parts = attr.split(' in ');
if (parts.length !== 2) {
  logError(comp, `[c-for] Invalid syntax: ${attr}`);
  return false;
}

const leftSide = parts[0].trim();   // "key, value"
const expression = parts[1].trim(); // "data.myObject"

// Step 2: Detect single vs dual pointer
const isDualPointer = leftSide.includes(',');

// Step 3: Extract pointers
let keyPointer, valuePointer;

if (isDualPointer) {
  const pointerParts = leftSide.split(',').map(p => p.trim());

  if (pointerParts.length !== 2) {
    logError(comp, `[c-for] Invalid pointer syntax: ${leftSide}`);
    return false;
  }

  keyPointer = pointerParts[0];     // "key"
  valuePointer = pointerParts[1];   // "value"
} else {
  // Single pointer
  valuePointer = leftSide;           // Original behavior
  keyPointer = null;
}
```

### Validation

**Valid identifiers**: Must match JavaScript identifier rules
```javascript
// Valid
"item", "user", "key", "value", "_index", "$item", "item1"

// Invalid (though not validated - developer responsibility)
"1item", "item-name", "item.name"
```

**No validation in v1**: Trust developer to use valid identifiers. JavaScript will naturally error if invalid.

## Error Handling

### Error Scenarios

| Scenario | Detection | Behavior | Error Message |
|----------|-----------|----------|---------------|
| Expression is null | `iterable === null` | Remove node | `[c-for] Expression 'expr' is null` |
| Expression is undefined | `iterable === undefined` | Remove node silently | None (missing data is normal) |
| Not iterable (string, number, etc.) | Type checks fail | Remove node | `[c-for] Result is not iterable: expr` |
| Method throws error | Caught by evaluateTemplateExpression | Remove node | Logged by method call handler |
| Invalid syntax (missing ' in ') | `parts.length !== 2` | Remove node | `[c-for] Invalid syntax: attr` |
| Invalid dual pointer (3+ commas) | `pointerParts.length !== 2` | Remove node | `[c-for] Invalid pointer syntax: leftSide` |

### Error Logging Strategy

Use existing `logError(comp, message)` helper:
- Respects `debug` configuration
- Includes app name for multi-app pages
- Non-blocking (doesn't throw, just logs)

## Method Call Integration

### Single Pointer with Method

```html
<li c-for="user in getActiveUsers()">
  {user.name}
</li>
```

```javascript
methods: {
  getActiveUsers(app) {
    return app.data.users.filter(u => u.active);
  }
}
```

**Flow**:
1. `evaluateTemplateExpression()` evaluates `"getActiveUsers()"`
2. Returns array of user objects
3. Type detection: Array
4. Array iteration logic executes
5. Each iteration: `pointers.user = { id: 1, name: 'John', active: true }`

### Dual Pointer with Method

```html
<li c-for="key, setting in getUserSettings()">
  {key}: {setting.value}
</li>
```

```javascript
methods: {
  getUserSettings(app) {
    return {
      theme: { value: 'dark' },
      language: { value: 'en' },
      notifications: { value: true }
    };
  }
}
```

**Flow**:
1. `evaluateTemplateExpression()` evaluates `"getUserSettings()"`
2. Returns object with settings
3. Type detection: Object
4. Object iteration logic executes
5. Each iteration:
   - First: `pointers.key = 'theme'`, `pointers.setting = { value: 'dark' }`
   - Second: `pointers.key = 'language'`, `pointers.setting = { value: 'en' }`
   - etc.

### Method Call Caching

Method results are cached per render cycle (existing behavior):
```javascript
// If same method called multiple times in same render, cached result reused
<div c-for="item in getItems()">...</div>
<span>{getItems().length}</span>
<!-- getItems() only called once -->
```

No changes needed for object iteration - cache works the same.

## Pointer Naming Conventions

### Recommended Patterns

**Objects** (dual pointer):
```html
<!-- Configuration maps -->
<div c-for="key, value in data.config">
<div c-for="setting, value in data.settings">
<div c-for="name, value in data.preferences">

<!-- Entity lookups -->
<div c-for="id, user in data.usersById">
<div c-for="userId, profile in data.profiles">

<!-- Descriptive names -->
<div c-for="category, products in data.catalog">
<div c-for="status, count in data.stats">
```

**Arrays** (single pointer):
```html
<!-- Collections -->
<div c-for="item in data.items">
<div c-for="user in data.users">
<div c-for="product in data.products">

<!-- Descriptive singular -->
<div c-for="task in data.tasks">
<div c-for="message in data.messages">
```

### Anti-Patterns (avoid)

```html
<!-- Too generic -->
<div c-for="k, v in data.config">  <!-- Use descriptive names -->

<!-- Confusing -->
<div c-for="value, key in data.obj">  <!-- key comes first by convention -->

<!-- Hungarian notation -->
<div c-for="strKey, objValue in data.map">  <!-- Unnecessary -->
```

## Data Structure Examples

### Example 1: User Settings

**Data**:
```javascript
{
  settings: {
    theme: 'dark',
    fontSize: 16,
    notifications: true,
    autoSave: false
  }
}
```

**Template**:
```html
<ul>
  <li c-for="setting, value in data.settings">
    <strong>{setting}:</strong> {value}
  </li>
</ul>
```

**Output**:
```
• theme: dark
• fontSize: 16
• notifications: true
• autoSave: false
```

### Example 2: Nested Structure

**Data**:
```javascript
{
  departments: {
    engineering: [
      { name: 'Alice', role: 'Dev' },
      { name: 'Bob', role: 'Lead' }
    ],
    sales: [
      { name: 'Carol', role: 'Rep' }
    ]
  }
}
```

**Template**:
```html
<div c-for="dept, employees in data.departments">
  <h3>{dept}</h3>
  <ul>
    <li c-for="emp in employees">
      {emp.name} - {emp.role}
    </li>
  </ul>
</div>
```

**Output**:
```
engineering
  • Alice - Dev
  • Bob - Lead

sales
  • Carol - Rep
```

### Example 3: API Response

**Data** (from API):
```javascript
{
  stats: {
    total_users: 1523,
    active_sessions: 42,
    pending_tasks: 7,
    completed_tasks: 156
  }
}
```

**Template**:
```html
<div c-for="metric, count in data.stats">
  <div class="stat-card">
    <span class="label">{metric}</span>
    <span class="value">{count}</span>
  </div>
</div>
```

## Backward Compatibility Matrix

| Existing Syntax | Object Iteration Impact | Still Works? |
|-----------------|------------------------|--------------|
| `item in data.arr` | None (array detected first) | ✅ Yes |
| `item in data.arr` with object | Object iteration used | ✅ Yes (new feature) |
| `item in getItems()` | None (method returns array) | ✅ Yes |
| `item in getObj()` | Object iteration used | ✅ Yes (new feature) |
| `item in data.map` (Map instance) | None (iterable detected) | ✅ Yes |

**Guarantee**: All existing tests must pass without modification.

## Implementation Checklist

- [ ] Parse `c-for` attribute to extract pointer(s) and expression
- [ ] Detect single vs dual pointer syntax (comma check)
- [ ] Add object type detection branch (after array/iterable checks)
- [ ] Implement Object.entries() iteration
- [ ] Assign key and value to pointers correctly
- [ ] Handle single pointer with objects (value only)
- [ ] Ensure all existing array/iterable tests still pass
- [ ] Add error handling for null/undefined/non-iterable

---

**Data Model Complete**: ✅
**Next**: Create quickstart.md and contracts/
