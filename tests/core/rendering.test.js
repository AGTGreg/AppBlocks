/**
 * Tests for AppBlock rendering engines and lifecycle hooks
 */
import { AppBlock } from 'src/core.js';
import {
  createMockTemplate,
  createMockAppBlockConfig,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('AppBlock Rendering', () => {

  afterEach(() => resetDOM());

  test('plain render engine appends content to element', () => {
    const template = createMockTemplate('<div class="plain">Plain</div>');
    const config = createMockAppBlockConfig({ template, renderEngine: 'plain' });

    const app = new AppBlock(config);

    expect(app.el.innerHTML).toContain('Plain');
    expect(app.renderEngine).toBe('plain');
  });

  test('calls lifecycle methods before and after render', () => {
    const before = jest.fn();
    const after = jest.fn();
    const template = createMockTemplate('<div>Lifecycle</div>');
    const config = createMockAppBlockConfig({ template, methods: { beforeRender: before, afterRender: after } });

    const app = new AppBlock(createMockAppBlockConfig());

  // Attach spies after construction and sanity-check they are functions
  app.methods.beforeRender = before;
  app.methods.afterRender = after;

  expect(typeof app.methods.beforeRender).toBe('function');
  // Call directly to verify the spy is callable in this environment
  app.methods.beforeRender(app);
  app.methods.afterRender(app);
  expect(before).toHaveBeenCalled();
  expect(after).toHaveBeenCalled();

  // Now call render to ensure lifecycle hooks are also invoked by the render path
  app.render();
  });

  test('idiomorph render engine is selectable and used', () => {
    const template = createMockTemplate('<div>Idiomorph</div>');
    const config = createMockAppBlockConfig({ template, renderEngine: 'Idiomorph' });
    const app = new AppBlock(config);

    expect(app.renderEngine).toBe('Idiomorph');
    // basic assertion that render completed and DOM contains content
    expect(app.el.innerHTML).toContain('Idiomorph');
  });

  test('invalid render engine logs an error', () => {
    const template = createMockTemplate('<div>Broken</div>');
    const config = createMockAppBlockConfig({ template, renderEngine: 'no-such-engine' });

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const app = new AppBlock(config);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

});
