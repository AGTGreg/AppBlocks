# Tasks: Method Calls in Placeholders & Iteration Directives

Branch: 001-method-calls | Spec: specs/001-method-calls/spec.md | Plan: specs/001-method-calls/plan.md

## Dependencies (User Story Order)

1. US1 (P1): Invoke methods in placeholders (with filters)
2. US2 (P2): Invoke methods in c-for iterable expressions
3. US3 (P3): Consistency with c-if/c-ifnot and nested calls

Parallel opportunities exist within each phase where marked [P].

---

## Phase 1: Setup

- [X] T001 Ensure current branch checked out (001-method-calls)
- [X] T002 Verify test runner works (npm test) and baseline is green
- [X] T003 Create placeholder tests directory if needed at tests/placeholders/
- [ ] T004 Run lint to ensure clean baseline (npm run lint)

## Phase 2: Foundational (Shared Evaluator & Wiring)

- [X] T005 Create shared evaluator stub in src/helpers.js (evaluateTemplateExpression(app, scope, node, expr, cache))
- [ ] T006 Wire a per-render cache context in src/processing.js and pass to evaluator calls
- [ ] T007 Integrate logger usage pattern for evaluator errors in src/logger.js (reuse existing exports; format `[method-call-error] <expression> : <message>`)

---

## Phase 3: User Story 1 (P1) – Placeholders method calls

Goal: Render method call results within placeholders; support filter chains; one evaluation per expression per render.
Independent test: Template with `{sumMethod(data.a, data.b)}` renders sum; `{...|minusOne}` applies filter.

- [X] T008 [US1] Add failing tests for method calls in placeholders at tests/placeholders/method-calls.test.js
- [X] T009 [P] [US1] Add failing tests for filter chains after method calls at tests/placeholders/method-calls.test.js
- [X] T010 [US1] Add failing tests for whitespace tolerance `{sumMethod( data.a , data.b )}` at tests/placeholders/method-calls.test.js
- [X] T011 [US1] Add failing tests for empty argument list `{methodWithoutArgs()}` injection at tests/placeholders/method-calls.test.js
- [X] T012 [US1] Add failing tests for null/undefined method return -> empty string at tests/placeholders/method-calls.test.js
- [X] T013 [US1] Add failing tests for thrown error in method (logs & empty string) at tests/placeholders/method-calls.test.js
- [X] T014 [US1] Implement evaluator parsing for method calls and argument evaluation in src/helpers.js
- [X] T015 [US1] Inject app instance as first argument automatically in src/helpers.js
- [X] T016 [US1] Apply filter chains post-evaluation in src/helpers.js
- [X] T017 [US1] Use evaluator in placeholders processing path in src/placeholders.js
- [X] T018 [US1] Ensure undefined/null placeholder values render as empty string in src/helpers.js
- [X] T019 [US1] Implement per-render cache key (node identity + expression text) in src/helpers.js
- [X] T020 [US1] Make tests pass for placeholders & filters (includes whitespace, empty arg, error cases) in tests/placeholders/method-calls.test.js

---

## Phase 4: User Story 2 (P2) – c-for with method calls

Goal: Iterate over result of method call; log error and skip if non-iterable.
Independent test: `c-for="n in rangeMethod(data.start,data.end)"` renders correct items; non-iterable logs and renders none.

- [X] T021 [US2] Add failing tests for c-for with method call iterable at tests/directives/c-for.method-calls.test.js
- [X] T022 [P] [US2] Add failing tests for non-iterable return (log + skip) at tests/directives/c-for.method-calls.test.js
- [X] T023 [US2] Add failing tests for nested call inside iterable expression at tests/directives/c-for.method-calls.test.js
- [X] T024 [US2] Use shared evaluator for c-for iterable expression in src/directives.js
- [X] T025 [US2] Validate iterability; on failure log error and skip iteration in src/directives.js
- [X] T026 [US2] Ensure single evaluation per expression per render via passed cache in src/processing.js
- [X] T027 [US2] Make tests pass for c-for iterable evaluation and error handling (including nested, non-iterable) in tests/directives/c-for.method-calls.test.js

---

## Phase 5: User Story 3 (P3) – Consistency with c-if/c-ifnot & nested calls

Goal: Ensure method call invocation semantics match existing c-if/c-ifnot and support nested calls uniformly.
Independent test: Side-by-side usage in placeholder, c-for, and c-if produces consistent behavior.

- [X] T028 [US3] Add failing tests for nested method calls across placeholder and c-for at tests/core/customMethods.test.js
- [X] T029 [P] [US3] Add failing tests verifying consistency with c-if/c-ifnot at tests/directives/c-if-methods.test.js
- [X] T030 [US3] Reuse evaluator in c-if/c-ifnot path (no divergent logic) in src/directives.js
- [X] T031 [US3] Validate single-evaluation invariant for nested calls via spies in tests/core/customMethods.test.js
- [X] T032 [US3] Make tests pass for nested and consistency scenarios in tests/core/customMethods.test.js

---

## Final Phase: Polish & Cross-Cutting

- [X] T033 Update docs/directives.md (c-for) and add method invocation examples (with filters & whitespace) in docs/methods.md or new docs/placeholders.md
- [X] T034 Update docs/_sidebar.md to link new/updated documentation pages
- [X] T035 Update docs/changelog.md with feature summary, rationale, and usage examples
- [X] T036 Add benchmark scenario for nested + filtered + whitespace method expressions in scripts/benchmark.js
- [X] T037 Add micro-benchmark for deep nesting (≥5 levels) in scripts/benchmark.js
- [X] T038 Run full test suite and confirm <5% overhead using scripts/benchmark-run.js
- [X] T039 Measure build size before/after (dist output) and record delta in docs/changelog.md
- [X] T040 Scan for unintended globals or bundle growth in build artifacts
- [X] T041 Add coverage report task and assert ≥90% new branch coverage (npm test -- --coverage)
- [X] T042 Add test ensuring re-render in same cycle does not double-invoke (spy count) in tests/core/customMethods.test.js

## Parallelization Examples

- In Phase 3: T008 can run in parallel with T007 once file scaffolded; they touch the same file but represent distinct test cases – prefer sequential if conflict; else split by describe blocks.
- In Phase 4: T017 can be authored in parallel with T016 as separate test cases in same file; commit sequencing required.
- In Phase 5: T023 can be authored in parallel with T022 (different files).
- Polish phase tasks (T027–T030) can be done in parallel by different contributors.

## Implementation Strategy

Start with US1 to achieve MVP: placeholders method calls with filters and single-evaluation cache. Then add US2 for c-for. Finally, validate consistency and nested scenarios (US3). Maintain DRY by centralizing evaluation logic in helpers.js and reusing across placeholders, c-for, and conditionals.

## Counts & Validation

- Total tasks: 42
- Per story: US1 (13), US2 (7), US3 (5), Setup/Foundational/Polish (17)
- Independent test criteria:
  - US1: Placeholder renders sum; filter adjusts value
  - US2: c-for count matches iterable; non-iterable logs and renders none
  - US3: Nested calls and c-if parity verified
- Format validation: All tasks follow `- [ ] T### [P]? [US#]? Description with file path` format (renumbered after additions).
