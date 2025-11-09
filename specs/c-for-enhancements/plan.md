# Implementation Plan: c-for Object Iteration

**Branch**: `c-for-enhancements` | **Date**: 2025-11-09 | **Spec**: `/specs/c-for-enhancements/spec.md`

## Summary

Enhance the `c-for` directive to support iteration over plain JavaScript objects (key-value pairs) while maintaining full backward compatibility with existing array iteration. The directive will support both single-value syntax (`value in data.myList`) and dual-value syntax (`key, value in data.myObject`) for both data properties and method calls. This enables developers to iterate over object properties directly in templates without converting to arrays first.

**Primary Requirement**: Add object iteration capability to `c-for` directive
**Technical Approach**: Parse attribute syntax to detect single vs. dual-pointer mode, detect object vs. array/iterable type, use `Object.entries()` for objects, preserve existing array iteration logic

## Technical Context

**Language/Version**: JavaScript (ES6+) - matches existing AppBlocks codebase
**Primary Dependencies**: None new (reuse existing codebase; Idiomorph already used for rendering)
**Storage**: N/A (in-memory iteration only)
**Testing**: Jest (existing test framework), JSDOM (DOM simulation in tests)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) supporting ES6+
**Project Type**: Single project (JavaScript library)
**Performance Goals**:
- No measurable rendering overhead for existing array iteration paths
- Object iteration should add <1KB to minified build
- Maintain <5% rendering overhead for typical use cases (per existing benchmark standards)

**Constraints**:
- MUST maintain 100% backward compatibility with existing `c-for` array syntax
- MUST NOT break any existing tests
- MUST follow DRY principle - reuse existing evaluation/processing code
- MUST support both data properties and method calls (consistency with current implementation)

**Scale/Scope**:
- Single directive enhancement (`c-for` in `src/directives.js`)
- New test file for object iteration scenarios (~10-15 test cases)
- Documentation updates in `docs/directives.md` and `docs/changelog.md`
- Estimated LOC: ~50-80 lines new/modified code in directives.js

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Lightweight & Focused
- **Size Impact**: Estimated <1KB additional minified code (object detection + iteration logic)
- **Dependencies**: Zero new dependencies; uses native `Object.entries()` (ES6 baseline)
- **Justification**: Core feature request that aligns with micro app development - iterating over configuration objects, API responses with key-value data is common use case
- **DRY Compliance**: Will reuse existing `evaluateTemplateExpression()` for method calls, existing `processNode()`/`updateAttributePlaceholders()`/`updateTextNodePlaceholders()` for rendering

### ✅ Test-First Development
- **Process**: Tests MUST be written before implementation
- **Initial State**: Tests MUST fail to prove coverage
- **Milestone Gates**: ALL tests (existing + new) MUST pass before completion
- **Coverage**: Object iteration tests + backward compatibility tests for arrays

### ✅ Browser Compatibility & Simplicity
- **Browser Support**: `Object.entries()` supported in all modern browsers (Chrome 54+, Firefox 47+, Safari 10.1+, Edge 14+)
- **API Simplicity**: Natural extension of existing syntax - developers familiar with `c-for="item in array"` will immediately understand `c-for="key, value in object"`
- **Semantic Versioning**: MINOR version bump (new feature, backward compatible)
- **Documentation**: Examples for all four use cases required

### ✅ Documentation Requirements
- Update `docs/directives.md` with object iteration examples
- Update `docs/changelog.md` with feature description
- Provide clear examples for all syntax variants:
  - `value in data.myList` (existing - verify still works)
  - `key, value in data.myObject` (new)
  - `value in myMethod()` (existing - verify still works)
  - `key, value in myMethod()` (new)

**Constitution Compliance**: ✅ **PASS** - All gates satisfied, no violations

## Project Structure

### Documentation (this feature)

```text
specs/c-for-enhancements/
├── plan.md              # This file
├── research.md          # Phase 0: Research object iteration patterns
├── data-model.md        # Phase 1: Syntax parsing & pointer model
├── quickstart.md        # Phase 1: Usage examples
├── contracts/           # Phase 1: Test contracts
│   └── object-iteration.contract.md
└── tasks.md             # Phase 2: Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── directives.js        # MODIFY: c-for directive object iteration logic
├── helpers.js           # REUSE: evaluateTemplateExpression() for method calls
├── processing.js        # REUSE: processNode() for rendering iterations
└── placeholders.js      # REUSE: updateAttributePlaceholders(), updateTextNodePlaceholders()

tests/
├── directives/
│   ├── c-for.test.js               # EXISTS: Verify no regressions
│   ├── c-for.method-calls.test.js  # EXISTS: Verify no regressions
│   └── c-for.objects.test.js       # NEW: Object iteration test suite
└── fixtures/
    └── mockData.js                  # EXTEND: Add object fixtures

docs/
├── directives.md        # UPDATE: Add object iteration section
├── changelog.md         # UPDATE: Add feature to v2.1.0 section
└── _sidebar.md          # VERIFY: Ensure directives.md linked (already exists)
```

**Structure Decision**: Single project structure maintained. Changes localized to directives module with supporting test infrastructure. No new modules or architectural changes required - this is a focused enhancement to existing directive functionality.

## Implementation Phases

### Phase 0: Research
**Output**: `research.md`

Investigate:
1. Object iteration patterns in similar frameworks (Vue.js `v-for`, Angular `*ngFor`)
2. Edge cases: null/undefined objects, empty objects, inherited properties
3. Performance characteristics of `Object.entries()` vs alternatives (`Object.keys()` + access)
4. Syntax parsing approaches: regex vs split-based detection of comma in pointer section
5. Security considerations: prototype pollution risks (ensure `Object.entries()` safe)

