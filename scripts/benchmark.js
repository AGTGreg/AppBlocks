const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(process.cwd(), '.benchmarks');
const BASELINE_FILE = path.join(BASE_DIR, 'baseline.json');

function ensureDir() {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
}

function initBaseline(baseline = { mean: null, samples: [] }) {
  ensureDir();
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2), 'utf8');
  return BASELINE_FILE;
}

/**
 * runBenchmark(scenarioFn, runs = 10)
 * scenarioFn: async function that performs a single render and returns timing in milliseconds
 * returns: { samples: number[], mean: number, baseline: object|null, comparison: { abs, pct }|null }
 */
async function runBenchmark(scenarioFn, runs = 10) {
  if (typeof scenarioFn !== 'function') throw new Error('scenarioFn must be a function');
  const samples = [];
  for (let i = 0; i < runs; i++) {
    const start = Date.now();
    // allow scenarioFn to be sync or return a promise
    await Promise.resolve().then(() => scenarioFn(i));
    const end = Date.now();
    samples.push(end - start);
  }

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;

  let baseline = null;
  if (fs.existsSync(BASELINE_FILE)) {
    try {
      baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
    } catch (err) {
      baseline = null;
    }
  }
  // Compute median for outlier detection
  const sorted = samples.slice().sort((a,b) => a-b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Detect outliers: samples > 200% of median
  const outliers = samples.filter(s => median > 0 ? s > (2 * median) : false);

  let comparison = null;
  if (baseline && typeof baseline.mean === 'number' && baseline.mean > 0) {
    const abs = mean - baseline.mean;
    const pct = (abs / baseline.mean) * 100;
    comparison = { abs, pct };
  }

  // If no baseline exists, initialize one with current measurements
  if (!baseline) {
    try {
      initBaseline({ mean, samples, date: new Date().toISOString() });
      baseline = { mean, samples, date: new Date().toISOString() };
    } catch (err) {
      // ignore write errors
    }
  }

  // Build human-readable report
  let report = `Mean ${mean.toFixed(2)}ms`;
  if (comparison) {
    const sign = comparison.abs >= 0 ? '+' : '-';
    report += ` (${sign}${Math.abs(comparison.pct).toFixed(1)}% vs baseline ${baseline.mean}ms)`;
  } else {
    report += ' (baseline created)';
  }

  if (outliers.length > 0) {
    report += `; outliers: ${outliers.length}/${samples.length}`;
  }

  // Soft regression warning (>10% mean increase)
  if (comparison && comparison.pct > 10) {
    const warnMsg = `Benchmark regression: mean increased by ${comparison.pct.toFixed(1)}% vs baseline`;
    try { console.warn(warnMsg); } catch (err) {}
    report += `; WARNING: ${warnMsg}`;
  }

  return { samples, mean, median, outliers, baseline, comparison, report };
}

module.exports = { ensureDir, initBaseline, runBenchmark };

// Build a simple scenario template string used by the benchmark. Exported for tests.
function buildScenarioTemplate() {
  // Includes: two placeholders, one c-if, one c-for, and a filter marker `|` for filtered placeholders
  return `
  <div>
    <div c-if="data.show">{data.value|upper}</div>
    <ul>
      <li c-for="item in items">{item|trim}</li>
    </ul>
    <div>{data.other}</div>
  </div>`;
}

module.exports.buildScenarioTemplate = buildScenarioTemplate;

// Build a scenario template with 20 conditional directives for performance testing
function buildConditionalScenarioTemplate() {
  let html = '<div>';
  for (let i = 0; i < 20; i++) {
    html += `<div c-if="data.show${i}">{data.value${i}}</div>`;
  }
  html += '</div>';
  return html;
}

module.exports.buildConditionalScenarioTemplate = buildConditionalScenarioTemplate;

// Build a scenario template with method calls in placeholders (nested, filtered, whitespace)
function buildMethodCallScenarioTemplate() {
  // Realistic method call pattern: nested method call with filters and whitespace
  // This tests: nested argument parsing, filter chaining, whitespace tolerance
  return `
  <div>
    <div>{transformMethod( rangeMethod( 1, 5 ) )|upperCase}</div>
    <div>{calculateSum( data.x, data.y )|minusOne}</div>
    <ul>
      <li c-for="item in rangeMethod(data.start, data.end)">{item|trim}</li>
    </ul>
  </div>`;
}

module.exports.buildMethodCallScenarioTemplate = buildMethodCallScenarioTemplate;

// Build a scenario template with deeply nested method calls (≥5 levels)
// Tests recursive argument parsing and call stacking
function buildDeepNestingScenarioTemplate() {
  // Pattern: methodA(methodB(methodC(methodD(methodE(data.prop)))))
  // Tests nested parenthesis parsing and call stack depth
  return `
  <div>
    <div>{methodA(methodB(methodC(methodD(methodE(data.value)))))}</div>
    <div>{methodA(methodB(methodC(methodD(methodE(data.value)))))}</div>
  </div>`;
}

module.exports.buildDeepNestingScenarioTemplate = buildDeepNestingScenarioTemplate;
