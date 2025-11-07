# Contract: Expression Evaluator

## Purpose
Provide a safe, fast evaluator for JavaScript expressions used in `c-if` and `c-ifnot` directives.

## Interface (pseudo-TypeScript for clarity)

```ts
export type BuiltinName = 'Math'; // extensible via configuration

export interface EvalOptions {
  allowBuiltins?: BuiltinName[]; // default: []
  logWarning?: (msg: string) => void; // default: console.warn
}

export interface EvalContext {
  data: Record<string, any>;
  methods: Record<string, (...args: any[]) => any>; // bound to app instance
}

// Compile or fetch from cache; throws only on irrecoverable internal errors
export function compileExpression(expr: string, options?: EvalOptions): (ctx: EvalContext) => any;

// Evaluate and coerce to boolean following JS truthiness
export function evaluateToBoolean(expr: string, ctx: EvalContext, options?: EvalOptions): boolean;

// Utility: returns true if expr contains blocked constructs (no compilation performed)
export function isBlockedExpression(expr: string): boolean;
```

## Errors & Logging
- Syntax or runtime errors are caught internally; `evaluateToBoolean` returns false for `c-if` handling and true for `c-ifnot` when applied by directive layer; evaluator itself returns raw errors only via logs.
- `logWarning` is called at most once per render cycle per unique expression on:
  - Blocked tokens found
  - Runtime error during evaluation

## Performance Contract
- First-time compile: O(length(expr)); subsequent evaluations are O(1).
- Cache key: exact expression string.
- Memory: cache grows with unique expressions; library may expose a `clearCache()` if needed in future (not required for MVP).

## Security Contract
- No access to globals by default; built-ins allowed only if explicitly enabled.
- Dangerous identifiers/tokens rejected at pre-scan: `constructor`, `__proto__`, `eval`, `Function`, assignment (not part of equality/inequality ops), `++`, `--`, `new`, `function`, `class`, `=>`, `import`, `await`, `yield`, `try`, `catch`, `finally`, `delete`.
