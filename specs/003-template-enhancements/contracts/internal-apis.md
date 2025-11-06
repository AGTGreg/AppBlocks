# Internal Contracts: Template and Event Enhancements

**Feature**: 003-template-enhancements
**Date**: November 6, 2025

## Overview

This feature extends existing AppBlocks functionality without introducing new public APIs. All enhancements are backward-compatible extensions to existing syntax. This document defines internal contracts between modules.

---

## Public API - No Changes

**Status**: ✅ No breaking changes, no new exports

All four enhancements work through existing public APIs:
- Event handlers: Already configured via `events: {}` object
- c-for directive: Already exists, syntax extended
- c-if directive: Already exists, syntax extended
- Methods: Already callable from templates, now with parameters

Existing applications continue to work without modification.

---

## Internal Module Contracts

### 1. Event Parsing (core.js)

**Function**: `parseEventDefinition(eventString)`

**Input**:
```javascript
{
  eventString: "click #parent .child"  // "eventType selector"
}
```

**Output**:
```javascript
{
  eventType: "click",
  selector: "#parent .child",
  isValid: true
}

// On error:
{
  eventType: null,
  selector: null,
  isValid: false,
  error: "Error message"
}
```

**Contract**:
- MUST split on first space only
- MUST preserve all subsequent spaces in selector
- MUST return isValid flag for error handling
- MUST work with selectors containing no spaces (backward compatibility)

---

### 2. c-for Directive Parsing (directives.js)

**Function**: `parseCForDirective(directiveValue)`

**Input**:
```javascript
{
  directiveValue: "key, value in data.users"  // or "item in data.items"
}
```

**Output**:
```javascript
// Object syntax (2 pointers):
{
  type: "object",
  keyName: "key",
  valueName: "value",
  sourcePath: "data.users",
  isValid: true
}

// Array syntax (1 pointer):
{
  type: "array",
  itemName: "item",
  sourcePath: "data.items",
  isValid: true
}

// On error:
{
  type: null,
  isValid: false,
  error: "Error message"
}
```

**Contract**:
- MUST detect comma to distinguish 1-pointer vs 2-pointer syntax
- MUST extract developer-defined pointer names
- MUST extract source path (everything after "in")
- MUST validate syntax and return error state

---

**Function**: `iterateTarget(target, iteratorConfig, templateFn)`

**Input**:
```javascript
{
  target: [...] or {...},          // Data to iterate
  iteratorConfig: {                // Output from parseCForDirective
    type: "array" | "object",
    itemName/keyName: "...",
    valueName: "...",
    sourcePath: "..."
  },
  templateFn: function(pointers) { // Function to render template with pointers
    // Return rendered HTML
  }
}
```

**Output**:
```javascript
{
  html: "<div>...</div><div>...</div>",  // Concatenated rendered elements
  count: 2                                // Number of iterations
}
```

**Contract**:
- MUST use `Array.isArray()` for type detection at runtime
- MUST use `Object.keys()` for object iteration (own enumerable properties only)
- MUST call templateFn for each iteration with current pointers
- MUST handle empty arrays/objects gracefully (zero iterations, no error)
- MUST not mutate source data during iteration

---

### 3. Method Call Parsing (processing.js or new utils/parser.js)

**Function**: `parseMethodCall(expressionString)`

**Input**:
```javascript
{
  expressionString: "formatPrice(data.amount, 'USD')"
}
```

**Output**:
```javascript
{
  methodName: "formatPrice",
  parameters: [
    { type: "property", value: "data.amount", raw: "data.amount" },
    { type: "string", value: "USD", raw: "'USD'" }
  ],
  isValid: true,
  sourceString: "formatPrice(data.amount, 'USD')"
}

// On error:
{
  methodName: null,
  parameters: [],
  isValid: false,
  error: "Error message",
  sourceString: "..."
}
```

**Contract**:
- MUST extract method name before opening parenthesis
- MUST parse parameters respecting:
  - Single-quoted strings: `'text'` → string literal
  - Unquoted identifiers: `data.path` → property reference
  - Numbers: `42`, `3.14` → numeric literal
  - Booleans: `true`, `false` → boolean literal
  - Nested calls: `method()` → recursive parse
- MUST handle escaped quotes within strings: `'don\'t'`
- MUST handle whitespace around parameters
- MUST support zero parameters: `method()` or `method`

---

**Function**: `executeMethodCall(component, methodCallExpression)`

**Input**:
```javascript
{
  component: AppBlockInstance,  // Component with methods and data
  methodCallExpression: {       // Output from parseMethodCall
    methodName: "formatPrice",
    parameters: [...]
  }
}
```

**Output**:
```javascript
{
  result: "$42.00",         // Method return value
  success: true
}

// On error:
{
  result: "",               // Empty string for graceful degradation
  success: false,
  error: "Error message"
}
```

**Contract**:
- MUST resolve property path parameters using `getProp(component.data, path)`
- MUST auto-inject component as first parameter to method
- MUST execute method: `component.methods[methodName](component, ...resolvedParams)`
- MUST catch and log errors, return empty string on failure
- MUST handle missing methods gracefully
- MUST handle method exceptions gracefully

---

### 4. Logical Expression Parsing (directives.js)

**Function**: `parseLogicalExpression(conditionString)`

**Input**:
```javascript
{
  conditionString: "data.isActive and (data.age > 18 or data.isAdmin)"
}
```

**Output**:
```javascript
{
  expression: {
    type: "logical",
    operator: "and",
    left: { type: "identifier", value: "data.isActive" },
    right: {
      type: "logical",
      operator: "or",
      left: {
        type: "comparison",
        operator: ">",
        left: { type: "identifier", value: "data.age" },
        right: { type: "literal", value: 18 }
      },
      right: { type: "identifier", value: "data.isAdmin" }
    }
  },
  isValid: true
}

// On error:
{
  expression: null,
  isValid: false,
  error: "Error message"
}
```

