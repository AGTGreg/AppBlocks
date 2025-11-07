# Contract: Directives Integration (c-if / c-ifnot)

## Purpose
Define how `c-if` and `c-ifnot` use the Expression Evaluator to decide render behavior while preserving `c-for` behavior.

## Integration Points
- Attribute parsing: read raw expression string from `c-if` / `c-ifnot`.
- Evaluation timing: evaluate before processing nested `c-for`.
- Error policy: on error or blocked expression, treat as false for `c-if` and true for `c-ifnot`; log warning once.

## Pseudocode

```js
function handleIfDirective(node, app, options) {
  const expr = node.getAttribute('c-if')
  const ctx = { data: app.data, methods: app.methods }
  const allowBuiltins = app.config?.allowBuiltins || []

  const decision = evaluateToBoolean(expr, ctx, { allowBuiltins, logWarning })
  if (!decision) removeNode(node)
}

function handleIfNotDirective(node, app, options) {
  const expr = node.getAttribute('c-ifnot')
  // Same evaluation as above, then invert
  const decision = evaluateToBoolean(expr, ctx, { allowBuiltins, logWarning })
  if (decision) removeNode(node)
}
```

## Backwards Compatibility
- Existing behavior for simple flags continues to work; `expr` can be `"someFlag"` resolving via scope.
- `c-for` evaluation order unchanged; guards are applied before iteration to avoid duplicate work.

## Configuration
- `app.config.allowBuiltins?: BuiltinName[]` default `[]`.
- Future: `app.config.expressionCacheSize?` (out of scope for MVP).
