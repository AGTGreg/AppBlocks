# Implementation Tasks: Template and Event Enhancements

**Feature**: 003-template-enhancements
**Branch**: `003-template-enhancements`
**Status**: Ready for implementation
**Created**: November 6, 2025

## Overview

This document organizes implementation tasks by user story priority, enabling independent development and testing of each enhancement. Each user story is a complete, testable increment following TDD principles.

**User Stories (Priority Order)**:
1. **US1** (P1): Event Selectors with Spaces - Enable complex CSS selectors in event definitions
2. **US2** (P2): Object Iteration in c-for - Support developer-defined pointer names for key-value iteration
3. **US3** (P3): Method Calls with Parameters - Enable template expressions with typed parameters
4. **US4** (P3): Logical Operators in c-if - Support compound conditions with and/or/not operators

**Implementation Strategy**: Test-first development (TDD) per constitution. Each user story follows Red-Green-Refactor cycle with milestone testing gates.

---

## Phase 1: Setup and Environment

**Goal**: Prepare development environment and ensure existing tests pass.

### Tasks

- [ ] T001 Verify existing test suite passes with `npm test`
- [ ] T002 Review existing test fixtures in `tests/fixtures/mockData.js` for reusability
- [ ] T003 Verify build configuration in `rollup.config.js` and `babel.config.js`
- [ ] T004 Create feature branch checkpoint: ensure clean starting state

**Completion Criteria**: All existing tests pass (100% baseline), build succeeds, no uncommitted changes.

---

## Phase 2: Foundational Infrastructure

**Goal**: Add shared parsing utilities and test helpers needed across multiple user stories.

### Tasks

- [ ] T005 [P] Add expression caching utility to `src/utils.js` (Map-based cache with get/set methods)
- [ ] T006 [P] Add test helper for expression cache testing in `tests/fixtures/mockData.js`
- [ ] T007 [P] Add error context creation helper to `src/logger.js` for structured error logging
- [ ] T008 Run foundational tests: `npm run test:utils` and `npm run test:logger`

**Completion Criteria**: Caching and error logging infrastructure available, tests pass.

**Milestone Checkpoint**: Run `npm test` - all tests MUST pass before proceeding to user stories.

---

## Phase 3: User Story 1 - Event Selectors with Spaces (P1)

**Story Goal**: Enable developers to use complex CSS selectors (with spaces) in event definitions to target nested elements within the component.

**Independent Test Criteria**:
- Event handler attached to nested element via space-separated selector triggers correctly
- Multi-level selectors (3+ spaces) work
- Backward compatibility: simple selectors still work
- Scoping: selectors only match elements inside component

### Tests (Write First - TDD)

- [ ] T009 [US1] Write test: event handler triggers for space-separated selector `'click #parent .child'` in `tests/core/events.test.js`
- [ ] T010 [US1] Write test: multi-level selector `'click #nav ul li a'` triggers correctly in `tests/core/events.test.js`
- [ ] T011 [US1] Write test: event selector with multiple spaces triggers on deeply nested button in `tests/core/events.test.js`
- [ ] T012 [US1] Write test: backward compatibility - simple selector `'click #button'` still works in `tests/core/events.test.js`
- [ ] T013 [US1] Write test: selector scoped to component (not global) in `tests/core/events.test.js`
- [ ] T014 [US1] Write test: special CSS characters (attribute selectors, combinators) work in `tests/core/events.test.js`
- [ ] T015 [US1] Run tests: `npm run test:core` - expect failures (Red phase)

### Implementation

- [ ] T016 [US1] Update event parsing logic in `src/core.js` to split on first space only (preserve remaining spaces in selector)
- [ ] T017 [US1] Update event listener attachment in `src/core.js` to use `comp.el.querySelectorAll(selector)` for scoping
- [ ] T018 [US1] Add error handling for invalid selectors in `src/core.js` (log error, skip attachment)
- [ ] T019 [US1] Run tests: `npm run test:core` - expect passes (Green phase)
- [ ] T020 [US1] Refactor event parsing for clarity if needed (Refactor phase)

**Milestone Checkpoint**: Run `npm test` - all tests MUST pass. US1 complete and independently testable.

---

## Phase 4: User Story 2 - Object Iteration in c-for (P2)

**Story Goal**: Enable developers to iterate over objects using c-for with developer-defined pointer names for keys and values.

**Independent Test Criteria**:
- Object iteration renders elements for each key-value pair
- Developer-defined pointer names work (not hardcoded)
- Backward compatibility: array iteration still works
- Empty objects render zero elements without error

### Tests (Write First - TDD)

