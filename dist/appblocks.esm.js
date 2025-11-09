var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math === Math && it;
};
var globalThis_1 =
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  (function () { return this; })() || Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var descriptors = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});

var functionBindNative = !fails(function () {
  var test = (function () {  }).bind();
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var call$2 = Function.prototype.call;
var functionCall = functionBindNative ? call$2.bind(call$2) : function () {
  return call$2.apply(call$2, arguments);
};

var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor$4 = Object.getOwnPropertyDescriptor;
var NASHORN_BUG = getOwnPropertyDescriptor$4 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);
var f$8 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$4(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable$1;
var objectPropertyIsEnumerable = {
	f: f$8
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var FunctionPrototype$3 = Function.prototype;
var call$1 = FunctionPrototype$3.call;
var uncurryThisWithBind = functionBindNative && FunctionPrototype$3.bind.bind(call$1, call$1);
var functionUncurryThis = functionBindNative ? uncurryThisWithBind : function (fn) {
  return function () {
    return call$1.apply(fn, arguments);
  };
};

var toString$1 = functionUncurryThis({}.toString);
var stringSlice$7 = functionUncurryThis(''.slice);
var classofRaw = function (it) {
  return stringSlice$7(toString$1(it), 8, -1);
};

var $Object$4 = Object;
var split = functionUncurryThis(''.split);
var indexedObject = fails(function () {
  return !$Object$4('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) === 'String' ? split(it, '') : $Object$4(it);
} : $Object$4;

var isNullOrUndefined = function (it) {
  return it === null || it === undefined;
};

var $TypeError$f = TypeError;
var requireObjectCoercible = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError$f("Can't call method on " + it);
  return it;
};

var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var documentAll = typeof document == 'object' && document.all;
var isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

var isObject = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};
var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis_1[namespace]) : globalThis_1[namespace] && globalThis_1[namespace][method];
};

var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

var navigator = globalThis_1.navigator;
var userAgent = navigator && navigator.userAgent;
var environmentUserAgent = userAgent ? String(userAgent) : '';

var process$3 = globalThis_1.process;
var Deno$1 = globalThis_1.Deno;
var versions = process$3 && process$3.versions || Deno$1 && Deno$1.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split('.');
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}
if (!version && environmentUserAgent) {
  match = environmentUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = environmentUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}
var environmentV8Version = version;

var $String$4 = globalThis_1.String;
var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  return !$String$4(symbol) || !(Object(symbol) instanceof Symbol) ||
    !Symbol.sham && environmentV8Version && environmentV8Version < 41;
});

var useSymbolAsUid = symbolConstructorDetection &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';

var $Object$3 = Object;
var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, $Object$3(it));
};

var $String$3 = String;
var tryToString = function (argument) {
  try {
    return $String$3(argument);
  } catch (error) {
    return 'Object';
  }
};

var $TypeError$e = TypeError;
var aCallable = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError$e(tryToString(argument) + ' is not a function');
};

var getMethod = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

var $TypeError$d = TypeError;
var ordinaryToPrimitive = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
  throw new $TypeError$d("Can't convert object to primitive value");
};

var defineProperty$6 = Object.defineProperty;
var defineGlobalProperty = function (key, value) {
  try {
    defineProperty$6(globalThis_1, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis_1[key] = value;
  } return value;
};

var sharedStore = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = module.exports = globalThis_1[SHARED] || defineGlobalProperty(SHARED, {});
(store.versions || (store.versions = [])).push({
  version: '3.46.0',
  mode: 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru), 2025 CoreJS Company (core-js.io)',
  license: 'https://github.com/zloirock/core-js/blob/v3.46.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});
});

var shared = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value || {});
};

var $Object$2 = Object;
var toObject = function (argument) {
  return $Object$2(requireObjectCoercible(argument));
};

var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

var id = 0;
var postfix = Math.random();
var toString = functionUncurryThis(1.1.toString);
var uid = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

var Symbol$2 = globalThis_1.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = useSymbolAsUid ? Symbol$2['for'] || Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid;
var wellKnownSymbol = function (name) {
  if (!hasOwnProperty_1(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = symbolConstructorDetection && hasOwnProperty_1(Symbol$2, name)
      ? Symbol$2[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var $TypeError$c = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var toPrimitive = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = functionCall(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError$c("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPropertyKey = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var document$3 = globalThis_1.document;
var EXISTS$1 = isObject(document$3) && isObject(document$3.createElement);
var documentCreateElement = function (it) {
  return EXISTS$1 ? document$3.createElement(it) : {};
};

var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});

var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var f$7 = descriptors ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor$1(O, P);
  } catch (error) {  }
  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
};
var objectGetOwnPropertyDescriptor = {
	f: f$7
};

var v8PrototypeDefineBug = descriptors && fails(function () {
  return Object.defineProperty(function () {  }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});

var $String$2 = String;
var $TypeError$b = TypeError;
var anObject = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError$b($String$2(argument) + ' is not an object');
};

var $TypeError$a = TypeError;
var $defineProperty = Object.defineProperty;
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';
var f$6 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {  }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError$a('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};
var objectDefineProperty = {
	f: f$6
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var FunctionPrototype$2 = Function.prototype;
var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwnProperty_1(FunctionPrototype$2, 'name');
var PROPER = EXISTS && (function something() {  }).name === 'something';
var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$2, 'name').configurable));
var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var functionToString$1 = functionUncurryThis(Function.toString);
if (!isCallable(sharedStore.inspectSource)) {
  sharedStore.inspectSource = function (it) {
    return functionToString$1(it);
  };
}
var inspectSource = sharedStore.inspectSource;

var WeakMap$1 = globalThis_1.WeakMap;
var weakMapBasicDetection = isCallable(WeakMap$1) && /native code/.test(String(WeakMap$1));

var keys$1 = shared('keys');
var sharedKey = function (key) {
  return keys$1[key] || (keys$1[key] = uid(key));
};

var hiddenKeys$1 = {};

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$2 = globalThis_1.TypeError;
var WeakMap = globalThis_1.WeakMap;
var set$1, get, has;
var enforce = function (it) {
  return has(it) ? get(it) : set$1(it, {});
};
var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError$2('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};
if (weakMapBasicDetection || sharedStore.state) {
  var store = sharedStore.state || (sharedStore.state = new WeakMap());
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  set$1 = function (it, metadata) {
    if (store.has(it)) throw new TypeError$2(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys$1[STATE] = true;
  set$1 = function (it, metadata) {
    if (hasOwnProperty_1(it, STATE)) throw new TypeError$2(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwnProperty_1(it, STATE);
  };
}
var internalState = {
  set: set$1,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var makeBuiltIn_1 = createCommonjsModule(function (module) {
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var enforceInternalState = internalState.enforce;
var getInternalState = internalState.get;
var $String = String;
var defineProperty = Object.defineProperty;
var stringSlice = functionUncurryThis(''.slice);
var replace = functionUncurryThis(''.replace);
var join = functionUncurryThis([].join);
var CONFIGURABLE_LENGTH = descriptors && !fails(function () {
  return defineProperty(function () {  }, 'length', { value: 8 }).length !== 8;
});
var TEMPLATE = String(String).split('String');
var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (descriptors) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwnProperty_1(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwnProperty_1(options, 'constructor') && options.constructor) {
      if (descriptors) defineProperty(value, 'prototype', { writable: false });
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) {  }
  var state = enforceInternalState(value);
  if (!hasOwnProperty_1(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');
});

var defineBuiltIn = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn_1(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) {  }
    if (simple) O[key] = value;
    else objectDefineProperty.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

var ceil = Math.ceil;
var floor$1 = Math.floor;
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor$1 : ceil)(n);
};

var toIntegerOrInfinity = function (argument) {
  var number = +argument;
  return number !== number || number === 0 ? 0 : mathTrunc(number);
};

var max$2 = Math.max;
var min$5 = Math.min;
var toAbsoluteIndex = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max$2(integer + length, 0) : min$5(integer, length);
};

var min$4 = Math.min;
var toLength = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min$4(len, 0x1FFFFFFFFFFFFF) : 0;
};

var lengthOfArrayLike = function (obj) {
  return toLength(obj.length);
};

var createMethod$4 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      if (value !== value) return true;
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
var arrayIncludes = {
  includes: createMethod$4(true),
  indexOf: createMethod$4(false)
};

var indexOf$1 = arrayIncludes.indexOf;
var push$4 = functionUncurryThis([].push);
var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$4(result, key);
  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
    ~indexOf$1(result, key) || push$4(result, key);
  }
  return result;
};

var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys = enumBugKeys.concat('length', 'prototype');
var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys);
};
var objectGetOwnPropertyNames = {
	f: f$5
};

var f$4 = Object.getOwnPropertySymbols;
var objectGetOwnPropertySymbols = {
	f: f$4
};

