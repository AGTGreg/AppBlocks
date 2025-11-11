# API Reference

Complete reference for AppBlocks configuration options, methods, and APIs.

## Table of Contents

- [Configuration Options](#configuration-options)
- [Instance Methods](#instance-methods)
- [Built-in Methods](#built-in-methods)
- [State Properties](#state-properties)
- [Utilities](#utilities)

---

## Configuration Options

Options passed to `new AppBlock(config)`:

### el

**Type:** `HTMLElement` (required)

The DOM element where the AppBlock will render.

```js
el: document.getElementById('app')
```

### template

**Type:** `HTMLTemplateElement` (optional)

A `<template>` element containing the app's markup. If not provided, AppBlocks uses the content of `el`.

```js
template: document.getElementById('appTemplate')
```

**Alternative:** Use `el` content directly:
```js
// No template provided - uses content from el
var app = new AppBlock({
  el: document.getElementById('app')
  // AppBlocks will use existing content in #app
});
```

### data

**Type:** `Object` (optional, default: `{}`)

The reactive data object for your application.

```js
data: {
  message: "Hello",
  count: 0,
  items: [],
  user: {
    name: "Alice",
    email: "alice@example.com"
  }
}
```

[📖 Learn more about Data](data.md)

### methods

**Type:** `Object` (optional, default: `{}`)

Custom methods for your application logic.

**Signature:** `methodName(appInstance, ...params) {}`

```js
methods: {
  increment(app) {
    app.setData({ count: app.data.count + 1 });
  },

  greet(app, name) {
    return "Hello, " + name + "!";
  }
}
```

[📖 Learn more about Methods](methods.md)

### filters

**Type:** `Object` (optional, default: `{}`)

Custom filters for transforming data in templates.

**Signature:** `filterName(appInstance, value) { return transformedValue }`

```js
filters: {
  uppercase(app, value) {
    return value.toUpperCase();
  },

  currency(app, value) {
    return '$' + parseFloat(value).toFixed(2);
  }
}
```

[📖 Learn more about Filters](filters.md)

### directives

**Type:** `Object` (optional, default: `{}`)

Custom directives for controlling element rendering.

**Signature:** `directiveName(appInstance, node, pointers) { return boolean }`

```js
directives: {
  'c-custom': function(app, node, pointers) {
    // Custom logic
    return true; // Show element
  }
}
```

[📖 Learn more about Directives](directives.md)

### events

**Type:** `Object` (optional, default: `{}`)

Event listeners for user interactions.

**Format:** `"eventName selector": function(event, matchedElement) {}`

```js
events: {
  'click #submit-btn': function(e, element) {
    this.Parent.setData({ submitted: true });
  },

  'input .search-field': function(e, element) {
    this.Parent.setData({ query: element.value });
  },

  // Complex selectors with descendant combinators
  'click .todo-list li .delete-btn': function(e, element) {
    // Handle nested element clicks
  }
}
```

**Event Delegation:** AppBlocks uses event delegation. The event listener is attached to the root element (`el`) and uses `element.closest()` to match the selector. This supports complex selectors with spaces and descendant combinators.

### name

**Type:** `String` (optional, default: `"AppBlock"`)

A unique name for the AppBlock instance, useful for debugging.

```js
name: "TodoApp"
```

Errors from this app will include the name: `[TodoApp] Error message`

### renderEngine

**Type:** `String` (optional, default: `"Idiomorph"`)

The rendering strategy to use.

**Options:**
- `"Idiomorph"` - Smart DOM diffing (preserves element state)
- `"plain"` - Full DOM replacement (faster but resets state)

```js
renderEngine: "Idiomorph" // Recommended
```

**Idiomorph (default):**
- Uses [Idiomorph](https://github.com/bigskysoftware/idiomorph) for intelligent DOM diffing
- Only updates changed elements
- Preserves element state (focus, scroll position, form values)
- Slightly slower but provides better UX

**Plain:**
- Replaces entire DOM tree
- Faster rendering
- Resets all element states
- Use for static content or when state preservation isn't needed

### delimiters

**Type:** `Array<String>` (optional, default: `['{', '}']`)

Custom placeholder delimiters for templates.

```js
delimiters: ['[[', ']]']
```

```html
<template id="appTemplate">
  <p>[[data.message]]</p>
  <p>[[data.name|uppercase]]</p>
</template>
```

**Requirements:**
- Must be an array of exactly 2 non-empty strings
- First element is the opening delimiter
- Second element is the closing delimiter
- Invalid configurations fall back to default `['{', '}']` with a console error

### allowBuiltins

**Type:** `Array<String>` (optional, default: `[]`)

Allow specific JavaScript built-in objects in expression evaluation (for `c-if`, `c-ifnot`, etc.).

```js
allowBuiltins: ['Math', 'Date']
```

```html
<template id="appTemplate">
  <p c-if="Math.max(data.score, 50) > 60">High score!</p>
  <p>{Math.round(data.value * 100) / 100}</p>
</template>
```

**Security:** By default, built-ins are blocked to prevent unsafe code execution. Only enable trusted built-ins when needed.

**Common built-ins:**
- `Math` - Mathematical operations
- `Date` - Date manipulation
- `String`, `Number`, `Array`, `Object` - Type utilities

---

## Instance Methods

Methods available on AppBlock instances (`app.methodName()`):

### setData()

Updates data and triggers automatic re-rendering.

**Signature:** `setData(newData, replaceData = false)`

**Parameters:**
- `newData` (Object): Data to update
- `replaceData` (Boolean): If `true`, replaces all data. Default: `false` (merges)

```js
// Partial update (merge)
app.setData({ count: 5 });

// Complete replacement
app.setData({ count: 5 }, true);
```

[📖 Learn more about Data Updates](data.md#updating-data)

### render()

Manually triggers a re-render. Useful when updating data directly without `setData()`.

**Signature:** `render(callback)`

**Parameters:**
- `callback` (Function, optional): Called after render completes

```js
// Direct data update
app.data.count++;
app.data.message = "Updated";

// Manually render
app.render(function() {
  console.log('Render complete');
});
```

### resetState()

Resets request state flags (`isLoading`, `isSuccessful`, `hasError`).

**Signature:** `resetState()`

```js
app.resetState();
// All state flags are now false
```

Useful before making a new request to clear previous states.

### fetchRequest()

Makes an HTTP request using the Fetch API with automatic state management.

**Signature:** `fetchRequest(url, options, callbacks, delay)`

**Parameters:**
- `url` (String): Request URL
- `options` (Object): Fetch options (method, headers, body, etc.)
- `callbacks` (Object): Success, error, and finally callbacks
- `delay` (Number, optional): Delay in milliseconds

```js
app.fetchRequest(
  'https://api.example.com/data',
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  },
  {
    success: function(data) {
      app.setData({ items: data });
    },
    error: function(err) {
      console.error(err);
    },
    finally: function() {
      console.log('Request complete');
    }
  },
  300 // 300ms delay
);
```

[📖 Learn more about Requests](requests.md#fetchrequest)

### axiosRequest()

Makes an HTTP request using Axios with automatic state management.

**Signature:** `axiosRequest(config, callbacks, delay)`

**Requires:** Axios library must be loaded

**Parameters:**
- `config` (Object): Axios configuration
- `callbacks` (Object): Success, error, and finally callbacks
- `delay` (Number, optional): Delay in milliseconds

```js
app.axiosRequest(
  {
    url: 'https://api.example.com/data',
    method: 'POST',
    data: { name: 'John' }
  },
  {
    success: function(response) {
      app.setData({ result: response.data });
    },
    error: function(err) {
      console.error(err);
    }
  }
);
```

[📖 Learn more about Requests](requests.md#axiosrequest)

---

## Built-in Methods

Methods automatically available in `app.methods`:

### beforeRender()

Called before each render. Override to run custom logic.

**Signature:** `beforeRender(appInstance)`

```js
methods: {
  beforeRender(app) {
    console.log('About to render with data:', app.data);
  }
}
```

### afterRender()

Called after each render completes. Override to run custom logic.

**Signature:** `afterRender(appInstance)`

```js
methods: {
  afterRender(app) {
    console.log('Render complete');
    // Example: Initialize third-party plugins
    initializeTooltips();
  }
}
```

### isLoading()

Returns `true` if a request is in progress.

**Signature:** `isLoading(appInstance)` → `Boolean`

```html
<p c-if="isLoading()">Loading...</p>
```

### isSuccessful()

Returns `true` if the last request succeeded.

**Signature:** `isSuccessful(appInstance)` → `Boolean`

```html
<div c-if="isSuccessful()">
  Data loaded successfully!
</div>
```

### hasError()

Returns `true` if the last request failed.

**Signature:** `hasError(appInstance)` → `Boolean`

```html
<div c-if="hasError()">
  An error occurred. Please try again.
</div>
```

---

## State Properties

Properties on the AppBlock instance:

### data

**Type:** `Object`

The reactive data object.

```js
app.data.count; // Access
app.data.count = 10; // Direct update (requires manual render)
```

### state

**Type:** `Object`

Internal state object with request status flags.

```js
app.state = {
  loading: false,
  success: false,
  error: false
}
```

**Access via methods:** Use `isLoading()`, `isSuccessful()`, `hasError()` in templates instead of accessing `state` directly.

### el

**Type:** `HTMLElement`

The root DOM element of the AppBlock.

```js
app.el.classList.add('ready');
```

### template

**Type:** `DocumentFragment`

The template content.

```js
// Usually you don't access this directly
console.log(app.template);
```

### methods

**Type:** `Object`

The methods object.

```js
// Call a method
app.methods.myMethod(app, arg1, arg2);
```

### filters

**Type:** `Object`

The filters object.

```js
// Call a filter
var result = app.filters.uppercase(app, 'hello');
```

### directives

**Type:** `Object`

The directives object.

```js
// Usually you don't access this directly
console.log(app.directives);
```

### events

**Type:** `Object`

The events object.

```js
// Usually you don't access this directly
console.log(app.events);
```

### name

**Type:** `String`

The name of the AppBlock instance.

```js
console.log(app.name); // "TodoApp"
```

### renderEngine

**Type:** `String`

The active render engine.

```js
console.log(app.renderEngine); // "Idiomorph" or "plain"
```

---

## Utilities

Helper functions available at `app.utils`:

### getNode()

Returns the first element matching a selector within the AppBlock.

**Signature:** `getNode(selector)` → `Element | null`

```js
var button = app.utils.getNode('#submit-btn');
```

[📖 Learn more about Utilities](utils.md#getnode)

### getNodes()

Returns all elements matching a selector within the AppBlock.

**Signature:** `getNodes(selector)` → `NodeList`

```js
var items = app.utils.getNodes('.list-item');
```

[📖 Learn more about Utilities](utils.md#getnodes)

### appendIn()

Inserts HTML at the end of an element.

**Signature:** `appendIn(html, node)`

```js
app.utils.appendIn('<p>New content</p>', targetElement);
```

[📖 Learn more about Utilities](utils.md#appendin)

### prependIn()

Inserts HTML at the beginning of an element.

**Signature:** `prependIn(html, node)`

```js
app.utils.prependIn('<p>New content</p>', targetElement);
```

[📖 Learn more about Utilities](utils.md#prependin)

### hasOwn()

Checks if an object has a specific own property.

**Signature:** `hasOwn(obj, key)` → `Boolean`

```js
if (app.utils.hasOwn(data, 'name')) {
  // Property exists
}
```

[📖 Learn more about Utilities](utils.md#hasown)

### isObject()

Determines if a value is a plain object.

**Signature:** `isObject(value)` → `Boolean`

```js
if (app.utils.isObject(data.user)) {
  // Is an object
}
```

[📖 Learn more about Utilities](utils.md#isobject)

### deepClone()

Creates a deep copy of a value.

**Signature:** `deepClone(value)` → `Any`

```js
var copy = app.utils.deepClone(app.data.user);
```

[📖 Learn more about Utilities](utils.md#deepclone)

---

## Quick Reference

### Creating an AppBlock

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  name: 'MyApp',
  renderEngine: 'Idiomorph',
  delimiters: ['{', '}'],
  allowBuiltins: [],

  data: { /* ... */ },
  methods: { /* ... */ },
  filters: { /* ... */ },
  directives: { /* ... */ },
  events: { /* ... */ }
});
```

### Common Operations

```js
// Update data and re-render
app.setData({ count: 5 });

// Update data directly and manually render
app.data.count = 5;
app.render();

// Make HTTP request
app.fetchRequest(url, options, callbacks, delay);

// Reset request state
app.resetState();

// Access utilities
app.utils.getNode('#element');
```

---

## See Also

- [Getting Started](README.md)
- [Data Management](data.md)
- [Filters](filters.md)
- [Directives](directives.md)
- [Methods](methods.md)
- [HTTP Requests](requests.md)
- [Utilities](utils.md)
