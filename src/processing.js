import {updateAttributePlaceholders} from './placeholders';


// Processes nodes recursivelly in reverse. Evaluates the nodes based on their attributes.
// Removes and skips the nodes that evaluate to false.
export const processNode = function(comp, node, pointers) {
  const attrs = node.attributes;
  if (attrs){
    for (let i=0; i<attrs.length; i++) {
      if (attrs[i].name in comp.directives) {
        const attr = attrs[i].name;
        const result = comp.directives[attr](comp, node, pointers);
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