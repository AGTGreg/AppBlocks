#!/usr/bin/env node
'use strict';

// Minimal CLI wrapper for scripts/benchmark.js
// Usage:
//   node scripts/benchmark-run.js <scenarioModule> --runs=10 [--init-baseline]
// The scenario module should export an async function named `scenario` or a default async function.

const path = require('path');

function parseArgs(argv) {
  const args = { runs: 10, initBaseline: false, module: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--runs=')) args.runs = parseInt(a.split('=')[1], 10) || 10;
    else if (a === '--init-baseline') args.initBaseline = true;
    else if (!args.module) args.module = a;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.module) {
    console.error('Usage: node scripts/benchmark-run.js <scenarioModule> --runs=10 [--init-baseline]');
    process.exit(2);
  }

  const benchmark = require('./benchmark');

  if (args.initBaseline) {
    try {
      await benchmark.initBaseline();
      console.log('Initialized baseline (if none existed).');
    } catch (err) {
      console.error('Failed to init baseline:', err && err.message ? err.message : err);
    }
  }

  // Resolve module path relative to repo root (script location)
  const modulePath = path.isAbsolute(args.module) ? args.module : path.resolve(process.cwd(), args.module);
  let mod;
  try {
    mod = require(modulePath);
  } catch (err) {
    console.error('Failed to load scenario module at', modulePath, err && err.message ? err.message : err);
    process.exit(3);
  }

  const scenario = (typeof mod === 'function') ? mod : (mod && (mod.scenario || mod.default));
  if (typeof scenario !== 'function') {
    console.error('Scenario module must export an async function (default or named `scenario`).');
    process.exit(4);
  }

  try {
    const result = await benchmark.runBenchmark(scenario, args.runs);
    console.log('\nBenchmark report:\n');
    console.log(result.report);
    process.exit(0);
  } catch (err) {
    console.error('Benchmark failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

if (require.main === module) main();
