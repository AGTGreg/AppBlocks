# Filters

Filters are functions that transform data before rendering it in templates. They're perfect for formatting values without cluttering your templates or data layer.

**Signature:** `filterName(self, value) { return transformedValue }`

## Basic Usage

Define filters in the `filters` object and use them in templates with the pipe (`|`) operator:

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    message: 'hello world',
  },

  filters: {
    uppercase(self, value) {
      return value.toUpperCase();
    },
  }
});
```

```html
<template id="appTemplate">
  <p>{data.message|uppercase}</p>
  <!-- Output: HELLO WORLD -->
</template>
```

> Notice the `self` parameter on every filter. The first parameter in filters and methods is your app's instance. You can name it however you want, like `self`, `app` etc. AppBlocks will pass your app's instance to the first parameter automatically when you call a method or filter from the template and you can use it inside your method/filter to access data and methods from your app (just like in the `afterTaxes` filter).
> *Python developers are familiar with this syntax already where you must pass `self`  on every method of your class. This has the same effect*

## Chaining Filters

Filters can be chained together, with the output of one becoming the input of the next:

```js
data: {
  price: 49.99,
  tax: 23
},
filters: {
  afterTaxes(self, value) {
    return value + (value * self.data.tax / 100);
  },
  currency(self, value) {
    return '$ ' + value.toFixed(2);
  }
}
```

```html
<template id="appTemplate">
  <p>Price with tax {data.tax}%: {data.price|afterTaxes|currency}</p>
  <!-- Output: Price with tax 23%: $ 61.49 -->
</template>
```

## Using Filters in Attributes

Filters work in any attribute, not just text content:

```html
<template id="appTemplate">
  <input
    type="text"
    class="{data.status|validationClass}"
    value="{data.inputValue|trim}">

  <div style="border: 5px solid {data.themeColor|hexColor}">
    <img src="{data.imageFileName|cdn}" alt="{data.imageName|capitalize}">
  </div>
</template>
```

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    imageName: "the doors",
    imageFileName: "TheDoorsTheDoorsalbumcover.jpg",
    inputValue: "   Hello World   ",
    themeColor: "grey",
  },
  filters: {
    validationClass(self, isValid) {
      return isValid ? 'input-success' : 'input-error';
    },

    cdn(self, url) {
      return 'https://upload.wikimedia.org/wikipedia/en/9/98/' + url;
    },

    capitalize(self, text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    hexColor(self, color) {
      var colors = { red: '#FF0000', blue: '#0000FF', green: '#00FF00', grey: '#808080' };
      return colors[color] || '#000000';
    },

    trim(self, value) {
      return value.trim();
    },
  }
});
```

## Common Filter Examples

### String Filters

```js
filters: {
  // Capitalize first letter
  capitalize(self, value) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  },

  // Title case (capitalize each word)
  titleCase(self, value) {
    return value.split(' ').map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  },

  // Truncate with ellipsis
  truncate(self, value) {
    var maxLength = 50;
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + '...';
  },

  // Pluralize
  pluralize(self, count) {
    return count === 1 ? 'item' : 'items';
  },

  // Slugify (URL-friendly)
  slugify(self, value) {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
```

### Number Filters

```js
filters: {
  // Format as currency
  currency(self, value) {
    return '$' + parseFloat(value).toFixed(2);
  },

  // Format with thousands separator
  number(self, value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Percentage
  percent(self, value) {
    return (value * 100).toFixed(1) + '%';
  },

  // File size
  fileSize(self, bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Round to decimal places
  round(self, value) {
    return Math.round(value * 100) / 100;
  }
}
```

### Date Filters

```js
filters: {
  // Format date
  formatDate(self, dateString) {
    var date = new Date(dateString);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  },

  // Relative time ("2 hours ago")
  timeAgo(self, dateString) {
    var seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    var intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (var key in intervals) {
      var interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return interval + ' ' + key + (interval === 1 ? '' : 's') + ' ago';
      }
    }
    return 'just now';
  },

  // Format time
  formatTime(self, dateString) {
    var date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
```

### Array Filters

```js
filters: {
  // Join array elements
  join(self, array) {
    return array.join(', ');
  },

  // Get array length
  count(self, array) {
    return array.length;
  },

  // Get first element
  first(self, array) {
    return array[0];
  },

  // Get last element
  last(self, array) {
    return array[array.length - 1];
  },

  // Sort array
  sort(self, array) {
    return array.slice().sort();
  }
}
```

```html
<template id="appTemplate">
  <p>Tags: {data.tags|join}</p>
  <!-- If data.tags = ['vue', 'react', 'angular'] -->
  <!-- Output: Tags: vue, react, angular -->

  <p>Total items: {data.items|count}</p>
  <!-- Output: Total items: 5 -->
</template>
```

## The `asHTML` Filter (Built-in)

By default, AppBlocks treats all data as plain text for security. To render HTML content, use the built-in `asHTML` filter:

```js
var app = new AppBlock({
  data: {
    htmlContent: '<p><strong>Bold</strong> and <em>italic</em> text</p>',
    userInput: '<script>alert("XSS")</script>Nice try!'
  }
});
```

