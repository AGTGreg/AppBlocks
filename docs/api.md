# API

## `el: Node`
Assign a DOM element were the App will live. This element might contain the template of your app or be an empty
container.

**Syntax:**
`AppBlock.el: node`

**Example:**

```js
el: document.getElementById('my-app')
```


## `template: Node`
Assign a template element that contains all the markup of your app. This is optional but highly recomented.
Alternatively you could place all your app's markup in el skip the `template`.

**Syntax:**
`AppBlock.template: node`

**Example:**

```js
template: document.getElementById('my-app-template')
```


## `name: string`
You can assign a unique name to your app so that all errors comming from it will curry that name and make your life easier.


## `renderEngine: string`
You can choose which engine is used to render your app. You have 2 choices:
- `plain`: This is a very simple way of rendering the app. Appblocks will create a DOM tree in memory and then replace your DOM with that in one go. This is very simple and fast. However the state of you preexisting elements resets because in reallity they are replaced with the new DOM.
- `Idiomorph`: This uses the [Idiomorph](https://github.com/bigskysoftware/idiomorph) engine to find the differences bettween the real DOM and the DOM that appblocks has in memory and update it with only what's different. It is slower than `plain` but all of your previous element retain their state since they are not beeing replaced (if they don't have to be updated).

`Idiomorph` is the default renderEngine since it covers the most common use cases and is what someone might expect to happen when they update their DOM.


## `data: object`
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

## `filters: object`
This is where our filters go.

**Syntax:**

A filter is defined like so:

`filterName(appInstance, value) { return value }`

And we can use it in our templates like so:

`<p>{value|filterName}</p>`

You can read more about it [here](filters.md).

## methods: object
All logic in our app goes here. It is an object that contains all the methods/functions in our app.

**Syntax:**

A method is defined like so:

`methodName(appInstance) {}`

**Example:**
```js
methods: {
  add(app, a, b) {
    return a + b;
  },
}
```

You can read more about it [here](methods.md).


## directives: object
An object were you store all your custom directives you can use in your templates. You can read more about it
[here](directives.md):

**Syntax:**
`AppBlock.directives: {}`


## events: object
This is where you assign all the events in your app. You can read more about it
[here](README.md?id=event-handling):


## fetchRequest
Make a request with fetch.
Read about it [here](requests.md).


## axiosRequest
Make a request with Axios.
Read about it [here](requests.md).


## utils
A set of helper functions for DOM manipullation. [Read more](utils.md).
