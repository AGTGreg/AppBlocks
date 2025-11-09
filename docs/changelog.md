# Changelog

## 2.1.0 (Unreleased)
- **New:** Method calls with parameters in placeholders and directives. Call app methods directly in templates with implicit app instance injection: `{sumMethod(data.a, data.b)}` or `c-for="item in getItems()"`.
- **New:** Method call result caching (per-render ephemeral) to prevent duplicate evaluations in the same render cycle.
- **New:** Object iteration in `c-for` directive. Iterate over plain JavaScript objects using dual-pointer syntax: `c-for="key, value in data.myObject"` or single-pointer for values only: `c-for="value in data.myObject"`. Works with both data properties and method calls. Uses `Object.entries()` for iteration (own enumerable properties only).
- **Enhancement:** Nested method calls supported; arguments are evaluated recursively before invocation.
- **Enhancement:** Method results can be filtered: `{getValue()|uppercase|trim}`.
- **Enhancement:** Non-iterable results in `c-for` method calls log error and skip iteration gracefully.
- **Performance:** Method call feature adds <2KB to minified build (66KB total minified, 25KB gzipped). Benchmark tests confirm <5% rendering overhead for typical use cases.
- **Performance:** Object iteration adds ~40 lines of code with negligible runtime overhead due to optimized type detection priority (arrays first, then iterables, then objects).
- **Enhancement:** `c-if` and `c-ifnot` directives now support JavaScript expressions for complex conditional logic. Expressions have access to `data` and methods; built-ins like `Math` can be enabled via `config.allowBuiltins`. Dangerous constructs (assignments, function calls, etc.) are automatically blocked for security.
- **New:** Event delegation supports complex CSS selectors including descendant combinators (e.g. `'click .list li .delete'`). Handlers receive `(event, matchedElement)`.
- **New:** Configurable placeholder delimiters via the `delimiters: [open, close]` config option. Filters continue to work inside custom delimiters.
- **New:** Lightweight benchmark runner (`scripts/benchmark.js`) to collect render timing samples, compute mean/median, detect outliers, and compare against a local baseline in `.benchmarks/baseline.json`.
- **Enhancement:** Placeholder parsing refactored to support dynamic delimiters and preserve filters and `asHTML` behavior.
- **Testing:** Added comprehensive tests for object iteration (19 test cases), selector delegation, custom delimiters, and benchmark results; full test-suite coverage added for new features.

## 2.0.4
- Comprehensive testing
- **Enhancement:** Add `hasOwn`, `isObject` and `deepClone` utils.

## 2.0.3
- Removed render time logging.

## 2.0.1
- **FIX:** Fixed unresolved dependencies and mixed imports.

## 2.0.0
- **Rendering:** Add support for [Idiomorph](https://github.com/bigskysoftware/idiomorph) as a render engine.
- **Rendering:** Add `renderEngine` parameter so now we can choose which rendering engine to use. This parameter accepts 'plain' or 'Idiomorph`. Default is 'Idiomorph'
- **Requests:** Add support for fetch requests.
- **Requests:** Replace `makeRequest()` method with `axiosRequest()` and `fetchRequest()` methods.
- **Filters:** Now we can declare filters that take a value from the template and return another value.
- **Filters:** Add a filter to render HTML content. (The default is to allways render data content as text).
- **Filters:** Chain multiple filters together.
- **Filters:** Make filters available for attributes.
- **AppName:** Add name parameter so that all errors curry the app's name for easier debugging.
- **Documentation:** Refactor documentation and update it to the latest features.

## 1.3.0
- **FIX:** AppBlocks would throw an error if el is not set or if the element in el does not exist effectively blocking other scripts from executing.
- **Enhancement:** Get data objects with square brackets notation in templates. (dynamic keys)
- **Enhancement:** Placeholders inside c-for directives would get a value only if the c-for array contained objects. Now c-for works with non object array elements as well.
- **Enhancement:** c-if directives will evaluate to false if the return value is false, null, undefined, 0 or empty string.
- **New feature:** Debugging. If debug is true then AppBlocks will show warnings and logging data in the console.
- **New feature:** utils: A set of helper functions:
  - `utils.getNode(selectors)`: Returns the first element that is a descendant of the AppBlock that matches the specified group of selectors.
  - `utils.getNodes(selectors)`: Returns a static (not live) NodeList representing a list of elements matching the specified group of selectors which are descendants of the AppBlock.
  - `utils.appendIn(HTML, node)`: Inserts the specified HTML at the end of the specified node.
  - `utils.prependIn(HTML, node)`: Inserts the specified HTML at the begining of the specified node.

## 1.2.3
- **Enhancement:** Compile packages through babel for better compatibility.
- **Enhancement:** Cleanup UMD, ES and CJS packages.

## 1.2.2
- **FIX:** ReferenceError: data is not defined when `replaceData` in `setData` is set to `true`

## 1.2.0
- **New feature:** Assign custom template.
- **New feature:** Add `beforeRender()` and `afterRender()` methods that get called before and after rendering.
- **Enhancement:** AppBlocks uses documentFragment to make DOM changes in memory.
- **Enhancement:** Undefined properties will render as empty text instead of "undefined".
- **Enhancement:** Methods now take an optional argument which is the instance of their app.
- **Enhancement:** Success callback can mutate the data of the response.