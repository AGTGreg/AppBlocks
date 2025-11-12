#!/usr/bin/env node

/**
 * Adds Istanbul ignore comments to Babel helper functions in transpiled code
 * to exclude them from coverage reports.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build-cjs');

// Babel helper function patterns to ignore
const BABEL_HELPERS = [
  '_slicedToArray',
  '_nonIterableRest',
  '_iterableToArrayLimit',
  '_arrayWithHoles',
  '_typeof',
  '_createForOfIteratorHelper',
  '_toConsumableArray',
  '_nonIterableSpread',
  '_unsupportedIterableToArray',
  '_iterableToArray',
  '_arrayWithoutHoles',
  '_arrayLikeToArray'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add ignore comments before each Babel helper function
  BABEL_HELPERS.forEach(helperName => {
    const functionPattern = new RegExp(`(function ${helperName}\\()`, 'g');
    if (functionPattern.test(content) && !content.includes(`/* istanbul ignore next */ function ${helperName}`)) {
      content = content.replace(
        functionPattern,
        `/* istanbul ignore next */\nfunction ${helperName}(`
      );
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Added coverage ignores to ${path.relative(BUILD_DIR, filePath)}`);
  }
}

// Process all JS files in build-cjs
if (fs.existsSync(BUILD_DIR)) {
  const files = fs.readdirSync(BUILD_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(BUILD_DIR, file));
  
  files.forEach(processFile);
  console.log('\nDone! Babel helpers will be excluded from coverage reports.');
} else {
  console.log('build-cjs directory not found. Skipping coverage ignore step.');
}

