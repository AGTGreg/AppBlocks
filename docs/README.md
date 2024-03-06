# Introduction

AppBlocks is a tiny, fast and lightweight javascript library for building front-end apps.

It started as a personal challenge project and later evolved into the go to library that was used in an everyday basis to quickly enhance pages and web applications front-ends with small and maintainable apps.

The goal of AppBlocks is to be a small library that provide all the necessary functionality to develop front-end apps while beeing ridiculously easy to integrate in any project as a script tag, practical and small.

All the knowledge needed to master AppBlocks and start building front-end applications is here in a 10-15 minute read.


## Installation

Download and include with a script tag in your document's head:

```html
<script src="/appblocks.umd.js"></script>

<!-- Or if you prefer, this is the minified version -->
<script src="/appblocks.min.js"></script>
```

or you can use the **CDN version**:

```html
<script src="https://cdn.jsdelivr.net/npm/appblocks@2.0.0/dist/appblocks.min.js"></script>
```

or you can install via **npm**:

```shell
npm install appblocks
```


## Getting started

In order to create an app with AppBlocks, the first thing we need to do, is to create an element with an appropriate id.

To make things more interesting lets also add a placeholder that will output some data. Placeholders are enclosed in curly braces `{}`:

```html
<div id="app">
  {data.message}
</div>
```

Next, we need to create a new AppBlock instance for our element. You may also want to add some data:

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  data: {
    message: "Hello world!"
  }
});
```

> Hello world!

We have created our very first app! We use placeholders enclosed in `{}` to display data.

Lets test this by updating our data! Open up your browser's console and type: `app.setData({message: "Hi console!"})`. Now you should see that our element is automatically updated to display the new message.

For more information on how we update our App's data see [The data object](data.md).

We can also use placeholders in attributes:

```html
<div id="app">
  <p title="{data.message}">{data.message}</p>
</div>
```

## Custom template

A more efficient way for creating our Apps is to have all our content inside a template element and tell AppBlocks were to render it:

```html
<div id="app"></div>

<template id="appTemplate">
  <p title="{data.message}">{data.message}</p>
</template>
```

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    message: "Hello world!"
  }
});
```

So all of our app's contents live inside the template and it will be rendered in `<div id="app"></div>`.

This is the recommended way for creating our Apps in AppBlocks.


## Filters
**`filterName(appInstance, value) { return value }`**

In the example above we get the message directly from our data. But what if we want to edit it before we show it to the world? Lets say that we want to convert it to uppercase letters.

This is were filters come in.
> **filters** are functions that take an input value from a template and return another.

So let's add a filter that will take any value and convert it to uppercase:
```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    message: 'Hello world!'
  },

  filters: {
    toUpperCase(app, value) {
      return value.toUpperCase();
    }
  }

});
```

And this is how we use it in our template:

```html
<template id="appTemplate">
  <p title="{data.message}">{data.message|toUpperCase}</p>
</template>
```

[More about Filters](filters.md)


## Methods
**`methodName(appInstance) {}`**

The `methods` object is the right place to put all of our application's logic. From processing data to anything you would write a function for. This is a good way to keep our code DRY.

We can call methods from placeholders, attributes and even directives (As you'll see later on).

Lets add a method that returns whatever is in our `data.message` but in UpperCase. All methods in AppBlocks exist inside the methods object:

```js
var app = new AppBlock({

  el: document.getElementById('app'),

  data: {
    message: 'Hello world!'
  },

  methods: {
    message(app) {
      return app.data.message.toUpperCase();
    }
  }

})
```

Now we can call this method inside our element:

```html
<template id="appTemplate">
  <p>{message}</p>
</template>
```

> HELLO WORLD!

Note that we don't need to type `methods.message` to access the method. In AppBlocks methods are first class citizens.

[More about methods](methods.md)

## Conditional rendering

It is very easy to control the structure of our app with **if** and **for** directives. We add them as attributes to the elements we want to control.


### c-if

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

### c-ifnot

This is the opposite of `c-if`. Think of it as writing if ... else:

```html
<template id="appTemplate">
  <span c-if="showSpan">Now you see me</span>
  <span c-ifnot="showSpan">Seen is false</span>
</template>
```

Only one of the span elements can be visible depending on the value of `seen`.


### c-for

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


[More about directives](directives.md)


## Event handling
**`"eventTrigger selector": function(event) {}`**

AppBlocks makes it easy for us to handle events while keeping everything nice and clean. Following the same pattern with `filters`, `methods` and `directives`, `events` should go in the `events` object:

```js
var app = new AppBlock({
  ...
  events: {
    'click #a-button': function(e) {
      // Do something
    }
  }
  ...
})
```

Let's create an app where the user can toggle an element with a click of a button:

```html
<template id="appTemplate">
  <p c-if="data.seen">Now you see me</p>
  <button id="message-toggler">Toggle message</button>
</template>
```

```js
var app = new AppBlock({

  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    seen: true
  },

  events: {
    'click #message-toggler': function(e) {
      this.Parent.setData({
        seen: !this.Parent.data.seen
      })
    }
  }

})
```

If you plan to toggle the message from multiple elements, you could use `methods` to make things even cleaner and DRY:

```js
var app = new AppBlock({

  ...

  methods: {
    toggleMessage(thisApp) {
      thisApp.setData({
        seen: !this.Parent.data.seen
      });
    }
  },

  events: {
    'click #message-toggler': function(e) {
      this.Parent.methods.toggleMessage(this.Parent);
    },
    'click #message-toggler-b': function(e) {
      this.Parent.methods.toggleMessage(this.Parent);
    }
  }

})
```


## Requests

A key concept in AppBlocks, is to cover the most common use cases of a front-end micro app. One of those use cases is to be able to make requests.

With AppBlocks you can use `fetch` or [Axios](https://github.com/axios/axios) to make requests. AppBlocks wraps these APIs and takes care of our app's state and rendering for us.

You can read all about making requests [here](requests.md).