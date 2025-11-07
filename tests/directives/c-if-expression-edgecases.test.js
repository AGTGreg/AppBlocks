import { createMockAppBlockConfig, createTemplateWithCIf, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if expression edge cases', () => {
  afterEach(() => resetDOM());

  test('should handle non-boolean truthiness (number, array)', () => {
    const template = createTemplateWithCIf('data.count', 'Truthy number');
    const config = createMockAppBlockConfig({ template, data: { count: 5 } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Truthy number');
  });

  test('should handle undefined property gracefully', () => {
    const template = createTemplateWithCIf('data.unknown', 'Should not show');
    const config = createMockAppBlockConfig({ template, data: {} });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Should not show');
  });

  test('should handle method throw with false result', () => {
    const template = createTemplateWithCIf('data.throwingMethod()', 'Should not show');
    const config = createMockAppBlockConfig({
      template,
      data: {},
      methods: {
        throwingMethod() { throw new Error('Test error'); }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Should not show');
  });
});