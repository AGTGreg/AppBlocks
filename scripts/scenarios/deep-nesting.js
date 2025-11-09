/**
 * Benchmark scenario: Deep nesting (≥5 levels)
 * Tests: recursive argument parsing, nested parenthesis handling, call stack depth
 * 
 * Expected overhead: Should remain <5% despite deep nesting
 */

// Set up DOM for Node.js environment
if (typeof document === 'undefined') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
}

const { buildDeepNestingScenarioTemplate } = require('../benchmark.js');

// Nested methods that call each other
const customMethods = {
  methodA: (app, val) => {
    // A wraps value in array
    return Array.isArray(val) ? val : [val];
  },
  methodB: (app, val) => {
    // B gets first element or returns 0
    return Array.isArray(val) ? val[0] : val;
  },
  methodC: (app, val) => {
    // C multiplies by 2
    return (val || 0) * 2;
  },
  methodD: (app, val) => {
    // D adds 1
    return (val || 0) + 1;
  },
  methodE: (app, val) => {
    // E wraps in array
    return Array.isArray(val) ? val : [val];
  }
};

async function scenario(iteration) {
  const path = require('path');
  const AppBlock = require(path.resolve(__dirname, '../../dist/appblocks.cjs.js'));
  
  const template = document.createElement('template');
  template.innerHTML = buildDeepNestingScenarioTemplate();
  
  const config = {
    template,
    data: {
      value: 42
    },
    methods: customMethods
  };
  
  const app = new AppBlock(config);
  
  // Trigger render
  return app;
}

module.exports = scenario;
