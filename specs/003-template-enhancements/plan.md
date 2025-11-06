# Implementation Plan: Template and Event Enhancements

**Branch**: `003-template-enhancements` | **Date**: November 6, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-template-enhancements/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature adds four template and event enhancements to AppBlocks: (1) CSS selectors with spaces in event definitions to target nested elements, (2) object iteration in c-for directives with custom pointer names, (3) method calls with parameters throughout templates (placeholders, filters, directives), and (4) logical operators (and, or, not) in c-if conditions. All enhancements maintain 100% backward compatibility and follow graceful degradation patterns with console error logging.

## Technical Context

**Language/Version**: JavaScript (ES6+) with Babel transpilation
**Primary Dependencies**: Jest (testing), JSDOM (DOM simulation), Idiomorph (DOM morphing), Rollup (bundling)
**Storage**: N/A
**Testing**: Jest with JSDOM for DOM testing; BDD-style test organization
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge); ES6+ transpiled to broader compatibility
**Project Type**: Single project - JavaScript library
**Performance Goals**: Rendering performance within 10% of current baseline for equivalent functionality
**Constraints**: Library size impact must be minimal; zero breaking changes (100% backward compatibility); graceful error handling with console logging
**Scale/Scope**: Four enhancement features affecting core modules (core.js for events, directives.js for c-for/c-if, processing.js for method call parsing)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Lightweight & Focused

**Status**: ✅ PASS (Confirmed after Phase 1 design)

**Evaluation**: All four enhancements are focused improvements to existing template/event capabilities. They enhance existing features (events, c-for, c-if, placeholders) without adding new dependencies or significant code bloat. Each feature has clear purpose aligned with micro app development (better event handling, flexible iteration, computed values, expressive conditions).

**Phase 1 Confirmation**: Design documents confirm zero new dependencies. Implementation uses only:
- Core JavaScript (ES6+ features: Array.isArray, Object.keys, Map for caching)
- Standard DOM APIs (querySelectorAll)
- Existing AppBlocks utilities (getProp, logger)
- Simple parsing logic (no heavy parser libraries)

### II. Test-First Development

**Status**: ✅ PASS (with enforcement reminder)

**Evaluation**: Tests MUST be written before implementation. The existing test structure (`tests/core/`, `tests/directives/`, `tests/processing/`) provides clear locations for new tests. Red-Green-Refactor cycle will be strictly enforced for all four enhancements.

**Phase 1 Confirmation**:
- Test locations identified in quickstart.md
- Test patterns documented with examples
- Each feature has specific test requirements:
  - Unit tests for parsing logic
  - Integration tests for features working together
  - Error handling tests for graceful degradation
  - Backward compatibility tests

### III. Browser Compatibility & Simplicity

**Status**: ✅ PASS

**Evaluation**:
- All features use standard JavaScript/DOM APIs (querySelectorAll, Object.keys, string parsing)
- No breaking changes; 100% backward compatibility maintained
- Developer experience improved (more expressive templates, fewer workarounds)
- Documentation updates required in `docs/` including changelog

**Phase 1 Confirmation**:
- API contracts maintain backward compatibility
- Graceful degradation patterns defined (empty string on error + console logging)
- All browser-standard APIs confirmed in data model and research

**Action Items**:
- Update `docs/directives.md` for c-for object iteration and c-if logical operators
- Update `docs/methods.md` for method calls with parameters
- Update `docs/api.md` for event selector enhancements
- Update `docs/changelog.md` with all changes
- Update `docs/_sidebar.md` if new sections needed

**Final Gate Status**: ✅ ALL GATES PASSED - Proceed to Phase 2 (Tasks)

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
├── core.js              # Event handling - UPDATE for space-separated selectors
├── directives.js        # Directive processing - UPDATE for c-for objects & c-if logical operators
├── processing.js        # Template parsing - UPDATE for method call detection & parameter parsing
├── placeholders.js      # Placeholder resolution - UPDATE for method call execution
├── filters.js           # Filter application - UPDATE for method calls in filter chains
├── utils.js             # Helper functions - MAY NEED new parsing utilities
├── logger.js            # Error logging - USE for graceful degradation
├── index.js             # Main export - no changes expected
└── requests.js          # HTTP utilities - no changes expected

