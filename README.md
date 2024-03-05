# Introduction

AppBlocks is a tiny, fast and very lightweight javascript library for building front-end apps.

It started as a personal challenge project that later evolved to a usable full fleged library that covered the need to quickly enhancing pages and web applications front-ends with small and maintainable applications.

The main goals of AppBlocks is to provide all the necessary functionality to develop front-end apps while beeing
lightweight, ridiculously easy to integrate in any project, practical and small.

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
<script src="https://cdn.jsdelivr.net/npm/appblocks@1.4.0/dist/appblocks.min.js"></script>
```

or you can install via **npm**:

```shell
npm install appblocks
```


## Getting started

In order to create an app with AppBlocks, the first thing we need to do, is to create an element with an appropriate id.

To make things more interesting lets also add a placeholder that will output some data. Placeholders are enclosed
in curly braces `{}`:

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

Lets test this by updating our data! Open up your browser's console and type: `app.setData({message: "Hi"})`.
Now you should see that our element is automatically updated to display the new message.

For more information on how we update our App's data see [The data object](data.md).

We can also use placeholders in attributes:

```html
<div id="app">
  <p title="{data.message}">{data.message}</p>
</div>
```

## Custom template

A more efficient way for creating our Apps is to have all our content inside a template element and tell
AppBlocks were it to render it:

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

This is the recommended way for creating our Apps in AppBlocks.


## Filters
`filterName(appInstance, value) { return value }`

In the example above we get the message directly from our data. But what if we wanted to edit that message before we
show it to the world? Lets say we want to convert it to uppercase letters.

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


### Chaining filters
It is possible to chain multiple filters together like so:
```html
<template id="appTemplate">
  <p title="{data.message}">
    {data.message|filterA|filterB|filterC}
  </p>
</template>
```


## Methods
`methodName(appInstance) {}`

The `methods` object is the right place to put all of our application's logic. From processing data to anything you would write a function for. This is a good way to keep our code DRY.

We can call methods from placeholders, attributes and even directives (As you'll see later on).

Lets add a method that returns whatever is in our `data.message` but in UpperCase. All methods in AppBlocks
exist inside the methods object:

```js
var app = new AppBlock({

  el: document.getElementById('app'),

  data: {
    message: 'Hello world!'
  },

  methods: {
    // All methods take 1 optional parameter which is our app's instance
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

You can read more about methods [here](methods.md)

## Conditional rendering

It is very easy to control the structure of our app with **if** and **for** directives. We add these
directives as attributes to the elements we want to control.


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

`c-if` evaluates to `false` if the value you passed to it is `undefined`, `null`, `false`, `0` or empty string.

`c-if` directives can also work with
[Comparison operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)
and evaluate **numbers** and **booleans**. For instance we could do this and it would work as expected:
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


### Making your own directives
`directiveName: function(appInstance, node, pointers) { return bool; }`

You can allways make your own directives ofcourse.

Directives are functions that return `true` or `false`. If a directive returns `true`, AppBlocks will show the element
that is assosiated with that directive, if it returns `false`, AppBlock will discard it and the element will not show up.

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
- **thisApp**: This is the instance of our app.
- **node**: This is the element that contains our directive.
- **pointers**: This is needed in case the element with our directive, is inside a `c-for` block. It is an object whose
keys are set by a `c-for` block and point to specific data.

Then we can use it like any other directive:

```html
<div c-custom-directive="something"></div>
```

Let's make a directive that gets a name as a value prints a greeting inside an element:

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


## Event handling
`"eventTrigger selector": function(event) {}`

AppBlocks makes it easy for us to handle events while keeping everything nice and clean. Following the same pattern with `filters`, `methods` and `directives`,   `events` should go in the `events` object:

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

Every event starts with the event name, then the element that this event is attached to, followed by the method
that will be executed when the event is triggered.

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

  el: document.getElementById('app'),

  data: {
    seen: true
  },

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
    }
  }

})
```


## Requests

A key concept in AppBlocks, is to cover the most common use cases of a front-end micro app. One of those use cases is to be able to make requests.

With AppBlocks you can use `fetch` or [Axios](https://github.com/axios/axios) to do that. AppBlocks wraps these APIs and takes care of our app's state and rendering.

### Usage

#### Fetch
```js
App.fetchRequest(url, options, callbacks, delay);
```

- `options`: Read [this](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options) for what can go into the `options`.
- `callbacks`: success, error and finally callback functions.
- `delay`: You may add a delay in milliseconds for the request. This is handy if you want to throttle your requests.

**Example:**
```js
App.fetchRequest("https://example.com",
  {
    method: 'GET'
  },
  {
    success(response) { console.log(response); },
    error(error) { console.log(error); },
    finally() { alert('Request is finished'); }
  }, 300)
```

#### Axios
> To make use of the Requests featute, we must first include the Axios library in our document since Axios is not included in AppBlocs:
> ```html
> <script src="https://cdn.jsdelivr.net/npm/axios/dist/ axios.min.js"></script>
> ```

```js
App.axiosRequest(config, callbacks, delay);
```

- `config`: Read [this](https://axios-http.com/docs/req_config) for what can go into the `config`.
- `callbacks`: success, error and finally callback functions.
- `delay`: You may add a delay in milliseconds for the request. This is handy if you want to throttle your requests.

Example:

```js
App.axiosRequest(
  {
    url: 'https://example.com',
    method: 'GET'
  },
  {
    success(response) { console.log(response); },
    error(error) { console.log(error); },
    finally() { alert('Request is finished'); }
  }, 300)
```

### State

AppBlocks will update the state of our app depending on the result of the request. We can use that state to structure our UI, based on the request. The state can be one of the following: `isLoading, isSuccessful, hasError`.

State is exposed as methods so we can use them in our UI with directives:

```html
  <p c-if="isLoading">Loading</p>

  <p c-if="hasError">An error occurred</p>

  <div c-if="isSuccessful">
    <!-- Display data -->
  </div>
```


### A complete requests example

Lets make an app, that makes a request to [reqres.in](https://reqres.in/), when the user clicks on a button
to get a list of users. Then display that list on our page.

Lets make the UI part of our app:

```html
<div id="app"></div>

<template id="appTemplate">
  <button id="get-data">Get Data</button>

  <p c-if="isLoading">Loading</p>

  <p c-if="hasError">{data.errorMessage}</p>

  <div c-if="isSuccessful">
    <ul>
      <li c-for="user in data.data">
        <span>{user.email} - {user.first_name} {user.last_name}</span>
      </li>
    </ul>
  </div>

</div>
```

And this is how we make a request, when the user cliks the button:

```js
var app = new AppBlock({

  el: document.getElementById('app'),
  template: getElementById('appTemplate'),

  data: {
    errorMessage: "",
    user: {}
  },

  events: {
    'click #get-data': function(e) {
      const app = this.Parent;
      app.fetchRequest('https://reqres.in/api/users/2',
        {
            method: 'GET',
        },
        {
            success(data) {
                console.log(data);
                app.data.user = data.data;
            },
            error(error) {
                app.data.errorMessage = error.message
            },
            finally() {console.log('finished')}
        }, 1000
    )
  }

})
```