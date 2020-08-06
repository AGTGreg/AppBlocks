'use strict';

/*
Gets a property's value.

:keys = An array of keys to search for
:pointers = An object with keys that point to a specific variable / object

First search in pointers if pointers is defined. Then search in methods and lastly 
search in the component itself. Go deeper, one key at a time until we reach the last
one or until we get an undefined value.
*/

export const getProp = function(comp, keys, pointers) {
  const firstKey = keys[0];
  let root = comp;
  let prop;

  if (pointers && firstKey in pointers) {
    if ( keys.length > 1 ) {
      keys.shift();
      root = pointers[firstKey];
    } else {
      return pointers[firstKey];
    }

  } else if (firstKey in comp.methods) {
    keys.shift();
    prop = comp.methods[firstKey](comp);
  }

  if (keys.length > 0) {
    for (let i=0; i<keys.length; i++) {
      prop = getObjectFromKey(root, keys[i]);
      if (prop === undefined) {
        break;
      } else {
        root = prop;
      }
    }
  }

  if ( comp.debug ) console.info("Result for", keys, ":", prop);
  
  return prop;
};


export const helpers = {
  getNode(selectors) {
    return this.comp.el.querySelector(selectors);
  },
  getNodes(selectors) {
    return this.comp.el.querySelectorAll(selectors);
  },
  appendIn(HTML, node) {
    return node.innerHTML += HTML;
  },
  prependIn(HTML, node) {
    return node.innerHTML = HTML + node.innerHTML;
  }
};


// Private functions ===================================================================================================
// Try to get the value of an object.
const getObjectFromKey = function(root, key) {
  let prop = root[key];
  if ( prop === undefined ) {
    // If there is no value then check if the key uses the square brackets notation (ie: obj[key]) and try to retrieve
    // a value this way.
    const dKeys = key.match(/\[(.*?)\]/g);
    if ( dKeys ) {
      let dObjName = key.split('[')[0];
      let dRoot = root[dObjName]
      for (let i=0; i<dKeys.length; i++) {
        if ( i > 0 ) dRoot = prop;
        const cleanedKey = dKeys[i].split('[')[1].split(']')[0];
        prop = dRoot[cleanedKey];
        if ( prop === undefined ) break;
      }
    }
  }
  return prop;
}
