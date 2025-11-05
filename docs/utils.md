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


## hasOwn(obj, key)

Checks if an object has a specific property (using `Object.prototype.hasOwnProperty`). This utility safely checks for owned properties without issues with null/undefined prototype chains.

**Syntax:**

`hasOwn(obj, key)`

**Example:**

```js
import { hasOwn } from 'appblocks';

const data = { name: 'John', age: 30 };
if (hasOwn(data, 'name')) {
  console.log('name property exists');
}
```

**Result:**

Returns `true` if the object has the property, `false` otherwise.


## isObject(value)

Determines if a value is a plain object (not an array, not null, and not a primitive type).

**Syntax:**

`isObject(value)`

**Example:**

```js
import { isObject } from 'appblocks';

console.log(isObject({ a: 1 }));        // true
console.log(isObject([1, 2, 3]));       // false
console.log(isObject(null));            // false
console.log(isObject('string'));        // false
console.log(isObject(42));              // false
```

**Result:**

Returns `true` if the value is a plain object, `false` otherwise.


## deepClone(value)

Creates a deep copy of a value, including nested objects and arrays. This utility recursively clones all levels of nested structures.

**Syntax:**

`deepClone(value)`

**Example:**

```js
import { deepClone } from 'appblocks';

const original = {
  name: 'John',
  address: {
    city: 'New York',
    coordinates: [40.7128, -74.0060]
  }
};

const clone = deepClone(original);
clone.address.city = 'Boston';  // Does not affect original

console.log(original.address.city);  // 'New York'
console.log(clone.address.city);     // 'Boston'
```

**Result:**

Returns a complete deep copy of the input value. Handles objects, arrays, and primitives correctly. Circular references are not handled (will cause infinite recursion).
````