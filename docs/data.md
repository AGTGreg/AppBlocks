# Data Management

The `data` object is at the heart of every AppBlock. It stores all the information your app needs and automatically updates the UI when the data changes.

## The Basics

Data in AppBlocks is just a plain JavaScript object. You can structure it however you like, with the only rule being that `data` must be an object.

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    // Simple values
    message: "Hello!",
    count: 0,
    isVisible: true,

    // Arrays
    items: ["Apple", "Banana", "Cherry"],

    // Nested objects
    user: {
      name: "Alice",
      email: "alice@example.com",
      preferences: {
        theme: "dark",
        notifications: true
      }
    }
  }
});
```

## Accessing Data in Templates

### Simple Properties

Use placeholders with dot notation to access data:

```html
<template id="appTemplate">
  <h1>{data.message}</h1>
  <p>Count: {data.count}</p>
  <p c-if="data.isVisible">I am visible!</p>
</template>
```

### Nested Properties

Access nested data with multiple dots:

```html
<template id="appTemplate">
  <div>
    <h2>{data.user.name}</h2>
    <p>Email: {data.user.email}</p>
    <p>Theme: {data.user.preferences.theme}</p>
  </div>
</template>
```

### Array Access

Use bracket notation or index to access array elements:

```html
<template id="appTemplate">
  <!-- Access by index -->
  <p>First item: {data.items[0]}</p>
  <p>Second item: {data.items[1]}</p>

  <!-- Loop through all items -->
  <ul>
    <li c-for="item in data.items">{item}</li>
  </ul>
</template>
```

### Dynamic Property Access

Use bracket notation to access properties dynamically:

```js
var app = new AppBlock({
  data: {
    currentKey: 'name',
    user: {
      name: 'Bob',
      age: 30,
      city: 'NYC'
    },
    colors: ['red', 'green', 'blue']
  }
});
```

```html
<template id="appTemplate">
  <!-- Dynamic object property access -->
  <p>{data.user[data.currentKey]}</p>

  <!-- Can also use with arrays -->
  <p>{data.colors[0]}</p>
</template>
```

## Updating Data

AppBlocks provides two ways to update data: using `setData()` for automatic re-rendering, or direct updates followed by manual `render()`.

### Method 1: setData() (Recommended)

`setData()` updates the data and automatically triggers a re-render:

```js
app.setData(newData, replaceData)
```

**Parameters:**
- `newData` (Object): The data to update
- `replaceData` (Boolean, optional): If `true`, replaces all data. Default: `false` (merges with existing data)

#### Partial Updates (Default)

By default, `setData()` merges new data with existing data:

```js
var app = new AppBlock({
  data: {
    name: "Alice",
    age: 25,
    city: "NYC"
  }
});

// Update only age, keep name and city
app.setData({ age: 26 });

// Result: { name: "Alice", age: 26, city: "NYC" }
```

#### Complete Replacement

Pass `true` as the second parameter to replace all data:

```js
var app = new AppBlock({
  data: {
    name: "Alice",
    age: 25,
    city: "NYC"
  }
});

// Replace entire data object
app.setData({ score: 100 }, true);

