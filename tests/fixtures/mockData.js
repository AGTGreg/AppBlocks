/**
 * Shared test fixtures for AppBlocks tests
 * All functions return fresh instances to prevent test pollution
 */

/**
 * Creates a fresh mock DOM element for AppBlock container
 */
export const createMockElement = () => {
  const el = document.createElement('div');
  el.id = 'test-app';
  return el;
};

/**
 * Creates a fresh mock template element
 * @param {string} htmlString - Optional custom template HTML
 */
export const createMockTemplate = (htmlString = '<p>{data.message}</p>') => {
  const template = document.createElement('template');
  template.innerHTML = htmlString;
  return template;
};

/**
 * Creates an empty template element
 */
export const createEmptyTemplate = () => {
  return createMockTemplate('');
};

/**
 * Creates a complete AppBlock configuration object
 * @param {object} overrides - Optional properties to override defaults
 */
export const createMockAppBlockConfig = (overrides = {}) => {
  const defaults = {
    el: createMockElement(),
    template: createMockTemplate(),
    name: 'test-app',
    data: {
      message: 'Test message',
      count: 0,
      items: ['item1', 'item2', 'item3']
    },
    methods: {},
    directives: {},
    filters: {},
    events: {}
  };

  return { ...defaults, ...overrides };
};

/**
 * Creates sample data object with realistic test values
 */
export const createMockData = () => ({
  message: 'Hello world',
  count: 42,
  isActive: true,
  items: ['item1', 'item2', 'item3'],
  user: {
    name: 'Test User',
    email: 'test@example.com'
  },
  emptyString: '',
  nullValue: null,
  undefinedValue: undefined,
  zero: 0,
  falseValue: false
});

/**
 * Creates an empty data object
 */
export const createEmptyData = () => ({});

/**
 * Helper: reset JSDOM document between tests if needed
 */
export const resetDOM = () => {
  document.body.innerHTML = '';
};

/**
 * Creates a mock directive function suitable for tests.
 * A directive in AppBlocks is a function that returns a boolean indicating
 * whether an element should be shown; this helper returns a simple function
 * that evaluates a value or a predicate and returns a boolean.
 *
 * @param {Function|any} resolver - If a function is passed it will be invoked
 *   as resolver(value) to determine truthiness; otherwise the resolver value
 *   will be evaluated using Boolean(resolver).
 * @returns {Function} directive function (value, comp) => boolean
 */
export const createMockDirective = (resolver = v => Boolean(v)) => {
  return function mockDirective(value, comp) {
    if (typeof resolver === 'function') return Boolean(resolver(value, comp));
    return Boolean(resolver);
  };
};

/**
 * Creates a configured AppBlock instance with provided data
 * @param {Object} data - Data object to populate AppBlock
 * @param {Object} overrides - Optional config overrides
 */
export const createMockAppBlockWithData = (data = {}, overrides = {}) => {
  return createMockAppBlockConfig({ data, ...overrides });
};

/**
 * Creates an element with child nodes
 */
export const createMockElementWithChildren = (count = 3, config = {}) => {
  const parent = createMockElement();
  for (let i = 0; i < count; i++) {
    const child = document.createElement('div');
    child.className = 'child';
    child.setAttribute('data-index', String(i));
    child.textContent = `Child ${i + 1}`;
    parent.appendChild(child);
  }
  return parent;
};

/**
 * Creates an element with a directive attribute
 */
export const createMockElementWithDirective = (directiveName = 'c-if', directiveValue = 'data.show') => {
  const el = createMockElement();
  el.setAttribute(directiveName, directiveValue);
  return el;
};

/**
 * Creates an element with placeholder text content
 */
export const createMockElementWithPlaceholder = (placeholder = '{data.message}') => {
  const el = createMockElement();
  el.textContent = placeholder;
  return el;
};

/**
 * Template helpers
 */
export const createTemplateWithCIf = (condition = 'data.show', content = 'Content') => {
  return createMockTemplate(`<div c-if="${condition}">${content}</div>`);
};

export const createTemplateWithCFor = (loopVar = 'item in items', itemContent = '{item}') => {
  return createMockTemplate(`<div c-for="${loopVar}">${itemContent}</div>`);
};

export const createTemplateWithPlaceholders = (placeholders = ['{data.message}']) => {
  const content = placeholders.map(p => `<span>${p}</span>`).join('');
  return createMockTemplate(`<div>${content}</div>`);
};

/**
 * Data factories
 */
export const createMockArrayData = (length = 3, factory = i => ({ id: i, name: `Item ${i + 1}` })) => {
  return Array.from({ length }, (_, i) => factory(i));
};

export const createMockNestedData = (depth = 3) => {
  let obj = { value: 'leaf' };
  for (let i = 0; i < depth; i++) obj = { nested: obj };
  return obj;
};

export const createMockFalsyData = () => ({
  undefinedVal: undefined,
  nullVal: null,
  falseVal: false,
  zero: 0,
  emptyString: '',
  emptyArray: [],
  emptyObject: {}
});

/**
 * Creates mock object data for testing c-for object iteration
 * @param {Object} obj - Object to use as data (default: simple key-value object)
 */
export const createMockObjectData = (obj = null) => {
  if (obj !== null) return obj;
  return {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
  };
};

/**
 * Creates mock nested object data
 */
export const createMockNestedObjectData = () => ({
  user1: { name: 'Alice', age: 30 },
  user2: { name: 'Bob', age: 25 },
  user3: { name: 'Carol', age: 35 }
});

/**
 * Custom extension factories
 */
export const createMockCustomDirective = (returnValue = true) => {
  return jest.fn((appInstance, node, pointers) => returnValue);
};

export const createMockCustomFilter = (transform = v => v) => {
  return jest.fn((appInstance, value) => transform(value));
};

export const createMockCustomMethod = (returnValue) => {
  return jest.fn(() => returnValue);
};

/**
 * Request mocking helpers
 */
export const createMockFetchSuccess = (data = {}) => {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });
};

export const createMockFetchError = (status = 500, message = 'Server error') => {
  return Promise.resolve({ ok: false, status, statusText: message });
};

export const setupFetchMock = (response) => {
  global.fetch = jest.fn(() => {
    if (response instanceof Promise) return response;
    return createMockFetchSuccess(response);
  });
  return global.fetch;
};

/**
 * Console spies
 */
export const createConsoleSpy = (method = 'error') => {
  return jest.spyOn(console, method).mockImplementation(() => {});
};

export const restoreConsoleSpy = (spy) => {
  if (spy && spy.mockRestore) spy.mockRestore();
};
