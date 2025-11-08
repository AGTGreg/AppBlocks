# Contracts (Internal Helper)

This feature adds no external API surface (no HTTP or module boundary changes). Internal helper function contract for reference:

```
evaluateTemplateExpression(app, scope, node, expr, cache) -> Any
```

Behavior:
- Parses `expr` for method calls and filters.
- Injects `app` instance as first argument when invoking methods.
- Applies filters sequentially after method evaluation.
- Returns empty string on placeholder errors; skips iteration on c-for errors.
- Uses `cache` keyed by (node identity + expression text) to avoid duplicate evaluations in same render.

Error Handling:
- Logs via existing logger; never throws outward.

No OpenAPI or GraphQL schemas required.
