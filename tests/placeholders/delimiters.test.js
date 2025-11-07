import { AppBlock } from 'src/core.js';
import { createMockTemplate, createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';

describe('Placeholder delimiters configuration', () => {
  afterEach(() => resetDOM());

  test('default delimiters `{}` work as before', () => {
    const template = createMockTemplate('<div>{data.name}</div>');
    const config = createMockAppBlockConfig({ template, data: { name: 'Alice' } });
    const app = new AppBlock(config);
    expect(app.el.textContent).toContain('Alice');
  });

  test('custom delimiters `[[ ]]` are honored for text placeholders', () => {
    const template = createMockTemplate('<div>[[data.user.name]]</div>');
    const config = createMockAppBlockConfig({ template, data: { user: { name: 'Eve' } }, delimiters: ['[[', ']]'] });
    const app = new AppBlock(config);
    expect(app.el.textContent).toContain('Eve');
  });

  test('invalid delimiters fallback to default and log error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const template = createMockTemplate('<div>{data.name}</div>');
    const config = createMockAppBlockConfig({ template, data: { name: 'Zed' }, delimiters: ['', ''] });
    const app = new AppBlock(config);
    expect(app.el.textContent).toContain('Zed');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

});
