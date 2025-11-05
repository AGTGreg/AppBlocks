import { getProp } from 'src/utils.js';
import { AppBlock } from 'src/core.js';
import {
  createMockAppBlockConfig,
  createMockArrayData,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('getProp utility', () => {

  afterEach(() => resetDOM());

  test('should return nested property value from comp.data', () => {
    const config = createMockAppBlockConfig({ data: { user: { name: 'Alice' } } });
    const app = new AppBlock(config);

    const val = getProp(app, ['data', 'user', 'name']);
    expect(val).toBe('Alice');
  });

  test('should resolve pointer values before component', () => {
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);

    const pointers = { item: { id: 7 } };
    const val = getProp(app, ['item', 'id'], pointers);
    expect(val).toBe(7);
  });

  test('should call method on comp.methods when firstKey matches', () => {
    const cfg = createMockAppBlockConfig({ methods: { getCount() { return 42; } } });
    const app = new AppBlock(cfg);

    const val = getProp(app, ['getCount']);
    expect(val).toBe(42);
  });

  test('should support bracket notation for arrays (list[1].name)', () => {
    const items = createMockArrayData(3, i => ({ id: i, name: `Name${i + 1}` }));
    const config = createMockAppBlockConfig({ data: { list: items } });
    const app = new AppBlock(config);

    const val = getProp(app, ['data', 'list[1]', 'name']);
    expect(val).toBe('Name2');
  });

  test('should return undefined for missing properties', () => {
    const config = createMockAppBlockConfig({ data: {} });
    const app = new AppBlock(config);

    const val = getProp(app, ['data', 'nope']);
    expect(val).toBeUndefined();
  });

});