var concat$2 = functionUncurryThis([].concat);
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? concat$2(keys, getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwnProperty_1(target, key) && !(exceptions && hasOwnProperty_1(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var replacement = /#|\.prototype\./;
var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};
var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
var isForced_1 = isForced;

var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis_1;
  } else if (STATIC) {
    target = globalThis_1[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis_1[TARGET] && globalThis_1[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor$3(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

var functionUncurryThisClause = function (fn) {
  if (classofRaw(fn) === 'Function') return functionUncurryThis(fn);
};

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    method.call(null, argument || function () { return 1; }, 1);
  });
};

var $indexOf = arrayIncludes.indexOf;
var nativeIndexOf = functionUncurryThisClause([].indexOf);
var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
var FORCED$3 = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');
_export({ target: 'Array', proto: true, forced: FORCED$3 }, {
  indexOf: function indexOf(searchElement ) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      ? nativeIndexOf(this, searchElement, fromIndex) || 0
      : $indexOf(this, searchElement, fromIndex);
  }
});

var isArray = Array.isArray || function isArray(argument) {
  return classofRaw(argument) === 'Array';
};

_export({ target: 'Array', stat: true }, {
  isArray: isArray
});

var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

var f$3 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
  return O;
};
var objectDefineProperties = {
	f: f$3
};

var html = getBuiltIn('document', 'documentElement');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey('IE_PROTO');
var EmptyConstructor = function () {  };
var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null;
  return temp;
};
var NullProtoObjectViaIFrame = function () {
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) {  }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument)
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument);
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};
hiddenKeys$1[IE_PROTO$1] = true;
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
};

var defineProperty$5 = objectDefineProperty.f;
var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype$1 = Array.prototype;
if (ArrayPrototype$1[UNSCOPABLES] === undefined) {
  defineProperty$5(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}
var addToUnscopables = function (key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};

var iterators = {};

var correctPrototypeGetter = !fails(function () {
  function F() {  }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO = sharedKey('IE_PROTO');
var $Object$1 = Object;
var ObjectPrototype = $Object$1.prototype;
var objectGetPrototypeOf = correctPrototypeGetter ? $Object$1.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object$1 ? ObjectPrototype : null;
};

var ITERATOR$6 = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;
var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
if ([].keys) {
  arrayIterator = [].keys();
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
  }
}
var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype$2) || fails(function () {
  var test = {};
  return IteratorPrototype$2[ITERATOR$6].call(test) !== test;
});
if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};
if (!isCallable(IteratorPrototype$2[ITERATOR$6])) {
  defineBuiltIn(IteratorPrototype$2, ITERATOR$6, function () {
    return this;
  });
}
var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$2,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var defineProperty$4 = objectDefineProperty.f;
var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
var setToStringTag = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwnProperty_1(target, TO_STRING_TAG$2)) {
    defineProperty$4(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
var returnThis$1 = function () { return this; };
var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var functionUncurryThisAccessor = function (object, key, method) {
  try {
    return functionUncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) {  }
};

var isPossiblePrototype = function (argument) {
  return isObject(argument) || argument === null;
};

var $String$1 = String;
var $TypeError$9 = TypeError;
var aPossiblePrototype = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError$9("Can't set " + $String$1(argument) + ' as a prototype');
};

var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = functionUncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) {  }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var PROPER_FUNCTION_NAME$2 = functionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var IteratorPrototype = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$5 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';
var returnThis = function () { return this; };
var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  iteratorCreateConstructor(IteratorConstructor, NAME, next);
  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    }
    return function () { return new IteratorConstructor(this); };
  };
  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$5]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$5])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR$5, returnThis);
        }
      }
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }
  if (PROPER_FUNCTION_NAME$2 && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return functionCall(nativeIterator, this); };
    }
  }
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }
  if (IterablePrototype[ITERATOR$5] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR$5, defaultIterator, { name: DEFAULT });
  }
  iterators[NAME] = defaultIterator;
  return methods;
};

var createIterResultObject = function (value, done) {
  return { value: value, done: done };
};

var defineProperty$3 = objectDefineProperty.f;
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$3 = internalState.set;
var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);
var es_array_iterator = iteratorDefine(Array, 'Array', function (iterated, kind) {
  setInternalState$3(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated),
    index: 0,
    kind: kind
  });
}, function () {
  var state = getInternalState$2(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  switch (state.kind) {
    case 'keys': return createIterResultObject(index, false);
    case 'values': return createIterResultObject(target[index], false);
  } return createIterResultObject([index, target[index]], false);
}, 'values');
var values = iterators.Arguments = iterators.Array;
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
if (descriptors && values.name !== 'values') try {
  defineProperty$3(values, 'name', { value: 'values' });
} catch (error) {  }

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG$1] = 'z';
var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) {  }
};
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    : CORRECT_ARGUMENTS ? classofRaw(O)
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

var noop = function () {  };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec$1 = functionUncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);
var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};
var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    return INCORRECT_TO_STRING || !!exec$1(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};
isConstructorLegacy.sham = true;
var isConstructor = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

var createProperty = function (object, key, value) {
  if (descriptors) objectDefineProperty.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};

var SPECIES$6 = wellKnownSymbol('species');
var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  return environmentV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$6] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var arraySlice = functionUncurryThis([].slice);

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
var SPECIES$5 = wellKnownSymbol('species');
var $Array$2 = Array;
var max$1 = Math.max;
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      if (isConstructor(Constructor) && (Constructor === $Array$2 || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$5];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array$2 || Constructor === undefined) {
        return arraySlice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array$2 : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var defineBuiltInAccessor = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn_1(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn_1(descriptor.set, name, { setter: true });
  return objectDefineProperty.f(target, name, descriptor);
};

var FUNCTION_NAME_EXISTS = functionName.EXISTS;
var FunctionPrototype$1 = Function.prototype;
var functionToString = functionUncurryThis(FunctionPrototype$1.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = functionUncurryThis(nameRE.exec);
var NAME = 'name';
if (descriptors && !FUNCTION_NAME_EXISTS) {
  defineBuiltInAccessor(FunctionPrototype$1, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var $getOwnPropertyNames = objectGetOwnPropertyNames.f;
var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];
var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};
var f$2 = function getOwnPropertyNames(it) {
  return windowNames && classofRaw(it) === 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};
var objectGetOwnPropertyNamesExternal = {
	f: f$2
};

var arrayBufferNonExtensible = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});

var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES$1 = fails(function () { $isExtensible(1); });
var objectIsExtensible = (FAILS_ON_PRIMITIVES$1 || arrayBufferNonExtensible) ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (arrayBufferNonExtensible && classofRaw(it) === 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;

var freezing = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;
var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;
var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++,
    weakData: {}
  } });
};
var fastKey = function (it, create) {
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwnProperty_1(it, METADATA)) {
    if (!objectIsExtensible(it)) return 'F';
    if (!create) return 'E';
    setMetadata(it);
  } return it[METADATA].objectID;
};
var getWeakData = function (it, create) {
  if (!hasOwnProperty_1(it, METADATA)) {
    if (!objectIsExtensible(it)) return true;
    if (!create) return false;
    setMetadata(it);
  } return it[METADATA].weakData;
};
var onFreeze = function (it) {
  if (freezing && REQUIRED && objectIsExtensible(it) && !hasOwnProperty_1(it, METADATA)) setMetadata(it);
  return it;
};
var enable = function () {
  meta.enable = function () {  };
  REQUIRED = true;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var splice = functionUncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;
  if (getOwnPropertyNames(test).length) {
    objectGetOwnPropertyNames.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };
    _export({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
    });
  }
};
var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};
hiddenKeys$1[METADATA] = true;
});
internalMetadata.enable;
internalMetadata.fastKey;
internalMetadata.getWeakData;
internalMetadata.onFreeze;

var bind$1 = functionUncurryThisClause(functionUncurryThisClause.bind);
var functionBindContext = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : functionBindNative ? bind$1(fn, that) : function () {
    return fn.apply(that, arguments);
  };
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$4] === it);
};

var ITERATOR$3 = wellKnownSymbol('iterator');
var getIteratorMethod = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR$3)
    || getMethod(it, '@@iterator')
    || iterators[classof(it)];
};

var $TypeError$8 = TypeError;
var getIterator = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
  throw new $TypeError$8(tryToString(argument) + ' is not iterable');
};

var iteratorClose = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = functionCall(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

var $TypeError$7 = TypeError;
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};
var ResultPrototype = Result.prototype;
var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;
  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal');
    return new Result(true, condition);
  };
  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };
  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError$7(tryToString(iterable) + ' is not iterable');
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && objectIsPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }
  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = functionCall(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};

var $TypeError$6 = TypeError;
var anInstance = function (it, Prototype) {
  if (objectIsPrototypeOf(Prototype, it)) return it;
  throw new $TypeError$6('Incorrect invocation');
};

