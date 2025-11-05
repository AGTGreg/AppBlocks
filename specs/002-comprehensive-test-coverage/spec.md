# Feature Specification: Comprehensive Test Coverage

**Feature Branch**: `002-comprehensive-test-coverage`
**Created**: 2025-11-04
**Status**: Draft
**Input**: User description: "I want to add all the needed test cases to test the current state of AppBlocks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Module Coverage (Priority: P1)

As a developer working on AppBlocks core functionality, I need comprehensive test coverage for the AppBlock class to ensure initialization, rendering, data management, and state handling work correctly across all scenarios.

**Why this priority**: The core module is the foundation of AppBlocks. Without reliable core functionality, all other features fail. This is the most critical area requiring test coverage.

**Independent Test**: Can be fully tested by running core tests and verifying they cover initialization, rendering (both engines), setData (merge and replace), resetState, and lifecycle methods (beforeRender/afterRender).

**Acceptance Scenarios**:

1. **Given** an AppBlock instance is created with valid configuration, **When** the instance initializes, **Then** all properties (el, data, methods, directives, filters, events) are correctly set
2. **Given** an AppBlock with data, **When** setData is called with merge mode, **Then** new data is merged with existing data without replacing it
3. **Given** an AppBlock with data, **When** setData is called with replace mode, **Then** all existing data is replaced with new data
4. **Given** an AppBlock with state flags set, **When** resetState is called, **Then** all state flags (loading, error, success) are reset to false
5. **Given** an AppBlock with Idiomorph render engine, **When** render is called, **Then** DOM is updated using Idiomorph morphing
6. **Given** an AppBlock with plain render engine, **When** render is called, **Then** DOM is updated by replacing innerHTML
7. **Given** an AppBlock with beforeRender method, **When** render is called, **Then** beforeRender executes before DOM update
8. **Given** an AppBlock with afterRender method, **When** render is called, **Then** afterRender executes after DOM update
9. **Given** an AppBlock with events configured, **When** events are triggered, **Then** correct event handlers execute for matching elements

---

### User Story 2 - Directives Coverage (Priority: P1)

As a developer using AppBlocks directives, I need comprehensive test coverage for c-if, c-ifnot, and c-for directives to ensure conditional rendering and loops work correctly with all data types and edge cases.

**Why this priority**: Directives are core features that control what gets rendered. Bugs in directives directly impact user-facing behavior and can cause incorrect UI states.

**Independent Test**: Can be fully tested by running directive tests and verifying they cover all conditional operators, all falsy values, nested conditions, array iteration, object iteration, and pointer management.

**Acceptance Scenarios**:

1. **Given** a node with c-if directive referencing a truthy value, **When** directive is evaluated, **Then** node remains in DOM
2. **Given** a node with c-if directive referencing a falsy value (false, 0, null, undefined, ''), **When** directive is evaluated, **Then** node is removed from DOM
3. **Given** a node with c-if directive using comparison operators (==, ===, !=, !==, >, <, >=, <=), **When** directive is evaluated, **Then** condition evaluates correctly
4. **Given** a node with c-ifnot directive, **When** directive is evaluated, **Then** result is inverse of c-if evaluation
5. **Given** a node with c-for directive iterating an array, **When** directive is evaluated, **Then** node is cloned for each array item with correct pointer values
6. **Given** a node with c-for directive on empty array, **When** directive is evaluated, **Then** original node is removed and no clones are created
7. **Given** nested c-for directives, **When** directives are evaluated, **Then** pointers are correctly maintained for nested iterations

---

### User Story 3 - Placeholder System Coverage (Priority: P1)

As a developer using AppBlocks placeholders, I need comprehensive test coverage for placeholder replacement in text nodes and attributes to ensure data binding works correctly with edge cases.

**Why this priority**: Placeholders are the primary way to display dynamic data. Incorrect placeholder handling leads to wrong data being displayed to users.

**Independent Test**: Can be fully tested by running placeholder tests and verifying they cover simple placeholders, nested properties, array access, and attribute placeholders.

**Acceptance Scenarios**:

1. **Given** a text node with simple placeholder {data.name}, **When** placeholders are updated, **Then** placeholder is replaced with correct data value
2. **Given** a text node with nested property placeholder {data.user.profile.name}, **When** placeholders are updated, **Then** nested property value is resolved and inserted
3. **Given** a text node with array access placeholder {data.items[0].name}, **When** placeholders are updated, **Then** array element is accessed and value is inserted
4. **Given** a text node with placeholder referencing undefined property, **When** placeholders are updated, **Then** placeholder is replaced with empty string
5. **Given** an attribute with placeholder value="{data.id}", **When** attribute placeholders are updated, **Then** attribute value contains correct data
6. **Given** an attribute with multiple placeholders href="/user/{data.id}/profile/{data.section}", **When** attribute placeholders are updated, **Then** all placeholders are replaced correctly

