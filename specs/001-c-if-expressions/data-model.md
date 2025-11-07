# Data Model: c-if / c-ifnot Expression Evaluation

## Entities

### DirectiveExpression
- Description: Represents an individual conditional directive expression attached to an element.
- Fields:
  - `source`: Raw expression string.
  - `compiled`: Cached function reference (or null until compiled).
  - `result`: Last evaluated boolean (or null if not yet evaluated).
  - `hadError`: Boolean flag set if last evaluation threw or was blocked.
  - `blocked`: Boolean flag set if static safety scan rejected expression.
  - `allowBuiltins`: Array of enabled built-in identifiers (resolved at evaluation time).
- Relationships:
  - Associated with a template element; one-to-one per directive.

### EvaluationContext
- Description: Logical scope made available to expression.
- Fields:
  - `data`: App instance data object.
  - `methods`: Map of method names to functions (bound to instance).
  - `builtins`: Map of allowed built-ins (read-only) derived from configuration.
- Relationships:
  - Used transiently during evaluation; not persisted.

## Validation Rules
- `source` MUST be a non-empty string; empty strings treated as false (c-if) / true (c-ifnot).
- Safety scan MUST run before compilation; if blocked, `compiled` remains null.
- `allowBuiltins` MUST be subset of documented safe list; defaults to empty array.

## State Transitions
1. Creation → Scan → (Blocked | Compilable)
2. Compilable → Compile (store function) → Ready
3. Ready → Evaluate → Result updated (`result`, `hadError` possibly set)
4. Ready (blocked) → Evaluate attempt → `result` forced false/true based on directive type, `hadError` possibly set

## Derived Data
- `isRenderableForIf` = `!blocked && !hadError && truthy(result)`
- `isRenderableForIfNot` = `!blocked && !hadError && !truthy(result)`

## Notes
- No persistence; lifecycle tied to render cycle.
- Cache keyed by `source` independent of element; multiple elements can reuse compiled function safely.
