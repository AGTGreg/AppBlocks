# Implementation Tasks: Testing Framework

**Feature**: 001-test-framework
**Date**: 2025-11-04
**Generated From**: [plan.md](plan.md), [spec.md](spec.md), [data-model.md](data-model.md), [contracts/test-framework-interface.md](contracts/test-framework-interface.md), [quickstart.md](quickstart.md)

## Overview

This task breakdown organizes implementation into phases aligned with user stories from spec.md. Tasks are marked with:
- `[P]` for parallelizable tasks (can be done concurrently with other [P] tasks in the same phase)
- `[US#]` for user story mapping (US1=Run All Tests, US2=Run Specific Groups, US3=Use Shared Data, US4=Add New Tests)

**Total Estimated Time**: 4-6 hours

---

## Phase 1: Setup (30 minutes)

**Goal**: Install dependencies and create configuration files

### Tasks

 - [x] [TASK-001] [P] Install Jest and Babel support → `npm install --save-dev jest babel-jest` in `/home/greg/Projects/AppBlocks/`
 - [x] [TASK-002] Create Jest configuration file → `/home/greg/Projects/AppBlocks/jest.config.js` with testEnvironment='jsdom', testMatch pattern, verbose output
- [x] [TASK-003] Update package.json with test scripts → Add 9 scripts (test, test:watch, test:coverage, test:core, test:directives, test:filters, test:utils, test:processing, test:requests) to `/home/greg/Projects/AppBlocks/package.json`
 - [x] [TASK-004] Verify Jest installation → Run `npx jest --version` to confirm version 29.7.0+

**Acceptance**: Jest installed, jest.config.js created, package.json has all test scripts, `npx jest --version` works

---

## Phase 2: Foundational Structure (45 minutes)

**Goal**: Create test directory structure and shared fixture module

### Tasks

- [x] [TASK-005] [P] [US3] Create test directory structure → Create `/home/greg/Projects/AppBlocks/tests/` with subdirectories: fixtures/, core/, directives/, filters/, utils/, processing/, requests/
- [x] [TASK-006] [P] [US4] Add .gitkeep files to empty test groups → Create `.gitkeep` in `/home/greg/Projects/AppBlocks/tests/directives/`, `/tests/filters/`, `/tests/utils/`, `/tests/processing/`, `/tests/requests/`
- [x] [TASK-007] [US3] Create shared fixtures module → Create `/home/greg/Projects/AppBlocks/tests/fixtures/mockData.js` with 7 exports: createMockElement(), createMockTemplate(), createEmptyTemplate(), createMockAppBlockConfig(), createMockData(), createEmptyData(), resetDOM()
- [x] [TASK-008] [US3] Document fixture module exports → Add JSDoc comments to all factory functions explaining purpose, parameters, return types
- [x] [TASK-009] Verify directory structure → Run `tree tests/ -L 1` to confirm all 7 directories exist

**Acceptance**: All test directories created, .gitkeep files in 5 empty groups, mockData.js has 7 exports (6 factory functions + 1 helper utility) with JSDoc

---

## Phase 3: User Story 1 - Run All Tests (1 hour)

**Priority**: P1
**Goal**: Enable running all tests with single command

### Tasks

- [x] [TASK-010] [US1] Create initialization test file → Create `/home/greg/Projects/AppBlocks/tests/core/initialization.test.js` with describe block "AppBlock Initialization"
- [x] [TASK-011] [P] [US1] Write test: valid configuration → Test that AppBlock initializes with valid config (el, template, data, name) - imports createMockAppBlockConfig()
- [x] [TASK-012] [P] [US1] Write test: empty data → Test that AppBlock handles empty/undefined data gracefully - imports createEmptyData()
- [x] [TASK-013] [P] [US1] Write test: missing template → Test that AppBlock uses el content when template is undefined - imports createMockElement()
- [x] [TASK-014] [P] [US1] Write test: missing element → Test that AppBlock handles null/undefined element with error - expects falsy or error
 - [x] [TASK-015] [US1] Run all tests command → Execute `npm test` and verify all 4 tests discovered and executed
 - [x] [TASK-016] [US1] Verify test output format → Confirm output shows test suite name, individual test descriptions, pass/fail summary, execution time
 - [x] [TASK-017] [US1] Verify exit code behavior → Test that `npm test` exits with code 0 on all pass, non-zero on any failure