var ITERATOR$2 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;
try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$2] = function () {
    return this;
  };
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) {  }
var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; }
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$2] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) {  }
  return ITERATION_SUPPORT;
};

var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    objectSetPrototypeOf &&
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = globalThis_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};
  var fixMethod = function (KEY) {
    var uncurriedNativeMethod = functionUncurryThis(NativePrototype[KEY]);
    defineBuiltIn(NativePrototype, KEY,
      KEY === 'add' ? function add(value) {
        uncurriedNativeMethod(this, value === 0 ? 0 : value);
        return this;
      } : KEY === 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY === 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY === 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };
  var REPLACE = isForced_1(
    CONSTRUCTOR_NAME,
    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    }))
  );
  if (REPLACE) {
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    internalMetadata.enable();
  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) !== instance;
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, NativePrototype);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }
  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, constructor: true, forced: Constructor !== NativeConstructor }, exported);
  setToStringTag(Constructor, CONSTRUCTOR_NAME);
  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
  return Constructor;
};

var defineBuiltIns = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};

var SPECIES$4 = wellKnownSymbol('species');
var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  if (descriptors && Constructor && !Constructor[SPECIES$4]) {
    defineBuiltInAccessor(Constructor, SPECIES$4, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var fastKey = internalMetadata.fastKey;
var setInternalState$2 = internalState.set;
var internalStateGetterFor = internalState.getterFor;
var collectionStrong = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState$2(that, {
        type: CONSTRUCTOR_NAME,
        index: objectCreate(null),
        first: null,
        last: null,
        size: 0
      });
      if (!descriptors) that.size = 0;
      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });
    var Prototype = Constructor.prototype;
    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      if (entry) {
        entry.value = value;
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: null,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (descriptors) state.size++;
        else that.size++;
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };
    var getEntry = function (that, key) {
      var state = getInternalState(that);
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key === key) return entry;
      }
    };
    defineBuiltIns(Prototype, {
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = null;
          entry = entry.next;
        }
        state.first = state.last = null;
        state.index = objectCreate(null);
        if (descriptors) state.size = 0;
        else that.size = 0;
      },
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first === entry) state.first = next;
          if (state.last === entry) state.last = prev;
          if (descriptors) state.size--;
          else that.size--;
        } return !!entry;
      },
      forEach: function forEach(callbackfn ) {
        var state = getInternalState(this);
        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });
    defineBuiltIns(Prototype, IS_MAP ? {
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (descriptors) defineBuiltInAccessor(Prototype, 'size', {
      configurable: true,
      get: function () {
        return getInternalState(this).size;
      }
    });
    return Constructor;
  },
  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    iteratorDefine(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState$2(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: null
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      while (entry && entry.removed) entry = entry.previous;
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        state.target = null;
        return createIterResultObject(undefined, true);
      }
      if (kind === 'keys') return createIterResultObject(entry.key, false);
      if (kind === 'values') return createIterResultObject(entry.value, false);
      return createIterResultObject([entry.key, entry.value], false);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
    setSpecies(CONSTRUCTOR_NAME);
  }
};
collectionStrong.getConstructor;
collectionStrong.setStrong;

collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var $assign = Object.assign;
var defineProperty$2 = Object.defineProperty;
var concat$1 = functionUncurryThis([].concat);
var objectAssign = !$assign || fails(function () {
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$2({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$2(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  var A = {};
  var B = {};
  var symbol = Symbol('assign detection');
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
}) ? function assign(target, source) {
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat$1(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

_export({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

if (!toStringTagSupport) {
  defineBuiltIn(Object.prototype, 'toString', objectToString, { unsafe: true });
}

var $String = String;
var toString_1 = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};

var charAt$6 = functionUncurryThis(''.charAt);
var charCodeAt = functionUncurryThis(''.charCodeAt);
var stringSlice$6 = functionUncurryThis(''.slice);
var createMethod$3 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString_1(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt$6(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice$6(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};
var stringMultibyte = {
  codeAt: createMethod$3(false),
  charAt: createMethod$3(true)
};

var charAt$5 = stringMultibyte.charAt;
var STRING_ITERATOR = 'String Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);
iteratorDefine(String, 'String', function (iterated) {
  setInternalState$1(this, {
    type: STRING_ITERATOR,
    string: toString_1(iterated),
    index: 0
  });
}, function next() {
  var state = getInternalState$1(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt$5(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});

var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var replace$3 = functionUncurryThis(''.replace);
var ltrim = RegExp('^[' + whitespaces + ']+');
var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');
var createMethod$2 = function (TYPE) {
  return function ($this) {
    var string = toString_1(requireObjectCoercible($this));
    if (TYPE & 1) string = replace$3(string, ltrim, '');
    if (TYPE & 2) string = replace$3(string, rtrim, '$1');
    return string;
  };
};
var stringTrim = {
  start: createMethod$2(1),
  end: createMethod$2(2),
  trim: createMethod$2(3)
};

var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
var non = '\u200B\u0085\u180E';
var stringTrimForced = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]()
      || non[METHOD_NAME]() !== non
      || (PROPER_FUNCTION_NAME$1 && whitespaces[METHOD_NAME].name !== METHOD_NAME);
  });
};

var $trim = stringTrim.trim;
_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

var ITERATOR$1 = wellKnownSymbol('iterator');
var ArrayValues = es_array_iterator.values;
var handlePrototype$1 = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    if (CollectionPrototype[ITERATOR$1] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$1, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$1] = ArrayValues;
    }
    setToStringTag(CollectionPrototype, COLLECTION_NAME, true);
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
};
for (var COLLECTION_NAME$1 in domIterables) {
  handlePrototype$1(globalThis_1[COLLECTION_NAME$1] && globalThis_1[COLLECTION_NAME$1].prototype, COLLECTION_NAME$1);
}
handlePrototype$1(domTokenListPrototype, 'DOMTokenList');

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

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
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
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var SPECIES$3 = wellKnownSymbol('species');
var $Array$1 = Array;
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    if (isConstructor(C) && (C === $Array$1 || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$3];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array$1 : C;
};

var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var push$3 = functionUncurryThis([].push);
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE === 1;
  var IS_FILTER = TYPE === 2;
  var IS_SOME = TYPE === 3;
  var IS_EVERY = TYPE === 4;
  var IS_FIND_INDEX = TYPE === 6;
  var IS_FILTER_REJECT = TYPE === 7;
  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var length = lengthOfArrayLike(self);
    var boundFunction = functionBindContext(callbackfn, that);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result;
        else if (result) switch (TYPE) {
          case 3: return true;
          case 5: return value;
          case 6: return index;
          case 2: push$3(target, value);
        } else switch (TYPE) {
          case 4: return false;
          case 7: push$3(target, value);
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};
var arrayIteration = {
  forEach: createMethod$1(0),
  map: createMethod$1(1),
  filter: createMethod$1(2),
  some: createMethod$1(3),
  every: createMethod$1(4),
  find: createMethod$1(5),
  findIndex: createMethod$1(6),
  filterReject: createMethod$1(7)
};

var $filter = arrayIteration.filter;
var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  filter: function filter(callbackfn ) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $forEach = arrayIteration.forEach;
var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn ) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

_export({ target: 'Array', proto: true, forced: [].forEach !== arrayForEach }, {
  forEach: arrayForEach
});

var $includes = arrayIncludes.includes;
var BROKEN_ON_SPARSE = fails(function () {
  return !Array(1).includes();
});
_export({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el ) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});
addToUnscopables('includes');

var $map = arrayIteration.map;
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn ) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};

var $RegExp$2 = globalThis_1.RegExp;
var UNSUPPORTED_Y$3 = fails(function () {
  var re = $RegExp$2('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') !== null;
});
var MISSED_STICKY$1 = UNSUPPORTED_Y$3 || fails(function () {
  return !$RegExp$2('a', 'y').sticky;
});
var BROKEN_CARET = UNSUPPORTED_Y$3 || fails(function () {
  var re = $RegExp$2('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') !== null;
});
var regexpStickyHelpers = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY$1,
  UNSUPPORTED_Y: UNSUPPORTED_Y$3
};

var $RegExp$1 = globalThis_1.RegExp;
var regexpUnsupportedDotAll = fails(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.test('\n') && re.flags === 's');
});

var $RegExp = globalThis_1.RegExp;
var regexpUnsupportedNcg = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

