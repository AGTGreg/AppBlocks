import 'core-js/modules/es.array.for-each';
import 'core-js/modules/es.object.assign';
import 'core-js/modules/es.regexp.exec';
import 'core-js/modules/es.string.split';
import 'core-js/modules/web.dom-collections.for-each';
import 'core-js/modules/es.regexp.constructor';
import 'core-js/modules/es.regexp.to-string';
import 'core-js/modules/es.string.match';
import 'core-js/modules/es.string.replace';
import 'core-js/modules/es.array.includes';
import 'core-js/modules/es.string.includes';
import 'core-js/modules/es.function.name';

var getProp = function getProp(comp, keys, pointers) {
  var firstKey = keys[0];
  var root = comp;
  var prop;

  if (pointers && firstKey in pointers) {
    keys.shift();
    root = pointers[firstKey];
  } else if (firstKey in comp.methods) {
    keys.shift();
    prop = comp.methods[firstKey](comp);
  }

  if (keys.length > 0) {
    for (var i = 0; i < keys.length; i++) {
      prop = root[keys[i]];

      if (prop === undefined) {
        break;
      } else {
        root = prop;
      }
    }
  }

  return prop;
};

var getPlaceholderVal = function getPlaceholderVal(comp, placeholder, pointers) {
  if (/{([^}]+)}/.test(placeholder) === false) return;
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
  var textWalker = document.createTreeWalker(nodeTree, NodeFilter.SHOW_TEXT, {
    acceptNode: function acceptNode(node) {
      if (/{([^}]+)}/.test(node.data)) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  });

  while (textWalker.nextNode()) {
    var nodeVal = textWalker.currentNode.nodeValue;
    var props = nodeVal.match(/{([^}]+)}/g);

    for (var i = 0; i < props.length; i++) {
      nodeVal = nodeVal.replace(props[i], getPlaceholderVal(comp, props[i], pointers));
    }

    textWalker.currentNode.nodeValue = nodeVal;
  }
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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
      var validTypes = ['boolean', 'number'];

      for (var i = 0; i < operators.length; i++) {
        if (attr.includes(operators[i])) {
          var condition = attr;
          var cParts = condition.split(operators[i]);
          var condLeft = getProp(comp, cParts[0].split('.'), pointers);
          var condRight = cParts[1];

          if (validTypes.includes(String(_typeof(condLeft))) === false) {
            console.error(cParts[0] + " cannot be evaluated because it is not a boolean or a number.");
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

function AppBlock(config) {
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

  this.request = function (config, callbacks, replaceData) {
    var comp = this;
    if (comp.state.loading) return;
    var cConfig = comp.axiosConfig;

    if (config) {
      Object.assign(cConfig, config);
    }

    comp.resetState();
    comp.state.loading = true;
    var responseData;
    comp.render(function () {
      axios.request(cConfig).then(function (response) {
        comp.state.success = true;

        if (callbacks && callbacks['success'] instanceof Function) {
          var callbackResponse = callbacks['success'](response);
          if (callbackResponse instanceof Object) response = callbackResponse;
        }

        responseData = response.data;
      })["catch"](function (error) {
        comp.state.error = true;
        responseData = error;
        if (callbacks && callbacks['error'] instanceof Function) callbacks['error'](error);
      }).then(function () {
        comp.state.loading = false;
        comp.setData(responseData, replaceData);
        if (callbacks && callbacks['done'] instanceof Function) callbacks['done']();
      });
    });
  };

  this.render = function (callback) {
    var comp = this;
    if (comp.methods.beforeRender instanceof Function) comp.methods.beforeRender(comp);
    var tmpDOM = comp.template.cloneNode(true);
    processNode(comp, tmpDOM);
    updateTextNodePlaceholders(comp, tmpDOM);
    this.el.innerHTML = '';
    this.el.appendChild(tmpDOM);
    if (comp.methods.afterRender instanceof Function) comp.methods.afterRender(comp);
    if (callback instanceof Function) callback();
  };

  this.Init = function () {
    var comp = this;

    if (config !== undefined) {
      if (config.el === undefined) {
        throw "==> el is not set or not present in DOM. Set el to a valid DOM element on init.";
      }

      comp.el = config.el;

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
      comp.axiosConfig = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      };
      if (config.axiosConfig instanceof Object) Object.assign(comp.axiosConfig, config.axiosConfig);
    } else {
      return false;
    }

    comp.render();
    return comp;
  };

  return this.Init();
}

export default AppBlock;