**Acceptance**: `npm test` runs 4 initialization tests, all pass, clear output, <10 seconds execution, proper exit codes

**Independent Test Criteria for US1**:
- Run `npm test` successfully
- Observe 4 tests executed (1 describe block, 4 test cases)
- See summary: "Test Suites: 1 passed, Tests: 4 passed"
- Execution time < 10 seconds
- Exit code 0 when all pass

---

## Phase 4: User Story 2 - Run Specific Groups (30 minutes)

**Priority**: P2
**Goal**: Enable running individual test groups

### Tasks

 - [x] [TASK-018] [US2] Test core group command → Execute `npm run test:core` and verify only tests/core/ tests run
 - [x] [TASK-019] [P] [US2] Test directives group command → Execute `npm run test:directives` and verify no tests found (empty group)
 - [x] [TASK-020] [P] [US2] Test filters group command → Execute `npm run test:filters` and verify no tests found (empty group)
 - [x] [TASK-021] [P] [US2] Test utils group command → Execute `npm run test:utils` and verify no tests found (empty group)
 - [x] [TASK-022] [P] [US2] Test processing group command → Execute `npm run test:processing` and verify no tests found (empty group)
 - [x] [TASK-023] [P] [US2] Test requests group command → Execute `npm run test:requests` and verify no tests found (empty group)
 - [x] [TASK-024] [US2] Verify group execution speed → Confirm `npm run test:core` completes in <3 seconds
 - [x] [TASK-025] [US2] Verify output shows group context → Confirm test:core output indicates which group was tested

**Acceptance**: All 6 group commands work, core shows 4 tests, others show "no tests found", core group <3 seconds, clear group indication in output

**Independent Test Criteria for US2**:
- Run `npm run test:core` successfully
- See only core tests execute (4 tests)
- Run `npm run test:directives` and see "no tests found" message
- Core group execution < 3 seconds
- Output clearly states which group was tested

---

## Phase 5: User Story 3 - Use Shared Data (30 minutes)

**Priority**: P1
**Goal**: Validate shared fixtures prevent duplication and ensure isolation

### Tasks

 - [x] [TASK-026] [US3] Verify fixture import in tests → Confirm tests/core/initialization.test.js imports createMockElement, createMockTemplate, createMockAppBlockConfig, createEmptyData from ../fixtures/mockData
 - [x] [TASK-027] [US3] Test data isolation → Add temporary test that mutates fixture data and verify other tests unaffected (validates factory pattern)
 - [x] [TASK-028] [US3] Calculate duplication reduction → Count lines of mock data in tests vs lines in mockData.js, confirm >70% reduction (SC-006)
 - [x] [TASK-029] [US3] Document fixture usage pattern → Add comment examples in mockData.js showing how to import and use fixtures
 - [x] [TASK-030] [US3] Remove temporary isolation test → Delete the mutation test from TASK-027 after validation

**Acceptance**: All tests import from mockData.js, no inline mock data in test files, data isolation verified, >70% duplication reduction measured

**Independent Test Criteria for US3**:
- Inspect tests/core/initialization.test.js
- See imports from '../fixtures/mockData' (no inline mock data)
- Run tests and verify all pass
- Create temporary test that mutates config.data.message = 'MUTATED'
- Run tests again, verify other tests still pass (fresh data each time)

---

## Phase 6: User Story 4 - Add New Tests (45 minutes)

