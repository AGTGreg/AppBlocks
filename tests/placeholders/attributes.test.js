import {
  createMockAppBlockConfig,
  createMockTemplate,
  resetDOM
} from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('Placeholder Replacement - Attributes', () => {

  afterEach(() => resetDOM());

  test('should replace placeholder inside attribute value', () => {
    const template = createMockTemplate('<a href="/user/{data.id}">Link</a>');
    const config = createMockAppBlockConfig({ template, data: { id: 42 } });
    const app = new AppBlock(config);

    const anchor = app.el.querySelector('a');
    expect(anchor.getAttribute('href')).toBe('/user/42');
  });

  test('should handle attribute placeholders with missing data', () => {
    const template = createMockTemplate('<img src="/avatars/{data.avatar}">');
    const config = createMockAppBlockConfig({ template, data: {} });
    const app = new AppBlock(config);

    const img = app.el.querySelector('img');
    expect(img).toBeDefined();
  });

});
