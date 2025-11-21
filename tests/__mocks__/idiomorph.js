// Lightweight mock for idiomorph used in tests
// Provides a `morph` method that replaces the target element's children with
// the contents of the temporary DOM fragment. Keeps behavior minimal and
// deterministic for unit tests.

// Export an object with a named `Idiomorph` export so `import { Idiomorph } ...`
// resolves to an object with a `morph` function.
module.exports = {
  Idiomorph: {
    morph: function (targetEl, tmpDOM, options) {
      while (targetEl.firstChild) {
        targetEl.removeChild(targetEl.firstChild);
      }

      // Handle different input types like real Idiomorph
      if (tmpDOM instanceof NodeList || Array.isArray(tmpDOM)) {
        // NodeList or Array - append each child
        Array.from(tmpDOM).forEach(child => {
          targetEl.appendChild(child.cloneNode(true));
        });
      } else if (tmpDOM && tmpDOM.cloneNode) {
        // Element or DocumentFragment
        const fragment = tmpDOM.cloneNode(true);
        while (fragment.firstChild) {
          targetEl.appendChild(fragment.firstChild);
        }
      }
    }
  }
};
