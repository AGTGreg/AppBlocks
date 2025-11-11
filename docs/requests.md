# HTTP Requests

AppBlocks provides built-in methods for making HTTP requests with automatic state management. Whether you're using native `fetch` or Axios, AppBlocks handles loading states, success, and error conditions for you.

## Overview

AppBlocks offers two request methods:

1. **fetchRequest** - Uses native browser `fetch` API (no dependencies)
2. **axiosRequest** - Uses Axios library (must be included separately)

Both methods:
- Automatically manage loading, success, and error states
- Support callbacks for different stages of the request
- Allow optional delays for throttling
- Work seamlessly with AppBlocks' reactive rendering

## fetchRequest

Use the browser's native Fetch API for HTTP requests.

### Syntax

```js
app.fetchRequest(url, options, callbacks, delay)
```

**Parameters:**
- `url` (String): The URL to fetch
- `options` (Object): Fetch options (method, headers, body, etc.)
- `callbacks` (Object): Success, error, and finally callbacks
- `delay` (Number, optional): Delay in milliseconds before making the request

### Basic Example

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    users: [],
    errorMessage: ''
  },

  methods: {
    loadUsers(self) {
      self.fetchRequest(
        'https://jsonplaceholder.typicode.com/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          success: function(data) {
            self.setData({ users: data });
          },
          error: function(err) {
            self.setData({ errorMessage: err.message });
          },
          finally: function() {
            console.log('Request completed');
          }
        }
      );
    }
  },

  events: {
    'click #load-btn': function() {
      this.Parent.methods.loadUsers(this.Parent);
    }
  }
});
```

```html
<template id="appTemplate">
  <button id="load-btn">Load Users</button>

  <div c-if="isLoading()">
    <p>Loading users...</p>
  </div>

  <div c-if="hasError()">
    <p style="color: red;">Error: {data.errorMessage}</p>
  </div>

  <div c-if="isSuccessful()">
    <h2>Users</h2>
    <ul>
      <li c-for="user in data.users">
        {user.name} ({user.email})
      </li>
    </ul>
  </div>
</template>
```

### POST Request Example

```js
methods: {
  createUser(self, userData) {
    self.fetchRequest(
      'https://jsonplaceholder.typicode.com/users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      },
      {
        success: function(data) {
          console.log('Created user:', data);
          var updatedUsers = self.data.users.concat(data);
          self.setData({ users: updatedUsers });
        },
        error: function(err) {
          self.setData({ errorMessage: 'Failed to create user: ' + err.message });
        },
        finally: function() {
          console.log('Create user request completed');
        }
      }
    );
  }
},

events: {
  'click #create-btn': function() {
    var newUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    this.Parent.methods.createUser(this.Parent, newUser);
  }
}
```

### Request with Delay (Throttling)

Useful for implementing debounce or rate limiting:

```js
events: {
  'input #search-input': function(e, element) {
    var app = this.Parent;
    var query = element.value;

    // Wait 300ms before making the request
    app.fetchRequest(
      'https://api.example.com/search?q=' + encodeURIComponent(query),
      { method: 'GET' },
      {
        success: function(data) {
          app.setData({ searchResults: data });
        },
        error: function(err) {
          console.error('Search failed:', err);
        }
      },
      300 // 300ms delay
    );
  }
}
```

## axiosRequest

Use Axios for more advanced HTTP features (interceptors, automatic JSON transformation, etc.).

> **Note:** You must include the Axios library in your HTML before using `axiosRequest`:
> ```html
> <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
> ```

### Syntax

```js
app.axiosRequest(config, callbacks, delay)
```

**Parameters:**
- `config` (Object): Axios request configuration
- `callbacks` (Object): Success, error, and finally callbacks
- `delay` (Number, optional): Delay in milliseconds before making the request

### Basic Example

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    posts: [],
    errorMessage: ''
  },

  methods: {
    loadPosts(self) {
      self.axiosRequest(
        {
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: 'GET',
          params: {
            _limit: 10
          }
        },
        {
          success: function(response) {
            self.setData({ posts: response.data });
          },
          error: function(error) {
            var message = error.response
              ? error.response.data.message
              : error.message;
            self.setData({ errorMessage: message });
          },
          finally: function() {
            console.log('Posts request completed');
          }
        }
      );
    }
  }
});
```

### POST with Axios

