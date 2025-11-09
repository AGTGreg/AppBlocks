# Feature Specification: Method Calls in Placeholders & Iteration Directives

**Feature Branch**: `001-method-calls`
**Created**: 2025-11-09
**Status**: Draft
**Input**: User description: "We need to be able to call methods with parameters from placeholders and c-for disrectives. The app instance is inserted by default so we can call a method from the template with the rest of the params. Example: `sumMethod(appInstance, a, b) {return a+b;}` we can call it like this from a place holder: `{sumMethod(data.a, data.b)}`, with a filter: `{sumMethod(data.a, data.b)|minusOne}` from c-for: c-for=\"num in sumMethod(data.a, data.b)\"`. We also need to be able to call this from c-if and c-ifnot but this is already implemented. The implementation needs to be DRY and efficient (See attachments above for file contents. You may not need to search or read the file again.)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Invoke methods in placeholders (Priority: P1)

Template author wants to compute dynamic placeholder content by invoking existing app methods with arguments (excluding implicit app instance) directly inside curly expression blocks, optionally chaining filters after the call.

**Why this priority**: Unlocks primary use case (dynamic template logic) without manual pre-computation, increasing expressiveness and reducing boilerplate.

**Independent Test**: Provide a template with `{sumMethod(data.a, data.b)}` and verify rendered DOM text equals expected sum; remove all other new capabilities and feature still delivers value.

**Acceptance Scenarios**:
1. **Given** a method `sumMethod(app, a, b)` and data `{a:2,b:3}`, **When** template contains `{sumMethod(data.a, data.b)}`, **Then** rendered content is `5`.
2. **Given** a filter `minusOne` and same method/data, **When** template contains `{sumMethod(data.a, data.b)|minusOne}`, **Then** rendered content is `4`.

---

### User Story 2 - Invoke methods inside c-for iterable expressions (Priority: P2)

Template author wants to iterate over the result returned by a method call supplying arguments (excluding implicit app instance) in a `c-for` directive.

**Why this priority**: Enables dynamic collection generation directly at iteration point, reducing need for intermediate data structures in configuration.

**Independent Test**: Template with `c-for="num in rangeMethod(data.start, data.end)"` renders correct number of repeated blocks with values; feature stands alone if placeholder invocation absent.

**Acceptance Scenarios**:
1. **Given** a method `pairList(app, n)` returning array length `n`, **When** `c-for="item in pairList(data.n)"`, **Then** iteration count equals `data.n` and items reflect method output.
2. **Given** a method `sumMethod(app,a,b)` returning a number and `wrapArray(app,x)` returning `[x]`, **When** `c-for="val in wrapArray(sumMethod(data.a,data.b))"`, **Then** loop executes once with value equal to sum.

---

### User Story 3 - Combine method calls and existing conditional directives (Priority: P3)

Template author wants consistent behavior using method calls already supported in `c-if` / `c-ifnot` alongside placeholders and `c-for` without learning different invocation styles.

**Why this priority**: Ensures conceptual consistency and reduces cognitive load; prevents divergence between directive syntaxes.

**Independent Test**: A template using `{sumMethod(data.a,data.b)}` and `c-for="x in listMethod(data.limit)"` plus existing `c-if="isPositive(sumMethod(data.a,data.b))"` behaves uniformly.

**Acceptance Scenarios**:
1. **Given** `isPositive(app,x)` returns boolean, **When** used in `c-if` next to placeholder invocation syntax, **Then** both evaluate with identical argument handling rules.
2. **Given** nested method call `outer(app, inner(app, p))`, **When** used in placeholder and `c-for`, **Then** evaluation order yields expected final values consistently.

### Edge Cases

- Empty argument list: `{methodWithoutArgs()}` injects app instance implicitly (first argument) and evaluates once.
- Non-array / non-iterable result in `c-for`: log an error and skip iteration (zero iterations performed).
- Method returning `null` or `undefined` in placeholder: renders empty string.
- Filter chain after method call with spaces: `{sumMethod( data.a , data.b )|trim|upper}` ignores cosmetic whitespace.
- Deeply nested calls: `{wrap(add(data.x, mul(data.y, data.z)))}` evaluate left-to-right respecting parentheses.
- Side-effect methods: Evaluated at most once per expression per render via ephemeral per-render cache (no cross-render caching).
- Errors thrown inside method: Logged (`[method-call-error] <expression> : <message>`) without breaking overall render.

## Requirements *(mandatory)*

