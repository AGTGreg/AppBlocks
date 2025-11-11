'use strict';

import {getProp, isBlockedExpression} from './utils';
import {processNode} from './processing';
import {updateAttributePlaceholders, updateTextNodePlaceholders} from './placeholders';
import { logError } from './logger';
import { createExpressionContext, handleLegacyOperators, evaluateTemplateExpression } from './helpers';


// Expression evaluation cache and utilities
const expressionCache = new Map();

function compileExpression(expr, methodNames, builtinNames) {
  const cacheKey = expr + '|' + methodNames.join(',') + '|' + builtinNames.join(',');
  if (expressionCache.has(cacheKey)) {
    return expressionCache.get(cacheKey);
  }
  // new Function with strict mode and scoped parameters
  // Shadow all common globals unless explicitly allowed
  const commonGlobals = ['Math', 'Date', 'Object', 'Array', 'String', 'Number', 'Boolean',
                          'RegExp', 'JSON', 'Promise', 'Set', 'Map', 'WeakMap', 'WeakSet',
                          'Symbol', 'Proxy', 'Reflect', 'Error', 'TypeError', 'ReferenceError',
                          'window', 'document', 'globalThis', 'console', 'setTimeout', 'setInterval'];

  const disallowedGlobals = commonGlobals.filter(name => !builtinNames.includes(name));
  const shadowDefs = disallowedGlobals.map(g => `const ${g} = undefined;`).join('');

  // Make methods and builtins available in scope
  const scopeDefs = [
    ...methodNames.map(k => `const ${k} = methods.${k};`),
    ...builtinNames.map(k => `const ${k} = builtins.${k};`)
  ].join('');

  const body = `"use strict"; ${shadowDefs} ${scopeDefs} return (${expr});`;
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
    const builtinNames = allowBuiltins.filter(name => name in globalThis);
    const fn = compileExpression(expr, methodNames, builtinNames);
    const builtins = {};
    // Populate builtins object with allowed globals
    for (const name of builtinNames) {
      if (name in globalThis) {
        builtins[name] = globalThis[name];
      }
    }
    const result = fn.call(null, ctx.data, ctx.methods, builtins);
    return !!result; // truthiness
  } catch (err) {
    logWarning('Expression evaluation error: ' + err.message + ' in: ' + expr);
    return false;
  }
}


// If and For directives
export const directives = {

  'c-if': function(comp, node, pointers, cache) {
    let attr = node.getAttribute('c-if');
    if (!attr) return true; // no attribute, keep
    // Use new expression evaluator
    const ctx = createExpressionContext(comp);
    const decision = evaluateToBoolean(attr, ctx, ctx.allowBuiltins, ctx.logWarning);
    if (!decision) {
      return false;
    } else {
      node.removeAttribute('c-if');
      return true;
    }
  },

  // Calls c-if directive and reverses the result.
  'c-ifnot': function(comp, node, pointers, cache) {
    let attr = node.getAttribute('c-ifnot');
    if (!attr) return true;
    // Expression
    const ctx = createExpressionContext(comp);
    const decision = evaluateToBoolean(attr, ctx, ctx.allowBuiltins, ctx.logWarning);
    if (!decision) { // was false, invert to true
      node.removeAttribute('c-ifnot');
      return true;
    } else { // was true, invert to false
      return false;
    }
  },

  'c-for': function(comp, node, pointers, cache) {
    const attr = node.getAttribute('c-for');

    const parts = attr.split(' in ');
    const leftSide = parts[0].trim();
    const iterableExpr = parts[1].trim();
    if (pointers === undefined) pointers = {};

    // Parse pointer declaration - detect single vs dual pointer
    const isDualPointer = leftSide.includes(',');
    let keyPointer, valuePointer;

    if (isDualPointer) {
      const pointerParts = leftSide.split(',').map(p => p.trim());
      keyPointer = pointerParts[0];
      valuePointer = pointerParts[1];
    } else {
      valuePointer = leftSide;
    }

    let iterable = evaluateTemplateExpression(comp, pointers, node, iterableExpr, cache);

    // Type detection: Arrays (highest priority)
    if (Array.isArray(iterable)) {
      node.removeAttribute('c-for');
      const parentNode = node.parentNode;

      for (let i=0; i<iterable.length; i++) {
        const item = iterable[i];
        // For arrays, use valuePointer (second pointer in dual syntax, or only pointer)
        pointers[valuePointer] = item;

        const newNode = node.cloneNode(true);
        processNode(comp, newNode, pointers, cache);
        updateAttributePlaceholders(comp, newNode, pointers, cache);
        updateTextNodePlaceholders(comp, newNode, pointers, cache);

        parentNode.appendChild(newNode);
      }
      node.remove();
      return true;
    }

    // Type detection: Iterables (Map, Set, etc.)
    else if (iterable && typeof iterable[Symbol.iterator] === 'function') {
      node.removeAttribute('c-for');
      const parentNode = node.parentNode;

      const arr = Array.from(iterable);
      for (let i=0; i<arr.length; i++) {
        const item = arr[i];
        pointers[valuePointer] = item;

        const newNode = node.cloneNode(true);
        processNode(comp, newNode, pointers, cache);
        updateAttributePlaceholders(comp, newNode, pointers, cache);
        updateTextNodePlaceholders(comp, newNode, pointers, cache);

        parentNode.appendChild(newNode);
      }
      node.remove();
      return true;
    }

    // Type detection: Plain Objects (NEW)
    else if (iterable && typeof iterable === 'object' && iterable !== null) {
      node.removeAttribute('c-for');
      const parentNode = node.parentNode;

      const entries = Object.entries(iterable);

      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];

        // Assign based on pointer count
        if (isDualPointer) {
          pointers[keyPointer] = key;
          pointers[valuePointer] = value;
        } else {
          // Single pointer with object gets value only
          pointers[valuePointer] = value;
        }

        const newNode = node.cloneNode(true);
        processNode(comp, newNode, pointers, cache);
        updateAttributePlaceholders(comp, newNode, pointers, cache);
        updateTextNodePlaceholders(comp, newNode, pointers, cache);

        parentNode.appendChild(newNode);
      }

      node.remove();
      return true;
    }

    // Not iterable
    else {
      if (iterable !== undefined && iterable !== null) {
        logError(comp, `[method-call-error] ${iterableExpr} : Result is not iterable`);
      }
      return false;
    }

  }
};
