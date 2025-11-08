# Research: Method Calls in Placeholders & Iteration Directives

## Overview
Consolidated decisions resolving all prior ambiguities. Focus on performance, correctness with dynamic data, and DRY integration.

## Decisions

### Non-Iterable Handling in `c-for`
- **Decision**: Log error and skip iteration (zero iterations)
- **Rationale**: Keeps template authors aware of misuse while preventing render breakage.
- **Alternatives Considered**:
  - Treat scalar as single-item array (could hide logic mistakes)
  - Silent skip (lack of visibility)

### Cache Key Granularity
- **Decision**: (DOM node identity + expression text)
- **Rationale**: Avoids cross-node value bleed when identical expressions appear in distinct scope contexts.
- **Alternatives**:
  - Expression only (incorrect reuse across nodes)
  - No cache (unnecessary repeated evaluation)

### Cache Lifetime
- **Decision**: Ephemeral per-render only
- **Rationale**: Guarantees correctness when data mutates each render.
- **Alternatives**:
  - Persistent multi-render cache (risks stale values)

### Evaluation Style
- **Decision**: Synchronous
- **Rationale**: Matches existing pipeline and keeps complexity low.
- **Alternatives**:
  - Async with promises (added complexity, race management)

### Error Handling
- **Decision**: Log error via existing logger and fallback (empty string for placeholders; zero iterations for c-for)
- **Rationale**: Non-disruptive failure mode consistent with current library behavior.
- **Alternatives**:
  - Throw exceptions (breaks entire render flow)

### Filter Application Order
- **Decision**: Sequential after method result
- **Rationale**: Consistent with existing filter semantics; easy to reason about.
- **Alternatives**:
  - Interleave during argument evaluation (confusing semantics)

## Implications
- Minimal bundle impact (single helper function extension).
- Predictable render performance via caching.
- Clear error visibility improves template author feedback loops.

## Open Questions
None outstanding.

## References
- Feature Spec: `specs/001-method-calls/spec.md`
- Plan: `specs/001-method-calls/plan.md`
