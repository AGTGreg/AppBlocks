# Introduction

AppBlocks is a tiny, fast and lightweight javascript library for building micro apps. It is designed to be used primarily as a script tag to enhance web pages with self-contained micro applications.

The goal of AppBlocks is to be a small library that provides all the necessary ingredients to develop micro apps in websites while being ridiculously easy to integrate in any project, practical and small.

Read about the [AppBlocks use case](whyappblocks.md).


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

or you can install it via **npm**:

```shell
npm install appblocks
```


## Getting started

Lets start with an empty HTML page:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first AppBlocks app</title>
  </head>
  <body>
    <!-- Load AppBlocks. -->
    <script src="https://cdn.jsdelivr.net/npm/appblocks@2.0.0/dist/appblocks.min.js"></script>
    <script>
      // This is where we will write our AppBlock code
    </script>
  </body>
</html>
```

In order to create an app with AppBlocks, the first thing we need to do is to create an element where our app will be rendered and a `<template>` element that contains all of our app's contents. Inside the body and before the script tags add these elements:

```html
<!-- This is the container where our app will be rendered. -->
<div id="app"></div>

<!-- This is where we put the contents of our app. -->
<template id="appTemplate">
  <p title="{data.message}">{data.message}</p>
</template>
```

>To make things more interesting we add a placeholder that will output some data. Placeholders are enclosed in curly braces `{}`.

If you load the page now, you'll notice that nothing is displayed. We need to initialize our app first. To do that add this inside the script tag at the bottom:

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    message: "Hello world!"
  }
});
```
Reload the page and see the message.

Great! **We have created our very first app!** Let's test this by updating our data! Open up your browser's console and type: `app.setData({message: "Hi console!"})`. Now you should see that our element is automatically updated to display the new message.

> Updating the data directly in AppBlocks does not trigger it to render because that's not what we always want. If we want to update the data and see the changes immediately after that we can use the `appInstance.setData()` to pass in the new data. You can read more about this [here](data.md).

**So these are the steps we took:**
1. Load AppBlocks with a `<script>` tag.
2. Create the elements for rendering our app.
3. Initialize our app.

**Here is the complete code:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first app</title>
  </head>
  <body>

	  <!-- This is the container where our app will be rendered. -->
    <div id="app"></div>

    <!-- This is where we put the contents of our app. -->
    <template id="appTemplate">
      <p title="{data.message}">{data.message}</p>
    </template>

    <!-- Load AppBlocks. -->
    <script src="https://cdn.jsdelivr.net/npm/appblocks@2.0.0/dist/appblocks.min.js"></script>
    <!-- Initialize our app. -->
    <script>
      var app = new AppBlock({
        el: document.getElementById('app'),
        template: document.getElementById('appTemplate'),
        data: {
          message: "Hello world!"
        }
      });
    </script>

  </body>
</html>
```



For more information on how we update our App's data see [The data object](data.md).


## Filters
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

We can also chain multiple filters together and we can use filters in parameters.

[Read more about Filters](filters.md)

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

### c-ifnot

This is the opposite of `c-if`. Think of it as writing if ... else:

```html
<template id="appTemplate">
  <span c-if="data.seen">Now you see me</span>
  <span c-ifnot="data.seen">Now you don't</span>
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

AppBlocks makes it easy for us to handle events while keeping everything nice and clean. `events` are grouped in the `events` object:

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
  <span c-if="data.seen">Now you see me</span>
  <span c-ifnot="data.seen">Now you don't</span>
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

But what if you want to trigger the same functionality from multiple events? You could just add more events and copy and paste your functionality there. **But this is not a good approach.** Your code should be reusable and DRY. This is where the `methods` come in.


## Methods
The `methods` object is the right place to put all of our application's logic. From processing data to anything you would write a function for. This is a good way to keep our code DRY and reusable.

We can call methods from placeholders, attributes and even directives.

Continuing on from the `events` example, let's now change `seen` when the mouse button is Up and change it again when it is down:

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
    'mouseup #message-toggler': function(e) {
      this.Parent.methods.toggleMessage(this.Parent);
    },
    'mousedown #message-toggler': function(e) {
      this.Parent.methods.toggleMessage(this.Parent);
    }
  }

})
```

This might not seem like much to the untrained eye but believe me, when your apps become bigger and more complex, this pattern will make your life much easier ;)

There is more to methods.
[Read more about methods here.](methods.md)

## Requests

A key concept in AppBlocks, is to cover the most common use cases of a front-end micro app. One of those use cases is to be able to make requests.

With AppBlocks you can use `fetch` or [Axios](https://github.com/axios/axios) to make requests. AppBlocks wraps these APIs and takes care of our app's state and rendering for us.

You can read all about making requests [here](requests.md).