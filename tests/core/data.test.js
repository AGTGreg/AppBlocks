/**
 * Tests for AppBlock data management: setData and resetState
 */
import { AppBlock } from 'src/core.js';
import {
  createMockAppBlockConfig,
  createMockData,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('AppBlock Data Management', () => {

  afterEach(() => resetDOM());

  test('setData merges by default', () => {
    const initial = createMockData();
    const config = createMockAppBlockConfig({ data: { a: 1, b: 2 } });
    const app = new AppBlock(config);

    app.setData({ b: 3, c: 4 });

    expect(app.data.a).toBe(1);
    expect(app.data.b).toBe(3);
    expect(app.data.c).toBe(4);
  });

  test('setData with replace flag replaces data object', () => {
    const config = createMockAppBlockConfig({ data: { x: 1, y: 2 } });
    const app = new AppBlock(config);

    app.setData({ new: 'value' }, true);

    expect(app.data.x).toBeUndefined();
    expect(app.data.new).toBe('value');
  });

  test('resetState clears loading/error/success flags', () => {
    const config = createMockAppBlockConfig();
    const app = new AppBlock(config);

    app.state.loading = true;
    app.state.error = true;
    app.state.success = true;

    app.resetState();

    expect(app.state.loading).toBe(false);
    expect(app.state.error).toBe(false);
    expect(app.state.success).toBe(false);
  });

});
