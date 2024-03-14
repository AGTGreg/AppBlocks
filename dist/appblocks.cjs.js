'use strict';

require('core-js/modules/es.array.for-each.js');
require('core-js/modules/es.function.name.js');
require('core-js/modules/es.object.assign.js');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/es.array.includes.js');
require('core-js/modules/es.array.slice.js');
require('core-js/modules/es.regexp.constructor.js');
require('core-js/modules/es.regexp.exec.js');
require('core-js/modules/es.regexp.to-string.js');
require('core-js/modules/es.string.includes.js');
require('core-js/modules/es.string.match.js');
require('core-js/modules/es.string.replace.js');
require('core-js/modules/es.array.concat.js');
require('core-js/modules/es.array.index-of.js');
require('core-js/modules/es.string.split.js');
require('core-js/modules/es.promise.js');
require('core-js/modules/es.promise.finally.js');
require('core-js/modules/web.timers.js');

var Idiomorph = (function () {
        let EMPTY_SET = new Set();
        let defaults = {
            morphStyle: "outerHTML",
            callbacks : {
                beforeNodeAdded: noOp,
                afterNodeAdded: noOp,
                beforeNodeMorphed: noOp,
                afterNodeMorphed: noOp,
                beforeNodeRemoved: noOp,
                afterNodeRemoved: noOp,
                beforeAttributeUpdated: noOp,
            },
            head: {
                style: 'merge',
                shouldPreserve: function (elt) {
                    return elt.getAttribute("im-preserve") === "true";
                },
                shouldReAppend: function (elt) {
                    return elt.getAttribute("im-re-append") === "true";
                },
                shouldRemove: noOp,
                afterHeadMorphed: noOp,
            }
        };
        function morph(oldNode, newContent, config = {}) {
            if (oldNode instanceof Document) {
                oldNode = oldNode.documentElement;
            }
            if (typeof newContent === 'string') {
                newContent = parseContent(newContent);
            }
            let normalizedContent = normalizeContent(newContent);
            let ctx = createMorphContext(oldNode, normalizedContent, config);
            return morphNormalizedContent(oldNode, normalizedContent, ctx);
        }
        function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
            if (ctx.head.block) {
                let oldHead = oldNode.querySelector('head');
                let newHead = normalizedNewContent.querySelector('head');
                if (oldHead && newHead) {
                    let promises = handleHeadElement(newHead, oldHead, ctx);
                    Promise.all(promises).then(function () {
                        morphNormalizedContent(oldNode, normalizedNewContent, Object.assign(ctx, {
                            head: {
                                block: false,
                                ignore: true
                            }
                        }));
                    });
                    return;
                }
            }
            if (ctx.morphStyle === "innerHTML") {
                morphChildren(normalizedNewContent, oldNode, ctx);
                return oldNode.children;
            } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
                let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
                let previousSibling = bestMatch?.previousSibling;
                let nextSibling = bestMatch?.nextSibling;
                let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
                if (bestMatch) {
                    return insertSiblings(previousSibling, morphedNode, nextSibling);
                } else {
                    return []
                }
            } else {
                throw "Do not understand how to morph style " + ctx.morphStyle;
            }
        }
        function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
            return ctx.ignoreActiveValue && possibleActiveElement === document.activeElement;
        }
        function morphOldNodeTo(oldNode, newContent, ctx) {
            if (ctx.ignoreActive && oldNode === document.activeElement) ; else if (newContent == null) {
                if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
                oldNode.remove();
                ctx.callbacks.afterNodeRemoved(oldNode);
                return null;
            } else if (!isSoftMatch(oldNode, newContent)) {
                if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
                if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;
                oldNode.parentElement.replaceChild(newContent, oldNode);
                ctx.callbacks.afterNodeAdded(newContent);
                ctx.callbacks.afterNodeRemoved(oldNode);
                return newContent;
            } else {
                if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) return oldNode;
                if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ; else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
                    handleHeadElement(newContent, oldNode, ctx);
                } else {
                    syncNodeFrom(newContent, oldNode, ctx);
                    if (!ignoreValueOfActiveElement(oldNode, ctx)) {
                        morphChildren(newContent, oldNode, ctx);
                    }
                }
                ctx.callbacks.afterNodeMorphed(oldNode, newContent);
                return oldNode;
            }
        }
        function morphChildren(newParent, oldParent, ctx) {
            let nextNewChild = newParent.firstChild;
            let insertionPoint = oldParent.firstChild;
            let newChild;
            while (nextNewChild) {
                newChild = nextNewChild;
                nextNewChild = newChild.nextSibling;
                if (insertionPoint == null) {
                    if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
                    oldParent.appendChild(newChild);
                    ctx.callbacks.afterNodeAdded(newChild);
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }
                if (isIdSetMatch(newChild, insertionPoint, ctx)) {
                    morphOldNodeTo(insertionPoint, newChild, ctx);
                    insertionPoint = insertionPoint.nextSibling;
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }
                let idSetMatch = findIdSetMatch(newParent, oldParent, newChild, insertionPoint, ctx);
                if (idSetMatch) {
                    insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
                    morphOldNodeTo(idSetMatch, newChild, ctx);
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }
                let softMatch = findSoftMatch(newParent, oldParent, newChild, insertionPoint, ctx);
                if (softMatch) {
                    insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
                    morphOldNodeTo(softMatch, newChild, ctx);
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }
                if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
                oldParent.insertBefore(newChild, insertionPoint);
                ctx.callbacks.afterNodeAdded(newChild);
                removeIdsFromConsideration(ctx, newChild);
            }
            while (insertionPoint !== null) {
                let tempNode = insertionPoint;
                insertionPoint = insertionPoint.nextSibling;
                removeNode(tempNode, ctx);
            }
        }
        function ignoreAttribute(attr, to, updateType, ctx) {
            if(attr === 'value' && ctx.ignoreActiveValue && to === document.activeElement){
                return true;
            }
            return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
        }
        function syncNodeFrom(from, to, ctx) {
            let type = from.nodeType;
            if (type === 1 ) {
                const fromAttributes = from.attributes;
                const toAttributes = to.attributes;
                for (const fromAttribute of fromAttributes) {
                    if (ignoreAttribute(fromAttribute.name, to, 'update', ctx)) {
                        continue;
                    }
                    if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
                        to.setAttribute(fromAttribute.name, fromAttribute.value);
                    }
                }
                for (let i = toAttributes.length - 1; 0 <= i; i--) {
                    const toAttribute = toAttributes[i];
                    if (ignoreAttribute(toAttribute.name, to, 'remove', ctx)) {
                        continue;
                    }
                    if (!from.hasAttribute(toAttribute.name)) {
                        to.removeAttribute(toAttribute.name);
                    }
                }
            }
            if (type === 8  || type === 3 ) {
                if (to.nodeValue !== from.nodeValue) {
                    to.nodeValue = from.nodeValue;
                }
            }
            if (!ignoreValueOfActiveElement(to, ctx)) {
                syncInputValue(from, to, ctx);
            }
        }
        function syncBooleanAttribute(from, to, attributeName, ctx) {
            if (from[attributeName] !== to[attributeName]) {
                let ignoreUpdate = ignoreAttribute(attributeName, to, 'update', ctx);
                if (!ignoreUpdate) {
                    to[attributeName] = from[attributeName];
                }
                if (from[attributeName]) {
                    if (!ignoreUpdate) {
                        to.setAttribute(attributeName, from[attributeName]);
                    }
                } else {
                    if (!ignoreAttribute(attributeName, to, 'remove', ctx)) {
                        to.removeAttribute(attributeName);
                    }
                }
            }
        }
        function syncInputValue(from, to, ctx) {
            if (from instanceof HTMLInputElement &&
                to instanceof HTMLInputElement &&
                from.type !== 'file') {
                let fromValue = from.value;
                let toValue = to.value;
                syncBooleanAttribute(from, to, 'checked', ctx);
                syncBooleanAttribute(from, to, 'disabled', ctx);
                if (!from.hasAttribute('value')) {
                    if (!ignoreAttribute('value', to, 'remove', ctx)) {
                        to.value = '';
                        to.removeAttribute('value');
                    }
                } else if (fromValue !== toValue) {
                    if (!ignoreAttribute('value', to, 'update', ctx)) {
                        to.setAttribute('value', fromValue);
                        to.value = fromValue;
                    }
                }
            } else if (from instanceof HTMLOptionElement) {
                syncBooleanAttribute(from, to, 'selected', ctx);
            } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
                let fromValue = from.value;
                let toValue = to.value;
                if (ignoreAttribute('value', to, 'update', ctx)) {
                    return;
                }
                if (fromValue !== toValue) {
                    to.value = fromValue;
                }
                if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
                    to.firstChild.nodeValue = fromValue;
                }
            }
        }
        function handleHeadElement(newHeadTag, currentHead, ctx) {
            let added = [];
            let removed = [];
            let preserved = [];
            let nodesToAppend = [];
            let headMergeStyle = ctx.head.style;
            let srcToNewHeadNodes = new Map();
            for (const newHeadChild of newHeadTag.children) {
                srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
            }
            for (const currentHeadElt of currentHead.children) {
                let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
                let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
                let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
                if (inNewContent || isPreserved) {
                    if (isReAppended) {
                        removed.push(currentHeadElt);
                    } else {
                        srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
                        preserved.push(currentHeadElt);
                    }
                } else {
                    if (headMergeStyle === "append") {
                        if (isReAppended) {
                            removed.push(currentHeadElt);
                            nodesToAppend.push(currentHeadElt);
                        }
                    } else {
                        if (ctx.head.shouldRemove(currentHeadElt) !== false) {
                            removed.push(currentHeadElt);
                        }
                    }
                }
            }
            nodesToAppend.push(...srcToNewHeadNodes.values());
            let promises = [];
            for (const newNode of nodesToAppend) {
                let newElt = document.createRange().createContextualFragment(newNode.outerHTML).firstChild;
                if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
                    if (newElt.href || newElt.src) {
                        let resolve = null;
                        let promise = new Promise(function (_resolve) {
                            resolve = _resolve;
                        });
                        newElt.addEventListener('load', function () {
                            resolve();
                        });
                        promises.push(promise);
                    }
                    currentHead.appendChild(newElt);
                    ctx.callbacks.afterNodeAdded(newElt);
                    added.push(newElt);
                }
            }
            for (const removedElement of removed) {
                if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
                    currentHead.removeChild(removedElement);
                    ctx.callbacks.afterNodeRemoved(removedElement);
                }
            }
            ctx.head.afterHeadMorphed(currentHead, {added: added, kept: preserved, removed: removed});
            return promises;
        }
        function noOp() {
        }
        function mergeDefaults(config) {
            let finalConfig = {};
            Object.assign(finalConfig, defaults);
            Object.assign(finalConfig, config);
            finalConfig.callbacks = {};
            Object.assign(finalConfig.callbacks, defaults.callbacks);
            Object.assign(finalConfig.callbacks, config.callbacks);
            finalConfig.head = {};
            Object.assign(finalConfig.head, defaults.head);
            Object.assign(finalConfig.head, config.head);
            return finalConfig;
        }
        function createMorphContext(oldNode, newContent, config) {
            config = mergeDefaults(config);
            return {
                target: oldNode,
                newContent: newContent,
                config: config,
                morphStyle: config.morphStyle,
                ignoreActive: config.ignoreActive,
                ignoreActiveValue: config.ignoreActiveValue,
                idMap: createIdMap(oldNode, newContent),
                deadIds: new Set(),
                callbacks: config.callbacks,
                head: config.head
            }
        }
        function isIdSetMatch(node1, node2, ctx) {
            if (node1 == null || node2 == null) {
                return false;
            }
            if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
                if (node1.id !== "" && node1.id === node2.id) {
                    return true;
                } else {
                    return getIdIntersectionCount(ctx, node1, node2) > 0;
                }
            }
            return false;
        }
        function isSoftMatch(node1, node2) {
            if (node1 == null || node2 == null) {
                return false;
            }
            return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName
        }
        function removeNodesBetween(startInclusive, endExclusive, ctx) {
            while (startInclusive !== endExclusive) {
                let tempNode = startInclusive;
                startInclusive = startInclusive.nextSibling;
                removeNode(tempNode, ctx);
            }
            removeIdsFromConsideration(ctx, endExclusive);
            return endExclusive.nextSibling;
        }
        function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
            let newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);
            let potentialMatch = null;
            if (newChildPotentialIdCount > 0) {
                let potentialMatch = insertionPoint;
                let otherMatchCount = 0;
                while (potentialMatch != null) {
                    if (isIdSetMatch(newChild, potentialMatch, ctx)) {
                        return potentialMatch;
                    }
                    otherMatchCount += getIdIntersectionCount(ctx, potentialMatch, newContent);
                    if (otherMatchCount > newChildPotentialIdCount) {
                        return null;
                    }
                    potentialMatch = potentialMatch.nextSibling;
                }
            }
            return potentialMatch;
        }
        function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
            let potentialSoftMatch = insertionPoint;
            let nextSibling = newChild.nextSibling;
            let siblingSoftMatchCount = 0;
            while (potentialSoftMatch != null) {
                if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
                    return null;
                }
                if (isSoftMatch(newChild, potentialSoftMatch)) {
                    return potentialSoftMatch;
                }
                if (isSoftMatch(nextSibling, potentialSoftMatch)) {
                    siblingSoftMatchCount++;
                    nextSibling = nextSibling.nextSibling;
                    if (siblingSoftMatchCount >= 2) {
                        return null;
                    }
                }
                potentialSoftMatch = potentialSoftMatch.nextSibling;
            }
            return potentialSoftMatch;
        }
        function parseContent(newContent) {
            let parser = new DOMParser();
            let contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, '');
            if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
                let content = parser.parseFromString(newContent, "text/html");
                if (contentWithSvgsRemoved.match(/<\/html>/)) {
                    content.generatedByIdiomorph = true;
                    return content;
                } else {
                    let htmlElement = content.firstChild;
                    if (htmlElement) {
                        htmlElement.generatedByIdiomorph = true;
                        return htmlElement;
                    } else {
                        return null;
                    }
                }
            } else {
                let responseDoc = parser.parseFromString("<body><template>" + newContent + "</template></body>", "text/html");
                let content = responseDoc.body.querySelector('template').content;
                content.generatedByIdiomorph = true;
                return content
            }
        }
        function normalizeContent(newContent) {
            if (newContent == null) {
                const dummyParent = document.createElement('div');
                return dummyParent;
            } else if (newContent.generatedByIdiomorph) {
                return newContent;
            } else if (newContent instanceof Node) {
                const dummyParent = document.createElement('div');
                dummyParent.append(newContent);
                return dummyParent;
            } else {
                const dummyParent = document.createElement('div');
                for (const elt of [...newContent]) {
                    dummyParent.append(elt);
                }
                return dummyParent;
            }
        }
        function insertSiblings(previousSibling, morphedNode, nextSibling) {
            let stack = [];
            let added = [];
            while (previousSibling != null) {
                stack.push(previousSibling);
                previousSibling = previousSibling.previousSibling;
            }
            while (stack.length > 0) {
                let node = stack.pop();
                added.push(node);
                morphedNode.parentElement.insertBefore(node, morphedNode);
            }
            added.push(morphedNode);
            while (nextSibling != null) {
                stack.push(nextSibling);
                added.push(nextSibling);
                nextSibling = nextSibling.nextSibling;
            }
            while (stack.length > 0) {
                morphedNode.parentElement.insertBefore(stack.pop(), morphedNode.nextSibling);
            }
            return added;
        }
        function findBestNodeMatch(newContent, oldNode, ctx) {
            let currentElement;
            currentElement = newContent.firstChild;
            let bestElement = currentElement;
            let score = 0;
            while (currentElement) {
                let newScore = scoreElement(currentElement, oldNode, ctx);
                if (newScore > score) {
                    bestElement = currentElement;
                    score = newScore;
                }
                currentElement = currentElement.nextSibling;
            }
            return bestElement;
        }
        function scoreElement(node1, node2, ctx) {
            if (isSoftMatch(node1, node2)) {
                return .5 + getIdIntersectionCount(ctx, node1, node2);
            }
            return 0;
        }
        function removeNode(tempNode, ctx) {
            removeIdsFromConsideration(ctx, tempNode);
            if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;
            tempNode.remove();
            ctx.callbacks.afterNodeRemoved(tempNode);
        }
        function isIdInConsideration(ctx, id) {
            return !ctx.deadIds.has(id);
        }
        function idIsWithinNode(ctx, id, targetNode) {
            let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
            return idSet.has(id);
        }
        function removeIdsFromConsideration(ctx, node) {
            let idSet = ctx.idMap.get(node) || EMPTY_SET;
            for (const id of idSet) {
                ctx.deadIds.add(id);
            }
        }
        function getIdIntersectionCount(ctx, node1, node2) {
            let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
            let matchCount = 0;
            for (const id of sourceSet) {
                if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
                    ++matchCount;
                }
            }
            return matchCount;
        }
        function populateIdMapForNode(node, idMap) {
            let nodeParent = node.parentElement;
            let idElements = node.querySelectorAll('[id]');
            for (const elt of idElements) {
                let current = elt;
                while (current !== nodeParent && current != null) {
                    let idSet = idMap.get(current);
                    if (idSet == null) {
                        idSet = new Set();
                        idMap.set(current, idSet);
                    }
                    idSet.add(elt.id);
                    current = current.parentElement;
                }
            }
        }
        function createIdMap(oldContent, newContent) {
            let idMap = new Map();
            populateIdMapForNode(oldContent, idMap);
            populateIdMapForNode(newContent, idMap);
            return idMap;
        }
        return {
            morph,
            defaults
        }
    })();
