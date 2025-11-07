# Implementation Plan: Selectors, Delimiters, Benchmark

**Branch**: `001-selectors-delimiters-benchmark` | **Date**: 2025-11-06 | **Spec**: `specs/001-selectors-delimiters-benchmark/spec.md`
**Input**: Feature specification for event selector delegation with descendant combinators, configurable placeholder delimiters, and performance benchmarking.

## Summary

Implement three cohesive enhancements to AppBlocks core:
1. Event delegation accepting descendant CSS selectors in event keys (`"click .list li .delete"`).
2. Configurable placeholder delimiters via `delimiters: ['{','}']` override applied to text and attribute placeholder parsing including filters.
3. A benchmark harness (Node + JSDOM) to measure mean render time over 10 standardized runs and compare against a stored baseline in `.benchmarks/baseline.json`.

Primary technical approach:
- Extend event binding logic in `src/core.js` to parse event keys into event name + full selector string, then use a single container listener with `closest()` checks for descendant matching.
- Refactor placeholder parsing (`src/placeholders.js`) to build dynamic RegExp from chosen delimiters while preserving filter `|` semantics, minimizing performance impact.
- Add a benchmark module (e.g., `tests/benchmark/` or `scripts/benchmark/`) using existing `AppBlock` public API with a controlled template+data set; integrate baseline persistence.

## Technical Context

**Language/Version**: JavaScript (ES6+) as per existing repo (Node runtime for benchmark tooling).
**Primary Dependencies**: Idiomorph (already used for rendering diffing), Jest (existing tests), JSDOM (test env), No new runtime deps planned (aim to avoid added bundle size).
**Storage**: N/A (baseline stored as local JSON file `.benchmarks/baseline.json`, gitignored).
**Testing**: Jest with JSDOM; new tests under `tests/core/events` (extended), `tests/placeholders` (delimiter variants), and `tests/benchmark` (timing harness).
**Target Platform**: Browser (library consumers) + Node (benchmark execution).
**Project Type**: Single small JS library (monorepo style not required).
**Performance Goals**: Maintain or improve current render time; benchmark provides reference mean (initial target: no >10% regression after changes).
**Constraints**: Minimize regex overhead, avoid increasing build size significantly (>1% growth flagged); event delegation must not introduce O(n * m) scanning per event (use closest and limited query).
**Scale/Scope**: Typical DOM subtree sizes (<5k nodes) for event delegation; placeholder parsing per render kept linear in text length.

## Constitution Check

Pre-Implementation Gate Assessment:
- Lightweight & Focused: No new external dependencies (PASS).
- Test-First Development: Will create failing tests for new selector behavior, delimiter parsing, benchmark results structure (PLAN COMPLIANT).
- Browser Compatibility & Simplicity: Pure DOM APIs (`addEventListener`, `closest`) widely supported—fallback not required (PASS). Documentation & changelog updates required (TO ENSURE during implementation).
- Documentation Updates: Need additions to `docs/filters.md` (delimiter mention?), `docs/utils.md` (if new helper), `docs/api.md` (new config key), `docs/changelog.md` (entry). (FLAG FOR IMPLEMENTATION TASKS)

Gate Verdict: PROVISIONALLY PASS — proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── core.js              # Extend event handling to support descendant selectors via delegation
├── placeholders.js      # Add delimiter-configurable parsing
└── ...                  # existing modules remain

tests/
├── core/
│   └── events.selectors-with-spaces.test.js  # new tests for descendant selectors
├── placeholders/
│   └── delimiters.test.js                    # new tests for custom delimiters
└── benchmark/
  └── render-benchmark.test.js              # optional: asserts shape (10 samples, mean)

scripts/
└── benchmark.js          # optional runner to produce JSON + report and manage baseline
```

**Structure Decision**: Single small JS library; add focused tests under existing groups and an optional `scripts/benchmark.js` runner to standardize measurements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Baseline file (gitignored) | Persistent local perf comparison | Keeping only ephemeral console output loses historical regression detection |
| Benchmark harness scripts | Repeatable perf measurement | Manual ad-hoc timing increases inconsistency and risk of missed regressions |
