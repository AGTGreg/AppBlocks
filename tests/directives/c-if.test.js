import {
  createMockAppBlockConfig,
  createTemplateWithCIf,
  createMockFalsyData,
  resetDOM
} from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if directive', () => {

  afterEach(() => resetDOM());

  test('should keep node when condition is true', () => {
    const template = createTemplateWithCIf('data.show', 'Visible');
    const config = createMockAppBlockConfig({ template, data: { show: true } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Visible');
  });

  test('should remove node when condition is false', () => {
    const template = createTemplateWithCIf('data.show', 'Hidden');
    const config = createMockAppBlockConfig({ template, data: { show: false } });
    const app = new AppBlock(config);

    const node = app.el.querySelector('[c-if]');
    expect(node).toBeNull();
  });

  test('should treat falsy values as false', () => {
    const falsy = createMockFalsyData();
    Object.entries(falsy).forEach(([key, value]) => {
      const template = createTemplateWithCIf(`data.${key}`, 'Content');
      const config = createMockAppBlockConfig({ template, data: { [key]: value } });
      const app = new AppBlock(config);
      const node = app.el.querySelector('[c-if]');
      expect(node).toBeNull();
      resetDOM();
    });
  });

  test('should handle nested property access', () => {
    const template = createTemplateWithCIf('data.user.active', 'UserActive');
    const config = createMockAppBlockConfig({ template, data: { user: { active: true } } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('UserActive');
  });

  test('should support equality comparison in condition (==)', () => {
    const template = createTemplateWithCIf('data.age == 25', 'Age25');
    const config = createMockAppBlockConfig({ template, data: { age: 25 } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Age25');
  });

  test('should support strict equality (===) and inequality operators for numbers', () => {
    const t1 = createMockAppBlockConfig({ template: createTemplateWithCIf('data.num === 5', 'Num5'), data: { num: 5 } });
    const app1 = new AppBlock(t1);
    expect(app1.el.textContent).toContain('Num5');

    const t2 = createMockAppBlockConfig({ template: createTemplateWithCIf('data.count !== 0', 'NotZero'), data: { count: 1 } });
    const app2 = new AppBlock(t2);
    expect(app2.el.textContent).toContain('NotZero');
  });

  test('should handle missing property gracefully', () => {
    const template = createTemplateWithCIf('data.missing', 'Missing');
    const config = createMockAppBlockConfig({ template, data: {} });
    const app = new AppBlock(config);

    const node = app.el.querySelector('[c-if]');
    expect(node).toBeNull();
  });

  test('supports filters via method wrapper in condition (method applies filter)', () => {
    const tpl = createTemplateWithCIf('checkFlag', 'Yes');
    const filters = { truthy: (comp, v) => Boolean(v) };
    const methods = { checkFlag: (comp) => comp.filters.truthy(comp, comp.data.x) };
    const config = createMockAppBlockConfig({ template: tpl, data: { x: 1 }, filters, methods });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Yes');
  });

  test('method-based filter returns false and node removed', () => {
    const tpl = createTemplateWithCIf('checkFlag', 'No');
    const filters = { truthy: (comp, v) => Boolean(v) };
    const methods = { checkFlag: (comp) => comp.filters.truthy(comp, comp.data.x) };
    const config = createMockAppBlockConfig({ template: tpl, data: { x: 0 }, filters, methods });
    const app = new AppBlock(config);

    const node = app.el.querySelector('[c-if]');
    expect(node).toBeNull();
  });

});
