import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('filters + methods + directives integration', () => {
  afterEach(() => resetDOM());

  test('method -> filter -> c-if integration works end-to-end', () => {
    const tpl = createMockTemplate('<div c-if="myMethod">{myMethod|up}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      methods: { myMethod: (comp) => 'yes' },
      filters: { up: (comp, v) => String(v).toUpperCase() }
    });

    const app = new AppBlock(config);

    // The c-if directive evaluates myMethod (truthy) and filter uppercases the content
    const el = app.el.querySelector('div');
    expect(el).not.toBeNull();
    expect(el.textContent.trim()).toBe('YES');
  });

  test('asHTML filter replaces text node with HTML fragment', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { html: '<span class="i">HTML</span>' }, filters: { asHTML: (comp, v) => v } });
    const app = new AppBlock(config);

    const inserted = app.el.querySelector('.i');
    expect(inserted).not.toBeNull();
    expect(app.el.innerHTML).toContain('HTML');
  });

  test('chained filters in placeholders apply sequentially', () => {
    const tpl = createMockTemplate('<div>{data.name|up|wrap}</div>');
    const filters = {
      up: (comp, v) => String(v).toUpperCase(),
      wrap: (comp, v) => `-${v}-`
    };
    const config = createMockAppBlockConfig({ template: tpl, data: { name: 'c' }, filters });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('-C-');
  });

});
