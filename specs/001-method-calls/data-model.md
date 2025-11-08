# Data Model: Method Calls in Template Expressions

## Overview
Models internal constructs used to implement method invocation inside placeholders and directives (`c-for`, existing `c-if`/`c-ifnot`). Not exposed externally; aids test design.

## Entities

### TemplateExpression
Represents a single expression segment (placeholder content or directive expression).
- raw: String (original template substring)
- tokens: Array<Token> (parsed representation; includes MethodInvocation and literals)
- result: Any (evaluated value; string for placeholder, iterable for c-for, boolean for conditionals)
- nodeId: String (unique identity of DOM node for caching key composition)

### MethodInvocation
Represents an invocation of an app method.
- name: String (method name)
- argExpressions: Array<ExpressionFragment> (raw argument expressions prior to evaluation)
- evaluatedArgs: Array<Any> (arguments after evaluation; app instance inserted at index 0 during call)
- status: Enum { pending, success, error }
- error: (Optional) Error object or message

### RenderCacheEntry
Per render ephemeral cache mapping unique expression to its evaluated result.
- key: String (nodeId + '|' + raw expression)
- value: Any (cached evaluation result)

## Relationships
- A TemplateExpression may include multiple MethodInvocation tokens.
- A RenderCacheEntry is associated with exactly one TemplateExpression raw string for a specific nodeId.

## State Transitions
MethodInvocation.status:
- pending -> success (on evaluation without throw)
- pending -> error (on caught exception)

## Validation Rules
- MethodInvocation.name MUST exist on app.methods (or equivalent registry) before invocation.
- c-for iterable result MUST implement Symbol.iterator OR be array-like; otherwise error logged and iteration skipped.
- Placeholder result MUST coerce undefined/null to empty string.

## Caching Rules
- Cache populated after first successful evaluation of TemplateExpression per render.
- Cache cleared at start of each render cycle.
- Errors are NOT cached (expression retried next render).

## Edge Case Handling
- Empty arg list: evaluatedArgs = [app].
- Nested invocation: inner MethodInvocation evaluated before outer argument assembly.
- Filter chain: applied after final method result only.

## Non-Persistent Design
No data persisted between renders; all entities ephemeral.
