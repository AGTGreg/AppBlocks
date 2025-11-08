import {
  createMockAppBlockConfig,
  createMockTemplate,
  resetDOM
} from '../fixtures/mockData.js';
import { AppBlock } from '../../build-cjs/core.js';

describe('Placeholder Method Calls', () => {

  afterEach(() => resetDOM());

  test('should invoke method with parameters in placeholder', () => {
    const template = createMockTemplate('<div>{sumMethod(data.a, data.b)}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { a: 2, b: 3 },
      methods: {
        sumMethod: function(app, a, b) { return a + b; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('5');
  });

  test('should apply filter chains after method call result', () => {
    const template = createMockTemplate('<div>{sumMethod(data.a, data.b)|minusOne}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { a: 2, b: 3 },
      methods: {
        sumMethod: function(app, a, b) { return a + b; }
      },
      filters: {
        minusOne: function(app, value) { return value - 1; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('4');
  });

  test('should handle whitespace in method call expressions', () => {
    const template = createMockTemplate('<div>{sumMethod( data.a , data.b )}</div>');
    const config = createMockAppBlockConfig({
      template,
      data: { a: 2, b: 3 },
      methods: {
        sumMethod: function(app, a, b) { return a + b; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('5');
  });

  test('should inject app instance for method with no arguments', () => {
    const template = createMockTemplate('<div>{getAppName()}</div>');
    const config = createMockAppBlockConfig({
      template,
      name: 'my-app',
      methods: {
        getAppName: function(app) { return app.name; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('my-app');
  });

  test('should render empty string for null method return', () => {
    const template = createMockTemplate('<div>{getNull()}</div>');
    const config = createMockAppBlockConfig({
      template,
      methods: {
        getNull: function(app) { return null; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('');
  });

  test('should render empty string for undefined method return', () => {
    const template = createMockTemplate('<div>{getUndefined()}</div>');
    const config = createMockAppBlockConfig({
      template,
      methods: {
        getUndefined: function(app) { return undefined; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('');
  });

  test('should log error and render empty string when method throws', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const template = createMockTemplate('<div>{throwError()}</div>');
    const config = createMockAppBlockConfig({
      template,
      methods: {
        throwError: function(app) { throw new Error('Test error'); }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('');
    expect(consoleSpy).toHaveBeenCalledWith('test-app: [method-call-error] throwError() : Test error');

    consoleSpy.mockRestore();
  });

});