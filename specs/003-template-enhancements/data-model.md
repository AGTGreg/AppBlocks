# Data Model: Template and Event Enhancements

**Feature**: 003-template-enhancements
**Date**: November 6, 2025

## Overview

This document defines the internal data structures and parsing models for the four template enhancements. These structures are used internally by AppBlocks; they are not exposed as public APIs.

---

## 1. Event Definition Structure

Represents a parsed event handler configuration with support for complex CSS selectors.

### Entity: EventDefinition

**Fields**:
- `eventType` (string): The DOM event type (e.g., "click", "keyup", "submit")
- `selector` (string): CSS selector for target elements, may contain spaces for descendant selectors
- `handler` (function): Event handler function to execute
- `scopedElements` (NodeList): Cached result of `comp.el.querySelectorAll(selector)` scoped to component

**Relationships**:
- Created during component initialization from events configuration object
- One EventDefinition per event key in the `events: {}` object

**Validation Rules**:
- `eventType` MUST be non-empty string
- `selector` MUST be valid CSS selector syntax (validated by querySelectorAll)
- `handler` MUST be a function
- Invalid selectors log error and are skipped (graceful degradation)

**Lifecycle**:
1. Parse event string: `"eventType selector"` → split on first space
2. Store eventType and selector
3. At component mount: execute `querySelectorAll(selector)` on `comp.el`
4. Attach event listeners to matched elements
5. At component unmount: remove event listeners

---

## 2. Iterator State (c-for)

Represents the iteration state when c-for processes arrays or objects.

### Entity: IteratorState

**Fields**:
- `type` (enum: "array" | "object"): Detected iteration type
- `target` (array | object): The data structure being iterated
- `pointers` (object): Mapping of pointer names to current values
- `syntax` (object): Parsed c-for directive syntax

**Array Iteration**:
```javascript
{
  type: "array",
  target: [...],
  pointers: {
    item: currentArrayElement,
    $index: currentIndex  // Built-in pointer
  },
  syntax: {
    itemName: "item",      // Developer-defined
    sourcePath: "data.items"
  }
}
```

**Object Iteration**:
```javascript
{
  type: "object",
  target: {...},
  pointers: {
    key: currentPropertyName,    // Developer-defined name
    value: currentPropertyValue  // Developer-defined name
  },
  syntax: {
    keyName: "key",         // Developer-defined
    valueName: "value",     // Developer-defined
    sourcePath: "data.user"
  }
}
```

**Validation Rules**:
- Array syntax: MUST have 1 pointer name: `item in data.array`
- Object syntax: MUST have 2 pointer names: `key, value in data.object`
- Pointer names MUST be valid JavaScript identifiers
- Source path MUST resolve to array or object (or empty/null for zero iterations)

**State Transitions**:
1. **Parse**: Extract pointer names and source path from directive attribute
2. **Resolve**: Get target data from source path using `getProp()`
3. **Type Detection**: Check `Array.isArray(target)` → set type
4. **Iteration**: For each element/property, update pointers and render template
5. **Cleanup**: Clear pointer references after iteration complete

---

## 3. Method Call Expression

Represents a parsed method invocation with parameters from template syntax.

### Entity: MethodCallExpression

**Fields**:
- `methodName` (string): Name of the method to invoke
- `parameters` (array<Parameter>): Ordered list of parameters
- `sourceString` (string): Original expression for error reporting and caching

**Parameter Types**:
```javascript
Parameter = {
  type: "string" | "number" | "boolean" | "property" | "methodCall",
  value: any,
  raw: string  // Original text for debugging
}
```

**Parameter Type Examples**:
```javascript
// String literal
{ type: "string", value: "Hello", raw: "'Hello'" }

// Numeric literal
{ type: "number", value: 42, raw: "42" }

// Boolean literal
{ type: "boolean", value: true, raw: "true" }

// Property reference
{ type: "property", value: "data.user.name", raw: "data.user.name" }

// Nested method call
{ type: "methodCall", value: MethodCallExpression, raw: "getTotal()" }
```

**Validation Rules**:
- `methodName` MUST match a method in component's `methods` object
- String literals MUST use single quotes (validated during parsing)
- Property paths MUST use dot notation (no bracket notation initially)
- Nested method calls MUST resolve to valid return values
- Circular method call chains are not prevented (will hit stack limit)

**Lifecycle**:
1. **Parse**: Tokenize expression string → extract method name and parameters
2. **Cache Check**: Look up parsed expression in cache (key: sourceString)
3. **Parameter Resolution**: For each parameter:
   - Literals: use value as-is
   - Property paths: resolve using `getProp(comp.data, path)`
   - Nested calls: recursively execute and use return value
4. **Invocation**: Call method with app instance + resolved parameters
5. **Error Handling**: Catch errors → log to console, return empty string
6. **Cache**: Store parsed expression for reuse

---

## 4. Logical Expression (c-if conditions)

Represents a compound conditional expression with logical operators.

### Entity: LogicalExpression

**Fields**:
- `type` (enum: "comparison" | "logical" | "unary" | "identifier"): Node type
- `operator` (string | null): Operator if applicable ("and", "or", "not", "==", "!=", etc.)
- `left` (LogicalExpression | null): Left operand for binary operators
- `right` (LogicalExpression | null): Right operand for binary operators
- `operand` (LogicalExpression | null): Operand for unary operators (not)
- `value` (any): Literal value or property path for leaf nodes

