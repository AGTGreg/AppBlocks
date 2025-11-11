import { logError } from './logger';
import { getProp } from './utils';

// Global counter for node IDs
let nodeIdCounter = 0;

/**
 * Wraps all methods in comp.methods to automatically inject the app instance
 * as the first parameter when called from expression contexts (e.g., c-if).
 *
 * @param {Object} comp - The AppBlock component instance
 * @returns {Object} Object with wrapped methods
 */
export function wrapMethodsWithAppInstance(comp) {
  return Object.fromEntries(
    Object.entries(comp.methods).map(([k, v]) => [
      k,
      typeof v === 'function'
        ? (...args) => v.call(comp, comp, ...args)
        : v
    ])
  );
}

/**
 * Creates the context object used for expression evaluation in directives.
 *
 * @param {Object} comp - The AppBlock component instance
 * @param {Object} pointers - Optional pointer context from c-for loops
 * @returns {Object} Context object with data, pointers, methods, allowBuiltins, and logWarning
 */
export function createExpressionContext(comp, pointers) {
  const wrappedMethods = wrapMethodsWithAppInstance(comp);

  return {
    data: comp.data,
    pointers: pointers || {},
    methods: wrappedMethods,
    allowBuiltins: comp.allowBuiltins || [],
    logWarning: (msg) => logError(comp, msg)
  };
}

/**
 * Escapes special regex characters in a string.
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for use in RegExp
 */
export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a regex pattern for matching placeholders with custom delimiters.
 *
 * @param {Array<string>} delimiters - Array of [openDelimiter, closeDelimiter]
 * @returns {RegExp} Regular expression for matching delimited placeholders
 */
export function buildDelimiterRegex(delimiters) {
  const validDelimiters = Array.isArray(delimiters) &&
                          delimiters.length === 2 &&
                          typeof delimiters[0] === 'string' &&
                          typeof delimiters[1] === 'string' &&
                          delimiters[0].length > 0 &&
                          delimiters[1].length > 0
                          ? delimiters
                          : ['{', '}'];

  const open = escapeRegExp(validDelimiters[0]);
  const close = escapeRegExp(validDelimiters[1]);
  return new RegExp(open + '([\\s\\S]*?)' + close, 'g');
}

/**
 * Evaluates a template expression that may include method calls with parameters.
 * Supports filter chains and caches results per-render.
 *
 * @param {Object} app - The AppBlock component instance
 * @param {Object} scope - The current scope (data, methods, etc.)
 * @param {Node} node - The DOM node for caching key
 * @param {string} expr - The expression string to evaluate
 * @param {Map} cache - Per-render cache map
 * @returns {*} The evaluated result
 */
export function evaluateTemplateExpression(app, scope, node, expr, cache) {
  // Assign node ID if not present
  if (!node._appBlockNodeId) {
    node._appBlockNodeId = ++nodeIdCounter;
  }
  const nodeId = node._appBlockNodeId;
  const cacheKey = `${nodeId}|${expr}`;

  if (cache && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let result;

  try {
    // Split by | for filters
    const parts = expr.split('|').map(p => p.trim());
    const baseExpr = parts.shift();

    // Evaluate base expression
    result = evaluateBaseExpression(app, scope, baseExpr);

    // Apply filters
    for (const filterName of parts) {
      if (app.filters && app.filters[filterName]) {
        result = app.filters[filterName](app, result);
      } else {
        logError(app, `Unknown filter: ${filterName}`);
      }
    }

    // Convert undefined/null to empty string for placeholders
    if (result === undefined || result === null) {
      result = '';
    }
  } catch (error) {
    logError(app, `[method-call-error] ${expr} : ${error.message}`);
    result = '';
  }

  if (cache) cache.set(cacheKey, result);
  return result;
}

/**
 * Parses method arguments accounting for nested parentheses
 */
function parseMethodArguments(argsStr) {
  if (!argsStr.trim()) return [];

  const args = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];

    if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      parenDepth--;
      current += char;
    } else if (char === ',' && parenDepth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}

/**
 * Evaluates the base expression (without filters)
 */
function evaluateBaseExpression(app, scope, expr) {
  expr = expr.trim();

  // Check if it's a method call
  const methodMatch = expr.match(/^(\w+)\((.*)\)$/);
  if (methodMatch) {
    const methodName = methodMatch[1];
    const argsStr = methodMatch[2].trim();

    if (!app.methods || !app.methods[methodName]) {
      throw new Error(`Method ${methodName} not found`);
    }

    const args = argsStr ? parseMethodArguments(argsStr).map(arg => evaluateArgument(app, scope, arg)) : [];

    return app.methods[methodName].call(app, app, ...args);
  }

  // Otherwise, treat as property path
  const propKeys = expr.split('.');
  return getProp(app, propKeys, scope);
}

/**
 * Evaluates a single argument expression
 */
function evaluateArgument(app, scope, arg) {
  arg = arg.trim();

  // Check if it's a method call
  if (arg.match(/^(\w+)\(/)) {
    return evaluateBaseExpression(app, scope, arg);
  }

  // String literal
  if (arg.startsWith('"') && arg.endsWith('"')) {
    return arg.slice(1, -1);
  }
  if (arg.startsWith("'") && arg.endsWith("'")) {
    return arg.slice(1, -1);
  }

  // Number
  const num = parseFloat(arg);
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }

  // Property path
  const propKeys = arg.split('.');
  return getProp(app, propKeys, scope);
}