**Priority**: P2
**Goal**: Validate zero-configuration test addition

### Tasks

 - [x] [TASK-031] [US4] Create example test in existing group → Add `/home/greg/Projects/AppBlocks/tests/core/example.test.js` with simple passing test
 - [x] [TASK-032] [US4] Verify auto-discovery → Run `npm test` and confirm new test discovered without config changes
 - [x] [TASK-033] [US4] Create example test in new future group → Add simple test to tests/directives/ (remove .gitkeep)
 - [x] [TASK-034] [US4] Verify new group auto-discovery → Run `npm test` and confirm directives test discovered
 - [x] [TASK-035] [US4] Test adding new fixture → Add createMockDirective() function to mockData.js
 - [x] [TASK-036] [US4] Use new fixture in example test → Import and use createMockDirective in directives test
 - [x] [TASK-037] [US4] Clean up example tests → Remove tests/core/example.test.js and directives example test
 - [x] [TASK-038] [US4] Restore .gitkeep files → Re-add .gitkeep to tests/directives/ after removing example test
- [ ] [TASK-039] [US4] Document extension pattern → Add "Adding New Tests" section to docs/testing.md explaining how to add tests, groups, and fixtures
 - [x] [TASK-039] [US4] Document extension pattern → Add "Adding New Tests" section to docs/testing.md explaining how to add tests, groups, and fixtures

**Acceptance**: Auto-discovery proven (example test found without config), new fixture pattern validated, extension documented in docs/testing.md, examples cleaned up

**Independent Test Criteria for US4**:
- Create `tests/core/example.test.js` with `test('auto-discovery works', () => expect(true).toBe(true))`
- Run `npm test` without any config changes
- See 5 tests pass (4 original + 1 example)
- Delete example.test.js
- Run `npm test` and see 4 tests again (auto-discovery in reverse)

---

## Phase 7: Testing Documentation (1 hour)

**Goal**: Create comprehensive testing guide

### Tasks

 - [x] [TASK-040] [P] Create testing documentation → Create `/home/greg/Projects/AppBlocks/docs/testing.md` with sections: Setup, Running Tests, Test Structure, Adding Tests, Shared Fixtures, Troubleshooting
 - [x] [TASK-041] [P] Add examples to docs → Include code examples for: importing fixtures, writing tests, running specific groups, watch mode
 - [x] [TASK-042] [P] Update docs sidebar → Add link "Testing Guide" under "MISC" section in `/home/greg/Projects/AppBlocks/docs/_sidebar.md`
 - [x] [TASK-043] [P] Link quickstart in docs → Reference quickstart.md in testing.md for 15-minute setup guide
 - [x] [TASK-044] [P] Document fixture API → Create table in testing.md listing all 6-7 fixtures with signatures, parameters, return types

**Acceptance**: docs/testing.md created with setup, commands, structure, examples; linked in _sidebar.md; includes fixture API reference

---

## Phase 8: Validation & Polish (45 minutes)

**Goal**: Ensure all success criteria met and constitution compliance

### Tasks

 - [x] [TASK-045] [P] Verify SC-001: Full suite speed → Run `npm test` and confirm <10 seconds (currently expect <1s with 4 tests)
 - [x] [TASK-046] [P] Verify SC-002: Single group speed → Run `npm run test:core` and confirm <3 seconds
 - [x] [TASK-047] [P] Verify SC-003: Zero configuration → Confirm auto-discovery works (from Phase 6)
 - [x] [TASK-048] [P] Verify SC-004: Clear output → Review test output for pass/fail details, error messages
 - [x] [TASK-049] [P] Verify SC-005: Verification tests → Confirm 4 initialization tests validate framework
 - [x] [TASK-050] [P] Verify SC-006: Duplication reduction → Confirm >70% reduction from shared fixtures (from Phase 5)
 - [x] [TASK-051] [P] Verify SC-007: Quick onboarding → Test quickstart.md steps complete in 15 minutes
 - [x] [TASK-052] Run constitution compliance check → Verify Lightweight & Focused (devDependencies only), Test-First Development (TDD enabled), Browser Compatibility (JSDOM), Testing Guidelines (6 groups, shared data, all/group execution)
 - [x] [TASK-053] Update plan.md status → Mark Phases 0, 1 as complete, add Phase 2 completion status
 - [x] [TASK-054] Commit testing framework → Git commit all changes with message "feat: establish testing framework with Jest + JSDOM"
 - [x] [TASK-055] Final test run → Execute `npm test` one final time to ensure clean state

