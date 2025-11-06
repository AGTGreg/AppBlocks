# Feature Specification: Template and Event Enhancements

**Feature Branch**: `003-template-enhancements`
**Created**: November 5, 2025
**Status**: Draft
**Input**: User description: "Add template and event enhancements: CSS selectors with spaces in events, c-for object iteration, method calls with parameters in templates, and logical operators in c-if directives"

## Clarifications

### Session 2025-11-06

- Q: Pre-session clarification → A: Event selectors must be restricted to elements that are INSIDE the app/component using `comp.el.querySelectorAll(selector)`
- Q: Pre-session clarification → A: Operator names (pointers) in c-for are not hard coded. They can be named by the developer (e.g., `c-for="id, contact in data.contacts"`, `c-for="sku, data in data.products"`)
- Q: Pre-session clarification → A: The first parameter in a method is always the instance of the current app, but when called from the template, developers do not pass it explicitly. AppBlocks auto-injects it. Method defined as `addNums(thisApp, a, b)` is called as `{addNums(a, b)}` in template.
- Q: Pre-session clarification → A: Methods with no arguments can be called as `{myMethod()}` or `{myMethod}` (with or without parentheses)
- Q: Pre-session clarification → A: Method calls with parameters can be used in placeholders, filters, and directives (`c-for`, `c-if`, `c-ifnot`, custom directives)
- Q: Pre-session clarification → A: Edge Cases - Make reasonable assumptions for the edge cases
- Q: When parsing method parameters in templates, how should the system distinguish between a string literal and a data property reference? → A: String literals use single quotes (`{greet('Hello')}`), unquoted values are property paths (`{greet(data.name)}`)
- Q: What terminology should be used consistently throughout the spec for the variables created by c-for during iteration? → A: Pointers
- Q: When a method call in a template fails (method doesn't exist, throws an error, or receives invalid parameters), what should the rendered output be? → A: Empty string with error logged to console (graceful degradation)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Event Selectors with Spaces (Priority: P1)

Developers can attach event listeners to elements using complex CSS selectors that include descendant combinators (spaces), enabling them to target nested elements within the AppBlock container without worrying about selector parsing limitations.

**Why this priority**: This is the most critical enhancement because it directly impacts how developers structure their event handlers. Currently, developers are forced to use simplified selectors or create workarounds, which leads to less maintainable code and confusion about framework capabilities.

**Independent Test**: Can be fully tested by defining an event with a space-separated selector like `'click #container .button': handler` and verifying the handler executes when nested elements are clicked. Delivers immediate value by eliminating current selector limitations.

**Acceptance Scenarios**:

1. **Given** an AppBlock with nested elements `<div id="parent"><span class="child">Click</span></div>`, **When** developer defines event `'click #parent .child': function(e) { ... }`, **Then** clicking the span element triggers the event handler
2. **Given** an AppBlock with complex DOM structure, **When** developer uses multi-level selectors like `'click #nav ul li a'`, **Then** clicking anchor elements within the nested list triggers the handler
3. **Given** an event selector with multiple spaces `'click .container .section .button'`, **When** the deeply nested button is clicked, **Then** the event handler executes correctly
4. **Given** backward compatibility requirements, **When** developer uses simple selectors without spaces like `'click #button'`, **Then** events continue to work as they currently do

---

### User Story 2 - Object Iteration in c-for (Priority: P2)

Developers can iterate over object properties using the `c-for` directive with the syntax `c-for="key, value in data.myObject"`, allowing them to display key-value pairs from objects without converting them to arrays first.

**Why this priority**: This is second priority because while it adds significant convenience, developers can currently work around this limitation by pre-processing objects into arrays. However, native object iteration will reduce boilerplate code and make templates more expressive.

**Independent Test**: Can be fully tested by creating a data object with properties, using `c-for="key, value in data.myObject"` in a template, and verifying that elements are rendered for each key-value pair. Delivers value by simplifying object rendering patterns.

**Acceptance Scenarios**:

1. **Given** data contains an object `{name: 'John', age: 30, city: 'NYC'}`, **When** template uses `c-for="key, value in data.user"`, **Then** three elements are rendered with access to both key and value
2. **Given** a c-for directive iterating over an object, **When** placeholders reference `{key}` and `{value}`, **Then** the actual property names and values are displayed
3. **Given** backward compatibility requirements, **When** developer uses existing array syntax `c-for="item in data.items"`, **Then** array iteration continues to work without changes
4. **Given** an empty object, **When** c-for attempts to iterate, **Then** no elements are rendered and no errors occur
5. **Given** nested objects in the iterated object, **When** accessing `{value.property}` in the template, **Then** nested property values are correctly displayed

---

### User Story 3 - Method Calls with Parameters (Priority: P3)

Developers can call methods with parameters directly from templates using syntax like `{makeId(someValue)}` in placeholders and `c-for="item in getItems(category)"` in directives, enabling dynamic data transformations and computed values within templates.

**Why this priority**: This is third priority because it significantly enhances template expressiveness but requires developers to structure their code properly. While powerful, it's less urgent than fixing event selector limitations and can be deferred if needed.

**Independent Test**: Can be fully tested by defining a method that accepts parameters, calling it from a placeholder or directive with arguments, and verifying the computed result appears in the rendered output. Delivers value by enabling template-level data transformation.

**Acceptance Scenarios**:

1. **Given** a method `formatPrice(value, currency)` in methods, **When** template uses `{formatPrice(product.price, 'USD')}`, **Then** the formatted price string is displayed
2. **Given** a method `getItems(category)` that returns filtered data, **When** directive uses `c-for="item in getItems('active')"`, **Then** only items matching the category are iterated
3. **Given** nested method calls, **When** template uses `{formatDate(getTimestamp())}`, **Then** both methods execute in sequence and result is displayed
4. **Given** method parameters that reference data properties, **When** using `{calculate(data.quantity, data.price)}`, **Then** current data values are passed to the method
5. **Given** a method call with string literals, **When** using `{greet('Hello', data.name)}`, **Then** string literals and data properties are correctly passed as arguments
6. **Given** a method that doesn't exist or throws an error, **When** template attempts to call it, **Then** an empty string is rendered and the error is logged to console (graceful degradation)

---

### User Story 4 - Logical Operators in c-if (Priority: P3)

Developers can use logical operators `and`, `or`, and `not` within `c-if` directives to create complex conditional rendering without JavaScript expressions, making templates more readable and maintainable.

**Why this priority**: This is third priority alongside method calls because while it improves template clarity, developers can currently achieve similar results using existing comparison operators or multiple nested c-if/c-ifnot directives. It's a quality-of-life improvement rather than a critical need.

**Independent Test**: Can be fully tested by creating templates with compound conditions like `c-if="user.isActive and user.age > 18"` and verifying elements render only when all conditions are met. Delivers value by reducing template complexity.

**Acceptance Scenarios**:

1. **Given** data with `user.isActive = true` and `user.age = 25`, **When** template uses `c-if="user.isActive and user.age >= 18"`, **Then** the element is displayed
2. **Given** data with `status = 'pending'` and `priority = 'high'`, **When** template uses `c-if="status == 'pending' or priority == 'high'"`, **Then** the element is displayed if either condition is true
3. **Given** a boolean property `user.isBlocked`, **When** template uses `c-if="not user.isBlocked"`, **Then** the element displays only when user is not blocked
4. **Given** complex nested conditions, **When** using `c-if="user.isActive and (user.role == 'admin' or user.role == 'moderator')"`, **Then** proper precedence and grouping is respected
5. **Given** backward compatibility requirements, **When** existing c-if directives use comparison operators without logical operators, **Then** they continue to work as before
6. **Given** invalid logical operator syntax or evaluation errors, **When** template contains malformed conditions, **Then** an empty string is rendered and the error is logged to console

---

### Edge Cases

- **Event selectors with special CSS characters**: Attribute selectors `[data-id="123"]`, pseudo-classes `:hover`, and combinators `>`, `+`, `~` are supported natively by `querySelectorAll` and will work as expected within the component scope
- **c-for object iteration edge cases**: Only own enumerable properties are iterated (no inherited properties or Symbol keys); empty objects render zero elements; objects modified during iteration complete the current iteration cycle with the original property set
- **Method parameters with undefined properties**: Undefined properties pass `undefined` as the parameter value; methods receive `undefined` and handle it according to their implementation
- **Whitespace and quotes in method parameters**: String literals must use single quotes within template attributes (e.g., `{greet('Hello')}` since attributes use double quotes); unquoted values are treated as property paths (e.g., `data.name`); numeric literals (e.g., `42`, `3.14`) and boolean literals (`true`, `false`) require no quotes; whitespace around parameters is trimmed during parsing
- **Logical operators with truthy/falsy values**: Non-boolean values are evaluated using JavaScript truthy/falsy rules (0, '', null, undefined, NaN are falsy; all other values are truthy)
- **Circular references in method calls**: Not explicitly prevented; methods that create circular call chains will hit JavaScript stack limits and throw stack overflow errors logged through existing error handling
- **Method calls with no parameters**: Both `{myMethod()}` and `{myMethod}` syntax are equivalent and invoke the method with only the auto-injected app instance parameter
- **Logical operators combined with comparison operators**: Standard operator precedence applies: comparisons evaluate first, then `not`, then `and`, then `or`; use parentheses for explicit control

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse event definitions that contain CSS selectors with spaces (descendant combinators) and attach event listeners correctly using `comp.el.querySelectorAll(selector)` to restrict selection to elements inside the app/component
- **FR-002**: System MUST support selectors with multiple spaces representing nested element hierarchies (e.g., `#container .section .button a`) scoped to the component's element tree
- **FR-003**: System MUST maintain backward compatibility with existing single-element selectors that do not contain spaces
- **FR-004**: System MUST support c-for directive with object iteration syntax using developer-defined variable names: `c-for="customKey, customValue in data.object"` (e.g., `c-for="id, contact in data.contacts"`, `c-for="sku, product in data.products"`)
- **FR-005**: System MUST make both key and value available as pointers when iterating over objects, using the developer's chosen variable names
- **FR-006**: System MUST continue to support existing array iteration syntax `c-for="item in data.array"` without breaking changes
- **FR-007**: System MUST detect and parse method calls with parameters in placeholders (e.g., `{methodName(arg1, arg2)}`), auto-injecting the app instance as the first parameter when invoking the method
- **FR-008**: System MUST detect and parse method calls with parameters in directives (e.g., `c-for="item in getItems(param)"`) and filters, auto-injecting the app instance
- **FR-009**: System MUST support string literals (enclosed in single quotes), numeric literals, boolean literals, and data property references (unquoted dot-notation paths) as method parameters
- **FR-010**: System MUST distinguish between string literals using single quotes (`'text'`) and property path references (unquoted like `data.name`)
- **FR-011**: System MUST support nested method calls where one method's return value is passed to another
- **FR-012**: System MUST support method calls with no parameters in both forms: `{myMethod()}` and `{myMethod}` (with or without parentheses)
- **FR-013**: System MUST recognize logical operators `and`, `or`, and `not` within c-if directive conditions
- **FR-014**: System MUST evaluate compound conditions with proper precedence (not > and > or)
- **FR-015**: System MUST support grouping with parentheses in logical expressions for explicit precedence control
- **FR-016**: System MUST combine logical operators with existing comparison operators (==, !=, >, <, etc.)
- **FR-017**: System MUST handle undefined or null values gracefully in all new features without breaking the render cycle
- **FR-018**: System MUST render empty strings when method calls fail (method not found, throws error, invalid parameters) and log errors to console for developer debugging
- **FR-019**: System MUST maintain existing error logging patterns when new features encounter errors

### Key Entities *(include if feature involves data)*

- **Event Definition**: Represents an event handler configuration containing an event type, a CSS selector (potentially with spaces), and a handler function
- **Object Iterator**: Represents the iteration state when c-for processes an object, tracking current key-value pair and maintaining pointers
- **Method Call Expression**: Represents a parsed method invocation containing method name, parameter list, and parameter types (literal vs reference)
- **Logical Expression**: Represents a compound condition containing logical operators, operands (which may be comparisons or boolean values), and grouping information

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can successfully attach event handlers to nested elements using selectors with spaces, reducing workaround code by 100% for nested element targeting
- **SC-002**: Templates using c-for with objects render all key-value pairs correctly without requiring array conversion preprocessing
- **SC-003**: Method calls with parameters execute successfully in both placeholders and directives, returning expected computed values
- **SC-004**: Complex conditional rendering using logical operators evaluates correctly for all combinations of boolean values
- **SC-005**: All existing AppBlock applications continue to function without modification when upgraded to the enhanced version (100% backward compatibility)
- **SC-006**: Error messages for malformed selectors, invalid method calls, or incorrect logical expressions are logged to console with clear guidance for developers; failed operations render empty strings without breaking the page
- **SC-007**: Template rendering performance remains within 10% of current performance for equivalent functionality using workarounds