### Functional Requirements

 - **FR-001**: System MUST allow invoking app-defined methods with parameters inside placeholder expressions `{methodName(arg1, arg2)}` (implicit app instance prepended at runtime; see FR-005 for injection specifics including empty argument list handling).
- **FR-002**: System MUST allow chaining existing filters after a method call `{methodName(a,b)|filterA|filterB}`.
- **FR-003**: System MUST support invoking methods within `c-for` iterable expressions `c-for="item in methodName(arg1,arg2)"` resolving the method result before iteration.
- **FR-004**: System MUST preserve existing argument handling in `c-if` / `c-ifnot` for method calls (no syntax divergence) while sharing common evaluation logic (DRY objective).
 - **FR-005**: System MUST inject the app instance automatically as first argument when invoking any method from template expressions (author supplies only explicit parameters; empty argument list yields call equivalent to `methodName(app)` internally).
- **FR-006**: System MUST evaluate nested method calls and pass returned values as arguments (e.g., `outer(inner(a,b), c)` flows correctly).
- **FR-007**: System MUST handle whitespace flexibly around method names, commas, and parentheses without affecting parsing.
- **FR-008**: System MUST provide a deterministic single invocation per expression per render cycle (no duplicate calls due to reprocessing) using an ephemeral per-render cache that is cleared at the start of each render; no results are cached across renders.
- **FR-009**: System MUST gracefully handle non-iterable returns in `c-for` by logging an error and skipping iteration (zero iterations).
- **FR-010**: System MUST ensure errors within invoked methods do not halt overall rendering; they are logged and expression resolves to empty string (placeholder) or zero-iteration (`c-for`).
- **FR-011**: System MUST not introduce new global variables or increase bundle size materially (reuse existing parsing utilities; DRY requirement).
- **FR-012**: System MUST maintain performance with negligible (<5%) overhead compared to baseline rendering without method calls (to be measured separately).

### Key Entities *(include if feature involves data)*

- **Template Expression**: Represents a parsed placeholder or directive value; contains raw string, parsed tokens, and evaluation result.
- **Method Invocation Descriptor**: Logical entity capturing method name, ordered argument expressions, and evaluation status (success, error, cached).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Placeholder method call renders correct output for 100% of test cases including nested and filtered calls.
- **SC-002**: `c-for` method call iteration count matches returned iterable length for 100% of valid iterable cases; invalid cases handled per clarified rule.
- **SC-003**: No duplicate side-effect method invocations in single render across all test scenarios (verified via spy counts).
- **SC-004**: Rendering performance degradation stays under 5% median time compared to baseline without method calls on benchmark suite.
- **SC-005**: At least 90% of new functional branches covered by automated tests (method in placeholder, filtered, nested, in c-for, error handling).
- **SC-006**: Zero unresolved [NEEDS CLARIFICATION] markers after clarification phase.

## Assumptions

- Methods follow existing pattern: first parameter is app instance; template authors omit it.
- Existing parser/tokenizer can be extended rather than replaced.
- Filters apply post method-call result sequentially.
 - Performance baseline exists from benchmark scripts.
 - Typical template size upper bound assumed ≤ 500 expressions per render cycle (for performance target context).
 - No security or privacy impact (pure client-side expression evaluation without external I/O).

## Out of Scope

- Adding new directive types.
- Changing method signature patterns (app instance remains first).
- Introducing async method invocation semantics (assumed synchronous for this spec).

## Risks

- Ambiguous handling of non-iterable returns in `c-for` may cause inconsistent UX if not clarified.
- Potential double invocation without careful integration into current rendering pipeline.
- Nested evaluation could impact performance if not optimized.

## Dependencies

- Existing rendering engine, placeholder parsing, directive processing logic.
- Logging subsystem for error reporting.
- Benchmark suite for performance validation.

## Decisions

- Non-iterable return in `c-for`: Log an error and skip iteration (zero iterations).
 - Caching/side-effects: At most one evaluation per unique expression per render using an ephemeral per-render cache; cache is cleared at the start of each render. No cross-render caching, ensuring correctness when data changes on every render.
 - Logging format: Method call errors logged as `[method-call-error] <expression> : <error message>` to aid filtering.

## Clarifications

### Session 2025-11-09

- Q: What defines a “unique expression” for per-render caching? → A: DOM node identity + expression text.

Applied: FR-008 interpretation now explicitly uses composite key (node identity + expression text) to avoid unintended reuse across distinct nodes sharing identical expression strings.

## Next Steps

- Resolve clarifications.
- Plan test cases aligned with success criteria.
- Implement shared evaluation path for placeholders, c-for, c-if, c-ifnot.