---

### User Story 4 - Utils & Helpers Coverage (Priority: P2)

As a developer using AppBlocks utilities, I need comprehensive test coverage for getProp and helper functions to ensure property resolution and DOM manipulation utilities work correctly.

**Why this priority**: Utils are support functions used throughout AppBlocks. While not user-facing, bugs here affect multiple features and are hard to trace.

**Independent Test**: Can be fully tested by running utils tests and verifying they cover getProp with various key patterns, pointer resolution, method calls, and all helper functions.

**Acceptance Scenarios**:

1. **Given** getProp is called with simple key path ['data', 'name'], **When** property is resolved, **Then** correct nested value is returned
2. **Given** getProp is called with array notation key ['items[0]'], **When** property is resolved, **Then** array element is correctly accessed
3. **Given** getProp is called with pointer reference, **When** pointers object contains the key, **Then** pointer value is returned instead of component property
4. **Given** getProp is called with method name, **When** key exists in comp.methods, **Then** method is called and result is returned
5. **Given** getProp is called with undefined path, **When** property doesn't exist, **Then** undefined is returned
6. **Given** helper.getNode is called with valid selector, **When** element exists, **Then** correct DOM element is returned
7. **Given** helper.getNodes is called with selector, **When** multiple elements match, **Then** NodeList of all matching elements is returned
8. **Given** helper.appendIn is called with HTML and node, **When** executed, **Then** HTML is appended to node's innerHTML
9. **Given** helper.prependIn is called with HTML and node, **When** executed, **Then** HTML is prepended to node's innerHTML

---

### User Story 5 - Processing Pipeline Coverage (Priority: P2)

As a developer working on AppBlocks rendering pipeline, I need comprehensive test coverage for processNode to ensure the recursive processing of nodes with directives works correctly.

**Why this priority**: The processing pipeline determines what gets rendered and in what order. Bugs here can cause entire sections to not render or render incorrectly.

**Independent Test**: Can be fully tested by running processing tests and verifying they cover recursive processing, directive evaluation order, node removal on false evaluation, and attribute placeholder updates.

**Acceptance Scenarios**:

1. **Given** a node with directive that evaluates to true, **When** processNode is called, **Then** node remains and attribute placeholders are updated
2. **Given** a node with directive that evaluates to false, **When** processNode is called, **Then** node is removed and no further processing occurs
3. **Given** a node tree with nested children, **When** processNode is called, **Then** all children are processed recursively in correct order
4. **Given** a node with multiple directives, **When** processNode is called, **Then** directives are evaluated in order of appearance
5. **Given** a parent node is removed due to directive, **When** processing occurs, **Then** child nodes are not processed
6. **Given** a node with no directives, **When** processNode is called, **Then** only attribute placeholders are updated

---

### User Story 6 - Request Handling Coverage (Priority: P2)

As a developer using AppBlocks request methods, I need comprehensive test coverage for fetchRequest and axiosRequest to ensure HTTP requests, state management, callbacks, and error handling work correctly.

**Why this priority**: Request handling is critical for data-driven applications. Incorrect state management or callback execution can lead to race conditions and poor UX.

**Independent Test**: Can be fully tested by running request tests with mocked fetch/axios, verifying state transitions, callback execution, error handling, and delay functionality.

**Acceptance Scenarios**:

1. **Given** fetchRequest is called, **When** request starts, **Then** state.loading is set to true and component renders
2. **Given** fetchRequest succeeds, **When** response is received, **Then** success callback is called with data, state.success is true, and component re-renders
3. **Given** fetchRequest fails, **When** error occurs, **Then** error callback is called, state.error is true, and component re-renders
4. **Given** fetchRequest completes, **When** finally block executes, **Then** state.loading is false and finally callback is called
5. **Given** fetchRequest is called while loading, **When** request is already in progress, **Then** subsequent request is ignored
6. **Given** fetchRequest is called with delay, **When** delay is specified, **Then** request waits for delay milliseconds before executing
7. **Given** axiosRequest is called, **When** request succeeds, **Then** success callback receives response and can modify it
8. **Given** axiosRequest fails, **When** error occurs, **Then** error callback is called with error object

---

### User Story 7 - Filter System Coverage (Priority: P3)

As a developer using AppBlocks filters, I need test coverage for the filter registration and application system to ensure custom filters can be registered and applied correctly in placeholders and directives.

