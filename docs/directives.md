# Directives
It is very easy to control the structure of our app with **if** and **for** directives. We add them as attributes to the elements we want to control.


## c-if

```html
<template id="appTemplate">
  <span c-if="data.seen">Now you see me</span>
</template>
```

```js
var app = new AppBlock({
  ...
  data: {
    seen: true
  },
  ...
})
```
When `seen` is `true` our element is visible. If we set it to `false` our element is gone.

> `c-if` evaluates to `false` if the value you passed to it is `undefined`, `null`, `false`, `0` or empty string.

**As we mentioned earlier directives have access to our methods:**
```js
var app = new AppBlock({
  ...
  data: {
    seen: true
  },

  methods: {
    showSpan(self) {
      return self.data.seen;
    }
  }
})
```

```html
<template id="appTemplate">
  <span c-if="showSpan">Now you see me</span>
</template>
```

**Methods with parameters:**

When calling methods from `c-if`, AppBlocks automatically passes the app instance as the first parameter. You define your methods to receive the instance, then any additional parameters:

```js
var app = new AppBlock({
  ...
  data: {
    userAge: 25,
    minimumAge: 18
  },

  methods: {
    // Define with app instance as first param
    isOldEnough(self, age, minimum) {
      return age >= minimum;
    },

    isInRange(self, value, min, max) {
      return value >= min && value <= max;
    }
  }
})
```

```html
<template id="appTemplate">
  <!-- Call without passing the app's instance -->
  <span c-if="isOldEnough(data.userAge, data.minimumAge)">You can proceed</span>
  <span c-if="isInRange(data.userAge, 18, 65)">Working age</span>
</template>
```

## c-ifnot

This is the opposite of `c-if`. Think of it as writing if ... else if:

```html
<template id="appTemplate">
  <span c-if="showSpan">Now you see me</span>
  <span c-ifnot="showSpan">Seen is false</span>
</template>
```

Only one of the span elements can be visible depending on the value of `seen`.

## Expression Support in c-if and c-ifnot

`c-if` and `c-ifnot` support full JavaScript expressions for complex conditional logic:

```html
<template id="appTemplate">
  <span c-if="data.messages.length >= 10">You have many messages</span>
  <span c-if="hasUser(data.messages) && data.isLoggedIn">Welcome back!</span>
  <span c-ifnot="data.messages.length >= 10">Keep the conversation going</span>
</template>
```

Expressions evaluate with access to `data` and instance methods. Results follow JavaScript truthiness rules.

**Important:** When calling methods from expressions, AppBlocks automatically injects the app instance as the first parameter. Define methods with `methodName(self, ...params)` but call them in templates as `methodName(param1, param2)`.

### Using c-if and c-ifnot Inside c-for Loops

When `c-if` or `c-ifnot` appear inside a `c-for` loop, they have access to the loop's pointer variables:

```js
var app = new AppBlock({
  ...
  data: {
    todos: [
      { id: 1, text: 'Learn AppBlocks', done: false },
      { id: 2, text: 'Build an app', done: true }
    ]
  },
  ...
})
```

```html
<template id="appTemplate">
  <ul>
    <li c-for="todo in data.todos">
      <input type="checkbox" c-if="todo.done" checked>
      <input type="checkbox" c-ifnot="todo.done">
      <span>{todo.text}</span>
    </li>
  </ul>
</template>
```

The `todo` pointer from `c-for` is directly accessible in the `c-if` and `c-ifnot` expressions. This works with:
- Single pointer syntax: `item in data.items`
- Dual pointer syntax: `key, value in data.settings`
- Complex expressions: `item.value > 10 && item.active`

### Enabling Built-ins

By default, global objects like `Math`, `Date`, `Object`, etc. are **blocked** for security. To use them in expressions, explicitly enable them in `allowBuiltins` option:

```js
var app = new AppBlock({
  data: { value: 42 },
  allowBuiltins: ['Math'],
  ...
})
```

```html
<span c-if="Math.max(data.value, 10) > 40">Big number</span>
```

Without `allowBuiltins: ['Math']`, the expression would fail with `Cannot read property 'max' of undefined`.

**Available built-ins to enable**: `Math`, `Date`, `Object`, `Array`, `String`, `Number`, `Boolean`, `RegExp`, `JSON`, `Promise`, `Set`, `Map`, and others.

> Dangerous constructs (assignments, function declarations, etc.) are automatically blocked with a warning.


## c-for

We can use the `c-for` directive to display data from arrays and objects:

### Iterating Over Arrays

```js
var app = new AppBlock({
  ...
  data: {
    grosseryList: [
      {title: "Milk"},
      {title: "Tomatoes"},
      {title: "Orange juice"}
    ]
  },
  ...
})
```

```html
<template id="appTemplate">
  <ul>
    <li c-for="item in data.grosseryList"> {item.title} </li>
  </ul>
</template>
```
> - Milk
> - Tomatoes
> - Orange juice

### Iterating Over Objects

You can iterate over plain JavaScript objects using dual-pointer syntax `key, value in object`:

```js
var app = new AppBlock({
  ...
  data: {
    settings: {
      theme: 'dark',
      language: 'en',
      notifications: true
    }
  },
  ...
})
```

```html
<template id="appTemplate">
  <ul>
    <li c-for="key, value in data.settings">
      <strong>{key}:</strong> {value}
    </li>
  </ul>
</template>
```
> - **theme:** dark
> - **language:** en
> - **notifications:** true

**Single pointer with objects**: If you only need the values (not the keys), use single pointer syntax:

```html
<li c-for="value in data.settings">{value}</li>
```
> - dark
> - en
> - true

### Nested Iteration

You can nest `c-for` directives to iterate over complex data structures:

```js
var app = new AppBlock({
  ...
  data: {
    catalog: {
      Electronics: [
        { name: 'Laptop', price: 999 },
        { name: 'Mouse', price: 25 }
      ],
      Books: [
        { name: 'JavaScript Guide', price: 35 }
      ]
    }
  },
  ...
})
```

```html
<template id="appTemplate">
  <div c-for="category, products in data.catalog">
    <h2>{category}</h2>
    <ul>
      <li c-for="product in products">
        {product.name} - ${product.price}
      </li>
    </ul>
  </div>
</template>
```
> **Electronics**
> - Laptop - $999
> - Mouse - $25
>
> **Books**
> - JavaScript Guide - $35

### Method Calls in c-for

You can call methods to generate iterables (arrays or objects). The app instance is injected as the first parameter:

**Array from method:**

```js
var app = new AppBlock({
  ...
  data: {
    start: 1,
    end: 5
  },
  methods: {
    getRange: function(self, start, end) {
      return Array.from({length: end - start + 1}, (_, i) => start + i);
    }
  },
  ...
})
```

```html
<template id="appTemplate">
  <ul>
    <li c-for="n in getRange(data.start, data.end)">
      {n}
    </li>
  </ul>
</template>
```
> - 1
> - 2
> - 3
> - 4
> - 5

**Object from method:**

```js
var app = new AppBlock({
  ...
  methods: {
    getConfig: function(self) {
      return {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
      };
    }
  },
  ...
})
```

```html
<template id="appTemplate">
  <div c-for="setting, value in getConfig()">
    {setting}: {value}
  </div>
</template>
```
> apiUrl: https://api.example.com
> timeout: 5000
> retries: 3


## Making your own directives
**`directiveName: function(appInstance, node, pointers) { return bool; }`**

You can allways make your own directives ofcourse.

Directives are functions that return a boolean. If a directive returns `true`, AppBlocks will show the element that is assosiated with it, if it returns `false`, AppBlock will discard it and the element will not show up.

You can create your directives in the `directives` parameter like so:

```js
var app = new AppBlock({
  ...
  directives: {
    'c-custom-directive': function(thisApp, node, pointers) {
      // Do something
      return true;
    }
  },
  ...
})
```

A directive needs to have the following parameters that AppBlocks will pass to it, when it invokes it:
- **appInstance**: This is the instance of our app.
- **node**: This is the element that contains our directive.
- **pointers**: This is needed in case the element with our directive, is inside a `c-for` block. It is an object whose keys are set by a `c-for` block and point to specific data.

Then we can use it like any other directive:

```html
<div c-custom-directive="something"></div>
```

Let's make a directive that gets a name as a value and prints a greeting inside an element:

```js
var app = new AppBlock({
  ...
  directives: {
    'c-my-custom-dir': function(thisApp, node, pointers) {
      var message = "Hi there " + node.getAttribute('c-my-custom-dir') + "!";
      var newContent = document.createTextNode(message);
      node.appendChild(newContent);
      return true;
    }
  },
  ...
})
```

```html
<div c-my-custom-dir="Greg"></div>
```

The result will be:
> Hi there Greg!

> Note that we have to return `true` in order for our element to show up. Otherwise AppBlocks would have discarded it.