```js
methods: {
  createPost(self, postData) {
    self.axiosRequest(
      {
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        data: postData,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      {
        success: function(response) {
          console.log('Created post:', response.data);
          var updatedPosts = app.data.posts.concat(response.data);
          self.setData({ posts: updatedPosts });
        },
        error: function(error) {
          self.setData({
            errorMessage: 'Failed to create post: ' + error.message
          });
        }
      }
    );
  }
}
```

## Request State Management

AppBlocks automatically manages three state flags during requests:

### Built-in State Methods

- **isLoading()** - Returns `true` while a request is in progress
- **isSuccessful()** - Returns `true` after a successful request
- **hasError()** - Returns `true` after a failed request

Use these methods in your templates to show appropriate UI states:

```html
<template id="appTemplate">
  <!-- Loading state -->
  <div c-if="isLoading()">
    <div class="spinner"></div>
    <p>Loading data...</p>
  </div>

  <!-- Error state -->
  <div c-if="hasError()">
    <div class="error-message">
      <h3>Oops! Something went wrong</h3>
      <p>{data.errorMessage}</p>
      <button id="retry-btn">Try Again</button>
    </div>
  </div>

  <!-- Success state -->
  <div c-if="isSuccessful()">
    <h2>Data loaded successfully!</h2>
    <div c-for="item in data.items">
      <p>{item.title}</p>
    </div>
  </div>

  <!-- Initial state (before any request) -->
  <div c-if="!isLoading() && !isSuccessful() && !hasError()">
    <p>Click the button to load data</p>
    <button id="load-btn">Load Data</button>
  </div>
</template>
```

### Manual State Reset

You can manually reset the state using `resetState()`:

```js
methods: {
  retry(self) {
    self.resetState(); // Clear loading, success, error flags
    self.methods.loadData(self);
  }
}
```

## Complete Examples

### Example 1: User Directory with Search

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    users: [],
    searchQuery: '',
    errorMessage: ''
  },

  methods: {
    loadUsers(self) {
      self.fetchRequest(
        'https://jsonplaceholder.typicode.com/users',
        { method: 'GET' },
        {
          success: function(data) {
            self.setData({ users: data });
          },
          error: function(err) {
            self.setData({ errorMessage: 'Failed to load users: ' + err.message });
          }
        }
      );
    },

    searchUsers(self) {
      var query = self.data.searchQuery.toLowerCase();
      return self.data.users.filter(function(user) {
        return user.name.toLowerCase().includes(query) ||
               user.email.toLowerCase().includes(query);
      });
    }
  },

  events: {
    'click #load-users-btn': function() {
      this.Parent.methods.loadUsers(this.Parent);
    },
    'input #search-input': function(e, element) {
      this.Parent.setData({ searchQuery: element.value });
    }
  }
});
```

```html
<template id="appTemplate">
  <div class="user-directory">
    <h1>User Directory</h1>

    <button id="load-users-btn" c-ifnot="isSuccessful()">
      Load Users
    </button>

    <div c-if="isLoading()">
      <p>⏳ Loading users...</p>
    </div>

    <div c-if="hasError()">
      <p style="color: red;">❌ {data.errorMessage}</p>
    </div>

    <div c-if="isSuccessful()">
      <input
        id="search-input"
        type="text"
        placeholder="Search users..."
        value="{data.searchQuery}">

      <div class="user-list">
        <div class="user-card" c-for="user in searchUsers()">
          <h3>{user.name}</h3>
          <p>📧 {user.email}</p>
          <p>📞 {user.phone}</p>
          <p>🏢 {user.company.name}</p>
        </div>
      </div>

      <p c-if="searchUsers().length == 0">
        No users found matching "{data.searchQuery}"
      </p>
    </div>
  </div>
</template>
```

### Example 2: Form Submission

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    formData: {
      title: '',
      body: ''
    },
    submittedPost: null,
    errorMessage: ''
  },

  methods: {
    submitForm(self) {
      if (!self.data.formData.title || !self.data.formData.body) {
        self.setData({ errorMessage: 'Please fill in all fields' });
        return;
      }

      self.fetchRequest(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: self.data.formData.title,
            body: self.data.formData.body,
            userId: 1
          })
        },
        {
          success: function(data) {
            self.setData({
              submittedPost: data,
              formData: { title: '', body: '' },
              errorMessage: ''
            });
          },
          error: function(err) {
            self.setData({ errorMessage: 'Submission failed: ' + err.message });
          }
        }
      );
    }
  },

  events: {
    'submit #post-form': function(e) {
      e.preventDefault();
      this.Parent.methods.submitForm(this.Parent);
    },
    'input #title-input': function(e, element) {
      var updated = { ...this.Parent.data.formData, title: element.value };
      this.Parent.setData({ formData: updated });
    },
    'input #body-input': function(e, element) {
      var updated = { ...this.Parent.data.formData, body: element.value };
      this.Parent.setData({ formData: updated });
    }
  }
});
```

