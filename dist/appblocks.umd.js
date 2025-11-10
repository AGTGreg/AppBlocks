(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AppBlock = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var es_array_indexOf = {};

	var globalThis_1;
	var hasRequiredGlobalThis;
	function requireGlobalThis () {
		if (hasRequiredGlobalThis) return globalThis_1;
		hasRequiredGlobalThis = 1;
		var check = function (it) {
		  return it && it.Math === Math && it;
		};
		globalThis_1 =
		  check(typeof globalThis == 'object' && globalThis) ||
		  check(typeof window == 'object' && window) ||
		  check(typeof self == 'object' && self) ||
		  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
		  check(typeof globalThis_1 == 'object' && globalThis_1) ||
		  (function () { return this; })() || Function('return this')();
		return globalThis_1;
	}

	var objectGetOwnPropertyDescriptor = {};

	var fails;
	var hasRequiredFails;
	function requireFails () {
		if (hasRequiredFails) return fails;
		hasRequiredFails = 1;
		fails = function (exec) {
		  try {
		    return !!exec();
		  } catch (error) {
		    return true;
		  }
		};
		return fails;
	}

	var descriptors;
	var hasRequiredDescriptors;
	function requireDescriptors () {
		if (hasRequiredDescriptors) return descriptors;
		hasRequiredDescriptors = 1;
		var fails = requireFails();
		descriptors = !fails(function () {
		  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
		});
		return descriptors;
	}

	var functionBindNative;
	var hasRequiredFunctionBindNative;
	function requireFunctionBindNative () {
		if (hasRequiredFunctionBindNative) return functionBindNative;
		hasRequiredFunctionBindNative = 1;
		var fails = requireFails();
		functionBindNative = !fails(function () {
		  var test = (function () {  }).bind();
		  return typeof test != 'function' || test.hasOwnProperty('prototype');
		});
		return functionBindNative;
	}

	var functionCall;
	var hasRequiredFunctionCall;
	function requireFunctionCall () {
		if (hasRequiredFunctionCall) return functionCall;
		hasRequiredFunctionCall = 1;
		var NATIVE_BIND = requireFunctionBindNative();
		var call = Function.prototype.call;
		functionCall = NATIVE_BIND ? call.bind(call) : function () {
		  return call.apply(call, arguments);
		};
		return functionCall;
	}

	var objectPropertyIsEnumerable = {};

	var hasRequiredObjectPropertyIsEnumerable;
	function requireObjectPropertyIsEnumerable () {
		if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
		hasRequiredObjectPropertyIsEnumerable = 1;
		var $propertyIsEnumerable = {}.propertyIsEnumerable;
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);
		objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
		  var descriptor = getOwnPropertyDescriptor(this, V);
		  return !!descriptor && descriptor.enumerable;
		} : $propertyIsEnumerable;
		return objectPropertyIsEnumerable;
	}

	var createPropertyDescriptor;
	var hasRequiredCreatePropertyDescriptor;
	function requireCreatePropertyDescriptor () {
		if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
		hasRequiredCreatePropertyDescriptor = 1;
		createPropertyDescriptor = function (bitmap, value) {
		  return {
		    enumerable: !(bitmap & 1),
		    configurable: !(bitmap & 2),
		    writable: !(bitmap & 4),
		    value: value
		  };
		};
		return createPropertyDescriptor;
	}

	var functionUncurryThis;
	var hasRequiredFunctionUncurryThis;
	function requireFunctionUncurryThis () {
		if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
		hasRequiredFunctionUncurryThis = 1;
		var NATIVE_BIND = requireFunctionBindNative();
		var FunctionPrototype = Function.prototype;
		var call = FunctionPrototype.call;
		var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
		functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
		  return function () {
		    return call.apply(fn, arguments);
		  };
		};
		return functionUncurryThis;
	}

	var classofRaw;
	var hasRequiredClassofRaw;
	function requireClassofRaw () {
		if (hasRequiredClassofRaw) return classofRaw;
		hasRequiredClassofRaw = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toString = uncurryThis({}.toString);
		var stringSlice = uncurryThis(''.slice);
		classofRaw = function (it) {
		  return stringSlice(toString(it), 8, -1);
		};
		return classofRaw;
	}

	var indexedObject;
	var hasRequiredIndexedObject;
	function requireIndexedObject () {
		if (hasRequiredIndexedObject) return indexedObject;
		hasRequiredIndexedObject = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var classof = requireClassofRaw();
		var $Object = Object;
		var split = uncurryThis(''.split);
		indexedObject = fails(function () {
		  return !$Object('z').propertyIsEnumerable(0);
		}) ? function (it) {
		  return classof(it) === 'String' ? split(it, '') : $Object(it);
		} : $Object;
		return indexedObject;
	}

	var isNullOrUndefined;
	var hasRequiredIsNullOrUndefined;
	function requireIsNullOrUndefined () {
		if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
		hasRequiredIsNullOrUndefined = 1;
		isNullOrUndefined = function (it) {
		  return it === null || it === undefined;
		};
		return isNullOrUndefined;
	}

	var requireObjectCoercible;
	var hasRequiredRequireObjectCoercible;
	function requireRequireObjectCoercible () {
		if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
		hasRequiredRequireObjectCoercible = 1;
		var isNullOrUndefined = requireIsNullOrUndefined();
		var $TypeError = TypeError;
		requireObjectCoercible = function (it) {
		  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
		  return it;
		};
		return requireObjectCoercible;
	}

	var toIndexedObject;
	var hasRequiredToIndexedObject;
	function requireToIndexedObject () {
		if (hasRequiredToIndexedObject) return toIndexedObject;
		hasRequiredToIndexedObject = 1;
		var IndexedObject = requireIndexedObject();
		var requireObjectCoercible = requireRequireObjectCoercible();
		toIndexedObject = function (it) {
		  return IndexedObject(requireObjectCoercible(it));
		};
		return toIndexedObject;
	}

	var isCallable;
	var hasRequiredIsCallable;
	function requireIsCallable () {
		if (hasRequiredIsCallable) return isCallable;
		hasRequiredIsCallable = 1;
		var documentAll = typeof document == 'object' && document.all;
		isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
		  return typeof argument == 'function' || argument === documentAll;
		} : function (argument) {
		  return typeof argument == 'function';
		};
		return isCallable;
	}

	var isObject;
	var hasRequiredIsObject;
	function requireIsObject () {
		if (hasRequiredIsObject) return isObject;
		hasRequiredIsObject = 1;
		var isCallable = requireIsCallable();
		isObject = function (it) {
		  return typeof it == 'object' ? it !== null : isCallable(it);
		};
		return isObject;
	}

	var getBuiltIn;
	var hasRequiredGetBuiltIn;
	function requireGetBuiltIn () {
		if (hasRequiredGetBuiltIn) return getBuiltIn;
		hasRequiredGetBuiltIn = 1;
		var globalThis = requireGlobalThis();
		var isCallable = requireIsCallable();
		var aFunction = function (argument) {
		  return isCallable(argument) ? argument : undefined;
		};
		getBuiltIn = function (namespace, method) {
		  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
		};
		return getBuiltIn;
	}

	var objectIsPrototypeOf;
	var hasRequiredObjectIsPrototypeOf;
	function requireObjectIsPrototypeOf () {
		if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
		hasRequiredObjectIsPrototypeOf = 1;
		var uncurryThis = requireFunctionUncurryThis();
		objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
		return objectIsPrototypeOf;
	}

	var environmentUserAgent;
	var hasRequiredEnvironmentUserAgent;
	function requireEnvironmentUserAgent () {
		if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
		hasRequiredEnvironmentUserAgent = 1;
		var globalThis = requireGlobalThis();
		var navigator = globalThis.navigator;
		var userAgent = navigator && navigator.userAgent;
		environmentUserAgent = userAgent ? String(userAgent) : '';
		return environmentUserAgent;
	}

	var environmentV8Version;
	var hasRequiredEnvironmentV8Version;
	function requireEnvironmentV8Version () {
		if (hasRequiredEnvironmentV8Version) return environmentV8Version;
		hasRequiredEnvironmentV8Version = 1;
		var globalThis = requireGlobalThis();
		var userAgent = requireEnvironmentUserAgent();
		var process = globalThis.process;
		var Deno = globalThis.Deno;
		var versions = process && process.versions || Deno && Deno.version;
		var v8 = versions && versions.v8;
		var match, version;
		if (v8) {
		  match = v8.split('.');
		  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
		}
		if (!version && userAgent) {
		  match = userAgent.match(/Edge\/(\d+)/);
		  if (!match || match[1] >= 74) {
		    match = userAgent.match(/Chrome\/(\d+)/);
		    if (match) version = +match[1];
		  }
		}
		environmentV8Version = version;
		return environmentV8Version;
	}

	var symbolConstructorDetection;
	var hasRequiredSymbolConstructorDetection;
	function requireSymbolConstructorDetection () {
		if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
		hasRequiredSymbolConstructorDetection = 1;
		var V8_VERSION = requireEnvironmentV8Version();
		var fails = requireFails();
		var globalThis = requireGlobalThis();
		var $String = globalThis.String;
		symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
		  var symbol = Symbol('symbol detection');
		  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
		    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
		});
		return symbolConstructorDetection;
	}

	var useSymbolAsUid;
	var hasRequiredUseSymbolAsUid;
	function requireUseSymbolAsUid () {
		if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
		hasRequiredUseSymbolAsUid = 1;
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();
		useSymbolAsUid = NATIVE_SYMBOL &&
		  !Symbol.sham &&
		  typeof Symbol.iterator == 'symbol';
		return useSymbolAsUid;
	}

	var isSymbol;
	var hasRequiredIsSymbol;
	function requireIsSymbol () {
		if (hasRequiredIsSymbol) return isSymbol;
		hasRequiredIsSymbol = 1;
		var getBuiltIn = requireGetBuiltIn();
		var isCallable = requireIsCallable();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();
		var $Object = Object;
		isSymbol = USE_SYMBOL_AS_UID ? function (it) {
		  return typeof it == 'symbol';
		} : function (it) {
		  var $Symbol = getBuiltIn('Symbol');
		  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
		};
		return isSymbol;
	}

	var tryToString;
	var hasRequiredTryToString;
	function requireTryToString () {
		if (hasRequiredTryToString) return tryToString;
		hasRequiredTryToString = 1;
		var $String = String;
		tryToString = function (argument) {
		  try {
		    return $String(argument);
		  } catch (error) {
		    return 'Object';
		  }
		};
		return tryToString;
	}

	var aCallable;
	var hasRequiredACallable;
	function requireACallable () {
		if (hasRequiredACallable) return aCallable;
		hasRequiredACallable = 1;
		var isCallable = requireIsCallable();
		var tryToString = requireTryToString();
		var $TypeError = TypeError;
		aCallable = function (argument) {
		  if (isCallable(argument)) return argument;
		  throw new $TypeError(tryToString(argument) + ' is not a function');
		};
		return aCallable;
	}

	var getMethod;
	var hasRequiredGetMethod;
	function requireGetMethod () {
		if (hasRequiredGetMethod) return getMethod;
		hasRequiredGetMethod = 1;
		var aCallable = requireACallable();
		var isNullOrUndefined = requireIsNullOrUndefined();
		getMethod = function (V, P) {
		  var func = V[P];
		  return isNullOrUndefined(func) ? undefined : aCallable(func);
		};
		return getMethod;
	}

	var ordinaryToPrimitive;
	var hasRequiredOrdinaryToPrimitive;
	function requireOrdinaryToPrimitive () {
		if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
		hasRequiredOrdinaryToPrimitive = 1;
		var call = requireFunctionCall();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var $TypeError = TypeError;
		ordinaryToPrimitive = function (input, pref) {
		  var fn, val;
		  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
		  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
		  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
		  throw new $TypeError("Can't convert object to primitive value");
		};
		return ordinaryToPrimitive;
	}

	var sharedStore = {exports: {}};

	var isPure;
	var hasRequiredIsPure;
	function requireIsPure () {
		if (hasRequiredIsPure) return isPure;
		hasRequiredIsPure = 1;
		isPure = false;
		return isPure;
	}

	var defineGlobalProperty;
	var hasRequiredDefineGlobalProperty;
	function requireDefineGlobalProperty () {
		if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
		hasRequiredDefineGlobalProperty = 1;
		var globalThis = requireGlobalThis();
		var defineProperty = Object.defineProperty;
		defineGlobalProperty = function (key, value) {
		  try {
		    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
		  } catch (error) {
		    globalThis[key] = value;
		  } return value;
		};
		return defineGlobalProperty;
	}

	var hasRequiredSharedStore;
	function requireSharedStore () {
		if (hasRequiredSharedStore) return sharedStore.exports;
		hasRequiredSharedStore = 1;
		var IS_PURE = requireIsPure();
		var globalThis = requireGlobalThis();
		var defineGlobalProperty = requireDefineGlobalProperty();
		var SHARED = '__core-js_shared__';
		var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});
		(store.versions || (store.versions = [])).push({
		  version: '3.46.0',
		  mode: IS_PURE ? 'pure' : 'global',
		  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru), 2025 CoreJS Company (core-js.io)',
		  license: 'https://github.com/zloirock/core-js/blob/v3.46.0/LICENSE',
		  source: 'https://github.com/zloirock/core-js'
		});
		return sharedStore.exports;
	}

	var shared;
	var hasRequiredShared;
	function requireShared () {
		if (hasRequiredShared) return shared;
		hasRequiredShared = 1;
		var store = requireSharedStore();
		shared = function (key, value) {
		  return store[key] || (store[key] = value || {});
		};
		return shared;
	}

	var toObject;
	var hasRequiredToObject;
	function requireToObject () {
		if (hasRequiredToObject) return toObject;
		hasRequiredToObject = 1;
		var requireObjectCoercible = requireRequireObjectCoercible();
		var $Object = Object;
		toObject = function (argument) {
		  return $Object(requireObjectCoercible(argument));
		};
		return toObject;
	}

	var hasOwnProperty_1;
	var hasRequiredHasOwnProperty;
	function requireHasOwnProperty () {
		if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
		hasRequiredHasOwnProperty = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toObject = requireToObject();
		var hasOwnProperty = uncurryThis({}.hasOwnProperty);
		hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
		  return hasOwnProperty(toObject(it), key);
		};
		return hasOwnProperty_1;
	}

	var uid;
	var hasRequiredUid;
	function requireUid () {
		if (hasRequiredUid) return uid;
		hasRequiredUid = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var id = 0;
		var postfix = Math.random();
		var toString = uncurryThis(1.1.toString);
		uid = function (key) {
		  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
		};
		return uid;
	}

	var wellKnownSymbol;
	var hasRequiredWellKnownSymbol;
	function requireWellKnownSymbol () {
		if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
		hasRequiredWellKnownSymbol = 1;
		var globalThis = requireGlobalThis();
		var shared = requireShared();
		var hasOwn = requireHasOwnProperty();
		var uid = requireUid();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();
		var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();
		var Symbol = globalThis.Symbol;
		var WellKnownSymbolsStore = shared('wks');
		var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;
		wellKnownSymbol = function (name) {
		  if (!hasOwn(WellKnownSymbolsStore, name)) {
		    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
		      ? Symbol[name]
		      : createWellKnownSymbol('Symbol.' + name);
		  } return WellKnownSymbolsStore[name];
		};
		return wellKnownSymbol;
	}

	var toPrimitive;
	var hasRequiredToPrimitive;
	function requireToPrimitive () {
		if (hasRequiredToPrimitive) return toPrimitive;
		hasRequiredToPrimitive = 1;
		var call = requireFunctionCall();
		var isObject = requireIsObject();
		var isSymbol = requireIsSymbol();
		var getMethod = requireGetMethod();
		var ordinaryToPrimitive = requireOrdinaryToPrimitive();
		var wellKnownSymbol = requireWellKnownSymbol();
		var $TypeError = TypeError;
		var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
		toPrimitive = function (input, pref) {
		  if (!isObject(input) || isSymbol(input)) return input;
		  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
		  var result;
		  if (exoticToPrim) {
		    if (pref === undefined) pref = 'default';
		    result = call(exoticToPrim, input, pref);
		    if (!isObject(result) || isSymbol(result)) return result;
		    throw new $TypeError("Can't convert object to primitive value");
		  }
		  if (pref === undefined) pref = 'number';
		  return ordinaryToPrimitive(input, pref);
		};
		return toPrimitive;
	}

	var toPropertyKey;
	var hasRequiredToPropertyKey;
	function requireToPropertyKey () {
		if (hasRequiredToPropertyKey) return toPropertyKey;
		hasRequiredToPropertyKey = 1;
		var toPrimitive = requireToPrimitive();
		var isSymbol = requireIsSymbol();
		toPropertyKey = function (argument) {
		  var key = toPrimitive(argument, 'string');
		  return isSymbol(key) ? key : key + '';
		};
		return toPropertyKey;
	}

	var documentCreateElement;
	var hasRequiredDocumentCreateElement;
	function requireDocumentCreateElement () {
		if (hasRequiredDocumentCreateElement) return documentCreateElement;
		hasRequiredDocumentCreateElement = 1;
		var globalThis = requireGlobalThis();
		var isObject = requireIsObject();
		var document = globalThis.document;
		var EXISTS = isObject(document) && isObject(document.createElement);
		documentCreateElement = function (it) {
		  return EXISTS ? document.createElement(it) : {};
		};
		return documentCreateElement;
	}

	var ie8DomDefine;
	var hasRequiredIe8DomDefine;
	function requireIe8DomDefine () {
		if (hasRequiredIe8DomDefine) return ie8DomDefine;
		hasRequiredIe8DomDefine = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();
		var createElement = requireDocumentCreateElement();
		ie8DomDefine = !DESCRIPTORS && !fails(function () {
		  return Object.defineProperty(createElement('div'), 'a', {
		    get: function () { return 7; }
		  }).a !== 7;
		});
		return ie8DomDefine;
	}

	var hasRequiredObjectGetOwnPropertyDescriptor;
	function requireObjectGetOwnPropertyDescriptor () {
		if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
		hasRequiredObjectGetOwnPropertyDescriptor = 1;
		var DESCRIPTORS = requireDescriptors();
		var call = requireFunctionCall();
		var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var toIndexedObject = requireToIndexedObject();
		var toPropertyKey = requireToPropertyKey();
		var hasOwn = requireHasOwnProperty();
		var IE8_DOM_DEFINE = requireIe8DomDefine();
		var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
		  O = toIndexedObject(O);
		  P = toPropertyKey(P);
		  if (IE8_DOM_DEFINE) try {
		    return $getOwnPropertyDescriptor(O, P);
		  } catch (error) {  }
		  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
		};
		return objectGetOwnPropertyDescriptor;
	}

	var objectDefineProperty = {};

	var v8PrototypeDefineBug;
	var hasRequiredV8PrototypeDefineBug;
	function requireV8PrototypeDefineBug () {
		if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
		hasRequiredV8PrototypeDefineBug = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();
		v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
		  return Object.defineProperty(function () {  }, 'prototype', {
		    value: 42,
		    writable: false
		  }).prototype !== 42;
		});
		return v8PrototypeDefineBug;
	}

	var anObject;
	var hasRequiredAnObject;
	function requireAnObject () {
		if (hasRequiredAnObject) return anObject;
		hasRequiredAnObject = 1;
		var isObject = requireIsObject();
		var $String = String;
		var $TypeError = TypeError;
		anObject = function (argument) {
		  if (isObject(argument)) return argument;
		  throw new $TypeError($String(argument) + ' is not an object');
		};
		return anObject;
	}

	var hasRequiredObjectDefineProperty;
	function requireObjectDefineProperty () {
		if (hasRequiredObjectDefineProperty) return objectDefineProperty;
		hasRequiredObjectDefineProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var IE8_DOM_DEFINE = requireIe8DomDefine();
		var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
		var anObject = requireAnObject();
		var toPropertyKey = requireToPropertyKey();
		var $TypeError = TypeError;
		var $defineProperty = Object.defineProperty;
		var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		var ENUMERABLE = 'enumerable';
		var CONFIGURABLE = 'configurable';
		var WRITABLE = 'writable';
		objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPropertyKey(P);
		  anObject(Attributes);
		  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
		    var current = $getOwnPropertyDescriptor(O, P);
		    if (current && current[WRITABLE]) {
		      O[P] = Attributes.value;
		      Attributes = {
		        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
		        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
		        writable: false
		      };
		    }
		  } return $defineProperty(O, P, Attributes);
		} : $defineProperty : function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPropertyKey(P);
		  anObject(Attributes);
		  if (IE8_DOM_DEFINE) try {
		    return $defineProperty(O, P, Attributes);
		  } catch (error) {  }
		  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
		  if ('value' in Attributes) O[P] = Attributes.value;
		  return O;
		};
		return objectDefineProperty;
	}

	var createNonEnumerableProperty;
	var hasRequiredCreateNonEnumerableProperty;
	function requireCreateNonEnumerableProperty () {
		if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
		hasRequiredCreateNonEnumerableProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var definePropertyModule = requireObjectDefineProperty();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
		  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
		} : function (object, key, value) {
		  object[key] = value;
		  return object;
		};
		return createNonEnumerableProperty;
	}

	var makeBuiltIn = {exports: {}};

	var functionName;
	var hasRequiredFunctionName;
	function requireFunctionName () {
		if (hasRequiredFunctionName) return functionName;
		hasRequiredFunctionName = 1;
		var DESCRIPTORS = requireDescriptors();
		var hasOwn = requireHasOwnProperty();
		var FunctionPrototype = Function.prototype;
		var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
		var EXISTS = hasOwn(FunctionPrototype, 'name');
		var PROPER = EXISTS && (function something() {  }).name === 'something';
		var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));
		functionName = {
		  EXISTS: EXISTS,
		  PROPER: PROPER,
		  CONFIGURABLE: CONFIGURABLE
		};
		return functionName;
	}

	var inspectSource;
	var hasRequiredInspectSource;
	function requireInspectSource () {
		if (hasRequiredInspectSource) return inspectSource;
		hasRequiredInspectSource = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var isCallable = requireIsCallable();
		var store = requireSharedStore();
		var functionToString = uncurryThis(Function.toString);
		if (!isCallable(store.inspectSource)) {
		  store.inspectSource = function (it) {
		    return functionToString(it);
		  };
		}
		inspectSource = store.inspectSource;
		return inspectSource;
	}

	var weakMapBasicDetection;
	var hasRequiredWeakMapBasicDetection;
	function requireWeakMapBasicDetection () {
		if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
		hasRequiredWeakMapBasicDetection = 1;
		var globalThis = requireGlobalThis();
		var isCallable = requireIsCallable();
		var WeakMap = globalThis.WeakMap;
		weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
		return weakMapBasicDetection;
	}

	var sharedKey;
	var hasRequiredSharedKey;
	function requireSharedKey () {
		if (hasRequiredSharedKey) return sharedKey;
		hasRequiredSharedKey = 1;
		var shared = requireShared();
		var uid = requireUid();
		var keys = shared('keys');
		sharedKey = function (key) {
		  return keys[key] || (keys[key] = uid(key));
		};
		return sharedKey;
	}

	var hiddenKeys;
	var hasRequiredHiddenKeys;
	function requireHiddenKeys () {
		if (hasRequiredHiddenKeys) return hiddenKeys;
		hasRequiredHiddenKeys = 1;
		hiddenKeys = {};
		return hiddenKeys;
	}

	var internalState;
	var hasRequiredInternalState;
	function requireInternalState () {
		if (hasRequiredInternalState) return internalState;
		hasRequiredInternalState = 1;
		var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
		var globalThis = requireGlobalThis();
		var isObject = requireIsObject();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var hasOwn = requireHasOwnProperty();
		var shared = requireSharedStore();
		var sharedKey = requireSharedKey();
		var hiddenKeys = requireHiddenKeys();
		var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
		var TypeError = globalThis.TypeError;
		var WeakMap = globalThis.WeakMap;
		var set, get, has;
		var enforce = function (it) {
		  return has(it) ? get(it) : set(it, {});
		};
		var getterFor = function (TYPE) {
		  return function (it) {
		    var state;
		    if (!isObject(it) || (state = get(it)).type !== TYPE) {
		      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
		    } return state;
		  };
		};
		if (NATIVE_WEAK_MAP || shared.state) {
		  var store = shared.state || (shared.state = new WeakMap());
		  store.get = store.get;
		  store.has = store.has;
		  store.set = store.set;
		  set = function (it, metadata) {
		    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
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
		  hiddenKeys[STATE] = true;
		  set = function (it, metadata) {
		    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
		    metadata.facade = it;
		    createNonEnumerableProperty(it, STATE, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return hasOwn(it, STATE) ? it[STATE] : {};
		  };
		  has = function (it) {
		    return hasOwn(it, STATE);
		  };
		}
		internalState = {
		  set: set,
		  get: get,
		  has: has,
		  enforce: enforce,
		  getterFor: getterFor
		};
		return internalState;
	}

	var hasRequiredMakeBuiltIn;
	function requireMakeBuiltIn () {
		if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
		hasRequiredMakeBuiltIn = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var hasOwn = requireHasOwnProperty();
		var DESCRIPTORS = requireDescriptors();
		var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
		var inspectSource = requireInspectSource();
		var InternalStateModule = requireInternalState();
		var enforceInternalState = InternalStateModule.enforce;
		var getInternalState = InternalStateModule.get;
		var $String = String;
		var defineProperty = Object.defineProperty;
		var stringSlice = uncurryThis(''.slice);
		var replace = uncurryThis(''.replace);
		var join = uncurryThis([].join);
		var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
		  return defineProperty(function () {  }, 'length', { value: 8 }).length !== 8;
		});
		var TEMPLATE = String(String).split('String');
		var makeBuiltIn$1 = makeBuiltIn.exports = function (value, name, options) {
		  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
		    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
		  }
		  if (options && options.getter) name = 'get ' + name;
		  if (options && options.setter) name = 'set ' + name;
		  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
		    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
		    else value.name = name;
		  }
		  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
		    defineProperty(value, 'length', { value: options.arity });
		  }
		  try {
		    if (options && hasOwn(options, 'constructor') && options.constructor) {
		      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
		    } else if (value.prototype) value.prototype = undefined;
		  } catch (error) {  }
		  var state = enforceInternalState(value);
		  if (!hasOwn(state, 'source')) {
		    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
		  } return value;
		};
		Function.prototype.toString = makeBuiltIn$1(function toString() {
		  return isCallable(this) && getInternalState(this).source || inspectSource(this);
		}, 'toString');
		return makeBuiltIn.exports;
	}

	var defineBuiltIn;
	var hasRequiredDefineBuiltIn;
	function requireDefineBuiltIn () {
		if (hasRequiredDefineBuiltIn) return defineBuiltIn;
		hasRequiredDefineBuiltIn = 1;
		var isCallable = requireIsCallable();
		var definePropertyModule = requireObjectDefineProperty();
		var makeBuiltIn = requireMakeBuiltIn();
		var defineGlobalProperty = requireDefineGlobalProperty();
		defineBuiltIn = function (O, key, value, options) {
		  if (!options) options = {};
		  var simple = options.enumerable;
		  var name = options.name !== undefined ? options.name : key;
		  if (isCallable(value)) makeBuiltIn(value, name, options);
		  if (options.global) {
		    if (simple) O[key] = value;
		    else defineGlobalProperty(key, value);
		  } else {
		    try {
		      if (!options.unsafe) delete O[key];
		      else if (O[key]) simple = true;
		    } catch (error) {  }
		    if (simple) O[key] = value;
		    else definePropertyModule.f(O, key, {
		      value: value,
		      enumerable: false,
		      configurable: !options.nonConfigurable,
		      writable: !options.nonWritable
		    });
		  } return O;
		};
		return defineBuiltIn;
	}

	var objectGetOwnPropertyNames = {};

	var mathTrunc;
	var hasRequiredMathTrunc;
	function requireMathTrunc () {
		if (hasRequiredMathTrunc) return mathTrunc;
		hasRequiredMathTrunc = 1;
		var ceil = Math.ceil;
		var floor = Math.floor;
		mathTrunc = Math.trunc || function trunc(x) {
		  var n = +x;
		  return (n > 0 ? floor : ceil)(n);
		};
		return mathTrunc;
	}

	var toIntegerOrInfinity;
	var hasRequiredToIntegerOrInfinity;
	function requireToIntegerOrInfinity () {
		if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
		hasRequiredToIntegerOrInfinity = 1;
		var trunc = requireMathTrunc();
		toIntegerOrInfinity = function (argument) {
		  var number = +argument;
		  return number !== number || number === 0 ? 0 : trunc(number);
		};
		return toIntegerOrInfinity;
	}

	var toAbsoluteIndex;
	var hasRequiredToAbsoluteIndex;
	function requireToAbsoluteIndex () {
		if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
		hasRequiredToAbsoluteIndex = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var max = Math.max;
		var min = Math.min;
		toAbsoluteIndex = function (index, length) {
		  var integer = toIntegerOrInfinity(index);
		  return integer < 0 ? max(integer + length, 0) : min(integer, length);
		};
		return toAbsoluteIndex;
	}

	var toLength;
	var hasRequiredToLength;
	function requireToLength () {
		if (hasRequiredToLength) return toLength;
		hasRequiredToLength = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var min = Math.min;
		toLength = function (argument) {
		  var len = toIntegerOrInfinity(argument);
		  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0;
		};
		return toLength;
	}

	var lengthOfArrayLike;
	var hasRequiredLengthOfArrayLike;
	function requireLengthOfArrayLike () {
		if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
		hasRequiredLengthOfArrayLike = 1;
		var toLength = requireToLength();
		lengthOfArrayLike = function (obj) {
		  return toLength(obj.length);
		};
		return lengthOfArrayLike;
	}

	var arrayIncludes;
	var hasRequiredArrayIncludes;
	function requireArrayIncludes () {
		if (hasRequiredArrayIncludes) return arrayIncludes;
		hasRequiredArrayIncludes = 1;
		var toIndexedObject = requireToIndexedObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var createMethod = function (IS_INCLUDES) {
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
		arrayIncludes = {
		  includes: createMethod(true),
		  indexOf: createMethod(false)
		};
		return arrayIncludes;
	}

	var objectKeysInternal;
	var hasRequiredObjectKeysInternal;
	function requireObjectKeysInternal () {
		if (hasRequiredObjectKeysInternal) return objectKeysInternal;
		hasRequiredObjectKeysInternal = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var hasOwn = requireHasOwnProperty();
		var toIndexedObject = requireToIndexedObject();
		var indexOf = requireArrayIncludes().indexOf;
		var hiddenKeys = requireHiddenKeys();
		var push = uncurryThis([].push);
		objectKeysInternal = function (object, names) {
		  var O = toIndexedObject(object);
		  var i = 0;
		  var result = [];
		  var key;
		  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
		  while (names.length > i) if (hasOwn(O, key = names[i++])) {
		    ~indexOf(result, key) || push(result, key);
		  }
		  return result;
		};
		return objectKeysInternal;
	}

	var enumBugKeys;
	var hasRequiredEnumBugKeys;
	function requireEnumBugKeys () {
		if (hasRequiredEnumBugKeys) return enumBugKeys;
		hasRequiredEnumBugKeys = 1;
		enumBugKeys = [
		  'constructor',
		  'hasOwnProperty',
		  'isPrototypeOf',
		  'propertyIsEnumerable',
		  'toLocaleString',
		  'toString',
		  'valueOf'
		];
		return enumBugKeys;
	}

	var hasRequiredObjectGetOwnPropertyNames;
	function requireObjectGetOwnPropertyNames () {
		if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
		hasRequiredObjectGetOwnPropertyNames = 1;
		var internalObjectKeys = requireObjectKeysInternal();
		var enumBugKeys = requireEnumBugKeys();
		var hiddenKeys = enumBugKeys.concat('length', 'prototype');
		objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
		  return internalObjectKeys(O, hiddenKeys);
		};
		return objectGetOwnPropertyNames;
	}

	var objectGetOwnPropertySymbols = {};

	var hasRequiredObjectGetOwnPropertySymbols;
	function requireObjectGetOwnPropertySymbols () {
		if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
		hasRequiredObjectGetOwnPropertySymbols = 1;
		objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
		return objectGetOwnPropertySymbols;
	}

	var ownKeys;
	var hasRequiredOwnKeys;
	function requireOwnKeys () {
		if (hasRequiredOwnKeys) return ownKeys;
		hasRequiredOwnKeys = 1;
		var getBuiltIn = requireGetBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var anObject = requireAnObject();
		var concat = uncurryThis([].concat);
		ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
		  var keys = getOwnPropertyNamesModule.f(anObject(it));
		  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
		};
		return ownKeys;
	}

	var copyConstructorProperties;
	var hasRequiredCopyConstructorProperties;
	function requireCopyConstructorProperties () {
		if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
		hasRequiredCopyConstructorProperties = 1;
		var hasOwn = requireHasOwnProperty();
		var ownKeys = requireOwnKeys();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var definePropertyModule = requireObjectDefineProperty();
		copyConstructorProperties = function (target, source, exceptions) {
		  var keys = ownKeys(source);
		  var defineProperty = definePropertyModule.f;
		  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
		  for (var i = 0; i < keys.length; i++) {
		    var key = keys[i];
		    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
		      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
		    }
		  }
		};
		return copyConstructorProperties;
	}

	var isForced_1;
	var hasRequiredIsForced;
	function requireIsForced () {
		if (hasRequiredIsForced) return isForced_1;
		hasRequiredIsForced = 1;
		var fails = requireFails();
		var isCallable = requireIsCallable();
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
		isForced_1 = isForced;
		return isForced_1;
	}

	var _export;
	var hasRequired_export;
	function require_export () {
		if (hasRequired_export) return _export;
		hasRequired_export = 1;
		var globalThis = requireGlobalThis();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltIn = requireDefineBuiltIn();
		var defineGlobalProperty = requireDefineGlobalProperty();
		var copyConstructorProperties = requireCopyConstructorProperties();
		var isForced = requireIsForced();
		_export = function (options, source) {
		  var TARGET = options.target;
		  var GLOBAL = options.global;
		  var STATIC = options.stat;
		  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
		  if (GLOBAL) {
		    target = globalThis;
		  } else if (STATIC) {
		    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
		  } else {
		    target = globalThis[TARGET] && globalThis[TARGET].prototype;
		  }
		  if (target) for (key in source) {
		    sourceProperty = source[key];
		    if (options.dontCallGetSet) {
		      descriptor = getOwnPropertyDescriptor(target, key);
		      targetProperty = descriptor && descriptor.value;
		    } else targetProperty = target[key];
		    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
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
		return _export;
	}

	var functionUncurryThisClause;
	var hasRequiredFunctionUncurryThisClause;
	function requireFunctionUncurryThisClause () {
		if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
		hasRequiredFunctionUncurryThisClause = 1;
		var classofRaw = requireClassofRaw();
		var uncurryThis = requireFunctionUncurryThis();
		functionUncurryThisClause = function (fn) {
		  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
		};
		return functionUncurryThisClause;
	}

	var arrayMethodIsStrict;
	var hasRequiredArrayMethodIsStrict;
	function requireArrayMethodIsStrict () {
		if (hasRequiredArrayMethodIsStrict) return arrayMethodIsStrict;
		hasRequiredArrayMethodIsStrict = 1;
		var fails = requireFails();
		arrayMethodIsStrict = function (METHOD_NAME, argument) {
		  var method = [][METHOD_NAME];
		  return !!method && fails(function () {
		    method.call(null, argument || function () { return 1; }, 1);
		  });
		};
		return arrayMethodIsStrict;
	}

	var hasRequiredEs_array_indexOf;
	function requireEs_array_indexOf () {
		if (hasRequiredEs_array_indexOf) return es_array_indexOf;
		hasRequiredEs_array_indexOf = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThisClause();
		var $indexOf = requireArrayIncludes().indexOf;
		var arrayMethodIsStrict = requireArrayMethodIsStrict();
		var nativeIndexOf = uncurryThis([].indexOf);
		var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
		var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');
		$({ target: 'Array', proto: true, forced: FORCED }, {
		  indexOf: function indexOf(searchElement ) {
		    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
		    return NEGATIVE_ZERO
		      ? nativeIndexOf(this, searchElement, fromIndex) || 0
		      : $indexOf(this, searchElement, fromIndex);
		  }
		});
		return es_array_indexOf;
	}

	requireEs_array_indexOf();

	var es_array_isArray = {};

	var isArray;
	var hasRequiredIsArray;
	function requireIsArray () {
		if (hasRequiredIsArray) return isArray;
		hasRequiredIsArray = 1;
		var classof = requireClassofRaw();
		isArray = Array.isArray || function isArray(argument) {
		  return classof(argument) === 'Array';
		};
		return isArray;
	}

	var hasRequiredEs_array_isArray;
	function requireEs_array_isArray () {
		if (hasRequiredEs_array_isArray) return es_array_isArray;
		hasRequiredEs_array_isArray = 1;
		var $ = require_export();
		var isArray = requireIsArray();
		$({ target: 'Array', stat: true }, {
		  isArray: isArray
		});
		return es_array_isArray;
	}

	requireEs_array_isArray();

	var objectDefineProperties = {};

	var objectKeys;
	var hasRequiredObjectKeys;
	function requireObjectKeys () {
		if (hasRequiredObjectKeys) return objectKeys;
		hasRequiredObjectKeys = 1;
		var internalObjectKeys = requireObjectKeysInternal();
		var enumBugKeys = requireEnumBugKeys();
		objectKeys = Object.keys || function keys(O) {
		  return internalObjectKeys(O, enumBugKeys);
		};
		return objectKeys;
	}

	var hasRequiredObjectDefineProperties;
	function requireObjectDefineProperties () {
		if (hasRequiredObjectDefineProperties) return objectDefineProperties;
		hasRequiredObjectDefineProperties = 1;
		var DESCRIPTORS = requireDescriptors();
		var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
		var definePropertyModule = requireObjectDefineProperty();
		var anObject = requireAnObject();
		var toIndexedObject = requireToIndexedObject();
		var objectKeys = requireObjectKeys();
		objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
		  anObject(O);
		  var props = toIndexedObject(Properties);
		  var keys = objectKeys(Properties);
		  var length = keys.length;
		  var index = 0;
		  var key;
		  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
		  return O;
		};
		return objectDefineProperties;
	}

	var html;
	var hasRequiredHtml;
	function requireHtml () {
		if (hasRequiredHtml) return html;
		hasRequiredHtml = 1;
		var getBuiltIn = requireGetBuiltIn();
		html = getBuiltIn('document', 'documentElement');
		return html;
	}

	var objectCreate;
	var hasRequiredObjectCreate;
	function requireObjectCreate () {
		if (hasRequiredObjectCreate) return objectCreate;
		hasRequiredObjectCreate = 1;
		var anObject = requireAnObject();
		var definePropertiesModule = requireObjectDefineProperties();
		var enumBugKeys = requireEnumBugKeys();
		var hiddenKeys = requireHiddenKeys();
		var html = requireHtml();
		var documentCreateElement = requireDocumentCreateElement();
		var sharedKey = requireSharedKey();
		var GT = '>';
		var LT = '<';
		var PROTOTYPE = 'prototype';
		var SCRIPT = 'script';
		var IE_PROTO = sharedKey('IE_PROTO');
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
		hiddenKeys[IE_PROTO] = true;
		objectCreate = Object.create || function create(O, Properties) {
		  var result;
		  if (O !== null) {
		    EmptyConstructor[PROTOTYPE] = anObject(O);
		    result = new EmptyConstructor();
		    EmptyConstructor[PROTOTYPE] = null;
		    result[IE_PROTO] = O;
		  } else result = NullProtoObject();
		  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
		};
		return objectCreate;
	}

	var addToUnscopables;
	var hasRequiredAddToUnscopables;
	function requireAddToUnscopables () {
		if (hasRequiredAddToUnscopables) return addToUnscopables;
		hasRequiredAddToUnscopables = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var create = requireObjectCreate();
		var defineProperty = requireObjectDefineProperty().f;
		var UNSCOPABLES = wellKnownSymbol('unscopables');
		var ArrayPrototype = Array.prototype;
		if (ArrayPrototype[UNSCOPABLES] === undefined) {
		  defineProperty(ArrayPrototype, UNSCOPABLES, {
		    configurable: true,
		    value: create(null)
		  });
		}
		addToUnscopables = function (key) {
		  ArrayPrototype[UNSCOPABLES][key] = true;
		};
		return addToUnscopables;
	}

	var iterators;
	var hasRequiredIterators;
	function requireIterators () {
		if (hasRequiredIterators) return iterators;
		hasRequiredIterators = 1;
		iterators = {};
		return iterators;
	}

	var correctPrototypeGetter;
	var hasRequiredCorrectPrototypeGetter;
	function requireCorrectPrototypeGetter () {
		if (hasRequiredCorrectPrototypeGetter) return correctPrototypeGetter;
		hasRequiredCorrectPrototypeGetter = 1;
		var fails = requireFails();
		correctPrototypeGetter = !fails(function () {
		  function F() {  }
		  F.prototype.constructor = null;
		  return Object.getPrototypeOf(new F()) !== F.prototype;
		});
		return correctPrototypeGetter;
	}

	var objectGetPrototypeOf;
	var hasRequiredObjectGetPrototypeOf;
	function requireObjectGetPrototypeOf () {
		if (hasRequiredObjectGetPrototypeOf) return objectGetPrototypeOf;
		hasRequiredObjectGetPrototypeOf = 1;
		var hasOwn = requireHasOwnProperty();
		var isCallable = requireIsCallable();
		var toObject = requireToObject();
		var sharedKey = requireSharedKey();
		var CORRECT_PROTOTYPE_GETTER = requireCorrectPrototypeGetter();
		var IE_PROTO = sharedKey('IE_PROTO');
		var $Object = Object;
		var ObjectPrototype = $Object.prototype;
		objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
		  var object = toObject(O);
		  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
		  var constructor = object.constructor;
		  if (isCallable(constructor) && object instanceof constructor) {
		    return constructor.prototype;
		  } return object instanceof $Object ? ObjectPrototype : null;
		};
		return objectGetPrototypeOf;
	}

	var iteratorsCore;
	var hasRequiredIteratorsCore;
	function requireIteratorsCore () {
		if (hasRequiredIteratorsCore) return iteratorsCore;
		hasRequiredIteratorsCore = 1;
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var create = requireObjectCreate();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var defineBuiltIn = requireDefineBuiltIn();
		var wellKnownSymbol = requireWellKnownSymbol();
		var IS_PURE = requireIsPure();
		var ITERATOR = wellKnownSymbol('iterator');
		var BUGGY_SAFARI_ITERATORS = false;
		var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
		if ([].keys) {
		  arrayIterator = [].keys();
		  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
		  else {
		    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
		    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
		  }
		}
		var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
		  var test = {};
		  return IteratorPrototype[ITERATOR].call(test) !== test;
		});
		if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
		else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);
		if (!isCallable(IteratorPrototype[ITERATOR])) {
		  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
		    return this;
		  });
		}
		iteratorsCore = {
		  IteratorPrototype: IteratorPrototype,
		  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
		};
		return iteratorsCore;
	}

	var setToStringTag;
	var hasRequiredSetToStringTag;
	function requireSetToStringTag () {
		if (hasRequiredSetToStringTag) return setToStringTag;
		hasRequiredSetToStringTag = 1;
		var defineProperty = requireObjectDefineProperty().f;
		var hasOwn = requireHasOwnProperty();
		var wellKnownSymbol = requireWellKnownSymbol();
		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		setToStringTag = function (target, TAG, STATIC) {
		  if (target && !STATIC) target = target.prototype;
		  if (target && !hasOwn(target, TO_STRING_TAG)) {
		    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
		  }
		};
		return setToStringTag;
	}

	var iteratorCreateConstructor;
	var hasRequiredIteratorCreateConstructor;
	function requireIteratorCreateConstructor () {
		if (hasRequiredIteratorCreateConstructor) return iteratorCreateConstructor;
		hasRequiredIteratorCreateConstructor = 1;
		var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
		var create = requireObjectCreate();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var setToStringTag = requireSetToStringTag();
		var Iterators = requireIterators();
		var returnThis = function () { return this; };
		iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
		  var TO_STRING_TAG = NAME + ' Iterator';
		  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
		  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
		  Iterators[TO_STRING_TAG] = returnThis;
		  return IteratorConstructor;
		};
		return iteratorCreateConstructor;
	}

	var functionUncurryThisAccessor;
	var hasRequiredFunctionUncurryThisAccessor;
	function requireFunctionUncurryThisAccessor () {
		if (hasRequiredFunctionUncurryThisAccessor) return functionUncurryThisAccessor;
		hasRequiredFunctionUncurryThisAccessor = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var aCallable = requireACallable();
		functionUncurryThisAccessor = function (object, key, method) {
		  try {
		    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
		  } catch (error) {  }
		};
		return functionUncurryThisAccessor;
	}

	var isPossiblePrototype;
	var hasRequiredIsPossiblePrototype;
	function requireIsPossiblePrototype () {
		if (hasRequiredIsPossiblePrototype) return isPossiblePrototype;
		hasRequiredIsPossiblePrototype = 1;
		var isObject = requireIsObject();
		isPossiblePrototype = function (argument) {
		  return isObject(argument) || argument === null;
		};
		return isPossiblePrototype;
	}

	var aPossiblePrototype;
	var hasRequiredAPossiblePrototype;
	function requireAPossiblePrototype () {
		if (hasRequiredAPossiblePrototype) return aPossiblePrototype;
		hasRequiredAPossiblePrototype = 1;
		var isPossiblePrototype = requireIsPossiblePrototype();
		var $String = String;
		var $TypeError = TypeError;
		aPossiblePrototype = function (argument) {
		  if (isPossiblePrototype(argument)) return argument;
		  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
		};
		return aPossiblePrototype;
	}

	var objectSetPrototypeOf;
	var hasRequiredObjectSetPrototypeOf;
	function requireObjectSetPrototypeOf () {
		if (hasRequiredObjectSetPrototypeOf) return objectSetPrototypeOf;
		hasRequiredObjectSetPrototypeOf = 1;
		var uncurryThisAccessor = requireFunctionUncurryThisAccessor();
		var isObject = requireIsObject();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var aPossiblePrototype = requireAPossiblePrototype();
		objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
		  var CORRECT_SETTER = false;
		  var test = {};
		  var setter;
		  try {
		    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
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
		return objectSetPrototypeOf;
	}

	var iteratorDefine;
	var hasRequiredIteratorDefine;
	function requireIteratorDefine () {
		if (hasRequiredIteratorDefine) return iteratorDefine;
		hasRequiredIteratorDefine = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var IS_PURE = requireIsPure();
		var FunctionName = requireFunctionName();
		var isCallable = requireIsCallable();
		var createIteratorConstructor = requireIteratorCreateConstructor();
		var getPrototypeOf = requireObjectGetPrototypeOf();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		var setToStringTag = requireSetToStringTag();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltIn = requireDefineBuiltIn();
		var wellKnownSymbol = requireWellKnownSymbol();
		var Iterators = requireIterators();
		var IteratorsCore = requireIteratorsCore();
		var PROPER_FUNCTION_NAME = FunctionName.PROPER;
		var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
		var IteratorPrototype = IteratorsCore.IteratorPrototype;
		var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
		var ITERATOR = wellKnownSymbol('iterator');
		var KEYS = 'keys';
		var VALUES = 'values';
		var ENTRIES = 'entries';
		var returnThis = function () { return this; };
		iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
		  createIteratorConstructor(IteratorConstructor, NAME, next);
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
		  var nativeIterator = IterablePrototype[ITERATOR]
		    || IterablePrototype['@@iterator']
		    || DEFAULT && IterablePrototype[DEFAULT];
		  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
		  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
		  var CurrentIteratorPrototype, methods, KEY;
		  if (anyNativeIterator) {
		    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
		    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
		      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
		        if (setPrototypeOf) {
		          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
		        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
		          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
		        }
		      }
		      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
		      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
		    }
		  }
		  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
		    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
		      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
		    } else {
		      INCORRECT_VALUES_NAME = true;
		      defaultIterator = function values() { return call(nativeIterator, this); };
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
		    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
		  }
		  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
		    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
		  }
		  Iterators[NAME] = defaultIterator;
		  return methods;
		};
		return iteratorDefine;
	}

	var createIterResultObject;
	var hasRequiredCreateIterResultObject;
	function requireCreateIterResultObject () {
		if (hasRequiredCreateIterResultObject) return createIterResultObject;
		hasRequiredCreateIterResultObject = 1;
		createIterResultObject = function (value, done) {
		  return { value: value, done: done };
		};
		return createIterResultObject;
	}

	var es_array_iterator;
	var hasRequiredEs_array_iterator;
	function requireEs_array_iterator () {
		if (hasRequiredEs_array_iterator) return es_array_iterator;
		hasRequiredEs_array_iterator = 1;
		var toIndexedObject = requireToIndexedObject();
		var addToUnscopables = requireAddToUnscopables();
		var Iterators = requireIterators();
		var InternalStateModule = requireInternalState();
		var defineProperty = requireObjectDefineProperty().f;
		var defineIterator = requireIteratorDefine();
		var createIterResultObject = requireCreateIterResultObject();
		var IS_PURE = requireIsPure();
		var DESCRIPTORS = requireDescriptors();
		var ARRAY_ITERATOR = 'Array Iterator';
		var setInternalState = InternalStateModule.set;
		var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
		es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
		  setInternalState(this, {
		    type: ARRAY_ITERATOR,
		    target: toIndexedObject(iterated),
		    index: 0,
		    kind: kind
		  });
		}, function () {
		  var state = getInternalState(this);
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
		var values = Iterators.Arguments = Iterators.Array;
		addToUnscopables('keys');
		addToUnscopables('values');
		addToUnscopables('entries');
		if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
		  defineProperty(values, 'name', { value: 'values' });
		} catch (error) {  }
		return es_array_iterator;
	}

	requireEs_array_iterator();

	var es_array_slice = {};

	var toStringTagSupport;
	var hasRequiredToStringTagSupport;
	function requireToStringTagSupport () {
		if (hasRequiredToStringTagSupport) return toStringTagSupport;
		hasRequiredToStringTagSupport = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var test = {};
		test[TO_STRING_TAG] = 'z';
		toStringTagSupport = String(test) === '[object z]';
		return toStringTagSupport;
	}

	var classof;
	var hasRequiredClassof;
	function requireClassof () {
		if (hasRequiredClassof) return classof;
		hasRequiredClassof = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var isCallable = requireIsCallable();
		var classofRaw = requireClassofRaw();
		var wellKnownSymbol = requireWellKnownSymbol();
		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var $Object = Object;
		var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';
		var tryGet = function (it, key) {
		  try {
		    return it[key];
		  } catch (error) {  }
		};
		classof = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
		  var O, tag, result;
		  return it === undefined ? 'Undefined' : it === null ? 'Null'
		    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
		    : CORRECT_ARGUMENTS ? classofRaw(O)
		    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
		};
		return classof;
	}

	var isConstructor;
	var hasRequiredIsConstructor;
	function requireIsConstructor () {
		if (hasRequiredIsConstructor) return isConstructor;
		hasRequiredIsConstructor = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var classof = requireClassof();
		var getBuiltIn = requireGetBuiltIn();
		var inspectSource = requireInspectSource();
		var noop = function () {  };
		var construct = getBuiltIn('Reflect', 'construct');
		var constructorRegExp = /^\s*(?:class|function)\b/;
		var exec = uncurryThis(constructorRegExp.exec);
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
		    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
		  } catch (error) {
		    return true;
		  }
		};
		isConstructorLegacy.sham = true;
		isConstructor = !construct || fails(function () {
		  var called;
		  return isConstructorModern(isConstructorModern.call)
		    || !isConstructorModern(Object)
		    || !isConstructorModern(function () { called = true; })
		    || called;
		}) ? isConstructorLegacy : isConstructorModern;
		return isConstructor;
	}

	var createProperty;
	var hasRequiredCreateProperty;
	function requireCreateProperty () {
		if (hasRequiredCreateProperty) return createProperty;
		hasRequiredCreateProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var definePropertyModule = requireObjectDefineProperty();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		createProperty = function (object, key, value) {
		  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
		  else object[key] = value;
		};
		return createProperty;
	}

	var arrayMethodHasSpeciesSupport;
	var hasRequiredArrayMethodHasSpeciesSupport;
	function requireArrayMethodHasSpeciesSupport () {
		if (hasRequiredArrayMethodHasSpeciesSupport) return arrayMethodHasSpeciesSupport;
		hasRequiredArrayMethodHasSpeciesSupport = 1;
		var fails = requireFails();
		var wellKnownSymbol = requireWellKnownSymbol();
		var V8_VERSION = requireEnvironmentV8Version();
		var SPECIES = wellKnownSymbol('species');
		arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
		  return V8_VERSION >= 51 || !fails(function () {
		    var array = [];
		    var constructor = array.constructor = {};
		    constructor[SPECIES] = function () {
		      return { foo: 1 };
		    };
		    return array[METHOD_NAME](Boolean).foo !== 1;
		  });
		};
		return arrayMethodHasSpeciesSupport;
	}

	var arraySlice;
	var hasRequiredArraySlice;
	function requireArraySlice () {
		if (hasRequiredArraySlice) return arraySlice;
		hasRequiredArraySlice = 1;
		var uncurryThis = requireFunctionUncurryThis();
		arraySlice = uncurryThis([].slice);
		return arraySlice;
	}

	var hasRequiredEs_array_slice;
	function requireEs_array_slice () {
		if (hasRequiredEs_array_slice) return es_array_slice;
		hasRequiredEs_array_slice = 1;
		var $ = require_export();
		var isArray = requireIsArray();
		var isConstructor = requireIsConstructor();
		var isObject = requireIsObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var toIndexedObject = requireToIndexedObject();
		var createProperty = requireCreateProperty();
		var wellKnownSymbol = requireWellKnownSymbol();
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();
		var nativeSlice = requireArraySlice();
		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
		var SPECIES = wellKnownSymbol('species');
		var $Array = Array;
		var max = Math.max;
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  slice: function slice(start, end) {
		    var O = toIndexedObject(this);
		    var length = lengthOfArrayLike(O);
		    var k = toAbsoluteIndex(start, length);
		    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
		    var Constructor, result, n;
		    if (isArray(O)) {
		      Constructor = O.constructor;
		      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
		        Constructor = undefined;
		      } else if (isObject(Constructor)) {
		        Constructor = Constructor[SPECIES];
		        if (Constructor === null) Constructor = undefined;
		      }
		      if (Constructor === $Array || Constructor === undefined) {
		        return nativeSlice(O, k, fin);
		      }
		    }
		    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
		    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
		    result.length = n;
		    return result;
		  }
		});
		return es_array_slice;
	}

	requireEs_array_slice();

	var es_function_name = {};

	var defineBuiltInAccessor;
	var hasRequiredDefineBuiltInAccessor;
	function requireDefineBuiltInAccessor () {
		if (hasRequiredDefineBuiltInAccessor) return defineBuiltInAccessor;
		hasRequiredDefineBuiltInAccessor = 1;
		var makeBuiltIn = requireMakeBuiltIn();
		var defineProperty = requireObjectDefineProperty();
		defineBuiltInAccessor = function (target, name, descriptor) {
		  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
		  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
		  return defineProperty.f(target, name, descriptor);
		};
		return defineBuiltInAccessor;
	}

	var hasRequiredEs_function_name;
	function requireEs_function_name () {
		if (hasRequiredEs_function_name) return es_function_name;
		hasRequiredEs_function_name = 1;
		var DESCRIPTORS = requireDescriptors();
		var FUNCTION_NAME_EXISTS = requireFunctionName().EXISTS;
		var uncurryThis = requireFunctionUncurryThis();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var FunctionPrototype = Function.prototype;
		var functionToString = uncurryThis(FunctionPrototype.toString);
		var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
		var regExpExec = uncurryThis(nameRE.exec);
		var NAME = 'name';
		if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
		  defineBuiltInAccessor(FunctionPrototype, NAME, {
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
		return es_function_name;
	}

	requireEs_function_name();

	var es_map = {};

	var es_map_constructor = {};

	var internalMetadata = {exports: {}};

	var objectGetOwnPropertyNamesExternal = {};

	var hasRequiredObjectGetOwnPropertyNamesExternal;
	function requireObjectGetOwnPropertyNamesExternal () {
		if (hasRequiredObjectGetOwnPropertyNamesExternal) return objectGetOwnPropertyNamesExternal;
		hasRequiredObjectGetOwnPropertyNamesExternal = 1;
		var classof = requireClassofRaw();
		var toIndexedObject = requireToIndexedObject();
		var $getOwnPropertyNames = requireObjectGetOwnPropertyNames().f;
		var arraySlice = requireArraySlice();
		var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
		  ? Object.getOwnPropertyNames(window) : [];
		var getWindowNames = function (it) {
		  try {
		    return $getOwnPropertyNames(it);
		  } catch (error) {
		    return arraySlice(windowNames);
		  }
		};
		objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
		  return windowNames && classof(it) === 'Window'
		    ? getWindowNames(it)
		    : $getOwnPropertyNames(toIndexedObject(it));
		};
		return objectGetOwnPropertyNamesExternal;
	}

	var arrayBufferNonExtensible;
	var hasRequiredArrayBufferNonExtensible;
	function requireArrayBufferNonExtensible () {
		if (hasRequiredArrayBufferNonExtensible) return arrayBufferNonExtensible;
		hasRequiredArrayBufferNonExtensible = 1;
		var fails = requireFails();
		arrayBufferNonExtensible = fails(function () {
		  if (typeof ArrayBuffer == 'function') {
		    var buffer = new ArrayBuffer(8);
		    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
		  }
		});
		return arrayBufferNonExtensible;
	}

	var objectIsExtensible;
	var hasRequiredObjectIsExtensible;
	function requireObjectIsExtensible () {
		if (hasRequiredObjectIsExtensible) return objectIsExtensible;
		hasRequiredObjectIsExtensible = 1;
		var fails = requireFails();
		var isObject = requireIsObject();
		var classof = requireClassofRaw();
		var ARRAY_BUFFER_NON_EXTENSIBLE = requireArrayBufferNonExtensible();
		var $isExtensible = Object.isExtensible;
		var FAILS_ON_PRIMITIVES = fails(function () { });
		objectIsExtensible = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
		  if (!isObject(it)) return false;
		  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === 'ArrayBuffer') return false;
		  return $isExtensible ? $isExtensible(it) : true;
		} : $isExtensible;
		return objectIsExtensible;
	}

	var freezing;
	var hasRequiredFreezing;
	function requireFreezing () {
		if (hasRequiredFreezing) return freezing;
		hasRequiredFreezing = 1;
		var fails = requireFails();
		freezing = !fails(function () {
		  return Object.isExtensible(Object.preventExtensions({}));
		});
		return freezing;
	}

	var hasRequiredInternalMetadata;
	function requireInternalMetadata () {
		if (hasRequiredInternalMetadata) return internalMetadata.exports;
		hasRequiredInternalMetadata = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var hiddenKeys = requireHiddenKeys();
		var isObject = requireIsObject();
		var hasOwn = requireHasOwnProperty();
		var defineProperty = requireObjectDefineProperty().f;
		var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
		var getOwnPropertyNamesExternalModule = requireObjectGetOwnPropertyNamesExternal();
		var isExtensible = requireObjectIsExtensible();
		var uid = requireUid();
		var FREEZING = requireFreezing();
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
		  if (!hasOwn(it, METADATA)) {
		    if (!isExtensible(it)) return 'F';
		    if (!create) return 'E';
		    setMetadata(it);
		  } return it[METADATA].objectID;
		};
		var getWeakData = function (it, create) {
		  if (!hasOwn(it, METADATA)) {
		    if (!isExtensible(it)) return true;
		    if (!create) return false;
		    setMetadata(it);
		  } return it[METADATA].weakData;
		};
		var onFreeze = function (it) {
		  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
		  return it;
		};
		var enable = function () {
		  meta.enable = function () {  };
		  REQUIRED = true;
		  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
		  var splice = uncurryThis([].splice);
		  var test = {};
		  test[METADATA] = 1;
		  if (getOwnPropertyNames(test).length) {
		    getOwnPropertyNamesModule.f = function (it) {
		      var result = getOwnPropertyNames(it);
		      for (var i = 0, length = result.length; i < length; i++) {
		        if (result[i] === METADATA) {
		          splice(result, i, 1);
		          break;
		        }
		      } return result;
		    };
		    $({ target: 'Object', stat: true, forced: true }, {
		      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
		    });
		  }
		};
		var meta = internalMetadata.exports = {
		  enable: enable,
		  fastKey: fastKey,
		  getWeakData: getWeakData,
		  onFreeze: onFreeze
		};
		hiddenKeys[METADATA] = true;
		return internalMetadata.exports;
	}

	var functionBindContext;
	var hasRequiredFunctionBindContext;
	function requireFunctionBindContext () {
		if (hasRequiredFunctionBindContext) return functionBindContext;
		hasRequiredFunctionBindContext = 1;
		var uncurryThis = requireFunctionUncurryThisClause();
		var aCallable = requireACallable();
		var NATIVE_BIND = requireFunctionBindNative();
		var bind = uncurryThis(uncurryThis.bind);
		functionBindContext = function (fn, that) {
		  aCallable(fn);
		  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function () {
		    return fn.apply(that, arguments);
		  };
		};
		return functionBindContext;
	}

	var isArrayIteratorMethod;
	var hasRequiredIsArrayIteratorMethod;
	function requireIsArrayIteratorMethod () {
		if (hasRequiredIsArrayIteratorMethod) return isArrayIteratorMethod;
		hasRequiredIsArrayIteratorMethod = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var Iterators = requireIterators();
		var ITERATOR = wellKnownSymbol('iterator');
		var ArrayPrototype = Array.prototype;
		isArrayIteratorMethod = function (it) {
		  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
		};
		return isArrayIteratorMethod;
	}

	var getIteratorMethod;
	var hasRequiredGetIteratorMethod;
	function requireGetIteratorMethod () {
		if (hasRequiredGetIteratorMethod) return getIteratorMethod;
		hasRequiredGetIteratorMethod = 1;
		var classof = requireClassof();
		var getMethod = requireGetMethod();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var Iterators = requireIterators();
		var wellKnownSymbol = requireWellKnownSymbol();
		var ITERATOR = wellKnownSymbol('iterator');
		getIteratorMethod = function (it) {
		  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
		    || getMethod(it, '@@iterator')
		    || Iterators[classof(it)];
		};
		return getIteratorMethod;
	}

	var getIterator;
	var hasRequiredGetIterator;
	function requireGetIterator () {
		if (hasRequiredGetIterator) return getIterator;
		hasRequiredGetIterator = 1;
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var anObject = requireAnObject();
		var tryToString = requireTryToString();
		var getIteratorMethod = requireGetIteratorMethod();
		var $TypeError = TypeError;
		getIterator = function (argument, usingIterator) {
		  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
		  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
		  throw new $TypeError(tryToString(argument) + ' is not iterable');
		};
		return getIterator;
	}

	var iteratorClose;
	var hasRequiredIteratorClose;
	function requireIteratorClose () {
		if (hasRequiredIteratorClose) return iteratorClose;
		hasRequiredIteratorClose = 1;
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var getMethod = requireGetMethod();
		iteratorClose = function (iterator, kind, value) {
		  var innerResult, innerError;
		  anObject(iterator);
		  try {
		    innerResult = getMethod(iterator, 'return');
		    if (!innerResult) {
		      if (kind === 'throw') throw value;
		      return value;
		    }
		    innerResult = call(innerResult, iterator);
		  } catch (error) {
		    innerError = true;
		    innerResult = error;
		  }
		  if (kind === 'throw') throw value;
		  if (innerError) throw innerResult;
		  anObject(innerResult);
		  return value;
		};
		return iteratorClose;
	}

	var iterate;
	var hasRequiredIterate;
	function requireIterate () {
		if (hasRequiredIterate) return iterate;
		hasRequiredIterate = 1;
		var bind = requireFunctionBindContext();
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var tryToString = requireTryToString();
		var isArrayIteratorMethod = requireIsArrayIteratorMethod();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var getIterator = requireGetIterator();
		var getIteratorMethod = requireGetIteratorMethod();
		var iteratorClose = requireIteratorClose();
		var $TypeError = TypeError;
		var Result = function (stopped, result) {
		  this.stopped = stopped;
		  this.result = result;
		};
		var ResultPrototype = Result.prototype;
		iterate = function (iterable, unboundFunction, options) {
		  var that = options && options.that;
		  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
		  var IS_RECORD = !!(options && options.IS_RECORD);
		  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
		  var INTERRUPTED = !!(options && options.INTERRUPTED);
		  var fn = bind(unboundFunction, that);
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
		    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
		    if (isArrayIteratorMethod(iterFn)) {
		      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
		        result = callFn(iterable[index]);
		        if (result && isPrototypeOf(ResultPrototype, result)) return result;
		      } return new Result(false);
		    }
		    iterator = getIterator(iterable, iterFn);
		  }
		  next = IS_RECORD ? iterable.next : iterator.next;
		  while (!(step = call(next, iterator)).done) {
		    try {
		      result = callFn(step.value);
		    } catch (error) {
		      iteratorClose(iterator, 'throw', error);
		    }
		    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
		  } return new Result(false);
		};
		return iterate;
	}

	var anInstance;
	var hasRequiredAnInstance;
	function requireAnInstance () {
		if (hasRequiredAnInstance) return anInstance;
		hasRequiredAnInstance = 1;
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var $TypeError = TypeError;
		anInstance = function (it, Prototype) {
		  if (isPrototypeOf(Prototype, it)) return it;
		  throw new $TypeError('Incorrect invocation');
		};
		return anInstance;
	}

	var checkCorrectnessOfIteration;
	var hasRequiredCheckCorrectnessOfIteration;
	function requireCheckCorrectnessOfIteration () {
		if (hasRequiredCheckCorrectnessOfIteration) return checkCorrectnessOfIteration;
		hasRequiredCheckCorrectnessOfIteration = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var ITERATOR = wellKnownSymbol('iterator');
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
		  iteratorWithReturn[ITERATOR] = function () {
		    return this;
		  };
		  Array.from(iteratorWithReturn, function () { throw 2; });
		} catch (error) {  }
		checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
		  try {
		    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
		  } catch (error) { return false; }
		  var ITERATION_SUPPORT = false;
		  try {
		    var object = {};
		    object[ITERATOR] = function () {
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
		return checkCorrectnessOfIteration;
	}

	var inheritIfRequired;
	var hasRequiredInheritIfRequired;
	function requireInheritIfRequired () {
		if (hasRequiredInheritIfRequired) return inheritIfRequired;
		hasRequiredInheritIfRequired = 1;
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		inheritIfRequired = function ($this, dummy, Wrapper) {
		  var NewTarget, NewTargetPrototype;
		  if (
		    setPrototypeOf &&
		    isCallable(NewTarget = dummy.constructor) &&
		    NewTarget !== Wrapper &&
		    isObject(NewTargetPrototype = NewTarget.prototype) &&
		    NewTargetPrototype !== Wrapper.prototype
		  ) setPrototypeOf($this, NewTargetPrototype);
		  return $this;
		};
		return inheritIfRequired;
	}

	var collection;
	var hasRequiredCollection;
	function requireCollection () {
		if (hasRequiredCollection) return collection;
		hasRequiredCollection = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var isForced = requireIsForced();
		var defineBuiltIn = requireDefineBuiltIn();
		var InternalMetadataModule = requireInternalMetadata();
		var iterate = requireIterate();
		var anInstance = requireAnInstance();
		var isCallable = requireIsCallable();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var isObject = requireIsObject();
		var fails = requireFails();
		var checkCorrectnessOfIteration = requireCheckCorrectnessOfIteration();
		var setToStringTag = requireSetToStringTag();
		var inheritIfRequired = requireInheritIfRequired();
		collection = function (CONSTRUCTOR_NAME, wrapper, common) {
		  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
		  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
		  var ADDER = IS_MAP ? 'set' : 'add';
		  var NativeConstructor = globalThis[CONSTRUCTOR_NAME];
		  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
		  var Constructor = NativeConstructor;
		  var exported = {};
		  var fixMethod = function (KEY) {
		    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
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
		  var REPLACE = isForced(
		    CONSTRUCTOR_NAME,
		    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
		      new NativeConstructor().entries().next();
		    }))
		  );
		  if (REPLACE) {
		    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
		    InternalMetadataModule.enable();
		  } else if (isForced(CONSTRUCTOR_NAME, true)) {
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
		  $({ global: true, constructor: true, forced: Constructor !== NativeConstructor }, exported);
		  setToStringTag(Constructor, CONSTRUCTOR_NAME);
		  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
		  return Constructor;
		};
		return collection;
	}

	var defineBuiltIns;
	var hasRequiredDefineBuiltIns;
	function requireDefineBuiltIns () {
		if (hasRequiredDefineBuiltIns) return defineBuiltIns;
		hasRequiredDefineBuiltIns = 1;
		var defineBuiltIn = requireDefineBuiltIn();
		defineBuiltIns = function (target, src, options) {
		  for (var key in src) defineBuiltIn(target, key, src[key], options);
		  return target;
		};
		return defineBuiltIns;
	}

	var setSpecies;
	var hasRequiredSetSpecies;
	function requireSetSpecies () {
		if (hasRequiredSetSpecies) return setSpecies;
		hasRequiredSetSpecies = 1;
		var getBuiltIn = requireGetBuiltIn();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var wellKnownSymbol = requireWellKnownSymbol();
		var DESCRIPTORS = requireDescriptors();
		var SPECIES = wellKnownSymbol('species');
		setSpecies = function (CONSTRUCTOR_NAME) {
		  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
		  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
		    defineBuiltInAccessor(Constructor, SPECIES, {
		      configurable: true,
		      get: function () { return this; }
		    });
		  }
		};
		return setSpecies;
	}

	var collectionStrong;
	var hasRequiredCollectionStrong;
	function requireCollectionStrong () {
		if (hasRequiredCollectionStrong) return collectionStrong;
		hasRequiredCollectionStrong = 1;
		var create = requireObjectCreate();
		var defineBuiltInAccessor = requireDefineBuiltInAccessor();
		var defineBuiltIns = requireDefineBuiltIns();
		var bind = requireFunctionBindContext();
		var anInstance = requireAnInstance();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var iterate = requireIterate();
		var defineIterator = requireIteratorDefine();
		var createIterResultObject = requireCreateIterResultObject();
		var setSpecies = requireSetSpecies();
		var DESCRIPTORS = requireDescriptors();
		var fastKey = requireInternalMetadata().fastKey;
		var InternalStateModule = requireInternalState();
		var setInternalState = InternalStateModule.set;
		var internalStateGetterFor = InternalStateModule.getterFor;
		collectionStrong = {
		  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
		    var Constructor = wrapper(function (that, iterable) {
		      anInstance(that, Prototype);
		      setInternalState(that, {
		        type: CONSTRUCTOR_NAME,
		        index: create(null),
		        first: null,
		        last: null,
		        size: 0
		      });
		      if (!DESCRIPTORS) that.size = 0;
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
		        if (DESCRIPTORS) state.size++;
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
		        state.index = create(null);
		        if (DESCRIPTORS) state.size = 0;
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
		          if (DESCRIPTORS) state.size--;
		          else that.size--;
		        } return !!entry;
		      },
		      forEach: function forEach(callbackfn ) {
		        var state = getInternalState(this);
		        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
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
		    if (DESCRIPTORS) defineBuiltInAccessor(Prototype, 'size', {
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
		    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
		      setInternalState(this, {
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
		return collectionStrong;
	}

	var hasRequiredEs_map_constructor;
	function requireEs_map_constructor () {
		if (hasRequiredEs_map_constructor) return es_map_constructor;
		hasRequiredEs_map_constructor = 1;
		var collection = requireCollection();
		var collectionStrong = requireCollectionStrong();
		collection('Map', function (init) {
		  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
		}, collectionStrong);
		return es_map_constructor;
	}

	var hasRequiredEs_map;
	function requireEs_map () {
		if (hasRequiredEs_map) return es_map;
		hasRequiredEs_map = 1;
		requireEs_map_constructor();
		return es_map;
	}

	requireEs_map();

	var es_object_assign = {};

	var objectAssign;
	var hasRequiredObjectAssign;
	function requireObjectAssign () {
		if (hasRequiredObjectAssign) return objectAssign;
		hasRequiredObjectAssign = 1;
		var DESCRIPTORS = requireDescriptors();
		var uncurryThis = requireFunctionUncurryThis();
		var call = requireFunctionCall();
		var fails = requireFails();
		var objectKeys = requireObjectKeys();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
		var toObject = requireToObject();
		var IndexedObject = requireIndexedObject();
		var $assign = Object.assign;
		var defineProperty = Object.defineProperty;
		var concat = uncurryThis([].concat);
		objectAssign = !$assign || fails(function () {
		  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
		    enumerable: true,
		    get: function () {
		      defineProperty(this, 'b', {
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
		  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		  var propertyIsEnumerable = propertyIsEnumerableModule.f;
		  while (argumentsLength > index) {
		    var S = IndexedObject(arguments[index++]);
		    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
		    var length = keys.length;
		    var j = 0;
		    var key;
		    while (length > j) {
		      key = keys[j++];
		      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
		    }
		  } return T;
		} : $assign;
		return objectAssign;
	}

	var hasRequiredEs_object_assign;
	function requireEs_object_assign () {
		if (hasRequiredEs_object_assign) return es_object_assign;
		hasRequiredEs_object_assign = 1;
		var $ = require_export();
		var assign = requireObjectAssign();
		$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
		  assign: assign
		});
		return es_object_assign;
	}

	requireEs_object_assign();

	var es_object_toString = {};

	var objectToString;
	var hasRequiredObjectToString;
	function requireObjectToString () {
		if (hasRequiredObjectToString) return objectToString;
		hasRequiredObjectToString = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var classof = requireClassof();
		objectToString = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
		  return '[object ' + classof(this) + ']';
		};
		return objectToString;
	}

	var hasRequiredEs_object_toString;
	function requireEs_object_toString () {
		if (hasRequiredEs_object_toString) return es_object_toString;
		hasRequiredEs_object_toString = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var defineBuiltIn = requireDefineBuiltIn();
		var toString = requireObjectToString();
		if (!TO_STRING_TAG_SUPPORT) {
		  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
		}
		return es_object_toString;
	}

	requireEs_object_toString();

	var es_string_iterator = {};

	var toString;
	var hasRequiredToString;
	function requireToString () {
		if (hasRequiredToString) return toString;
		hasRequiredToString = 1;
		var classof = requireClassof();
		var $String = String;
		toString = function (argument) {
		  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
		  return $String(argument);
		};
		return toString;
	}

	var stringMultibyte;
	var hasRequiredStringMultibyte;
	function requireStringMultibyte () {
		if (hasRequiredStringMultibyte) return stringMultibyte;
		hasRequiredStringMultibyte = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var charAt = uncurryThis(''.charAt);
		var charCodeAt = uncurryThis(''.charCodeAt);
		var stringSlice = uncurryThis(''.slice);
		var createMethod = function (CONVERT_TO_STRING) {
		  return function ($this, pos) {
		    var S = toString(requireObjectCoercible($this));
		    var position = toIntegerOrInfinity(pos);
		    var size = S.length;
		    var first, second;
		    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
		    first = charCodeAt(S, position);
		    return first < 0xD800 || first > 0xDBFF || position + 1 === size
		      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
		        ? CONVERT_TO_STRING
		          ? charAt(S, position)
		          : first
		        : CONVERT_TO_STRING
		          ? stringSlice(S, position, position + 2)
		          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
		  };
		};
		stringMultibyte = {
		  codeAt: createMethod(false),
		  charAt: createMethod(true)
		};
		return stringMultibyte;
	}

	var hasRequiredEs_string_iterator;
	function requireEs_string_iterator () {
		if (hasRequiredEs_string_iterator) return es_string_iterator;
		hasRequiredEs_string_iterator = 1;
		var charAt = requireStringMultibyte().charAt;
		var toString = requireToString();
		var InternalStateModule = requireInternalState();
		var defineIterator = requireIteratorDefine();
		var createIterResultObject = requireCreateIterResultObject();
		var STRING_ITERATOR = 'String Iterator';
		var setInternalState = InternalStateModule.set;
		var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
		defineIterator(String, 'String', function (iterated) {
		  setInternalState(this, {
		    type: STRING_ITERATOR,
		    string: toString(iterated),
		    index: 0
		  });
		}, function next() {
		  var state = getInternalState(this);
		  var string = state.string;
		  var index = state.index;
		  var point;
		  if (index >= string.length) return createIterResultObject(undefined, true);
		  point = charAt(string, index);
		  state.index += point.length;
		  return createIterResultObject(point, false);
		});
		return es_string_iterator;
	}

	requireEs_string_iterator();

	var es_string_trim = {};

	var whitespaces;
	var hasRequiredWhitespaces;
	function requireWhitespaces () {
		if (hasRequiredWhitespaces) return whitespaces;
		hasRequiredWhitespaces = 1;
		whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
		  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
		return whitespaces;
	}

	var stringTrim;
	var hasRequiredStringTrim;
	function requireStringTrim () {
		if (hasRequiredStringTrim) return stringTrim;
		hasRequiredStringTrim = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var toString = requireToString();
		var whitespaces = requireWhitespaces();
		var replace = uncurryThis(''.replace);
		var ltrim = RegExp('^[' + whitespaces + ']+');
		var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');
		var createMethod = function (TYPE) {
		  return function ($this) {
		    var string = toString(requireObjectCoercible($this));
		    if (TYPE & 1) string = replace(string, ltrim, '');
		    if (TYPE & 2) string = replace(string, rtrim, '$1');
		    return string;
		  };
		};
		stringTrim = {
		  start: createMethod(1),
		  end: createMethod(2),
		  trim: createMethod(3)
		};
		return stringTrim;
	}

	var stringTrimForced;
	var hasRequiredStringTrimForced;
	function requireStringTrimForced () {
		if (hasRequiredStringTrimForced) return stringTrimForced;
		hasRequiredStringTrimForced = 1;
		var PROPER_FUNCTION_NAME = requireFunctionName().PROPER;
		var fails = requireFails();
		var whitespaces = requireWhitespaces();
		var non = '\u200B\u0085\u180E';
		stringTrimForced = function (METHOD_NAME) {
		  return fails(function () {
		    return !!whitespaces[METHOD_NAME]()
		      || non[METHOD_NAME]() !== non
		      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
		  });
		};
		return stringTrimForced;
	}

	var hasRequiredEs_string_trim;
	function requireEs_string_trim () {
		if (hasRequiredEs_string_trim) return es_string_trim;
		hasRequiredEs_string_trim = 1;
		var $ = require_export();
		var $trim = requireStringTrim().trim;
		var forcedStringTrimMethod = requireStringTrimForced();
		$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
		  trim: function trim() {
		    return $trim(this);
		  }
		});
		return es_string_trim;
	}

	requireEs_string_trim();

	var web_domCollections_iterator = {};

	var domIterables;
	var hasRequiredDomIterables;
	function requireDomIterables () {
		if (hasRequiredDomIterables) return domIterables;
		hasRequiredDomIterables = 1;
		domIterables = {
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
		return domIterables;
	}

	var domTokenListPrototype;
	var hasRequiredDomTokenListPrototype;
	function requireDomTokenListPrototype () {
		if (hasRequiredDomTokenListPrototype) return domTokenListPrototype;
		hasRequiredDomTokenListPrototype = 1;
		var documentCreateElement = requireDocumentCreateElement();
		var classList = documentCreateElement('span').classList;
		var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
		domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;
		return domTokenListPrototype;
	}

	var hasRequiredWeb_domCollections_iterator;
	function requireWeb_domCollections_iterator () {
		if (hasRequiredWeb_domCollections_iterator) return web_domCollections_iterator;
		hasRequiredWeb_domCollections_iterator = 1;
		var globalThis = requireGlobalThis();
		var DOMIterables = requireDomIterables();
		var DOMTokenListPrototype = requireDomTokenListPrototype();
		var ArrayIteratorMethods = requireEs_array_iterator();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var setToStringTag = requireSetToStringTag();
		var wellKnownSymbol = requireWellKnownSymbol();
		var ITERATOR = wellKnownSymbol('iterator');
		var ArrayValues = ArrayIteratorMethods.values;
		var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
		  if (CollectionPrototype) {
		    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
		      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
		    } catch (error) {
		      CollectionPrototype[ITERATOR] = ArrayValues;
		    }
		    setToStringTag(CollectionPrototype, COLLECTION_NAME, true);
		    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
		      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
		        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
		      } catch (error) {
		        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
		      }
		    }
		  }
		};
		for (var COLLECTION_NAME in DOMIterables) {
		  handlePrototype(globalThis[COLLECTION_NAME] && globalThis[COLLECTION_NAME].prototype, COLLECTION_NAME);
		}
		handlePrototype(DOMTokenListPrototype, 'DOMTokenList');
		return web_domCollections_iterator;
	}

	requireWeb_domCollections_iterator();

	var Idiomorph = (function () {
	  const noOp = () => {};
	  const defaults = {
	    morphStyle: "outerHTML",
	    callbacks: {
	      beforeNodeAdded: noOp,
	      afterNodeAdded: noOp,
	      beforeNodeMorphed: noOp,
	      afterNodeMorphed: noOp,
	      beforeNodeRemoved: noOp,
	      afterNodeRemoved: noOp,
	      beforeAttributeUpdated: noOp,
	    },
	    head: {
	      style: "merge",
	      shouldPreserve: (elt) => elt.getAttribute("im-preserve") === "true",
	      shouldReAppend: (elt) => elt.getAttribute("im-re-append") === "true",
	      shouldRemove: noOp,
	      afterHeadMorphed: noOp,
	    },
	    restoreFocus: true,
	  };
	  function morph(oldNode, newContent, config = {}) {
	    oldNode = normalizeElement(oldNode);
	    const newNode = normalizeParent(newContent);
	    const ctx = createMorphContext(oldNode, newNode, config);
	    const morphedNodes = saveAndRestoreFocus(ctx, () => {
	      return withHeadBlocking(
	        ctx,
	        oldNode,
	        newNode,
	         (ctx) => {
	          if (ctx.morphStyle === "innerHTML") {
	            morphChildren(ctx, oldNode, newNode);
	            return Array.from(oldNode.childNodes);
	          } else {
	            return morphOuterHTML(ctx, oldNode, newNode);
	          }
	        },
	      );
	    });
	    ctx.pantry.remove();
	    return morphedNodes;
	  }
	  function morphOuterHTML(ctx, oldNode, newNode) {
	    const oldParent = normalizeParent(oldNode);
	    morphChildren(
	      ctx,
	      oldParent,
	      newNode,
	      oldNode,
	      oldNode.nextSibling,
	    );
	    return Array.from(oldParent.childNodes);
	  }
	  function saveAndRestoreFocus(ctx, fn) {
	    if (!ctx.config.restoreFocus) return fn();
	    let activeElement =
	       (
	        document.activeElement
	      );
	    if (
	      !(
	        activeElement instanceof HTMLInputElement ||
	        activeElement instanceof HTMLTextAreaElement
	      )
	    ) {
	      return fn();
	    }
	    const { id: activeElementId, selectionStart, selectionEnd } = activeElement;
	    const results = fn();
	    if (
	      activeElementId &&
	      activeElementId !== document.activeElement?.getAttribute("id")
	    ) {
	      activeElement = ctx.target.querySelector(`[id="${activeElementId}"]`);
	      activeElement?.focus();
	    }
	    if (activeElement && !activeElement.selectionEnd && selectionEnd) {
	      activeElement.setSelectionRange(selectionStart, selectionEnd);
	    }
	    return results;
	  }
	  const morphChildren = (function () {
	    function morphChildren(
	      ctx,
	      oldParent,
	      newParent,
	      insertionPoint = null,
	      endPoint = null,
	    ) {
	      if (
	        oldParent instanceof HTMLTemplateElement &&
	        newParent instanceof HTMLTemplateElement
	      ) {
	        oldParent = oldParent.content;
	        newParent = newParent.content;
	      }
	      insertionPoint ||= oldParent.firstChild;
	      for (const newChild of newParent.childNodes) {
	        if (insertionPoint && insertionPoint != endPoint) {
	          const bestMatch = findBestMatch(
	            ctx,
	            newChild,
	            insertionPoint,
	            endPoint,
	          );
	          if (bestMatch) {
	            if (bestMatch !== insertionPoint) {
	              removeNodesBetween(ctx, insertionPoint, bestMatch);
	            }
	            morphNode(bestMatch, newChild, ctx);
	            insertionPoint = bestMatch.nextSibling;
	            continue;
	          }
	        }
	        if (newChild instanceof Element) {
	          const newChildId =  (
	            newChild.getAttribute("id")
	          );
	          if (ctx.persistentIds.has(newChildId)) {
	            const movedChild = moveBeforeById(
	              oldParent,
	              newChildId,
	              insertionPoint,
	              ctx,
	            );
	            morphNode(movedChild, newChild, ctx);
	            insertionPoint = movedChild.nextSibling;
	            continue;
	          }
	        }
	        const insertedNode = createNode(
	          oldParent,
	          newChild,
	          insertionPoint,
	          ctx,
	        );
	        if (insertedNode) {
	          insertionPoint = insertedNode.nextSibling;
	        }
	      }
	      while (insertionPoint && insertionPoint != endPoint) {
	        const tempNode = insertionPoint;
	        insertionPoint = insertionPoint.nextSibling;
	        removeNode(ctx, tempNode);
	      }
	    }
	    function createNode(oldParent, newChild, insertionPoint, ctx) {
	      if (ctx.callbacks.beforeNodeAdded(newChild) === false) return null;
	      if (ctx.idMap.has(newChild)) {
	        const newEmptyChild = document.createElement(
	           (newChild).tagName,
	        );
	        oldParent.insertBefore(newEmptyChild, insertionPoint);
	        morphNode(newEmptyChild, newChild, ctx);
	        ctx.callbacks.afterNodeAdded(newEmptyChild);
	        return newEmptyChild;
	      } else {
	        const newClonedChild = document.importNode(newChild, true);
	        oldParent.insertBefore(newClonedChild, insertionPoint);
	        ctx.callbacks.afterNodeAdded(newClonedChild);
	        return newClonedChild;
	      }
	    }
	    const findBestMatch = (function () {
	      function findBestMatch(ctx, node, startPoint, endPoint) {
	        let softMatch = null;
	        let nextSibling = node.nextSibling;
	        let siblingSoftMatchCount = 0;
	        let cursor = startPoint;
	        while (cursor && cursor != endPoint) {
	          if (isSoftMatch(cursor, node)) {
	            if (isIdSetMatch(ctx, cursor, node)) {
	              return cursor;
	            }
	            if (softMatch === null) {
	              if (!ctx.idMap.has(cursor)) {
	                softMatch = cursor;
	              }
	            }
	          }
	          if (
	            softMatch === null &&
	            nextSibling &&
	            isSoftMatch(cursor, nextSibling)
	          ) {
	            siblingSoftMatchCount++;
	            nextSibling = nextSibling.nextSibling;
	            if (siblingSoftMatchCount >= 2) {
	              softMatch = undefined;
	            }
	          }
	          if (ctx.activeElementAndParents.includes(cursor)) break;
	          cursor = cursor.nextSibling;
	        }
	        return softMatch || null;
	      }
	      function isIdSetMatch(ctx, oldNode, newNode) {
	        let oldSet = ctx.idMap.get(oldNode);
	        let newSet = ctx.idMap.get(newNode);
	        if (!newSet || !oldSet) return false;
	        for (const id of oldSet) {
	          if (newSet.has(id)) {
	            return true;
	          }
	        }
	        return false;
	      }
	      function isSoftMatch(oldNode, newNode) {
	        const oldElt =  (oldNode);
	        const newElt =  (newNode);
	        return (
	          oldElt.nodeType === newElt.nodeType &&
	          oldElt.tagName === newElt.tagName &&
	          (!oldElt.getAttribute?.("id") ||
	            oldElt.getAttribute?.("id") === newElt.getAttribute?.("id"))
	        );
	      }
	      return findBestMatch;
	    })();
	    function removeNode(ctx, node) {
	      if (ctx.idMap.has(node)) {
	        moveBefore(ctx.pantry, node, null);
	      } else {
	        if (ctx.callbacks.beforeNodeRemoved(node) === false) return;
	        node.parentNode?.removeChild(node);
	        ctx.callbacks.afterNodeRemoved(node);
	      }
	    }
	    function removeNodesBetween(ctx, startInclusive, endExclusive) {
	      let cursor = startInclusive;
	      while (cursor && cursor !== endExclusive) {
	        let tempNode =  (cursor);
	        cursor = cursor.nextSibling;
	        removeNode(ctx, tempNode);
	      }
	      return cursor;
	    }
	    function moveBeforeById(parentNode, id, after, ctx) {
	      const target =
	        (
	          (ctx.target.getAttribute?.("id") === id && ctx.target) ||
	            ctx.target.querySelector(`[id="${id}"]`) ||
	            ctx.pantry.querySelector(`[id="${id}"]`)
	        );
	      removeElementFromAncestorsIdMaps(target, ctx);
	      moveBefore(parentNode, target, after);
	      return target;
	    }
	    function removeElementFromAncestorsIdMaps(element, ctx) {
	      const id =  (element.getAttribute("id"));
	      while ((element = element.parentNode)) {
	        let idSet = ctx.idMap.get(element);
	        if (idSet) {
	          idSet.delete(id);
	          if (!idSet.size) {
	            ctx.idMap.delete(element);
	          }
	        }
	      }
	    }
	    function moveBefore(parentNode, element, after) {
	      if (parentNode.moveBefore) {
	        try {
	          parentNode.moveBefore(element, after);
	        } catch (e) {
	          parentNode.insertBefore(element, after);
	        }
	      } else {
	        parentNode.insertBefore(element, after);
	      }
	    }
	    return morphChildren;
	  })();
	  const morphNode = (function () {
	    function morphNode(oldNode, newContent, ctx) {
	      if (ctx.ignoreActive && oldNode === document.activeElement) {
	        return null;
	      }
	      if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) {
	        return oldNode;
	      }
	      if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ; else if (
	        oldNode instanceof HTMLHeadElement &&
	        ctx.head.style !== "morph"
	      ) {
	        handleHeadElement(
	          oldNode,
	           (newContent),
	          ctx,
	        );
	      } else {
	        morphAttributes(oldNode, newContent, ctx);
	        if (!ignoreValueOfActiveElement(oldNode, ctx)) {
	          morphChildren(ctx, oldNode, newContent);
	        }
	      }
	      ctx.callbacks.afterNodeMorphed(oldNode, newContent);
	      return oldNode;
	    }
	    function morphAttributes(oldNode, newNode, ctx) {
	      let type = newNode.nodeType;
	      if (type === 1 ) {
	        const oldElt =  (oldNode);
	        const newElt =  (newNode);
	        const oldAttributes = oldElt.attributes;
	        const newAttributes = newElt.attributes;
	        for (const newAttribute of newAttributes) {
	          if (ignoreAttribute(newAttribute.name, oldElt, "update", ctx)) {
	            continue;
	          }
	          if (oldElt.getAttribute(newAttribute.name) !== newAttribute.value) {
	            oldElt.setAttribute(newAttribute.name, newAttribute.value);
	          }
	        }
	        for (let i = oldAttributes.length - 1; 0 <= i; i--) {
	          const oldAttribute = oldAttributes[i];
	          if (!oldAttribute) continue;
	          if (!newElt.hasAttribute(oldAttribute.name)) {
	            if (ignoreAttribute(oldAttribute.name, oldElt, "remove", ctx)) {
	              continue;
	            }
	            oldElt.removeAttribute(oldAttribute.name);
	          }
	        }
	        if (!ignoreValueOfActiveElement(oldElt, ctx)) {
	          syncInputValue(oldElt, newElt, ctx);
	        }
	      }
	      if (type === 8  || type === 3 ) {
	        if (oldNode.nodeValue !== newNode.nodeValue) {
	          oldNode.nodeValue = newNode.nodeValue;
	        }
	      }
	    }
	    function syncInputValue(oldElement, newElement, ctx) {
	      if (
	        oldElement instanceof HTMLInputElement &&
	        newElement instanceof HTMLInputElement &&
	        newElement.type !== "file"
	      ) {
	        let newValue = newElement.value;
	        let oldValue = oldElement.value;
	        syncBooleanAttribute(oldElement, newElement, "checked", ctx);
	        syncBooleanAttribute(oldElement, newElement, "disabled", ctx);
	        if (!newElement.hasAttribute("value")) {
	          if (!ignoreAttribute("value", oldElement, "remove", ctx)) {
	            oldElement.value = "";
	            oldElement.removeAttribute("value");
	          }
	        } else if (oldValue !== newValue) {
	          if (!ignoreAttribute("value", oldElement, "update", ctx)) {
	            oldElement.setAttribute("value", newValue);
	            oldElement.value = newValue;
	          }
	        }
	      } else if (
	        oldElement instanceof HTMLOptionElement &&
	        newElement instanceof HTMLOptionElement
	      ) {
	        syncBooleanAttribute(oldElement, newElement, "selected", ctx);
	      } else if (
	        oldElement instanceof HTMLTextAreaElement &&
	        newElement instanceof HTMLTextAreaElement
	      ) {
	        let newValue = newElement.value;
	        let oldValue = oldElement.value;
	        if (ignoreAttribute("value", oldElement, "update", ctx)) {
	          return;
	        }
	        if (newValue !== oldValue) {
	          oldElement.value = newValue;
	        }
	        if (
	          oldElement.firstChild &&
	          oldElement.firstChild.nodeValue !== newValue
	        ) {
	          oldElement.firstChild.nodeValue = newValue;
	        }
	      }
	    }
	    function syncBooleanAttribute(oldElement, newElement, attributeName, ctx) {
	      const newLiveValue = newElement[attributeName],
	        oldLiveValue = oldElement[attributeName];
	      if (newLiveValue !== oldLiveValue) {
	        const ignoreUpdate = ignoreAttribute(
	          attributeName,
	          oldElement,
	          "update",
	          ctx,
	        );
	        if (!ignoreUpdate) {
	          oldElement[attributeName] = newElement[attributeName];
	        }
	        if (newLiveValue) {
	          if (!ignoreUpdate) {
	            oldElement.setAttribute(attributeName, "");
	          }
	        } else {
	          if (!ignoreAttribute(attributeName, oldElement, "remove", ctx)) {
	            oldElement.removeAttribute(attributeName);
	          }
	        }
	      }
	    }
	    function ignoreAttribute(attr, element, updateType, ctx) {
	      if (
	        attr === "value" &&
	        ctx.ignoreActiveValue &&
	        element === document.activeElement
	      ) {
	        return true;
	      }
	      return (
	        ctx.callbacks.beforeAttributeUpdated(attr, element, updateType) ===
	        false
	      );
	    }
	    function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
	      return (
	        !!ctx.ignoreActiveValue &&
	        possibleActiveElement === document.activeElement &&
	        possibleActiveElement !== document.body
	      );
	    }
	    return morphNode;
	  })();
	  function withHeadBlocking(ctx, oldNode, newNode, callback) {
	    if (ctx.head.block) {
	      const oldHead = oldNode.querySelector("head");
	      const newHead = newNode.querySelector("head");
	      if (oldHead && newHead) {
	        const promises = handleHeadElement(oldHead, newHead, ctx);
	        return Promise.all(promises).then(() => {
	          const newCtx = Object.assign(ctx, {
	            head: {
	              block: false,
	              ignore: true,
	            },
	          });
	          return callback(newCtx);
	        });
	      }
	    }
	    return callback(ctx);
	  }
	  function handleHeadElement(oldHead, newHead, ctx) {
	    let added = [];
	    let removed = [];
	    let preserved = [];
	    let nodesToAppend = [];
	    let srcToNewHeadNodes = new Map();
	    for (const newHeadChild of newHead.children) {
	      srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
	    }
	    for (const currentHeadElt of oldHead.children) {
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
	        if (ctx.head.style === "append") {
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
	      let newElt =  (
	        document.createRange().createContextualFragment(newNode.outerHTML)
	          .firstChild
	      );
	      if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
	        if (
	          ("href" in newElt && newElt.href) ||
	          ("src" in newElt && newElt.src)
	        ) {
	           let resolve;
	          let promise = new Promise(function (_resolve) {
	            resolve = _resolve;
	          });
	          newElt.addEventListener("load", function () {
	            resolve();
	          });
	          promises.push(promise);
	        }
	        oldHead.appendChild(newElt);
	        ctx.callbacks.afterNodeAdded(newElt);
	        added.push(newElt);
	      }
	    }
	    for (const removedElement of removed) {
	      if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
	        oldHead.removeChild(removedElement);
	        ctx.callbacks.afterNodeRemoved(removedElement);
	      }
	    }
	    ctx.head.afterHeadMorphed(oldHead, {
	      added: added,
	      kept: preserved,
	      removed: removed,
	    });
	    return promises;
	  }
	  const createMorphContext = (function () {
	    function createMorphContext(oldNode, newContent, config) {
	      const { persistentIds, idMap } = createIdMaps(oldNode, newContent);
	      const mergedConfig = mergeDefaults(config);
	      const morphStyle = mergedConfig.morphStyle || "outerHTML";
	      if (!["innerHTML", "outerHTML"].includes(morphStyle)) {
	        throw `Do not understand how to morph style ${morphStyle}`;
	      }
	      return {
	        target: oldNode,
	        newContent: newContent,
	        config: mergedConfig,
	        morphStyle: morphStyle,
	        ignoreActive: mergedConfig.ignoreActive,
	        ignoreActiveValue: mergedConfig.ignoreActiveValue,
	        restoreFocus: mergedConfig.restoreFocus,
	        idMap: idMap,
	        persistentIds: persistentIds,
	        pantry: createPantry(),
	        activeElementAndParents: createActiveElementAndParents(oldNode),
	        callbacks: mergedConfig.callbacks,
	        head: mergedConfig.head,
	      };
	    }
	    function mergeDefaults(config) {
	      let finalConfig = Object.assign({}, defaults);
	      Object.assign(finalConfig, config);
	      finalConfig.callbacks = Object.assign(
	        {},
	        defaults.callbacks,
	        config.callbacks,
	      );
	      finalConfig.head = Object.assign({}, defaults.head, config.head);
	      return finalConfig;
	    }
	    function createPantry() {
	      const pantry = document.createElement("div");
	      pantry.hidden = true;
	      document.body.insertAdjacentElement("afterend", pantry);
	      return pantry;
	    }
	    function createActiveElementAndParents(oldNode) {
	      let activeElementAndParents = [];
	      let elt = document.activeElement;
	      if (elt?.tagName !== "BODY" && oldNode.contains(elt)) {
	        while (elt) {
	          activeElementAndParents.push(elt);
	          if (elt === oldNode) break;
	          elt = elt.parentElement;
	        }
	      }
	      return activeElementAndParents;
	    }
	    function findIdElements(root) {
	      let elements = Array.from(root.querySelectorAll("[id]"));
	      if (root.getAttribute?.("id")) {
	        elements.push(root);
	      }
	      return elements;
	    }
	    function populateIdMapWithTree(idMap, persistentIds, root, elements) {
	      for (const elt of elements) {
	        const id =  (elt.getAttribute("id"));
	        if (persistentIds.has(id)) {
	          let current = elt;
	          while (current) {
	            let idSet = idMap.get(current);
	            if (idSet == null) {
	              idSet = new Set();
	              idMap.set(current, idSet);
	            }
	            idSet.add(id);
	            if (current === root) break;
	            current = current.parentElement;
	          }
	        }
	      }
	    }
	    function createIdMaps(oldContent, newContent) {
	      const oldIdElements = findIdElements(oldContent);
	      const newIdElements = findIdElements(newContent);
	      const persistentIds = createPersistentIds(oldIdElements, newIdElements);
	      let idMap = new Map();
	      populateIdMapWithTree(idMap, persistentIds, oldContent, oldIdElements);
	      const newRoot = newContent.__idiomorphRoot || newContent;
	      populateIdMapWithTree(idMap, persistentIds, newRoot, newIdElements);
	      return { persistentIds, idMap };
	    }
	    function createPersistentIds(oldIdElements, newIdElements) {
	      let duplicateIds = new Set();
	      let oldIdTagNameMap = new Map();
	      for (const { id, tagName } of oldIdElements) {
	        if (oldIdTagNameMap.has(id)) {
	          duplicateIds.add(id);
	        } else {
	          oldIdTagNameMap.set(id, tagName);
	        }
	      }
	      let persistentIds = new Set();
	      for (const { id, tagName } of newIdElements) {
	        if (persistentIds.has(id)) {
	          duplicateIds.add(id);
	        } else if (oldIdTagNameMap.get(id) === tagName) {
	          persistentIds.add(id);
	        }
	      }
	      for (const id of duplicateIds) {
	        persistentIds.delete(id);
	      }
	      return persistentIds;
	    }
	    return createMorphContext;
	  })();
	  const { normalizeElement, normalizeParent } = (function () {
	    const generatedByIdiomorph = new WeakSet();
	    function normalizeElement(content) {
	      if (content instanceof Document) {
	        return content.documentElement;
	      } else {
	        return content;
	      }
	    }
	    function normalizeParent(newContent) {
	      if (newContent == null) {
	        return document.createElement("div");
	      } else if (typeof newContent === "string") {
	        return normalizeParent(parseContent(newContent));
	      } else if (
	        generatedByIdiomorph.has( (newContent))
	      ) {
	        return  (newContent);
	      } else if (newContent instanceof Node) {
	        if (newContent.parentNode) {
	          return  (new SlicedParentNode(newContent));
	        } else {
	          const dummyParent = document.createElement("div");
	          dummyParent.append(newContent);
	          return dummyParent;
	        }
	      } else {
	        const dummyParent = document.createElement("div");
	        for (const elt of [...newContent]) {
	          dummyParent.append(elt);
	        }
	        return dummyParent;
	      }
	    }
	    class SlicedParentNode {
	      constructor(node) {
	        this.originalNode = node;
	        this.realParentNode =  (node.parentNode);
	        this.previousSibling = node.previousSibling;
	        this.nextSibling = node.nextSibling;
	      }
	      get childNodes() {
	        const nodes = [];
	        let cursor = this.previousSibling
	          ? this.previousSibling.nextSibling
	          : this.realParentNode.firstChild;
	        while (cursor && cursor != this.nextSibling) {
	          nodes.push(cursor);
	          cursor = cursor.nextSibling;
	        }
	        return nodes;
	      }
	      querySelectorAll(selector) {
	        return this.childNodes.reduce((results, node) => {
	          if (node instanceof Element) {
	            if (node.matches(selector)) results.push(node);
	            const nodeList = node.querySelectorAll(selector);
	            for (let i = 0; i < nodeList.length; i++) {
	              results.push(nodeList[i]);
	            }
	          }
	          return results;
	        },  ([]));
	      }
	      insertBefore(node, referenceNode) {
	        return this.realParentNode.insertBefore(node, referenceNode);
	      }
	      moveBefore(node, referenceNode) {
	        return this.realParentNode.moveBefore(node, referenceNode);
	      }
	      get __idiomorphRoot() {
	        return this.originalNode;
	      }
	    }
	    function parseContent(newContent) {
	      let parser = new DOMParser();
	      let contentWithSvgsRemoved = newContent.replace(
	        /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
	        "",
	      );
	      if (
	        contentWithSvgsRemoved.match(/<\/html>/) ||
	        contentWithSvgsRemoved.match(/<\/head>/) ||
	        contentWithSvgsRemoved.match(/<\/body>/)
	      ) {
	        let content = parser.parseFromString(newContent, "text/html");
	        if (contentWithSvgsRemoved.match(/<\/html>/)) {
	          generatedByIdiomorph.add(content);
	          return content;
	        } else {
	          let htmlElement = content.firstChild;
	          if (htmlElement) {
	            generatedByIdiomorph.add(htmlElement);
	          }
	          return htmlElement;
	        }
	      } else {
	        let responseDoc = parser.parseFromString(
	          "<body><template>" + newContent + "</template></body>",
	          "text/html",
	        );
	        let content =  (
	          responseDoc.body.querySelector("template")
	        ).content;
	        generatedByIdiomorph.add(content);
	        return content;
	      }
	    }
	    return { normalizeElement, normalizeParent };
	  })();
	  return {
	    morph,
	    defaults,
	  };
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
	    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
	      t && (r = t);
	      var n = 0,
	        F = function () {};
	      return {
	        s: F,
	        n: function () {
	          return n >= r.length ? {
	            done: true
	          } : {
	            done: false,
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
	    a = true,
	    u = false;
	  return {
	    s: function () {
	      t = t.call(r);
	    },
	    n: function () {
	      var r = t.next();
	      return a = r.done, r;
	    },
	    e: function (r) {
	      u = true, o = r;
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
	      f = true,
	      o = false;
	    try {
	      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
	    } catch (r) {
	      o = true, n = r;
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

	var es_array_filter = {};

	var arraySpeciesConstructor;
	var hasRequiredArraySpeciesConstructor;
	function requireArraySpeciesConstructor () {
		if (hasRequiredArraySpeciesConstructor) return arraySpeciesConstructor;
		hasRequiredArraySpeciesConstructor = 1;
		var isArray = requireIsArray();
		var isConstructor = requireIsConstructor();
		var isObject = requireIsObject();
		var wellKnownSymbol = requireWellKnownSymbol();
		var SPECIES = wellKnownSymbol('species');
		var $Array = Array;
		arraySpeciesConstructor = function (originalArray) {
		  var C;
		  if (isArray(originalArray)) {
		    C = originalArray.constructor;
		    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
		    else if (isObject(C)) {
		      C = C[SPECIES];
		      if (C === null) C = undefined;
		    }
		  } return C === undefined ? $Array : C;
		};
		return arraySpeciesConstructor;
	}

	var arraySpeciesCreate;
	var hasRequiredArraySpeciesCreate;
	function requireArraySpeciesCreate () {
		if (hasRequiredArraySpeciesCreate) return arraySpeciesCreate;
		hasRequiredArraySpeciesCreate = 1;
		var arraySpeciesConstructor = requireArraySpeciesConstructor();
		arraySpeciesCreate = function (originalArray, length) {
		  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
		};
		return arraySpeciesCreate;
	}

	var arrayIteration;
	var hasRequiredArrayIteration;
	function requireArrayIteration () {
		if (hasRequiredArrayIteration) return arrayIteration;
		hasRequiredArrayIteration = 1;
		var bind = requireFunctionBindContext();
		var uncurryThis = requireFunctionUncurryThis();
		var IndexedObject = requireIndexedObject();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var arraySpeciesCreate = requireArraySpeciesCreate();
		var push = uncurryThis([].push);
		var createMethod = function (TYPE) {
		  var IS_MAP = TYPE === 1;
		  var IS_FILTER = TYPE === 2;
		  var IS_SOME = TYPE === 3;
		  var IS_EVERY = TYPE === 4;
		  var IS_FIND_INDEX = TYPE === 6;
		  var IS_FILTER_REJECT = TYPE === 7;
		  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
		  return function ($this, callbackfn, that, specificCreate) {
		    var O = toObject($this);
		    var self = IndexedObject(O);
		    var length = lengthOfArrayLike(self);
		    var boundFunction = bind(callbackfn, that);
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
		          case 2: push(target, value);
		        } else switch (TYPE) {
		          case 4: return false;
		          case 7: push(target, value);
		        }
		      }
		    }
		    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
		  };
		};
		arrayIteration = {
		  forEach: createMethod(0),
		  map: createMethod(1),
		  filter: createMethod(2),
		  some: createMethod(3),
		  every: createMethod(4),
		  find: createMethod(5),
		  findIndex: createMethod(6),
		  filterReject: createMethod(7)
		};
		return arrayIteration;
	}

	var hasRequiredEs_array_filter;
	function requireEs_array_filter () {
		if (hasRequiredEs_array_filter) return es_array_filter;
		hasRequiredEs_array_filter = 1;
		var $ = require_export();
		var $filter = requireArrayIteration().filter;
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();
		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  filter: function filter(callbackfn ) {
		    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_filter;
	}

	requireEs_array_filter();

	var es_array_forEach = {};

	var arrayForEach;
	var hasRequiredArrayForEach;
	function requireArrayForEach () {
		if (hasRequiredArrayForEach) return arrayForEach;
		hasRequiredArrayForEach = 1;
		var $forEach = requireArrayIteration().forEach;
		var arrayMethodIsStrict = requireArrayMethodIsStrict();
		var STRICT_METHOD = arrayMethodIsStrict('forEach');
		arrayForEach = !STRICT_METHOD ? function forEach(callbackfn ) {
		  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		} : [].forEach;
		return arrayForEach;
	}

	var hasRequiredEs_array_forEach;
	function requireEs_array_forEach () {
		if (hasRequiredEs_array_forEach) return es_array_forEach;
		hasRequiredEs_array_forEach = 1;
		var $ = require_export();
		var forEach = requireArrayForEach();
		$({ target: 'Array', proto: true, forced: [].forEach !== forEach }, {
		  forEach: forEach
		});
		return es_array_forEach;
	}

	requireEs_array_forEach();

	var es_array_includes = {};

	var hasRequiredEs_array_includes;
	function requireEs_array_includes () {
		if (hasRequiredEs_array_includes) return es_array_includes;
		hasRequiredEs_array_includes = 1;
		var $ = require_export();
		var $includes = requireArrayIncludes().includes;
		var fails = requireFails();
		var addToUnscopables = requireAddToUnscopables();
		var BROKEN_ON_SPARSE = fails(function () {
		  return !Array(1).includes();
		});
		$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
		  includes: function includes(el ) {
		    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		addToUnscopables('includes');
		return es_array_includes;
	}

	requireEs_array_includes();

	var es_array_map = {};

	var hasRequiredEs_array_map;
	function requireEs_array_map () {
		if (hasRequiredEs_array_map) return es_array_map;
		hasRequiredEs_array_map = 1;
		var $ = require_export();
		var $map = requireArrayIteration().map;
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();
		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  map: function map(callbackfn ) {
		    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_map;
	}

	requireEs_array_map();

	var es_regexp_exec = {};

	var regexpFlags;
	var hasRequiredRegexpFlags;
	function requireRegexpFlags () {
		if (hasRequiredRegexpFlags) return regexpFlags;
		hasRequiredRegexpFlags = 1;
		var anObject = requireAnObject();
		regexpFlags = function () {
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
		return regexpFlags;
	}

	var regexpStickyHelpers;
	var hasRequiredRegexpStickyHelpers;
	function requireRegexpStickyHelpers () {
		if (hasRequiredRegexpStickyHelpers) return regexpStickyHelpers;
		hasRequiredRegexpStickyHelpers = 1;
		var fails = requireFails();
		var globalThis = requireGlobalThis();
		var $RegExp = globalThis.RegExp;
		var UNSUPPORTED_Y = fails(function () {
		  var re = $RegExp('a', 'y');
		  re.lastIndex = 2;
		  return re.exec('abcd') !== null;
		});
		var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
		  return !$RegExp('a', 'y').sticky;
		});
		var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
		  var re = $RegExp('^r', 'gy');
		  re.lastIndex = 2;
		  return re.exec('str') !== null;
		});
		regexpStickyHelpers = {
		  BROKEN_CARET: BROKEN_CARET,
		  MISSED_STICKY: MISSED_STICKY,
		  UNSUPPORTED_Y: UNSUPPORTED_Y
		};
		return regexpStickyHelpers;
	}

	var regexpUnsupportedDotAll;
	var hasRequiredRegexpUnsupportedDotAll;
	function requireRegexpUnsupportedDotAll () {
		if (hasRequiredRegexpUnsupportedDotAll) return regexpUnsupportedDotAll;
		hasRequiredRegexpUnsupportedDotAll = 1;
		var fails = requireFails();
		var globalThis = requireGlobalThis();
		var $RegExp = globalThis.RegExp;
		regexpUnsupportedDotAll = fails(function () {
		  var re = $RegExp('.', 's');
		  return !(re.dotAll && re.test('\n') && re.flags === 's');
		});
		return regexpUnsupportedDotAll;
	}

	var regexpUnsupportedNcg;
	var hasRequiredRegexpUnsupportedNcg;
	function requireRegexpUnsupportedNcg () {
		if (hasRequiredRegexpUnsupportedNcg) return regexpUnsupportedNcg;
		hasRequiredRegexpUnsupportedNcg = 1;
		var fails = requireFails();
		var globalThis = requireGlobalThis();
		var $RegExp = globalThis.RegExp;
		regexpUnsupportedNcg = fails(function () {
		  var re = $RegExp('(?<a>b)', 'g');
		  return re.exec('b').groups.a !== 'b' ||
		    'b'.replace(re, '$<a>c') !== 'bc';
		});
		return regexpUnsupportedNcg;
	}

	var regexpExec;
	var hasRequiredRegexpExec;
	function requireRegexpExec () {
		if (hasRequiredRegexpExec) return regexpExec;
		hasRequiredRegexpExec = 1;
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var regexpFlags = requireRegexpFlags();
		var stickyHelpers = requireRegexpStickyHelpers();
		var shared = requireShared();
		var create = requireObjectCreate();
		var getInternalState = requireInternalState().get;
		var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
		var UNSUPPORTED_NCG = requireRegexpUnsupportedNcg();
		var nativeReplace = shared('native-string-replace', String.prototype.replace);
		var nativeExec = RegExp.prototype.exec;
		var patchedExec = nativeExec;
		var charAt = uncurryThis(''.charAt);
		var indexOf = uncurryThis(''.indexOf);
		var replace = uncurryThis(''.replace);
		var stringSlice = uncurryThis(''.slice);
		var UPDATES_LAST_INDEX_WRONG = (function () {
		  var re1 = /a/;
		  var re2 = /b*/g;
		  call(nativeExec, re1, 'a');
		  call(nativeExec, re2, 'a');
		  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
		})();
		var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;
		var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
		var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;
		if (PATCH) {
		  patchedExec = function exec(string) {
		    var re = this;
		    var state = getInternalState(re);
		    var str = toString(string);
		    var raw = state.raw;
		    var result, reCopy, lastIndex, match, i, object, group;
		    if (raw) {
		      raw.lastIndex = re.lastIndex;
		      result = call(patchedExec, raw, str);
		      re.lastIndex = raw.lastIndex;
		      return result;
		    }
		    var groups = state.groups;
		    var sticky = UNSUPPORTED_Y && re.sticky;
		    var flags = call(regexpFlags, re);
		    var source = re.source;
		    var charsAdded = 0;
		    var strCopy = str;
		    if (sticky) {
		      flags = replace(flags, 'y', '');
		      if (indexOf(flags, 'g') === -1) {
		        flags += 'g';
		      }
		      strCopy = stringSlice(str, re.lastIndex);
		      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
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
		    match = call(nativeExec, sticky ? reCopy : re, strCopy);
		    if (sticky) {
		      if (match) {
		        match.input = stringSlice(match.input, charsAdded);
		        match[0] = stringSlice(match[0], charsAdded);
		        match.index = re.lastIndex;
		        re.lastIndex += match[0].length;
		      } else re.lastIndex = 0;
		    } else if (UPDATES_LAST_INDEX_WRONG && match) {
		      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
		    }
		    if (NPCG_INCLUDED && match && match.length > 1) {
		      call(nativeReplace, match[0], reCopy, function () {
		        for (i = 1; i < arguments.length - 2; i++) {
		          if (arguments[i] === undefined) match[i] = undefined;
		        }
		      });
		    }
		    if (match && groups) {
		      match.groups = object = create(null);
		      for (i = 0; i < groups.length; i++) {
		        group = groups[i];
		        object[group[0]] = match[group[1]];
		      }
		    }
		    return match;
		  };
		}
		regexpExec = patchedExec;
		return regexpExec;
	}

	var hasRequiredEs_regexp_exec;
	function requireEs_regexp_exec () {
		if (hasRequiredEs_regexp_exec) return es_regexp_exec;
		hasRequiredEs_regexp_exec = 1;
		var $ = require_export();
		var exec = requireRegexpExec();
		$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
		  exec: exec
		});
		return es_regexp_exec;
	}

	requireEs_regexp_exec();

	var es_string_includes = {};

	var isRegexp;
	var hasRequiredIsRegexp;
	function requireIsRegexp () {
		if (hasRequiredIsRegexp) return isRegexp;
		hasRequiredIsRegexp = 1;
		var isObject = requireIsObject();
		var classof = requireClassofRaw();
		var wellKnownSymbol = requireWellKnownSymbol();
		var MATCH = wellKnownSymbol('match');
		isRegexp = function (it) {
		  var isRegExp;
		  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
		};
		return isRegexp;
	}

	var notARegexp;
	var hasRequiredNotARegexp;
	function requireNotARegexp () {
		if (hasRequiredNotARegexp) return notARegexp;
		hasRequiredNotARegexp = 1;
		var isRegExp = requireIsRegexp();
		var $TypeError = TypeError;
		notARegexp = function (it) {
		  if (isRegExp(it)) {
		    throw new $TypeError("The method doesn't accept regular expressions");
		  } return it;
		};
		return notARegexp;
	}

	var correctIsRegexpLogic;
	var hasRequiredCorrectIsRegexpLogic;
	function requireCorrectIsRegexpLogic () {
		if (hasRequiredCorrectIsRegexpLogic) return correctIsRegexpLogic;
		hasRequiredCorrectIsRegexpLogic = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var MATCH = wellKnownSymbol('match');
		correctIsRegexpLogic = function (METHOD_NAME) {
		  var regexp = /./;
		  try {
		    '/./'[METHOD_NAME](regexp);
		  } catch (error1) {
		    try {
		      regexp[MATCH] = false;
		      return '/./'[METHOD_NAME](regexp);
		    } catch (error2) {  }
		  } return false;
		};
		return correctIsRegexpLogic;
	}

	var hasRequiredEs_string_includes;
	function requireEs_string_includes () {
		if (hasRequiredEs_string_includes) return es_string_includes;
		hasRequiredEs_string_includes = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var notARegExp = requireNotARegexp();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var toString = requireToString();
		var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
		var stringIndexOf = uncurryThis(''.indexOf);
		$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
		  includes: function includes(searchString ) {
		    return !!~stringIndexOf(
		      toString(requireObjectCoercible(this)),
		      toString(notARegExp(searchString)),
		      arguments.length > 1 ? arguments[1] : undefined
		    );
		  }
		});
		return es_string_includes;
	}

	requireEs_string_includes();

	var es_string_replace = {};

	var functionApply;
	var hasRequiredFunctionApply;
	function requireFunctionApply () {
		if (hasRequiredFunctionApply) return functionApply;
		hasRequiredFunctionApply = 1;
		var NATIVE_BIND = requireFunctionBindNative();
		var FunctionPrototype = Function.prototype;
		var apply = FunctionPrototype.apply;
		var call = FunctionPrototype.call;
		functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
		  return call.apply(apply, arguments);
		});
		return functionApply;
	}

	var fixRegexpWellKnownSymbolLogic;
	var hasRequiredFixRegexpWellKnownSymbolLogic;
	function requireFixRegexpWellKnownSymbolLogic () {
		if (hasRequiredFixRegexpWellKnownSymbolLogic) return fixRegexpWellKnownSymbolLogic;
		hasRequiredFixRegexpWellKnownSymbolLogic = 1;
		requireEs_regexp_exec();
		var call = requireFunctionCall();
		var defineBuiltIn = requireDefineBuiltIn();
		var regexpExec = requireRegexpExec();
		var fails = requireFails();
		var wellKnownSymbol = requireWellKnownSymbol();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var SPECIES = wellKnownSymbol('species');
		var RegExpPrototype = RegExp.prototype;
		fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
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
		      re.constructor[SPECIES] = function () { return re; };
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
		      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
		        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
		          return { done: true, value: call(nativeRegExpMethod, regexp, str, arg2) };
		        }
		        return { done: true, value: call(nativeMethod, str, regexp, arg2) };
		      }
		      return { done: false };
		    });
		    defineBuiltIn(String.prototype, KEY, methods[0]);
		    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
		  }
		  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
		};
		return fixRegexpWellKnownSymbolLogic;
	}

	var advanceStringIndex;
	var hasRequiredAdvanceStringIndex;
	function requireAdvanceStringIndex () {
		if (hasRequiredAdvanceStringIndex) return advanceStringIndex;
		hasRequiredAdvanceStringIndex = 1;
		var charAt = requireStringMultibyte().charAt;
		advanceStringIndex = function (S, index, unicode) {
		  return index + (unicode ? charAt(S, index).length : 1);
		};
		return advanceStringIndex;
	}

	var getSubstitution;
	var hasRequiredGetSubstitution;
	function requireGetSubstitution () {
		if (hasRequiredGetSubstitution) return getSubstitution;
		hasRequiredGetSubstitution = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toObject = requireToObject();
		var floor = Math.floor;
		var charAt = uncurryThis(''.charAt);
		var replace = uncurryThis(''.replace);
		var stringSlice = uncurryThis(''.slice);
		var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
		var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
		getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
		  var tailPos = position + matched.length;
		  var m = captures.length;
		  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
		  if (namedCaptures !== undefined) {
		    namedCaptures = toObject(namedCaptures);
		    symbols = SUBSTITUTION_SYMBOLS;
		  }
		  return replace(replacement, symbols, function (match, ch) {
		    var capture;
		    switch (charAt(ch, 0)) {
		      case '$': return '$';
		      case '&': return matched;
		      case '`': return stringSlice(str, 0, position);
		      case "'": return stringSlice(str, tailPos);
		      case '<':
		        capture = namedCaptures[stringSlice(ch, 1, -1)];
		        break;
		      default:
		        var n = +ch;
		        if (n === 0) return match;
		        if (n > m) {
		          var f = floor(n / 10);
		          if (f === 0) return match;
		          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
		          return match;
		        }
		        capture = captures[n - 1];
		    }
		    return capture === undefined ? '' : capture;
		  });
		};
		return getSubstitution;
	}

	var regexpFlagsDetection;
	var hasRequiredRegexpFlagsDetection;
	function requireRegexpFlagsDetection () {
		if (hasRequiredRegexpFlagsDetection) return regexpFlagsDetection;
		hasRequiredRegexpFlagsDetection = 1;
		var globalThis = requireGlobalThis();
		var fails = requireFails();
		var RegExp = globalThis.RegExp;
		var FLAGS_GETTER_IS_CORRECT = !fails(function () {
		  var INDICES_SUPPORT = true;
		  try {
		    RegExp('.', 'd');
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
		  var result = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call(O);
		  return result !== expected || calls !== expected;
		});
		regexpFlagsDetection = { correct: FLAGS_GETTER_IS_CORRECT };
		return regexpFlagsDetection;
	}

	var regexpGetFlags;
	var hasRequiredRegexpGetFlags;
	function requireRegexpGetFlags () {
		if (hasRequiredRegexpGetFlags) return regexpGetFlags;
		hasRequiredRegexpGetFlags = 1;
		var call = requireFunctionCall();
		var hasOwn = requireHasOwnProperty();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var regExpFlagsDetection = requireRegexpFlagsDetection();
		var regExpFlagsGetterImplementation = requireRegexpFlags();
		var RegExpPrototype = RegExp.prototype;
		regexpGetFlags = regExpFlagsDetection.correct ? function (it) {
		  return it.flags;
		} : function (it) {
		  return (!regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, 'flags'))
		    ? call(regExpFlagsGetterImplementation, it)
		    : it.flags;
		};
		return regexpGetFlags;
	}

	var regexpExecAbstract;
	var hasRequiredRegexpExecAbstract;
	function requireRegexpExecAbstract () {
		if (hasRequiredRegexpExecAbstract) return regexpExecAbstract;
		hasRequiredRegexpExecAbstract = 1;
		var call = requireFunctionCall();
		var anObject = requireAnObject();
		var isCallable = requireIsCallable();
		var classof = requireClassofRaw();
		var regexpExec = requireRegexpExec();
		var $TypeError = TypeError;
		regexpExecAbstract = function (R, S) {
		  var exec = R.exec;
		  if (isCallable(exec)) {
		    var result = call(exec, R, S);
		    if (result !== null) anObject(result);
		    return result;
		  }
		  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
		  throw new $TypeError('RegExp#exec called on incompatible receiver');
		};
		return regexpExecAbstract;
	}

	var hasRequiredEs_string_replace;
	function requireEs_string_replace () {
		if (hasRequiredEs_string_replace) return es_string_replace;
		hasRequiredEs_string_replace = 1;
		var apply = requireFunctionApply();
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var fails = requireFails();
		var anObject = requireAnObject();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var toIntegerOrInfinity = requireToIntegerOrInfinity();
		var toLength = requireToLength();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var advanceStringIndex = requireAdvanceStringIndex();
		var getMethod = requireGetMethod();
		var getSubstitution = requireGetSubstitution();
		var getRegExpFlags = requireRegexpGetFlags();
		var regExpExec = requireRegexpExecAbstract();
		var wellKnownSymbol = requireWellKnownSymbol();
		var REPLACE = wellKnownSymbol('replace');
		var max = Math.max;
		var min = Math.min;
		var concat = uncurryThis([].concat);
		var push = uncurryThis([].push);
		var stringIndexOf = uncurryThis(''.indexOf);
		var stringSlice = uncurryThis(''.slice);
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
		fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
		  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
		  return [
		    function replace(searchValue, replaceValue) {
		      var O = requireObjectCoercible(this);
		      var replacer = isObject(searchValue) ? getMethod(searchValue, REPLACE) : undefined;
		      return replacer
		        ? call(replacer, searchValue, O, replaceValue)
		        : call(nativeReplace, toString(O), searchValue, replaceValue);
		    },
		    function (string, replaceValue) {
		      var rx = anObject(this);
		      var S = toString(string);
		      if (
		        typeof replaceValue == 'string' &&
		        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
		        stringIndexOf(replaceValue, '$<') === -1
		      ) {
		        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
		        if (res.done) return res.value;
		      }
		      var functionalReplace = isCallable(replaceValue);
		      if (!functionalReplace) replaceValue = toString(replaceValue);
		      var flags = toString(getRegExpFlags(rx));
		      var global = stringIndexOf(flags, 'g') !== -1;
		      var fullUnicode;
		      if (global) {
		        fullUnicode = stringIndexOf(flags, 'u') !== -1;
		        rx.lastIndex = 0;
		      }
		      var results = [];
		      var result;
		      while (true) {
		        result = regExpExec(rx, S);
		        if (result === null) break;
		        push(results, result);
		        if (!global) break;
		        var matchStr = toString(result[0]);
		        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
		      }
		      var accumulatedResult = '';
		      var nextSourcePosition = 0;
		      for (var i = 0; i < results.length; i++) {
		        result = results[i];
		        var matched = toString(result[0]);
		        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
		        var captures = [];
		        var replacement;
		        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
		        var namedCaptures = result.groups;
		        if (functionalReplace) {
		          var replacerArgs = concat([matched], captures, position, S);
		          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
		          replacement = toString(apply(replaceValue, undefined, replacerArgs));
		        } else {
		          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
		        }
		        if (position >= nextSourcePosition) {
		          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
		          nextSourcePosition = position + matched.length;
		        }
		      }
		      return accumulatedResult + stringSlice(S, nextSourcePosition);
		    }
		  ];
		}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
		return es_string_replace;
	}

	requireEs_string_replace();

	var web_domCollections_forEach = {};

	var hasRequiredWeb_domCollections_forEach;
	function requireWeb_domCollections_forEach () {
		if (hasRequiredWeb_domCollections_forEach) return web_domCollections_forEach;
		hasRequiredWeb_domCollections_forEach = 1;
		var globalThis = requireGlobalThis();
		var DOMIterables = requireDomIterables();
		var DOMTokenListPrototype = requireDomTokenListPrototype();
		var forEach = requireArrayForEach();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var handlePrototype = function (CollectionPrototype) {
		  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
		    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
		  } catch (error) {
		    CollectionPrototype.forEach = forEach;
		  }
		};
		for (var COLLECTION_NAME in DOMIterables) {
		  if (DOMIterables[COLLECTION_NAME]) {
		    handlePrototype(globalThis[COLLECTION_NAME] && globalThis[COLLECTION_NAME].prototype);
		  }
		}
		handlePrototype(DOMTokenListPrototype);
		return web_domCollections_forEach;
	}

	requireWeb_domCollections_forEach();

	var es_array_some = {};

	var hasRequiredEs_array_some;
	function requireEs_array_some () {
		if (hasRequiredEs_array_some) return es_array_some;
		hasRequiredEs_array_some = 1;
		var $ = require_export();
		var $some = requireArrayIteration().some;
		var arrayMethodIsStrict = requireArrayMethodIsStrict();
		var STRICT_METHOD = arrayMethodIsStrict('some');
		$({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
		  some: function some(callbackfn ) {
		    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_some;
	}

	requireEs_array_some();

	var es_string_match = {};

	var hasRequiredEs_string_match;
	function requireEs_string_match () {
		if (hasRequiredEs_string_match) return es_string_match;
		hasRequiredEs_string_match = 1;
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var toLength = requireToLength();
		var toString = requireToString();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var getMethod = requireGetMethod();
		var advanceStringIndex = requireAdvanceStringIndex();
		var getRegExpFlags = requireRegexpGetFlags();
		var regExpExec = requireRegexpExecAbstract();
		var stringIndexOf = uncurryThis(''.indexOf);
		fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
		  return [
		    function match(regexp) {
		      var O = requireObjectCoercible(this);
		      var matcher = isObject(regexp) ? getMethod(regexp, MATCH) : undefined;
		      return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
		    },
		    function (string) {
		      var rx = anObject(this);
		      var S = toString(string);
		      var res = maybeCallNative(nativeMatch, rx, S);
		      if (res.done) return res.value;
		      var flags = toString(getRegExpFlags(rx));
		      if (stringIndexOf(flags, 'g') === -1) return regExpExec(rx, S);
		      var fullUnicode = stringIndexOf(flags, 'u') !== -1;
		      rx.lastIndex = 0;
		      var A = [];
		      var n = 0;
		      var result;
		      while ((result = regExpExec(rx, S)) !== null) {
		        var matchStr = toString(result[0]);
		        A[n] = matchStr;
		        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
		        n++;
		      }
		      return n === 0 ? null : A;
		    }
		  ];
		});
		return es_string_match;
	}

	requireEs_string_match();

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

	var es_array_concat = {};

	var doesNotExceedSafeInteger;
	var hasRequiredDoesNotExceedSafeInteger;
	function requireDoesNotExceedSafeInteger () {
		if (hasRequiredDoesNotExceedSafeInteger) return doesNotExceedSafeInteger;
		hasRequiredDoesNotExceedSafeInteger = 1;
		var $TypeError = TypeError;
		var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
		doesNotExceedSafeInteger = function (it) {
		  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
		  return it;
		};
		return doesNotExceedSafeInteger;
	}

	var hasRequiredEs_array_concat;
	function requireEs_array_concat () {
		if (hasRequiredEs_array_concat) return es_array_concat;
		hasRequiredEs_array_concat = 1;
		var $ = require_export();
		var fails = requireFails();
		var isArray = requireIsArray();
		var isObject = requireIsObject();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var doesNotExceedSafeInteger = requireDoesNotExceedSafeInteger();
		var createProperty = requireCreateProperty();
		var arraySpeciesCreate = requireArraySpeciesCreate();
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();
		var wellKnownSymbol = requireWellKnownSymbol();
		var V8_VERSION = requireEnvironmentV8Version();
		var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
		var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
		  var array = [];
		  array[IS_CONCAT_SPREADABLE] = false;
		  return array.concat()[0] !== array;
		});
		var isConcatSpreadable = function (O) {
		  if (!isObject(O)) return false;
		  var spreadable = O[IS_CONCAT_SPREADABLE];
		  return spreadable !== undefined ? !!spreadable : isArray(O);
		};
		var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');
		$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
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
		return es_array_concat;
	}

	requireEs_array_concat();

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

	var es_object_entries = {};

	var objectToArray;
	var hasRequiredObjectToArray;
	function requireObjectToArray () {
		if (hasRequiredObjectToArray) return objectToArray;
		hasRequiredObjectToArray = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();
		var uncurryThis = requireFunctionUncurryThis();
		var objectGetPrototypeOf = requireObjectGetPrototypeOf();
		var objectKeys = requireObjectKeys();
		var toIndexedObject = requireToIndexedObject();
		var $propertyIsEnumerable = requireObjectPropertyIsEnumerable().f;
		var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
		var push = uncurryThis([].push);
		var IE_BUG = DESCRIPTORS && fails(function () {
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
		      if (!DESCRIPTORS || (IE_WORKAROUND ? key in O : propertyIsEnumerable(O, key))) {
		        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
		      }
		    }
		    return result;
		  };
		};
		objectToArray = {
		  entries: createMethod(true),
		  values: createMethod(false)
		};
		return objectToArray;
	}

	var hasRequiredEs_object_entries;
	function requireEs_object_entries () {
		if (hasRequiredEs_object_entries) return es_object_entries;
		hasRequiredEs_object_entries = 1;
		var $ = require_export();
		var $entries = requireObjectToArray().entries;
		$({ target: 'Object', stat: true }, {
		  entries: function entries(O) {
		    return $entries(O);
		  }
		});
		return es_object_entries;
	}

	requireEs_object_entries();

	var es_object_fromEntries = {};

	var hasRequiredEs_object_fromEntries;
	function requireEs_object_fromEntries () {
		if (hasRequiredEs_object_fromEntries) return es_object_fromEntries;
		hasRequiredEs_object_fromEntries = 1;
		var $ = require_export();
		var iterate = requireIterate();
		var createProperty = requireCreateProperty();
		$({ target: 'Object', stat: true }, {
		  fromEntries: function fromEntries(iterable) {
		    var obj = {};
		    iterate(iterable, function (k, v) {
		      createProperty(obj, k, v);
		    }, { AS_ENTRIES: true });
		    return obj;
		  }
		});
		return es_object_fromEntries;
	}

	requireEs_object_fromEntries();

	var es_parseFloat = {};

	var numberParseFloat;
	var hasRequiredNumberParseFloat;
	function requireNumberParseFloat () {
		if (hasRequiredNumberParseFloat) return numberParseFloat;
		hasRequiredNumberParseFloat = 1;
		var globalThis = requireGlobalThis();
		var fails = requireFails();
		var uncurryThis = requireFunctionUncurryThis();
		var toString = requireToString();
		var trim = requireStringTrim().trim;
		var whitespaces = requireWhitespaces();
		var charAt = uncurryThis(''.charAt);
		var $parseFloat = globalThis.parseFloat;
		var Symbol = globalThis.Symbol;
		var ITERATOR = Symbol && Symbol.iterator;
		var FORCED = 1 / $parseFloat(whitespaces + '-0') !== -Infinity
		  || (ITERATOR && !fails(function () { $parseFloat(Object(ITERATOR)); }));
		numberParseFloat = FORCED ? function parseFloat(string) {
		  var trimmedString = trim(toString(string));
		  var result = $parseFloat(trimmedString);
		  return result === 0 && charAt(trimmedString, 0) === '-' ? -0 : result;
		} : $parseFloat;
		return numberParseFloat;
	}

	var hasRequiredEs_parseFloat;
	function requireEs_parseFloat () {
		if (hasRequiredEs_parseFloat) return es_parseFloat;
		hasRequiredEs_parseFloat = 1;
		var $ = require_export();
		var $parseFloat = requireNumberParseFloat();
		$({ global: true, forced: parseFloat !== $parseFloat }, {
		  parseFloat: $parseFloat
		});
		return es_parseFloat;
	}

	requireEs_parseFloat();

	var es_regexp_constructor = {};

	var proxyAccessor;
	var hasRequiredProxyAccessor;
	function requireProxyAccessor () {
		if (hasRequiredProxyAccessor) return proxyAccessor;
		hasRequiredProxyAccessor = 1;
		var defineProperty = requireObjectDefineProperty().f;
		proxyAccessor = function (Target, Source, key) {
		  key in Target || defineProperty(Target, key, {
		    configurable: true,
		    get: function () { return Source[key]; },
		    set: function (it) { Source[key] = it; }
		  });
		};
		return proxyAccessor;
	}

	var hasRequiredEs_regexp_constructor;
	function requireEs_regexp_constructor () {
		if (hasRequiredEs_regexp_constructor) return es_regexp_constructor;
		hasRequiredEs_regexp_constructor = 1;
		var DESCRIPTORS = requireDescriptors();
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();
		var isForced = requireIsForced();
		var inheritIfRequired = requireInheritIfRequired();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var create = requireObjectCreate();
		var getOwnPropertyNames = requireObjectGetOwnPropertyNames().f;
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var isRegExp = requireIsRegexp();
		var toString = requireToString();
		var getRegExpFlags = requireRegexpGetFlags();
		var stickyHelpers = requireRegexpStickyHelpers();
		var proxyAccessor = requireProxyAccessor();
		var defineBuiltIn = requireDefineBuiltIn();
		var fails = requireFails();
		var hasOwn = requireHasOwnProperty();
		var enforceInternalState = requireInternalState().enforce;
		var setSpecies = requireSetSpecies();
		var wellKnownSymbol = requireWellKnownSymbol();
		var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
		var UNSUPPORTED_NCG = requireRegexpUnsupportedNcg();
		var MATCH = wellKnownSymbol('match');
		var NativeRegExp = globalThis.RegExp;
		var RegExpPrototype = NativeRegExp.prototype;
		var SyntaxError = globalThis.SyntaxError;
		var exec = uncurryThis(RegExpPrototype.exec);
		var charAt = uncurryThis(''.charAt);
		var replace = uncurryThis(''.replace);
		var stringIndexOf = uncurryThis(''.indexOf);
		var stringSlice = uncurryThis(''.slice);
		var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
		var re1 = /a/g;
		var re2 = /a/g;
		var CORRECT_NEW = new NativeRegExp(re1) !== re1;
		var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
		var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
		var BASE_FORCED = DESCRIPTORS &&
		  (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function () {
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
		  var names = create(null);
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
		        if (stringSlice(string, index + 1, index + 3) === '?:') {
		          continue;
		        }
		        if (exec(IS_NCG, stringSlice(string, index + 1))) {
		          index += 2;
		          ncg = true;
		        }
		        groupid++;
		        continue;
		      case chr === '>' && ncg:
		        if (groupname === '' || hasOwn(names, groupname)) {
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
		if (isForced('RegExp', BASE_FORCED)) {
		  var RegExpWrapper = function RegExp(pattern, flags) {
		    var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
		    var patternIsRegExp = isRegExp(pattern);
		    var flagsAreUndefined = flags === undefined;
		    var groups = [];
		    var rawPattern = pattern;
		    var rawFlags, dotAll, sticky, handled, result, state;
		    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
		      return pattern;
		    }
		    if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
		      pattern = pattern.source;
		      if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
		    }
		    pattern = pattern === undefined ? '' : toString(pattern);
		    flags = flags === undefined ? '' : toString(flags);
		    rawPattern = pattern;
		    if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
		      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
		      if (dotAll) flags = replace(flags, /s/g, '');
		    }
		    rawFlags = flags;
		    if (MISSED_STICKY && 'sticky' in re1) {
		      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
		      if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, '');
		    }
		    if (UNSUPPORTED_NCG) {
		      handled = handleNCG(pattern);
		      pattern = handled[0];
		      groups = handled[1];
		    }
		    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
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
		  RegExpPrototype.constructor = RegExpWrapper;
		  RegExpWrapper.prototype = RegExpPrototype;
		  defineBuiltIn(globalThis, 'RegExp', RegExpWrapper, { constructor: true });
		}
		setSpecies('RegExp');
		return es_regexp_constructor;
	}

	requireEs_regexp_constructor();

	var es_regexp_toString = {};

	var hasRequiredEs_regexp_toString;
	function requireEs_regexp_toString () {
		if (hasRequiredEs_regexp_toString) return es_regexp_toString;
		hasRequiredEs_regexp_toString = 1;
		var PROPER_FUNCTION_NAME = requireFunctionName().PROPER;
		var defineBuiltIn = requireDefineBuiltIn();
		var anObject = requireAnObject();
		var $toString = requireToString();
		var fails = requireFails();
		var getRegExpFlags = requireRegexpGetFlags();
		var TO_STRING = 'toString';
		var RegExpPrototype = RegExp.prototype;
		var nativeToString = RegExpPrototype[TO_STRING];
		var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) !== '/a/b'; });
		var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name !== TO_STRING;
		if (NOT_GENERIC || INCORRECT_NAME) {
		  defineBuiltIn(RegExpPrototype, TO_STRING, function toString() {
		    var R = anObject(this);
		    var pattern = $toString(R.source);
		    var flags = $toString(getRegExpFlags(R));
		    return '/' + pattern + '/' + flags;
		  }, { unsafe: true });
		}
		return es_regexp_toString;
	}

	requireEs_regexp_toString();

	var es_string_endsWith = {};

	var hasRequiredEs_string_endsWith;
	function requireEs_string_endsWith () {
		if (hasRequiredEs_string_endsWith) return es_string_endsWith;
		hasRequiredEs_string_endsWith = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThisClause();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var toLength = requireToLength();
		var toString = requireToString();
		var notARegExp = requireNotARegexp();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
		var IS_PURE = requireIsPure();
		var slice = uncurryThis(''.slice);
		var min = Math.min;
		var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
		var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
		  var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
		  return descriptor && !descriptor.writable;
		}();
		$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
		  endsWith: function endsWith(searchString ) {
		    var that = toString(requireObjectCoercible(this));
		    notARegExp(searchString);
		    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
		    var len = that.length;
		    var end = endPosition === undefined ? len : min(toLength(endPosition), len);
		    var search = toString(searchString);
		    return slice(that, end - search.length, end) === search;
		  }
		});
		return es_string_endsWith;
	}

	requireEs_string_endsWith();

	var es_string_split = {};

	var aConstructor;
	var hasRequiredAConstructor;
	function requireAConstructor () {
		if (hasRequiredAConstructor) return aConstructor;
		hasRequiredAConstructor = 1;
		var isConstructor = requireIsConstructor();
		var tryToString = requireTryToString();
		var $TypeError = TypeError;
		aConstructor = function (argument) {
		  if (isConstructor(argument)) return argument;
		  throw new $TypeError(tryToString(argument) + ' is not a constructor');
		};
		return aConstructor;
	}

	var speciesConstructor;
	var hasRequiredSpeciesConstructor;
	function requireSpeciesConstructor () {
		if (hasRequiredSpeciesConstructor) return speciesConstructor;
		hasRequiredSpeciesConstructor = 1;
		var anObject = requireAnObject();
		var aConstructor = requireAConstructor();
		var isNullOrUndefined = requireIsNullOrUndefined();
		var wellKnownSymbol = requireWellKnownSymbol();
		var SPECIES = wellKnownSymbol('species');
		speciesConstructor = function (O, defaultConstructor) {
		  var C = anObject(O).constructor;
		  var S;
		  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
		};
		return speciesConstructor;
	}

	var hasRequiredEs_string_split;
	function requireEs_string_split () {
		if (hasRequiredEs_string_split) return es_string_split;
		hasRequiredEs_string_split = 1;
		var call = requireFunctionCall();
		var uncurryThis = requireFunctionUncurryThis();
		var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var speciesConstructor = requireSpeciesConstructor();
		var advanceStringIndex = requireAdvanceStringIndex();
		var toLength = requireToLength();
		var toString = requireToString();
		var getMethod = requireGetMethod();
		var regExpExec = requireRegexpExecAbstract();
		var stickyHelpers = requireRegexpStickyHelpers();
		var fails = requireFails();
		var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
		var MAX_UINT32 = 0xFFFFFFFF;
		var min = Math.min;
		var push = uncurryThis([].push);
		var stringSlice = uncurryThis(''.slice);
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
		fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
		  var internalSplit = '0'.split(undefined, 0).length ? function (separator, limit) {
		    return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
		  } : nativeSplit;
		  return [
		    function split(separator, limit) {
		      var O = requireObjectCoercible(this);
		      var splitter = isObject(separator) ? getMethod(separator, SPLIT) : undefined;
		      return splitter
		        ? call(splitter, separator, O, limit)
		        : call(internalSplit, toString(O), separator, limit);
		    },
		    function (string, limit) {
		      var rx = anObject(this);
		      var S = toString(string);
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
		      if (S.length === 0) return regExpExec(splitter, S) === null ? [S] : [];
		      var p = 0;
		      var q = 0;
		      var A = [];
		      while (q < S.length) {
		        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
		        var z = regExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
		        var e;
		        if (
		          z === null ||
		          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
		        ) {
		          q = advanceStringIndex(S, q, unicodeMatching);
		        } else {
		          push(A, stringSlice(S, p, q));
		          if (A.length === lim) return A;
		          for (var i = 1; i <= z.length - 1; i++) {
		            push(A, z[i]);
		            if (A.length === lim) return A;
		          }
		          q = p = e;
		        }
		      }
		      push(A, stringSlice(S, p));
		      return A;
		    }
		  ];
		}, BUGGY || !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);
		return es_string_split;
	}

	requireEs_string_split();

	var es_string_startsWith = {};

	var hasRequiredEs_string_startsWith;
	function requireEs_string_startsWith () {
		if (hasRequiredEs_string_startsWith) return es_string_startsWith;
		hasRequiredEs_string_startsWith = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThisClause();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var toLength = requireToLength();
		var toString = requireToString();
		var notARegExp = requireNotARegexp();
		var requireObjectCoercible = requireRequireObjectCoercible();
		var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
		var IS_PURE = requireIsPure();
		var stringSlice = uncurryThis(''.slice);
		var min = Math.min;
		var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
		var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
		  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
		  return descriptor && !descriptor.writable;
		}();
		$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
		  startsWith: function startsWith(searchString ) {
		    var that = toString(requireObjectCoercible(this));
		    notARegExp(searchString);
		    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
		    var search = toString(searchString);
		    return stringSlice(that, index, index + search.length) === search;
		  }
		});
		return es_string_startsWith;
	}

	requireEs_string_startsWith();

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

	var es_symbol_iterator = {};

	var path;
	var hasRequiredPath;
	function requirePath () {
		if (hasRequiredPath) return path;
		hasRequiredPath = 1;
		var globalThis = requireGlobalThis();
		path = globalThis;
		return path;
	}

	var wellKnownSymbolWrapped = {};

	var hasRequiredWellKnownSymbolWrapped;
	function requireWellKnownSymbolWrapped () {
		if (hasRequiredWellKnownSymbolWrapped) return wellKnownSymbolWrapped;
		hasRequiredWellKnownSymbolWrapped = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		wellKnownSymbolWrapped.f = wellKnownSymbol;
		return wellKnownSymbolWrapped;
	}

	var wellKnownSymbolDefine;
	var hasRequiredWellKnownSymbolDefine;
	function requireWellKnownSymbolDefine () {
		if (hasRequiredWellKnownSymbolDefine) return wellKnownSymbolDefine;
		hasRequiredWellKnownSymbolDefine = 1;
		var path = requirePath();
		var hasOwn = requireHasOwnProperty();
		var wrappedWellKnownSymbolModule = requireWellKnownSymbolWrapped();
		var defineProperty = requireObjectDefineProperty().f;
		wellKnownSymbolDefine = function (NAME) {
		  var Symbol = path.Symbol || (path.Symbol = {});
		  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
		    value: wrappedWellKnownSymbolModule.f(NAME)
		  });
		};
		return wellKnownSymbolDefine;
	}

	var hasRequiredEs_symbol_iterator;
	function requireEs_symbol_iterator () {
		if (hasRequiredEs_symbol_iterator) return es_symbol_iterator;
		hasRequiredEs_symbol_iterator = 1;
		var defineWellKnownSymbol = requireWellKnownSymbolDefine();
		defineWellKnownSymbol('iterator');
		return es_symbol_iterator;
	}

	requireEs_symbol_iterator();

	var es_array_from = {};

	var callWithSafeIterationClosing;
	var hasRequiredCallWithSafeIterationClosing;
	function requireCallWithSafeIterationClosing () {
		if (hasRequiredCallWithSafeIterationClosing) return callWithSafeIterationClosing;
		hasRequiredCallWithSafeIterationClosing = 1;
		var anObject = requireAnObject();
		var iteratorClose = requireIteratorClose();
		callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
		  try {
		    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
		  } catch (error) {
		    iteratorClose(iterator, 'throw', error);
		  }
		};
		return callWithSafeIterationClosing;
	}

	var arrayFrom;
	var hasRequiredArrayFrom;
	function requireArrayFrom () {
		if (hasRequiredArrayFrom) return arrayFrom;
		hasRequiredArrayFrom = 1;
		var bind = requireFunctionBindContext();
		var call = requireFunctionCall();
		var toObject = requireToObject();
		var callWithSafeIterationClosing = requireCallWithSafeIterationClosing();
		var isArrayIteratorMethod = requireIsArrayIteratorMethod();
		var isConstructor = requireIsConstructor();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var createProperty = requireCreateProperty();
		var getIterator = requireGetIterator();
		var getIteratorMethod = requireGetIteratorMethod();
		var $Array = Array;
		arrayFrom = function from(arrayLike ) {
		  var O = toObject(arrayLike);
		  var IS_CONSTRUCTOR = isConstructor(this);
		  var argumentsLength = arguments.length;
		  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
		  var mapping = mapfn !== undefined;
		  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
		  var iteratorMethod = getIteratorMethod(O);
		  var index = 0;
		  var length, result, step, iterator, next, value;
		  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
		    result = IS_CONSTRUCTOR ? new this() : [];
		    iterator = getIterator(O, iteratorMethod);
		    next = iterator.next;
		    for (;!(step = call(next, iterator)).done; index++) {
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
		return arrayFrom;
	}

	var hasRequiredEs_array_from;
	function requireEs_array_from () {
		if (hasRequiredEs_array_from) return es_array_from;
		hasRequiredEs_array_from = 1;
		var $ = require_export();
		var from = requireArrayFrom();
		var checkCorrectnessOfIteration = requireCheckCorrectnessOfIteration();
		var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
		  Array.from(iterable);
		});
		$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
		  from: from
		});
		return es_array_from;
	}

	requireEs_array_from();

	var es_array_join = {};

	var hasRequiredEs_array_join;
	function requireEs_array_join () {
		if (hasRequiredEs_array_join) return es_array_join;
		hasRequiredEs_array_join = 1;
		var $ = require_export();
		var uncurryThis = requireFunctionUncurryThis();
		var IndexedObject = requireIndexedObject();
		var toIndexedObject = requireToIndexedObject();
		var arrayMethodIsStrict = requireArrayMethodIsStrict();
		var nativeJoin = uncurryThis([].join);
		var ES3_STRINGS = IndexedObject !== Object;
		var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');
		$({ target: 'Array', proto: true, forced: FORCED }, {
		  join: function join(separator) {
		    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
		  }
		});
		return es_array_join;
	}

	requireEs_array_join();

	var es_object_keys = {};

	var hasRequiredEs_object_keys;
	function requireEs_object_keys () {
		if (hasRequiredEs_object_keys) return es_object_keys;
		hasRequiredEs_object_keys = 1;
		var $ = require_export();
		var toObject = requireToObject();
		var nativeKeys = requireObjectKeys();
		var fails = requireFails();
		var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });
		$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
		  keys: function keys(it) {
		    return nativeKeys(toObject(it));
		  }
		});
		return es_object_keys;
	}

	requireEs_object_keys();

	var esnext_globalThis = {};

	var es_globalThis = {};

	var hasRequiredEs_globalThis;
	function requireEs_globalThis () {
		if (hasRequiredEs_globalThis) return es_globalThis;
		hasRequiredEs_globalThis = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		$({ global: true, forced: globalThis.globalThis !== globalThis }, {
		  globalThis: globalThis
		});
		return es_globalThis;
	}

	var hasRequiredEsnext_globalThis;
	function requireEsnext_globalThis () {
		if (hasRequiredEsnext_globalThis) return esnext_globalThis;
		hasRequiredEsnext_globalThis = 1;
		requireEs_globalThis();
		return esnext_globalThis;
	}

	requireEsnext_globalThis();

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

	var es_promise = {};

	var es_promise_constructor = {};

	var environment;
	var hasRequiredEnvironment;
	function requireEnvironment () {
		if (hasRequiredEnvironment) return environment;
		hasRequiredEnvironment = 1;
		var globalThis = requireGlobalThis();
		var userAgent = requireEnvironmentUserAgent();
		var classof = requireClassofRaw();
		var userAgentStartsWith = function (string) {
		  return userAgent.slice(0, string.length) === string;
		};
		environment = (function () {
		  if (userAgentStartsWith('Bun/')) return 'BUN';
		  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
		  if (userAgentStartsWith('Deno/')) return 'DENO';
		  if (userAgentStartsWith('Node.js/')) return 'NODE';
		  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
		  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
		  if (classof(globalThis.process) === 'process') return 'NODE';
		  if (globalThis.window && globalThis.document) return 'BROWSER';
		  return 'REST';
		})();
		return environment;
	}

	var environmentIsNode;
	var hasRequiredEnvironmentIsNode;
	function requireEnvironmentIsNode () {
		if (hasRequiredEnvironmentIsNode) return environmentIsNode;
		hasRequiredEnvironmentIsNode = 1;
		var ENVIRONMENT = requireEnvironment();
		environmentIsNode = ENVIRONMENT === 'NODE';
		return environmentIsNode;
	}

	var validateArgumentsLength;
	var hasRequiredValidateArgumentsLength;
	function requireValidateArgumentsLength () {
		if (hasRequiredValidateArgumentsLength) return validateArgumentsLength;
		hasRequiredValidateArgumentsLength = 1;
		var $TypeError = TypeError;
		validateArgumentsLength = function (passed, required) {
		  if (passed < required) throw new $TypeError('Not enough arguments');
		  return passed;
		};
		return validateArgumentsLength;
	}

	var environmentIsIos;
	var hasRequiredEnvironmentIsIos;
	function requireEnvironmentIsIos () {
		if (hasRequiredEnvironmentIsIos) return environmentIsIos;
		hasRequiredEnvironmentIsIos = 1;
		var userAgent = requireEnvironmentUserAgent();
		environmentIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);
		return environmentIsIos;
	}

	var task;
	var hasRequiredTask;
	function requireTask () {
		if (hasRequiredTask) return task;
		hasRequiredTask = 1;
		var globalThis = requireGlobalThis();
		var apply = requireFunctionApply();
		var bind = requireFunctionBindContext();
		var isCallable = requireIsCallable();
		var hasOwn = requireHasOwnProperty();
		var fails = requireFails();
		var html = requireHtml();
		var arraySlice = requireArraySlice();
		var createElement = requireDocumentCreateElement();
		var validateArgumentsLength = requireValidateArgumentsLength();
		var IS_IOS = requireEnvironmentIsIos();
		var IS_NODE = requireEnvironmentIsNode();
		var set = globalThis.setImmediate;
		var clear = globalThis.clearImmediate;
		var process = globalThis.process;
		var Dispatch = globalThis.Dispatch;
		var Function = globalThis.Function;
		var MessageChannel = globalThis.MessageChannel;
		var String = globalThis.String;
		var counter = 0;
		var queue = {};
		var ONREADYSTATECHANGE = 'onreadystatechange';
		var $location, defer, channel, port;
		fails(function () {
		  $location = globalThis.location;
		});
		var run = function (id) {
		  if (hasOwn(queue, id)) {
		    var fn = queue[id];
		    delete queue[id];
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
		  globalThis.postMessage(String(id), $location.protocol + '//' + $location.host);
		};
		if (!set || !clear) {
		  set = function setImmediate(handler) {
		    validateArgumentsLength(arguments.length, 1);
		    var fn = isCallable(handler) ? handler : Function(handler);
		    var args = arraySlice(arguments, 1);
		    queue[++counter] = function () {
		      apply(fn, undefined, args);
		    };
		    defer(counter);
		    return counter;
		  };
		  clear = function clearImmediate(id) {
		    delete queue[id];
		  };
		  if (IS_NODE) {
		    defer = function (id) {
		      process.nextTick(runner(id));
		    };
		  } else if (Dispatch && Dispatch.now) {
		    defer = function (id) {
		      Dispatch.now(runner(id));
		    };
		  } else if (MessageChannel && !IS_IOS) {
		    channel = new MessageChannel();
		    port = channel.port2;
		    channel.port1.onmessage = eventListener;
		    defer = bind(port.postMessage, port);
		  } else if (
		    globalThis.addEventListener &&
		    isCallable(globalThis.postMessage) &&
		    !globalThis.importScripts &&
		    $location && $location.protocol !== 'file:' &&
		    !fails(globalPostMessageDefer)
		  ) {
		    defer = globalPostMessageDefer;
		    globalThis.addEventListener('message', eventListener, false);
		  } else if (ONREADYSTATECHANGE in createElement('script')) {
		    defer = function (id) {
		      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
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
		task = {
		  set: set,
		  clear: clear
		};
		return task;
	}

	var safeGetBuiltIn;
	var hasRequiredSafeGetBuiltIn;
	function requireSafeGetBuiltIn () {
		if (hasRequiredSafeGetBuiltIn) return safeGetBuiltIn;
		hasRequiredSafeGetBuiltIn = 1;
		var globalThis = requireGlobalThis();
		var DESCRIPTORS = requireDescriptors();
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		safeGetBuiltIn = function (name) {
		  if (!DESCRIPTORS) return globalThis[name];
		  var descriptor = getOwnPropertyDescriptor(globalThis, name);
		  return descriptor && descriptor.value;
		};
		return safeGetBuiltIn;
	}

	var queue;
	var hasRequiredQueue;
	function requireQueue () {
		if (hasRequiredQueue) return queue;
		hasRequiredQueue = 1;
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
		queue = Queue;
		return queue;
	}

	var environmentIsIosPebble;
	var hasRequiredEnvironmentIsIosPebble;
	function requireEnvironmentIsIosPebble () {
		if (hasRequiredEnvironmentIsIosPebble) return environmentIsIosPebble;
		hasRequiredEnvironmentIsIosPebble = 1;
		var userAgent = requireEnvironmentUserAgent();
		environmentIsIosPebble = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';
		return environmentIsIosPebble;
	}

	var environmentIsWebosWebkit;
	var hasRequiredEnvironmentIsWebosWebkit;
	function requireEnvironmentIsWebosWebkit () {
		if (hasRequiredEnvironmentIsWebosWebkit) return environmentIsWebosWebkit;
		hasRequiredEnvironmentIsWebosWebkit = 1;
		var userAgent = requireEnvironmentUserAgent();
		environmentIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);
		return environmentIsWebosWebkit;
	}

	var microtask_1;
	var hasRequiredMicrotask;
	function requireMicrotask () {
		if (hasRequiredMicrotask) return microtask_1;
		hasRequiredMicrotask = 1;
		var globalThis = requireGlobalThis();
		var safeGetBuiltIn = requireSafeGetBuiltIn();
		var bind = requireFunctionBindContext();
		var macrotask = requireTask().set;
		var Queue = requireQueue();
		var IS_IOS = requireEnvironmentIsIos();
		var IS_IOS_PEBBLE = requireEnvironmentIsIosPebble();
		var IS_WEBOS_WEBKIT = requireEnvironmentIsWebosWebkit();
		var IS_NODE = requireEnvironmentIsNode();
		var MutationObserver = globalThis.MutationObserver || globalThis.WebKitMutationObserver;
		var document = globalThis.document;
		var process = globalThis.process;
		var Promise = globalThis.Promise;
		var microtask = safeGetBuiltIn('queueMicrotask');
		var notify, toggle, node, promise, then;
		if (!microtask) {
		  var queue = new Queue();
		  var flush = function () {
		    var parent, fn;
		    if (IS_NODE && (parent = process.domain)) parent.exit();
		    while (fn = queue.get()) try {
		      fn();
		    } catch (error) {
		      if (queue.head) notify();
		      throw error;
		    }
		    if (parent) parent.enter();
		  };
		  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
		    toggle = true;
		    node = document.createTextNode('');
		    new MutationObserver(flush).observe(node, { characterData: true });
		    notify = function () {
		      node.data = toggle = !toggle;
		    };
		  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
		    promise = Promise.resolve(undefined);
		    promise.constructor = Promise;
		    then = bind(promise.then, promise);
		    notify = function () {
		      then(flush);
		    };
		  } else if (IS_NODE) {
		    notify = function () {
		      process.nextTick(flush);
		    };
		  } else {
		    macrotask = bind(macrotask, globalThis);
		    notify = function () {
		      macrotask(flush);
		    };
		  }
		  microtask = function (fn) {
		    if (!queue.head) notify();
		    queue.add(fn);
		  };
		}
		microtask_1 = microtask;
		return microtask_1;
	}

	var hostReportErrors;
	var hasRequiredHostReportErrors;
	function requireHostReportErrors () {
		if (hasRequiredHostReportErrors) return hostReportErrors;
		hasRequiredHostReportErrors = 1;
		hostReportErrors = function (a, b) {
		  try {
		    arguments.length === 1 ? console.error(a) : console.error(a, b);
		  } catch (error) {  }
		};
		return hostReportErrors;
	}

	var perform;
	var hasRequiredPerform;
	function requirePerform () {
		if (hasRequiredPerform) return perform;
		hasRequiredPerform = 1;
		perform = function (exec) {
		  try {
		    return { error: false, value: exec() };
		  } catch (error) {
		    return { error: true, value: error };
		  }
		};
		return perform;
	}

	var promiseNativeConstructor;
	var hasRequiredPromiseNativeConstructor;
	function requirePromiseNativeConstructor () {
		if (hasRequiredPromiseNativeConstructor) return promiseNativeConstructor;
		hasRequiredPromiseNativeConstructor = 1;
		var globalThis = requireGlobalThis();
		promiseNativeConstructor = globalThis.Promise;
		return promiseNativeConstructor;
	}

	var promiseConstructorDetection;
	var hasRequiredPromiseConstructorDetection;
	function requirePromiseConstructorDetection () {
		if (hasRequiredPromiseConstructorDetection) return promiseConstructorDetection;
		hasRequiredPromiseConstructorDetection = 1;
		var globalThis = requireGlobalThis();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var isCallable = requireIsCallable();
		var isForced = requireIsForced();
		var inspectSource = requireInspectSource();
		var wellKnownSymbol = requireWellKnownSymbol();
		var ENVIRONMENT = requireEnvironment();
		var IS_PURE = requireIsPure();
		var V8_VERSION = requireEnvironmentV8Version();
		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
		var SPECIES = wellKnownSymbol('species');
		var SUBCLASSING = false;
		var NATIVE_PROMISE_REJECTION_EVENT = isCallable(globalThis.PromiseRejectionEvent);
		var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
		  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
		  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
		  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
		  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
		  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
		    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
		    var FakePromise = function (exec) {
		      exec(function () {  }, function () {  });
		    };
		    var constructor = promise.constructor = {};
		    constructor[SPECIES] = FakePromise;
		    SUBCLASSING = promise.then(function () {  }) instanceof FakePromise;
		    if (!SUBCLASSING) return true;
		  } return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT;
		});
		promiseConstructorDetection = {
		  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
		  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
		  SUBCLASSING: SUBCLASSING
		};
		return promiseConstructorDetection;
	}

	var newPromiseCapability = {};

	var hasRequiredNewPromiseCapability;
	function requireNewPromiseCapability () {
		if (hasRequiredNewPromiseCapability) return newPromiseCapability;
		hasRequiredNewPromiseCapability = 1;
		var aCallable = requireACallable();
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
		newPromiseCapability.f = function (C) {
		  return new PromiseCapability(C);
		};
		return newPromiseCapability;
	}

	var hasRequiredEs_promise_constructor;
	function requireEs_promise_constructor () {
		if (hasRequiredEs_promise_constructor) return es_promise_constructor;
		hasRequiredEs_promise_constructor = 1;
		var $ = require_export();
		var IS_PURE = requireIsPure();
		var IS_NODE = requireEnvironmentIsNode();
		var globalThis = requireGlobalThis();
		var path = requirePath();
		var call = requireFunctionCall();
		var defineBuiltIn = requireDefineBuiltIn();
		var setPrototypeOf = requireObjectSetPrototypeOf();
		var setToStringTag = requireSetToStringTag();
		var setSpecies = requireSetSpecies();
		var aCallable = requireACallable();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var anInstance = requireAnInstance();
		var speciesConstructor = requireSpeciesConstructor();
		var task = requireTask().set;
		var microtask = requireMicrotask();
		var hostReportErrors = requireHostReportErrors();
		var perform = requirePerform();
		var Queue = requireQueue();
		var InternalStateModule = requireInternalState();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var PromiseConstructorDetection = requirePromiseConstructorDetection();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var PROMISE = 'Promise';
		var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
		var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
		var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
		var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
		var setInternalState = InternalStateModule.set;
		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
		var PromiseConstructor = NativePromiseConstructor;
		var PromisePrototype = NativePromisePrototype;
		var TypeError = globalThis.TypeError;
		var document = globalThis.document;
		var process = globalThis.process;
		var newPromiseCapability = newPromiseCapabilityModule.f;
		var newGenericPromiseCapability = newPromiseCapability;
		var DISPATCH_EVENT = !!(document && document.createEvent && globalThis.dispatchEvent);
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
		        reject(new TypeError('Promise-chain cycle'));
		      } else if (then = isThenable(result)) {
		        call(then, result, resolve, reject);
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
		  microtask(function () {
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
		    event = document.createEvent('Event');
		    event.promise = promise;
		    event.reason = reason;
		    event.initEvent(name, false, true);
		    globalThis.dispatchEvent(event);
		  } else event = { promise: promise, reason: reason };
		  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis['on' + name])) handler(event);
		  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
		};
		var onUnhandled = function (state) {
		  call(task, globalThis, function () {
		    var promise = state.facade;
		    var value = state.value;
		    var IS_UNHANDLED = isUnhandled(state);
		    var result;
		    if (IS_UNHANDLED) {
		      result = perform(function () {
		        if (IS_NODE) {
		          process.emit('unhandledRejection', value, promise);
		        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
		      });
		      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
		      if (result.error) throw result.value;
		    }
		  });
		};
		var isUnhandled = function (state) {
		  return state.rejection !== HANDLED && !state.parent;
		};
		var onHandleUnhandled = function (state) {
		  call(task, globalThis, function () {
		    var promise = state.facade;
		    if (IS_NODE) {
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
		    if (state.facade === value) throw new TypeError("Promise can't be resolved itself");
		    var then = isThenable(value);
		    if (then) {
		      microtask(function () {
		        var wrapper = { done: false };
		        try {
		          call(then, value,
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
		if (FORCED_PROMISE_CONSTRUCTOR) {
		  PromiseConstructor = function Promise(executor) {
		    anInstance(this, PromisePrototype);
		    aCallable(executor);
		    call(Internal, this);
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
		      reactions: new Queue(),
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
		    reaction.domain = IS_NODE ? process.domain : undefined;
		    if (state.state === PENDING) state.reactions.add(reaction);
		    else microtask(function () {
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
		  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
		    return C === PromiseConstructor || C === PromiseWrapper
		      ? new OwnPromiseCapability(C)
		      : newGenericPromiseCapability(C);
		  };
		  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
		    nativeThen = NativePromisePrototype.then;
		    if (!NATIVE_PROMISE_SUBCLASSING) {
		      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
		        var that = this;
		        return new PromiseConstructor(function (resolve, reject) {
		          call(nativeThen, that, resolve, reject);
		        }).then(onFulfilled, onRejected);
		      }, { unsafe: true });
		    }
		    try {
		      delete NativePromisePrototype.constructor;
		    } catch (error) {  }
		    if (setPrototypeOf) {
		      setPrototypeOf(NativePromisePrototype, PromisePrototype);
		    }
		  }
		}
		$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
		  Promise: PromiseConstructor
		});
		PromiseWrapper = path.Promise;
		setToStringTag(PromiseConstructor, PROMISE, false, true);
		setSpecies(PROMISE);
		return es_promise_constructor;
	}

	var es_promise_all = {};

	var promiseStaticsIncorrectIteration;
	var hasRequiredPromiseStaticsIncorrectIteration;
	function requirePromiseStaticsIncorrectIteration () {
		if (hasRequiredPromiseStaticsIncorrectIteration) return promiseStaticsIncorrectIteration;
		hasRequiredPromiseStaticsIncorrectIteration = 1;
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var checkCorrectnessOfIteration = requireCheckCorrectnessOfIteration();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
		promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
		  NativePromiseConstructor.all(iterable).then(undefined, function () {  });
		});
		return promiseStaticsIncorrectIteration;
	}

	var hasRequiredEs_promise_all;
	function requireEs_promise_all () {
		if (hasRequiredEs_promise_all) return es_promise_all;
		hasRequiredEs_promise_all = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var perform = requirePerform();
		var iterate = requireIterate();
		var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();
		$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
		  all: function all(iterable) {
		    var C = this;
		    var capability = newPromiseCapabilityModule.f(C);
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
		        call($promiseResolve, C, promise).then(function (value) {
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
		return es_promise_all;
	}

	var es_promise_catch = {};

	var hasRequiredEs_promise_catch;
	function requireEs_promise_catch () {
		if (hasRequiredEs_promise_catch) return es_promise_catch;
		hasRequiredEs_promise_catch = 1;
		var $ = require_export();
		var IS_PURE = requireIsPure();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var getBuiltIn = requireGetBuiltIn();
		var isCallable = requireIsCallable();
		var defineBuiltIn = requireDefineBuiltIn();
		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
		$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
		  'catch': function (onRejected) {
		    return this.then(undefined, onRejected);
		  }
		});
		if (!IS_PURE && isCallable(NativePromiseConstructor)) {
		  var method = getBuiltIn('Promise').prototype['catch'];
		  if (NativePromisePrototype['catch'] !== method) {
		    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
		  }
		}
		return es_promise_catch;
	}

	var es_promise_race = {};

	var hasRequiredEs_promise_race;
	function requireEs_promise_race () {
		if (hasRequiredEs_promise_race) return es_promise_race;
		hasRequiredEs_promise_race = 1;
		var $ = require_export();
		var call = requireFunctionCall();
		var aCallable = requireACallable();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var perform = requirePerform();
		var iterate = requireIterate();
		var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();
		$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
		  race: function race(iterable) {
		    var C = this;
		    var capability = newPromiseCapabilityModule.f(C);
		    var reject = capability.reject;
		    var result = perform(function () {
		      var $promiseResolve = aCallable(C.resolve);
		      iterate(iterable, function (promise) {
		        call($promiseResolve, C, promise).then(capability.resolve, reject);
		      });
		    });
		    if (result.error) reject(result.value);
		    return capability.promise;
		  }
		});
		return es_promise_race;
	}

	var es_promise_reject = {};

	var hasRequiredEs_promise_reject;
	function requireEs_promise_reject () {
		if (hasRequiredEs_promise_reject) return es_promise_reject;
		hasRequiredEs_promise_reject = 1;
		var $ = require_export();
		var newPromiseCapabilityModule = requireNewPromiseCapability();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
		$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
		  reject: function reject(r) {
		    var capability = newPromiseCapabilityModule.f(this);
		    var capabilityReject = capability.reject;
		    capabilityReject(r);
		    return capability.promise;
		  }
		});
		return es_promise_reject;
	}

	var es_promise_resolve = {};

	var promiseResolve;
	var hasRequiredPromiseResolve;
	function requirePromiseResolve () {
		if (hasRequiredPromiseResolve) return promiseResolve;
		hasRequiredPromiseResolve = 1;
		var anObject = requireAnObject();
		var isObject = requireIsObject();
		var newPromiseCapability = requireNewPromiseCapability();
		promiseResolve = function (C, x) {
		  anObject(C);
		  if (isObject(x) && x.constructor === C) return x;
		  var promiseCapability = newPromiseCapability.f(C);
		  var resolve = promiseCapability.resolve;
		  resolve(x);
		  return promiseCapability.promise;
		};
		return promiseResolve;
	}

	var hasRequiredEs_promise_resolve;
	function requireEs_promise_resolve () {
		if (hasRequiredEs_promise_resolve) return es_promise_resolve;
		hasRequiredEs_promise_resolve = 1;
		var $ = require_export();
		var getBuiltIn = requireGetBuiltIn();
		var IS_PURE = requireIsPure();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
		var promiseResolve = requirePromiseResolve();
		var PromiseConstructorWrapper = getBuiltIn('Promise');
		var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;
		$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
		  resolve: function resolve(x) {
		    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
		  }
		});
		return es_promise_resolve;
	}

	var hasRequiredEs_promise;
	function requireEs_promise () {
		if (hasRequiredEs_promise) return es_promise;
		hasRequiredEs_promise = 1;
		requireEs_promise_constructor();
		requireEs_promise_all();
		requireEs_promise_catch();
		requireEs_promise_race();
		requireEs_promise_reject();
		requireEs_promise_resolve();
		return es_promise;
	}

	requireEs_promise();

	var es_promise_finally = {};

	var hasRequiredEs_promise_finally;
	function requireEs_promise_finally () {
		if (hasRequiredEs_promise_finally) return es_promise_finally;
		hasRequiredEs_promise_finally = 1;
		var $ = require_export();
		var IS_PURE = requireIsPure();
		var NativePromiseConstructor = requirePromiseNativeConstructor();
		var fails = requireFails();
		var getBuiltIn = requireGetBuiltIn();
		var isCallable = requireIsCallable();
		var speciesConstructor = requireSpeciesConstructor();
		var promiseResolve = requirePromiseResolve();
		var defineBuiltIn = requireDefineBuiltIn();
		var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
		var NON_GENERIC = !!NativePromiseConstructor && fails(function () {
		  NativePromisePrototype['finally'].call({ then: function () {  } }, function () {  });
		});
		$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
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
		if (!IS_PURE && isCallable(NativePromiseConstructor)) {
		  var method = getBuiltIn('Promise').prototype['finally'];
		  if (NativePromisePrototype['finally'] !== method) {
		    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
		  }
		}
		return es_promise_finally;
	}

	requireEs_promise_finally();

	var web_timers = {};

	var web_setInterval = {};

	var schedulersFix;
	var hasRequiredSchedulersFix;
	function requireSchedulersFix () {
		if (hasRequiredSchedulersFix) return schedulersFix;
		hasRequiredSchedulersFix = 1;
		var globalThis = requireGlobalThis();
		var apply = requireFunctionApply();
		var isCallable = requireIsCallable();
		var ENVIRONMENT = requireEnvironment();
		var USER_AGENT = requireEnvironmentUserAgent();
		var arraySlice = requireArraySlice();
		var validateArgumentsLength = requireValidateArgumentsLength();
		var Function = globalThis.Function;
		var WRAP = /MSIE .\./.test(USER_AGENT) || ENVIRONMENT === 'BUN' && (function () {
		  var version = globalThis.Bun.version.split('.');
		  return version.length < 3 || version[0] === '0' && (version[1] < 3 || version[1] === '3' && version[2] === '0');
		})();
		schedulersFix = function (scheduler, hasTimeArg) {
		  var firstParamIndex = hasTimeArg ? 2 : 1;
		  return WRAP ? function (handler, timeout ) {
		    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
		    var fn = isCallable(handler) ? handler : Function(handler);
		    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
		    var callback = boundArgs ? function () {
		      apply(fn, this, params);
		    } : fn;
		    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
		  } : scheduler;
		};
		return schedulersFix;
	}

	var hasRequiredWeb_setInterval;
	function requireWeb_setInterval () {
		if (hasRequiredWeb_setInterval) return web_setInterval;
		hasRequiredWeb_setInterval = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var schedulersFix = requireSchedulersFix();
		var setInterval = schedulersFix(globalThis.setInterval, true);
		$({ global: true, bind: true, forced: globalThis.setInterval !== setInterval }, {
		  setInterval: setInterval
		});
		return web_setInterval;
	}

	var web_setTimeout = {};

	var hasRequiredWeb_setTimeout;
	function requireWeb_setTimeout () {
		if (hasRequiredWeb_setTimeout) return web_setTimeout;
		hasRequiredWeb_setTimeout = 1;
		var $ = require_export();
		var globalThis = requireGlobalThis();
		var schedulersFix = requireSchedulersFix();
		var setTimeout = schedulersFix(globalThis.setTimeout, true);
		$({ global: true, bind: true, forced: globalThis.setTimeout !== setTimeout }, {
		  setTimeout: setTimeout
		});
		return web_setTimeout;
	}

	var hasRequiredWeb_timers;
	function requireWeb_timers () {
		if (hasRequiredWeb_timers) return web_timers;
		hasRequiredWeb_timers = 1;
		requireWeb_setInterval();
		requireWeb_setTimeout();
		return web_timers;
	}

	requireWeb_timers();

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

	return AppBlock;

}));
//# sourceMappingURL=appblocks.umd.js.map
