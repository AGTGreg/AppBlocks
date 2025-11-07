# Tasks: Selectors, Delimiters, Benchmark

**Branch**: 001-selectors-delimiters-benchmark
**Spec**: specs/001-selectors-delimiters-benchmark/spec.md
**Plan**: specs/001-selectors-delimiters-benchmark/plan.md
**Generated**: 2025-11-06

## Phase 1: Setup

Purpose: Establish baseline environment and supporting local benchmark storage.

 - [X] T001 Create `.benchmarks/` directory (local baseline store, gitignored)
 - [X] T002 Add `.benchmarks/baseline.json` initialization script placeholder in `scripts/benchmark.js`
 - [X] T003 Ensure gitignore includes `.benchmarks/` entry
	- [X] T004 Add documentation stubs in `docs/changelog.md` for upcoming features

## Phase 2: Foundational

Purpose: Prepare failing tests (TDD) and scaffolds before implementing logic.

 - [X] T005 Create test file `tests/core/events.selectors-with-spaces.test.js` with failing tests for descendant selector delegation
 - [X] T006 Create test file `tests/placeholders/delimiters.test.js` with failing tests for custom delimiters & filters
 - [X] T007 Create test file `tests/benchmark/render-benchmark.test.js` asserting output shape (10 samples, mean)
 - [X] T008 Add benchmark runner skeleton `scripts/benchmark.js` (exports `runBenchmark()` returning placeholder structure)
 - [X] T009 Update `docs/api.md` with placeholder section for `delimiters` config key (to be finalized post-implementation)

## Phase 3: User Story 1 - Delegate events with descendant selectors (P1)

Story Goal: Event handlers fire correctly for nested matching elements using descendant selectors.
Independent Test Criteria: All tests in `events.selectors-with-spaces.test.js` pass; non-matching clicks never trigger handlers.

 - [X] T010 [US1] Implement event key parsing change in `src/core.js` (split first space only)
 - [X] T011 [P] [US1] Add delegated listener using `e.target.closest(selector)` logic in `src/core.js`
 - [X] T012 [US1] Update existing events docs in `docs/api.md` with descendant selector examples
 - [X] T013 [US1] Add edge case test for multiple spaces and attribute selector in `tests/core/events.selectors-with-spaces.test.js`
 - [X] T013A [P] [US1] Add legacy simple selector test (`'click .child'`) in `tests/core/events.selectors-with-spaces.test.js` (assert unchanged behavior)
 - [X] T013B [US1] Add backward compatibility note to events section in `docs/api.md`

## Phase 4: User Story 2 - Choose placeholder delimiters (P2)

Story Goal: Developers configure custom delimiters applied to text and attribute placeholders including filters.
Independent Test Criteria: Delimiter tests pass for default `{}` and custom `[[ ]]` with filters and missing property handling.

 - [X] T014 [US2] Implement delimiters config reading in `src/core.js` (store on instance)
 - [X] T015 [US2] Refactor regex in `src/placeholders.js` to dynamic based on `comp.delimiters`
 - [X] T016 [P] [US2] Add attribute placeholder handling for custom delimiters in `src/placeholders.js`
- [X] T017 [US2] Extend tests for nested properties & filters in `tests/placeholders/delimiters.test.js`
- [X] T017A [P] [US2] Add failing tests for invalid delimiters (empty strings, single-element array, non-string entries) in `tests/placeholders/delimiters.test.js`
- [X] T017B [US2] Implement validation + fallback + error logging for invalid delimiters in `src/core.js`
 - [X] T018 [US2] Update docs placeholder section in `docs/api.md` describing `delimiters` array and fallback behavior

## Phase 5: User Story 3 - Measure rendering performance (P3)

Story Goal: Provide repeatable benchmark producing 10 samples, mean, and comparison report vs baseline.
Independent Test Criteria: Benchmark test validates sample count, mean numeric, optional baseline comparison string.

 - [X] T019 [US3] Implement benchmark scenario template builder in `scripts/benchmark.js` (include: 2 placeholders, 1 c-if, 1 c-for, ≥2 filters)
 - [X] T019A [P] [US3] Add assertions in `tests/benchmark/render-benchmark.test.js` verifying scenario includes c-if, c-for, and filtered placeholders
 - [X] T020 [US3] Add timing capture (beforeRender/afterRender) into benchmark runner
 - [X] T021 [US3] Baseline read/write logic to `.benchmarks/baseline.json` in `scripts/benchmark.js` (compute absolute & % delta when baseline present)
 - [X] T022 [US3] Outlier detection (mark >200% median deviation) and include note in report
 - [X] T022A [P] [US3] Extend benchmark test to assert report contains absolute delta and percentage delta patterns
 - [X] T023 [P] [US3] Integrate soft regression warning (>10% mean increase) in `scripts/benchmark.js`
 - [X] T024 [US3] Extend benchmark test `tests/benchmark/render-benchmark.test.js` to cover regression warning path
 - [X] T025 [US3] Add usage docs for benchmark in `docs/api.md` or dedicated doc section

## Phase 6: Polish & Cross-Cutting

 - [X] T026 Finalize `docs/changelog.md` entries summarizing added features
- [ ] T027 Review build size impact after changes (compare bundle before/after)
- [ ] T028 Manual browser smoke test for event delegation & delimiters
 - [X] T029 Ensure all tests pass and remove any redundant temporary code/comments
 - [X] T030 Add example snippet for benchmark output to `quickstart.md`
 - [X] T031 Add CLI wrapper `scripts/benchmark-run.js` to run benchmark scenarios from the command line and document usage in `docs/benchmark.md`

## Dependencies & Order Graph

```
T001 -> T005
T002 -> T008
T005 -> T010
T006 -> T014
T007 -> T019
T008 -> T019
T010 -> T011 -> T012 -> T013
T014 -> T015 -> T016 -> T017 -> T018
T019 -> T020 -> T021 -> T022 -> T023 -> T024 -> T025
All story phases -> T026 -> T027 -> T028 -> T029 -> T030
```

## Parallel Opportunities

- T011 can run in parallel with T012 after T010
- T016 can run in parallel with T017 after T015
- T023 can run in parallel with T022 after T021

## MVP Scope

MVP = Phase 3 (User Story 1) completion: event delegation with descendant selectors operational and documented.

## Validation

Each story phase produces passing tests for its feature area; phases are independently demonstrable. Edge cases in spec covered by tests T013 (selectors), T017 (delimiters filters/missing props), T022 (benchmark outliers).

## Notes

- Ensure initial tests fail before implementing functionality (Constitution: Test-First Development)
- Keep placeholder regex efficient; monitor impact with benchmark before and after FR-010..FR-015 (delimiter-related) implementation.