var getInternalState = internalState.get;
var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt$4 = functionUncurryThis(''.charAt);
var indexOf = functionUncurryThis(''.indexOf);
var replace$2 = functionUncurryThis(''.replace);
var stringSlice$5 = functionUncurryThis(''.slice);
var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  functionCall(nativeExec, re1, 'a');
  functionCall(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();
var UNSUPPORTED_Y$2 = regexpStickyHelpers.BROKEN_CARET;
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || regexpUnsupportedDotAll || regexpUnsupportedNcg;
if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString_1(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;
    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = functionCall(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }
    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$2 && re.sticky;
    var flags = functionCall(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;
    if (sticky) {
      flags = replace$2(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }
      strCopy = stringSlice$5(str, re.lastIndex);
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$4(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }
    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
    match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);
    if (sticky) {
      if (match) {
        match.input = stringSlice$5(match.input, charsAdded);
        match[0] = stringSlice$5(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      functionCall(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }
    if (match && groups) {
      match.groups = object = objectCreate(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }
    return match;
  };
}
var regexpExec = patchedExec;

_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

var MATCH$2 = wellKnownSymbol('match');
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classofRaw(it) === 'RegExp');
};

var $TypeError$5 = TypeError;
var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw new $TypeError$5("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');
var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) {  }
  } return false;
};

var stringIndexOf$3 = functionUncurryThis(''.indexOf);
_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
  includes: function includes(searchString ) {
    return !!~stringIndexOf$3(
      toString_1(requireObjectCoercible(this)),
      toString_1(notARegexp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;
var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

var SPECIES$2 = wellKnownSymbol('species');
var RegExpPrototype$3 = RegExp.prototype;
var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);
  var DELEGATES_TO_SYMBOL = !fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) !== 7;
  });
  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    var execCalled = false;
    var re = /a/;
    if (KEY === 'split') {
      re = {};
      re.constructor = {};
      re.constructor[SPECIES$2] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }
    re.exec = function () {
      execCalled = true;
      return null;
    };
    re[SYMBOL]('');
    return !execCalled;
  });
  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype$3.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          return { done: true, value: functionCall(nativeRegExpMethod, regexp, str, arg2) };
        }
        return { done: true, value: functionCall(nativeMethod, str, regexp, arg2) };
      }
      return { done: false };
    });
    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype$3, SYMBOL, methods[1]);
  }
  if (SHAM) createNonEnumerableProperty(RegExpPrototype$3[SYMBOL], 'sham', true);
};

var charAt$3 = stringMultibyte.charAt;
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt$3(S, index).length : 1);
};

var floor = Math.floor;
var charAt$2 = functionUncurryThis(''.charAt);
var replace$1 = functionUncurryThis(''.replace);
var stringSlice$4 = functionUncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace$1(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt$2(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice$4(str, 0, position);
      case "'": return stringSlice$4(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice$4(ch, 1, -1)];
        break;
      default:
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt$2(ch, 1) : captures[f - 1] + charAt$2(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

var RegExp$1 = globalThis_1.RegExp;
var FLAGS_GETTER_IS_CORRECT = !fails(function () {
  var INDICES_SUPPORT = true;
  try {
    RegExp$1('.', 'd');
  } catch (error) {
    INDICES_SUPPORT = false;
  }
  var O = {};
  var calls = '';
  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';
  var addGetter = function (key, chr) {
    Object.defineProperty(O, key, { get: function () {
      calls += chr;
      return true;
    } });
  };
  var pairs = {
    dotAll: 's',
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y'
  };
  if (INDICES_SUPPORT) pairs.hasIndices = 'd';
  for (var key in pairs) addGetter(key, pairs[key]);
  var result = Object.getOwnPropertyDescriptor(RegExp$1.prototype, 'flags').get.call(O);
  return result !== expected || calls !== expected;
});
var regexpFlagsDetection = { correct: FLAGS_GETTER_IS_CORRECT };

var RegExpPrototype$2 = RegExp.prototype;
var regexpGetFlags = regexpFlagsDetection.correct ? function (it) {
  return it.flags;
} : function (it) {
  return (!regexpFlagsDetection.correct && objectIsPrototypeOf(RegExpPrototype$2, it) && !hasOwnProperty_1(it, 'flags'))
    ? functionCall(regexpFlags, it)
    : it.flags;
};

var $TypeError$4 = TypeError;
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = functionCall(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classofRaw(R) === 'RegExp') return functionCall(regexpExec, R, S);
  throw new $TypeError$4('RegExp#exec called on incompatible receiver');
};

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min$3 = Math.min;
var concat = functionUncurryThis([].concat);
var push$2 = functionUncurryThis([].push);
var stringIndexOf$2 = functionUncurryThis(''.indexOf);
var stringSlice$3 = functionUncurryThis(''.slice);
var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();
var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});
fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
  return [
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = isObject(searchValue) ? getMethod(searchValue, REPLACE) : undefined;
      return replacer
        ? functionCall(replacer, searchValue, O, replaceValue)
        : functionCall(nativeReplace, toString_1(O), searchValue, replaceValue);
    },
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString_1(string);
      if (
        typeof replaceValue == 'string' &&
        stringIndexOf$2(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf$2(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }
      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString_1(replaceValue);
      var flags = toString_1(regexpGetFlags(rx));
      var global = stringIndexOf$2(flags, 'g') !== -1;
      var fullUnicode;
      if (global) {
        fullUnicode = stringIndexOf$2(flags, 'u') !== -1;
        rx.lastIndex = 0;
      }
      var results = [];
      var result;
      while (true) {
        result = regexpExecAbstract(rx, S);
        if (result === null) break;
        push$2(results, result);
        if (!global) break;
        var matchStr = toString_1(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = toString_1(result[0]);
        var position = max(min$3(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        var replacement;
        for (var j = 1; j < result.length; j++) push$2(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push$2(replacerArgs, namedCaptures);
          replacement = toString_1(functionApply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice$3(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice$3(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

var handlePrototype = function (CollectionPrototype) {
  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype.forEach = arrayForEach;
  }
};
for (var COLLECTION_NAME in domIterables) {
  if (domIterables[COLLECTION_NAME]) {
    handlePrototype(globalThis_1[COLLECTION_NAME] && globalThis_1[COLLECTION_NAME].prototype);
  }
}
handlePrototype(domTokenListPrototype);

var $some = arrayIteration.some;
var STRICT_METHOD = arrayMethodIsStrict('some');
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
  some: function some(callbackfn ) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var stringIndexOf$1 = functionUncurryThis(''.indexOf);
fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = isObject(regexp) ? getMethod(regexp, MATCH) : undefined;
      return matcher ? functionCall(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString_1(O));
    },
    function (string) {
      var rx = anObject(this);
      var S = toString_1(string);
      var res = maybeCallNative(nativeMatch, rx, S);
      if (res.done) return res.value;
      var flags = toString_1(regexpGetFlags(rx));
      if (stringIndexOf$1(flags, 'g') === -1) return regexpExecAbstract(rx, S);
      var fullUnicode = stringIndexOf$1(flags, 'u') !== -1;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = toString_1(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

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
var isBlockedExpression = function isBlockedExpression(expr) {
  var blockedPatterns = [/\bconstructor\b/, /\b__proto__\b/, /\beval\b/, /\bFunction\b/, /(?<![=!<>])=(?![=])/, /\+\+|--/, /\bnew\b/, /\bfunction\b/, /\bclass\b/, /=>/, /\bimport\b/, /\bawait\b/, /\byield\b/, /\btry\b|\bcatch\b|\bfinally\b/, /\bdelete\b/];
  return blockedPatterns.some(function (pattern) {
    return pattern.test(expr);
  });
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

var $TypeError$3 = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var doesNotExceedSafeInteger = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError$3('Maximum allowed index exceeded');
  return it;
};

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var IS_CONCAT_SPREADABLE_SUPPORT = environmentV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});
var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};
var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');
_export({ target: 'Array', proto: true, arity: 1, forced: FORCED$2 }, {
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

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

var $propertyIsEnumerable = objectPropertyIsEnumerable.f;
var propertyIsEnumerable = functionUncurryThis($propertyIsEnumerable);
var push$1 = functionUncurryThis([].push);
var IE_BUG = descriptors && fails(function () {
  var O = Object.create(null);
  O[2] = 2;
  return !propertyIsEnumerable(O, 2);
});
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var IE_WORKAROUND = IE_BUG && objectGetPrototypeOf(O) === null;
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!descriptors || (IE_WORKAROUND ? key in O : propertyIsEnumerable(O, key))) {
        push$1(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};
var objectToArray = {
  entries: createMethod(true),
  values: createMethod(false)
};

var $entries = objectToArray.entries;
_export({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

_export({ target: 'Object', stat: true }, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, { AS_ENTRIES: true });
    return obj;
  }
});

var trim = stringTrim.trim;
var charAt$1 = functionUncurryThis(''.charAt);
var $parseFloat = globalThis_1.parseFloat;
var Symbol$1 = globalThis_1.Symbol;
var ITERATOR = Symbol$1 && Symbol$1.iterator;
var FORCED$1 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity
  || (ITERATOR && !fails(function () { $parseFloat(Object(ITERATOR)); }));
var numberParseFloat = FORCED$1 ? function parseFloat(string) {
  var trimmedString = trim(toString_1(string));
  var result = $parseFloat(trimmedString);
  return result === 0 && charAt$1(trimmedString, 0) === '-' ? -0 : result;
} : $parseFloat;

_export({ global: true, forced: parseFloat !== numberParseFloat }, {
  parseFloat: numberParseFloat
});

var defineProperty$1 = objectDefineProperty.f;
var proxyAccessor = function (Target, Source, key) {
  key in Target || defineProperty$1(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var enforceInternalState = internalState.enforce;
var MATCH = wellKnownSymbol('match');
var NativeRegExp = globalThis_1.RegExp;
var RegExpPrototype$1 = NativeRegExp.prototype;
var SyntaxError = globalThis_1.SyntaxError;
var exec = functionUncurryThis(RegExpPrototype$1.exec);
var charAt = functionUncurryThis(''.charAt);
var replace = functionUncurryThis(''.replace);
var stringIndexOf = functionUncurryThis(''.indexOf);
var stringSlice$2 = functionUncurryThis(''.slice);
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;
var CORRECT_NEW = new NativeRegExp(re1) !== re1;
var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;
var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;
var BASE_FORCED = descriptors &&
  (!CORRECT_NEW || MISSED_STICKY || regexpUnsupportedDotAll || regexpUnsupportedNcg || fails(function () {
    re2[MATCH] = false;
    return NativeRegExp(re1) !== re1 || NativeRegExp(re2) === re2 || String(NativeRegExp(re1, 'i')) !== '/a/i';
  }));
var handleDotAll = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      result += chr + charAt(string, ++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      } result += chr;
    }
  } return result;
};
var handleNCG = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = objectCreate(null);
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      chr += charAt(string, ++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        result += chr;
        if (stringSlice$2(string, index + 1, index + 3) === '?:') {
          continue;
        }
        if (exec(IS_NCG, stringSlice$2(string, index + 1))) {
          index += 2;
          ncg = true;
        }
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || hasOwnProperty_1(names, groupname)) {
          throw new SyntaxError('Invalid capture group name');
        }
        names[groupname] = true;
        named[named.length] = [groupname, groupid];
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;
    else result += chr;
  } return [result, named];
};
if (isForced_1('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = objectIsPrototypeOf(RegExpPrototype$1, this);
    var patternIsRegExp = isRegexp(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;
    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }
    if (patternIsRegExp || objectIsPrototypeOf(RegExpPrototype$1, pattern)) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = regexpGetFlags(rawPattern);
    }
    pattern = pattern === undefined ? '' : toString_1(pattern);
    flags = flags === undefined ? '' : toString_1(flags);
    rawPattern = pattern;
    if (regexpUnsupportedDotAll && 'dotAll' in re1) {
      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
      if (dotAll) flags = replace(flags, /s/g, '');
    }
    rawFlags = flags;
    if (MISSED_STICKY && 'sticky' in re1) {
      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
      if (sticky && UNSUPPORTED_Y$1) flags = replace(flags, /y/g, '');
    }
    if (regexpUnsupportedNcg) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }
    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }
    if (pattern !== rawPattern) try {
      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) {  }
    return result;
  };
  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
  }
  RegExpPrototype$1.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$1;
  defineBuiltIn(globalThis_1, 'RegExp', RegExpWrapper, { constructor: true });
}
setSpecies('RegExp');

var PROPER_FUNCTION_NAME = functionName.PROPER;
var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];
var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) !== '/a/b'; });
var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name !== TO_STRING;
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExpPrototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = toString_1(R.source);
    var flags = toString_1(regexpGetFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}

