# Quickstart: Method Calls in Placeholders & c-for

## Overview
Demonstrates invoking app methods inside placeholders and `c-for` directives with implicit app instance injection and filter chaining.

## Placeholder Usage
```html
<div>{sumMethod(data.a, data.b)}</div>
<div>{sumMethod(data.a, data.b)|minusOne}</div>
```
- sumMethod signature: `sumMethod(app, a, b)`
- minusOne filter signature: `minusOne(value)`

## c-for Usage
```html
<ul c-for="n in rangeMethod(data.start, data.end)">
  <li>{n}</li>
</ul>
```
If `rangeMethod(app, start, end)` returns a non-iterable, an error is logged and list renders empty.

## Nested Calls
```html
<span>{wrapMethod(addMethod(data.x, multiplyMethod(data.y, data.z)))}</span>
```
Evaluation proceeds inner-first, one call per expression per render.

## Error Handling
- Placeholder error → logs error, renders empty string
- c-for error (non-iterable) → logs error, zero iterations

## Performance Notes
Per-render cache avoids duplicate evaluations (node + expression). Cache cleared at each new render.

## Testing Guidance
Add tests under:
- `tests/placeholders/method-calls.test.js`
- `tests/directives/c-for.method-calls.test.js`

Key test patterns:
- Verify single invocation using spies
- Confirm filter chain ordering
- Ensure non-iterable iterable expression logs error and renders nothing

## Benchmarking
Extend existing benchmark script with scenarios containing method calls + nested usage; confirm <5% overhead.

## Documentation Updates Required
- Update `docs/directives.md` (add method call mention in c-for section)
- Update `docs/placeholders.md` or relevant area for method invocation syntax
- Update `docs/changelog.md` with feature summary and usage examples
