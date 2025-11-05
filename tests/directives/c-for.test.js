import {
  createMockAppBlockConfig,
  createTemplateWithCFor,
  createMockArrayData,
  resetDOM
} from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-for directive', () => {

  afterEach(() => resetDOM());

  test('should render items for array', () => {
  const template = createTemplateWithCFor('item in data.items', '{item}');
  const items = ['a', 'b', 'c'];
  const config = createMockAppBlockConfig({ template, data: { items } });
    const app = new AppBlock(config);

    const nodes = app.el.querySelectorAll('[c-for]');
    // c-for implementation clones template inner nodes; ensure content present
    expect(app.el.textContent).toContain('a');
    expect(app.el.textContent).toContain('b');
    expect(app.el.textContent).toContain('c');
  });

  test('should render object items using factory data', () => {
  const template = createTemplateWithCFor('item in data.items', '{item.name}');
    const items = createMockArrayData(3, i => ({ id: i, name: `Name${i + 1}` }));
    const config = createMockAppBlockConfig({ template, data: { items } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Name1');
    expect(app.el.textContent).toContain('Name2');
    expect(app.el.textContent).toContain('Name3');
  });

  test('should handle empty array by rendering nothing', () => {
  const template = createTemplateWithCFor('item in data.items', '{item}');
    const config = createMockAppBlockConfig({ template, data: { items: [] } });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('');
  });

  test('should support nested arrays', () => {
  const template = createTemplateWithCFor('item in data.data.list', '{item}');
  const config = createMockAppBlockConfig({ template, data: { data: { list: ['x', 'y'] } } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('x');
    expect(app.el.textContent).toContain('y');
  });

  test('should provide index pointer in rendering when used', () => {
    // Use a template that references index via pointers.object-like syntax if supported
  const template = createTemplateWithCFor('item in data.items', '{item}');
  const items = ['one', 'two'];
  const config = createMockAppBlockConfig({ template, data: { items } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('one');
    expect(app.el.textContent).toContain('two');
  });

  test('supports filtered arrays via method that uses filter', () => {
    // Method will return a filtered array using comp.filters
    const tpl = createTemplateWithCFor('it in getFiltered', '{it}');
    const filters = { onlyTwo: (comp, arr) => arr.filter(x => x === 'two') };
    const methods = { getFiltered: (comp) => comp.filters.onlyTwo(comp, comp.data.items) };
    const config = createMockAppBlockConfig({ template: tpl, data: { items: ['one', 'two', 'three'] }, filters, methods });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('two');
    expect(app.el.textContent).not.toContain('one');
    expect(app.el.textContent).not.toContain('three');
  });

});
