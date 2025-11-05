# Implementation Plan: Comprehensive Test Coverage

**Branch**: `002-comprehensive-test-coverage` | **Date**: 2025-11-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-comprehensive-test-coverage/spec.md`

## Summary

Create comprehensive test coverage for the current state of AppBlocks library across all 9 modules (core, directives, placeholders, utils, processing, requests, filters, custom extensions, logger). This feature will add 80+ test cases using the existing Jest + JSDOM testing framework to ensure all functionality works correctly including initialization, rendering, directives, placeholders, utilities, request handling, filters, custom user-defined extensions, and logging. Tests will be organized by module, use shared fixtures, and validate the complete behavior of AppBlocks as it currently exists.

## Technical Context

**Language/Version**: JavaScript ES6+ (existing AppBlocks codebase)
**Primary Dependencies**: Jest 30.2.0, JSDOM 27.1.0, Babel (already configured)
**Storage**: N/A (test suite writes no persistent data)
**Testing**: Jest with JSDOM environment (already configured in jest.config.js)
**Target Platform**: Node.js test environment simulating browser DOM
**Project Type**: Single project (library with test suite)
**Performance Goals**: All tests execute in under 30 seconds
**Constraints**: Tests must be independent, use shared fixtures, clean up DOM state
**Scale/Scope**: 80+ test cases across 9 modules, extending existing test structure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Lightweight & Focused

- ✅ **Size impact**: Tests are devDependencies only, not included in library build
- ✅ **Clear purpose**: Essential for ensuring library quality and preventing regressions
- ✅ **Dependency minimization**: Uses existing Jest + JSDOM setup, no new dependencies

### II. Test-First Development (NON-NEGOTIABLE)

- ✅ **Tests before implementation**: This feature IS the test implementation - tests are being added for existing code
- ⚠️ **Note**: Since this is adding tests for existing functionality, we're documenting current behavior, not driving new development
- ✅ **All tests must pass**: Success criteria requires all tests to pass (SC-012)
- ✅ **Milestone testing**: Test organization supports incremental execution and validation

### III. Browser Compatibility & Simplicity

- ✅ **Browser compatibility**: JSDOM simulates browser environment; tests verify cross-browser behavior
- ✅ **API simplicity**: Tests validate existing simple API design
- ✅ **Documentation**: Tests serve as executable documentation of library behavior
- ✅ **Examples**: Test files provide clear examples of API usage patterns

**GATE STATUS**: ✅ **PASS** - All constitutional requirements satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-comprehensive-test-coverage/
├── plan.md              # This file
├── research.md          # Phase 0: Test strategy and patterns research
├── data-model.md        # Phase 1: Test data structures and fixtures
├── quickstart.md        # Phase 1: Guide for running and adding tests
├── contracts/           # Phase 1: Test contracts (if applicable)
├── checklists/
│   └── requirements.md  # Specification quality validation
└── tasks.md             # Phase 2: Implementation task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
tests/
├── __mocks__/
│   └── idiomorph.js           # Existing mock for Idiomorph library
├── fixtures/
│   └── mockData.js            # Existing shared fixtures - will be extended
├── core/
│   ├── initialization.test.js # Existing (4 tests) - will be extended
│   ├── rendering.test.js      # NEW - render engines, lifecycle
│   ├── data.test.js           # NEW - setData, resetState
│   └── events.test.js         # NEW - event handling
├── directives/
│   ├── createDirective.test.js # Existing (2 tests) - fixture validation
│   ├── c-if.test.js           # NEW - c-if directive with all operators
│   ├── c-ifnot.test.js        # NEW - c-ifnot directive
│   ├── c-for.test.js          # NEW - c-for loops and iterations
│   └── custom.test.js         # NEW - custom user-defined directives
├── filters/
│   ├── applyFilter.test.js    # NEW - filter application system
│   ├── custom.test.js         # NEW - custom user-defined filters
│   └── integration.test.js    # NEW - filters in placeholders/directives
├── utils/
│   ├── getProp.test.js        # NEW - property resolution
│   └── helpers.test.js        # NEW - helper functions
├── processing/
│   └── processNode.test.js    # NEW - recursive node processing
├── requests/
│   ├── fetchRequest.test.js   # NEW - fetch-based requests
│   └── axiosRequest.test.js   # NEW - axios-based requests
└── placeholders/
    ├── textNodes.test.js      # NEW - placeholder replacement in text
    └── attributes.test.js     # NEW - placeholder replacement in attributes

src/                           # Existing source code (unchanged)
├── core.js
├── directives.js
├── filters.js
├── utils.js
├── processing.js
├── requests.js
├── placeholders.js
└── logger.js

jest.config.js                 # Existing Jest configuration
package.json                   # Existing with test scripts configured
```

