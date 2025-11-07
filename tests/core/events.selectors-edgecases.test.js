import { AppBlock } from 'src/core.js';
import { createMockElement, resetDOM } from 'tests/fixtures/mockData.js';

describe('Event selectors - edge cases', () => {
  afterEach(() => resetDOM());

  test('selector with extra spaces is trimmed and still matches', () => {
    const el = createMockElement();
    const inner = document.createElement('div'); inner.className = 'inner';
    const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Click';
    inner.appendChild(btn);
    el.appendChild(inner);

    const handler = jest.fn();
    // Intentionally include extra spaces after the event name
    const config = { el, events: { 'click   .inner .btn': handler } };

    const app = new AppBlock(config);
    const renderedBtn = app.el.querySelector('.btn');
    renderedBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).toHaveBeenCalled();
  });

  test('attribute selector works as expected', () => {
    const el = createMockElement();
    const div = document.createElement('div'); div.setAttribute('data-role', 'ok');
    const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Go';
    div.appendChild(btn);
    el.appendChild(div);

    const handler = jest.fn();
    const config = { el, events: { "click div[data-role='ok'] .btn": handler } };

    const app = new AppBlock(config);
    const renderedBtn = app.el.querySelector('.btn');
    renderedBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).toHaveBeenCalled();
  });

  test('invalid selector is safely ignored (no throw)', () => {
    const el = createMockElement();
    const btn = document.createElement('button'); btn.className = 'btn';
    el.appendChild(btn);

    const handler = jest.fn();
    // Provide an invalid selector to ensure it doesn't throw at runtime
    const config = { el, events: { 'click .foo >>>>> .bar': handler } };

    const app = new AppBlock(config);
    // Dispatching should not cause an exception; handler should not be called
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });
});
