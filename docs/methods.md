# Methods

**`methodName(appInstance) {}`**

The methods object is the right place to put all of our application's logic. From processing data to anything you would
write a function for, you put it inside `methods`.

This is how a method looks like in AppBlocks:
```js
myMethod(appInstance) {
  // Do some stuff
}

```

## Accessing data

All methods take one optional parameter which is the instance of the App they belong to. AppBlocks will pass our App's
instance in this parameter when it calls our methods, so we can have access to it from within our method.

Take a look at the example bellow and see how we access our App's data:
```js
var app = new AppBlock({

  el: document.getElementById('app'),

  data: {
    message: 'Hello world!'
  },

  methods: {
    message(thisApp) {
      return thisApp.data.message.toUpperCase();
    }
  }

})
```

This parameter is optional, but it is important to remember it when calling your methods:
```js
methods: {
  message(thisApp) {
    return thisApp.data.message.toUpperCase();
  },

  changeMessage(thisApp) {
    const oldMessage = thisApp.methods.message(thisApp);
    return oldMessage + ' LOOK I HAVE CHANGED!';
  }
}
```

If you don't call `message` with `thisApp` argument, then `message` will not have access to our App's instance or its
data.

Alternatively we can access our App by calling `this.Parent` which is also our App's instance:
```js
methods: {
  message() {
    return this.Parent.data.message.toUpperCase();
  },
}
```

## Calling methods from inside our app:
```js
var app = new AppBlock({

  ...

  methods: {
    toggleMessage(thisApp) {
      thisApp.setData({
        seen: !this.Parent.data.seen
      });
    }
  },

  events: {
    'mouseup #message-toggler': function(e) {
      this.Parent.methods.toggleMessage(this.Parent);
    },
    'mousedown #message-toggler': function(e) {
      this.Parent.methods.toggleMessage(this.Parent);
    }
  }

})
```

This calls a method from `events` but you can call methods from other methods.

Another use case for methods is to call them from another app:

```js
var appA = new AppBlock({
  ...
  methods: {
    methodA(thisApp) { return "Hello for appA!"; }
  },
  ...
});

var appB = new AppBlock({
  ...
  methods: {
    callA(thisApp) { appA.methods.methodA(appA); }
  },
  ...
});
```


## Calling methods from directives:

Methods can be called from directives like `c-if` and `c-ifnot`. When you call a method from a directive, AppBlocks automatically passes the app instance as the first parameter, so you don't need to provide it in the template.

### Simple flag example:
```js
var app = new AppBlock({
  ...
  data: {
    seen: true
  },

  methods: {
    showSpan(thisApp) {
      return thisApp.data.seen;
    }
  }
})
```

```html
<template id="appTemplate">
  <span c-if="showSpan">Now you see me</span>
</template>
```

### Methods with parameters:

When your method takes additional parameters beyond the app instance, you can pass them directly in the directive expression:

```js
var app = new AppBlock({
  ...
  data: {
    userAge: 25,
    minAge: 18
  },

  methods: {
    isOldEnough(thisApp, age, minimum) {
      return age >= minimum;
    },

    isLarger(thisApp, a, b) {
      return a > b;
    }
  }
})
```

```html
<template id="appTemplate">
  <span c-if="isOldEnough(data.userAge, data.minAge)">You can proceed</span>
  <span c-if="isLarger(data.userAge, 21)">You can drink in the US</span>
</template>
```

**Note:** The app instance is automatically passed as the first parameter to methods when called from `c-if`, `c-ifnot`, or expression contexts. You define the method with `methodName(thisApp, ...otherParams)` but call it in templates as `methodName(param1, param2)`.

### Complex expressions:

You can also use methods in complex boolean expressions:

```js
var app = new AppBlock({
  ...
  data: {
    score: 85,
    attempts: 2
  },

  methods: {
    isPassing(thisApp, score) {
      return score >= 60;
    },

    hasAttemptsLeft(thisApp, attempts) {
      return attempts > 0;
    }
  }
})
```

```html
<template id="appTemplate">
  <span c-if="isPassing(data.score) && hasAttemptsLeft(data.attempts)">
    Congratulations! You passed!
  </span>
  <span c-if="!isPassing(data.score) && hasAttemptsLeft(data.attempts)">
    Try again!
  </span>
  <span c-ifnot="hasAttemptsLeft(data.attempts)">
    No attempts remaining.
  </span>
</template>
```


## Build-in methods

AppBlocks offers some handy build-in methods to make your life easier. You can override these methods inside the
methods object or call them from within your templates or App.

### `beforeRender(appInstance)`
This method is called before a render is about to happen. You can place any code that needs to be executed before each
render.
```js
methods: {
  beforeRender(appInstance) {
    console.log('Render is about to begin');
  }
}
```

### `afterRender(appInstance)`
This method is called right after render has finished. Use it to place any code that needs to be executed after each
render.
```js
methods: {
  afterRender(appInstance) {
    console.log('Render has just finished');
  }
}
```

### `isLoading(appInstance)`
This method returns the loading state of our App. It is meant to be used from the template when we make requests.

### `isSuccessfull(appInstance)`
This method returns the success state of our App. It is meant to be used from the template when we make requests.

### `hasError(appInstance)`
This method returns the error state of our App. It is meant to be used from the template when we make requests.

## Calling Methods in Templates

You can invoke custom methods directly in placeholders and directives, with implicit app instance injection.

### Method Calls in Placeholders

```html
<template id="appTemplate">
  <div>
    <p>{formatName(data.firstName, data.lastName)}</p>
    <p>{calculateTotal(data.items)|currency}</p>
  </div>
</template>
```

```js
var app = new AppBlock({
  data: {
    firstName: 'John',
    lastName: 'Doe',
    items: [10, 20, 30]
  },
  
  methods: {
    formatName(app, first, last) {
      return first + ' ' + last;
    },
    
    calculateTotal(app, items) {
      return items.reduce((a, b) => a + b, 0);
    }
  },
  
  filters: {
    currency(app, value) {
      return '$' + value.toFixed(2);
    }
  }
})
```

The app instance is automatically injected as the first parameter, so you don't need to pass it explicitly.

### Method Calls with Filters

You can chain filters after method calls:

```html
<span>{getMessage()|uppercase|trim}</span>
```

### Method Calls in c-for

Use methods to generate iterables in `c-for`:

```html
<ul c-for="item in getFilteredItems(data.category)">
  <li>{item.name}</li>
</ul>
```

### Nested Method Calls

Method calls can be nested, and they are evaluated only once per render for efficiency:

```html
<span>{processResult(getDataMethod(data.id))}</span>
```

````