var idiomorph_cjs = Idiomorph;

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var getProp = function getProp(comp, keys, pointers) {
  var firstKey = keys[0];
  var root = comp;
  var prop;
  if (pointers && firstKey in pointers) {
    if (keys.length > 1) {
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
    for (var i = 0; i < keys.length; i++) {
      prop = getObjectFromKey(root, keys[i]);
      if (prop === undefined) {
        break;
      } else {
        root = prop;
      }
    }
  }
  return prop;
};
var helpers = {
  getNode: function getNode(selectors) {
    return this.comp.el.querySelector(selectors);
  },
  getNodes: function getNodes(selectors) {
    return this.comp.el.querySelectorAll(selectors);
  },
  appendIn: function appendIn(HTML, node) {
    return node.innerHTML += HTML;
  },
  prependIn: function prependIn(HTML, node) {
    return node.innerHTML = HTML + node.innerHTML;
  }
};
var getObjectFromKey = function getObjectFromKey(root, key) {
  var prop = root[key];
  if (prop === undefined) {
    var dKeys = key.match(/\[(.*?)\]/g);
    if (dKeys) {
      var dObjName = key.split('[')[0];
      var dRoot = root[dObjName];
      for (var i = 0; i < dKeys.length; i++) {
        if (i > 0) dRoot = prop;
        var cleanedKey = dKeys[i].split('[')[1].split(']')[0];
        prop = dRoot[cleanedKey];
        if (prop === undefined) break;
      }
    }
  }
  return prop;
};

var logError = function logError(comp, msg) {
  console.error("".concat(comp.name, ": ").concat(msg));
};

var filters = {};
var applyCustomFilter = function applyCustomFilter(comp, value, filterName) {
  if (filterName in filters) {
    return filters[filterName](comp, value);
  } else {
    logError(comp, "".concat(filterName, " is not a registered filter."));
    return value;
  }
};

var getPlaceholderVal = function getPlaceholderVal(comp, placeholder, pointers) {
  if (_typeof(pointers) === 'object' && pointers !== null) ;
  var placeholderName = placeholder.replace(/{|}/g, '');
  var propKeys = placeholderName.split('.');
  var result = getProp(comp, propKeys, pointers);
  if (result === undefined) return '';
  return result;
};
var updateAttributePlaceholders = function updateAttributePlaceholders(comp, node, pointers) {
  var attrs = node.attributes;
  for (var i = 0; i < attrs.length; i++) {
    if (/{([^}]+)}/.test(attrs[i].value)) {
      var props = attrs[i].value.match(/{([^}]+)}/g);
      for (var p = 0; p < props.length; p++) {
        var re = new RegExp(props[p], 'g');
        attrs[i].value = attrs[i].value.replace(re, getPlaceholderVal(comp, props[p], pointers));
      }
    }
  }
};
var updateTextNodePlaceholders = function updateTextNodePlaceholders(comp, nodeTree, pointers) {
  var textWalker = document.createTreeWalker(nodeTree, NodeFilter.SHOW_TEXT, null, false);
  var nodesToProcess = [];
  while (textWalker.nextNode()) {
    nodesToProcess.push(textWalker.currentNode);
  }
  nodesToProcess.forEach(function (node) {
    var nodeVal = node.nodeValue;
    var match;
    var _loop = function _loop() {
      var fullMatch = match[0];
      var _fullMatch$match = fullMatch.match(/{([^|}]+)(\|[^}]+)?}/),
        _fullMatch$match2 = _slicedToArray(_fullMatch$match, 3),
        propName = _fullMatch$match2[1],
        filters = _fullMatch$match2[2];
      var filterList = filters ? filters.split('|').slice(1) : [];
      var placeholderVal = getPlaceholderVal(comp, propName, pointers);
      filterList.forEach(function (filter) {
        switch (filter) {
          case 'asHTML':
            break;
          default:
            placeholderVal = applyCustomFilter(comp, placeholderVal, filter);
            break;
        }
      });
      if (filterList.includes('asHTML')) {
        var docFrag = document.createRange().createContextualFragment(placeholderVal);
        node.parentNode.insertBefore(docFrag, node);
        node.parentNode.removeChild(node);
        return 1; // break
      } else {
        nodeVal = nodeVal.replace(fullMatch, placeholderVal);
      }
    };
    while ((match = /{([^}]+)}/.exec(nodeVal)) !== null) {
      if (_loop()) break;
    }
    if (node.parentNode) {
      node.nodeValue = nodeVal;
    }
  });
};

