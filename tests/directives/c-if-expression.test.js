import { createMockAppBlockConfig, createTemplateWithCIf, createMockTemplate, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if expression evaluation', () => {
  afterEach(() => resetDOM());

  test('should render when data.messages.length >= 10', () => {
    const template = createTemplateWithCIf('data.messages.length >= 10', 'Many messages');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: Array(10).fill({}) }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Many messages');
  });

  test('should not render when data.messages.length < 10', () => {
    const template = createTemplateWithCIf('data.messages.length >= 10', 'Many messages');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: Array(9).fill({}) }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Many messages');
  });

  test('should not affect c-for behavior when sibling c-if present', () => {
    const templateHtml = `
      <div c-if="data.show">
        <span c-for="item in data.items">{item}</span>
      </div>
    `;
    const template = createMockTemplate(templateHtml);
    const config = createMockAppBlockConfig({
      template,
      data: { show: true, items: ['a', 'b', 'c'] }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('abc');
  });
});