### Phase 1: Design
**Outputs**: `data-model.md`, `quickstart.md`, `contracts/`

Define:
1. **Syntax Grammar**:
   - Single pointer: `pointer in expression` (existing)
   - Dual pointer: `keyPointer, valuePointer in expression` (new)
   - Parsing strategy: split on ` in ` then check left side for comma
2. **Pointer Model**: How key/value are exposed in nested template context
3. **Type Detection**: Distinguish objects from arrays/iterables (priority order)
4. **Error Handling**: Non-iterable results, method call failures
5. **Contract Tests**: Define expected behavior for all combinations

### Phase 2: Implementation
**Output**: `tasks.md` (created by `/speckit.tasks` command)

Tasks will include:
1. Write failing tests for object iteration
2. Parse `c-for` attribute to detect single vs. dual pointer syntax
3. Add type detection logic (object vs array/iterable)
4. Implement object iteration using `Object.entries()`
5. Implement dual-pointer assignment in pointers context
6. Verify backward compatibility - all existing tests pass
7. Update documentation
8. Performance benchmark verification

### Phase 3: Testing & Validation
**Output**: Test results, benchmark data

Verify:
1. All new object iteration tests pass
2. All existing array iteration tests pass (no regressions)
3. Method call integration works for both arrays and objects
4. Build size impact measured and within limits
5. Documentation review

## Technical Decisions

### Syntax Parsing Strategy
**Decision**: Split-then-analyze approach
```javascript
// Parse: "key, value in data.myObject"
const parts = attr.split(' in ');
const leftSide = parts[0].trim();
const expression = parts[1].trim();

// Check for dual pointer (comma presence)
const isDualPointer = leftSide.includes(',');
if (isDualPointer) {
  const pointers = leftSide.split(',').map(p => p.trim());
  const keyPointer = pointers[0];
  const valuePointer = pointers[1];
  // ...
}
```

**Rationale**: Simple, readable, low overhead. Regex unnecessary for this straightforward pattern.

### Type Detection Priority
**Decision**: Check in order: Array → Iterable → Object
```javascript
if (Array.isArray(iterable)) {
  // Existing array logic
} else if (iterable && typeof iterable[Symbol.iterator] === 'function') {
  // Existing iterable logic
} else if (iterable && typeof iterable === 'object' && iterable !== null) {
  // New object logic using Object.entries()
}
```

**Rationale**: Arrays are most common (performance), iterables second (Map/Set support), objects last. Explicit null check prevents errors.

### Object Property Enumeration
**Decision**: Use `Object.entries()` exclusively
```javascript
const entries = Object.entries(iterable);
for (let i = 0; i < entries.length; i++) {
  const [key, value] = entries[i];
  // Assign to pointers...
}
```

**Rationale**:
- Returns own enumerable properties only (no prototype chain)
- Returns array of `[key, value]` pairs - natural fit for dual-pointer syntax
- Standard ES6 method with broad browser support
- Prevents prototype pollution concerns

### Backward Compatibility Guarantee
**Decision**: Zero changes to existing array iteration code path

When single pointer syntax used with arrays/iterables, execution follows exact same code path as current implementation. Object iteration is additive branch, not modification of existing logic.

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Breaking existing array iterations | HIGH | Maintain separate code paths; comprehensive regression testing |
| Confusion between array and object syntax | MEDIUM | Clear documentation with side-by-side examples |
| Performance regression for arrays | MEDIUM | Benchmark existing scenarios; optimize type detection order |
| Developer expecting index in dual-pointer object iteration | LOW | Document that object iteration provides key names, not numeric indices |
| Inherited properties appearing | LOW | Use `Object.entries()` which excludes prototype chain |

## Success Criteria

**Must Have**:
1. ✅ All four syntax combinations work correctly:
   - `value in data.array` (existing)
   - `value in method()` (existing)
   - `key, value in data.object` (new)
   - `key, value in method()` (new)
2. ✅ Zero existing test failures (100% backward compatibility)
3. ✅ New test suite covering object iteration edge cases (empty, null, nested)
4. ✅ Documentation updated with clear examples
5. ✅ Changelog entry added
6. ✅ Build size increase <1KB minified

**Nice to Have**:
- Benchmark data showing <5% overhead for object vs array iteration
- Example app demonstrating real-world object iteration use case

## Open Questions

1. Should dual-pointer syntax work with arrays to provide index? (e.g., `index, item in data.array`)
   - **Lean**: No - keep it object-only for simplicity in v1, can be added later if requested
   - Would require documentation of different semantics (numeric index vs string key)

2. Should we support destructuring in pointers? (e.g., `key, {id, name} in data.users`)
   - **Lean**: No - out of scope, not supported in current single-pointer syntax either

3. Should we warn if dual-pointer syntax used with array?
   - **Lean**: No - fail silently (treat as array, ignore key pointer), or error?
   - **Decision needed in Phase 1**

## Next Steps

1. **Phase 0**: Create `research.md` - investigate patterns, edge cases, and technical approaches
2. **Phase 1**: Create `data-model.md`, `quickstart.md`, and `contracts/` - define precise behavior
3. **Phase 2**: Run `/speckit.tasks` to generate implementation task breakdown
4. **Execute**: Follow TDD - write tests, implement, verify

---

**Status**: 📋 Planning Complete - Ready for Phase 0 Research
**Estimated Effort**: 2-3 days (1 day testing/design, 1 day implementation, 0.5 day validation/docs)
