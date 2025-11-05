import {
  createMockAppBlockConfig,
  createMockTemplate,
  resetDOM
} from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-ifnot directive', () => {

  afterEach(() => resetDOM());

  test('should keep node when condition is false', () => {
    const template = createMockTemplate('<div c-ifnot="data.show">Hidden</div>');
    const config = createMockAppBlockConfig({ template, data: { show: false } });
    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Hidden');
  });

  test('should remove node when condition is true', () => {
    const template = createMockTemplate('<div c-ifnot="data.show">Hidden</div>');
    const config = createMockAppBlockConfig({ template, data: { show: true } });
    const app = new AppBlock(config);

    const node = app.el.querySelector('[c-ifnot]');
    expect(node).toBeNull();
  });

});
