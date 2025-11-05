import { hasOwn, isObject, deepClone } from 'src/utils.js';
import { createMockArrayData } from 'tests/fixtures/mockData.js';

describe('utils helpers', () => {

  test('hasOwn detects own properties', () => {
    const obj = Object.create({ inherited: true });
    obj.own = 1;
    expect(hasOwn(obj, 'own')).toBe(true);
    expect(hasOwn(obj, 'inherited')).toBe(false);
  });

  test('isObject returns true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });

  test('deepClone creates distinct deep copy', () => {
    const src = { a: { b: [1,2,3] }, c: 5 };
    const copy = deepClone(src);
    expect(copy).not.toBe(src);
    expect(copy.a).not.toBe(src.a);
    expect(copy.a.b).not.toBe(src.a.b);
    expect(copy).toEqual(src);
  });

  test('deepClone clones arrays of objects correctly', () => {
    const arr = createMockArrayData(2, i => ({ id: i, name: `N${i}` }));
    const copy = deepClone(arr);
    expect(copy).not.toBe(arr);
    expect(copy[0]).not.toBe(arr[0]);
    expect(copy).toEqual(arr);
  });

});
