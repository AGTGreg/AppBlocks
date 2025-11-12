import { applyCustomFilter, filters } from 'src/filters.js';
import { createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('applyCustomFilter - direct function tests', () => {
  afterEach(() => {
    resetDOM();
    // Clean up any filters added during tests
    Object.keys(filters).forEach(key => delete filters[key]);
  });

  test('should apply a registered filter and return transformed value', () => {
    // Register a filter
    filters.uppercase = (comp, value) => String(value).toUpperCase();

    const mockComp = new AppBlock(createMockAppBlockConfig());
    const result = applyCustomFilter(mockComp, 'hello', 'uppercase');

    expect(result).toBe('HELLO');
  });

  test('should return original value when filter is not registered', () => {
    const mockComp = new AppBlock(createMockAppBlockConfig());
    const result = applyCustomFilter(mockComp, 'test value', 'nonExistentFilter');

    expect(result).toBe('test value');
  });

  test('should log error when filter is not registered', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockComp = new AppBlock(createMockAppBlockConfig());
    applyCustomFilter(mockComp, 'test', 'unknownFilter');

    expect(consoleErrorSpy).toHaveBeenCalled();
    const errorMessage = consoleErrorSpy.mock.calls[0][0];
    expect(errorMessage).toContain('unknownFilter');
    expect(errorMessage).toContain('not a registered filter');

    consoleErrorSpy.mockRestore();
  });

  test('should pass comp instance as first parameter to filter', () => {
    let receivedComp = null;
    filters.testFilter = (comp, value) => {
      receivedComp = comp;
      return value;
    };

    const mockComp = new AppBlock(createMockAppBlockConfig());
    applyCustomFilter(mockComp, 'test', 'testFilter');

    expect(receivedComp).toBe(mockComp);
    expect(receivedComp).toBeInstanceOf(AppBlock);
  });

  test('should pass value as second parameter to filter', () => {
    let receivedValue = null;
    filters.captureValue = (comp, value) => {
      receivedValue = value;
      return value;
    };

    const mockComp = new AppBlock(createMockAppBlockConfig());
    const testValue = 'my test value';
    applyCustomFilter(mockComp, testValue, 'captureValue');

    expect(receivedValue).toBe(testValue);
  });

  test('should handle filter that returns different type', () => {
    filters.toNumber = (comp, value) => Number(value);

    const mockComp = new AppBlock(createMockAppBlockConfig());
    const result = applyCustomFilter(mockComp, '42', 'toNumber');

    expect(result).toBe(42);
    expect(typeof result).toBe('number');
  });

  test('should handle filter that returns null', () => {
    filters.returnNull = (comp, value) => null;

    const mockComp = new AppBlock(createMockAppBlockConfig());
    const result = applyCustomFilter(mockComp, 'anything', 'returnNull');

    expect(result).toBeNull();
  });

  test('should handle filter that returns undefined', () => {
    filters.returnUndefined = (comp, value) => undefined;

    const mockComp = new AppBlock(createMockAppBlockConfig());
    const result = applyCustomFilter(mockComp, 'anything', 'returnUndefined');

    expect(result).toBeUndefined();
  });

  test('should work with filter accessing comp.data', () => {
    filters.withTax = (comp, value) => {
      const taxRate = comp.data.taxRate || 0;
      return value + (value * taxRate);
    };

    const config = createMockAppBlockConfig({ data: { taxRate: 0.1 } });
    const mockComp = new AppBlock(config);
    const result = applyCustomFilter(mockComp, 100, 'withTax');

    expect(result).toBe(110);
  });

  test('should handle empty string filter name', () => {
    const mockComp = new AppBlock(createMockAppBlockConfig());
    const result = applyCustomFilter(mockComp, 'test', '');

    // Empty string is not in filters object, so should return original value
    expect(result).toBe('test');
  });

  test('should handle multiple different filters independently', () => {
    filters.double = (comp, value) => value * 2;
    filters.square = (comp, value) => value * value;
    filters.addTen = (comp, value) => value + 10;

    const mockComp = new AppBlock(createMockAppBlockConfig());

    expect(applyCustomFilter(mockComp, 5, 'double')).toBe(10);
    expect(applyCustomFilter(mockComp, 5, 'square')).toBe(25);
    expect(applyCustomFilter(mockComp, 5, 'addTen')).toBe(15);
  });
});
