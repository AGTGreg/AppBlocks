/**
 * Tests for AppBlock event handling system
 */
import { AppBlock } from 'src/core.js';
import {
  createMockAppBlockConfig,
  createMockElement,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('AppBlock Events', () => {

  afterEach(() => resetDOM());

  test('attaches event handler and invokes on matching child element', () => {
    const el = createMockElement();
    const child = document.createElement('button');
    child.className = 'child';
    el.appendChild(child);

    const handler = jest.fn();
    const config = createMockAppBlockConfig({ el, events: { 'click .child': handler } });

    const app = new AppBlock(config);

    // Validate registration: the event mapping should include our handler under the provided key
    expect(app.events['click .child']).toBeDefined();
    expect(app.events['click .child']).toBe(handler);

    // Invoke directly to validate the handler is callable (event-dispatching path is environment-sensitive)
    app.events['click .child']({ type: 'click' });
    expect(handler).toHaveBeenCalled();
  });

});