**Why this priority**: While currently the filters object is empty, the infrastructure exists for custom filters. Testing this ensures the system works when filters are added and integrates properly with placeholders and directives.

**Independent Test**: Can be fully tested by registering test filters, applying them via placeholders and directives, and verifying the transformation occurs correctly.

**Acceptance Scenarios**:

1. **Given** a custom filter is registered in filters object, **When** applyCustomFilter is called with that filter name, **Then** filter function is executed and transformed value is returned
2. **Given** applyCustomFilter is called with non-existent filter name, **When** filter is not registered, **Then** error is logged and original value is returned unchanged
3. **Given** a filter that transforms string to uppercase, **When** applied to lowercase string, **Then** uppercase string is returned
4. **Given** a text node with placeholder using custom filter {data.price|currency}, **When** placeholders are updated, **Then** filter is applied to value before insertion
5. **Given** a text node with placeholder using asHTML filter {data.content|asHTML}, **When** placeholders are updated, **Then** HTML content is parsed and inserted as DOM nodes
6. **Given** a text node with placeholder using multiple chained filters {data.name|uppercase|trim}, **When** placeholders are updated, **Then** all filters are applied in sequence
7. **Given** an attribute with filtered placeholder class="{data.status|statusClass}", **When** attribute placeholders are updated, **Then** filter is applied to attribute value
8. **Given** a c-if directive with filtered value c-if="data.price|isExpensive", **When** directive is evaluated, **Then** filter is applied before condition evaluation
9. **Given** a c-for directive with filtered array c-for="item in data.items|activeOnly", **When** directive is evaluated, **Then** filter is applied to array before iteration

---

### User Story 8 - Custom User-Defined Extensions Coverage (Priority: P2)

As a developer extending AppBlocks with custom directives, methods, and filters, I need test coverage to ensure user-defined extensions integrate correctly with the framework and can be registered, invoked, and used in templates.

**Why this priority**: Custom extensions are a key extensibility feature of AppBlocks. Developers rely on the ability to add custom logic, and these need to work reliably with the framework.

**Independent Test**: Can be fully tested by registering custom directives, methods, and filters, then verifying they are called correctly, receive proper parameters, and integrate with templates and other AppBlocks features.

**Acceptance Scenarios**:

1. **Given** a custom directive is registered in config.directives, **When** an element with that directive is processed, **Then** the custom directive function is called with correct parameters (appInstance, node, pointers)
2. **Given** a custom directive returns true, **When** the element is processed, **Then** the element remains in DOM and any modifications made by the directive are applied
3. **Given** a custom directive returns false, **When** the element is processed, **Then** the element is removed from DOM
4. **Given** a custom directive accesses node attributes (e.g., node.getAttribute('c-custom-dir')), **When** directive executes, **Then** directive can read and use attribute values
5. **Given** a custom method is registered in config.methods, **When** the method is called from a template directive (e.g., c-if="myMethod"), **Then** the method executes and returns the expected value
6. **Given** a custom method accesses thisApp parameter, **When** method executes, **Then** method has access to app instance, data, and can call other methods
7. **Given** a custom method calls this.Parent, **When** method executes, **Then** this.Parent correctly references the app instance
8. **Given** a custom filter is registered in config.filters, **When** used in a placeholder (e.g., {data.value|myFilter}), **Then** the filter transforms the value correctly
9. **Given** a custom filter is registered, **When** used in an attribute placeholder (e.g., class="{data.status|statusClass}"), **Then** the filter is applied to the attribute value
10. **Given** multiple custom filters are chained (e.g., {data.text|trim|uppercase}), **When** placeholders are processed, **Then** all filters execute in sequence
11. **Given** custom methods, directives, and filters are registered, **When** they interact (e.g., method called from directive, filter used in directive condition), **Then** all components work together correctly

**Example Custom Directive**:
```javascript
directives: {
  'c-greeting': function(thisApp, node, pointers) {
    const name = node.getAttribute('c-greeting');
    const message = "Hello, " + name + "!";
    node.textContent = message;
    return true;
  }
}
// Usage: <div c-greeting="Greg"></div>
// Result: <div>Hello, Greg!</div>
```

**Example Custom Method**:
```javascript
methods: {
  getFullName(thisApp) {
    return thisApp.data.firstName + " " + thisApp.data.lastName;
  }
}
// Usage in template: <p c-if="getFullName">Name: {getFullName}</p>
```

