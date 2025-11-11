# Introduction

## Getting Started with AppBlocks

AppBlocks is a tiny, fast, and lightweight JavaScript library for building micro applications. It's designed to be used primarily as a script tag to enhance web pages with self-contained micro applications.

The goal of AppBlocks is to provide all the necessary ingredients to develop micro apps in websites while being ridiculously easy to integrate, practical, and small.

> **New to AppBlocks?** Read about the [AppBlocks use case](whyappblocks.md) to understand when and why you might want to use it.

## Installation

### Option 1: CDN (Quickest)

Add AppBlocks directly to your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.0/dist/appblocks.min.js"></script>
```

### Option 2: NPM

Install via npm for use with bundlers:

```bash
npm install appblocks
```

Then import in your JavaScript:

```javascript
import { AppBlock } from 'appblocks';
```

### Option 3: Direct Download

Download the latest version and include it in your HTML:

```html
<!-- Development version -->
<script src="/path/to/appblocks.umd.js"></script>

<!-- Minified production version -->
<script src="/path/to/appblocks.min.js"></script>
```

## Your First AppBlock

Let's build a simple interactive app step by step. We'll start with an empty HTML page:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first AppBlocks app</title>
  </head>
  <body>
    <!-- Load AppBlocks. -->
    <script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.0/dist/appblocks.min.js"></script>
    <script>
      // This is where we will write our AppBlock code
    </script>
  </body>
</html>
```

### Step 1: Create the Container and Template

An AppBlock needs two elements:
1. **Container** - Where the app will render
2. **Template** - What the app will display

Add these inside the `<body>`, before the script tags:

```html
<!-- Container where our app will render -->
<div id="app"></div>

<!-- Template containing our app's markup -->
<template id="appTemplate">
  <h1>{data.message}</h1>
  <p>You've been here {data.visits} times.</p>
  <button id="increment-btn">Visit Again</button>
</template>
```

> **Placeholders**: Notice the `{data.message}` and `{data.visits}` syntax? These are placeholders that will be replaced with actual data values.

### Step 2: Initialize Your AppBlock

Add this JavaScript inside the `<script>` tag at the bottom:

```html
<script>
  var app = new AppBlock({
    el: document.getElementById('app'),
    template: document.getElementById('appTemplate'),
    data: {
      message: "Welcome to AppBlocks!",
      visits: 0
    },
    events: {
      'click #increment-btn': function() {
        var currentVisits = this.Parent.data.visits;
        this.Parent.setData({ visits: currentVisits + 1 });
      }
    }
  });
</script>
```

### Step 3: See It in Action!

Reload the page and click the button. Watch the visit count increase automatically!

> **How it works**: When you call `setData()`, AppBlocks updates the data and automatically re-renders the interface to reflect the changes.

### Complete Example

Here's the full working code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My First AppBlock</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    #app { max-width: 400px; margin: 0 auto; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
  </style>
</head>
<body>
  <div id="app"></div>

  <template id="appTemplate">
    <h1>{data.message}</h1>
    <p>You've been here {data.visits} times.</p>
    <button id="increment-btn">Visit Again</button>
  </template>

  <script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.0/dist/appblocks.min.js"></script>
  <script>
    var app = new AppBlock({
      el: document.getElementById('app'),
      template: document.getElementById('appTemplate'),
      data: {
        message: "Welcome to AppBlocks!",
        visits: 0
      },
      events: {
        'click #increment-btn': function() {
          var currentVisits = this.Parent.data.visits;
          this.Parent.setData({ visits: currentVisits + 1 });
        }
      }
    });
  </script>
</body>
</html>
```

### Try It Yourself

Open your browser's console and experiment:

```javascript
// Update the message
app.setData({ message: "Hello from the console!" });

// Reset the visits
app.setData({ visits: 0 });

