'use strict';


import {getProp} from './utils';
import {applyCustomFilter} from './filters';


// Returns the value of a placeholder.
const getPlaceholderVal = function(comp, placeholder, pointers) {
  // if ( /{([^}]+)}/.test(placeholder) === false ) return;
  if ( typeof pointers === 'object' && pointers !== null ) {

  }

  const placeholderName = placeholder.replace(/{|}/g , '');
  let propKeys = placeholderName.split('.');
  let result = getProp(comp, propKeys, pointers);
  // Return empty text instead of undefined.
  if (result === undefined) return '';
  return result;
};

// Replaces all placeholders in all attributes in a node.
export const updateAttributePlaceholders = function(comp, node, pointers) {
  const attrs = node.attributes;
  for (let i=0; i<attrs.length; i++) {
    if ( /{([^}]+)}/.test(attrs[i].value) ) {
      const props = attrs[i].value.match(/{([^}]+)}/g);

      for (let p=0; p<props.length; p++) {
        const re = new RegExp(props[p], 'g');
        attrs[i].value = attrs[i].value.replace(re, getPlaceholderVal(comp, props[p], pointers));
      }
    }
  }
};

// Updates all the text nodes that contain placeholders `{}` and applies filters (if any).
export const updateTextNodePlaceholders = function(comp, nodeTree, pointers) {
  const textWalker = document.createTreeWalker(
    nodeTree, NodeFilter.SHOW_TEXT, null, false
  );

  let nodesToProcess = [];
  while (textWalker.nextNode()) {
    nodesToProcess.push(textWalker.currentNode);
  }

  nodesToProcess.forEach((node) => {
    let nodeVal = node.nodeValue;
    let match;

    // Use a while loop to find all placeholders in the current node value
    while ((match = /{([^}]+)}/.exec(nodeVal)) !== null) {
      const fullMatch = match[0];
      // This regex now captures the propName and any filters separated by |
      const [, propName, filters] = fullMatch.match(/{([^|}]+)(\|[^}]+)?}/);
      const filterList = filters ? filters.split('|').slice(1) : [];

      let placeholderVal = getPlaceholderVal(comp, propName, pointers);

      // Process each filter
      filterList.forEach(filter => {
        // Example: Apply the filter based on its name.
        switch (filter) {
          case 'asHTML':
            // For asHTML, we'll handle it separately outside this loop since this is a corner case and has to be
            // hardcoded.
            break;
          default:
            // Handles other filters, e.g., applying a custom function
            placeholderVal = applyCustomFilter(comp, placeholderVal, filter);
            break;
        }
      });

      if (filterList.includes('asHTML')) {
        // Create a document fragment from the HTML
        const docFrag = document.createRange().createContextualFragment(placeholderVal);
        node.parentNode.insertBefore(docFrag, node);
        node.parentNode.removeChild(node);
        break; // Exit the loop since the node has been replaced
      } else {
        // Replace text as before
        nodeVal = nodeVal.replace(fullMatch, placeholderVal);
      }
    }

    // Update the node value only if it hasn't been replaced by HTML
    if (node.parentNode) {
      node.nodeValue = nodeVal;
    }
  });
};
