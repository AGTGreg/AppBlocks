# AppBlocks Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-04

## Active Technologies
- JavaScript (ES6+) as per existing repo (Node runtime for benchmark tooling). + Idiomorph (already used for rendering diffing), Jest (existing tests), JSDOM (test env), No new runtime deps planned (aim to avoid added bundle size). (001-selectors-delimiters-benchmark)
- N/A (baseline stored as local JSON file `.benchmarks/baseline.json`, gitignored). (001-selectors-delimiters-benchmark)
- JavaScript (ES6+) per existing repo + None new (reuse existing codebase; avoid added bundle size per constitution) (001-c-if-expressions)
- N/A (in-memory evaluation only) (001-c-if-expressions)

- JavaScript (ES6+) - matches existing AppBlocks codebase + Jest (testing framework), JSDOM (DOM simulation), Babel (for ES6+ support in tests) (001-test-framework)

## Testing Patterns

### Test Organization
- Module-based structure: `tests/core/`, `tests/directives/`, `tests/filters/`, etc.
- Feature grouping: Multiple test files per module (e.g., `initialization.test.js`, `rendering.test.js`)
- BDD-style naming: `test('should [behavior] when [condition]', () => {...})`

### Test Independence
- Always use `resetDOM()` in `afterEach()` to clean DOM between tests
- Create fresh fixtures for each test using factory functions from `tests/fixtures/mockData.js`
- No shared state between tests - tests must pass in any order

### Fixture Usage
```javascript
import { createMockAppBlockConfig, resetDOM } from '../fixtures/mockData.js';

describe('Module - Feature', () => {
  afterEach(() => resetDOM());

  test('should behave correctly when condition met', () => {
    // Arrange
    const config = createMockAppBlockConfig({ data: { value: 'test' } });

    // Act
    const app = new AppBlock(config);

    // Assert
    expect(app.data.value).toBe('test');
  });
});
```

### Available Fixtures
- **Config**: `createMockAppBlockConfig()`, `createMockAppBlockWithData()`
- **Elements**: `createMockElement()`, `createMockElementWithChildren()`, `createMockElementWithDirective()`
- **Templates**: `createMockTemplate()`, `createTemplateWithCIf()`, `createTemplateWithCFor()`
- **Data**: `createMockArrayData()`, `createMockNestedData()`, `createMockFalsyData()`
- **Extensions**: `createMockCustomDirective()`, `createMockCustomFilter()`, `createMockCustomMethod()`
- **Mocking**: `setupFetchMock()`, `createConsoleSpy()`, `restoreConsoleSpy()`
- **Cleanup**: `resetDOM()`

### Test Writing Guidelines
1. One behavior per test
2. Use Arrange-Act-Assert pattern
3. Descriptive test names: "should...when..."
4. Mock external dependencies (fetch, console, etc.)
5. Test edge cases (falsy values, empty arrays, missing properties)
6. Direct DOM queries with Jest matchers (no testing-library needed)

See `/specs/002-comprehensive-test-coverage/quickstart.md` for detailed patterns and examples.

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript (ES6+) - matches existing AppBlocks codebase: Follow standard conventions

## Recent Changes
- 001-c-if-expressions: Added JavaScript (ES6+) per existing repo + None new (reuse existing codebase; avoid added bundle size per constitution)
- 001-selectors-delimiters-benchmark: Added JavaScript (ES6+) as per existing repo (Node runtime for benchmark tooling). + Idiomorph (already used for rendering diffing), Jest (existing tests), JSDOM (test env), No new runtime deps planned (aim to avoid added bundle size).

- 001-test-framework: Added JavaScript (ES6+) - matches existing AppBlocks codebase + Jest (testing framework), JSDOM (DOM simulation), Babel (for ES6+ support in tests)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