**Structure Decision**: Extends existing single-project structure with comprehensive test coverage. Test directory already created by feature 001-test-framework, this feature adds test files to fill coverage gaps across all modules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitutional requirements are satisfied:
- Tests are devDependencies (no library bloat)
- Uses existing test framework (no new dependencies)
- Tests document and validate existing simple API
- JSDOM ensures browser compatibility testing

---

## Phase 0: Research & Test Strategy ✅

**Status**: ✅ Complete

**Output**: [research.md](research.md)

### Key Decisions

1. **Test Organization**: Module-based with feature grouping (tests/core/initialization.test.js, tests/directives/c-if.test.js, etc.)
2. **Naming Convention**: BDD-style "should...when..." pattern using Jest describe/test
3. **Fixtures**: Extend existing mockData.js with parameterized factory functions
4. **Mocking**: Jest built-in mocks for fetch, console, idiomorph (already mocked)
5. **DOM Assertions**: Direct JSDOM queries + Jest matchers (no testing-library needed)
6. **Test Independence**: resetDOM() in afterEach + fresh fixtures per test
7. **Edge Cases**: Explicit test groups mapping to 15 edge cases in spec
8. **Custom Extensions**: Parameterized factories + integration tests for directives/filters/methods
9. **Coverage**: Qualitative spec mapping (all 80+ tests passing = adequate coverage)

See research.md for detailed rationale and alternatives considered.

---

## Phase 1: Design & Data Model ✅

**Status**: ✅ Complete

**Outputs**:
- [data-model.md](data-model.md) - Test fixture schemas and patterns
- [quickstart.md](quickstart.md) - Developer testing guide
- `.github/copilot-instructions.md` - Updated with testing patterns

### Design Summary

**Test Fixtures Created**:
- 20+ fixture factory functions extending existing mockData.js
- AppBlock instance factories with data
- Extended DOM element factories (children, directives, placeholders)
- Extended template factories (c-if, c-for, placeholders)
- Data object factories (arrays, nested, falsy values for edge cases)
- Custom extension factories (directives, filters, methods)
- Request mocking factories (fetch success/error)
- Console spy helpers

**Quickstart Guide Includes**:
- Running tests (all, module-specific, single file)
- 8 common test patterns with working examples
- Best practices for test independence and fixture usage
- Debugging strategies
- Test file checklist
- Quick reference for fixtures and Jest matchers

**Agent Context Updated**:
- Added "Testing Patterns" section to copilot-instructions.md
- Includes test organization, independence, fixture usage, and guidelines
- Links to quickstart.md for detailed examples

---

## Phase 2: Implementation ⏳

**Status**: ⏳ Ready to Start

### Implementation Order

Following priority order from spec (P1 → P2 → P3):

**Priority 1 (P1) - Core Functionality**:
1. Core tests (initialization, rendering, data management, events) - ~15 tests
2. Directive tests (c-if, c-ifnot, c-for, c-show, c-hide, c-model) - ~25 tests
3. Placeholder tests (basic, nested, with filters, with directives) - ~8 tests

**Priority 2 (P2) - Extension & Support**:
4. Utility tests (debounce, getObjectValueByPath, etc.) - ~6 tests
5. Processing tests (template processing, error handling) - ~5 tests
6. Request tests (getJSON, getText, error handling) - ~6 tests
7. Custom extension tests (directives, filters, methods) - ~11 tests

**Priority 3 (P3) - Specialized Features**:
8. Filter tests (built-in filters, integration, edge cases) - ~9 tests
9. Logger tests (formatting, error logging) - ~5 tests

### Next Steps

1. **Extend mockData.js** - Add 15+ new fixture factories from data-model.md
2. **Create test files** - Implement 20+ test files in priority order
3. **Validate coverage** - All 80+ tests passing, map to spec requirements (FR-001 to FR-051)
4. **Update tasks.md** - Mark completed requirements
