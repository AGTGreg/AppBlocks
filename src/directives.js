'use strict';

import {getProp, isBlockedExpression} from './utils';
import {processNode} from './processing';
import {updateAttributePlaceholders, updateTextNodePlaceholders} from './placeholders';
import { logError } from './logger';
import { createExpressionContext, handleLegacyOperators } from './helpers';


// Expression evaluation cache and utilities
const expressionCache = new Map();

function compileExpression(expr, methodNames, builtinNames) {
  const cacheKey = expr + '|' + methodNames.join(',') + '|' + builtinNames.join(',');
  if (expressionCache.has(cacheKey)) {
    return expressionCache.get(cacheKey);
  }
  // new Function with strict mode and scoped parameters
  // Make methods and builtins available in scope
  const scopeDefs = [
    ...methodNames.map(k => `const ${k} = methods.${k};`),
    ...builtinNames.map(k => `const ${k} = builtins.${k};`)
  ].join('');
  const body = `"use strict"; ${scopeDefs} return (${expr});`;
  const fn = new Function('data', 'methods', 'builtins', body);
  expressionCache.set(cacheKey, fn);
  return fn;
}

function evaluateToBoolean(expr, ctx, allowBuiltins, logWarning) {
  expr = expr.trim();
  if (expr === '') {
    return false; // empty expression is false
  }
  if (isBlockedExpression(expr)) {
    logWarning('Expression contains blocked constructs: ' + expr);
    return false; // for c-if
  }
  try {
    const methodNames = Object.keys(ctx.methods);
    const builtinNames = allowBuiltins.filter(name => name in globalThis || name === 'Math'); // simple check
    const fn = compileExpression(expr, methodNames, builtinNames);
    const builtins = {};
    if (allowBuiltins.includes('Math')) {
      builtins.Math = Math;
    }
    // Shadow globals
    const result = fn.call(null, ctx.data, ctx.methods, builtins);
    return !!result; // truthiness
  } catch (err) {
    logWarning('Expression evaluation error: ' + err.message + ' in: ' + expr);
    return false;
  }
}


// If and For directives
export const directives = {

  'c-if': function(comp, node, pointers) {
    let attr = node.getAttribute('c-if');
    if (!attr) return true; // no attribute, keep

    // Check if it's a simple property access without operators (backward compatibility)
    const hasOperators = /[\(\)\+\-\*\/%!<>&\|\?\:]/.test(attr) || attr.includes('==') || attr.includes('===') || attr.includes('!=') || attr.includes('!==') || attr.includes('>') || attr.includes('<') || attr.includes('>=') || attr.includes('<=') || attr.includes('&&') || attr.includes('||') || attr.includes('!');

    if (!hasOperators) {
      // Use legacy logic for simple flags
      let result = getProp(comp, attr.split('.'), pointers);
      if (result === undefined) {
        // Handle operators in legacy way
        result = handleLegacyOperators(comp, attr, pointers);
        if (result === undefined) {
          return false;
        }
      }
      const falseValues = [undefined, null, false, 0, ''];
      if (falseValues.indexOf(result) > -1) {
        return false;
      } else {
        node.removeAttribute('c-if');
        return true;
      }
    } else {
      // Use new expression evaluator
      const ctx = createExpressionContext(comp);
      const decision = evaluateToBoolean(attr, ctx, ctx.allowBuiltins, ctx.logWarning);
      if (!decision) {
        return false;
      } else {
        node.removeAttribute('c-if');
        return true;
      }
    }
  },

  // Calls c-if directive and reverses the result.
  'c-ifnot': function(comp, node, pointers) {
    let attr = node.getAttribute('c-ifnot');
    if (!attr) return true;

    // Similar logic to c-if but invert
    const hasOperators = /[\(\)\+\-\*\/%!<>&\|\?\:]/.test(attr) || attr.includes('==') || attr.includes('===') || attr.includes('!=') || attr.includes('!==') || attr.includes('>') || attr.includes('<') || attr.includes('>=') || attr.includes('<=') || attr.includes('&&') || attr.includes('||') || attr.includes('!');

    if (!hasOperators) {
      // Legacy
      let result = getProp(comp, attr.split('.'), pointers);
      if (result === undefined) {
        result = handleLegacyOperators(comp, attr, pointers);
        if (result === undefined) {
          // For c-ifnot, undefined from error means keep node (invert of false)
          node.removeAttribute('c-ifnot');
          return true;
        }
      }
      const falseValues = [undefined, null, false, 0, ''];
      const isFalse = falseValues.indexOf(result) > -1;
      if (isFalse) {
        node.removeAttribute('c-ifnot');
        return true; // invert: was false, now true (keep)
      } else {
        return false; // invert: was true, now false (remove)
      }
    } else {
      // Expression
      const ctx = createExpressionContext(comp);
      const decision = evaluateToBoolean(attr, ctx, ctx.allowBuiltins, ctx.logWarning);
      if (!decision) { // was false, invert to true
        node.removeAttribute('c-ifnot');
        return true;
      } else { // was true, invert to false
        return false;
      }
    }
  },

  'c-for': function(comp, node, pointers) {
    const attr = node.getAttribute('c-for');

    let stParts = attr.split(' in ');
    let pointer = stParts[0];
    const objectKeys = stParts[1].split('.');
    if (pointers === undefined) pointers = {};

    let iterable = getProp(comp, objectKeys, pointers);

    if (iterable) {
      node.removeAttribute('c-for');
      const parentNode = node.parentNode;

      for (let i=0; i<iterable.length; i++) {
        const item = iterable[i];
        // Add a pointer for the current item.
        pointers[pointer] = item;

        const newNode = node.cloneNode(true);
        processNode(comp, newNode, pointers);
        updateAttributePlaceholders(comp, newNode, pointers);
        updateTextNodePlaceholders(comp, newNode, pointers);

        // Reset the pointer.
        stParts = attr.split(' in ');
        pointer = stParts[0];
        parentNode.appendChild(newNode);
      };
      node.remove();
      return true;

    } else {
      return false;
    }

  }
};
