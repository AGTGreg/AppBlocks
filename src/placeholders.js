'use strict';


import {getProp} from './utils';
import {applyCustomFilter} from './filters';


// Returns the value of a placeholder.
const getPlaceholderVal = function(comp, placeholder, pointers) {
  // if ( /{([^}]+)}/.test(placeholder) === false ) return;
  if ( typeof pointers === 'object' && pointers !== null ) {

  }
  // placeholder is the inner content (without delimiters), may contain property path and filters already removed
  const placeholderName = placeholder;
  let propKeys = placeholderName.split('.');
  let result = getProp(comp, propKeys, pointers);
  // Return empty text instead of undefined.
  if (result === undefined) return '';
  return result;
};

// Replaces all placeholders in all attributes in a node.
export const updateAttributePlaceholders = function(comp, node, pointers) {
  const attrs = node.attributes;
  const delimiters = Array.isArray(comp.delimiters) && comp.delimiters.length === 2 ? comp.delimiters : ['{', '}'];
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const open = escapeRegExp(delimiters[0]);
  const close = escapeRegExp(delimiters[1]);
  const regex = new RegExp(open + '([\\s\\S]*?)' + close, 'g');

  for (let i = 0; i < attrs.length; i++) {
    let attrValue = attrs[i].value;
    attrValue = attrValue.replace(regex, (fullMatch, inner) => {
      const parts = inner.split('|').map(p => p.trim()).filter(Boolean);
      const propName = parts.shift();
      const filterList = parts;

      let placeholderVal = getPlaceholderVal(comp, propName, pointers);

      filterList.forEach(filter => {
        placeholderVal = applyCustomFilter(comp, placeholderVal, filter);
      });

      return placeholderVal;
    });

    attrs[i].value = attrValue;
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

  // Build delimiter-aware regex
  const delimiters = Array.isArray(comp.delimiters) && comp.delimiters.length === 2 ? comp.delimiters : ['{', '}'];
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const open = escapeRegExp(delimiters[0]);
  const close = escapeRegExp(delimiters[1]);
  const regex = new RegExp(open + '([\\s\\S]*?)' + close, 'g');

  nodesToProcess.forEach((node) => {
    let nodeVal = node.nodeValue;
    let hasReplacedWithHTML = false;

    nodeVal = nodeVal.replace(regex, (fullMatch, inner) => {

      const parts = inner.split('|').map(p => p.trim()).filter(Boolean);
      const propName = parts.shift();
      const filterList = parts;

      let placeholderVal = getPlaceholderVal(comp, propName, pointers);

      filterList.forEach(filter => {
        if (filter === 'asHTML') {
          // Mark and handle below
        } else {
          placeholderVal = applyCustomFilter(comp, placeholderVal, filter);
        }
      });

      if (filterList.includes('asHTML')) {
        // Replace the node with HTML fragment
        const docFrag = document.createRange().createContextualFragment(placeholderVal);
        node.parentNode.insertBefore(docFrag, node);
        node.parentNode.removeChild(node);
        hasReplacedWithHTML = true;
        return '';
      }

      return placeholderVal;
    });

    // Update the node value only if it hasn't been replaced by HTML
    if (!hasReplacedWithHTML && node.parentNode) {
      node.nodeValue = nodeVal;
    }
  });
};
