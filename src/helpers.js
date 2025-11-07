import { logError } from './logger';
import { getProp } from './utils';

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
 * @returns {Object} Context object with data, methods, allowBuiltins, and logWarning
 */
export function createExpressionContext(comp) {
  const wrappedMethods = wrapMethodsWithAppInstance(comp);
  return {
    data: comp.data,
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
 * Handles legacy operator evaluation for c-if/c-ifnot directives.
 * This maintains backward compatibility for simple comparison operations.
 *
 * @param {Object} comp - The AppBlock component instance
 * @param {string} attr - The attribute value to evaluate
 * @param {Object} pointers - Pointer context for c-for loops
 * @returns {*} The evaluated result or undefined
 */
export function handleLegacyOperators(comp, attr, pointers) {
  const operators = [' == ', ' === ', ' !== ', ' != ', ' > ', ' < ', ' >= ', ' <= '];
  const validTypes = ['boolean', 'number', 'undefined'];

  for (let i = 0; i < operators.length; i++) {
    if (attr.includes(operators[i])) {
      let condition = attr;
      const cParts = condition.split(operators[i]);
      const condLeft = getProp(comp, cParts[0].split('.'), pointers);

      if (!validTypes.includes(String(typeof(condLeft)))) {
        logError(comp, `${cParts[0]} cannot be evaluated because it is not a boolean nor a number.`);
        return undefined;
      } else {
        condition = condition.replace(cParts[0], condLeft);
        var evaluate = eval;
        return evaluate(condition);
      }
    }
  }

  return undefined;
}
