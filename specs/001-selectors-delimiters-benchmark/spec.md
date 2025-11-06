# Feature Specification: Selectors, Delimiters, Benchmark

**Feature Branch**: `001-selectors-delimiters-benchmark`  
**Created**: 2025-11-06  
**Status**: Draft  
**Input**: Event selectors support descendant combinators (spaces). Custom placeholder delimiters configurable as an array [open, close] with default ['{', '}']. Add a simple performance benchmark that measures afterRender - beforeRender over 10 runs and reports the mean for comparison across changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Delegate events with descendant selectors (Priority: P1)

As a developer, I can register event handlers using keys like `"click .todo-list li .delete"` so clicks on matching nested elements inside the AppBlock container trigger my handler, without worrying about selector parsing limitations.

**Why this priority**: Unblocks richer UIs that rely on event delegation to nested elements and fixes current limitation where selectors with spaces break.

**Independent Test**: Create an AppBlock with nested elements and an events map using a descendant selector; simulate a click on a matching nested node and assert the handler fires only for matches.

**Acceptance Scenarios**:

1. Given an AppBlock with `events: { 'click .list li .delete': onDelete }`, When the user clicks the `.delete` button inside any `li` in `.list`, Then `onDelete` is invoked once with the event.
2. Given the same AppBlock, When the user clicks an element that does not match `.list li .delete`, Then `onDelete` is not invoked.

---

### User Story 2 - Choose placeholder delimiters (Priority: P2)

As a developer, I can set the placeholder delimiters for my AppBlock (e.g., `[[` and `]]`) so that text nodes and attributes render using my chosen delimiters instead of the default `{` and `}`.

**Why this priority**: Prevents conflicts with other templating syntaxes or content that uses curly braces.

**Independent Test**: Initialize an AppBlock with custom delimiters and a template using those delimiters; verify that both text and attribute placeholders render expected values, including with filters.

**Acceptance Scenarios**:

1. Given delimiters `[[` and `]]`, When the template contains `[[data.name]]`, Then the rendered output contains the value of `data.name`.
2. Given custom delimiters, When a placeholder with a filter is used (e.g., `[[data.name|upper]]`), Then the filtered result appears in the output.

---

### User Story 3 - Measure rendering performance (Priority: P3)

As a maintainer, I can run a simple benchmark scenario that renders a representative AppBlock and returns the mean render time from 10 runs, so I can compare performance before and after changes.

**Why this priority**: Establishes a baseline and quick feedback loop for performance regressions.

**Independent Test**: Execute the benchmark runner; verify it returns an object including per-iteration times, the mean over 10 samples, and a human-readable report suitable for comparing against a stored baseline.

**Acceptance Scenarios**:

1. Given the benchmark scenario, When I run it, Then I receive 10 timing samples and a mean render time in milliseconds.
2. Given a stored baseline, When I run the benchmark again, Then I see the delta (faster/slower and by how much) against the baseline.

### Edge Cases

- Event delegation: Click events triggered from descendants inside a matching element still invoke the handler; non-bubbling events are out of scope. Prevent firing when clicks originate outside the AppBlock container.
- Complex selectors: Selectors containing spaces (descendant), attribute selectors, multiple class segments, and IDs are treated as part of the selector string. Only the first space separates the event name from the selector.
- Delimiters with special characters: Custom delimiters may include regex meta characters; the system must handle them safely without misparsing. Empty strings are invalid.
- Filters and delimiters: Filter pipes `|` remain valid with custom delimiters. Filters should not be confused as delimiter characters.
- Benchmark variability: Avoid counting cold-start noise by optionally discarding the first sample; report any sample that deviates >200% from the median as an outlier in the report (do not fail the run).

## Requirements *(mandatory)*

### Functional Requirements

Event selectors
- **FR-001**: The events map MUST support keys in the form `"<eventName> <cssSelector>"` where `<cssSelector>` MAY include spaces for descendant combinators and other valid CSS selector syntax.
- **FR-002**: Only the first space MUST separate `<eventName>` from `<cssSelector>`; additional spaces MUST be treated as part of the selector and NOT as additional delimiters.
- **FR-003**: Event delegation MUST be scoped to the AppBlock container element; handlers fire when the event target is the matching element OR a descendant of it.
- **FR-004**: Non-matching events MUST NOT invoke the handler.
- **FR-005**: Backward compatibility: Existing simple selectors (e.g., `'click .child'`) MUST continue to work unchanged.

