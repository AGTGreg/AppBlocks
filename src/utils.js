'use strict';

/*
Gets a property's value.

:keys = An array of keys to search for
:pointers = An object with keys that point to a specific value

First search in pointers if pointers is defined. Then search in methods and lastly 
search in the component itself. Go deeper, one key at a time until we reach the last
one or until we get an undefined value.
*/

export const getProp = function(comp, keys, pointers) {
  const firstKey = keys[0];
  let root = comp;
  let prop;

  if (pointers && firstKey in pointers) {
    keys.shift();
    root = pointers[firstKey];

  } else if (firstKey in comp.methods) {
    keys.shift();
    prop = comp.methods[firstKey]();
  }

  if (keys.length > 0) {
    for (let i=0; i<keys.length; i++) {
      prop = root[keys[i]];
      if (prop === undefined) {
        break;
      } else {
        root = prop;
      }
    }
  }

  return prop;
}
