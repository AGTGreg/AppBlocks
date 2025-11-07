import { AppBlock } from 'src/core.js';
import { createMockTemplate, createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';

describe('Placeholder delimiters - edge cases', () => {
  afterEach(() => resetDOM());

  test('multi-character delimiters with regex chars are supported', () => {
    const template = createMockTemplate('<div><%data.name%></div>');
    const config = createMockAppBlockConfig({ template, data: { name: 'Regex' }, delimiters: ['<%', '%>'] });
    const app = new AppBlock(config);
    expect(app.el.textContent).toContain('Regex');
  });

  test('attribute placeholders honor custom delimiters', () => {
    const template = createMockTemplate('<div data-title="<<data.title>>">x</div>');
    const config = createMockAppBlockConfig({ template, data: { title: 'AttrOk' }, delimiters: ['<<', '>>'] });
    const app = new AppBlock(config);
    const el = app.el.querySelector('div');
    expect(el.getAttribute('data-title')).toBe('AttrOk');
  });

  test('non-string or invalid delimiter values fall back to default', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const template = createMockTemplate('<div>{data.name}</div>');
    const config = createMockAppBlockConfig({ template, data: { name: 'Fallback' }, delimiters: [null, 5] });
    const app = new AppBlock(config);
    expect(app.el.textContent).toContain('Fallback');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
