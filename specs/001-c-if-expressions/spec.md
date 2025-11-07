# Feature Specification: c-if / c-ifnot Expression Evaluation

**Feature Branch**: `001-c-if-expressions`
**Created**: 2025-11-07
**Status**: Draft
**Input**: User description: "Let developers write javascript expressions in c-if and c-ifnot directives. The c-if directives should run if they evaluate to true and c-ifnot should do the oposite. The expression's scope must be inside the app instance (access to data and method calls defined in instance).\n\n - Example with data that exists in the app instance: c-if=\"data.messages.length >= 10\"\n - Example with method and data that is defined inside the app instance: c-if=\"hasUser(data.messages) === true\" \n\n Obviously this replaces the functionality of how c-if directives are beeing evaluated but we must keep backwards compatibility with the c-for directives."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Conditional Rendering with Data Length (Priority: P1)

As a developer composing templates, I can write a JavaScript boolean expression in a `c-if` directive (e.g. `c-if="data.messages.length >= 10"`) so that a block only renders when the expression evaluates to true using the app instance's current data and methods.

**Why this priority**: Core capability; enables rich conditional display logic without adding new bespoke syntax, immediately valuable to most template authors.

**Independent Test**: Render a template containing an element with `c-if="data.messages.length >= 10"` against data sets of size 9 and 10 and assert presence/absence independently.

**Acceptance Scenarios**:

1. **Given** app instance with `data.messages` length 9, **When** template processed, **Then** element with `c-if="data.messages.length >= 10"` is not in DOM.
2. **Given** app instance with `data.messages` length 10, **When** template processed, **Then** element becomes part of DOM exactly once.

---

### User Story 2 - Conditional Rendering with Method Calls (Priority: P2)

As a developer I can include method calls from the app instance in `c-if` expressions (e.g. `c-if="hasUser(data.messages) === true"`) so logic can leverage encapsulated behaviors not just raw data.

**Why this priority**: Extends expressiveness; many conditions depend on derived states encapsulated in methods.

**Independent Test**: Provide an app instance with a `hasUser` method returning true or false for given data; assert render differs solely based on method result.

**Acceptance Scenarios**:

1. **Given** `hasUser` returns false, **When** processing template with `c-if="hasUser(data.messages) === true"`, **Then** the element is absent.
2. **Given** `hasUser` returns true, **When** processing same template, **Then** the element is present.

---

### User Story 3 - Inverted Conditional via c-ifnot (Priority: P3)

As a developer I can use `c-ifnot` with a JavaScript expression so that a block renders only when the expression evaluates to false (e.g. `c-ifnot="data.messages.length >= 10"`).

**Why this priority**: Completes logical pair; simplifies templates that otherwise require manual negation or duplication.

**Independent Test**: Same data sets as Story 1 but using `c-ifnot`; assert inverse presence conditions.

**Acceptance Scenarios**:

1. **Given** length 9, **When** template processed with `c-ifnot="data.messages.length >= 10"`, **Then** element is present.
2. **Given** length 10, **When** processed, **Then** element is absent.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Expression referencing undefined data property (e.g. `c-if="data.unknown > 0"`) should evaluate safely to false without throwing.
- Method call throwing an exception should fail gracefully: treat as false for `c-if` and true for `c-ifnot` but log a warning.
- Empty string expression (`c-if=""`) treated as false; for `c-ifnot` treated as true.
- Expression returning non-boolean (e.g. number, array) coerces via JS truthiness consistent with standard evaluation.
- Nested elements with both `c-if` and `c-for` must preserve existing `c-for` iteration behavior (no regression / no re-evaluation per item outside current design).
- Security: Prevent access to browser/global objects (`window`, `document`, `globalThis`, etc.) by shadowing common globals and rejecting dangerous tokens; default evaluation scope is limited to the app instance only. Optionally, specific built-ins (e.g., `Math`) can be enabled via configuration.
- Performance: Large expressions should not cause noticeable render delay; evaluation occurs once per directive per render cycle.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST allow `c-if` to accept a JavaScript expression string evaluated in the context of the app instance (its data and methods).
- **FR-002**: System MUST allow `c-ifnot` to accept a JavaScript expression string evaluated with identical scope but invert the render decision.
- **FR-003**: Expression scope MUST include only the app instance's `data` and instance methods by default; no globals are exposed. A configurable safe allow-list MAY enable select read-only built-ins (default off), starting with `Math`.
- **FR-004**: Evaluation MUST be side-effect free (disallow assignments, `++`, `--`, `function`, `class`, `new`, `=>`, `import`, `await`, `yield`, `try/catch`, `delete`, and property name `constructor`). If detected, treat evaluation as false and log a warning.
- **FR-005**: Errors during evaluation MUST be caught; directive treated as not rendering for `c-if` (render for `c-ifnot`) and error logged once per expression per render cycle.
- **FR-006**: Backwards compatibility MUST be maintained: existing `c-for` behaviors and any previous simple boolean handling for `c-if` must still work (legacy truthy values continue to function).
- **FR-007**: System MUST support method invocation with arguments derived from `data` (e.g. `hasUser(data.messages)`), passing references not copies.
- **FR-008**: Performance MUST remain within acceptable render overhead: expression evaluation adds no more than 5% average time compared to baseline (measure via existing benchmark harness scenarios).
- **FR-009**: Security MUST restrict access to prototype-chain escapes by shadowing common globals and rejecting tokens like `constructor`, `__proto__`, `eval`, and `Function`.
- **FR-010**: System MUST provide deterministic evaluation order: evaluate all `c-if` / `c-ifnot` before processing nested `c-for` items.
- **FR-011**: System MUST coerce non-boolean expression results using JS truthiness semantics.
- **FR-012**: System MUST document examples for data length, method invocation, negated logic, and error fallback.

### Key Entities *(include if feature involves data)*

- **Directive Expression**: Represents the raw string attached to `c-if`/`c-ifnot`; attributes: source string, evaluation result (boolean), error flag.
- **Evaluation Context**: Abstract concept of exposed identifiers: data object, method map, safe built-ins list.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Developers can express all previously custom conditional needs without adding new API surface (validated by replacing at least 3 existing conditional patterns in examples/demo templates).
- **SC-002**: Render benchmark shows ≤5% average increase in time for templates with 20 conditional directives versus baseline without expressions.
- **SC-003**: 100% of directives with syntactically valid expressions evaluate without uncaught errors during test suite execution.
- **SC-004**: At least 4 documented examples added; documentation updated concurrently with feature landing (changelog entry present) per constitution.
- **SC-005**: Edge case tests (undefined data/method error, exception in method, non-boolean result) achieve passing rate of 100%.

## Assumptions

- Existing simple value `c-if="someFlag"` continues to work because expression evaluation path treats identifiers as lookups.
- Built-ins are NOT exposed by default; if enabled, allow-list starts with `Math` only.
- No need for asynchronous expressions; all evaluation synchronous.
- Template authors will avoid heavy computation in expressions; performance threshold set at 5% overhead.

## Risks

- Security exposure if global objects accidentally accessible.
- Performance degradation if expressions become complex.
- Method side-effects if developers write impure methods (outside spec control).

## Decisions on Scope, Security, and Grammar

- Global access policy: Block all globals by default; provide opt-in allow-list for specific read-only built-ins (initially `Math`).
- Allowed identifiers beyond app: None by default; only `data` and instance methods. Built-ins require explicit opt-in.
- Expression grammar: Allow standard JavaScript expressions (including ternary and logical operators), but disallow statements and side-effecting constructs as per FR-004; reject dangerous identifiers/tokens at parse-time via lightweight checks.

## Acceptance Testing Approach

- Unit tests for evaluation success/failure paths.
- Integration tests combining `c-if` with `c-for` to ensure no regression.
- Benchmark scenario added comparing pre/post implementation.

## Success Validation Strategy

- Use the project's standard benchmark process to measure SC-002.
- Add directive-focused tests covering expression evaluation and error handling.

## Out of Scope

- Async / promise-based expressions.
- New directive syntax beyond `c-if` / `c-ifnot`.
- Expression caching strategies.
