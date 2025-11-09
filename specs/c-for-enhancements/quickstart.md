# Quick Start: c-for Object Iteration

**Feature**: Iterate over objects and arrays with the `c-for` directive
**Version**: 2.1.0+

## Basic Usage

### Iterating Over Arrays (Existing)

```html
<template id="myTemplate">
  <ul>
    <li c-for="item in data.items">
      {item}
    </li>
  </ul>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    items: ['Apple', 'Banana', 'Cherry']
  }
});
```

**Output**:
```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```

### Iterating Over Objects (New)

```html
<template id="myTemplate">
  <ul>
    <li c-for="key, value in data.settings">
      <strong>{key}:</strong> {value}
    </li>
  </ul>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    settings: {
      theme: 'dark',
      language: 'en',
      notifications: true
    }
  }
});
```

**Output**:
```html
<ul>
  <li><strong>theme:</strong> dark</li>
  <li><strong>language:</strong> en</li>
  <li><strong>notifications:</strong> true</li>
</ul>
```

## Syntax Patterns

### Single Pointer (Value Only)

Use when you only need the value, not the key:

```html
<!-- Works with arrays -->
<li c-for="item in data.fruits">{item}</li>

<!-- Works with objects (keys ignored) -->
<li c-for="value in data.config">{value}</li>
```

### Dual Pointer (Key and Value)

Use with objects to access both keys and values:

```html
<!-- Object iteration -->
<div c-for="key, value in data.settings">
  {key}: {value}
</div>

<!-- Key names can be descriptive -->
<div c-for="userId, profile in data.users">
  User {userId} - {profile.name}
</div>
```

## Method Calls

### Array from Method

```html
<template id="myTemplate">
  <li c-for="task in getActiveTasks()">
    {task.title}
  </li>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    tasks: [
      { title: 'Write docs', done: false },
      { title: 'Fix bug', done: true },
      { title: 'Review PR', done: false }
    ]
  },
  methods: {
    getActiveTasks(app) {
      return app.data.tasks.filter(task => !task.done);
    }
  }
});
```

**Output**:
```html
<li>Write docs</li>
<li>Review PR</li>
```

### Object from Method

```html
<template id="myTemplate">
  <div c-for="stat, value in getStats()">
    <span class="label">{stat}:</span>
    <span class="value">{value}</span>
  </div>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    users: 150,
    posts: 523,
    comments: 1024
  },
  methods: {
    getStats(app) {
      return {
        'Total Users': app.data.users,
        'Total Posts': app.data.posts,
        'Total Comments': app.data.comments,
        'Avg Comments/Post': Math.round(app.data.comments / app.data.posts)
      };
    }
  }
});
```

## Nested Iteration

### Array of Objects

```html
<template id="myTemplate">
  <div c-for="user in data.users">
    <h3>{user.name}</h3>
    <p>Email: {user.email}</p>
  </div>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    users: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' }
    ]
  }
});
```

### Object of Arrays

```html
<template id="myTemplate">
  <div c-for="category, products in data.catalog">
    <h2>{category}</h2>
    <ul>
      <li c-for="product in products">
        {product.name} - ${product.price}
      </li>
    </ul>
  </div>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    catalog: {
      Electronics: [
        { name: 'Laptop', price: 999 },
        { name: 'Mouse', price: 25 }
      ],
      Books: [
        { name: 'JavaScript Guide', price: 35 },
        { name: 'CSS Tricks', price: 28 }
      ]
    }
  }
});
```

**Output**:
```html
<div>
  <h2>Electronics</h2>
  <ul>
    <li>Laptop - $999</li>
    <li>Mouse - $25</li>
  </ul>
</div>
<div>
  <h2>Books</h2>
  <ul>
    <li>JavaScript Guide - $35</li>
    <li>CSS Tricks - $28</li>
  </ul>
</div>
```

### Nested Objects

```html
<template id="myTemplate">
  <div c-for="dept, employees in data.company">
    <h2>{dept} Department</h2>
    <div c-for="empId, employee in employees">
      <p>ID: {empId} - {employee.name} ({employee.role})</p>
    </div>
  </div>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    company: {
      Engineering: {
        E001: { name: 'Alice', role: 'Senior Dev' },
        E002: { name: 'Bob', role: 'Lead Engineer' }
      },
      Marketing: {
        M001: { name: 'Carol', role: 'Manager' }
      }
    }
  }
});
```

## Filters with c-for

### Filter Values

