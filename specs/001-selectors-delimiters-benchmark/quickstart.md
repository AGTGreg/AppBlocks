# Quickstart: Selectors, Delimiters, Benchmark

## 1. Event Delegation with Descendant Selectors
```js
import { AppBlock } from '../src/core.js';

const el = document.getElementById('app');

const app = new AppBlock({
  el,
  events: {
    'click .todo-list li .delete': (e) => {
      // e.target is inside the matched .delete button
      console.log('Delete clicked');
    }
  }
});
```
Behavior: The key is split once at the first space. The remainder is treated as the full CSS selector. Delegation uses container-level listener and `closest()` to test matches.

## 2. Custom Placeholder Delimiters
```js
const app = new AppBlock({
  el,
  delimiters: ['[[', ']]'],
  data: { user: { name: 'Ada' } },
  template: (() => {
    const tpl = document.createElement('template');
    tpl.innerHTML = '<div>Hello [[data.user.name|upper]]!</div>';
    return tpl;
  })()
});
```
Both text and attribute placeholders must use the chosen delimiters. Filters still separated by `|`.

## 3. Running the Benchmark (Concept)
A benchmark script (to be added) will:
1. Build a fixed template containing:
   - Two placeholders `{data.someValue}` and `{someMethod}` (or custom delimiters after reconfiguration)
   - One `c-if`
   - One `c-for`
   - Two filters
2. Execute 10 consecutive renders capturing `beforeRender` / `afterRender` timestamps.
3. Compute mean, store baseline in `.benchmarks/baseline.json` if absent, compare on subsequent runs.

Expected JSON structure:
```json
{
  "samples": [1.2, 1.1, ...],
  "meanMs": 1.15,
  "baseline": { "meanMs": 1.10 },
  "report": "Mean 1.15ms (+4.5% vs baseline 1.10ms)"
}
```

## 4. Testing Guidance
- Add event tests: complex descendant selectors fire only when target is inside matched chain.
- Add delimiter tests: default `{}` unaffected; custom `[[ ]]` parse placeholders and filters identically.
- Add benchmark test (optional): asserts 10 samples and numeric mean.

## 5. Documentation Updates Required
- `docs/api.md`: Add `delimiters` config key description.
- `docs/whyappblocks.md` or `docs/utils.md`: Brief rationale for customizable delimiters.
- `docs/changelog.md`: Entry for new features.
- `docs/testing.md`: Mention benchmark harness usage (optional reference).

## 6. Migration / Compatibility
- Existing event keys without descendant spaces remain functional.
- Existing placeholder braces `{}` remain default; no changes required by users unless opting in.