**Expression Tree Structure**:

```javascript
// Example: data.isActive and (data.age > 18 or data.isAdmin)
{
  type: "logical",
  operator: "and",
  left: {
    type: "identifier",
    value: "data.isActive"
  },
  right: {
    type: "logical",
    operator: "or",
    left: {
      type: "comparison",
      operator: ">",
      left: { type: "identifier", value: "data.age" },
      right: { type: "literal", value: 18 }
    },
    right: {
      type: "identifier",
      value: "data.isAdmin"
    }
  }
}
```

**Node Types**:

1. **Comparison**: `left operator right` where operator is `==`, `!=`, `>`, `<`, `>=`, `<=`
2. **Logical**: `left operator right` where operator is `and`, `or`
3. **Unary**: `operator operand` where operator is `not`
4. **Identifier**: Property path or literal value (leaf node)

**Validation Rules**:
- Operators MUST be from allowed set (comparisons + logical + not)
- Parentheses MUST be balanced
- Malformed expressions log error and fail condition (element not rendered)

**Operator Precedence** (highest to lowest):
1. Parentheses `( )`
2. Comparisons `==`, `!=`, `>`, `<`, `>=`, `<=`
3. `not`
4. `and`
5. `or`

**Evaluation Algorithm**:
1. **Parse**: Build expression tree with proper precedence
2. **Evaluate**: Recursive tree traversal
   - Leaf nodes: Resolve property paths or return literals
   - Comparison nodes: Compare left vs right using operator
   - Logical nodes: Apply operator to evaluated left and right
   - Unary nodes: Negate evaluated operand
3. **Truthy/Falsy**: Non-boolean values coerced using JavaScript rules
4. **Result**: Boolean value determines if c-if element renders

---

## 5. Expression Cache

Stores parsed expressions to avoid re-parsing on every render.

### Entity: ExpressionCache

**Structure**:
```javascript
Map<string, ParsedExpression>

// Key: Source string (e.g., "{formatPrice(data.amount, 'USD')}")
// Value: Parsed structure (MethodCallExpression, LogicalExpression, etc.)
```

**Operations**:
- `get(sourceString)`: Retrieve cached parsed expression
- `set(sourceString, parsedExpression)`: Store parsed expression
- `clear()`: Reset cache (if needed for testing or data structure changes)

**Cache Strategy**:
- Cache populated during first render of each unique expression
- Cache persists across re-renders (expressions rarely change)
- No automatic invalidation (expressions are static template strings)
- Optional: Clear cache on component re-initialization if needed

**Performance Target**:
- Cache hit rate: >95% for typical applications (most expressions reused)
- Parse time savings: ~80-90% reduction in expression processing time

---

## 6. Error Context

Stores error information for graceful degradation and developer debugging.

### Entity: ErrorContext

**Fields**:
- `feature` (string): Which enhancement failed ("event-selector", "c-for-object", "method-call", "logical-operator")
- `message` (string): Human-readable error description
- `sourceExpression` (string): Original template expression that failed
- `component` (object | null): Reference to component where error occurred
- `details` (object | null): Additional debug information

**Error Message Format**:
```
AppBlocks [{feature}]: {message}
  Expression: {sourceExpression}
  Component: {component.el.id or '<unnamed>'}
  Details: {JSON.stringify(details)}
```

**Example Error Messages**:
```
AppBlocks [method-call]: Method 'calculateTotal' not found in component methods
  Expression: {calculateTotal(data.items)}
  Component: #shopping-cart

AppBlocks [c-for-object]: Invalid c-for syntax - expected 'key, value in object'
  Expression: c-for="item, in data.users"
  Component: #user-list

AppBlocks [logical-operator]: Unexpected token in c-if condition
  Expression: c-if="data.isActive and and data.isVerified"
  Component: #status-badge
```

**Usage**:
- Created during error handling in try-catch blocks
- Logged to console using `logger.js`
- Used to render empty string or skip element rendering
- Helps developers identify and fix template issues quickly

---

## Data Flow Summary

### Event Selector Enhancement
```
Event Config String → Parse (split on first space) → EventDefinition →
querySelectorAll (scoped) → Attach Listeners → Handle Events
```

### c-for Object Iteration
```
c-for Directive → Parse Syntax → Detect Type (Array.isArray) →
Create IteratorState → Loop (Object.keys for objects) →
Update Pointers → Render Template
```

### Method Calls
```
Template Expression → Check Cache → Parse to MethodCallExpression →
Resolve Parameters → Invoke Method (app instance injected) →
Handle Errors → Cache Result → Return Value
```

### Logical Operators
```
c-if Directive → Parse to LogicalExpression Tree → Evaluate Recursively →
Apply Precedence → Truthy/Falsy Coercion → Boolean Result →
Render or Skip Element
```

---

## Relationships Between Entities

1. **MethodCallExpression** can contain nested **MethodCallExpression** (parameters)
2. **LogicalExpression** is tree-structured with parent-child relationships
3. **IteratorState** creates temporary **pointers** scope for template rendering
4. **ExpressionCache** stores **MethodCallExpression** and **LogicalExpression** instances
5. **ErrorContext** created when any parsing/execution fails

All entities are internal implementation details. No new public API exports are introduced.
