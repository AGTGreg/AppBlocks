# Quickstart: c-if / c-ifnot Expressions

## Basic Usage

```html
<div c-if="data.messages.length >= 10">You have lots of messages</div>
<div c-if="hasUser(data.messages) === true">Welcome back!</div>
<div c-ifnot="data.messages.length >= 10">Keep the conversation going</div>
```

- Expressions evaluate with access to `data` and instance methods only.
- Non-boolean results follow JavaScript truthiness.

## Method Example

```js
const app = new AppBlock({
  data: { messages: [...] },
  methods: {
    hasUser(messages) { return messages.some(m => m.userId === this.data.currentUserId) }
  }
})
```

```html
<div c-if="hasUser(data.messages)">Visible if the current user has messages</div>
```

## Enabling Built-ins (optional)

Built-ins are blocked by default. To allow `Math`:

```js
const app = new AppBlock({
  data: { value: 42 },
  config: { allowBuiltins: ['Math'] }
})
```

```html
<div c-if="Math.max(data.value, 10) > 40">Big number</div>
```

## Error Handling
- If an expression throws or contains blocked constructs, `c-if` acts as false and `c-ifnot` acts as true.
- A warning is logged once per render cycle per unique expression.

## Tips
- Keep expressions concise; move heavy logic into instance methods.
- Prefer method helpers for readability and reuse.
