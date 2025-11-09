# Implementation Plan: Method Calls in Placeholders & Iteration Directives

**Branch**: `001-method-calls` | **Date**: 2025-11-09 | **Spec**: specs/001-method-calls/spec.md
**Input**: Feature specification from `/specs/001-method-calls/spec.md`

## Summary

Enable calling app methods with parameters from placeholders and `c-for` directives, with the app instance injected implicitly as the first argument, filters supported after calls, and behavior aligned with existing `c-if`/`c-ifnot`. Provide a DRY, shared expression evaluator with an ephemeral per-render cache keyed by (DOM node identity + expression text), error logging, and zero-iteration skip for non-iterables returned to `c-for`.

## Technical Context

**Language/Version**: JavaScript (ES6+)
**Primary Dependencies**: None new (reuse existing code; Idiomorph already used elsewhere)
**Storage**: N/A
**Testing**: Jest + JSDOM (existing config), Babel for ES6+ in tests
**Target Platform**: Browser library (rendering templates in DOM)
**Project Type**: Single library (src/ and tests/)
**Performance Goals**: <5% overhead vs baseline render; single-call per expression per render
**Constraints**: No new runtime deps; DRY (shared evaluator in `helpers.js`); do not grow bundle materially; reuse logger; align with current parser patterns
**Scale/Scope**: Typical template sizes; nested calls supported; no async semantics

Implementation outline:
- Introduce a shared evaluator `evaluateTemplateExpression(app, scope, node, expr)` in `src/helpers.js` that:
  - Parses expression including function calls and arguments
  - Recursively evaluates argument expressions
  - Injects `app` as first arg when calling methods
  - Applies filter chains post-evaluation
  - Uses per-render cache: key = (node identity + expr string)
  - Logs errors via `logger.js`
- Integrate evaluator at call sites:
  - Placeholders (`src/placeholders.js`): use evaluator instead of bespoke logic
  - `c-for` in `src/directives.js`/`src/processing.js`: evaluate iterable expression, verify iterability, log+skip on non-iterable
  - Reuse same path already used by `c-if`/`c-ifnot` to keep DRY

## Constitution Check

Gate evaluation (pre-design):
- Lightweight & Focused: PASS — no new deps; shared helper; minimal impact
- Test-First Development: PASS — plan includes tests before implementation
- Browser Compatibility & Simplicity: PASS — no browser-specific features; simple template syntax retained
- Documentation: PASS — docs and changelog updates included in deliverables

Gate evaluation (post-design):
- Still PASS — no additional constraints added; bundle size unaffected by plan

## Project Structure

### Documentation (this feature)

```text
specs/001-method-calls/
├── plan.md              # This file
├── research.md          # Phase 0 decisions & rationale
├── data-model.md        # Entities: TemplateExpression, MethodInvocation, RenderCacheEntry
├── quickstart.md        # How to use, test, and benchmark
└── contracts/           # No external API; note-only
```

### Source Code (repository root)

```text
src/
├── helpers.js          # + shared evaluateTemplateExpression (new/extended)
├── placeholders.js     # use shared evaluator for placeholders
├── directives.js       # ensure c-for uses shared evaluator for iterable expr
├── processing.js       # pass per-render cache/context where needed
└── logger.js           # reuse existing error logging

tests/
├── placeholders/       # new: method-calls.test.js (placeholders + filters)
├── directives/         # new: c-for.method-calls.test.js
└── core/               # extend initialization/rendering coverage as needed
```

**Structure Decision**: Single library; extend helpers and reuse in placeholders, directives, and processing. New tests under existing module-aligned groups.

## Complexity Tracking

No constitution violations expected; no entry required.

## Phase 0: Research & Decisions

Research topics & resolved decisions (no outstanding NEEDS CLARIFICATION):

| Topic | Decision | Rationale | Alternatives |
|-------|----------|-----------|-------------|
| Non-iterable in c-for | Log error & skip | Maintains fail-fast visibility while not breaking render | Treat scalar as single item (hides mistakes); silent skip (less explicit) |
| Cache key granularity | Node + expression text | Prevents cross-node unintended reuse | Global expr-only key (risk of stale cross-node); per-node no cache (perf cost) |
| Cache lifetime | Per render only | Ensures correctness with changing data | Cross-render persistence (stale) |
| Evaluation style | Synchronous | Keeps complexity low; existing sync pipeline | Async promises (added complexity) |
| Error handling | Log & fallback empty / skip | Consistent with current logger pattern | Throw (breaks full render) |
| Filter application | Sequential post-call | Matches existing filter semantics | Interleave mid-arg (inconsistent) |

Generated file: `research.md` (see repository for details)

## Phase 1: Data Model & Contracts

### Data Model (see `data-model.md`)

Entities:
- TemplateExpression: { raw, tokens, result }
- MethodInvocation: { name, argsExpresssions[], evaluatedArgs[], status }
- RenderCacheEntry: { key, value }

Relationships:
- TemplateExpression may contain multiple MethodInvocation nodes.
- RenderCacheEntry references a TemplateExpression raw string + node id.

### Contracts

No external API endpoints added. Internal helper contract (informal):
`evaluateTemplateExpression(app, scope, node, expr, cache)` → value | '' (on error) with logging side-effects.

### Quickstart

See `quickstart.md` for usage examples, test commands, and benchmark invocation.

## Phase 2: Tasks Outline (to be generated by /speckit.tasks)

High-level forthcoming tasks (preview):
- Write failing tests for placeholder & filter invocation.
- Write failing tests for c-for method iterable evaluation & error skip.
- Implement evaluator in helpers.js.
- Integrate evaluator into placeholders.js and directives/processing.
- Add benchmark scenario for nested method expressions.
- Update docs (directives.md, placeholders section) + changelog.

## End of Planning

Next command: `/speckit.tasks` to produce executable task list.
