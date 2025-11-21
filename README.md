# AppBlocks

> A tiny, fast, and lightweight JavaScript library for building micro applications

AppBlocks is designed to enhance web pages with self-contained micro applications. With a focus on simplicity and minimal footprint, AppBlocks provides everything needed to build interactive components while being ridiculously easy to integrate into any project.

## Why AppBlocks?

- **🪶 Lightweight**: Minimal bundle size with no heavy dependencies
- **⚡ Fast**: Efficient rendering with smart DOM diffing (Idiomorph)
- **🎯 Focused**: Built specifically for micro apps and widgets
- **📦 Zero Config**: Works out of the box with a simple script tag
- **🔧 Flexible**: Template-based with reactive data binding

Read more about the [AppBlocks use case](https://agtgreg.github.io/AppBlocks/#/whyappblocks).

## Quick Start

Here's a complete "Hello World" app in under 30 lines:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My First AppBlock</title>
</head>
<body>
  <!-- Container where our app will render -->
  <div id="app"></div>

  <!-- Template with our app's markup -->
  <template id="appTemplate">
    <h1>{data.message}</h1>
    <button id="change-btn">Change Message</button>
  </template>

  <!-- Load AppBlocks from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.1/dist/appblocks.min.js"></script>

  <!-- Initialize the app -->
  <script>
    var app = new AppBlock({
      el: document.getElementById('app'),
      template: document.getElementById('appTemplate'),
      data: {
        message: "Hello, AppBlocks!"
      },
      events: {
        'click #change-btn': function() {
          this.Parent.setData({
            message: "You clicked the button!"
          });
        }
      }
    });
  </script>
</body>
</html>
```

## Installation

### CDN (Recommended for Quick Start)

```html
<script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.1/dist/appblocks.min.js"></script>
```

### NPM

```bash
npm install appblocks
```

Then import in your JavaScript:

```javascript
import { AppBlock } from 'appblocks';
```

### Direct Download

Download the latest release and include it in your HTML:

```html
<script src="/path/to/appblocks.min.js"></script>
```

## Core Features

### 📊 Reactive Data Binding

```javascript
var app = new AppBlock({
  el: document.getElementById('app'),
  data: { count: 0 },
  // ...
});

// Update data and automatically re-render
app.setData({ count: 1 });
```

### 🎨 Template Directives

```html
<!-- Conditional rendering -->
<p c-if="data.isVisible">Now you see me</p>
<p c-ifnot="data.isVisible">Now you don't</p>

<!-- Loop rendering -->
<ul>
  <li c-for="item in data.items">{item.name}</li>
</ul>
```

### 🔄 Filters

```javascript
filters: {
  uppercase(app, value) {
    return value.toUpperCase();
  }
}
```

```html
<p>{data.name|uppercase}</p>
```

### 🎯 Event Handling

```javascript
events: {
  'click .btn': function(e, element) {
    this.Parent.setData({ clicked: true });
  },
  'submit form': function(e, element) {
    e.preventDefault();
    // Handle form submission
  }
}
```

### 🌐 Built-in HTTP Requests

```javascript
app.fetchRequest('https://api.example.com/data',
  { method: 'GET' },
  {
    success: (data) => app.setData({ items: data }),
    error: (err) => console.error(err)
  }
);
```

## Documentation

**📚 [Full Documentation](https://agtgreg.github.io/AppBlocks/#/)**

- [Getting Started Guide](https://agtgreg.github.io/AppBlocks/#/README)
- [Data Management](https://agtgreg.github.io/AppBlocks/#/data)
- [Directives](https://agtgreg.github.io/AppBlocks/#/directives)
- [Filters](https://agtgreg.github.io/AppBlocks/#/filters)
- [Methods](https://agtgreg.github.io/AppBlocks/#/methods)
- [Event Handling](https://agtgreg.github.io/AppBlocks/#/README?id=event-handling)
- [HTTP Requests](https://agtgreg.github.io/AppBlocks/#/requests)
- [API Reference](https://agtgreg.github.io/AppBlocks/#/api)

## Browser Support

AppBlocks works in all modern browsers that support ES6:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details