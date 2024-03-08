# Introduction

AppBlocks is a tiny, fast and lightweight javascript library for building micro apps. It is designed to be used primarily as a script tag to enhance web pages with micro applications.

AppBlocks started as a personal challenge project and later evolved into the go to library for me and my team that was used on an everyday basis to quickly enhance websites with small and self-contained apps.

The goal of AppBlocks is to be a small library that provides all the necessary ingredients to develop micro apps in websites while being ridiculously easy to integrate in any project, practical and small.

All the knowledge needed to master AppBlocks and start building front-end applications is here in a 10-15 minute read.

Read about the [AppBlocks use case](https://agtgreg.github.io/AppBlocks/#/whyappblocks).


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