var processNode = function processNode(comp, node, pointers) {
  var attrs = node.attributes;
  if (attrs) {
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].name in comp.directives) {
        var attr = attrs[i].name;
        var result = comp.directives[attr](comp, node, pointers);
        if (result === false) {
          node.remove();
          return;
        }
      }
    }
    updateAttributePlaceholders(comp, node, pointers);
  }
  if (node.hasChildNodes()) {
    for (var c = node.childElementCount - 1; c >= 0; c--) {
      if (node.children[c]) {
        processNode(comp, node.children[c], pointers);
      } else {
        break;
      }
    }
  }
};

var directives = {
  'c-if': function cIf(comp, node, pointers) {
    var attr = node.getAttribute('c-if');
    if (attr === null) attr = node.getAttribute('c-ifnot');
    var result = getProp(comp, attr.split('.'), pointers);
    if (result === undefined) {
      var operators = [' == ', ' === ', ' !== ', ' != ', ' > ', ' < ', ' >= ', ' <= '];
      var validTypes = ['boolean', 'number', 'undefined'];
      for (var i = 0; i < operators.length; i++) {
        if (attr.includes(operators[i])) {
          var condition = attr;
          var cParts = condition.split(operators[i]);
          var condLeft = getProp(comp, cParts[0].split('.'), pointers);
          if (validTypes.includes(String(_typeof(condLeft))) === false) {
            logError(comp, "".concat(cParts[0], " cannot be evaluated because it is not a boolean nor a number."));
            return false;
          } else {
            condition = condition.replace(cParts[0], condLeft);
            var evaluate = eval;
            result = evaluate(condition);
          }
        }
      }
    }
    var falseValues = [undefined, null, false, 0, ''];
    if (falseValues.indexOf(result) > -1) {
      return false;
    } else {
      node.removeAttribute('c-if');
      return true;
    }
  },
  'c-ifnot': function cIfnot(comp, node, pointers) {
    var result = !directives['c-if'](comp, node, pointers);
    if (result === true) node.removeAttribute('c-ifnot');
    return result;
  },
  'c-for': function cFor(comp, node, pointers) {
    var attr = node.getAttribute('c-for');
    var stParts = attr.split(' in ');
    var pointer = stParts[0];
    var objectKeys = stParts[1].split('.');
    if (pointers === undefined) pointers = {};
    var iterable = getProp(comp, objectKeys, pointers);
    if (iterable) {
      node.removeAttribute('c-for');
      var parentNode = node.parentNode;
      for (var i = 0; i < iterable.length; i++) {
        var item = iterable[i];
        pointers[pointer] = item;
        var newNode = node.cloneNode(true);
        processNode(comp, newNode, pointers);
        updateAttributePlaceholders(comp, newNode, pointers);
        updateTextNodePlaceholders(comp, newNode, pointers);
        stParts = attr.split(' in ');
        pointer = stParts[0];
        parentNode.appendChild(newNode);
      }
      node.remove();
      return true;
    } else {
      return false;
    }
  }
};

