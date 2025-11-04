# Research: Testing Framework

**Date**: 2025-11-04
**Feature**: Testing Framework Setup
**Phase**: 0 - Research & Technology Selection

## Overview

This document captures research findings and technology decisions for establishing the AppBlocks testing framework infrastructure.

## Technology Decisions

### Testing Framework: Jest

**Decision**: Use Jest as the primary testing framework

**Rationale**:
- Industry-standard JavaScript testing framework with excellent documentation
- Built-in test runner, assertion library, and mocking capabilities (all-in-one solution)
- Zero configuration for basic setup - aligns with constitution's simplicity principle
- Fast parallel test execution
- Excellent JSDOM integration for DOM testing
- Wide adoption in JavaScript ecosystem ensures long-term support and community resources
- Minimal dependencies align with "Lightweight & Focused" constitutional principle

**Alternatives Considered**:
- **Mocha + Chai + Sinon**: More modular but requires more configuration and dependency management. Rejected due to increased complexity.
- **Vitest**: Modern and fast but less mature ecosystem. Rejected to prioritize stability and documentation availability.
- **Jasmine**: Good framework but Jest offers better developer experience and tooling. Rejected due to Jest's superior features.

### DOM Simulation: JSDOM

**Decision**: Use JSDOM for DOM simulation in tests

**Rationale**:
- Lightweight pure-JavaScript DOM implementation - runs in Node.js without browser
- Jest's default testEnvironment - seamless integration
- Fast test execution (no browser startup overhead)
- Sufficient for AppBlocks testing needs (DOM manipulation, events, template processing)
- Covers 90%+ of AppBlocks functionality without real browser
- Aligns with user preference for "straightforward and simple" testing

**Alternatives Considered**:
- **Puppeteer/Playwright**: Full browser automation. Rejected as overkill - slower, heavier, unnecessary for most AppBlocks tests. Real browser testing deferred to future feature.
- **Happy-DOM**: Faster than JSDOM but less compatible. Rejected due to potential edge case issues.
- **No DOM simulation**: Would require real browsers for all tests. Rejected due to slow execution and complexity.

**Note**: User explicitly requested JSDOM for all tests in this feature. External library behavior (like Idiomorph) is out of scope per test scope clarification.

### Test Organization Pattern

**Decision**: Mirror source code structure with module-based grouping

**Rationale**:
- Intuitive mapping: `src/core.js` → `tests/core/` (easy to find related tests)
- Supports selective test execution by module
- Scales naturally as AppBlocks grows
- Clear organization for new contributors
- Aligns with constitutional testing guideline: "Test directory structure MUST mirror the source code organization"

**Implementation**:
```
tests/
├── fixtures/          # Shared mockup data
├── core/             # Tests for src/core.js
├── directives/       # Tests for src/directives.js
├── filters/          # Tests for src/filters.js
├── utils/            # Tests for src/utils.js
├── processing/       # Tests for src/processing.js
└── requests/         # Tests for src/requests.js
```

**Alternatives Considered**:
- **Flat structure**: All tests in one directory. Rejected - doesn't scale and violates testing guidelines.
- **By test type** (unit/integration/e2e): Not applicable - this feature focuses on unit tests only.
- **By feature**: Would require reorganizing as features cross modules. Rejected as less intuitive.

### Shared Test Data Strategy

**Decision**: Centralized fixtures in `tests/fixtures/mockData.js` with factory functions

**Rationale**:
- Single source of truth for test data reduces duplication
- Factory functions provide fresh copies per test (prevents mutation issues)
- Easy to extend as new test data needs arise
- Explicit imports make dependencies clear
- Supports the 70% code duplication reduction target (SC-006)

**Pattern**:
```javascript
// tests/fixtures/mockData.js
export const createMockElement = () => {
  // Returns fresh DOM element
};

export const createMockTemplate = () => {
  // Returns fresh template element
};

export const createMockAppBlockConfig = (overrides = {}) => {
  // Returns fresh config object
};
```

**Alternatives Considered**:
- **JSON files**: Static data doesn't support DOM element creation. Rejected.
- **Per-test fixtures**: Causes duplication. Rejected per constitutional requirement.
- **Global mocks**: Risk of test pollution. Rejected for safety.