// Result: { score: 100 }
// name, age, and city are gone!
```

### Method 2: Direct Updates + render()

For performance optimization or batch updates, you can update data directly and call `render()` when ready:

```js
var app = new AppBlock({
  data: {
    items: [],
    total: 0
  },

  methods: {
    addMultipleItems(app, newItems) {
      // Direct updates - no re-render yet
      app.data.items = app.data.items.concat(newItems);
      app.data.total = app.data.items.length;

      // Manually trigger render once
      app.render();
    }
  }
});
```

**When to use direct updates:**
- Making multiple related changes
- Performance-critical sections
- Updating data without immediate visual update

## Accessing Data in Methods

Methods receive the app instance as their first parameter, giving you access to data:

```js
var app = new AppBlock({
  data: {
    count: 0,
    history: []
  },

  methods: {
    // Access via app parameter
    increment(app) {
      var newCount = app.data.count + 1;
      app.setData({ count: newCount });
    },

    // Access via this.Parent
    addToHistory() {
      var entry = {
        count: this.Parent.data.count,
        timestamp: Date.now()
      };
      var newHistory = this.Parent.data.history.concat(entry);
      this.Parent.setData({ history: newHistory });
    },

    // Both patterns work - choose what's clearest
    reset(app) {
      app.setData({
        count: 0,
        history: []
      });
    }
  }
});
```

## Working with Arrays

### Adding Items

```js
methods: {
  addItem(app, newItem) {
    var updated = app.data.items.concat(newItem);
    app.setData({ items: updated });
  },

  // Or using spread operator
  addItemSpread(app, newItem) {
    app.setData({
      items: [...app.data.items, newItem]
    });
  }
}
```

### Removing Items

```js
methods: {
  removeItem(app, index) {
    var updated = app.data.items.filter(function(item, i) {
      return i !== index;
    });
    app.setData({ items: updated });
  },

  removeById(app, id) {
    var updated = app.data.items.filter(function(item) {
      return item.id !== id;
    });
    app.setData({ items: updated });
  }
}
```

### Updating Items

```js
methods: {
  updateItem(app, index, newValue) {
    var updated = app.data.items.map(function(item, i) {
      if (i === index) {
        return newValue;
      }
      return item;
    });
    app.setData({ items: updated });
  },

  toggleComplete(app, id) {
    var updated = app.data.items.map(function(item) {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    app.setData({ items: updated });
  }
}
```

## Working with Objects

### Updating Nested Properties

```js
var app = new AppBlock({
  data: {
    user: {
      name: "Alice",
      settings: {
        theme: "light",
        notifications: true
      }
    }
  },

  methods: {
    updateTheme(app, newTheme) {
      // Create new nested structure
      var updatedSettings = {
        ...app.data.user.settings,
        theme: newTheme
      };

      var updatedUser = {
        ...app.data.user,
        settings: updatedSettings
      };

      app.setData({ user: updatedUser });
    },

    // Or update directly and render
    toggleNotifications(app) {
      app.data.user.settings.notifications = !app.data.user.settings.notifications;
      app.render();
    }
  }
});
```

## Data Patterns and Best Practices

### 1. Initialize All Properties

Define all data properties upfront, even if empty:

```js
// Good
data: {
  users: [],
  selectedUser: null,
  isLoading: false,
  errorMessage: ''
}

// Avoid adding properties later
// app.data.newProperty = value; // Works but not ideal
```

### 2. Keep Data Flat When Possible

Flatter data structures are easier to work with:

```js
// Simpler
data: {
  userName: 'Alice',
  userAge: 25,
  userCity: 'NYC'
}

// More complex (use when it makes sense)
data: {
  user: {
    name: 'Alice',
    age: 25,
    city: 'NYC'
  }
}
```

### 3. Avoid Direct Mutations in Templates

Don't modify data in templates. Use methods instead:

```html
<!-- Bad: Don't do this -->
<button onclick="app.data.count++">Increment</button>

<!-- Good: Use events and methods -->
<button id="increment-btn">Increment</button>
```

```js
events: {
  'click #increment-btn': function() {
    this.Parent.setData({
      count: this.Parent.data.count + 1
    });
  }
}
```

### 4. Batch Related Updates

When updating multiple properties, do it in one `setData()` call:

```js
// Good - single render
app.setData({
  isLoading: false,
  data: responseData,
  error: null
});

// Less efficient - three renders
app.setData({ isLoading: false });
app.setData({ data: responseData });
app.setData({ error: null });
```

## Complete Example: Todo List

Here's a complete example demonstrating data management patterns:

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    todos: [
      { id: 1, text: 'Learn AppBlocks', done: false },
      { id: 2, text: 'Build an app', done: false }
    ],
    newTodoText: '',
    filter: 'all' // 'all', 'active', 'completed'
  },

  methods: {
    addTodo(app) {
      if (!app.data.newTodoText.trim()) return;

      var newTodo = {
        id: Date.now(),
        text: app.data.newTodoText,
        done: false
      };

      app.setData({
        todos: app.data.todos.concat(newTodo),
        newTodoText: ''
      });
    },

    toggleTodo(app, id) {
      var updated = app.data.todos.map(function(todo) {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });
      app.setData({ todos: updated });
    },

    removeTodo(app, id) {
      var updated = app.data.todos.filter(function(todo) {
        return todo.id !== id;
      });
      app.setData({ todos: updated });
    },

    getFilteredTodos(app) {
      if (app.data.filter === 'active') {
        return app.data.todos.filter(function(todo) { return !todo.done; });
      }
      if (app.data.filter === 'completed') {
        return app.data.todos.filter(function(todo) { return todo.done; });
      }
      return app.data.todos;
    }
  },

  events: {
    'click #add-btn': function() {
      this.Parent.methods.addTodo(this.Parent);
    },
    'input #new-todo': function(e, el) {
      this.Parent.setData({ newTodoText: el.value });
    },
    'click .toggle-btn': function(e, el) {
      var id = parseInt(el.dataset.id);
      this.Parent.methods.toggleTodo(this.Parent, id);
    },
    'click .remove-btn': function(e, el) {
      var id = parseInt(el.dataset.id);
      this.Parent.methods.removeTodo(this.Parent, id);
    },
    'click .filter-btn': function(e, el) {
      this.Parent.setData({ filter: el.dataset.filter });
    }
  }
});
```

```html
<template id="appTemplate">
  <div class="todo-app">
    <h1>My Todos</h1>

    <div class="add-todo">
      <input
        id="new-todo"
        type="text"
        placeholder="What needs to be done?"
        value="{data.newTodoText}">
      <button id="add-btn">Add</button>
    </div>

    <div class="filters">
      <button class="filter-btn" data-filter="all">All</button>
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="completed">Completed</button>
    </div>

    <ul class="todo-list">
      <li c-for="todo in getFilteredTodos()">
        <input
          type="checkbox"
          class="toggle-btn"
          data-id="{todo.id}"
          c-if="todo.done"
          checked>
        <input
          type="checkbox"
          class="toggle-btn"
          data-id="{todo.id}"
          c-ifnot="todo.done">
        <span class="todo-text">{todo.text}</span>
        <button class="remove-btn" data-id="{todo.id}">×</button>
      </li>
    </ul>

    <p c-if="getFilteredTodos().length == 0">No todos to display!</p>
  </div>
</template>
```

## Summary

- Data is a plain JavaScript object
- Access data in templates with `{data.property}`
- Update data with `app.setData()` for automatic re-rendering
- Use direct updates + `app.render()` for batch operations
- Access data in methods via `app.data` or `this.Parent.data`
- Keep data structure simple and initialize all properties
- Batch related updates for better performance

**Next:** Learn about [Filters](filters.md) to transform your data before displaying it.

