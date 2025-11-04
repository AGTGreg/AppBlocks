/**
 * Verification tests for AppBlock initialization
 * These tests validate that the testing framework works correctly
 */

// Use ESM-style imports and moduleNameMapper to resolve `src/` and `tests/` paths
import { AppBlock } from 'src/core.js';
import {
  createMockElement,
  createMockTemplate,
  createMockAppBlockConfig,
  createEmptyData,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('AppBlock Initialization', () => {

  afterEach(() => {
    // Reset DOM between tests
    resetDOM();
  });

  test('initializes correctly with valid config', () => {
    // Arrange
    const config = createMockAppBlockConfig();

  // Act
  const app = new AppBlock(config);

    // Assert
    expect(app).toBeDefined();
    expect(app.el).toBe(config.el);
    expect(app.data).toEqual(config.data);
    expect(app.name).toBe('test-app');
  });

  test('handles empty data gracefully', () => {
    // Arrange
    const config = createMockAppBlockConfig({
      data: createEmptyData()
    });

  // Act
  const app = new AppBlock(config);

    // Assert
    expect(app).toBeDefined();
    expect(app.data).toEqual({});
  });

  test('handles missing template by using el content', () => {
    // Arrange
    const el = createMockElement();
    el.innerHTML = '<p>Inline content</p>';
    const config = createMockAppBlockConfig({
      el,
      template: undefined
    });

  // Act
  const app = new AppBlock(config);

    // Assert
    expect(app).toBeDefined();
    expect(app.template).toBeDefined();
  });

  test('handles missing element with error', () => {
    // Arrange
    const config = createMockAppBlockConfig({
      el: null
    });

  // Act
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const app = new AppBlock(config);

    // Assert: when constructed with `new`, the constructor returns an object but
    // initialization logged an error and no `el` was assigned.
    expect(app.el).toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

});
