### The `asHTML` filter
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