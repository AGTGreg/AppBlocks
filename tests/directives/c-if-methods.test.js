import { createMockAppBlockConfig, createTemplateWithCIf, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if method calls in expressions', () => {
  afterEach(() => resetDOM());

  test('should pass app instance as first parameter to method', () => {
    const template = createTemplateWithCIf('hasMessages()', 'Has messages');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: ['msg1'] },
      methods: {
        hasMessages(thisApp) {
          expect(thisApp).toBeDefined();
          expect(thisApp.data).toBeDefined();
          return thisApp.data.messages.length > 0;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Has messages');
  });

  test('should render based on method result (true)', () => {
    const template = createTemplateWithCIf('hasMessages()', 'Has messages');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: ['msg1'] },
      methods: {
        hasMessages(thisApp) { return thisApp.data.messages.length > 0; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Has messages');
  });

  test('should render based on method result (false)', () => {
    const template = createTemplateWithCIf('hasMessages()', 'Has messages');
    const config = createMockAppBlockConfig({
      template,
      data: { messages: [] },
      methods: {
        hasMessages(thisApp) { return thisApp.data.messages.length > 0; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).not.toContain('Has messages');
  });

  test('should pass additional parameters to method', () => {
    const template = createTemplateWithCIf('isOldEnough(data.userAge, 18)', 'Adult');
    const config = createMockAppBlockConfig({
      template,
      data: { userAge: 25 },
      methods: {
        isOldEnough(thisApp, age, minimum) {
          return age >= minimum;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Adult');
  });

  test('should handle multiple parameters correctly', () => {
    const template = createTemplateWithCIf('isInRange(data.value, 10, 20)', 'In range');
    const config = createMockAppBlockConfig({
      template,
      data: { value: 15 },
      methods: {
        isInRange(thisApp, val, min, max) {
          return val >= min && val <= max;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('In range');
  });

  test('should work in complex expressions with methods', () => {
    const template = createTemplateWithCIf('isPassing(data.score) && hasAttempts(data.attempts)', 'Success');
    const config = createMockAppBlockConfig({
      template,
      data: { score: 85, attempts: 2 },
      methods: {
        isPassing(thisApp, score) {
          return score >= 60;
        },
        hasAttempts(thisApp, attempts) {
          return attempts > 0;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Success');
  });

  test('should pass arguments by reference when needed', () => {
    const template = createTemplateWithCIf('checkArray(data.items)', 'Valid array');
    const config = createMockAppBlockConfig({
      template,
      data: { items: ['a', 'b'] },
      methods: {
        checkArray(thisApp, arr) {
          arr.push('modified');
          return arr.length > 0;
        }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Valid array');
    expect(app.data.items).toContain('modified'); // reference modified
  });
});