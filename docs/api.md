# Quick start

# Installation

Download and include with a script tag in your document's head:

```html
<script src="/ajax-component.min.js"></script>
```

or alternatively you can use the **CDN version**:
```html
<script src="https://cdn.jsdelivr.net/ajax-component.min.js"></script>
```

# Usage

```html
<div id="app">
  {message}
</div>
```

```js
var app = new AjaxComponent({
  el: '#app',
  data: {
    message: 'Hello world!'
  }
})
```