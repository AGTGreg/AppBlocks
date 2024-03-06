# Introduction

AppBlocks is a tiny, fast and lightweight javascript library for building front-end apps.

It started as a personal challenge project and later evolved into the go to library that was used in an everyday basis to quickly enhance pages and web applications front-ends with small and maintainable apps.

The goal of AppBlocks is to be a small library that provide all the necessary functionality to develop front-end apps while beeing ridiculously easy to integrate in any project as a script tag, practical and small.

All the knowledge needed to master AppBlocks and start building front-end applications is here in a 10-15 minute read.


**[Documentation](https://agtgreg.github.io/AppBlocks/#/)**


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



## There's much more
Head over to the [Documentation](https://agtgreg.github.io/AppBlocks/#/).