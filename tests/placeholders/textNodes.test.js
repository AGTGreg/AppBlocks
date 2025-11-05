import {
  createMockAppBlockConfig,
  createMockTemplate,
  createTemplateWithPlaceholders,
  resetDOM
} from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('Placeholder Replacement - Text Nodes', () => {

  afterEach(() => resetDOM());

  test('should replace simple placeholder with data value', () => {
    const template = createMockTemplate('<div>{data.name}</div>');
    const config = createMockAppBlockConfig({ template, data: { name: 'Alice' } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Alice');
  });

  test('should replace nested property placeholder', () => {
    const template = createMockTemplate('<div>{data.user.name}</div>');
    const config = createMockAppBlockConfig({ template, data: { user: { name: 'Bob' } } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Bob');
  });

  test('should replace multiple placeholders in template', () => {
    const template = createTemplateWithPlaceholders(['{data.first}', '{data.last}']);
    const config = createMockAppBlockConfig({ template, data: { first: 'Jane', last: 'Doe' } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Jane');
    expect(app.el.textContent).toContain('Doe');
  });

  test('should handle missing property gracefully', () => {
    const template = createMockTemplate('<div>{data.missing}</div>');
    const config = createMockAppBlockConfig({ template, data: {} });
    const app = new AppBlock(config);

    // Should not throw and should render empty or placeholder-considered output
    expect(app.el).toBeDefined();
  });

});
