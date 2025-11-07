const { buildScenarioTemplate, runBenchmark } = require('../../scripts/benchmark.js');
import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, resetDOM } from 'tests/fixtures/mockData.js';

describe('Benchmark runner (basic)', () => {
  afterEach(() => resetDOM());

  test('scenario template contains c-if, c-for and filter markers', () => {
    const tpl = buildScenarioTemplate();
    expect(tpl).toContain('c-if');
    expect(tpl).toContain('c-for');
    expect(tpl).toContain('|');
  });

  test('runBenchmark returns expected shape (10 samples, mean, report)', async () => {
    // Create a simple scenario function that constructs an AppBlock and triggers render
    const scenario = () => {
      const template = document.createElement('template');
      template.innerHTML = buildScenarioTemplate();
      const config = createMockAppBlockConfig({ template, data: { show: true, value: 'x', other: 'y', items: ['a','b','c'] } });
      const app = new AppBlock(config);
      // ensure render executed
      return app;
    };

    const result = await runBenchmark(scenario, 10);
    expect(result).toHaveProperty('samples');
    expect(Array.isArray(result.samples)).toBe(true);
    expect(result.samples.length).toBe(10);
    expect(typeof result.mean).toBe('number');
    expect(typeof result.report).toBe('string');
    // comparison may be null if baseline was just created, but report should exist
    expect(result.report.length).toBeGreaterThan(0);
  }, 20000);

  test('runBenchmark emits warning when regression >10% vs baseline', async () => {
    const fs = require('fs');
    const path = require('path');
    const baselinePath = path.resolve(process.cwd(), '.benchmarks', 'baseline.json');
    // Prepare a tiny baseline with very small mean to force a regression
    const baseline = { mean: 1, samples: [1,1,1], date: new Date().toISOString() };
    if (!fs.existsSync(path.dirname(baselinePath))) fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
    fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2), 'utf8');

    const scenario = () => {
      const template = document.createElement('template');
      template.innerHTML = buildScenarioTemplate();
      const config = createMockAppBlockConfig({ template, data: { show: true, value: 'x', other: 'y', items: ['a','b','c'] } });
      return new AppBlock(config);
    };

    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await runBenchmark(scenario, 5);
    expect(result).toHaveProperty('comparison');
    expect(result.comparison.pct).toBeGreaterThan(10);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  }, 20000);

});
