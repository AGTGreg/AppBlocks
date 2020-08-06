# The data object

Data in AppBlocks is just a javascript object. That's it! Theres nothing magical about it, so you can do whatever you
want with it. The only rule is that data must be an `Object`.

The data object is the right place to store all data our App will use. We can leave it empty or initialize it with some
data:

```js
var app = new AppBlock({
  ...
  data: {
    message: "Hello!"
  }
  ...
})
```

## Accessing our data

Accessing our data is straightforward. We can access our data from our templates via placeholders or directives:
```html
<p>{data.message}</p>

<!-- We can use placeholders in attributes too -->
<p title="{data.message}"></p>

<!-- Data is also accessible in directives -->
<p c-if="data.message">
  {data.message}
</p>
```


We can also access array and object elements with square brackets notation (handy if you want to access data 
dynamically in the template):
```js
var app = new AppBlock({
  ...
  data: {
    anArray: [1, 2, 3],
    anotherArray: [{"name": "Greg"}, {"name": "Emma"}, {"name": "Theodor"}]
    anObject: {"name": "Greg"}
  }
  ...
})
```
```html
<p>{data.anArray[0]}</p>
<p>{data.anotherArray[0][name] OR {data.anotherArray[0].name}</p>
<p>{data.anObject[name]} OR {data.anObject.name}</p>
```


From within our App we access the data object via our app's instance. Methods, for example take an optional argument
which is our App's instance:
```js
someMethod(myApp) {
  myApp.data;
}
```
or you can access it using `this.Parent`:
```js
someMethod() {
  this.Parent.data;
}
```
You can read more on that here: [Methods](methods.md)

## Updating our data

We have two choices when it comes to updating our data:

### setData()

`setData(newData, replaceData=false)`

This method tells AppBlocks to update our data and then re-render our interface to reflect the changes we made.
It also takes the optional parameter `replaceData`. By default this is set to `false` so AppBlocks will only update 
the parts of the data specify, keeping everything else intact. If we set this to `true` then AppBlocks will
replace all of our old data with the new Data. 

Here's how we would call `setData` from our methods:
```js
var app = new AppBlock({
  ...
  data: {
    message: "Hello",
    name: "Greg"
  },

  methods: {
    // This will only change the name in our data and keep the message as it is.
    changeName(myApp) {
      myApp.setData({ name: "Theodor" });
    },

    // This will replace all of our data. Data will no longer have a message item.
    replaceData(myApp) {
      myApp.setData({ name: "Theodor" }, true);
    }
  }
  ...
})
```

Both of these methods will cause our App to re-render because they use `setData`.

### Direct update:
Re-rendering our App everytime we change our data might not be what we want. We can optimize the rendering of our App
by updating our data directly and then trigger our app to render when we need it:
```js
var app = new AppBlock({
  ...
  data: {
    message: "Hello",
    name: "Greg"
  },

  methods: {
    // This will only change the name in our data and keep the message as it is.
    changeName(myApp) {
      myApp.data.name = "Emma";
      // Do some staff with data
      ...
      myApp.render();
    },
  }
  ...
})



