import { processNode } from 'src/processing.js';
import { AppBlock } from 'src/core.js';
import {
  createMockAppBlockConfig,
  createMockTemplate,
  resetDOM
} from 'tests/fixtures/mockData.js';

describe('processNode (processing pipeline)', () => {

  afterEach(() => resetDOM());

  test('removes a node when its directive returns false', () => {
    const tpl = createMockTemplate('<div><span remove-me>gone</span><span keep-me>stay</span></div>');
    const config = createMockAppBlockConfig({ template: tpl });

    // directive that removes nodes with attribute 'remove-me'
    config.directives = {
      'remove-me': (comp, node) => false,
      'keep-me': (comp, node) => true
    };

    const app = new AppBlock(config);

    // process the fragment directly
    processNode(app, app.template);

    const removed = app.template.querySelector('[remove-me]');
    const kept = app.template.querySelector('[keep-me]');

    expect(removed).toBeNull();
    expect(kept).not.toBeNull();
  });

  test('updates attribute placeholders on nodes without directives', () => {
    const tpl = createMockTemplate('<div><span id="s" title="{data.title}"></span></div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { title: 'HelloAttr' } });

    const app = new AppBlock(config);
    processNode(app, app.template);

    const el = app.template.querySelector('#s');
    expect(el.getAttribute('title')).toBe('HelloAttr');
  });

  test('processes children recursively and removes items in nested structure', () => {
    const tpl = createMockTemplate('<div id="root"><div class="item" should-remove="true">A</div><div class="item">B</div></div>');
    const config = createMockAppBlockConfig({ template: tpl });

    config.directives = {
      'should-remove': (comp, node) => {
        return node.getAttribute('should-remove') !== 'true';
      }
    };

    const app = new AppBlock(config);
    processNode(app, app.template);

    const items = app.template.querySelectorAll('.item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('B');
  });

  test('iterates children in reverse so removing a child does not skip siblings', () => {
    const tpl = createMockTemplate('<div id="root"><div class="c" v="1"></div><div class="c" v="2"></div><div class="c" v="3"></div></div>');
    const config = createMockAppBlockConfig({ template: tpl });

    // Directive removes nodes with v='2'
    config.directives = {
      'v': (comp, node) => node.getAttribute('v') !== '2'
    };

    const app = new AppBlock(config);
    processNode(app, app.template);

    const vals = Array.from(app.template.querySelectorAll('.c')).map(n => n.getAttribute('v'));
    expect(vals).toEqual(['1','3']);
  });

  test('skips updating attributes of removed nodes (removed nodes are not present)', () => {
    const tpl = createMockTemplate('<div><span remove-me title="{data.title}">X</span></div>');
    const config = createMockAppBlockConfig({ template: tpl, data: { title: 'T' } });
    config.directives = { 'remove-me': () => false };

    const app = new AppBlock(config);
    processNode(app, app.template);

    const el = app.template.querySelector('[remove-me]');
    expect(el).toBeNull();
  });

  test('processNode accepts pointers argument and uses it for attribute placeholders', () => {
    const tpl = createMockTemplate('<div><span id="p" title="{ptr.name}"></span></div>');
    const config = createMockAppBlockConfig({ template: tpl });
    const app = new AppBlock(config);

    const pointers = { ptr: { name: 'PointerValue' } };
    processNode(app, app.template, pointers);

    const el = app.template.querySelector('#p');
    expect(el.getAttribute('title')).toBe('PointerValue');
  });

});
