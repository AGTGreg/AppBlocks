# Research: c-if / c-ifnot Expression Evaluation

## Decisions

1. Block globals by default; provide opt-in allow-list for specific read-only built-ins (initially `Math`).
   - Rationale: Minimizes attack surface and accidental foot-guns while keeping useful math utilities available when explicitly enabled.
   - Alternatives considered:
     - Allow all globals read-only: Too permissive; risks accidental access to window/document.
     - Disallow all built-ins forever: Restrictive; developers commonly need Math operations.

2. Expression grammar: Allow standard JS expressions (including ternary and logical operators); disallow statements and side-effects.
   - Rationale: Maximizes expressiveness while keeping evaluation safe and predictable.
   - Alternatives considered:
     - Limited grammar (only comparisons and logical): Safer but too restrictive; harms developer flexibility.
     - Full power including statements: Increases risk of side effects and complexity.

3. Evaluation approach: `new Function` with strict mode and scoped parameters; compile-and-cache by expression string.
   - Rationale: Simple, fast, no extra deps, easy to shadow globals; excellent runtime performance after first compile.
   - Alternatives considered:
     - `with`-based scoping: Slower, brittle, harder to make safe.
     - AST parsing with evaluator: Heavy, adds bundle size and complexity.
     - Proxy sandbox: Complex and can be bypassed; performance overhead.

4. Side-effect prevention: Lightweight static scan to reject assignments and dangerous tokens; treat as false (c-if)/true (c-ifnot) with a warning.
   - Rationale: Pragmatic safety without dependencies; sufficient for trusted template authors.
   - Alternatives considered:
     - Full static analysis: Overkill for this library’s goals; increases code size and maintenance.
     - No checks: Risky; easy to introduce side effects.

5. Error handling: Catch errors; log once per render cycle; treat as false (c-if) / true (c-ifnot).
   - Rationale: Keeps UI stable and predictable; avoids infinite loops and noisy logs.
   - Alternatives considered:
     - Throw: Breaks rendering; poor DX.
     - Silent swallow: Hides real issues; poor debuggability.

## Build Size Baseline

Pre-feature build size: 25582 bytes (build-cjs/ directory total)

Recorded: 2025-11-07

## Browser Compatibility Smoke Test

Manual smoke test performed on 2025-11-07 using `tmp/test.html` with expression examples:
- Chrome: PASS
- Firefox: PASS
- Safari: PASS
- Edge: PASS

No issues observed with expression evaluation, method calls, or built-in access.

## Best Practices Summary
- Keep the allow-list minimal and explicit; default to none.
- Cache compiled expressions keyed by the exact source string.
- Use strict mode and explicit parameter lists to shadow globals.
- Keep token blacklist small but effective: `constructor`, `__proto__`, `eval`, `Function`, assignments not part of `==`, `===`, `!=`, `!==`, increment/decrement, `new`, `function`, `class`, `=>`, `import`, `await`, `yield`, `try`, `catch`, `finally`, `delete`.
- Coerce non-boolean results via JS truthiness.
- Evaluate conditionals before iterators (`c-for`) for predictable behavior.

## Open Items (tracked decisions)
- None (all prior unknowns resolved in spec).
