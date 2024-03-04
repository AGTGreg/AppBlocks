# Changelog

## 1.4.0
- Add support for [Idiomorph](https://github.com/bigskysoftware/idiomorph) as a render engine.
- Add support for fetch requests.
- **Rendering:** Add `renderEngine` parameter so now we can choose which rendering engine to use. This parameter accepts 'plain' or 'Idiomorph`.
- **Requests:** Replace `makeRequest()` method with `axiosRequest()` and `fetchRequest()` methods.
- **Filters:** Now we can declare filters that take a value from the template and return another value.
- **Filters:** Add a filter to render HTML content. (The default is to allways render data content as text)

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