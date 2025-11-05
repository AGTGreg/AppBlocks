import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('applyCustomFilter behavior (via placeholders)', () => {
  afterEach(() => resetDOM());

  test('applies a registered filter to text placeholder', () => {
    const tpl = createMockTemplate('<div>{data.count|double}</div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { count: 2 }, filters: { double: (comp, v) => v * 2 } });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('4');
  });

  test('unknown filter leaves value unchanged (and does not throw)', () => {
    const tpl = createMockTemplate('<div>{data.name|nope}</div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { name: 'X' } });
    const app = new AppBlock(config);

    // Unknown filter should not change base value
    expect(app.el.textContent.trim()).toBe('X');
  });

  test('chains multiple filters in order', () => {
    const tpl = createMockTemplate('<div>{data.name|up|wrap}</div>');
    const filters = {
      up: (comp, v) => String(v).toUpperCase(),
      wrap: (comp, v) => `(${v})`
    };
    const config = createMockAppBlockConfig({ template: tpl, data: { name: 'bob' }, filters });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('(BOB)');
  });

});