// Update multiple properties at once
app.setData({
  message: "AppBlocks is awesome!",
  visits: 100
});
```

## Next Steps

Now that you have your first AppBlock running, explore these core concepts:

- **[Data Management](data.md)** - Learn how to work with data effectively
- **[Filters](filters.md)** - Transform data before displaying it
- **[Directives](directives.md)** - Control element visibility with `if` conditionals and loops
- **[Methods](methods.md)** - Organize your application logic
- **[Event Handling](events.md)** - Respond to user interactions
- **[HTTP Requests](requests.md)** - Fetch data from APIs


## Core Concepts Overview

### Filters - Transform Your Data

Filters are functions that transform values before displaying them. They're perfect for formatting data without cluttering your templates.

**Example: filters**

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    name: 'john doe',
    price: 49.99,
    tax: 23,
    rawText: '   hello world   '
  },
  filters: {
    uppercase(self, value) {
      return value.toUpperCase();
    },
    afterTaxes(self, value) {
      return value + (value * self.data.tax / 100);
    },
    currency(self, value) {
      return '$ ' + value.toFixed(2);
    }
  }
});
```

**Usage in templates:**

```html
<template id="appTemplate">
  <p>Welcome, {data.name|uppercase}!</p>
  <p>Total: {data.price|currency}</p>
  <!-- Chain multiple filters -->
  <p>With tax {data.tax}%: {data.price|afterTaxes|currency}</p>
</template>
```

**Output:**
```
Welcome, JOHN DOE!
Total: $ 49.99
With tax 23%: $ 61.49
```

> Notice the `self` parameter on every filter. The first parameter in filters and methods is your app's instance. You can name it however you want, like `self`, `app` etc. AppBlocks will pass your app's instance to the first parameter automatically when you call a method or filter from the template and you can use it inside your method/filter to access data and methods from your app (just like in the `afterTaxes` filter).

[📖 Read more about Filters](filters.md)

### Directives - Control Your Template

Directives are special attributes that control element visibility and behavior. They make it easy to build dynamic interfaces.

#### c-if & c-ifnot - Conditional Rendering

Show or hide elements based on conditions:

```js
var app = new AppBlock({
  data: {
    isLoggedIn: false,
    age: 25,
    score: 85
  }
});
```

```html
<template id="appTemplate">
  <!-- Simple boolean check -->
  <p c-if="data.isLoggedIn">Welcome back!</p>
  <p c-ifnot="data.isLoggedIn">Please log in</p>

  <!-- Comparison operators -->
  <p c-if="data.age >= 18">You can vote</p>
  <p c-if="data.score > 60">You passed!</p>

  <!-- Complex expressions -->
  <p c-if="data.age >= 18 && data.score > 60">Congratulations, adult graduate!</p>
</template>
```

[📖 Read more about Conditional Rendering](directives.md#c-if)

#### c-for - Loop Rendering

Display lists and iterate over data:

```js
var app = new AppBlock({
  data: {
    users: [
      { name: 'Alice', role: 'Admin' },
      { name: 'Bob', role: 'User' },
      { name: 'Charlie', role: 'User' }
    ],
    settings: {
      theme: 'dark',
      language: 'en',
      notifications: true
    }
  }
});
```

**Arrays:**
```html
<ul>
  <li c-for="user in data.users">
    {user.name} - {user.role}
  </li>
</ul>
```

**Output:**
```
• Alice - Admin
• Bob - User
• Charlie - User
```

**Objects:**
```html
<div c-for="key, value in data.settings">
  <strong>{key}:</strong> {value}
</div>
```

**Output:**
```
theme: dark
language: en
notifications: true
```

[📖 Read more about Directives](directives.md)


### Event Handling - Respond to User Actions

AppBlocks makes event handling clean and organized. Define all your event listeners in the `events` object:

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    count: 0,
    message: ''
  },
  events: {
    'click #increment': function(e, element) {
      this.Parent.setData({
        count: this.Parent.data.count + 1
      });
    },
    'click #decrement': function(e, element) {
      this.Parent.setData({
        count: this.Parent.data.count - 1
      });
    },
    'input #message-input': function(e, element) {
      this.Parent.setData({
        message: element.value
      });
    },
    // Event delegation with complex selectors
    'click .todo-list li .delete-btn': function(e, element) {
      // Handle delete button clicks on todo items
    }
  }
});
```

```html
<template id="appTemplate">
  <div>
    <p>Count: {data.count}</p>
    <button id="increment">+</button>
    <button id="decrement">-</button>
  </div>

  <div>
    <input id="message-input" type="text" placeholder="Type something...">
    <p>You typed: {data.message}</p>
  </div>
