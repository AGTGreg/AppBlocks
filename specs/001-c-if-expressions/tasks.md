---

description: "Task list for implementing c-if / c-ifnot expression evaluation"
---

# Tasks: c-if / c-ifnot Expression Evaluation

**Input**: Design documents from `/specs/001-c-if-expressions/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Mandatory per constitution, this feature plans to add directive tests prior to implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm environment and repo readiness for this feature work

- [x] T001 Verify branch `001-c-if-expressions` is checked out and up-to-date
- [x] T002 [P] Ensure Jest/JSDOM config is valid via `npm test` dry run (no new tests yet)
- [x] T003 Capture pre-feature build size (bytes) from `build-cjs/` and record baseline in `specs/001-c-if-expressions/research.md` (append section)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Minimal shared foundation before story work

- [x] T004 [P] Create expression safety utility stub in `src/utils.js` (token scan helpers, no behavior yet)
- [x] T005 Define configuration shape to enable built-ins in `src/core.js` (e.g., `config.allowBuiltins`) and document defaults in code comments
- [x] T006 Add initial test scaffolding files (empty failing placeholders) in `tests/directives/` for c-if, c-ifnot, edge cases

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Conditional Rendering with Data Length (Priority: P1) 🎯 MVP

**Goal**: `c-if` supports JS expression using app instance scope; renders only when true

**Independent Test**: With `data.messages` length 9 vs 10, assert absence/presence respectively

### Tests (Write First / Must Initially Fail)

- [x] T007 [P] [US1] Add failing test for data length render condition in `tests/directives/c-if-expression.test.js` (length 9 vs 10)
- [x] T008 [P] [US1] Add failing legacy boolean flag test (`c-if="someFlag"`) in `tests/directives/c-if-legacy.test.js`
- [x] T009 [P] [US1] Add failing non-boolean truthiness test (number, array) in `tests/directives/c-if-expression-edgecases.test.js`
- [x] T010 [P] [US1] Add failing undefined property test (`data.unknown`) and method throw scenario
- [x] T011 [P] [US1] Add failing test ensuring `c-for` behavior unaffected when sibling `c-if` present

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement `isBlockedExpression(expr)` in `src/utils.js` (reject assignments carefully: single `=` not part of `==`, `===`, `!=`, `!==`; plus ++/--, new, function, class, =>, import, await, yield, try/catch/finally, delete, constructor, __proto__, eval, Function)
- [x] T013 [P] [US1] Implement compile-and-cache in `src/directives.js` (Map cache keyed by expression string; `new Function` strict mode; shadowed params)
- [x] T014 [US1] Wire `c-if` directive to evaluator in `src/directives.js` (evaluate before nested c-for; coerce truthiness; handle empty string)
- [x] T015 [US1] Graceful error handling for `c-if` in `src/directives.js` (catch errors; false on error; single warning per defined render cycle)
- [x] T016 [US1] Update docs with basic usage examples in `docs/directives.md` and link from `_sidebar.md`
- [x] T017 [US1] Add changelog entry in `docs/changelog.md` describing new expression capability and defaults

---

## Phase 4: User Story 2 - Conditional Rendering with Method Calls (Priority: P2)

**Goal**: `c-if` expressions may call instance methods with `data` arguments; render based on method result

**Independent Test**: With `hasUser` returning true/false, assert presence/absence

### Tests (Write First / Must Initially Fail)

- [x] T018 [P] [US2] Add failing test for method true/false rendering in `tests/directives/c-if-methods.test.js`
- [x] T019 [P] [US2] Add failing test for argument reference integrity (mutations reflect) in same file

### Implementation for User Story 2

- [x] T020 [P] [US2] Expose instance methods to evaluator scope in `src/directives.js` (bound to instance)
- [x] T021 [US2] Ensure argument passing uses references (not copies) from `data` in `src/directives.js`
- [x] T022 [US2] Extend docs with method-based example in `docs/directives.md`

---

## Phase 5: User Story 3 - Inverted Conditional via c-ifnot (Priority: P3)

**Goal**: `c-ifnot` renders only when the expression evaluates to false using the same evaluation path

**Independent Test**: With lengths 9 vs 10, `c-ifnot` shows inverse behavior of `c-if`

### Tests (Write First / Must Initially Fail)

- [x] T023 [P] [US3] Add failing inversion test (length 9 vs 10) in `tests/directives/c-ifnot-expression.test.js`
- [x] T024 [P] [US3] Add failing empty expression inversion test in same file

### Implementation for User Story 3

- [x] T025 [P] [US3] Implement `c-ifnot` evaluation path in `src/directives.js` (invert decision from evaluator)
- [x] T026 [US3] Document `c-ifnot` behavior and examples in `docs/directives.md`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, performance, and docs completeness

- [x] T027 [P] Add optional built-in allow-list integration in `src/directives.js` (read `config.allowBuiltins`, pass `Math` when enabled)
- [x] T028 [P] Add benchmark scenario to `scripts/benchmark-run.js` for templates with 20 conditionals; verify ≤5% overhead in `docs/benchmark.md`
- [x] T029 [P] Evaluate benchmark results; if >5% overhead create optimization issue & block release
- [x] T030 Improve logging strategy in `src/logger.js` to ensure single warning per expression per render cycle (define cycle = one full template processing pass)
- [x] T031 Update `docs/directives.md` with edge cases (undefined props, method throw, non-boolean truthiness, empty expression)
- [x] T032 Update `_sidebar.md` to include new/updated docs
- [x] T033 [P] Assess post-feature build size (bytes) from `build-cjs/`; compare with baseline; document delta in `docs/changelog.md`
- [x] T034 [P] Browser compatibility smoke test (Chrome, Firefox, Safari, Edge) using sample `tmp/test.html`; record outcomes in `research.md`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phases 3/4/5 (stories can proceed in parallel after Phase 2) → Phase 6
- Story independence:
  - US1 (P1) has no dependency on US2/US3
  - US2 (P2) independent of US3 (P3)
  - US3 (P3) independent of US2 (P2)

## Parallel Opportunities

- [P] tasks in Phases 2, 3, 5, and 6 can run concurrently (different files)
- After Phase 2, US1/US2/US3 tasks can be staffed in parallel by different contributors

## MVP Scope

- Complete Phase 1, Phase 2, Phase 3 tests (fail), implement Phase 3, then confirm tests pass (User Story 1). Stop and validate performance benchmark stub before proceeding.

## Format Validation

All tasks adhere to required format: `- [ ] T### [P?] [US?] Description with file path`.
