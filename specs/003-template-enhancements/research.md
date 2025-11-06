# Research: Template and Event Enhancements

**Feature**: 003-template-enhancements
**Date**: November 6, 2025

## Research Tasks

This document captures technical research findings to resolve implementation unknowns and establish best practices for the four template/event enhancements.

---

## 1. Event Selector Parsing with Spaces

### Question
How should AppBlocks parse event definitions that contain CSS selectors with spaces while maintaining backward compatibility?

### Decision
Use a modified event string parsing approach that splits on the first space only (to separate event type from selector), preserving all subsequent spaces as part of the CSS selector.

### Rationale
- Current approach likely splits on all spaces, treating only the first token as the selector
- CSS `querySelectorAll()` natively handles complex selectors including spaces
- Splitting on first space only: `'click #parent .child'` → event: `'click'`, selector: `'#parent .child'`
- This maintains backward compatibility since existing selectors without spaces still parse correctly

### Alternatives Considered
1. **Require special delimiter**: Force developers to use `|` or `::` between event and selector
   - Rejected: Breaking change, reduces developer experience
2. **Regular expression parsing**: Complex regex to detect event types
   - Rejected: Over-engineered for simple split operation
3. **Strict event type whitelist**: Parse based on known events (click, keyup, etc.)
   - Rejected: Doesn't support custom events

### Implementation Notes
- Update event parsing in `core.js`
- Event format: `'eventType selector'` where selector can contain any valid CSS selector syntax
- Use `comp.el.querySelectorAll(selector)` to scope to component's element tree (per clarification)
- Test with complex selectors: descendant (` `), child (`>`), sibling (`+`, `~`), attribute (`[]`), pseudo-classes (`:hover`)

---

## 2. Object Iteration in c-for Directive

### Question
How should AppBlocks distinguish between array iteration and object iteration in c-for directives?

### Decision
Detect iteration target type at runtime using `Array.isArray()`. If not array, treat as object and use `Object.keys()` for enumeration.

### Rationale
- Runtime type detection is reliable and performant
- `Object.keys()` returns only own enumerable string keys (excludes inherited properties and Symbols)
- Syntax distinction:
  - Array: `c-for="item in data.array"` (1 pointer)
  - Object: `c-for="key, value in data.object"` (2 pointers)
- Parser can detect 2-pointer syntax vs 1-pointer syntax

### Alternatives Considered
1. **Explicit directive variants**: `c-for-array` vs `c-for-object`
   - Rejected: Verbose, less intuitive developer experience
2. **Type hints in syntax**: `c-for="item of array"` vs `c-for="key in object"`
   - Rejected: Confusing with JavaScript's `for...of` vs `for...in` semantics
3. **Static type analysis**: Analyze data structure at template compile time
   - Rejected: AppBlocks is runtime-oriented; data can change

### Implementation Notes
- Update directive parser in `directives.js` to detect 1-pointer vs 2-pointer syntax
- Parse `c-for="key, value in path"` → extract key name, value name, data path
- At runtime: check `Array.isArray(target)` to branch logic
- For objects: iterate `Object.keys(target)`, create pointers for both key and value
- Pointer names are developer-defined (not hardcoded as "key"/"value")
- Edge case: Empty object renders zero elements (no error)

---

## 3. Method Call Parsing and Execution

### Question
How should AppBlocks parse method calls with parameters in templates and distinguish parameter types (strings, numbers, booleans, property references)?

### Decision
Implement a simple expression parser that tokenizes method calls and evaluates parameters based on syntax:
- Single-quoted strings: `'text'` → literal string
- Unquoted identifiers: `data.name` → property path reference
- Numbers: `42`, `3.14` → numeric literals
- Booleans: `true`, `false` → boolean literals

### Rationale
- Clear visual distinction between literals and references
- Aligns with common template engine patterns (Vue, Angular, etc.)
- Single quotes work within double-quoted HTML attributes: `<div data-value="{method('arg')}"></div>`
- Property paths use standard dot notation familiar to developers

### Alternatives Considered
1. **Double quotes for strings**: Requires HTML entity escaping (`&quot;`)
   - Rejected: Developer experience degraded by escaping requirements
2. **Type prefixes**: `$string`, `@property`, `#number`
   - Rejected: Unfamiliar syntax, increased cognitive load
3. **Backticks for template literals**: Support embedded expressions
   - Rejected: Over-complex for initial implementation; can add later

### Implementation Notes
- Create expression parser in `processing.js` or new `utils/parser.js`
- Parse placeholder/directive content to detect method calls: `{methodName(args)}`
- Tokenizer handles:
  - Single-quoted strings (with escaped quotes: `\'`)
  - Dot-notation property paths
  - Number literals (integers and floats)
  - Boolean keywords
  - Nested method calls: `{outer(inner())}`
- Parameter resolution:
  - String literals: use as-is
  - Property paths: resolve using existing `getProp()` utility
  - Numbers/booleans: parse to native types
- Method invocation auto-injects app instance as first parameter
- Support both `{method()}` and `{method}` syntax for zero-parameter calls

### Best Practices Research
**Tokenization patterns from template engines**:
- Vue.js: Uses similar single-quote for strings in directives
- Handlebars: Positional parameters, strings in quotes
- Angular: TypeScript-style expressions with string literals

