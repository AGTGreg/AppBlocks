import { createMockAppBlockConfig, createTemplateWithCIf, createMockTemplate, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-ifnot expression evaluation', () => {
  afterEach(() => resetDOM());

  test('should render when expression evaluates to false', () => {
    const template = createMockTemplate('<div c-ifnot="data.messages.length >= 10">Few messages</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: Array(9).fill({}) }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Few messages');
  });

  test('should not render when expression evaluates to true', () => {
    const template = createMockTemplate('<div c-ifnot="data.messages.length >= 10">Few messages</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: Array(10).fill({}) }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Few messages');
  });

  test('should pass app instance to method and render when method returns false', () => {
    const template = createMockTemplate('<div c-ifnot="hasEnoughMessages(10)">Not enough</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: Array(5).fill({}) },
      methods: {
        hasEnoughMessages(thisApp, minimum) {
          return thisApp.data.messages.length >= minimum;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Not enough');
  });

  test('should not render when method returns true', () => {
    const template = createMockTemplate('<div c-ifnot="hasEnoughMessages(5)">Not enough</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: Array(5).fill({}) },
      methods: {
        hasEnoughMessages(thisApp, minimum) {
          return thisApp.data.messages.length >= minimum;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Not enough');
  });
});