# Benchmarking AppBlocks

This project includes a lightweight benchmark helper to collect repeatable render timings for a standardized scenario and compare results against a local baseline.

Files:
- `scripts/benchmark.js` — small runner exported as a module. It provides `runBenchmark(scenarioFn, runs)` and `initBaseline()` utilities.

Quick usage (Node/Jest environment):

```js
const { runBenchmark, initBaseline } = require('../scripts/benchmark');

// scenarioFn should perform a single render (sync or async) and return when ready.
async function scenario() {
  // construct AppBlock with a reproducible template + data and let it render
}

const result = await runBenchmark(scenario, 10);
console.log(result.report);
```

Behavior:
- Collects `runs` samples (default 10) and returns `{ samples, mean, median, outliers, baseline, comparison, report }`.
- If a baseline is not present, the runner initializes `.benchmarks/baseline.json` with the current mean and samples.
- Outliers are detected as any sample > 200% of the median and are reported as `outliers` in the returned object.
- If the mean increases more than 10% vs baseline, the runner emits a soft regression `console.warn` and includes the note in the `report` string.

Storage:
- Local baseline file path: `.benchmarks/baseline.json` (gitignored). This keeps baselines private to the developer/machine for local regression tracking.

Notes & recommendations:
- Run benchmarks on an otherwise idle machine (avoid background jobs) for more stable measurements.
- Use the same Node/JSDOM environment when comparing results.
- The runner is intentionally simple and focuses on integrated render cost rather than micro-optimizations.

CLI usage
---------

You can run a scenario module from the command line using the small wrapper:

```sh
# Run a scenario module that exports an async function (default export or named `scenario`) 10 times
node scripts/benchmark-run.js ./path/to/yourScenario.js --runs=10

# Initialize a baseline file if missing, then run
node scripts/benchmark-run.js ./path/to/yourScenario.js --init-baseline --runs=10
```

The `scenario` module should export an async function that performs a single render (or other workload) and resolves when ready. For example:

```js
// tests/benchmarks/sampleScenario.js
module.exports = async function scenario() {
  // create an AppBlock instance with a deterministic template + data, wait for render to settle
};
```

The CLI prints a human-readable `report` to stdout and exits with a non-zero code on failure.
