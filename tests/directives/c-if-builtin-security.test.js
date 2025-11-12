import { createMockAppBlockConfig, createTemplateWithCIf, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if builtin security', () => {
  afterEach(() => resetDOM());

  test('should block Math when not in allowBuiltins', () => {
    const template = createTemplateWithCIf('Math.max(data.value, 10) > 40', 'Big number');
    const config = createMockAppBlockConfig({
      template,
      data: { value: 42 }
      // No config.allowBuiltins specified
    });

    // Should log error but not throw
    const app = new AppBlock(config);

    // Element should not render because Math evaluation fails
    expect(app.el.textContent).not.toContain('Big number');
  });

  test('should allow Math when explicitly enabled in allowBuiltins', () => {
    const template = createTemplateWithCIf('Math.max(data.value, 10) > 40', 'Big number');
    const config = createMockAppBlockConfig({
      template,
      data: { value: 42 },
      allowBuiltins: ['Math']
    });

    const app = new AppBlock(config);

    // Element should render because Math.max(42, 10) = 42 > 40 = true
    expect(app.el.textContent).toContain('Big number');
  });

  test('should block Date when not in allowBuiltins', () => {
    const template = createTemplateWithCIf('Date.now() > 0', 'Has timestamp');
    const config = createMockAppBlockConfig({
      template,
      data: {}
    });

    const app = new AppBlock(config);

    // Should fail to evaluate
    expect(app.el.textContent).not.toContain('Has timestamp');
  });

  test('should allow Date when explicitly enabled', () => {
    const template = createTemplateWithCIf('Date.now() > 0', 'Has timestamp');
    const config = createMockAppBlockConfig({
      template,
      data: {},
      allowBuiltins: ['Date']
    });

    const app = new AppBlock(config);

    // Should successfully evaluate
    expect(app.el.textContent).toContain('Has timestamp');
  });

  test('should allow multiple builtins when configured', () => {
    const template = createTemplateWithCIf('Math.floor(Date.now() / 1000) > 0', 'Unix timestamp');
    const config = createMockAppBlockConfig({
      template,
      data: {},
      allowBuiltins: ['Math', 'Date']
    });

    const app = new AppBlock(config);

    // Both Math and Date should work
    expect(app.el.textContent).toContain('Unix timestamp');
  });

  test('should block window and document globals', () => {
    const template = createTemplateWithCIf('window !== undefined', 'Has window');
    const config = createMockAppBlockConfig({
      template,
      data: {}
    });

    const app = new AppBlock(config);

    // window should be shadowed to undefined
    expect(app.el.textContent).not.toContain('Has window');
  });

  test('should still allow data and methods without builtins', () => {
    const template = createTemplateWithCIf('data.value > 10 && isValid()', 'Valid and big');
    const config = createMockAppBlockConfig({
      template,
      data: { value: 42 },
      methods: {
        isValid(app) {
          return app.data.value !== null;
        }
      }
    });

    const app = new AppBlock(config);

    // Should work fine without any builtins
    expect(app.el.textContent).toContain('Valid and big');
  });
});
