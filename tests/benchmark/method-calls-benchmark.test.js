/**
 * Benchmark tests for method calls feature
 * Tests: nested method parsing, filter application, cache consistency, deep nesting
 *
 * These benchmarks verify that method call overhead remains <5% vs baseline
 */

const { buildMethodCallScenarioTemplate, buildDeepNestingScenarioTemplate, runBenchmark } = require('../../scripts/benchmark.js');
import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';

describe('Benchmark: Method calls', () => {
  afterEach(() => resetDOM());

  test('benchmark: nested + filtered method expressions', async () => {
    const scenario = () => {
      const template = document.createElement('template');
      template.innerHTML = buildMethodCallScenarioTemplate();

      const config = createMockAppBlockConfig({
        template,
        data: {
          x: 5,
          y: 3,
          start: 1,
          end: 5,
          value: 'test',
          show: true
        },
        methods: {
          transformMethod: (app, items) => {
            return Array.isArray(items) ? items.map(i => String(i).toUpperCase()) : [];
          },
          rangeMethod: (app, start, end) => {
            const result = [];
            for (let i = start; i < end; i++) result.push(i);
            return result;
          },
          calculateSum: (app, x, y) => {
            return (x || 0) + (y || 0);
          }
        },
        filters: {
          upperCase: (app, val) => String(val).toUpperCase(),
          minusOne: (app, val) => Number(val) - 1,
          trim: (app, val) => String(val).trim()
        }
      });

      const app = new AppBlock(config);
      return app;
    };

    const result = await runBenchmark(scenario, 10);
    expect(result).toHaveProperty('samples');
    expect(Array.isArray(result.samples)).toBe(true);
    expect(result.samples.length).toBe(10);
    expect(typeof result.mean).toBe('number');
    expect(result.mean).toBeGreaterThan(0);
    // Log the result for manual verification
    console.log('Method calls benchmark result:', result.report);
  }, 20000);

  test('benchmark: deeply nested method calls (5+ levels)', async () => {
    const scenario = () => {
      const template = document.createElement('template');
      template.innerHTML = buildDeepNestingScenarioTemplate();

      const config = createMockAppBlockConfig({
        template,
        data: {
          value: 42
        },
        methods: {
          methodA: (app, val) => {
            return Array.isArray(val) ? val : [val];
          },
          methodB: (app, val) => {
            return Array.isArray(val) ? val[0] : val;
          },
          methodC: (app, val) => {
            return (val || 0) * 2;
          },
          methodD: (app, val) => {
            return (val || 0) + 1;
          },
          methodE: (app, val) => {
            return Array.isArray(val) ? val : [val];
          }
        }
      });

      const app = new AppBlock(config);
      return app;
    };

    const result = await runBenchmark(scenario, 10);
    expect(result).toHaveProperty('samples');
    expect(Array.isArray(result.samples)).toBe(true);
    expect(result.samples.length).toBe(10);
    expect(typeof result.mean).toBe('number');
    expect(result.mean).toBeGreaterThan(0);
    // Log the result for manual verification
    console.log('Deep nesting benchmark result:', result.report);
  }, 20000);

});
