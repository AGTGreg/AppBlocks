import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('Filter chaining', () => {
  afterEach(() => resetDOM());

  test('should chain two filters in correct order', () => {
    const tpl = createMockTemplate('<div>{data.value|double|addTen}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { value: 5 },
      filters: {
        double: (comp, v) => v * 2,
        addTen: (comp, v) => v + 10
      }
    });
    const app = new AppBlock(config);

    // 5 -> double -> 10 -> addTen -> 20
    expect(app.el.textContent.trim()).toBe('20');
  });

  test('should chain three filters in correct order', () => {
    const tpl = createMockTemplate('<div>{data.num|double|square|half}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { num: 4 },
      filters: {
        double: (comp, v) => v * 2,
        square: (comp, v) => v * v,
        half: (comp, v) => v / 2
      }
    });
    const app = new AppBlock(config);

    // 4 -> double -> 8 -> square -> 64 -> half -> 32
    expect(app.el.textContent.trim()).toBe('32');
  });

  test('should chain string transformation filters', () => {
    const tpl = createMockTemplate('<div>{data.name|trim|uppercase|wrap}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { name: '  hello  ' },
      filters: {
        trim: (comp, v) => String(v).trim(),
        uppercase: (comp, v) => String(v).toUpperCase(),
        wrap: (comp, v) => `[${v}]`
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('[HELLO]');
  });

  test('should handle empty filter chain (just property access)', () => {
    const tpl = createMockTemplate('<div>{data.message}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { message: 'no filters' }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('no filters');
  });

  test('should chain filters with type transformations', () => {
    const tpl = createMockTemplate('<div>{data.price|withTax|formatCurrency}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { price: 100, taxRate: 0.2 },
      filters: {
        withTax: (comp, v) => v + (v * comp.data.taxRate),
        formatCurrency: (comp, v) => `$${v.toFixed(2)}`
      }
    });
    const app = new AppBlock(config);

    // 100 -> withTax -> 120 -> formatCurrency -> $120.00
    expect(app.el.textContent.trim()).toBe('$120.00');
  });

  test('should chain filters in attributes', () => {
    const tpl = createMockTemplate('<div class="{data.status|validate|classPrefix}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { status: 'active' },
      filters: {
        validate: (comp, v) => v || 'unknown',
        classPrefix: (comp, v) => `status-${v}`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('status-active');
  });

  test('should chain filters with c-for directive', () => {
    const tpl = createMockTemplate(`
      <div c-for="item in data.items">
        {item.name|uppercase|exclaim}
      </div>
    `);
    const config = createMockAppBlockConfig({
      template: tpl,
      data: {
        items: [
          { name: 'apple' },
          { name: 'banana' }
        ]
      },
      filters: {
        uppercase: (comp, v) => String(v).toUpperCase(),
        exclaim: (comp, v) => `${v}!`
      }
    });
    const app = new AppBlock(config);

    const divs = app.el.querySelectorAll('div');
    expect(divs[0].textContent.trim()).toBe('APPLE!');
    expect(divs[1].textContent.trim()).toBe('BANANA!');
  });

  test('should handle long filter chains (5+ filters)', () => {
    const tpl = createMockTemplate('<div>{data.val|f1|f2|f3|f4|f5}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { val: 1 },
      filters: {
        f1: (comp, v) => v + 1,  // 2
        f2: (comp, v) => v * 2,  // 4
        f3: (comp, v) => v + 3,  // 7
        f4: (comp, v) => v * 2,  // 14
        f5: (comp, v) => v + 1   // 15
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('15');
  });

  test('should handle filters that access comp.data in chain', () => {
    const tpl = createMockTemplate('<div>{data.base|addFactor|double}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { base: 10, factor: 5 },
      filters: {
        addFactor: (comp, v) => v + comp.data.factor,
        double: (comp, v) => v * 2
      }
    });
    const app = new AppBlock(config);

    // 10 -> addFactor(+5) -> 15 -> double -> 30
    expect(app.el.textContent.trim()).toBe('30');
  });

  test('should handle filter chain where one filter returns empty string', () => {
    const tpl = createMockTemplate('<div>{data.text|maybeEmpty|wrap}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { text: '' },
      filters: {
        maybeEmpty: (comp, v) => v || '',
        wrap: (comp, v) => `[${v}]`
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('[]');
  });

  test('should handle filter chain with null values in middle', () => {
    const tpl = createMockTemplate('<div>{data.val|toNull|stringify}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { val: 'test' },
      filters: {
        toNull: (comp, v) => null,
        stringify: (comp, v) => String(v)
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('null');
  });

  test('should preserve filter chain order when updating data', () => {
    const tpl = createMockTemplate('<div>{data.count|double|addTen}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { count: 5 },
      filters: {
        double: (comp, v) => v * 2,
        addTen: (comp, v) => v + 10
      }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('20');

    // Update data and verify filters still chain correctly
    app.data.count = 10;
    app.render();

    // 10 -> double -> 20 -> addTen -> 30
    expect(app.el.textContent.trim()).toBe('30');
  });
});