**Example Custom Filter**:
```javascript
filters: {
  currency(app, value) {
    return "$" + parseFloat(value).toFixed(2);
  }
}
// Usage: <p>Price: {data.price|currency}</p>
// Input: {price: 19.5}, Result: Price: $19.50
```

---

### User Story 9 - Logger Coverage (Priority: P3)

As a developer using AppBlocks logging, I need test coverage for logError, logWarning, and logInfo to ensure console logging includes component name and message formatting works correctly.

**Why this priority**: Logging is essential for debugging. While low priority for functionality, ensuring logs work correctly helps with troubleshooting.

**Independent Test**: Can be fully tested by calling logger functions with mock component and verifying console methods are called with correctly formatted messages.

**Acceptance Scenarios**:

1. **Given** logError is called with component and message, **When** executed, **Then** console.error is called with formatted message including component name
2. **Given** logWarning is called with component and message, **When** executed, **Then** console.warn is called with formatted message including component name
3. **Given** logInfo is called with component and message, **When** executed, **Then** console.info is called with formatted message including component name

---

### Edge Cases

- What happens when a placeholder references a deeply nested property that doesn't exist? Return empty string and don't throw error.
- What happens when c-for iterates over a non-array value? Directive should handle gracefully and log warning.
- What happens when a filter throws an error during execution? Error should be caught, logged, and original value returned.
- What happens when render is called before initialization completes? Should handle gracefully or queue the render.
- What happens when multiple events are attached to the same element? All matching event handlers should execute.
- What happens when prepareTmpDom is called directly without render? Should return processed DOM fragment without updating the actual DOM.
- What happens when nested c-for loops use the same pointer name? Inner loop should shadow outer loop pointer.
- What happens when getProp is called with an empty keys array? Should return undefined.
- What happens when helper functions are called without comp reference? Should handle gracefully or throw clear error.
- What happens when setData is called during a render cycle? Should queue or handle synchronously.
- What happens when a custom directive throws an error? Error should be caught and logged without breaking the render.
- What happens when a custom directive doesn't return a boolean? Should handle gracefully with default behavior.
- What happens when a custom method is called without the appInstance parameter? Method should still execute but won't have access to app data.
- What happens when a custom filter receives null or undefined value? Filter should handle gracefully and not throw error.
- What happens when custom directive, method, and filter have naming conflicts with built-in ones? Custom ones should be used (override behavior).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide test coverage for AppBlock initialization with all configuration options
- **FR-002**: System MUST provide test coverage for AppBlock.setData in both merge and replace modes
- **FR-003**: System MUST provide test coverage for AppBlock.resetState
- **FR-004**: System MUST provide test coverage for both render engines (Idiomorph and plain)
- **FR-005**: System MUST provide test coverage for lifecycle methods (beforeRender, afterRender)
- **FR-006**: System MUST provide test coverage for event handling system
- **FR-007**: System MUST provide test coverage for c-if directive with all comparison operators
- **FR-008**: System MUST provide test coverage for c-if directive with all falsy values
- **FR-009**: System MUST provide test coverage for c-ifnot directive
- **FR-010**: System MUST provide test coverage for c-for directive with arrays
- **FR-011**: System MUST provide test coverage for c-for directive with edge cases (empty arrays, nested loops)
- **FR-012**: System MUST provide test coverage for placeholder replacement in text nodes
- **FR-013**: System MUST provide test coverage for placeholder replacement in attributes
- **FR-014**: System MUST provide test coverage for nested property access in placeholders
- **FR-015**: System MUST provide test coverage for array access notation in placeholders
- **FR-016**: System MUST provide test coverage for custom filter application in placeholders
- **FR-017**: System MUST provide test coverage for asHTML filter
- **FR-018**: System MUST provide test coverage for chained filters in placeholders
- **FR-019**: System MUST provide test coverage for filters in directive conditions (c-if with filters)
- **FR-020**: System MUST provide test coverage for filters in c-for directive arrays
- **FR-021**: System MUST provide test coverage for getProp with simple and complex key paths
- **FR-022**: System MUST provide test coverage for getProp with pointers
- **FR-023**: System MUST provide test coverage for getProp with method calls
- **FR-024**: System MUST provide test coverage for helper functions (getNode, getNodes, appendIn, prependIn)
- **FR-025**: System MUST provide test coverage for processNode recursive behavior
- **FR-026**: System MUST provide test coverage for processNode directive evaluation order
- **FR-027**: System MUST provide test coverage for fetchRequest state management
- **FR-028**: System MUST provide test coverage for fetchRequest success/error/finally callbacks
- **FR-029**: System MUST provide test coverage for fetchRequest delay functionality
- **FR-030**: System MUST provide test coverage for fetchRequest preventing concurrent requests
- **FR-031**: System MUST provide test coverage for axiosRequest with similar scenarios as fetchRequest
- **FR-032**: System MUST provide test coverage for applyCustomFilter with registered filters
- **FR-033**: System MUST provide test coverage for applyCustomFilter with non-existent filters
- **FR-034**: System MUST provide test coverage for custom user-defined directives registration and invocation
- **FR-035**: System MUST provide test coverage for custom directive parameter passing (appInstance, node, pointers)
- **FR-036**: System MUST provide test coverage for custom directive return values (true/false) affecting DOM
- **FR-037**: System MUST provide test coverage for custom directive attribute access
- **FR-038**: System MUST provide test coverage for custom user-defined methods registration and invocation
- **FR-039**: System MUST provide test coverage for custom methods accessing appInstance parameter
- **FR-040**: System MUST provide test coverage for custom methods using this.Parent reference
- **FR-041**: System MUST provide test coverage for custom methods called from templates (directives)
- **FR-042**: System MUST provide test coverage for custom user-defined filters registration and invocation
- **FR-043**: System MUST provide test coverage for custom filters in placeholders (text nodes and attributes)
- **FR-044**: System MUST provide test coverage for chaining multiple custom filters
- **FR-045**: System MUST provide test coverage for integration between custom methods, directives, and filters
- **FR-046**: System MUST provide test coverage for all logger functions (logError, logWarning, logInfo)
- **FR-047**: All tests MUST use the existing shared fixtures from tests/fixtures/mockData.js
- **FR-048**: Tests MUST be organized in appropriate test group directories matching the module structure
- **FR-049**: Tests MUST follow existing naming conventions (*.test.js)
- **FR-050**: Tests MUST clean up DOM state using resetDOM() to prevent test pollution
- **FR-051**: Tests MUST use Jest matchers appropriately (toBe, toEqual, toBeDefined, toHaveBeenCalled, etc.)