var fetchRequest = function fetchRequest(comp, url, options, callbacks, delay) {
  if (comp.state.loading) return;
  comp.resetState();
  comp.state.loading = true;
  var delayRequest = delay ? delay : 0;
  comp.render(function () {
    setTimeout(function () {
      fetch(url, options).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.error) {
          app.state.error = true;
          if (callbacks && callbacks['error'] instanceof Function) {
            callbacks['error'](data);
          }
        } else {
          app.state.success = true;
          if (callbacks && callbacks['success'] instanceof Function) {
            callbacks['success'](data);
          }
        }
      })["catch"](function (error) {
        app.state.error = true;
        if (callbacks && callbacks['error'] instanceof Function) {
          callbacks['error'](error);
        }
      })["finally"](function () {
        app.state.loading = false;
        if (callbacks && callbacks['finally'] instanceof Function) {
          callbacks['finally']();
        }
        app.render();
      });
    }, delayRequest);
  });
};
var axiosRequest = function axiosRequest(comp, config, callbacks, delay) {
  if (comp.state.loading) return;
  comp.resetState();
  comp.state.loading = true;
  var delayRequest = delay ? delay : 0;
  comp.render(function () {
    setTimeout(function () {
      axios.request(config).then(function (response) {
        comp.state.success = true;
        if (callbacks && callbacks['success'] instanceof Function) {
          var callbackResponse = callbacks['success'](response);
          if (callbackResponse instanceof Object) response = callbackResponse;
        }
      })["catch"](function (error) {
        comp.state.error = true;
        if (callbacks && callbacks['error'] instanceof Function) callbacks['error'](error);
      }).then(function () {
        comp.state.loading = false;
        if (callbacks && callbacks['finally'] instanceof Function) callbacks['finally']();
        comp.render();
      });
    }, delayRequest);
  });
};

