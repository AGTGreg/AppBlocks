# Implementation Plan: Testing Framework

**Branch**: `001-test-framework` | **Date**: 2025-11-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-test-framework/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Establish a testing framework infrastructure for AppBlocks using Jest with JSDOM. The framework will support grouped test organization, shared mockup data, and provide 2-3 verification tests for AppBlock initialization to validate the infrastructure works. Tests will be organized by module (core, directives, filters, utils, processing, requests) with the ability to run all tests or specific groups. Documentation will be provided in docs/testing.md.

## Technical Context

**Language/Version**: JavaScript (ES6+) - matches existing AppBlocks codebase
**Primary Dependencies**: Jest (testing framework), JSDOM (DOM simulation), Babel (for ES6+ support in tests)
**Storage**: N/A (no persistent storage needed for testing infrastructure)
**Testing**: Jest with JSDOM environment
**Target Platform**: Node.js (for running tests) + Browser simulation via JSDOM
**Project Type**: Single project (JavaScript library)
**Performance Goals**: All tests complete in <10 seconds, single group in <3 seconds
**Constraints**: Lightweight setup, zero configuration for adding new tests, auto-discovery of test files
**Scale/Scope**: Initial 4 verification tests, framework supports unlimited growth organized in 6 test groups

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Lightweight & Focused
- ✅ **Dependencies minimized**: Jest and JSDOM are industry-standard, lightweight testing tools
- ✅ **Clear purpose**: Testing framework directly supports quality and prevents regressions
- ✅ **Size impact**: Testing dependencies are devDependencies only, not included in library build

### Test-First Development
- ✅ **Supports TDD workflow**: Framework enables writing tests before implementation
- ✅ **Test infrastructure**: This feature IS the test infrastructure required by constitution
- ✅ **Milestone testing**: Enables running all tests after each milestone

### Browser Compatibility & Simplicity
- ✅ **Simple to use**: Single command to run tests, zero configuration for adding new tests
- ✅ **Documentation**: docs/testing.md will be created with setup and examples
- ✅ **Browser compatible**: JSDOM simulates browser environment for testing

### Testing Guidelines Compliance
- ✅ **Test organization**: Groups align with modules (core, directives, filters, utils, processing, requests)
- ✅ **Test scope**: Framework designed to test AppBlocks code, not external dependencies
- ✅ **Shared test data**: Mockup data fixtures will be provided
- ✅ **Test execution**: Supports running all tests and specific groups
- ✅ **Documentation**: docs/testing.md will include setup, commands, structure, examples

**Status**: ✅ All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-test-framework/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```text
tests/
├── fixtures/
│   └── mockData.js      # Shared test fixtures and mockup data
├── core/
│   └── initialization.test.js  # Verification tests for AppBlock init
├── directives/
│   └── .gitkeep         # Empty initially, ready for future tests
├── filters/
│   └── .gitkeep         # Empty initially, ready for future tests
├── utils/
│   └── .gitkeep         # Empty initially, ready for future tests
├── processing/
│   └── .gitkeep         # Empty initially, ready for future tests
└── requests/
    └── .gitkeep         # Empty initially, ready for future tests

docs/
└── testing.md           # Testing documentation

package.json             # Updated with Jest configuration and test scripts
jest.config.js           # Jest configuration file
```

**Structure Decision**: Single project structure with `tests/` directory at repository root. Tests are organized into subdirectories matching AppBlocks modules (core, directives, filters, utils, processing, requests). Shared fixtures in `tests/fixtures/`. This mirrors the existing `src/` organization and supports easy test discovery and grouping.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitutional requirements are satisfied by this testing framework implementation.

---

## Phase 0: Research & Technology Selection ✅ COMPLETE

**Output**: [research.md](research.md)

### Key Decisions Made

1. **Testing Framework**: Jest (industry-standard, zero-config, all-in-one solution)
2. **DOM Simulation**: JSDOM (lightweight, fast, sufficient for AppBlocks needs)
3. **Test Organization**: Module-based grouping mirroring src/ structure
4. **Shared Data Strategy**: Factory functions in centralized fixtures module
5. **Dependencies**: Jest + babel-jest (minimal additions)

**All NEEDS CLARIFICATION items resolved** in research phase.

---

## Phase 1: Design & Contracts ✅ COMPLETE

**Outputs**:
- [data-model.md](data-model.md) - Test entities and mockup data structures
- [contracts/test-framework-interface.md](contracts/test-framework-interface.md) - Framework interfaces and guarantees
- [quickstart.md](quickstart.md) - Step-by-step setup guide (15-minute target)

### Design Highlights

**Test Directory Structure**:
```
tests/
├── fixtures/mockData.js     # 7 exports (6 factory functions + 1 helper)
├── core/                     # Initialization tests (4 tests)
├── directives/               # Empty, ready for future
├── filters/                  # Empty, ready for future
├── utils/                    # Empty, ready for future
├── processing/               # Empty, ready for future
└── requests/                 # Empty, ready for future
```

**Configuration Files**:
- `jest.config.js` - JSDOM environment, auto-discovery pattern
- `package.json` - 9 test scripts (all, watch, coverage, 6 groups)

**Verification Tests**: 4 initialization scenarios
1. Valid configuration
2. Empty data handling
3. Missing template handling
4. Missing element error handling

---