### Key Entities

- **Test Suite**: Collection of related tests for a specific module (e.g., all core tests, all directive tests)
- **Test Case**: Individual test verifying specific behavior with arrange-act-assert pattern
- **Mock Object**: Test double created using fixtures to simulate AppBlock components and DOM elements
- **Assertion**: Verification that actual behavior matches expected behavior using Jest matchers
- **Test Fixture**: Reusable test data from mockData.js (createMockElement, createMockTemplate, etc.)
- **Coverage Report**: Analysis showing which lines/branches of code are executed by tests
- **Edge Case Test**: Test specifically targeting boundary conditions and unusual inputs
- **Custom Directive**: User-defined function registered in config.directives that returns boolean and can modify nodes
- **Custom Method**: User-defined function registered in config.methods that can access app instance and be called from templates
- **Custom Filter**: User-defined function registered in config.filters that transforms values in placeholders

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Core module has at least 15 test cases covering initialization, rendering, data management, and state handling
- **SC-002**: Directives module has at least 12 test cases covering c-if, c-ifnot, and c-for with various conditions
- **SC-003**: Placeholders module has at least 6 test cases covering text nodes, attributes, and edge cases
- **SC-004**: Utils module has at least 8 test cases covering getProp and helper functions
- **SC-005**: Processing module has at least 6 test cases covering recursive processing and directive evaluation
- **SC-006**: Requests module has at least 10 test cases covering both fetchRequest and axiosRequest
- **SC-007**: Filters module has at least 9 test cases covering filter registration, application in placeholders, and integration with directives
- **SC-008**: Custom extensions module has at least 11 test cases covering user-defined directives, methods, and filters
- **SC-009**: Logger module has at least 3 test cases covering all logging functions
- **SC-010**: All tests execute successfully in under 30 seconds
- **SC-011**: Test suite can run for each module independently (npm run test:core, test:directives, etc.)
- **SC-012**: All tests pass when run together with npm test
- **SC-013**: Each test is independently runnable and doesn't depend on execution order

## Assumptions

- Testing framework (Jest + JSDOM) is already configured and working
- Existing test fixtures in mockData.js are sufficient or can be extended
- Tests focus on AppBlocks behavior, not external library internals (Idiomorph, etc.)
- DOM manipulation tests run in JSDOM environment which simulates browser behavior
- Request tests will use mocked fetch/axios rather than making real HTTP calls
- Test coverage reporting is not required but tests should be comprehensive
- All source code functionality described in the current codebase should be tested
- Tests should catch regressions but don't need to test for behaviors not yet implemented
- Performance testing and benchmarking are out of scope
- Integration tests with real backend services are out of scope
