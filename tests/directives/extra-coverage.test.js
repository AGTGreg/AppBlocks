import { directives } from 'src/directives.js';
import { AppBlock } from 'src/core.js';
import {
  createMockAppBlockConfig,
  createTemplateWithCFor,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('directives - extra coverage', () => {
  afterEach(() => resetDOM());

  test('c-if should return true when attribute is missing or empty', () => {
    const comp = { name: 'test-app', data: {}, methods: {}, allowBuiltins: [], filters: {} };
    const node = document.createElement('div');

    // No attribute present
    expect(directives['c-if'](comp, node, undefined, new Map())).toBe(true);

    // Empty attribute
    node.setAttribute('c-if', '');
    expect(directives['c-if'](comp, node, undefined, new Map())).toBe(true);
  });

  test('c-ifnot should return true when attribute is missing or empty', () => {
    const comp = { name: 'test-app', data: {}, methods: {}, allowBuiltins: [], filters: {} };
    const node = document.createElement('div');

    // No attribute present
    expect(directives['c-ifnot'](comp, node, undefined, new Map())).toBe(true);

    // Empty attribute
    node.setAttribute('c-ifnot', '');
    expect(directives['c-ifnot'](comp, node, undefined, new Map())).toBe(true);
  });

  test('c-for should handle iterable types like Set (and Map entries via Array.from)', () => {
    const tplSet = createTemplateWithCFor('it in data.items', '{it}');
    const itemsSet = new Set(['alpha', 'beta', 'gamma']);
    const cfgSet = createMockAppBlockConfig({ template: tplSet, data: { items: itemsSet } });
    const appSet = new AppBlock(cfgSet);

    expect(appSet.el.textContent).toContain('alpha');
    expect(appSet.el.textContent).toContain('beta');
    expect(appSet.el.textContent).toContain('gamma');

    // Map iteration: items will be arrays like [key, value] when rendered as {it}
    const tplMap = createTemplateWithCFor('pair in data.mapItems', '{pair}');
    const map = new Map([['k1', 'v1'], ['k2', 'v2']]);
    const cfgMap = createMockAppBlockConfig({ template: tplMap, data: { mapItems: map } });
    const appMap = new AppBlock(cfgMap);

    // Array-to-string conversion produces "k1,v1" etc.
    expect(appMap.el.textContent).toContain('k1');
    expect(appMap.el.textContent).toContain('v1');
    expect(appMap.el.textContent).toContain('k2');
    expect(appMap.el.textContent).toContain('v2');
  });

  test('c-if should treat whitespace-only attribute as empty expression (false)', () => {
    const comp = { name: 'test-app', data: {}, methods: {}, allowBuiltins: [], filters: {} };
    const node = document.createElement('div');
    node.setAttribute('c-if', '   ');

    // trimmed expression is empty -> evaluateToBoolean should return false -> directive returns false
    expect(directives['c-if'](comp, node, undefined, new Map())).toBe(false);
  });

  test('c-if should block dangerous expressions via isBlockedExpression', () => {
    const comp = { name: 'test-app', data: {}, methods: {}, allowBuiltins: [], filters: {} };
    const node = document.createElement('div');
    node.setAttribute('c-if', 'eval("1")');

    // Blocked expression -> evaluateToBoolean returns false -> directive returns false
    expect(directives['c-if'](comp, node, undefined, new Map())).toBe(false);
  });

});