- [ ] T021 [US2] Write test: object iteration with custom pointer names `c-for="field, value in data.user"` in `tests/directives/c-for.test.js`
- [ ] T022 [US2] Write test: pointer names accessible in template (renders actual keys and values) in `tests/directives/c-for.test.js`
- [ ] T023 [US2] Write test: backward compatibility - array syntax `c-for="item in data.items"` still works in `tests/directives/c-for.test.js`
- [ ] T024 [US2] Write test: empty object renders zero elements without error in `tests/directives/c-for.test.js`
- [ ] T025 [US2] Write test: nested objects accessible via `{value.property}` in `tests/directives/c-for.test.js`
- [ ] T026 [US2] Write test: only own enumerable properties iterated (no inherited/Symbols) in `tests/directives/c-for.test.js`
- [ ] T027 [US2] Write test: various pointer name examples (`id, contact`, `sku, product`) in `tests/directives/c-for.test.js`
- [ ] T028 [US2] Run tests: `npm run test:directives` - expect failures (Red phase)

### Implementation

- [ ] T029 [US2] Add c-for syntax parser in `src/directives.js` to detect 1-pointer vs 2-pointer syntax (check for comma)
- [ ] T030 [US2] Extract developer-defined pointer names from directive attribute in `src/directives.js`
- [ ] T031 [US2] Add runtime type detection using `Array.isArray()` in `src/directives.js`
- [ ] T032 [US2] Implement object iteration using `Object.keys()` in `src/directives.js`
- [ ] T033 [US2] Create pointer context with developer-defined names during iteration in `src/directives.js`
- [ ] T034 [US2] Run tests: `npm run test:directives` - expect passes (Green phase)
- [ ] T035 [US2] Refactor iteration logic for clarity if needed (Refactor phase)

**Milestone Checkpoint**: Run `npm test` - all tests MUST pass. US2 complete and independently testable.

---

## Phase 5: User Story 3 - Method Calls with Parameters (P3)

**Story Goal**: Enable developers to call methods with parameters from templates (placeholders, directives, filters) with proper type detection.

**Independent Test Criteria**:
- Method calls with string literals (single quotes) work
- Method calls with property references work
- Method calls with numeric/boolean literals work
- Nested method calls work
- Auto-injection of app instance works
- Failed method calls render empty string and log error

### Tests (Write First - TDD)

#### Parsing Tests

- [ ] T036 [US3] Write test: parse method call with string literal `formatPrice(product.price, 'USD')` in `tests/processing/processNode.test.js`
- [ ] T037 [US3] Write test: parse method call with property reference `double(data.value)` in `tests/processing/processNode.test.js`
- [ ] T038 [US3] Write test: parse method call with numeric literal `calculate(42, 3.14)` in `tests/processing/processNode.test.js`
- [ ] T039 [US3] Write test: parse method call with boolean literal `format(true, false)` in `tests/processing/processNode.test.js`
- [ ] T040 [US3] Write test: parse nested method call `formatDate(getTimestamp())` in `tests/processing/processNode.test.js`
- [ ] T041 [US3] Write test: parse method call with no params `{myMethod()}` and `{myMethod}` in `tests/processing/processNode.test.js`
- [ ] T042 [US3] Write test: distinguish string literal `'text'` from property path `data.name` in `tests/processing/processNode.test.js`
- [ ] T043 [US3] Run tests: `npm run test:processing` - expect failures (Red phase)

#### Placeholder Execution Tests

- [ ] T044 [US3] Write test: method call in placeholder returns correct value in `tests/placeholders/textNodes.test.js`
- [ ] T045 [US3] Write test: app instance auto-injected as first parameter in `tests/placeholders/textNodes.test.js`
- [ ] T046 [US3] Write test: string literal parameter passed correctly in `tests/placeholders/textNodes.test.js`
- [ ] T047 [US3] Write test: property reference parameter resolved correctly in `tests/placeholders/textNodes.test.js`
- [ ] T048 [US3] Write test: method not found renders empty string and logs error in `tests/placeholders/textNodes.test.js`
- [ ] T049 [US3] Write test: method throws error renders empty string and logs error in `tests/placeholders/textNodes.test.js`
- [ ] T050 [US3] Run tests: `npm run test:placeholders` - expect failures (Red phase)

#### Directive Integration Tests

- [ ] T051 [US3] Write test: method call in c-for directive `c-for="item in getItems('active')"` in `tests/directives/c-for.test.js`
- [ ] T052 [US3] Write test: method call in c-if directive `c-if="isAuthorized(data.user.role, 'admin')"` in `tests/directives/c-if.test.js`
- [ ] T053 [US3] Run tests: `npm run test:directives` - expect failures (Red phase)

