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


## Usage

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



## There's much more
Head over to the [Documentation](https://agtgreg.github.io/AppBlocks/#/).