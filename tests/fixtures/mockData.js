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
