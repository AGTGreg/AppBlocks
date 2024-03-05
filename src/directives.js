'use strict';

import {getProp} from './utils';
import {processNode} from './processing';
import {updateAttributePlaceholders, updateTextNodePlaceholders} from './placeholders';
import { logError } from './logger';


// If and For directives
export const directives = {

  'c-if': function(comp, node, pointers) {
    let attr = node.getAttribute('c-if');
    // In case this directive was called form a c-ifnot.
    if (attr === null) attr = node.getAttribute('c-ifnot');

    let result = getProp(comp, attr.split('.'), pointers);

    if (result === undefined) {
      // Check if the attribute contains a logical operator. Split the condition at the
      // operator to get the value of the object at left side and evaluate.
      const operators = [' == ', ' === ', ' !== ', ' != ', ' > ', ' < ', ' >= ', ' <= '];
      const validTypes = ['boolean', 'number', 'undefined'];
      for (let i=0; i<operators.length; i++) {
        if (attr.includes(operators[i])) {
          let condition = attr;
          const cParts = condition.split(operators[i]);
          const condLeft = getProp(comp, cParts[0].split('.'), pointers);

          if (validTypes.includes(String(typeof(condLeft))) === false) {
            logError(comp, `${cParts[0]} cannot be evaluated because it is not a boolean nor a number.`);
            return false;
          } else {
            condition = condition.replace(cParts[0], condLeft);
            var evaluate = eval;
            result = evaluate(condition);
          }
        }
      }
    }

    // Values which will cause c-if to return false.
    const falseValues = [undefined, null, false, 0, ''];

    if ( falseValues.indexOf(result) > -1 ) {
      return false;
    } else {
      node.removeAttribute('c-if');
      return true;
    }
  },

  // Calls c-if directive and reverses the result.
  'c-ifnot': function(comp, node, pointers) {
    const result = !directives['c-if'](comp, node, pointers);
    if (result === true) node.removeAttribute('c-ifnot');
    return result;
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