</template>
```

**Event format:** `"eventName selector"`

The selector can include spaces and use descendant combinators for complex element targeting.

[📖 Read more about Event Handling](api.md#events-object)


### Methods - Organize Your Logic

Methods are where your application logic lives. They keep your code DRY (Don't Repeat Yourself) and reusable.

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    todos: [],
    newTodo: ''
  },

  methods: {
    addTodo(app) {
      if (app.data.newTodo.trim()) {
        var updatedTodos = app.data.todos.concat({
          id: Date.now(),
          text: app.data.newTodo,
          done: false
        });
        app.setData({
          todos: updatedTodos,
          newTodo: ''
        });
      }
    },

    removeTodo(app, id) {
      var updatedTodos = app.data.todos.filter(function(todo) {
        return todo.id !== id;
      });
      app.setData({ todos: updatedTodos });
    },

    toggleTodo(app, id) {
      var updatedTodos = app.data.todos.map(function(todo) {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });
      app.setData({ todos: updatedTodos });
    }
  },

  events: {
    'click #add-btn': function() {
      this.Parent.methods.addTodo(this.Parent);
    },
    'click .remove-btn': function(e, element) {
      var id = parseInt(element.dataset.id);
      this.Parent.methods.removeTodo(this.Parent, id);
    }
  }
});
```

**Calling methods:**
- From events: `this.Parent.methods.methodName(this.Parent, arg1, arg2)`
- From templates (c-if): `methodName(arg1, arg2)` (app instance auto-injected)
- From placeholders: `{methodName(arg1, arg2)}` (app instance auto-injected)

[📖 Read more about Methods](methods.md)

### HTTP Requests - Fetch Data from APIs

AppBlocks provides built-in methods for making HTTP requests with automatic state management. You can use either `fetch` or Axios.

#### Using fetchRequest

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    users: [],
    errorMessage: ''
  },

  events: {
    'click #load-users': function() {
      var app = this.Parent;

      app.fetchRequest(
        'https://jsonplaceholder.typicode.com/users',
        { method: 'GET' },
        {
          success: function(data) {
            app.setData({ users: data });
          },
          error: function(err) {
            app.setData({ errorMessage: err.message });
          },
          finally: function() {
            console.log('Request completed');
          }
        }
      );
    }
  }
});
```

#### Template with Loading States

```html
<template id="appTemplate">
  <button id="load-users">Load Users</button>

  <!-- Loading state -->
  <p c-if="isLoading()">Loading users...</p>

  <!-- Error state -->
  <div c-if="hasError()">
    <p style="color: red;">Error: {data.errorMessage}</p>
  </div>

  <!-- Success state -->
  <div c-if="isSuccessful()">
    <h2>Users ({data.users.length})</h2>
    <ul>
      <li c-for="user in data.users">
        {user.name} - {user.email}
      </li>
    </ul>
  </div>
</template>
```

**Built-in state methods:**
- `isLoading()` - Returns `true` while request is in progress
- `isSuccessful()` - Returns `true` when request succeeds
- `hasError()` - Returns `true` when request fails

[📖 Read more about Requests](requests.md)

## What's Next?

You now have a solid understanding of AppBlocks basics! Here are some next steps:

### Deep Dive into Features

- **[Data Management](data.md)** - Learn `setData()`, direct updates, and data patterns
- **[Filters](filters.md)** - Create custom filters and chain transformations
- **[Directives](directives.md)** - Master `c-if`, `c-for`, and custom directives
- **[Methods](methods.md)** - Build reusable application logic
- **[HTTP Requests](requests.md)** - Work with APIs using fetch and Axios
- **[Utilities](utils.md)** - Helper functions for DOM manipulation
- **[API Reference](api.md)** - Complete API documentation

### Advanced Topics

- Custom placeholder delimiters
- Expression evaluation with built-ins
- Render engine options (Idiomorph vs plain)
- Custom directives and filters
- Performance optimization

### Examples

Check out practical examples and common patterns:
- Todo List Application
- Form Validation
- Search with Debounce
- Data Tables
- Real-time Updates

Happy coding with AppBlocks! 🚀