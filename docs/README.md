# Introduction

AppBlocks is a tiny javascript library for building micro apps for the front-end.

It was created to cover the need of enhancing pages and web applications front-ends with small and maintainable 
applications fast and easy without overhead.

The main goals of AppBlocks is to provide all the necessary functionality for developing front-end apps while beeing
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
<script src="https://cdn.jsdelivr.net/npm/appblocks@1.2.3/dist/appblocks.min.js"></script>
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

A more efficient way for creating our Apps would be to have all our content inside a template element and tell
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

This is the recommended way for creating our Apps but in order to keep our snippets short and simple,
we will use the first method for the rest of the documentation.


## Methods

In the example above we get the message directly from our data. But what if we wanted to edit that message before we 
show it to the world? Lets say we want to convert it to uppercase letters.

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
    message(thisApp) {
      return thisApp.data.message.toUpperCase();
    }
  }

})
```

Now all that needs to be done is to call that method inside our element:

```html
<div id="app">
  {message}
</div>
```

> HELLO WORLD!

Note that we don't need to type `methods.message` to access the method. In AppBlocks methods are first class citizens.

We can call methods from placeholders, attributes and even directives (As you'll see later on).
The `methods` object is the right place to put all of our application's logic. From processing data to 
anything you would write a function for.

Of course methods get updated along with our data. Go ahead and open your browser's console again and type
`app.setData({message: "this is uppercase"})`. You'll see that our message is displayed in uppercase
because it went through our method before showing up in our element.

!>  All methods take one optional parameter. We can use that parameter to get access to our App's instance from within
    our method. It is important to remember to include it as the first parameter when calling a method from anywhere 
    in our App:
    ```
    thisApp.methods.myMethod(thisApp, paramer1, parameter2, ...);
    ```

You can read more about methods [here](methods.md)

## Conditional rendering

It is very easy to control the structure of our app with **if** and **for** directives. We add these 
directives as attributes to the elements we want to control.

### c-if

```html
<div id="app">
  <span c-if="data.seen">Now you see me</span>
</div>
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

`c-if` directives can also work with 
[Comparison operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators) 
and evaluate **numbers** and **booleans**. For instance we could do this and it would work as expected:
```html
<div id="app">
  <span c-if="data.seen == true">Now you see me</span>
</div>
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
<div id="app">
  <span c-if="showSpan">Now you see me</span>
</div>
```

### c-ifnot

This the opposite of `c-if`. Think of it as writing if ... else. But in our case this is more verbose so it is 
easier to explain our logic inside our element. Heres a quick example:

```html
<div id="app">
  <span c-if="showSpan">Now you see me</span>
  <span c-ifnot="showSpan">Seen is false</span>
</div>
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
<div id="app">
  <ul>
    <li c-for="item in data.grosseryList"> {item.title} </li>
  </ul>
</div>
```
> - Milk
> - Tomatoes
> - Orange juice


### Making your own directives

If the directives build into AppBlocks don't cover your case you can allways make your own custom directives.

Directives are functions that return `true` or `false`. If it returns `true`, AppBlocks will show the element
that has that directive, if it returns `false`, AppBlock will discard it and the element will not show up.

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

?> Note that we have to return `true` in order for our element to show up. Otherwise AppBlocks would have discarded it.


## Event handling

AppBlocks makes it easy for us to handle events while keeping everything nice and clean. Just like `methods`
belong in the methods object, events follows along with the same principle. So, as you might expect, `events` belong
in the creatively named events object:

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
that will be executed when the event is triggered. AppBlocks supports all of the available events an element could
trigger. 

Let's create an app where the user can toggle an element with a click of a button:

```html
<div id="app">
  <p c-if="data.seen">Now you see me</p>
  <button id="message-toggler">Toggle message</button>
</div>
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

If you plan to toggle the message from multiple elements, you could use `methods` to make things even 
cleaner and DRY:

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

A key concept in AppBlocks, is to cover the most common use cases of a front-end micro app. One of those use cases is
to be able to make requests. 

AppBlocks makes use of the awesome [Axios](https://github.com/axios/axios) library to do that. AppBlocks exposes the
Axios API and takes care of the state and data management of our micro apps.

!> Axios is not included by default so you have to include it if you want to use the request feature.

### Usage

To make use of the Requests featute, we must first include the Axios library in our document:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

Making requests is simple. First we can add a basic configuration that axios will use on every request. This is
optional:

```js
var app = new AppBlock({
  ...
  axiosConfig: { 
    url: 'https://example.com'
  }
  ...
})
```

This config, tells axios that every request will be made at `https://example.com`

Head over to the [Axios documentation](https://github.com/axios/axios) to see all the available configuration options.

Then we can make the request, specifying only the method or the parameters: 

```js
App.request({method: 'get'},
  {
    success(response) { console.log(response); },
    error(error) { console.log(error); },
    done() { alert('Request is finished'); }
  },
  replaceData = false  // Update (don't replace) our data when the request is finished.
)
```

> We can mutate the response data inside the `success` callback and pass it to our app before it renders. To do that we
> just need to return the altered response object:
> ```js
> success(response) {
>   response.data = {message: "The response was a Success!"}
>   return response;
>  }
> ```
> Be careful though, AppBlocks expects to find a `data` object inside the response. So be sure that whatever your
> callback returns has a data object inside.

### State

AppBlocks will update the state of our app depending on the result of the request. We can use that state to structure
our UI, based on the request. The state can be one of the following: `isLoading, isSuccessful, hasError`.

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
<div id="app">
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

  axiosConfig: { 
    url: 'https://reqres.in/api/users'
  },

  data: {
    errorMessage: ""
  },

  events: {
    'click #get-data': function(e) {
      const app = this.Parent;

      app.request({
        method: 'get',
        params: {delay: 1}  // Delay the request so that we have a chance to see the Loading message
      },
      {
        error(error) { app.data.errorMessage = error.message }
      },
      replaceData = false
      )
    }
  }

})
```