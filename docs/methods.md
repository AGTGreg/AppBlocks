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
