import {
  createMockAppBlockConfig,
  createMockTemplate,
  resetDOM
} from '../fixtures/mockData.js';
import { AppBlock } from '../../build-cjs/core.js';

describe('c-if/c-ifnot consistency with method calls', () => {

  afterEach(() => resetDOM());

  test('method calls in c-if behave consistently across directives', () => {
    const template = createMockTemplate(`
      <div>
        <span c-if="isVisible()">visible</span>
        <span c-ifnot="isHidden()">also visible</span>
        <ul c-for="n in getRange()"><li>{n}</li></ul>
        <p>{getMessage()}</p>
      </div>
    `);
    const config = createMockAppBlockConfig({
      template,
      methods: {
        isVisible: function(app) { return true; },
        isHidden: function(app) { return false; },
        getRange: function(app) { return [1, 2]; },
        getMessage: function(app) { return 'test'; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.querySelector('span').textContent).toContain('visible');
    expect(app.el.querySelectorAll('span')[1].textContent).toContain('also visible');
    expect(app.el.querySelectorAll('li').length).toBe(2);
    expect(app.el.querySelector('p').textContent).toContain('test');
  });

  test('method calls with parameters work consistently in c-if and placeholders', () => {
    const template = createMockTemplate(`
      <div>
        <span c-if="hasValue(data.value)">has value</span>
        <span>{displayValue(data.value)}</span>
      </div>
    `);
    const config = createMockAppBlockConfig({
      template,
      data: { value: 'test' },
      methods: {
        hasValue: function(app, val) { return !!val; },
        displayValue: function(app, val) { return val || 'none'; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.querySelectorAll('span')[0].textContent).toContain('has value');
    expect(app.el.querySelectorAll('span')[1].textContent).toContain('test');
  });

});