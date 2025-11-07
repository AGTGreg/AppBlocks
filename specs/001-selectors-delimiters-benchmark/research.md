# Research & Decisions: Selectors, Delimiters, Benchmark

**Date**: 2025-11-06
**Scope**: Event delegation with descendant selectors, configurable placeholder delimiters, performance benchmark harness.

## Decisions

### D1: Event Delegation Parsing
- **Decision**: Split only on first space; everything after is treated as full CSS selector; use single listener on container and `e.target.closest(selector)`.
- **Rationale**: Avoid per-element listeners and ensure descendant combinators work; `closest` is efficient and broadly supported.
- **Alternatives Considered**:
  - Multiple listeners per selector element (higher memory, complexity).
  - Manual traversal comparing `matches()` chains (more verbose, slower).

### D2: Placeholder Delimiters Implementation
- **Decision**: Accept `delimiters: [open, close]` at AppBlock initialization; compile dynamic global regex `new RegExp(`${escape(open)}([^${escape(close)}]+)${escape(close)}`, 'g')`; maintain pipe-based filter parsing separately.
- **Rationale**: Keeps parsing encapsulated; supports arbitrary delimiter chars safely via escaping; preserves existing filter syntax.
- **Alternatives Considered**:
  - Tokenizing template once into AST (more complex than needed for scope).
  - String split per render (less flexible with filters, harder to maintain).

### D3: Benchmark Harness Environment
- **Decision**: Use Node + JSDOM; script collects 10 samples excluding optional warm-up; outputs JSON and human-readable summary.
- **Rationale**: Deterministic CI-friendly environment; easy integration with Jest.
- **Alternatives Considered**:
  - Real browser automation (Playwright) — heavier setup, more variance.
  - Pure micro-benchmark of functions — misses integrated render cost.

### D4: Baseline Persistence
- **Decision**: Store baseline at `.benchmarks/baseline.json` (gitignored) with shape `{ meanMs: number, samples: number[], date: string }`.
- **Rationale**: Avoid noise in commits; developer-local regression awareness; can later promote stable baseline into docs.
- **Alternatives Considered**:
  - Committed baseline file — version noise.
  - CI artifact only — ephemeral, no local trending.

### D5: Performance Guardrail
- **Decision**: Alert if mean render time regression >10% vs baseline; not failing tests initially—just console warning.
- **Rationale**: Start with soft guard; escalate to hard failure after historical data matures.
- **Alternatives Considered**:
  - Immediate failing test — risk of flaky enforcement early.
  - No alert — regressions could slip.

## Unresolved / Deferred (None)
All clarifications resolved; no open NEEDS CLARIFICATION markers.

## References
- Existing event implementation: `src/core.js`
- Placeholder parsing location: `src/placeholders.js`

## Next Steps
Proceed to Phase 1 design artifacts: data-model.md, contracts (if applicable), quickstart.