#### Filter Integration Tests

- [ ] T054 [US3] Write test: method call in filter chain in `tests/filters/integration.test.js`
- [ ] T055 [US3] Run tests: `npm run test:filters` - expect failures (Red phase)

### Implementation

#### Parsing Implementation

- [ ] T056 [US3] Create method call tokenizer in `src/processing.js` or `src/utils.js` (extract method name and parameters)
- [ ] T057 [US3] Implement parameter type detection (single quotes → string, unquoted → property, numbers, booleans) in `src/processing.js`
- [ ] T058 [US3] Handle nested method calls recursively in `src/processing.js`
- [ ] T059 [US3] Handle escaped quotes in string literals in `src/processing.js`
- [ ] T060 [US3] Handle whitespace trimming around parameters in `src/processing.js`
- [ ] T061 [US3] Run tests: `npm run test:processing` - expect passes (Green phase)

#### Execution Implementation

- [ ] T062 [US3] Implement method call execution in `src/placeholders.js` (resolve parameters, call method)
- [ ] T063 [US3] Auto-inject app instance as first parameter in `src/placeholders.js`
- [ ] T064 [US3] Resolve property reference parameters using `getProp()` in `src/placeholders.js`
- [ ] T065 [US3] Add error handling (method not found) with console logging in `src/placeholders.js`
- [ ] T066 [US3] Add error handling (method throws) with console logging in `src/placeholders.js`
- [ ] T067 [US3] Integrate expression caching for method calls in `src/placeholders.js`
- [ ] T068 [US3] Run tests: `npm run test:placeholders` - expect passes (Green phase)

#### Integration Implementation

- [ ] T069 [US3] Enable method calls in c-for directive expressions in `src/directives.js`
- [ ] T070 [US3] Enable method calls in c-if directive expressions in `src/directives.js`
- [ ] T071 [US3] Run tests: `npm run test:directives` - expect passes (Green phase)

- [ ] T072 [US3] Enable method calls in filter chains in `src/filters.js`
- [ ] T073 [US3] Run tests: `npm run test:filters` - expect passes (Green phase)

- [ ] T074 [US3] Refactor parsing/execution logic for clarity if needed (Refactor phase)

**Milestone Checkpoint**: Run `npm test` - all tests MUST pass. US3 complete and independently testable.

---

## Phase 6: User Story 4 - Logical Operators in c-if (P3)

**Story Goal**: Enable developers to use logical operators (and, or, not) in c-if conditions with proper precedence.

**Independent Test Criteria**:
- AND operator evaluates correctly
- OR operator evaluates correctly
- NOT operator evaluates correctly
- Operator precedence (comparisons > not > and > or) respected
- Parentheses grouping works
- Backward compatibility: comparison-only conditions still work

### Tests (Write First - TDD)

- [ ] T075 [US4] Write test: AND operator `c-if="data.a and data.b"` in `tests/directives/c-if.test.js`
- [ ] T076 [US4] Write test: OR operator `c-if="data.a or data.b"` in `tests/directives/c-if.test.js`
- [ ] T077 [US4] Write test: NOT operator `c-if="not data.blocked"` in `tests/directives/c-if.test.js`
- [ ] T078 [US4] Write test: operator precedence without parens `a and b or c` in `tests/directives/c-if.test.js`
- [ ] T079 [US4] Write test: parentheses grouping `a and (b or c)` in `tests/directives/c-if.test.js`
- [ ] T080 [US4] Write test: combined with comparisons `data.age > 18 and data.isActive` in `tests/directives/c-if.test.js`
- [ ] T081 [US4] Write test: complex nested condition `isActive and (role == 'admin' or role == 'mod')` in `tests/directives/c-if.test.js`
- [ ] T082 [US4] Write test: truthy/falsy coercion (0, '', null, undefined) in `tests/directives/c-if.test.js`
- [ ] T083 [US4] Write test: backward compatibility - comparison-only condition still works in `tests/directives/c-if.test.js`
- [ ] T084 [US4] Write test: malformed syntax renders nothing and logs error in `tests/directives/c-if.test.js`
- [ ] T085 [US4] Run tests: `npm run test:directives` - expect failures (Red phase)

### Implementation

