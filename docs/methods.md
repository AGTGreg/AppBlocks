# Methods

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
This method is called righ after render is finished. Use it to place any code that needs to be executed after each
render.
```js
methods: {
  afterRender(appInstance) {
    console.log('Render has just finished');
  }
}
```

### `isLoading(appInstance)`
This method returns the loading state of our App.

### `isSuccessfull(appInstance)`
This method returns the success state of our App.

### `hasError(appInstance)`
This method returns the error state of our App.
