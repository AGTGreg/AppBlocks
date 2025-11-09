import {
  createMockAppBlockConfig,
  createMockTemplate,
  resetDOM
} from '../fixtures/mockData.js';
import { AppBlock } from '../../build-cjs/core.js';

describe('c-for with Method Calls', () => {

  afterEach(() => resetDOM());

  test('should iterate over result of method call', () => {
    const template = createMockTemplate('<ul c-for="n in rangeMethod(data.start, data.end)"><li>{n}</li></ul>');
    const config = createMockAppBlockConfig({
      template,
      data: { start: 1, end: 3 },
      methods: {
        rangeMethod: function(app, start, end) { return [start, start+1, end]; }
      }
    });
    const app = new AppBlock(config);

    const lis = app.el.querySelectorAll('li');
    console.log('Number of LIs:', lis.length);
    console.log('LI contents:', Array.from(lis).map(li => `"${li.textContent}"`).join(', '));

    expect(lis.length).toBe(3);
    expect(lis[0].textContent).toContain('1');
    expect(lis[1].textContent).toContain('2');
    expect(lis[2].textContent).toContain('3');
  });

  test('should log error and skip iteration when method returns non-iterable', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const template = createMockTemplate('<ul c-for="n in getScalar()"><li>{n}</li></ul>');
    const config = createMockAppBlockConfig({
      template,
      methods: {
        getScalar: function(app) { return 42; }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.querySelectorAll('li').length).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith('test-app: [method-call-error] getScalar() : Result is not iterable');

    consoleSpy.mockRestore();
  });

  test('should handle nested method calls in iterable expression', () => {
    const template = createMockTemplate('<ul c-for="n in transformMethod(rangeMethod(data.start, data.end))"><li>{n}</li></ul>');
    const config = createMockAppBlockConfig({
      template,
      data: { start: 1, end: 2 },
      methods: {
        rangeMethod: function(app, start, end) { return Array.from({length: end - start + 1}, (_, i) => start + i); },
        transformMethod: function(app, arr) { return arr.map(x => x * 10); }
      }
    });
    const app = new AppBlock(config);

    expect(app.el.querySelectorAll('li').length).toBe(2);
    expect(app.el.querySelectorAll('li')[0].textContent).toContain('10');
    expect(app.el.querySelectorAll('li')[1].textContent).toContain('20');
  });

});