- [ ] T086 [US4] Create logical expression tokenizer in `src/directives.js` (split on operators, preserve parens)
- [ ] T087 [US4] Implement recursive descent parser for operator precedence in `src/directives.js` (parseOr → parseAnd → parseNot → parseComparison)
- [ ] T088 [US4] Build expression tree with proper precedence in `src/directives.js`
- [ ] T089 [US4] Implement expression tree evaluator in `src/directives.js` (recursive traversal)
- [ ] T090 [US4] Implement AND operator logic (`left && right`) in `src/directives.js`
- [ ] T091 [US4] Implement OR operator logic (`left || right`) in `src/directives.js`
- [ ] T092 [US4] Implement NOT operator logic (`!operand`) in `src/directives.js`
- [ ] T093 [US4] Apply truthy/falsy coercion for non-boolean values in `src/directives.js`
- [ ] T094 [US4] Add error handling for malformed syntax (log error, return false) in `src/directives.js`
- [ ] T095 [US4] Integrate expression caching for logical expressions in `src/directives.js`
- [ ] T096 [US4] Run tests: `npm run test:directives` - expect passes (Green phase)
- [ ] T097 [US4] Refactor parsing/evaluation logic for clarity if needed (Refactor phase)

**Milestone Checkpoint**: Run `npm test` - all tests MUST pass. US4 complete and independently testable.

---

## Phase 7: Integration & Cross-Story Testing

**Goal**: Verify multiple features work together correctly.

### Tasks

- [ ] T098 [P] Write integration test: method calls in c-for with object iteration in `tests/directives/c-for.test.js`
- [ ] T099 [P] Write integration test: method calls in c-if with logical operators in `tests/directives/c-if.test.js`
- [ ] T100 [P] Write integration test: event handler using method call with complex selector in `tests/core/events.test.js`
- [ ] T101 [P] Write integration test: all four features used together in single AppBlock in `tests/core/rendering.test.js`
- [ ] T102 Run full test suite: `npm test` - all tests MUST pass

**Completion Criteria**: All integration tests pass, no regressions in existing functionality.

---

## Phase 8: Performance & Optimization

**Goal**: Ensure performance within 10% of baseline (per SC-007).

### Tasks

- [ ] T103 Create performance benchmark test for expression caching in `tests/performance/` (if directory exists, otherwise skip)
- [ ] T104 Benchmark: template rendering with method calls vs current workarounds
- [ ] T105 Benchmark: c-for object iteration vs array iteration
- [ ] T106 Benchmark: logical expressions vs nested c-if directives
- [ ] T107 Verify all benchmarks within 10% of baseline performance
- [ ] T108 Optimize caching strategy if benchmarks fail (consider LRU eviction for cache size limits)

**Completion Criteria**: Performance benchmarks pass, caching optimizations complete.

---

## Phase 9: Documentation Updates

**Goal**: Update all documentation to reflect new features (per constitution requirement).

### Tasks

- [ ] T109 Update `docs/api.md` with event selector enhancement examples
- [ ] T110 Update `docs/directives.md` with c-for object iteration syntax and examples
- [ ] T111 Update `docs/directives.md` with c-if logical operator syntax and examples
- [ ] T112 Update `docs/methods.md` with method call parameter syntax and type examples
- [ ] T113 Add comprehensive examples for all four features in respective docs
- [ ] T114 Update `docs/changelog.md` with all changes (version 2.0.4 → 2.1.0)
- [ ] T115 Update `docs/_sidebar.md` if new sections were added
- [ ] T116 Review all documentation for consistency and accuracy

**Completion Criteria**: All docs updated, changelog complete, examples provided.

---

## Phase 10: Build & Final Validation

**Goal**: Build distribution files and perform final quality checks.

### Tasks

- [ ] T117 Run full test suite one final time: `npm test` - 100% pass required
- [ ] T118 Run test coverage report: `npm run test:coverage` - verify coverage maintained or improved
- [ ] T119 Build library: `npm run build` - verify successful build
- [ ] T120 Check build output size in `dist/` - verify minimal size increase (per constitution)
- [ ] T121 Test built library manually in browser (load UMD bundle, verify features work)
- [ ] T122 Verify backward compatibility: load existing AppBlock apps with new build, confirm no breaks
- [ ] T123 Run linter if configured: `npm run lint` (or skip if not configured)
- [ ] T124 Final git status check: all changes committed, no uncommitted files

**Completion Criteria**: Build succeeds, size impact acceptable, manual tests pass, all changes committed.

---

## Task Dependencies & Execution Order

### Story Completion Order (Sequential)

1. **Phase 1 & 2** (Setup & Foundation) → Must complete first
2. **Phase 3** (US1: Event Selectors) → Independent, can start after foundation
3. **Phase 4** (US2: Object Iteration) → Independent, can start after foundation
4. **Phase 5** (US3: Method Calls) → Independent, can start after foundation
5. **Phase 6** (US4: Logical Operators) → Independent, can start after foundation
6. **Phase 7-10** (Integration, Performance, Docs, Build) → After all stories complete