```html
<template id="myTemplate">
  <li c-for="key, value in data.settings">
    {key}: {value|uppercase}
  </li>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('myTemplate'),
  data: {
    settings: {
      theme: 'dark',
      language: 'english'
    }
  },
  filters: {
    uppercase(app, value) {
      return String(value).toUpperCase();
    }
  }
});
```

**Output**:
```html
<li>theme: DARK</li>
<li>language: ENGLISH</li>
```

### Filter Keys

```html
<li c-for="key, value in data.config">
  {key|titleCase}: {value}
</li>
```

## Common Patterns

### Configuration Display

```html
<template id="configTemplate">
  <table>
    <tr c-for="setting, value in data.config">
      <td>{setting}</td>
      <td>{value}</td>
    </tr>
  </table>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('configTemplate'),
  data: {
    config: {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      debug: false
    }
  }
});
```

### Statistics Dashboard

```html
<template id="statsTemplate">
  <div class="stats-grid">
    <div c-for="metric, count in data.metrics" class="stat-card">
      <h3>{metric|titleCase}</h3>
      <p class="count">{count}</p>
    </div>
  </div>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('statsTemplate'),
  data: {
    metrics: {
      users: 1543,
      sessions: 342,
      pageviews: 8234,
      errors: 12
    }
  },
  filters: {
    titleCase(app, str) {
      return str.replace(/_/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
    }
  }
});
```

### User Preferences

```html
<template id="prefsTemplate">
  <form>
    <div c-for="pref, value in data.preferences">
      <label>
        <input type="checkbox" checked="{value}">
        {pref|humanize}
      </label>
    </div>
  </form>
</template>
```

```javascript
const app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('prefsTemplate'),
  data: {
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      darkMode: true
    }
  },
  filters: {
    humanize(app, str) {
      return str.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
    }
  }
});
```

## Edge Cases

### Empty Objects

```html
<li c-for="key, value in data.empty">
  This won't render
</li>
```

```javascript
data: {
  empty: {}
}
// Result: No <li> elements rendered
```

### Null or Undefined

```html
<li c-for="key, value in data.missing">
  This won't render
</li>
```

```javascript
data: {
  missing: null  // or undefined
}
// Result: No <li> elements rendered, error logged if debug enabled
```

### Objects with Falsy Values

```html
<li c-for="key, value in data.settings">
  {key}: {value}
</li>
```

```javascript
data: {
  settings: {
    count: 0,
    name: '',
    enabled: false,
    data: null
  }
}
// Result: All properties are iterated, including falsy values
// count: 0
// name:
// enabled: false
// data: null
```

## Migration Guide

### Before (Manual Object Conversion)

```javascript
// Old approach: Convert object to array
methods: {
  getSettingsArray(app) {
    const settings = app.data.settings;
    return Object.keys(settings).map(key => ({
      key: key,
      value: settings[key]
    }));
  }
}
```

```html
<li c-for="item in getSettingsArray()">
  {item.key}: {item.value}
</li>
```

### After (Direct Object Iteration)

```html
<!-- Much simpler! -->
<li c-for="key, value in data.settings">
  {key}: {value}
</li>
```

## Tips & Best Practices

### 1. Use Descriptive Pointer Names

```html
<!-- Good -->
<div c-for="userId, profile in data.users">

<!-- Avoid -->
<div c-for="k, v in data.users">
```

### 2. Key Comes First

By convention, put the key pointer before the value pointer:

```html
<!-- Recommended -->
<div c-for="key, value in data.obj">

<!-- Confusing -->
<div c-for="value, key in data.obj">
```

### 3. Single Pointer for Value-Only

If you don't need the key, use single pointer:

```html
<!-- Good - only need values -->
<li c-for="color in data.palette">{color}</li>

<!-- Unnecessary -->
<li c-for="key, color in data.palette">{color}</li>
```

### 4. Combine with c-if

```html
<div c-for="key, value in data.settings" c-if="value">
  {key}: {value}
</div>
<!-- Only renders settings with truthy values -->
```

## Browser Support

Object iteration uses `Object.entries()` which is supported in:

- Chrome 54+
- Firefox 47+
- Safari 10.1+
- Edge 14+

All modern browsers support this feature.

## See Also

- [Directives Documentation](../docs/directives.md)
- [Method Calls](../docs/methods.md)
- [Filters](../docs/filters.md)
- [Data Management](../docs/data.md)

---

**Quick Start Complete**: ✅
Ready to use object iteration in your AppBlocks apps!