var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var slice = functionUncurryThisClause(''.slice);
var min$2 = Math.min;
var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('endsWith');
var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
  var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'endsWith');
  return descriptor && !descriptor.writable;
}();
_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
  endsWith: function endsWith(searchString ) {
    var that = toString_1(requireObjectCoercible(this));
    notARegexp(searchString);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = that.length;
    var end = endPosition === undefined ? len : min$2(toLength(endPosition), len);
    var search = toString_1(searchString);
    return slice(that, end - search.length, end) === search;
  }
});

var $TypeError$2 = TypeError;
var aConstructor = function (argument) {
  if (isConstructor(argument)) return argument;
  throw new $TypeError$2(tryToString(argument) + ' is not a constructor');
};

var SPECIES$1 = wellKnownSymbol('species');
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES$1]) ? defaultConstructor : aConstructor(S);
};

var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 0xFFFFFFFF;
var min$1 = Math.min;
var push = functionUncurryThis([].push);
var stringSlice$1 = functionUncurryThis(''.slice);
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});
var BUGGY = 'abbc'.split(/(b)*/)[1] === 'c' ||
  'test'.split(/(?:)/, -1).length !== 4 ||
  'ab'.split(/(?:ab)*/).length !== 2 ||
  '.'.split(/(.?)(.?)/).length !== 4 ||
  '.'.split(/()()/).length > 1 ||
  ''.split(/.?/).length;
fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit = '0'.split(undefined, 0).length ? function (separator, limit) {
    return separator === undefined && limit === 0 ? [] : functionCall(nativeSplit, this, separator, limit);
  } : nativeSplit;
  return [
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = isObject(separator) ? getMethod(separator, SPLIT) : undefined;
      return splitter
        ? functionCall(splitter, separator, O, limit)
        : functionCall(internalSplit, toString_1(O), separator, limit);
    },
    function (string, limit) {
      var rx = anObject(this);
      var S = toString_1(string);
      if (!BUGGY) {
        var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
        if (res.done) return res.value;
      }
      var C = speciesConstructor(rx, RegExp);
      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y');
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y ? stringSlice$1(S, q) : S);
        var e;
        if (
          z === null ||
          (e = min$1(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          push(A, stringSlice$1(S, p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            push(A, z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      push(A, stringSlice$1(S, p));
      return A;
    }
  ];
}, BUGGY || !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var stringSlice = functionUncurryThisClause(''.slice);
var min = Math.min;
var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor$1(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();
_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString ) {
    var that = toString_1(requireObjectCoercible(this));
    notARegexp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString_1(searchString);
    return stringSlice(that, index, index + search.length) === search;
  }
});

var nodeIdCounter = 0;
function wrapMethodsWithAppInstance(comp) {
  return Object.fromEntries(Object.entries(comp.methods).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];
    return [k, typeof v === 'function' ? function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return v.call.apply(v, [comp, comp].concat(args));
    } : v];
  }));
}
function createExpressionContext(comp) {
  var wrappedMethods = wrapMethodsWithAppInstance(comp);
  return {
    data: comp.data,
    methods: wrappedMethods,
    allowBuiltins: comp.allowBuiltins || [],
    logWarning: function logWarning(msg) {
      return logError(comp, msg);
    }
  };
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function buildDelimiterRegex(delimiters) {
  var validDelimiters = Array.isArray(delimiters) && delimiters.length === 2 && typeof delimiters[0] === 'string' && typeof delimiters[1] === 'string' && delimiters[0].length > 0 && delimiters[1].length > 0 ? delimiters : ['{', '}'];
  var open = escapeRegExp(validDelimiters[0]);
  var close = escapeRegExp(validDelimiters[1]);
  return new RegExp(open + '([\\s\\S]*?)' + close, 'g');
}
function handleLegacyOperators(comp, attr, pointers) {
  var operators = [' == ', ' === ', ' !== ', ' != ', ' > ', ' < ', ' >= ', ' <= '];
  var validTypes = ['boolean', 'number', 'undefined'];
  for (var i = 0; i < operators.length; i++) {
    if (attr.includes(operators[i])) {
      var condition = attr;
      var cParts = condition.split(operators[i]);
      var condLeft = getProp(comp, cParts[0].split('.'), pointers);
      if (!validTypes.includes(String(_typeof(condLeft)))) {
        logError(comp, "".concat(cParts[0], " cannot be evaluated because it is not a boolean nor a number."));
        return undefined;
      } else {
        condition = condition.replace(cParts[0], condLeft);
        var evaluate = eval;
        return evaluate(condition);
      }
    }
  }
  return undefined;
}
function evaluateTemplateExpression(app, scope, node, expr, cache) {
  if (!node._appBlockNodeId) {
    node._appBlockNodeId = ++nodeIdCounter;
  }
  var nodeId = node._appBlockNodeId;
  var cacheKey = "".concat(nodeId, "|").concat(expr);
  if (cache && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  var result;
  try {
    var parts = expr.split('|').map(function (p) {
      return p.trim();
    });
    var baseExpr = parts.shift();
    result = evaluateBaseExpression(app, scope, baseExpr);
    var _iterator = _createForOfIteratorHelper(parts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var filterName = _step.value;
        if (app.filters && app.filters[filterName]) {
          result = app.filters[filterName](app, result);
        } else {
          logError(app, "Unknown filter: ".concat(filterName));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (result === undefined || result === null) {
      result = '';
    }
  } catch (error) {
    logError(app, "[method-call-error] ".concat(expr, " : ").concat(error.message));
    result = '';
  }
  if (cache) cache.set(cacheKey, result);
  return result;
}
function parseMethodArguments(argsStr) {
  if (!argsStr.trim()) return [];
  var args = [];
  var current = '';
  var parenDepth = 0;
  for (var i = 0; i < argsStr.length; i++) {
    var _char = argsStr[i];
    if (_char === '(') {
      parenDepth++;
      current += _char;
    } else if (_char === ')') {
      parenDepth--;
      current += _char;
    } else if (_char === ',' && parenDepth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += _char;
    }
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}
function evaluateBaseExpression(app, scope, expr) {
  expr = expr.trim();
  var methodMatch = expr.match(/^(\w+)\((.*)\)$/);
  if (methodMatch) {
    var _app$methods$methodNa;
    var methodName = methodMatch[1];
    var argsStr = methodMatch[2].trim();
    if (!app.methods || !app.methods[methodName]) {
      throw new Error("Method ".concat(methodName, " not found"));
    }
    var args = argsStr ? parseMethodArguments(argsStr).map(function (arg) {
      return evaluateArgument(app, scope, arg);
    }) : [];
    return (_app$methods$methodNa = app.methods[methodName]).call.apply(_app$methods$methodNa, [app, app].concat(_toConsumableArray(args)));
  }
  var propKeys = expr.split('.');
  return getProp(app, propKeys, scope);
}
function evaluateArgument(app, scope, arg) {
  arg = arg.trim();
  if (arg.match(/^(\w+)\(/)) {
    return evaluateBaseExpression(app, scope, arg);
  }
  if (arg.startsWith('"') && arg.endsWith('"')) {
    return arg.slice(1, -1);
  }
  if (arg.startsWith("'") && arg.endsWith("'")) {
    return arg.slice(1, -1);
  }
  var num = parseFloat(arg);
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }
  var propKeys = arg.split('.');
  return getProp(app, propKeys, scope);
}

var getPlaceholderVal = function getPlaceholderVal(comp, placeholder, pointers) {
  if (_typeof(pointers) === 'object' && pointers !== null) ;
  var placeholderName = placeholder;
  var propKeys = placeholderName.split('.');
  var result = getProp(comp, propKeys, pointers);
  if (result === undefined) return '';
  return result;
};
var updateAttributePlaceholders = function updateAttributePlaceholders(comp, node, pointers, cache) {
  var attrs = node.attributes;
  var regex = buildDelimiterRegex(comp.delimiters);
  for (var i = 0; i < attrs.length; i++) {
    var attrValue = attrs[i].value;
    attrValue = attrValue.replace(regex, function (fullMatch, inner) {
      return evaluateTemplateExpression(comp, pointers, node, inner, cache);
    });
    attrs[i].value = attrValue;
  }
};
var updateTextNodePlaceholders = function updateTextNodePlaceholders(comp, nodeTree, pointers, cache) {
  var textWalker = document.createTreeWalker(nodeTree, NodeFilter.SHOW_TEXT, null, false);
  var nodesToProcess = [];
  while (textWalker.nextNode()) {
    nodesToProcess.push(textWalker.currentNode);
  }
  var regex = buildDelimiterRegex(comp.delimiters);
  nodesToProcess.forEach(function (node) {
    var nodeVal = node.nodeValue;
    var hasReplacedWithHTML = false;
    nodeVal = nodeVal.replace(regex, function (fullMatch, inner) {
      var parts = inner.split('|').map(function (p) {
        return p.trim();
      }).filter(Boolean);
      var propName = parts.shift();
      var filterList = parts;
      var placeholderVal;
      if (filterList.includes('asHTML')) {
        placeholderVal = getPlaceholderVal(comp, propName, pointers);
        filterList.forEach(function (filter) {
          if (filter === 'asHTML') {
            hasReplacedWithHTML = true;
          } else {
            placeholderVal = applyCustomFilter(comp, placeholderVal, filter);
          }
        });
      } else {
        placeholderVal = evaluateTemplateExpression(comp, pointers, node, inner, cache);
      }
      if (filterList.includes('asHTML')) {
        var docFrag = document.createRange().createContextualFragment(placeholderVal);
        node.parentNode.insertBefore(docFrag, node);
        node.parentNode.removeChild(node);
        hasReplacedWithHTML = true;
        return '';
      }
      return placeholderVal;
    });
    if (!hasReplacedWithHTML && node.parentNode) {
      node.nodeValue = nodeVal;
    }
  });
};

var path = globalThis_1;

var f$1 = wellKnownSymbol;
var wellKnownSymbolWrapped = {
	f: f$1
};

var defineProperty = objectDefineProperty.f;
var wellKnownSymbolDefine = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwnProperty_1(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

wellKnownSymbolDefine('iterator');

var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

var $Array = Array;
var arrayFrom = function from(arrayLike ) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    result = IS_CONSTRUCTOR ? new this() : [];
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    for (;!(step = functionCall(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: arrayFrom
});

var nativeJoin = functionUncurryThis([].join);
var ES3_STRINGS = indexedObject !== Object;
var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');
_export({ target: 'Array', proto: true, forced: FORCED }, {
  join: function join(separator) {
    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

_export({ global: true, forced: globalThis_1.globalThis !== globalThis_1 }, {
  globalThis: globalThis_1
});

var _processNode = function processNode(comp, node, pointers, cache) {
  var attrs = node.attributes;
  if (attrs) {
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].name in comp.directives) {
        var attr = attrs[i].name;
        var result = comp.directives[attr](comp, node, pointers, cache);
        if (result === false) {
          node.remove();
          return;
        }
      }
    }
    updateAttributePlaceholders(comp, node, pointers, cache);
  }
  if (node.hasChildNodes()) {
    for (var c = node.childElementCount - 1; c >= 0; c--) {
      if (node.children[c]) {
        _processNode(comp, node.children[c], pointers, cache);
      } else {
        break;
      }
    }
  }
};

var expressionCache = new Map();
function compileExpression(expr, methodNames, builtinNames) {
  var cacheKey = expr + '|' + methodNames.join(',') + '|' + builtinNames.join(',');
  if (expressionCache.has(cacheKey)) {
    return expressionCache.get(cacheKey);
  }
  var scopeDefs = [].concat(_toConsumableArray(methodNames.map(function (k) {
    return "const ".concat(k, " = methods.").concat(k, ";");
  })), _toConsumableArray(builtinNames.map(function (k) {
    return "const ".concat(k, " = builtins.").concat(k, ";");
  }))).join('');
  var body = "\"use strict\"; ".concat(scopeDefs, " return (").concat(expr, ");");
  var fn = new Function('data', 'methods', 'builtins', body);
  expressionCache.set(cacheKey, fn);
  return fn;
}
function evaluateToBoolean(expr, ctx, allowBuiltins, logWarning) {
  expr = expr.trim();
  if (expr === '') {
    return false;
  }
  if (isBlockedExpression(expr)) {
    logWarning('Expression contains blocked constructs: ' + expr);
    return false;
  }
  try {
    var methodNames = Object.keys(ctx.methods);
    var builtinNames = allowBuiltins.filter(function (name) {
      return name in globalThis || name === 'Math';
    });
    var fn = compileExpression(expr, methodNames, builtinNames);
    var builtins = {};
    if (allowBuiltins.includes('Math')) {
      builtins.Math = Math;
    }
    var result = fn.call(null, ctx.data, ctx.methods, builtins);
    return !!result;
  } catch (err) {
    logWarning('Expression evaluation error: ' + err.message + ' in: ' + expr);
    return false;
  }
}
var directives = {
  'c-if': function cIf(comp, node, pointers, cache) {
    var attr = node.getAttribute('c-if');
    if (!attr) return true;
    var hasOperators = /[\(\)\+\-\*\/%!<>&\|\?\:]/.test(attr) || attr.includes('==') || attr.includes('===') || attr.includes('!=') || attr.includes('!==') || attr.includes('>') || attr.includes('<') || attr.includes('>=') || attr.includes('<=') || attr.includes('&&') || attr.includes('||') || attr.includes('!');
    if (!hasOperators) {
      var result = getProp(comp, attr.split('.'), pointers);
      if (result === undefined) {
        result = handleLegacyOperators(comp, attr, pointers);
        if (result === undefined) {
          return false;
        }
      }
      var falseValues = [undefined, null, false, 0, ''];
      if (falseValues.indexOf(result) > -1) {
        return false;
      } else {
        node.removeAttribute('c-if');
        return true;
      }
    } else {
      var ctx = createExpressionContext(comp);
      var decision = evaluateToBoolean(attr, ctx, ctx.allowBuiltins, ctx.logWarning);
      if (!decision) {
        return false;
      } else {
        node.removeAttribute('c-if');
        return true;
      }
    }
  },
  'c-ifnot': function cIfnot(comp, node, pointers, cache) {
    var attr = node.getAttribute('c-ifnot');
    if (!attr) return true;
    var hasOperators = /[\(\)\+\-\*\/%!<>&\|\?\:]/.test(attr) || attr.includes('==') || attr.includes('===') || attr.includes('!=') || attr.includes('!==') || attr.includes('>') || attr.includes('<') || attr.includes('>=') || attr.includes('<=') || attr.includes('&&') || attr.includes('||') || attr.includes('!');
    if (!hasOperators) {
      var result = getProp(comp, attr.split('.'), pointers);
      if (result === undefined) {
        result = handleLegacyOperators(comp, attr, pointers);
        if (result === undefined) {
          node.removeAttribute('c-ifnot');
          return true;
        }
      }
      var falseValues = [undefined, null, false, 0, ''];
      var isFalse = falseValues.indexOf(result) > -1;
      if (isFalse) {
        node.removeAttribute('c-ifnot');
        return true;
      } else {
        return false;
      }
    } else {
      var ctx = createExpressionContext(comp);
      var decision = evaluateToBoolean(attr, ctx, ctx.allowBuiltins, ctx.logWarning);
      if (!decision) {
        node.removeAttribute('c-ifnot');
        return true;
      } else {
        return false;
      }
    }
  },
  'c-for': function cFor(comp, node, pointers, cache) {
    var attr = node.getAttribute('c-for');
    var parts = attr.split(' in ');
    var leftSide = parts[0].trim();
    var iterableExpr = parts[1].trim();
    if (pointers === undefined) pointers = {};
    var isDualPointer = leftSide.includes(',');
    var keyPointer, valuePointer;
    if (isDualPointer) {
      var pointerParts = leftSide.split(',').map(function (p) {
        return p.trim();
      });
      keyPointer = pointerParts[0];
      valuePointer = pointerParts[1];
    } else {
      valuePointer = leftSide;
    }
    var iterable = evaluateTemplateExpression(comp, pointers, node, iterableExpr, cache);
    if (Array.isArray(iterable)) {
      node.removeAttribute('c-for');
      var parentNode = node.parentNode;
      for (var i = 0; i < iterable.length; i++) {
        var item = iterable[i];
        pointers[valuePointer] = item;
        var newNode = node.cloneNode(true);
        _processNode(comp, newNode, pointers, cache);
        updateAttributePlaceholders(comp, newNode, pointers, cache);
        updateTextNodePlaceholders(comp, newNode, pointers, cache);
        parentNode.appendChild(newNode);
      }
      node.remove();
      return true;
    } else if (iterable && typeof iterable[Symbol.iterator] === 'function') {
      node.removeAttribute('c-for');
      var _parentNode = node.parentNode;
      var arr = Array.from(iterable);
      for (var _i = 0; _i < arr.length; _i++) {
        var _item = arr[_i];
        pointers[valuePointer] = _item;
        var _newNode = node.cloneNode(true);
        _processNode(comp, _newNode, pointers, cache);
        updateAttributePlaceholders(comp, _newNode, pointers, cache);
        updateTextNodePlaceholders(comp, _newNode, pointers, cache);
        _parentNode.appendChild(_newNode);
      }
      node.remove();
      return true;
    } else if (iterable && _typeof(iterable) === 'object' && iterable !== null) {
      node.removeAttribute('c-for');
      var _parentNode2 = node.parentNode;
      var entries = Object.entries(iterable);
      for (var _i2 = 0; _i2 < entries.length; _i2++) {
        var _entries$_i = _slicedToArray(entries[_i2], 2),
          key = _entries$_i[0],
          value = _entries$_i[1];
        if (isDualPointer) {
          pointers[keyPointer] = key;
          pointers[valuePointer] = value;
        } else {
          pointers[valuePointer] = value;
        }
        var _newNode2 = node.cloneNode(true);
        _processNode(comp, _newNode2, pointers, cache);
        updateAttributePlaceholders(comp, _newNode2, pointers, cache);
        updateTextNodePlaceholders(comp, _newNode2, pointers, cache);
        _parentNode2.appendChild(_newNode2);
      }
      node.remove();
      return true;
    } else {
      if (iterable !== undefined && iterable !== null) {
        logError(comp, "[method-call-error] ".concat(iterableExpr, " : Result is not iterable"));
      }
      return false;
    }
  }
};

var userAgentStartsWith = function (string) {
  return environmentUserAgent.slice(0, string.length) === string;
};
var environment = (function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis_1.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis_1.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classofRaw(globalThis_1.process) === 'process') return 'NODE';
  if (globalThis_1.window && globalThis_1.document) return 'BROWSER';
  return 'REST';
})();

var environmentIsNode = environment === 'NODE';

var $TypeError$1 = TypeError;
var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw new $TypeError$1('Not enough arguments');
  return passed;
};

var environmentIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(environmentUserAgent);

var set = globalThis_1.setImmediate;
var clear = globalThis_1.clearImmediate;
var process$2 = globalThis_1.process;
var Dispatch = globalThis_1.Dispatch;
var Function$2 = globalThis_1.Function;
var MessageChannel = globalThis_1.MessageChannel;
var String$1 = globalThis_1.String;
var counter = 0;
var queue$2 = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;
fails(function () {
  $location = globalThis_1.location;
});
var run = function (id) {
  if (hasOwnProperty_1(queue$2, id)) {
    var fn = queue$2[id];
    delete queue$2[id];
    fn();
  }
};
var runner = function (id) {
  return function () {
    run(id);
  };
};
var eventListener = function (event) {
  run(event.data);
};
var globalPostMessageDefer = function (id) {
  globalThis_1.postMessage(String$1(id), $location.protocol + '//' + $location.host);
};
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function$2(handler);
    var args = arraySlice(arguments, 1);
    queue$2[++counter] = function () {
      functionApply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue$2[id];
  };
  if (environmentIsNode) {
    defer = function (id) {
      process$2.nextTick(runner(id));
    };
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  } else if (MessageChannel && !environmentIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = functionBindContext(port.postMessage, port);
  } else if (
    globalThis_1.addEventListener &&
    isCallable(globalThis_1.postMessage) &&
    !globalThis_1.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    globalThis_1.addEventListener('message', eventListener, false);
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}
var task$1 = {
  set: set,
  clear: clear
};

var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var safeGetBuiltIn = function (name) {
  if (!descriptors) return globalThis_1[name];
  var descriptor = getOwnPropertyDescriptor(globalThis_1, name);
  return descriptor && descriptor.value;
};

var Queue = function () {
  this.head = null;
  this.tail = null;
};
Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    var tail = this.tail;
    if (tail) tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};
var queue$1 = Queue;

var environmentIsIosPebble = /ipad|iphone|ipod/i.test(environmentUserAgent) && typeof Pebble != 'undefined';

var environmentIsWebosWebkit = /web0s(?!.*chrome)/i.test(environmentUserAgent);

var macrotask = task$1.set;
var MutationObserver = globalThis_1.MutationObserver || globalThis_1.WebKitMutationObserver;
var document$2 = globalThis_1.document;
var process$1 = globalThis_1.process;
var Promise$1 = globalThis_1.Promise;
var microtask = safeGetBuiltIn('queueMicrotask');
var notify$1, toggle, node, promise, then;
if (!microtask) {
  var queue = new queue$1();
  var flush = function () {
    var parent, fn;
    if (environmentIsNode && (parent = process$1.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify$1();
      throw error;
    }
    if (parent) parent.enter();
  };
  if (!environmentIsIos && !environmentIsNode && !environmentIsWebosWebkit && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify$1 = function () {
      node.data = toggle = !toggle;
    };
  } else if (!environmentIsIosPebble && Promise$1 && Promise$1.resolve) {
    promise = Promise$1.resolve(undefined);
    promise.constructor = Promise$1;
    then = functionBindContext(promise.then, promise);
    notify$1 = function () {
      then(flush);
    };
  } else if (environmentIsNode) {
    notify$1 = function () {
      process$1.nextTick(flush);
    };
  } else {
    macrotask = functionBindContext(macrotask, globalThis_1);
    notify$1 = function () {
      macrotask(flush);
    };
  }
  microtask = function (fn) {
    if (!queue.head) notify$1();
    queue.add(fn);
  };
}
var microtask_1 = microtask;

var hostReportErrors = function (a, b) {
  try {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  } catch (error) {  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var promiseNativeConstructor = globalThis_1.Promise;

promiseNativeConstructor && promiseNativeConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable(globalThis_1.PromiseRejectionEvent);
var FORCED_PROMISE_CONSTRUCTOR$5 = isForced_1('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(promiseNativeConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(promiseNativeConstructor);
  if (!GLOBAL_CORE_JS_PROMISE && environmentV8Version === 66) return true;
  if (!environmentV8Version || environmentV8Version < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    var promise = new promiseNativeConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () {  }, function () {  });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () {  }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  } return !GLOBAL_CORE_JS_PROMISE && (environment === 'BROWSER' || environment === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT$1;
});
var promiseConstructorDetection = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
  SUBCLASSING: SUBCLASSING
};

var $TypeError = TypeError;
var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};
var f = function (C) {
  return new PromiseCapability(C);
};
var newPromiseCapability$1 = {
	f: f
};

var task = task$1.set;
var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR$4 = promiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = promiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = promiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var setInternalState = internalState.set;
var NativePromisePrototype$2 = promiseNativeConstructor && promiseNativeConstructor.prototype;
var PromiseConstructor = promiseNativeConstructor;
var PromisePrototype = NativePromisePrototype$2;
var TypeError$1 = globalThis_1.TypeError;
var document$1 = globalThis_1.document;
var process = globalThis_1.process;
var newPromiseCapability = newPromiseCapability$1.f;
var newGenericPromiseCapability = newPromiseCapability;
var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && globalThis_1.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};
var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state === FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value);
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(new TypeError$1('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        functionCall(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};
var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask_1(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};
var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$1.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    globalThis_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis_1['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};
var onUnhandled = function (state) {
  functionCall(task, globalThis_1, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (environmentIsNode) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      state.rejection = environmentIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};
var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};
var onHandleUnhandled = function (state) {
  functionCall(task, globalThis_1, function () {
    var promise = state.facade;
    if (environmentIsNode) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};
var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};
var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};
var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw new TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask_1(function () {
        var wrapper = { done: false };
        try {
          functionCall(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};
if (FORCED_PROMISE_CONSTRUCTOR$4) {
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    functionCall(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromisePrototype = PromiseConstructor.prototype;
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new queue$1(),
      rejection: false,
      state: PENDING,
      value: null
    });
  };
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = environmentIsNode ? process.domain : undefined;
    if (state.state === PENDING) state.reactions.add(reaction);
    else microtask_1(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapability$1.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
  if (isCallable(promiseNativeConstructor) && NativePromisePrototype$2 !== Object.prototype) {
    nativeThen = NativePromisePrototype$2.then;
    if (!NATIVE_PROMISE_SUBCLASSING) {
      defineBuiltIn(NativePromisePrototype$2, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          functionCall(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      }, { unsafe: true });
    }
    try {
      delete NativePromisePrototype$2.constructor;
    } catch (error) {  }
    if (objectSetPrototypeOf) {
      objectSetPrototypeOf(NativePromisePrototype$2, PromisePrototype);
    }
  }
}
_export({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
  Promise: PromiseConstructor
});
PromiseWrapper = path.Promise;
setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;
var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
  promiseNativeConstructor.all(iterable).then(undefined, function () {  });
});

_export({ target: 'Promise', stat: true, forced: promiseStaticsIncorrectIteration }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        functionCall($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
var NativePromisePrototype$1 = promiseNativeConstructor && promiseNativeConstructor.prototype;
_export({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});
if (isCallable(promiseNativeConstructor)) {
  var method$1 = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype$1['catch'] !== method$1) {
    defineBuiltIn(NativePromisePrototype$1, 'catch', method$1, { unsafe: true });
  }
}

_export({ target: 'Promise', stat: true, forced: promiseStaticsIncorrectIteration }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        functionCall($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;
_export({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
  reject: function reject(r) {
    var capability = newPromiseCapability$1.f(this);
    var capabilityReject = capability.reject;
    capabilityReject(r);
    return capability.promise;
  }
});

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability$1.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
getBuiltIn('Promise');
_export({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(this, x);
  }
});

var NativePromisePrototype = promiseNativeConstructor && promiseNativeConstructor.prototype;
var NON_GENERIC = !!promiseNativeConstructor && fails(function () {
  NativePromisePrototype['finally'].call({ then: function () {  } }, function () {  });
});
_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});
if (isCallable(promiseNativeConstructor)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
  }
}

var Function$1 = globalThis_1.Function;
var WRAP = /MSIE .\./.test(environmentUserAgent) || environment === 'BUN' && (function () {
  var version = globalThis_1.Bun.version.split('.');
  return version.length < 3 || version[0] === '0' && (version[1] < 3 || version[1] === '3' && version[2] === '0');
})();
var schedulersFix = function (scheduler, hasTimeArg) {
  var firstParamIndex = hasTimeArg ? 2 : 1;
  return WRAP ? function (handler, timeout ) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
    var fn = isCallable(handler) ? handler : Function$1(handler);
    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
    var callback = boundArgs ? function () {
      functionApply(fn, this, params);
    } : fn;
    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
  } : scheduler;
};

var setInterval = schedulersFix(globalThis_1.setInterval, true);
_export({ global: true, bind: true, forced: globalThis_1.setInterval !== setInterval }, {
  setInterval: setInterval
});

var setTimeout$1 = schedulersFix(globalThis_1.setTimeout, true);
_export({ global: true, bind: true, forced: globalThis_1.setTimeout !== setTimeout$1 }, {
  setTimeout: setTimeout$1
});

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
          comp.state.error = true;
          if (callbacks && callbacks['error'] instanceof Function) {
            callbacks['error'](data);
          }
        } else {
          comp.state.success = true;
          if (callbacks && callbacks['success'] instanceof Function) {
            callbacks['success'](data);
          }
        }
      })["catch"](function (error) {
        comp.state.error = true;
        if (callbacks && callbacks['error'] instanceof Function) {
          callbacks['error'](error);
        }
      })["finally"](function () {
        comp.state.loading = false;
        if (callbacks && callbacks['finally'] instanceof Function) {
          callbacks['finally']();
        }
        comp.render();
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
    var cache = new Map();
    var tmpDOM = comp.template.cloneNode(true);
    var wrapper = document.createElement('div');
    wrapper.appendChild(tmpDOM);
    _processNode(comp, wrapper, cache);
    updateTextNodePlaceholders(comp, wrapper, null, cache);
    return wrapper;
  };
  this.render = function (callback) {
    var comp = this;
    if (comp.methods.beforeRender instanceof Function) comp.methods.beforeRender(comp);
    var tmpDOM = this.prepareTmpDom();
    if (comp.renderEngine === 'Idiomorph') {
      comp.idiomorphRender(tmpDOM);
    } else if (comp.renderEngine === 'plain') {
      comp.plainRender(tmpDOM);
    } else {
      logError(comp, "".concat(comp.renderEngine, " renderEngine does not exist."));
    }
    if (comp.methods.afterRender instanceof Function) comp.methods.afterRender(comp);
    if (callback instanceof Function) callback();
  };
  this.plainRender = function (tmpDOM) {
    this.el.innerHTML = '';
    this.el.appendChild(tmpDOM);
  };
  this.idiomorphRender = function (tmpDOM) {
    Idiomorph.morph(this.el, tmpDOM, {
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
      comp.allowBuiltins = [];
      if (Array.isArray(config.allowBuiltins)) {
        comp.allowBuiltins = config.allowBuiltins;
      }
      var defaultDelimiters = ['{', '}'];
      if (Array.isArray(config.delimiters) && config.delimiters.length === 2 && typeof config.delimiters[0] === 'string' && typeof config.delimiters[1] === 'string' && config.delimiters[0].length > 0 && config.delimiters[1].length > 0) {
        comp.delimiters = config.delimiters;
      } else {
        if (config.delimiters !== undefined) {
          logError(comp, 'Invalid `delimiters` config provided. Falling back to default [`{`,`}`].');
        }
        comp.delimiters = defaultDelimiters;
      }
      comp.events = {};
      if (config.events instanceof Object) {
        Object.assign(comp.events, config.events);
        var _loop = function _loop(ev) {
          var firstSpace = ev.indexOf(' ');
          if (firstSpace === -1) return 1; // continue
          var eventName = ev.slice(0, firstSpace);
          var eventSelector = ev.slice(firstSpace + 1).trim();
          comp.el.addEventListener(eventName, function (e) {
            var target = e.target || e.srcElement;
            var matched = null;
            try {
              if (target && target.closest) matched = target.closest(eventSelector);
            } catch (err) {
              matched = null;
            }
            if (matched && comp.el.contains(matched)) {
              try {
                comp.events[ev](e, matched);
              } catch (err) {
                logError(comp, err && err.message ? err.message : String(err));
              }
            }
          });
        };
        for (var ev in comp.events) {
          if (_loop(ev)) continue;
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

export { AppBlock as default };
