'use strict';

import {getProp} from './utils';
import {updateAttributePlaceholders, updateTextNodePlaceholders} from './placeholders';


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
      const validTypes = ['boolean', 'number'];
      for (let i=0; i<operators.length; i++) {
        if (attr.includes(operators[i])) {
          let condition = attr;
          const cParts = condition.split(operators[i]);
          const condLeft = getProp(comp, cParts[0].split('.'), pointers);
          const condRight = cParts[1];

          if (validTypes.includes(String(typeof(condLeft))) === false) {
            console.error(
              cParts[0] + " cannot be evaluated because it is not a boolean or a number.");
            return false;
          } else {
            condition = condition.replace(cParts[0], condLeft);
            var evaluate = eval;
            result = evaluate(condition);
          }
        }
      }
    }

    if (result === undefined || result === false) {
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


// Processes nodes recursivelly in reverse. Evaluates the nodes based on their attributes.
// Removes and skips the nodes that evaluate to false.
export const processNode = function(comp, node, pointers) {
  const attrs = node.attributes;
  if (attrs){
    for (let i=0; i<attrs.length; i++) {
      if (attrs[i].name in directives) {
        const attr = attrs[i].name;
        const result = directives[attr](comp, node, pointers);
        if (result === false) {
          node.remove();
          return;
        }
      }
    }
    // If a node stays in our tree (did not evaluate to false) then update all of its attributes.
    updateAttributePlaceholders(comp, node, pointers);
  }

  if (node.hasChildNodes()) {
    // Iterate over the children in reverse because we might remove a node and the children count might change.
    for (let c=node.childElementCount - 1; c >= 0; c--) {
      if (node.children[c]) {
        processNode(comp, node.children[c], pointers);
      } else {
        break;
      }
    }
  }

}