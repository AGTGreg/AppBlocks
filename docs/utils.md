# Utilities

AppBlocks offers you some helper functions to make your life easier. These functions are in `AppBlock.utils`

## getNode(selectors)

Returns the first element that matches the specified group of selectors and is a descendant of the AppBlock.

**Syntax:**

`utils.getNode(selectors)`

**Example:**

```js
var app = new AppBlock({
  ...
  methods: {
    aMethod(app) {
      app.getNode('div');
    }
  }
  ...
})
```

**Result:**

The element or `null` if nothing was fount.


## getNodes(selectors)

Returns a static (not live) NodeList representing a list of elements matching the specified group of selectors which are descendants of the AppBlock.

**Syntax:**

`utils.getNodes(selectors)`

**Example:**

```js
var app = new AppBlock({
  ...
  methods: {
    aMethod(app) {
      app.getNodes('div');
    }
  }
  ...
})
```

**Result:**

A `NodeList` of elements that match the selector. If nothing was found the `NodeList` is empty.


## appendIn(html, node)

Inserts the specified HTML at the end of the specified node.

**Syntax:**

`appendIn(html, node)`

**Example:**

```js
var app = new AppBlock({
  ...
  methods: {
    aMethod(app) {
      app.appendIn('<p>Hello!</p>', app.getNode('div'));
    }
  }
  ...
})
```

**Result:**

A `p` element (or any HTML we specify) will be inserted at the end of the element we specified.


## prependIn(html, node)

Inserts the specified HTML at the beginning of the specified node.

**Syntax:**

`prependIn(html, node)`

**Example:**

```js
var app = new AppBlock({
  ...
  methods: {
    aMethod(app) {
      app.prependIn('<p>Hello!</p>', app.getNode('div'));
    }
  }
  ...
})
```

**Result:**

A `p` element (or any HTML we specify) will be inserted at the beginning of the element we specified.