### Parallelization Opportunities

**Within Each Story** (marked with [P]):
- Test writing tasks can be done in parallel
- Implementation tasks in different files can be done in parallel

**Across Stories**:
- US1, US2, US3, US4 are INDEPENDENT after Phase 2 completes
- Can implement all four stories in parallel by different developers
- Each story has its own test suite and file scope

**Example Parallel Workflow**:
```
Phase 1 & 2 (Sequential - Foundation)
    ↓
┌───────────┬───────────┬───────────┬───────────┐
│   US1     │   US2     │   US3     │   US4     │
│ (core.js) │(directives│(processing│(directives│
│           │    .js)   │  .js, etc)│    .js)   │
└───────────┴───────────┴───────────┴───────────┘
    ↓           ↓           ↓           ↓
    └───────────┴───────────┴───────────┘
                    ↓
        Phase 7-10 (Sequential - Finalization)
```

### Milestone Testing Gates

After each phase, run `npm test` - ALL tests MUST pass before proceeding:
- ✓ After Phase 2 (Foundation)
- ✓ After Phase 3 (US1 complete)
- ✓ After Phase 4 (US2 complete)
- ✓ After Phase 5 (US3 complete)
- ✓ After Phase 6 (US4 complete)
- ✓ After Phase 7 (Integration)
- ✓ After Phase 10 (Final)

---

## Independent Test Criteria Summary

### US1: Event Selectors with Spaces
- ✅ Handler triggers for `'click #parent .child'`
- ✅ Multi-level selector works
- ✅ Simple selectors still work (backward compat)
- ✅ Selectors scoped to component only

### US2: Object Iteration in c-for
- ✅ Object renders elements for each key-value pair
- ✅ Custom pointer names work
- ✅ Array iteration still works (backward compat)
- ✅ Empty object renders zero elements

### US3: Method Calls with Parameters
- ✅ String literals parsed correctly
- ✅ Property references resolved correctly
- ✅ App instance auto-injected
- ✅ Failed calls render empty string + log error

### US4: Logical Operators in c-if
- ✅ AND/OR/NOT operators work
- ✅ Precedence respected
- ✅ Parentheses grouping works
- ✅ Comparison-only conditions still work (backward compat)

---

## Implementation Strategy

### MVP Scope (Recommended)
**Minimum Viable Product**: User Story 1 only (Event Selectors)
- Delivers immediate, high-value capability
- Lowest risk (isolated to core.js)
- Validates test-first workflow
- Can release as 2.1.0-beta.1

### Incremental Delivery Path
1. Release US1 → 2.1.0-beta.1
2. Release US1+US2 → 2.1.0-beta.2
3. Release US1+US2+US3 → 2.1.0-beta.3
4. Release US1+US2+US3+US4 → 2.1.0 (full release)

### Full Scope
Implement all four user stories → Release 2.1.0

---

## Summary Statistics

**Total Tasks**: 124
**Test Tasks**: 59 (48%)
**Implementation Tasks**: 47 (38%)
**Documentation Tasks**: 8 (6%)
**Infrastructure Tasks**: 10 (8%)

**Tasks by User Story**:
- Setup & Foundation: 8 tasks
- US1 (Event Selectors): 12 tasks (7 tests + 5 implementation)
- US2 (Object Iteration): 15 tasks (8 tests + 7 implementation)
- US3 (Method Calls): 39 tasks (20 tests + 19 implementation)
- US4 (Logical Operators): 23 tasks (11 tests + 12 implementation)
- Integration: 5 tasks
- Performance: 6 tasks
- Documentation: 8 tasks
- Build & Validation: 8 tasks

**Parallel Execution Opportunities**: 28 tasks marked [P]

**Independent Stories**: 4 (US1, US2, US3, US4 can be developed in parallel after foundation)

**TDD Compliance**: ✅ 100% - All implementation tasks preceded by test tasks per constitution

---

## Next Steps

1. **Review this task list** with team
2. **Choose scope**: MVP (US1 only) or Full (all 4 stories)
3. **Assign stories** to developers (or implement sequentially)
4. **Start Phase 1**: Setup & Foundation
5. **Follow TDD**: Write failing tests → Implement → Refactor → Pass tests
6. **Respect milestone gates**: Run `npm test` after each phase
7. **Track progress**: Check off tasks as completed

**Ready to begin**: All planning artifacts complete, tasks organized, dependencies clear.