**Contract**:
- MUST parse with proper precedence: comparisons > not > and > or
- MUST respect parentheses for grouping
- MUST build expression tree recursively
- MUST handle both `data.path` and simple identifiers
- MUST recognize all comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
- MUST recognize logical operators: `and`, `or`, `not`

---

**Function**: `evaluateLogicalExpression(component, expressionTree)`

**Input**:
```javascript
{
  component: AppBlockInstance,  // Component with data
  expressionTree: {             // Output from parseLogicalExpression
    type: "logical",
    operator: "and",
    left: {...},
    right: {...}
  }
}
```

**Output**:
```javascript
{
  result: true,     // Boolean evaluation result
  success: true
}

// On error:
{
  result: false,    // Default to false (element not rendered)
  success: false,
  error: "Error message"
}
```

**Contract**:
- MUST evaluate recursively (depth-first)
- MUST resolve property paths using `getProp(component.data, path)`
- MUST apply JavaScript truthy/falsy rules for non-boolean values
- MUST implement operators:
  - Comparisons: standard JavaScript comparison
  - `and`: `left && right`
  - `or`: `left || right`
  - `not`: `!operand`
- MUST catch errors and default to false (safe failure mode)

---

### 5. Expression Caching (utils.js or cache.js)

**Function**: `getCachedExpression(cacheKey, parserFn)`

**Input**:
```javascript
{
  cacheKey: "formatPrice(data.amount, 'USD')",  // Unique expression string
  parserFn: function(expressionString) {         // Parser to use if not cached
    return parsedExpression;
  }
}
```

**Output**:
```javascript
{
  parsed: MethodCallExpression | LogicalExpression,  // Cached or newly parsed
  fromCache: true | false                            // Cache hit indicator
}
```

**Contract**:
- MUST check cache before parsing
- MUST call parserFn only on cache miss
- MUST store result in cache for future lookups
- MUST use Map for O(1) lookup performance
- Cache key MUST be exact expression string (case-sensitive)

---

### 6. Error Logging (logger.js)

**Function**: `logTemplateError(errorContext)`

**Input**:
```javascript
{
  feature: "method-call",
  message: "Method 'calculateTotal' not found",
  sourceExpression: "{calculateTotal(data.items)}",
  component: AppBlockInstance,
  details: { attemptedMethod: "calculateTotal" }
}
```

**Output**:
```javascript
// Console output:
"AppBlocks [method-call]: Method 'calculateTotal' not found
  Expression: {calculateTotal(data.items)}
  Component: #shopping-cart
  Details: {\"attemptedMethod\":\"calculateTotal\"}"
```

**Contract**:
- MUST format errors consistently across all features
- MUST include source expression for developer debugging
- MUST include component identifier (element ID or description)
- MUST log to console.error (not console.log)
- MUST not throw exceptions (log only, graceful degradation)

---

## Cross-Module Dependencies

```
core.js
  ├─ Uses: logger.js (error logging)
  └─ Uses: utils.js (helper functions)

directives.js
  ├─ Uses: processing.js (method call parsing for c-for expressions)
  ├─ Uses: utils.js (getProp for property resolution)
  └─ Uses: logger.js (error logging)

processing.js
  ├─ Uses: utils.js (getProp, caching)
  └─ Uses: logger.js (error logging)

placeholders.js
  ├─ Uses: processing.js (method call parsing and execution)
  ├─ Uses: utils.js (getProp for property resolution)
  └─ Uses: logger.js (error logging)

filters.js
  ├─ Uses: processing.js (method call parsing in filter chains)
  └─ Uses: logger.js (error logging)
```

---

## Testing Contracts

Each module's new functionality MUST have:

1. **Unit tests**: Test parsing and evaluation in isolation
2. **Integration tests**: Test features working together (e.g., method calls in c-for)
3. **Error handling tests**: Verify graceful degradation and console logging
4. **Backward compatibility tests**: Ensure existing syntax still works
5. **Edge case tests**: Empty data, undefined values, malformed syntax

Test organization:
- `tests/core/events.test.js` - Event selector parsing and scoping
- `tests/directives/c-for.test.js` - Object iteration
- `tests/directives/c-if.test.js` - Logical operators
- `tests/processing/processNode.test.js` - Method call parsing
- `tests/placeholders/textNodes.test.js` - Method call execution in placeholders
- `tests/filters/integration.test.js` - Method calls in filter chains

---

## Performance Contracts

**Parsing Performance**:
- First parse of expression: <1ms per expression (target)
- Cached expression retrieval: <0.01ms (Map lookup)

**Rendering Performance**:
- Overall template rendering: Within 10% of current baseline (per SC-007)
- c-for object iteration: Within 5% of array iteration performance
- Logical expression evaluation: Within 10% of comparison-only evaluation

**Memory Usage**:
- Expression cache: Limit to 1000 entries max (if needed, implement LRU eviction)
- Parsed trees: Minimal memory footprint (simple POJOs, no heavy AST structures)

---

## Versioning and Rollout

**Version Impact**: Minor version bump (2.0.4 → 2.1.0)
- New features added
- No breaking changes
- Backward compatible

**Migration Path**: None required
- Existing apps continue to work unchanged
- Developers opt-in to new features by using new syntax
- Progressive enhancement pattern

**Documentation Requirements**:
- Update `docs/api.md` for event selector changes
- Update `docs/directives.md` for c-for and c-if enhancements
- Update `docs/methods.md` for method call syntax
- Update `docs/changelog.md` with all changes
- Add examples to relevant docs showing new syntax