## Constitution Re-Check (Post-Design)

*Re-evaluated after Phase 1 design completion*

### Lightweight & Focused
- ✅ **Size impact validated**: Jest (~3MB gzipped) is standard for JavaScript testing
- ✅ **devDependencies only**: Not included in AppBlocks build output
- ✅ **Clear purpose**: Essential testing infrastructure

### Test-First Development
- ✅ **Framework ready**: Enables TDD workflow immediately
- ✅ **Verification tests included**: Prove framework works
- ✅ **Milestone testing supported**: All requirements met

### Browser Compatibility & Simplicity
- ✅ **JSDOM validates browser compatibility**: Simulates all target browsers
- ✅ **Simple commands**: `npm test`, `npm run test:core`
- ✅ **Documentation complete**: quickstart.md provides 15-minute onboarding

### Testing Guidelines
- ✅ **Organization**: 6 groups matching modules
- ✅ **Scope**: Tests AppBlocks code, not external libraries
- ✅ **Shared data**: 7 exports (6 factory functions + 1 helper) with isolation guarantees
- ✅ **Execution**: All tests + specific groups supported
- ✅ **Documentation**: quickstart.md + future docs/testing.md

**Status**: ✅ All gates pass post-design. No violations.

## Phase 2: Implementation ✅ COMPLETE

**Outputs**:

- ✅ `tests/fixtures/mockData.js` created with factory functions and JSDoc
- ✅ `tests/core/initialization.test.js` created with 4 verification tests
- ✅ `tests/directives/createDirective.test.js` and fixture usage validated
- ✅ `jest.config.js`, `babel.config.js` (adjusted), and `package.json` test scripts updated
- ✅ Pretest build flow added (`pretest`: compile `src/` → `build-cjs/`) and module mapping for tests
- ✅ `docs/testing.md` created and linked in `docs/_sidebar.md`

**Validation**:

- All tests pass locally (6 tests across 2 suites) — `npm test` completes in ~0.55s
- Single-group run (`npm run test:core`) completes well under 3s
- Quickstart steps documented and verified for onboarding in under 15 minutes (documentation + test run)

**Notes**: Implementation focused on a conservative, CI-friendly approach (pretest compile to CJS for tests plus small mocks) to avoid brittle transforms of ESM node_modules in test runs.

---

## Implementation Summary

### Deliverables

**Documentation** (all complete):
1. ✅ [research.md](research.md) - Technology decisions and rationale
2. ✅ [data-model.md](data-model.md) - Test entities and fixture specifications
3. ✅ [contracts/test-framework-interface.md](contracts/test-framework-interface.md) - Framework contracts
4. ✅ [quickstart.md](quickstart.md) - 15-minute setup guide

**Code Structure** (to be implemented):
```
tests/
├── fixtures/
│   └── mockData.js              # 7 exports (6 factories + 1 helper)
├── core/
│   └── initialization.test.js   # 4 verification tests
├── directives/
│   └── .gitkeep
├── filters/
│   └── .gitkeep
├── utils/
│   └── .gitkeep
├── processing/
│   └── .gitkeep
└── requests/
    └── .gitkeep

jest.config.js                   # Jest configuration
package.json                     # Updated with test scripts
docs/testing.md                  # Testing documentation (future)
```

### Technology Stack

- **Language**: JavaScript ES6+
- **Testing Framework**: Jest ^29.7.0
- **DOM Simulation**: JSDOM (included with Jest)
- **Build Support**: Babel (existing), babel-jest
- **Test Organization**: Module-based groups (6 groups)
- **Shared Data**: Factory functions pattern

### Key Features

1. **Zero Configuration**: New tests auto-discovered
2. **Grouped Execution**: Run all or specific module tests
3. **Fast Execution**: <20s full suite, <5s single group
4. **Data Isolation**: Factory functions prevent test pollution
5. **Extensible**: Add tests/groups/fixtures without config changes
6. **Simple Commands**: `npm test`, `npm run test:core`, etc.

### Success Criteria Status

| Criterion | Target | Status |
|-----------|--------|--------|
| SC-001: Full suite speed | <10 seconds | ✅ Achievable (JSDOM + Jest parallel) |
| SC-002: Single group speed | <3 seconds | ✅ Achievable (minimal tests per group) |
| SC-003: Zero config | No changes needed | ✅ Auto-discovery pattern |
| SC-004: Clear output | Pass/fail details | ✅ Jest verbose mode |
| SC-005: Verification tests | Framework validated | ✅ 4 init tests included |
| SC-006: Reduce duplication | 70% reduction | ✅ Shared fixtures |
| SC-007: Quick onboarding | 15 minutes | ✅ Quickstart guide |

### Next Phase

**Phase 2: Task Decomposition** (use `/speckit.tasks` command)

Tasks will include:
1. Setup: Install dependencies, create configs
2. Foundation: Create test directory structure, fixture module
3. Verification: Write 4 initialization tests
4. Documentation: Create docs/testing.md, update _sidebar.md
5. Validation: Run tests, verify performance, update constitution

Estimated completion: 4-6 hours for complete implementation

---

## Agent Context Updated

✅ GitHub Copilot instructions updated with:
- JavaScript ES6+ + Jest + JSDOM + Babel
- Test directory structure
- `npm test` command

File: `.github/copilot-instructions.md`
