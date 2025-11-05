import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('custom methods', () => {
  afterEach(() => resetDOM());

  test('registers custom method and makes it available in placeholders', () => {
    const tpl = createMockTemplate('<span>{myMethod}</span>');
    const config = createMockAppBlockConfig({ template: tpl, methods: { myMethod: (comp) => 'RESULT' } });
    const app = new AppBlock(config);

    const text = app.el.textContent.trim();
    expect(text).toBe('RESULT');
  });

  test('custom method receives component instance as argument', () => {
    const tpl = createMockTemplate('<span>{getName}</span>');
    const methods = { getName: jest.fn((comp) => comp.name) };
    const config = createMockAppBlockConfig({ template: tpl, methods });
    const app = new AppBlock(config);

    expect(methods.getName).toHaveBeenCalledWith(expect.any(Object));
    expect(app.el.textContent.trim()).toBe(app.name);
  });

});
