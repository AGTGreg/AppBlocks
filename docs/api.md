# API

## el: Node
Assign a DOM element were the App will live. This element might contain the template of your app or be an empty
container.

**Syntax:**
`AppBlock.el: node`

**Example:**

```js
el: document.getElementById('my-app')
```


## template: Node
Assign a template element that contains all the markup of your app. This is optional but highly recomented.
Alternatively you could place all your app's markup in el skip the `template`.

**Syntax:**
`AppBlock.template: node`

**Example:**

```js
template: document.getElementById('my-app-template')
```


## debug: boolean
If debug is set to `true`, AppBlocks will show logs of data, errors and warnings in the console.


## data: object
The data of our App. It is a simple javascript object. You can read more about it [here](data.md).

**Syntax:**
`AppBlock.data: {}`

**Example:**
```js
data: {
  price: 100,
  name: "bike"
}
```


## methods: object
All logic in our app goes here. It is an object that contains all the methods/functions in our app. You can read more
about it [here](methods.md).

**Syntax:**
`AppBlock.methods: {}`

**Example:**
```js
methods: {
  add(app, a, b) {
    return a + b;
  },
}
```

The methods object also contains some buid-in methods. You can read more about them [here](methods.md):
- `methods.beforeRender()`
- `methods.afterRender()`
- `methods.isLoading()`
- `methods.isSuccessfull()`
- `hasError()`


## directives: object
An object were you store all your custom directives you can use in your templates. You can read more about it
[here](README.md?id=making-your-own-directives):

**Syntax:**
`AppBlock.directives: {}`


## events: object
This is where you assign all the events in your app. You can read more about it
[here](README.md?id=event-handling):


## axiosConfig: object
The configuration for the axios library.


## request
In AppBlocks you can make requests using the awesome Axios library via this method.
Keep in mind that axios is otional. It is not a dependency in AppBlocks and if you decide to use it you'll have to
include the Axios library yourself. AppBlocks intergrates with it out of the box to make your life easier. Read more
about it [here](README.md?id=requests).


## utils
A set of helper functions for DOM manipullation. [Read more](utils.md).
