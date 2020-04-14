# Changelog

## 1.2.0
- **New feature:** Assign custom template.
- **New feature:** Add `beforeRender()` and `afterRender()` methods that get called before and after rendering.
- **Enhancement:** AppBlocks uses documentFragment to make DOM changes in memory.
- **Enhancement:** Undefined properties will render as empty text instead of "undefined".
- **Enhancement:** Methods now take an optional argument which is the instance of their app.
- **Enhancement:** Success callback can mutate the data of the response.