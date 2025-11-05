import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, createMockCustomDirective, resetDOM } from 'tests/fixtures/mockData.js';

describe('custom directives', () => {
  afterEach(() => resetDOM());

  test('registers and invokes a custom directive on render', () => {
    const tpl = createMockTemplate('<div custom-dir>ok</div>');
    const mockDir = createMockCustomDirective(true);
    const config = createMockAppBlockConfig({ template: tpl, directives: { 'custom-dir': mockDir } });

    const app = new AppBlock(config);

    // directive should have been called during render
    expect(mockDir).toHaveBeenCalled();
    const el = app.el.querySelector('[custom-dir]');
    // since directive returned true, element should remain
    expect(el).not.toBeNull();
  });

  test('directive can modify node and affect rendering', () => {
    const tpl = createMockTemplate('<div modify-me></div>');
    const modifier = jest.fn((appInstance, node) => { node.textContent = 'changed'; return true; });
    const config = createMockAppBlockConfig({ template: tpl, directives: { 'modify-me': modifier } });

    const app = new AppBlock(config);

    const el = app.el.querySelector('[modify-me]');
    expect(modifier).toHaveBeenCalled();
    expect(el.textContent).toBe('changed');
  });

});