```html
<template id="appTemplate">
  <!-- Without asHTML - renders as text -->
  <div>{data.htmlContent}</div>
  <!-- Output: <p><strong>Bold</strong> and <em>italic</em> text</p> -->

  <!-- With asHTML - renders as HTML -->
  <div>{data.htmlContent|asHTML}</div>
  <!-- Output: Bold and italic text (actual HTML rendering) -->
</template>
```

> ⚠️ **Security Warning:** Only use `asHTML` with trusted content. Never use it with user-generated content without proper sanitization, as it can expose your app to XSS attacks.

## Practical Examples

### Form Validation

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    fields: [
      { name: 'email', value: 'user@example.com', isValid: true },
      { name: 'password', value: '123', isValid: false },
      { name: 'username', value: 'johndoe', isValid: true }
    ]
  },

  filters: {
    validationClass(self, isValid) {
      return isValid ? 'field-valid' : 'field-invalid';
    },

    validationIcon(self, isValid) {
      return isValid ? '✓' : '✗';
    }
  }
});
```

```html
<style>
  .field-valid { border-color: green; background: #e8f5e9; }
  .field-invalid { border-color: red; background: #ffebee; }
</style>

<template id="appTemplate">
  <div c-for="field in data.fields">
    <label>{field.name}</label>
    <input
      type="text"
      class="{field.isValid|validationClass}"
      value="{field.value}">
    <span>{field.isValid|validationIcon}</span>
  </div>
</template>
```

### Product Listing

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    products: [
      { name: 'laptop', price: 999.99, inStock: true },
      { name: 'mouse', price: 24.50, inStock: false },
      { name: 'keyboard', price: 79.99, inStock: true }
    ]
  },

  filters: {
    currency(self, value) {
      return '$' + parseFloat(value).toFixed(2);
    },

    stockStatus(self, inStock) {
      return inStock ? 'In Stock' : 'Out of Stock';
    },

    stockClass(self, inStock) {
      return inStock ? 'status-available' : 'status-unavailable';
    },

    capitalize(self, value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
});
```

```html
<div id="app"></div>

<template id="appTemplate">
  <div class="products">
    <div class="product" c-for="product in data.products">
      <h3>{product.name|capitalize}</h3>
      <p class="price">{product.price|currency}</p>
      <p class="{product.inStock|stockClass}">
        {product.inStock|stockStatus}
      </p>
    </div>
  </div>
</template>
```

### Dashboard Statistics

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),
  data: {
    stats: {
      users: 12547,
      revenue: 245678.90,
      growth: 0.156,
      storageUsed: 45678901234
    }
  },

  filters: {
    number(self, value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    currency(self, value) {
      return '$' + parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    percent(self, value) {
      return (value * 100).toFixed(1) + '%';
    },

    fileSize(self, bytes) {
      if (bytes === 0) return '0 Bytes';
      var k = 1024;
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }
  }
});
```

```html
<div id="app"></div>

<template id="appTemplate">
  <div class="dashboard">
    <div class="stat">
      <h4>Total Users</h4>
      <p class="value">{data.stats.users|number}</p>
    </div>
    <div class="stat">
      <h4>Revenue</h4>
      <p class="value">{data.stats.revenue|currency}</p>
    </div>
    <div class="stat">
      <h4>Growth</h4>
      <p class="value">{data.stats.growth|percent}</p>
    </div>
    <div class="stat">
      <h4>Storage Used</h4>
      <p class="value">{data.stats.storageUsed|fileSize}</p>
    </div>
  </div>
</template>
```

## Best Practices

### 1. Keep Filters Pure

Filters should not modify app data or have side effects:

```js
// Good - pure function
filters: {
  uppercase(self, value) {
    return value.toUpperCase();
  }
}

// Bad - modifying app data
filters: {
  uppercaseBad(self, value) {
    self.data.lastFiltered = value; // Don't do this!
    return value.toUpperCase();
  }
}
```

### 2. Handle Edge Cases

Always handle `null`, `undefined`, and empty values:

```js
filters: {
  uppercase(self, value) {
    if (!value) return '';
    return value.toUpperCase();
  },

  currency(self, value) {
    var num = parseFloat(value);
    if (isNaN(num)) return '$0.00';
    return '$' + num.toFixed(2);
  }
}
```

### 3. Use Descriptive Names

Choose clear, self-documenting filter names:

```js
// Good
filters: {
  formatCurrency(self, value) { /* ... */ },
  truncateText(self, value) { /* ... */ },
  formatDate(self, value) { /* ... */ }
}

// Less clear
filters: {
  fmt(self, value) { /* ... */ },
  trunc(self, value) { /* ... */ },
  dt(self, value) { /* ... */ }
}
```

### 4. Chain for Reusability

Create small, focused filters that can be chained:

```js
filters: {
  trim(self, value) {
    return value.trim();
  },

  lowercase(self, value) {
    return value.toLowerCase();
  },

  stripHtml(self, value) {
    return value.replace(/<[^>]*>/g, '');
  }
}
```

```html
<!-- Chain them together -->
<p>{data.userInput|stripHtml|trim|lowercase}</p>
```

## Summary

- Filters transform data for display without modifying the source
- Use the pipe operator (`|`) to apply filters: `{value|filterName}`
- Chain multiple filters: `{value|filter1|filter2|filter3}`
- Filters work in text content and attributes
- The `asHTML` filter renders HTML (use with caution)
- Keep filters pure, handle edge cases, and use descriptive names

**Next:** Learn about [Directives](directives.md) to control template structure and rendering.