**Parser approach**:
- Regex-based tokenizer for simplicity (sufficient for this scope)
- Character-by-character state machine if regex becomes limiting
- Consider using existing tiny parser libraries (but avoid dependencies per constitution)

---

## 4. Logical Operators in Conditional Directives

### Question
How should AppBlocks parse and evaluate logical operators (and, or, not) in c-if conditions while maintaining operator precedence?

### Decision
Implement a simple expression evaluator with explicit operator precedence:
1. Comparisons (`==`, `!=`, `>`, `<`, `>=`, `<=`) - highest
2. `not` - unary negation
3. `and` - conjunction
4. `or` - disjunction (lowest)

Support parentheses for explicit grouping.

### Rationale
- Operator precedence matches logical standards and developer expectations
- Word operators (`and`, `or`, `not`) are more template-friendly than symbols (`&&`, `||`, `!`)
- Easier to read in HTML attributes than JavaScript operators
- Enables complex conditions without requiring JavaScript knowledge

### Alternatives Considered
1. **JavaScript operators**: Use `&&`, `||`, `!` directly
   - Rejected: Feels too "code-like" for templates; less accessible
2. **No precedence**: Left-to-right evaluation only
   - Rejected: Confusing and error-prone for developers
3. **SQL-style keywords**: `AND`, `OR`, `NOT` (uppercase)
   - Rejected: Inconsistent with lowercase HTML attribute style

### Implementation Notes
- Extend condition parser in `directives.js` for c-if/c-ifnot
- Parse condition string into expression tree:
  - Tokenize: split on operators while preserving parentheses
  - Build AST (Abstract Syntax Tree) with proper precedence
  - Evaluate recursively
- Operator implementations:
  - `and`: left && right (with truthy/falsy coercion)
  - `or`: left || right
  - `not`: !operand
- Truthy/falsy evaluation follows JavaScript rules
- Comparisons evaluate before logical operators
- Example parse: `a > 5 and (b == 'yes' or c)` → tree respects precedence

### Best Practices Research
**Precedence patterns**:
- SQL: NOT > AND > OR (matches our choice)
- Python: not > and > or (same)
- Most programming languages follow this convention

**Parser techniques**:
- Recursive descent parsing for simplicity
- Shunting-yard algorithm for operator precedence (Dijkstra)
- Pratt parsing for extensibility (if needed later)

**Recommendation**: Recursive descent with explicit precedence levels - simple, maintainable, sufficient for template expressions.

---

## 5. Error Handling and Graceful Degradation

### Question
What is the best approach for handling errors in the new template features while maintaining application stability?

### Decision
Implement graceful degradation pattern:
- Failed operations render empty strings
- Errors logged to console with clear, actionable messages
- Rendering continues without breaking the page

### Rationale
- Matches AppBlocks' existing error handling patterns
- Provides developer feedback without disrupting user experience
- Follows progressive enhancement principles
- Per FR-018: explicit requirement for this behavior

### Implementation Notes
- Wrap parsing and execution in try-catch blocks
- Use existing `logger.js` for consistent error reporting
- Error message format: Include feature context, failure reason, and location
- Examples:
  - `"AppBlocks: Method 'calculateTotal' not found in component methods"`
  - `"AppBlocks: Invalid c-for syntax - expected 'key, value in object'"`
  - `"AppBlocks: Logical operator parsing failed in c-if condition"`
- Return empty string on error for placeholder resolution
- Skip element rendering on error for directive conditions

---

## 6. Performance Considerations

### Question
How can we ensure the new parsing and evaluation logic doesn't degrade template rendering performance?

### Decision
Implement caching and optimization strategies:
- Parse expressions once, cache results keyed by expression string
- Reuse parsed expression trees across re-renders
- Benchmark against current performance to verify <10% overhead (per SC-007)

### Rationale
- Template expressions rarely change at runtime
- Parsing overhead is one-time cost per unique expression
- Cache hit rates will be high for typical applications

### Implementation Notes
- Create expression cache in relevant modules (Map object)
- Cache key: expression string (e.g., `"formatPrice(data.amount, 'USD')"`)
- Cache value: parsed representation (AST, token list, or function)
- Clear cache on data updates if expressions reference data paths (evaluate need)
- Performance testing: Compare rendering time for equivalent functionality (current workaround vs new feature)

### Alternatives Considered
1. **No caching**: Parse every time
   - Rejected: Unnecessary performance overhead
2. **Compile expressions to functions**: `new Function()` approach
   - Deferred: Consider if benchmarks show performance issues; adds complexity

---

## Technology Stack Summary

All features are implementable using:
- **Core JavaScript**: ES6+ features (Array.isArray, Object.keys, Map for caching)
- **Standard DOM APIs**: querySelectorAll for event selectors
- **Existing AppBlocks utilities**: getProp for property resolution, logger for errors
- **Zero new dependencies**: Maintains lightweight library principle

## Next Steps

Proceed to Phase 1:
1. Create data-model.md defining parsing structures (AST nodes, token types, expression representations)
2. Generate contracts for public APIs (if any new exports)
3. Create quickstart.md with developer examples
4. Update agent context with new patterns