function AppBlock(config) {
  var _this = this;
  this.setData = function (newData) {
    var replaceData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (replaceData) {
      this.data = newData;
    } else {
      Object.assign(this.data, newData);
    }
    this.render();
  };
  this.resetState = function () {
    this.state.loading = false;
    this.state.error = false;
    this.state.success = false;
  };
  this.axiosRequest = function (options, callbacks, delay) {
    return axiosRequest(_this, options, callbacks, delay);
  };
  this.fetchRequest = function (url, options, callbacks, delay) {
    return fetchRequest(_this, url, options, callbacks, delay);
  };
  this.prepareTmpDom = function () {
    var comp = this;
    var tmpDOM = comp.template.cloneNode(true);
    processNode(comp, tmpDOM);
    updateTextNodePlaceholders(comp, tmpDOM);
    return tmpDOM;
  };
  this.render = function (callback) {
    var comp = this;
    if (comp.methods.beforeRender instanceof Function) comp.methods.beforeRender(comp);
    var tmpDOM = this.prepareTmpDom();
    console.time(comp.renderEngine + " render time");
    if (comp.renderEngine === 'Idiomorph') {
      comp.idiomorphRender(tmpDOM);
    } else if (comp.renderEngine === 'plain') {
      comp.plainRender(tmpDOM);
    } else {
      logError(comp, "".concat(comp.renderEngine, " renderEngine does not exist."));
    }
    console.timeEnd(comp.renderEngine + " render time");
    if (comp.methods.afterRender instanceof Function) comp.methods.afterRender(comp);
    if (callback instanceof Function) callback();
  };
  this.plainRender = function (tmpDOM) {
    this.el.innerHTML = '';
    this.el.appendChild(tmpDOM);
  };
  this.idiomorphRender = function (tmpDOM) {
    idiomorph_cjs.morph(this.el, tmpDOM, {
      morphStyle: 'innerHTML'
    });
  };
  this.Init = function () {
    var comp = this;
    if (config.name) {
      comp.name = config.name;
    } else {
      comp.name = "AppBlock";
    }
    if (config !== undefined) {
      if (config.el === undefined) {
        logError(comp, "el is empty. Please assign a DOM element to el.");
        return;
      }
      if (config.el === null) {
        logError(comp, "The element you assigned to el is not present.");
        return;
      }
      comp.el = config.el;
      comp.renderEngine = config.renderEngine ? config.renderEngine : "Idiomorph";
      if (config.template) {
        comp.template = config.template.content;
      } else {
        comp.template = document.createDocumentFragment();
        while (comp.el.firstChild) {
          comp.template.appendChild(comp.el.firstChild);
        }
      }
      comp.state = {
        loading: false,
        error: false,
        success: false
      };
      comp.data = {};
      if (config.data instanceof Object) comp.data = config.data;
      comp.utils = helpers;
      comp.utils['comp'] = comp;
      comp.methods = {
        Parent: comp,
        isLoading: function isLoading(thisApp) {
          return thisApp.state.loading;
        },
        isSuccessful: function isSuccessful(thisApp) {
          return thisApp.state.success;
        },
        hasError: function hasError(thisApp) {
          return thisApp.state.error;
        },
        beforeRender: function beforeRender(thisApp) {},
        afterRender: function afterRender(thisApp) {}
      };
      if (config.methods instanceof Object) Object.assign(comp.methods, config.methods);
      comp.directives = directives;
      if (config.directives instanceof Object) Object.assign(comp.directives, config.directives);
      comp.filters = filters;
      if (config.filters instanceof Object) Object.assign(comp.filters, config.filters);
      comp.events = {};
      if (config.events instanceof Object) {
        Object.assign(comp.events, config.events);
        var _loop = function _loop(ev) {
          var eParts = ev.split(' ');
          var eventName = eParts[0];
          var eventElement = eParts[1];
          comp.el.addEventListener(eventName, function (e) {
            comp.el.querySelectorAll(eventElement).forEach(function (el) {
              if (e.srcElement === el) comp.events[ev](e);
            });
          });
        };
        for (var ev in comp.events) {
          _loop(ev);
        }
      }
      comp.events['Parent'] = comp;
    } else {
      return false;
    }
    comp.render();
    return comp;
  };
  return this.Init();
}

module.exports = AppBlock;
