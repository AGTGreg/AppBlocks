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
You can choose which engine to used to render your app. You have 2 choices:
- `plain`: This is a very simple way of rendering the app. Appblocks will create a DOM tree in memory and then replace your existing DOM with the new one in one go. This is very simple and fast. However the state of your pre-existing elements resets because in reality they are replaced with the new DOM.
- `Idiomorph`: This uses the [Idiomorph](https://github.com/bigskysoftware/idiomorph) engine to find the differences between the real DOM and the DOM that appblocks has in memory and update it with only what's different. It is slower than plain but all of your previous elements retain their state since they are not being replaced (if they don't have to be updated).

`Idiomorph` is the default renderEngine since it covers the most common use cases and it is what someone might expect to happen when they update their DOM.


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

## `setData: function`
Use this function to update or replace our data and trigger a render immediately after.

**Syntax:**

`setData(newData, replaceData=false)`

## `filters: object`
This is where our filters go.

**Syntax:**

A filter is defined like so:

`filterName(appInstance, value) { return value }`

And we can use it in our templates like so:

`<p>{value|filterName}</p>`

You can read more about it [here](filters.md).

## `delimiters: [string, string]`

Customize the placeholder delimiters that AppBlocks uses to identify template placeholders. By default AppBlocks uses curly braces `{` and `}`. To change that behaviour provide an array of two non-empty strings: the opening and closing delimiters.

Syntax:
`delimiters: [openDelimiter, closeDelimiter]`

Example (use `[[` and `]]` as delimiters):

```js
delimiters: ['[[', ']]']
```

Notes:
- Filters (the `|` pipe) continue to operate inside placeholders regardless of the chosen delimiters: e.g. `[[data.name|upper]]`.
- Invalid or malformed `delimiters` (non-array, wrong length, non-string entries, or empty strings) are ignored and AppBlocks falls back to the default `['{','}']`. An error is logged to aid debugging.

## methods: object
All logic in our app goes here. It is an object that contains all the methods/functions in our app.

**Syntax:**

A method is defined like so:

`methodName(appInstance, ...params) {}`

The first parameter is always the app instance, which is automatically passed by AppBlocks when the method is called from templates (e.g., in `c-if` directives). Additional parameters can be passed explicitly in the template.

**Example:**
```js
methods: {
  add(app, a, b) {
    return a + b;
  },
  isAdult(app, age) {
    return age >= 18;
  }
}
```

When calling from templates:
```html
<span c-if="isAdult(data.userAge)">Adult content</span>
<p>{add(5, 3)}</p>
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

### Format

Event keys follow the format `"<eventName> <cssSelector>"` where the selector may contain spaces and descendant combinators. AppBlocks splits the string on the first space: everything before the first space is treated as the event name and everything after is treated as the full CSS selector. This enables complex selectors such as descendant selectors or attribute selectors.

Example using a descendant selector:

```js
events: {
  'click .todo-list li .delete': (e, matchedEl) => { /* ... */ }
}
```

Notes:
- Delegation is implemented using a single listener attached to the component root and `Element.closest()` is used on the event target to find the matching element. The handler is invoked with `(event, matchedElement)`.
- Backward compatibility: keys without spaces or simple selectors continue to work. The first space is always used to split the event name from the selector; the remainder (including additional spaces) is considered the selector string.


## fetchRequest
Make a request with fetch.
Read about it [here](requests.md).


## axiosRequest
Make a request with Axios.
Read about it [here](requests.md).


## utils
A set of helper functions for DOM manipullation. [Read more](utils.md).