## Configuration Decisions

### Jest Configuration

**Decision**: Use `jest.config.js` with minimal configuration

**Configuration**:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], // Optional test setup
};
```

**Rationale**:
- `testEnvironment: 'jsdom'` enables DOM testing per user requirement
- `testMatch` pattern auto-discovers tests (zero-config for adding new tests per FR-008)
- Coverage collection ready for future use (not required now per clarification)
- Setup file allows global test configuration if needed

### NPM Scripts

**Decision**: Add test scripts to package.json

**Scripts**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:group": "jest"
  }
}
```

**Rationale**:
- `npm test` runs all tests (FR-001)
- `npm run test:group tests/core` runs specific group (FR-002)
- Watch mode for development workflow
- Coverage available for future use

## Verification Tests Scope

### Initial Test Cases

**Decision**: 3-4 tests for AppBlock initialization in `tests/core/initialization.test.js`

**Test Cases**:
1. **Successful initialization**: AppBlock initializes correctly with valid config (el, template, data)
2. **Empty data**: AppBlock handles empty/undefined data gracefully
3. **Empty template**: AppBlock handles missing template (uses el content)
4. **Empty el**: AppBlock handles missing/null el (logs error, fails initialization)

**Rationale**:
- Covers the core initialization scenarios specified in clarifications
- Tests most critical AppBlocks functionality (if init fails, nothing works)
- Validates test framework infrastructure works correctly
- Provides examples for future test authors
- Minimal set that demonstrates framework capabilities

## Dependencies

### Required Dependencies

**DevDependencies to add**:
- `jest` (^29.7.0 or latest stable)
- `@babel/preset-env` (if not already present - for ES6+ in tests)
- `babel-jest` (for Babel + Jest integration)

**Rationale**:
- Jest is the only testing-specific dependency needed
- Babel already in project (existing devDependency per package.json review)
- JSDOM comes with Jest, no separate install needed
- Minimal additions align with "Lightweight & Focused" principle

### Installation Command

```bash
npm install --save-dev jest babel-jest
```

## Documentation Plan

### docs/testing.md Structure

**Sections**:
1. **Overview**: What the testing framework provides
2. **Getting Started**: How to run tests
3. **Running Tests**: Commands for all tests and specific groups
4. **Adding New Tests**: Step-by-step guide with examples
5. **Shared Test Data**: How to use fixtures
6. **Test Structure**: Directory organization explanation
7. **Writing Good Tests**: Best practices and patterns

**Rationale**:
- Supports 15-minute onboarding goal (SC-007)
- Clear, actionable sections
- Examples for every common task
- Reference for future contributors

## Performance Considerations

### Fast Test Execution

**Strategies**:
- JSDOM (not real browser) provides instant startup
- Jest's parallel execution automatically utilized
- Keep verification tests focused and minimal
- Shared fixtures reduce setup overhead

**Expected Performance**:
- 3-4 verification tests: <1 second
- Well under 10-second target for full suite (SC-001)
- Single group: <3 seconds target easily achievable (SC-002)

## Risk Mitigation

### Potential Issues & Solutions

**Issue**: JSDOM limitations with complex browser APIs
**Mitigation**: AppBlocks features are DOM-focused and well-supported by JSDOM. If future tests need real browser, can add Puppeteer as separate enhancement.

**Issue**: Test pollution (shared state between tests)
**Mitigation**: Factory functions for fixtures ensure fresh data. Jest isolates each test file.

**Issue**: Slow test execution as suite grows
**Mitigation**: Jest's parallel execution handles growth. Module-based grouping allows selective testing during development.

## Next Steps (Phase 1)

1. Create data-model.md (test entities and mockup data structure)
2. Create quickstart.md (step-by-step setup guide)
3. Document any API contracts (likely N/A for infrastructure feature)
4. Re-validate Constitution Check with concrete design decisions

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JSDOM Documentation](https://github.com/jsdom/jsdom)
- [AppBlocks Source Code](../../src/)
- [Feature Specification](./spec.md)
- [AppBlocks Constitution](../../.specify/memory/constitution.md)
