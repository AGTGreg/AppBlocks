# Implementation Plan: c-if / c-ifnot Expression Evaluation

**Branch**: `001-c-if-expressions` | **Date**: 2025-11-07 | **Spec**: `specs/001-c-if-expressions/spec.md`
**Input**: Feature specification from `/specs/001-c-if-expressions/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable JavaScript expression evaluation inside `c-if` and `c-ifnot` directives using only the app instance scope (data + methods) with optional opt-in to a minimal read-only built-in allow-list (start: `Math`). Provide side-effect-free, cached evaluation for performance (<5% overhead) and maintain backward compatibility with existing boolean flags and `c-for` directive behavior.

## Technical Context

**Language/Version**: JavaScript (ES6+) per existing repo
**Primary Dependencies**: None new (reuse existing codebase; avoid added bundle size per constitution)
**Storage**: N/A (in-memory evaluation only)
**Testing**: Jest + JSDOM (existing harness)
**Target Platform**: Browser (modern: Chrome, Firefox, Safari, Edge)
**Project Type**: Single small frontend library
**Performance Goals**: ≤5% render overhead for 20 conditional directives vs baseline; zero memory leaks
**Constraints**: Maintain library small size; no new runtime deps; secure expression sandbox (block globals by default); forbidden tokens never executed
**Scale/Scope**: Applies across all templates using conditional directives; no user count scaling concerns (library evaluation is client-side)

Additional Technical Notes:
- Expression compilation via `new Function` with shadowed params; cached by string.
- Security token filtering (simple regex / scan) before compile.
- Optional configuration: `allowBuiltins: ['Math']` default empty.
 - Assignment detection: standalone `=` not part of `==`, `===`, `!=`, `!==` (heuristic regex `/(?<![=!<>])=(?![=])/`); any match triggers block.
 - Render cycle: one full template processing pass from initial directive scan through final DOM mutations; warning suppression keyed per expression per cycle.

NEEDS CLARIFICATION: None (resolved in spec decisions section).

## Constitution Check

Pre-Phase Gate Verification:
- Lightweight & Focused: No new dependencies; minimal added code path. PASS
- Test-First Development: Plan includes adding dedicated directive tests prior to implementation. PASS
- Browser Compatibility & Simplicity: Uses standard JS, no exotic APIs; simple opt-in config. PASS
- Documentation Requirements: Will update `docs/directives.md`, `docs/changelog.md`, `_sidebar.md` with examples. PASS

Proceed to Phase 0.

Post-Design Re-Evaluation:
- Added artifacts (research, data-model, contracts, quickstart) introduce no dependency changes. PASS
- Testing scope expanded with new test files (still Jest). PASS
- Documentation updates planned; quickstart drafted; changelog pending implementation phase. PASS
- Security stance documented (blocked globals, allow-list). PASS

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── core.js          # AppBlock core (existing)
├── directives.js    # Will be extended: expression evaluation integration
├── filters.js
├── processing.js
├── utils.js         # Potential helper for expression safety scan
tests/
├── directives/
│   ├── c-if-expression.test.js       # New tests
│   ├── c-ifnot-expression.test.js    # New tests
│   ├── c-if-expression-edgecases.test.js # New edge cases
└── benchmark/
    └── render-benchmark.test.js (may add scenario)
```

**Structure Decision**: Single small library; modify `directives.js` and optionally add a small helper in `utils.js` if scanning logic grows. Tests isolated under `tests/directives/` matching existing pattern. No new folders.

## Complexity Tracking

No violations; section omitted.