```html
<template id="appTemplate">
  <div class="form-container">
    <h2>Create a Post</h2>

    <form id="post-form">
      <div>
        <label for="title-input">Title:</label>
        <input
          id="title-input"
          type="text"
          value="{data.formData.title}"
          required>
      </div>

      <div>
        <label for="body-input">Body:</label>
        <textarea
          id="body-input"
          rows="4"
          required>{data.formData.body}</textarea>
      </div>

      <button type="submit" c-ifnot="isLoading()">
        Submit Post
      </button>

      <button type="button" disabled c-if="isLoading()">
        Submitting...
      </button>
    </form>

    <div c-if="hasError()">
      <p class="error">{data.errorMessage}</p>
    </div>

    <div c-if="data.submittedPost" class="success">
      <h3>✅ Post Created Successfully!</h3>
      <p><strong>ID:</strong> {data.submittedPost.id}</p>
      <p><strong>Title:</strong> {data.submittedPost.title}</p>
      <p><strong>Body:</strong> {data.submittedPost.body}</p>
    </div>
  </div>
</template>
```

### Example 3: Infinite Scroll / Pagination

```js
var app = new AppBlock({
  el: document.getElementById('app'),
  template: document.getElementById('appTemplate'),

  data: {
    posts: [],
    page: 1,
    hasMore: true,
    errorMessage: ''
  },

  methods: {
    loadMore(self) {
      app.fetchRequest(
        'https://jsonplaceholder.typicode.com/posts?_page=' + self.data.page + '&_limit=10',
        { method: 'GET' },
        {
          success: function(data) {
            var updatedPosts = self.data.posts.concat(data);
            self.setData({
              posts: updatedPosts,
              page: self.data.page + 1,
              hasMore: data.length === 10
            });
          },
          error: function(err) {
            self.setData({ errorMessage: err.message });
          }
        }
      );
    }
  },

  events: {
    'click #load-more-btn': function() {
      this.Parent.methods.loadMore(this.Parent);
    }
  }
});

// Initial load
app.methods.loadMore(app);
```

```html
<template id="appTemplate">
  <div class="posts-container">
    <h1>Posts</h1>

    <div class="post" c-for="post in data.posts">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </div>

    <div c-if="isLoading()">
      <p>Loading more posts...</p>
    </div>

    <button
      id="load-more-btn"
      c-if="data.hasMore && !isLoading()">
      Load More
    </button>

    <p c-ifnot="data.hasMore">No more posts to load</p>

    <div c-if="hasError()">
      <p style="color: red;">Error: {data.errorMessage}</p>
    </div>
  </div>
</template>
```

## Best Practices

### 1. Always Handle Errors

Provide meaningful error messages to users:

```js
callbacks: {
  error: function(err) {
    var userMessage = 'Something went wrong. Please try again.';
    if (err.response && err.response.status === 404) {
      userMessage = 'Resource not found.';
    } else if (err.response && err.response.status === 500) {
      userMessage = 'Server error. Please try again later.';
    }
    app.setData({ errorMessage: userMessage });
  }
}
```

### 2. Use Loading States

Always show loading indicators:

```html
<button id="submit-btn" c-ifnot="isLoading()">Submit</button>
<button disabled c-if="isLoading()">Submitting...</button>
```

### 3. Reset State When Needed

Clear previous states before new requests:

```js
methods: {
  refreshData(self) {
    self.resetState();
    self.methods.loadData(self);
  }
}
```

### 4. Use Delays for Debouncing

Prevent excessive requests on rapid input:

```js
events: {
  'input #search': function(e, element) {
    // 500ms delay - waits for user to stop typing
    this.Parent.fetchRequest(
      '/api/search?q=' + element.value,
      { method: 'GET' },
      { success: function(data) { /* ... */ } },
      500 // delay in ms
    );
  }
}
```

## Summary

- Use `fetchRequest()` for native fetch API requests (no dependencies)
- Use `axiosRequest()` for Axios-powered requests (requires Axios library)
- AppBlocks automatically manages `isLoading()`, `isSuccessful()`, and `hasError()` states
- Use callbacks for `success`, `error`, and `finally` handlers
- Add optional delays for throttling/debouncing
- Always provide user feedback for loading, success, and error states

**Next:** Learn about [Utilities](utils.md) for DOM manipulation helpers.