Custom placeholder delimiters
- **FR-010**: The feature MUST allow developers to choose placeholder delimiters as a two-element array `[open, close]` consisting of non-empty strings.
- **FR-011**: The chosen delimiters MUST apply to both text node placeholders and attribute value placeholders, including when filters are present (e.g., `open data.prop|filter close`).
- **FR-012**: The default MUST remain `['{', '}']` for backward compatibility.
- **FR-013**: Filter separator `|` MUST remain supported and unambiguous with custom delimiters.
- **FR-014**: An invalid delimiters value (not an array of two non-empty strings) MUST be rejected and MUST fall back to the default with a developer-facing error message.
- **FR-015**: The configuration key name for setting delimiters is [NEEDS CLARIFICATION: Should the public key be `delimiters` or `placeholderDelimiters`?].

Performance benchmark
- **FR-020**: Provide a benchmark scenario that renders an AppBlock containing: two placeholders (one data property and one method call), one `c-if` directive, one `c-for` directive over a small collection, and at least two filters applied in the template.
- **FR-021**: The benchmark MUST compute per-run time as `afterRenderTimestamp - beforeRenderTimestamp` and MUST collect exactly 10 samples.
- **FR-022**: The benchmark MUST return the mean of the 10 samples (in milliseconds) and the array of individual samples.
- **FR-023**: The benchmark runner MUST provide a comparison report when given a previous baseline, showing absolute and percentage change.
- **FR-024**: The benchmark execution environment is [NEEDS CLARIFICATION: Should this run in Node with a simulated DOM (e.g., headless) or in a real browser?].
- **FR-025**: Benchmark runs MUST be deterministic with regard to the scenario (fixed data sizes, fixed template). Variability due to environment SHOULD be acknowledged in the report.
 - **FR-026**: Baseline persistence is [NEEDS CLARIFICATION: Where should we store and read the baseline for comparisons (e.g., committed file in repo, local file under `benchmarks/`, or external storage)?].

### Key Entities *(include if feature involves data)*

- **Event Mapping**: A mapping of `"<eventName> <cssSelector>"` to handler function; evaluated by delegation within the AppBlock container.
- **Placeholder Delimiters**: A two-element array of strings `[open, close]` representing the current placeholder markers.
- **Benchmark Run**: A structured result including `{ samples: number[10], meanMs: number, report: string, baseline?: { meanMs: number } }` (conceptual data shape; no implementation implied).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Event delegation: In automated tests, handlers registered with descendant selectors fire for 100% of matching interactions and 0% of non-matching interactions within scope.
- **SC-002**: Delimiters: With custom delimiters set, 100% of placeholders in both text and attributes render expected values across at least 10 representative test cases, with no parsing errors.
- **SC-003**: Backward compatibility: Existing tests using default `{}` delimiters and simple event selectors continue to pass unchanged.
- **SC-004**: Benchmark: Running the benchmark returns 10 samples and a mean; subsequent runs can display delta vs a baseline within a single command/output.

### Assumptions

- Placeholder delimiters can be set at AppBlock initialization and remain constant for the lifetime of the instance.
- Benchmarking will run in a controlled environment with minimal background activity; a brief warm-up (one run) may be discarded from analysis.
- Event types initially in scope include common bubbling events (e.g., `click`, `input`, `change`). Non-bubbling events are considered out of scope for this iteration.

### Out of Scope

- Keyboard shortcut mapping DSLs, event namespaces, or delegation outside the AppBlock container.
- Multiple simultaneous delimiter pairs or per-scope/per-block delimiter overrides.
- Cross-browser performance parity guarantees or micro-optimizations beyond the benchmark scenario.

### Dependencies & Risks

- Changes to placeholder parsing must not degrade performance significantly; monitor via the new benchmark.
- Complex CSS selectors may incur higher matching cost; ensure delegation remains efficient within typical container sizes.
