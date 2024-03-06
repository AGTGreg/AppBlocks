# Filters
**`filterName(appInstance, value) { return value }`**

**filters** are functions that take an input value from a template and return another. They are very usefull when we want to convert our data into something else before we render it. Like formating dates and numbers or anything else that we may need.

## Basic usage

We can define filters inside the `filters` object:

```js
var app = new AppBlock({
  ...
  filters: {
    toUpperCase(app, value) {
      return value.toUpperCase();
    }
  }

});
```

And then we can use them in our template like so:

```html
<template id="appTemplate">
  <p title="{data.message}">{data.message|toUpperCase}</p>
</template>
```

## Chaining filters
It is possible to chain multiple filters together like so:
```html
<template id="appTemplate">
  <p title="{data.message}">
    {data.message|filterA|filterB|filterC}
  </p>
</template>
```


## Filters in attributes
Filters can also be used in attributes. A common usecase for that is to determine the class of form fields when you validate a form:
```html
<style>
    .red {
        background-color: red;
        color: white;
    }
    .green {
        background-color: green;
        color: white;
    }
</style>

<div id="app"></div>

<template id="appTemplate">
  <div c-for="field in data.fields">
    <label for="inp-{field.fieldName}">{field.label}</label>
    <input type="{field.type}" id="inp-{field.fieldName}" class="{field.isValid|validationClass}" name="{field.fieldName}" value="{field.value}">
  </div>
</template>

<script>
  var app = new AppBlock({
    name: "RenderApp",
    el: document.getElementById('app'),
    template: document.getElementById('appTemplate'),
    renderEngine: 'plain',
    data: {
      fields: [
        {
          fieldName: "name",
          type: "text",
          isValid: true,
          label: "This shoud be green",
          value: "Joe"
        },
        {
          fieldName: "email",
          type: "email",
          isValid: false,
          label: "This should be red",
          value: "joe@example.com"
        }
      ]
    },
    filters: {
      validationClass(app, value) {
        console.log(value);
        if (value === true) {
          return "green";
        } else {
          return "red";
        }
      }
    }
  });
</script>
```


## The `asHTML` filter
AppBlocks is safe by default. This means that if a value in your data has HTML in it and you try to add it in your template, AppBlocks will add it as text. So this for example:
```js
{
  ...
  data: {
    someHTML: "<p>Hello!</p>"
  }
}
```
```html
<p>{data.someHTML}</p>
```
will result to this:
```html
<p>"<p>Hello!</p>"</p>
```

In order to tell Appblocks that a value should be added as html you must use the`asHTML` filter:
```html
<p>{data.someHTML|asHTML}</p>
```