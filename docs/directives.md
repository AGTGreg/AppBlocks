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

`c-if` directives can also work with
[Comparison operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators) and evaluate **numbers** and **booleans**. For instance we could do this and it would work as expected:
```html
<template id="appTemplate">
  <span c-if="data.seen == true">Now you see me</span>
</template>
```

**As we mentioned earlier directives have access to our methods:**
```js
var app = new AppBlock({
  ...
  data: {
    seen: true
  },

  methods: {
    showSpan(thisApp) {
      return thisApp.data.seen;
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
    isOldEnough(thisApp, age, minimum) {
      return age >= minimum;
    },

    isInRange(thisApp, value, min, max) {
      return value >= min && value <= max;
    }
  }
})
```

```html
<template id="appTemplate">
  <!-- Call without passing the app instance -->
  <span c-if="isOldEnough(data.userAge, data.minimumAge)">You can proceed</span>
  <span c-if="isInRange(data.userAge, 18, 65)">Working age</span>
</template>
```

## c-ifnot

This is the opposite of `c-if`. Think of it as writing if ... else:

```html
<template id="appTemplate">
  <span c-if="showSpan">Now you see me</span>
  <span c-ifnot="showSpan">Seen is false</span>
</template>
```

Only one of the span elements can be visible depending on the value of `seen`.


## c-for

We can use the `c-for` directive to display data from arrays:

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

**Important:** When calling methods from expressions, AppBlocks automatically injects the app instance as the first parameter. Define methods with `methodName(thisApp, ...params)` but call them in templates as `methodName(param1, param2)`.

### Enabling Built-ins

Built-ins like `Math` are blocked by default for security. Enable them in config:

```js
var app = new AppBlock({
  data: { value: 42 },
  config: { allowBuiltins: ['Math'] }
})
```

```html
<span c-if="Math.max(data.value, 10) > 40">Big number</span>
```

> Dangerous constructs (assignments, function declarations, etc.) are automatically blocked with a warning.