tests/
├── core/
│   ├── events.test.js           # ADD tests for space-separated event selectors
│   └── ...
├── directives/
│   ├── c-for.test.js            # ADD tests for object iteration
│   ├── c-if.test.js             # ADD tests for logical operators (and, or, not)
│   └── ...
├── processing/
│   ├── processNode.test.js      # ADD tests for method call parsing
│   └── ...
├── placeholders/
│   ├── textNodes.test.js        # ADD tests for method call execution in placeholders
│   └── ...
├── filters/
│   ├── integration.test.js      # ADD tests for method calls in filter chains
│   └── ...
└── fixtures/
    └── mockData.js              # ADD fixtures for new test scenarios
```

**Structure Decision**: This is a single-project JavaScript library. The existing `src/` structure is maintained with updates to specific modules. No new top-level directories or files needed - enhancements integrate into existing architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution gates passed.

---

## Phase Completion Summary

### Phase 0: Research ✅ COMPLETE

**Deliverable**: `research.md`

**Research Questions Resolved**:
1. Event selector parsing approach → Split on first space only
2. Object vs array iteration detection → Runtime type check with `Array.isArray()`
3. Method parameter parsing → Tokenizer with type detection (quotes, numbers, booleans, paths)
4. Logical operator precedence → Recursive descent parser (comparisons > not > and > or)
5. Error handling strategy → Graceful degradation (empty string + console logging)
6. Performance optimization → Expression caching with Map

**Key Decisions**:
- Zero new dependencies (vanilla JavaScript + existing utilities)
- Single quotes for string literals in templates
- Developer-defined pointer names in c-for (not hardcoded)
- Auto-injection of app instance in method calls
- Word operators (and, or, not) instead of symbols (&&, ||, !)

---

### Phase 1: Design & Contracts ✅ COMPLETE

**Deliverables**:
- `data-model.md` - Internal data structures for all four enhancements
- `contracts/internal-apis.md` - Module interface contracts
- `quickstart.md` - Developer implementation guide with examples
- Updated `.github/copilot-instructions.md` - Agent context

**Key Entities Defined**:
1. **EventDefinition** - Parsed event configuration with scoped selectors
2. **IteratorState** - Object/array iteration state with custom pointers
3. **MethodCallExpression** - Parsed method invocation with typed parameters
4. **LogicalExpression** - Expression tree for compound conditions
5. **ExpressionCache** - Performance optimization via caching
6. **ErrorContext** - Structured error information for debugging

**Internal Contracts Established**:
- Event parsing: `parseEventDefinition(eventString)` → `{ eventType, selector, isValid }`
- c-for parsing: `parseCForDirective(value)` → `{ type, pointers, sourcePath, isValid }`
- Method call parsing: `parseMethodCall(expression)` → `{ methodName, parameters, isValid }`
- Logical expression parsing: `parseLogicalExpression(condition)` → `{ expression tree, isValid }`
- All parsers include error states for graceful degradation

**Documentation Strategy**:
- `docs/api.md` - Event selector enhancements
- `docs/directives.md` - c-for objects + c-if logical operators
- `docs/methods.md` - Method calls with parameters
- `docs/changelog.md` - All changes documented
- Version bump: 2.0.4 → 2.1.0 (minor - new features, no breaking changes)

---

### Phase 2: Task Decomposition - NEXT

**Command**: `/speckit.tasks`

This will generate `tasks.md` with:
- Milestone-based task breakdown
- Test-first implementation order
- Dependencies between tasks
- Documentation update tasks
- Testing checkpoints after each milestone

**Ready to proceed**: All Phase 0 and Phase 1 requirements complete. Constitution gates passed.

---

## Quick Reference

**Feature Branch**: `003-template-enhancements`

**Files Generated by `/speckit.plan`**:
- ✅ `/specs/003-template-enhancements/plan.md` (this file)
- ✅ `/specs/003-template-enhancements/research.md`
- ✅ `/specs/003-template-enhancements/data-model.md`
- ✅ `/specs/003-template-enhancements/quickstart.md`
- ✅ `/specs/003-template-enhancements/contracts/internal-apis.md`
- ✅ `.github/copilot-instructions.md` (updated)

**Still to Generate** (via `/speckit.tasks`):
- ⏳ `/specs/003-template-enhancements/tasks.md`

**Affected Source Files** (to be modified during implementation):
- `src/core.js` - Event selector parsing
- `src/directives.js` - c-for object iteration, c-if logical operators
- `src/processing.js` - Method call parsing
- `src/placeholders.js` - Method call execution
- `src/filters.js` - Method calls in filter chains
- `src/utils.js` - Potential new parsing utilities
- `tests/**/*.test.js` - New test cases across all modules

**Affected Documentation** (to be updated during implementation):
- `docs/api.md`
- `docs/directives.md`
- `docs/methods.md`
- `docs/changelog.md`
- `docs/_sidebar.md` (if needed)
