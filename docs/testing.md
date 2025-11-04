# Testing Guide

This document explains how to run and extend the AppBlocks test suite. The project uses Jest + JSDOM for unit tests and a small pretest Babel build to compile `src/` to CommonJS for deterministic test runs.

## Quick start (run tests)

From the project root:

```bash
# Run the pretest build and the full test suite
npm test

# Run only core tests
npm run test:core

# Run in watch mode
npm run test:watch
```

Notes:
- The `pretest` script compiles `src/` into `build-cjs/` using `@babel/cli`. Tests import from `src/...` and Jest's `moduleNameMapper` points those imports to the compiled files in `build-cjs/`.
- `build-cjs/` is ignored by `.gitignore` and regenerated on each `npm test` run.

## Why the pretest build exists

Some third-party dependencies ship ESM sources referencing `core-js` and other constructs that require non-trivial Jest transform configuration. The pretest build compiles your `src/` into a stable CommonJS snapshot that Jest runs against. This keeps test runs fast and avoids brittle node_modules transform rules.

## Project test layout

Structure under `tests/`:

- `tests/fixtures/` — shared fixture factories (factories return fresh instances)
- `tests/core/` — core tests (AppBlock initialization, etc.)
- `tests/directives/`, `tests/filters/`, `tests/utils/`, `tests/processing/`, `tests/requests/` — group folders for future tests

Tests are auto-discovered by Jest. Use the `testMatch` pattern (`**/tests/**/*.test.js`) to add new tests anywhere under `tests/`.

## Conventions

- Use ESM `import` syntax in tests, e.g. `import { AppBlock } from 'src/core.js'` and `import { createMockAppBlockConfig } from 'tests/fixtures/mockData.js';`.
- The repository contains a Jest `moduleNameMapper` that maps `src/*` to the compiled `build-cjs/*` output during tests and `tests/*` to the tests folder. Keep imports consistent.
- Fixtures are factory functions. They MUST return fresh instances to avoid test pollution. Use `resetDOM()` between tests when mutating `document`.

## Adding a new test

1. Create a new file under the appropriate group, e.g. `tests/directives/myDirective.test.js`.
2. Import fixtures from `tests/fixtures/mockData.js` where appropriate.
3. Keep tests small and focused. Use `afterEach(() => resetDOM())` to isolate DOM changes.

Example test:

```js
import { createMockElement, createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('my new test', () => {
  afterEach(() => resetDOM());

  test('does something', () => {
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);
    expect(app).toBeDefined();
  });
});
```

## Fixtures API (current)

All fixtures are exported from `tests/fixtures/mockData.js`.

| Fixture | Signature | Description |
|---|---:|---|
| createMockElement | () => HTMLElement | Returns a fresh container `<div>` for tests |
| createMockTemplate | (htmlString?: string) => HTMLTemplateElement | Returns a `<template>` element prefilled with optional HTML |
| createEmptyTemplate | () => HTMLTemplateElement | Convenience wrapper for an empty template |
| createMockAppBlockConfig | (overrides?: Object) => Object | Returns a full AppBlock config object; pass overrides to change fields |
| createMockData | () => Object | Returns realistic sample data for tests |
| createEmptyData | () => Object | Returns an empty data object `{}` |
| resetDOM | () => void | Clears `document.body` to isolate tests |
| createMockDirective | (resolver?) => Function | Returns a mock directive function usable in directives tests |

## Troubleshooting

- If a test fails with `Cannot use import statement outside a module` — ensure you run `npm test` so `pretest` compiles `src/` into CommonJS first. The pretest step is required until you rework Jest/Babel transforms.
- If Jest reports `No tests found` for a group command, check that tests live under the correct `tests/<group>/` folder and match the `testMatch` pattern.

## CI recommendation

Add a simple GitHub Actions workflow that runs `npm ci` and `npm test` on PRs to ensure tests pass in CI. Use the same Node version you use locally to avoid environment differences.

## Quick checklist for contributors

- [ ] Add tests under `tests/` with `*.test.js` suffix
- [ ] Use fixtures from `tests/fixtures/mockData.js` (avoid inline DOM/data fixtures)
- [ ] Run `npm test` locally before opening a PR
