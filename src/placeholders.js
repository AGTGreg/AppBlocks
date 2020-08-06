'use strict';


import {getProp} from './utils';


// Returns the value of a placeholder.
const getPlaceholderVal = function(comp, placeholder, pointers) {
  if ( /{([^}]+)}/.test(placeholder) === false ) return;
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

// Updates all the text nodes that contain placeholders {}
export const updateTextNodePlaceholders = function(comp, nodeTree, pointers) {
  // Create a new treeWalker with all visible text nodes that contain placeholders;
  const textWalker = document.createTreeWalker(
    nodeTree, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if ( /{([^}]+)}/.test(node.data) ) {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    }
  );
  while (textWalker.nextNode()) {
    let nodeVal = textWalker.currentNode.nodeValue;
    // Iterate over the props (if any) and replace it with the appropriate value.
    const props = nodeVal.match(/{([^}]+)}/g);
    for (let i=0; i<props.length; i++) {
      nodeVal = nodeVal.replace(props[i], getPlaceholderVal(comp, props[i], pointers));
    }
    textWalker.currentNode.nodeValue = nodeVal;
  }
};