**Acceptance**: All 7 success criteria verified, constitution compliance confirmed, all tests pass, documentation complete, ready for PR

---

## Dependency Graph

### User Story Completion Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (US1: Run All Tests - P1) ←─── MVP Scope
    ↓
Phase 5 (US3: Use Shared Data - P1)
    ↓
Phase 4 (US2: Run Specific Groups - P2)
    ↓
Phase 6 (US4: Add New Tests - P2)
    ↓
Phase 7 (Documentation)
    ↓
Phase 8 (Validation & Polish)
```

**Critical Path**: Setup → Foundational → US1 → US3 → US2 → US4 → Docs → Polish

**Note**: US1 and US3 are both P1 (high priority) but US3 depends on US1's test files to validate fixture usage.

---

## Parallel Execution Opportunities

### Phase 1 (Setup)
- TASK-001 (install) must complete first
- TASK-002, TASK-003 can run in parallel after install
- TASK-004 runs after all

### Phase 2 (Foundational)
- TASK-005, TASK-006 can run in parallel (directory creation)
- TASK-007 depends on TASK-005 (needs tests/fixtures/ to exist)
- TASK-008 depends on TASK-007 (document after creating)

### Phase 3 (US1 - Run All Tests)
- TASK-011, TASK-012, TASK-013, TASK-014 can run in parallel after TASK-010 (all write different test cases)
- TASK-015, TASK-016, TASK-017 run sequentially (validation)

### Phase 4 (US2 - Run Specific Groups)
- TASK-019 through TASK-023 can run in parallel (testing different groups)
- TASK-018, TASK-024, TASK-025 run sequentially

### Phase 5 (US3 - Use Shared Data)
- All tasks sequential (validation workflow)

### Phase 6 (US4 - Add New Tests)
- All tasks sequential (testing extensibility workflow)

### Phase 7 (Documentation)
- TASK-040, TASK-041 can run in parallel (writing different sections)
- TASK-042, TASK-043, TASK-044 can run in parallel after docs created

### Phase 8 (Validation)
- TASK-045 through TASK-051 can all run in parallel (independent checks)
- TASK-052, TASK-053, TASK-054, TASK-055 run sequentially

**Maximum Parallelization Example** (Phase 3):
```bash
# After TASK-010 creates the test file, these can be added concurrently:
# Terminal 1: Write valid config test (TASK-011)
# Terminal 2: Write empty data test (TASK-012)
# Terminal 3: Write missing template test (TASK-013)
# Terminal 4: Write missing element test (TASK-014)
# Then run: npm test (TASK-015)
```

---

## Task Summary

| Phase | Total Tasks | Parallelizable | P1 Tasks | P2 Tasks | Time Estimate |
|-------|-------------|----------------|----------|----------|---------------|
| 1: Setup | 4 | 1 | - | - | 30 min |
| 2: Foundational | 5 | 2 | 2 (US3) | 1 (US4) | 45 min |
| 3: US1 (Run All) | 8 | 4 | 8 | - | 60 min |
| 4: US2 (Groups) | 8 | 5 | - | 8 | 30 min |
| 5: US3 (Shared Data) | 5 | 0 | 5 | - | 30 min |
| 6: US4 (Add Tests) | 9 | 0 | - | 9 | 45 min |
| 7: Documentation | 5 | 2 | - | - | 60 min |
| 8: Validation | 11 | 7 | - | - | 45 min |
| **Total** | **55** | **21** | **15** | **18** | **5h 45m** |

---

## Independent Test Criteria Per User Story

### US1: Run All Tests (P1)

**Test Without Dependencies**:
1. Execute `npm test`
2. Observe test output
3. Verify 4 tests pass (initialization suite)
4. Check execution time <10 seconds
5. Verify exit code 0 with `echo $?`

**Success**: All tests discovered and executed with clear results

---

### US2: Run Specific Groups (P2)

**Test Without Dependencies**:
1. Execute `npm run test:core`
2. Verify only core tests run (not all groups)
3. Check execution time <3 seconds
4. Try `npm run test:directives` (expect "no tests found")
5. Confirm output indicates which group was tested

**Success**: Group-specific commands work, show correct subset of tests

---

### US3: Use Shared Data (P1)

**Test Without Dependencies**:
1. Inspect `tests/core/initialization.test.js`
2. Verify imports from `../fixtures/mockData`
3. Confirm no inline mock data (no `const mockEl = document.createElement(...)` in test file)
4. Run `npm test` and all tests pass
5. Add temporary test that mutates fixture, run again, verify isolation

**Success**: Fixtures used, no duplication, data isolation proven

---

### US4: Add New Tests (P2)

**Test Without Dependencies**:
1. Create `tests/core/new-test.test.js` with simple test
2. Run `npm test` without any config changes
3. See new test in output (auto-discovery)
4. Delete new-test.test.js
5. Run `npm test` again, verify it's gone (reverse auto-discovery)

**Success**: Zero configuration required to add/remove tests

---

## Suggested MVP Scope

**MVP = User Story 1 (Run All Tests) + User Story 3 (Use Shared Data)**

**Includes**:
- Phase 1: Setup (TASK-001 to TASK-004)
- Phase 2: Foundational (TASK-005 to TASK-009)
- Phase 3: US1 (TASK-010 to TASK-017)
- Phase 5: US3 (TASK-026 to TASK-030)

**Total MVP Tasks**: 26 tasks
**Estimated MVP Time**: 2h 45m

**Delivers**:
- ✅ Jest + JSDOM installed and configured
- ✅ Test directory structure created
- ✅ Shared fixtures module with 6-7 factory functions
- ✅ 4 initialization verification tests
- ✅ `npm test` runs all tests successfully
- ✅ Data isolation and duplication reduction validated

**Deferred to Post-MVP**:
- Phase 4: US2 (Run Specific Groups) - convenience feature
- Phase 6: US4 (Add New Tests) - extensibility validation
- Phase 7: Documentation - can be written after MVP proven
- Phase 8: Validation - comprehensive checks

**MVP Success Criteria**:
- Run `npm test` and see 4 tests pass in <10 seconds
- Verify all tests import from shared mockData.js
- Constitution compliance: devDependencies, TDD enabled, JSDOM environment

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TASK-ID] [Markers] Description → Path/Command`

✅ User stories mapped: US1 (8 tasks), US2 (8 tasks), US3 (5 tasks), US4 (9 tasks)

✅ Parallel markers: 21 tasks marked [P] for concurrent execution

✅ Dependencies clear: Sequential phases, parallel opportunities within phases

✅ File paths absolute where applicable: `/home/greg/Projects/AppBlocks/...`

✅ Commands executable: `npm test`, `npm install --save-dev jest`, etc.

---

## Next Steps

1. Review this task breakdown with team/stakeholder
2. Decide: MVP only or full scope?
3. Begin Phase 1 (Setup) - TASK-001
4. Use this document to track progress (check off completed tasks)
5. Update plan.md after each phase completion
6. Run final validation (Phase 8) before PR

**Task execution tracking**: Check off `- [ ]` → `- [x]` as tasks complete
