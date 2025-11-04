import { createMockDirective } from 'tests/fixtures/mockData.js';

describe('Mock Directive fixture', () => {
  test('createMockDirective returns a function that evaluates truthy values', () => {
    const dir = createMockDirective();
    expect(typeof dir).toBe('function');
    expect(dir(true)).toBe(true);
    expect(dir(false)).toBe(false);
  });

  test('createMockDirective accepts a custom resolver function', () => {
    const dir = createMockDirective((v) => v === 'show');
    expect(dir('show')).toBe(true);
    expect(dir('hide')).toBe(false);
  });
});
