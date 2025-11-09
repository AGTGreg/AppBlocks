# Research: Object Iteration in c-for

**Phase**: 0 - Research | **Date**: 2025-11-09

## Framework Comparison

### Vue.js `v-for` with Objects

Vue.js supports object iteration with this syntax:

```html
<!-- Single value (value only) -->
<div v-for="value in object">{{ value }}</div>

<!-- Key and value -->
<div v-for="(value, key) in object">{{ key }}: {{ value }}</div>

<!-- Key, value, and index -->
<div v-for="(value, key, index) in object">{{ index }}. {{ key }}: {{ value }}</div>
```

**Key Insights**:
- Uses parentheses `(value, key)` for multiple variables (we'll use comma without parens for simplicity)
- Order is value-first, then key (we'll use key-first for intuitiveness: `key, value`)
- Supports optional index parameter (out of scope for v1)
- Uses `Object.keys()` internally, iterates in enumeration order

### Angular `*ngFor` with Objects

Angular doesn't directly support object iteration - requires conversion:

```typescript
// Component
objectKeys = Object.keys;

// Template
<div *ngFor="let key of objectKeys(myObject)">
  {{ key }}: {{ myObject[key] }}
</div>
```

**Key Insights**:
- No built-in object iteration (design choice to avoid confusion)
- Developers use pipe or helper method
- We can do better - direct support is valuable

### React (No directive equivalent)

React uses JavaScript directly:

```jsx
{Object.entries(myObject).map(([key, value]) => (
  <div key={key}>{key}: {value}</div>
))}
```

**Key Insights**:
- `Object.entries()` is the natural JavaScript approach
- Returns `[key, value]` pairs - perfect for our dual-pointer syntax

## Edge Cases Analysis

### 1. Empty Objects

```javascript
const obj = {};
Object.entries(obj); // Returns []
```

**Behavior**: Should render nothing (same as empty array)
**Test Required**: ✅ Yes

### 2. Null/Undefined Values

```javascript
const obj = null;
Object.entries(obj); // TypeError: Cannot convert undefined or null to object
```

**Behavior**: Should handle gracefully, log error, render nothing
**Test Required**: ✅ Yes

### 3. Objects with Null/Undefined Properties

```javascript
const obj = { a: null, b: undefined, c: 0, d: '' };
Object.entries(obj); // [['a', null], ['b', undefined], ['c', 0], ['d', '']]
```

**Behavior**: Should iterate all properties, let templates handle falsy values
**Test Required**: ✅ Yes

### 4. Nested Objects

```javascript
const obj = { user: { name: 'John', age: 30 } };
// Iteration would give: key='user', value={ name: 'John', age: 30 }
```

**Behavior**: Value is the nested object - templates can access properties
**Test Required**: ✅ Yes

### 5. Inherited Properties (Prototype Chain)

```javascript
function Person(name) { this.name = name; }
Person.prototype.species = 'Human';
const john = new Person('John');

Object.entries(john); // [['name', 'John']] - only own properties
Object.keys(john);    // ['name']
```

**Behavior**: `Object.entries()` only returns own enumerable properties - SAFE
**Test Required**: ✅ Yes (verify prototype properties excluded)

### 6. Symbol Properties

```javascript
const sym = Symbol('id');
const obj = { [sym]: 123, name: 'Test' };
Object.entries(obj); // [['name', 'Test']] - symbols excluded
```

**Behavior**: Symbol keys are excluded by `Object.entries()` - acceptable
**Test Required**: ⚠️ Optional (edge case, document if needed)

### 7. Non-Enumerable Properties

```javascript
const obj = {};
Object.defineProperty(obj, 'hidden', { value: 42, enumerable: false });
obj.visible = 100;
Object.entries(obj); // [['visible', 100]]
```

**Behavior**: Only enumerable properties included - expected
**Test Required**: ⚠️ Optional

### 8. Property Order

```javascript
const obj = { z: 1, a: 2, 5: 3, 1: 4 };
Object.entries(obj); // [['1', 4], ['5', 3], ['z', 1], ['a', 2]]
// Order: integer keys (sorted), then insertion order for string keys
```

**Behavior**: ECMAScript 2015+ guarantees consistent property order
**Test Required**: ⚠️ Optional (trust spec compliance)

## Performance Analysis

### Object.entries() vs Alternatives

```javascript
// Option 1: Object.entries() - RECOMMENDED
const entries = Object.entries(obj);
for (let i = 0; i < entries.length; i++) {
  const [key, value] = entries[i];
  // use key, value
}

// Option 2: Object.keys() + access
const keys = Object.keys(obj);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  const value = obj[key];
  // use key, value
}

// Option 3: for...in loop
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    const value = obj[key];
    // use key, value
  }
}
```

**Performance Characteristics** (Modern browsers):
- `Object.entries()`: Single allocation for array of pairs, destructuring is fast
- `Object.keys()`: Slightly faster (one array vs array of pairs) but requires property access
- `for...in`: Slower due to prototype chain traversal, needs hasOwnProperty check

**Benchmark Results** (informal, typical small objects ~10 props):
- All methods: <0.1ms for typical use cases
- Performance difference negligible for micro apps (not data processing)
- `Object.entries()` provides best DX (developer experience) and safety

**Decision**: Use `Object.entries()` exclusively
- Clean syntax with destructuring
- No prototype chain issues
- Single standard method to maintain
- Performance acceptable for UI rendering context

## Syntax Parsing Approaches

### Approach 1: Simple Split (RECOMMENDED)

```javascript
const attr = "key, value in data.myObject";
const parts = attr.split(' in ');
const leftSide = parts[0].trim(); // "key, value"
const expression = parts[1].trim(); // "data.myObject"

const isDualPointer = leftSide.includes(',');
if (isDualPointer) {
  const pointers = leftSide.split(',').map(p => p.trim());
  const keyPointer = pointers[0];   // "key"
  const valuePointer = pointers[1]; // "value"
}
```

**Pros**: Simple, readable, minimal code, handles whitespace variations
**Cons**: Could fail if comma appears in variable name (but that's invalid JS anyway)

### Approach 2: Regex

```javascript
const pattern = /^(\w+)(?:\s*,\s*(\w+))?\s+in\s+(.+)$/;
const match = attr.match(pattern);
if (match) {
  const valuePointer = match[1];
  const keyPointer = match[2]; // undefined if single pointer
  const expression = match[3];
}
```

**Pros**: More robust, validates syntax
**Cons**: Harder to read, slower, overkill for this use case

**Decision**: Use Approach 1 (simple split) - matches current code style in directives.js

## Security Considerations

### Prototype Pollution Risk Assessment

**Attack Vector**: Could malicious data inject `__proto__` or `constructor` properties?

```javascript
const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
Object.entries(malicious); // [['__proto__', {isAdmin: true}]]
```

**Analysis**:
- `Object.entries()` treats `__proto__` as regular string key (safe in modern engines)
- Assignment to pointers: `pointers[key] = value` could theoretically pollute if key is '__proto__'
- **Risk Level**: LOW - pointers object is ephemeral (one render cycle), not persisted
- **Mitigation**: Current implementation already creates fresh `pointers = {}` each iteration

**Additional Check** (optional paranoia):

```javascript
// Could add blocklist if needed (likely unnecessary)
const BLOCKED_KEYS = ['__proto__', 'constructor', 'prototype'];
if (BLOCKED_KEYS.includes(key)) {
  continue; // skip dangerous keys
}
```

**Decision**: No special handling needed initially. `Object.entries()` is safe, and pointers are ephemeral. Can add key blocklist in future if real-world attack vectors emerge.

### Expression Evaluation Security

Object iteration reuses existing `evaluateTemplateExpression()` for method calls. Security is already handled upstream:

- Method calls go through existing cache/evaluation pipeline
- No new injection vectors introduced
- Same security posture as array iteration

**Decision**: No additional security measures needed.

## Type Detection Strategy

### Priority Order (from plan)

```javascript
const iterable = evaluateTemplateExpression(comp, pointers, node, expression, cache);

// Priority 1: Arrays (most common)
if (Array.isArray(iterable)) {
  // Existing array iteration logic
}

// Priority 2: Iterables (Map, Set, custom iterables)
else if (iterable && typeof iterable[Symbol.iterator] === 'function') {
  // Existing iterable logic
}

// Priority 3: Plain Objects (NEW)
else if (iterable && typeof iterable === 'object' && iterable !== null) {
  // New object iteration logic
}

// Fallback: Not iterable
else {
  logError(...);
  return false;
}
```

**Rationale**:
- Arrays are most common in templates (optimize fast path)
- Iterables (Map/Set) less common but explicitly iterable
- Objects checked last (catch-all for plain objects)
- Explicit null check prevents `typeof null === 'object'` issue

### Edge Case: What if arrays have dual-pointer syntax?

```html
<li c-for="index, item in data.myArray">...</li>
```

**Options**:
1. Treat as array, ignore first pointer (silent)
2. Throw error/warning (strict)
3. Support dual-pointer for arrays (index, item)

**Decision for v1**: Option 1 (silent) - simpler, can add array index support later if requested. Single pointer with arrays continues to work as-is.

## Open Questions Resolution

### Q1: Should dual-pointer syntax work with arrays to provide index?

**Answer**: NO for v1
- Keep scope focused (object iteration only)
- Can be added in future minor version if requested
- Behavior: If dual-pointer used with array, treat as array, second pointer gets item (first pointer ignored)

### Q2: Should we support destructuring in pointers?

**Answer**: NO - out of scope
- Not supported in current implementation
- Complex to parse and implement
- Can be added in future major version if needed

### Q3: Should we warn if dual-pointer syntax used with array?

**Answer**: NO - silent fallback
- Developer might intentionally use dual-pointer for both arrays and objects in generic templates
- No error if it works (second pointer gets item)
- Keep implementation simple

## Implementation Recommendations

### Minimal Changes Approach

1. **Parse dual-pointer syntax** (5 lines)
2. **Add object type detection branch** (15 lines)
3. **Implement Object.entries() iteration** (20 lines)
4. **Total new code**: ~40 lines in directives.js

### Code Location

All changes in `src/directives.js` within the existing `'c-for'` directive function. No new files or modules needed.

### Backward Compatibility Assurance

- Existing array iteration: ZERO changes to code path
- Existing iterable iteration: ZERO changes to code path
- Only adds new branch for objects
- If dual-pointer syntax used with array: falls through to array logic, works normally

## Test Coverage Requirements

### Must-Have Tests

1. ✅ **Basic object iteration**: `key, value in data.obj` with simple object
2. ✅ **Empty object**: Renders nothing
3. ✅ **Null/undefined object**: Handles gracefully, no error thrown in template
4. ✅ **Nested object values**: `key, value in data.obj` where value is object
5. ✅ **Method returning object**: `key, value in getObject()`
6. ✅ **Object with falsy values**: null, undefined, 0, '' properties
7. ✅ **Inherited properties excluded**: Verify prototype chain properties don't appear
8. ✅ **Single pointer with object**: `value in data.obj` (gets value only, key ignored)
9. ✅ **Backward compatibility**: All existing array tests still pass

### Nice-to-Have Tests

10. ⚠️ Object property order consistency
11. ⚠️ Symbol properties excluded
12. ⚠️ Non-enumerable properties excluded

## Performance Expectations

- **Build Size**: Estimated +40 lines × ~25 bytes/line = ~1KB unminified, <500 bytes minified
- **Runtime Overhead**: Negligible - one type check (typeof) added to decision tree
- **Rendering Performance**: Object.entries() is O(n) where n = number of properties - acceptable for UI data

## Next Phase Deliverables

**Phase 1 outputs**:
1. `data-model.md` - Define precise pointer model and syntax grammar
2. `quickstart.md` - Usage examples for developers
3. `contracts/object-iteration.contract.md` - Test contracts defining expected behavior

---

**Research Complete**: ✅
**Key Decisions Made**:
- Use `Object.entries()` exclusively
- Simple split-based syntax parsing
- Type detection priority: Array → Iterable → Object
- No special security measures needed (Object.entries is safe)
- Dual-pointer on arrays = silent fallback (v1)
- Estimated impact: <1KB code, minimal performance overhead
