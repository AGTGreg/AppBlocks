import { createMockAppBlockConfig, createTemplateWithCIf, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if legacy boolean flag', () => {
  afterEach(() => resetDOM());

  test('should render when flag is true', () => {
    const template = createTemplateWithCIf('data.show', 'Visible');
    const config = createMockAppBlockConfig({ template, data: { show: true } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Visible');
  });

  test('should not render when flag is false', () => {
    const template = createTemplateWithCIf('data.show', 'Hidden');
    const config = createMockAppBlockConfig({ template, data: { show: false } });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Hidden');
  });
});