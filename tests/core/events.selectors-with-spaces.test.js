import { AppBlock } from 'src/core.js';
import {
  createMockElement,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('Event selectors with spaces (descendant selectors)', () => {
  afterEach(() => resetDOM());

  test('delegated handler fires for deeply nested matching element', () => {
    const el = createMockElement();

    // Build nested structure: <div class="outer"><div class="inner"><button class="btn">X</button></div></div>
    const outer = document.createElement('div'); outer.className = 'outer';
    const inner = document.createElement('div'); inner.className = 'inner';
    const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Click';
    inner.appendChild(btn);
    outer.appendChild(inner);
    el.appendChild(outer);

    const handler = jest.fn((e, matched) => {});
    const config = { el, events: { 'click .outer .inner .btn': handler } };

    const app = new AppBlock(config);

  // dispatch click on the innermost button (the rendered DOM is cloned during render, so query it)
  const renderedBtn = app.el.querySelector('.btn');
  const ev = new MouseEvent('click', { bubbles: true });
  renderedBtn.dispatchEvent(ev);

    expect(handler).toHaveBeenCalled();
  });

  test('non-matching click does not invoke handler', () => {
    const el = createMockElement();
    const other = document.createElement('div'); other.className = 'other';
    const btn = document.createElement('button'); btn.className = 'btn';
    other.appendChild(btn);
    el.appendChild(other);

    const handler = jest.fn();
    const config = { el, events: { 'click .outer .inner .btn': handler } };

    const app = new AppBlock(config);

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });

});
