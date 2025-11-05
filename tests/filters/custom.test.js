import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('custom filters', () => {
  afterEach(() => resetDOM());

  test('applies custom filter in text placeholders', () => {
    const tpl = createMockTemplate('<div>{data.name|up}</div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { name: 'alice' }, filters: { up: (comp, v) => String(v).toUpperCase() } });
    const app = new AppBlock(config);

    const text = app.el.textContent.trim();
    expect(text).toBe('ALICE');
  });

  test('applies custom filter in attribute placeholders', () => {
    const tpl = createMockTemplate('<div title="{data.title|wrap}"></div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { title: 'T' }, filters: { wrap: (comp, v) => `(${v})` } });
    const app = new AppBlock(config);

    const el = app.el.querySelector('div');
    expect(el.getAttribute('title')).toBe('(T)');
  });

});
