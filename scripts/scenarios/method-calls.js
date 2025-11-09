/**
 * Benchmark scenario: Method calls with nested expressions and filters
 * Tests: nested method parsing, filter application, cache consistency
 * 
 * Expected overhead: <5% vs baseline
 */

// Set up DOM for Node.js environment
if (typeof document === 'undefined') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
}

const { buildMethodCallScenarioTemplate } = require('../benchmark.js');

// Custom mock methods for testing (app.methods will provide these)
const customMethods = {
  transformMethod: (app, items) => {
    // Transform an array of items (uppercase first char)
    return Array.isArray(items) ? items.map(i => String(i).toUpperCase()) : [];
  },
  rangeMethod: (app, start, end) => {
    // Generate range [start, end)
    const result = [];
    for (let i = start; i < end; i++) result.push(i);
    return result;
  },
  calculateSum: (app, x, y) => {
    // Simple sum operation
    return (x || 0) + (y || 0);
  }
};

const customFilters = {
  upperCase: (app, val) => String(val).toUpperCase(),
  minusOne: (app, val) => Number(val) - 1,
  trim: (app, val) => String(val).trim()
};

async function scenario(iteration) {
  const path = require('path');
  const AppBlock = require(path.resolve(__dirname, '../../dist/appblocks.cjs.js'));
  
  const template = document.createElement('template');
  template.innerHTML = buildMethodCallScenarioTemplate();
  
  const config = {
    template,
    data: {
      x: 5,
      y: 3,
      start: 1,
      end: 5,
      value: 'test'
    },
    methods: customMethods,
    filters: customFilters
  };
  
  const app = new AppBlock(config);
  
  // Trigger render
  return app;
}

module.exports = scenario;
