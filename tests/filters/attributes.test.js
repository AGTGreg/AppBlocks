import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('Filters in attributes', () => {
  afterEach(() => resetDOM());

  test('should apply filter in class attribute', () => {
    const tpl = createMockTemplate('<div class="{data.status|statusClass}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { status: 'active' },
      filters: {
        statusClass: (comp, v) => `status-${v}`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('status-active');
  });

  test('should apply filter in id attribute', () => {
    const tpl = createMockTemplate('<div id="{data.name|slugify}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { name: 'My Element' },
      filters: {
        slugify: (comp, v) => v.toLowerCase().replace(/\s+/g, '-')
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('id')).toBe('my-element');
  });

  test('should apply filter in style attribute', () => {
    const tpl = createMockTemplate('<div style="border: 5px solid {data.color|hexColor}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { color: 'red' },
      filters: {
        hexColor: (comp, v) => {
          const colors = { red: '#FF0000', blue: '#0000FF', green: '#00FF00' };
          return colors[v] || '#000000';
        }
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('style')).toBe('border: 5px solid #FF0000');
  });

  test('should apply filter in src attribute', () => {
    const tpl = createMockTemplate('<img src="{data.image|cdn}" alt="Test">');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { image: 'photo.jpg' },
      filters: {
        cdn: (comp, v) => `https://cdn.example.com/${v}`
      }
    });
    const app = new AppBlock(config);

    const img = app.el.querySelector('img');
    expect(img.getAttribute('src')).toBe('https://cdn.example.com/photo.jpg');
  });

  test('should apply filter in alt attribute', () => {
    const tpl = createMockTemplate('<img src="test.jpg" alt="{data.name|capitalize}">');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { name: 'my image' },
      filters: {
        capitalize: (comp, v) => v.charAt(0).toUpperCase() + v.slice(1)
      }
    });
    const app = new AppBlock(config);

    const img = app.el.querySelector('img');
    expect(img.getAttribute('alt')).toBe('My image');
  });

  test('should apply filter in href attribute', () => {
    const tpl = createMockTemplate('<a href="{data.page|urlify}">Link</a>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { page: 'about us' },
      filters: {
        urlify: (comp, v) => `/${v.replace(/\s+/g, '-').toLowerCase()}`
      }
    });
    const app = new AppBlock(config);

    const link = app.el.querySelector('a');
    expect(link.getAttribute('href')).toBe('/about-us');
  });

  test('should apply filter in data-* attributes', () => {
    const tpl = createMockTemplate('<div data-value="{data.num|double}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { num: 5 },
      filters: {
        double: (comp, v) => v * 2
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('data-value')).toBe('10');
  });

  test('should apply filter in title attribute', () => {
    const tpl = createMockTemplate('<div title="{data.tooltip|wrap}">Hover me</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { tooltip: 'info' },
      filters: {
        wrap: (comp, v) => `Tooltip: ${v}`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('title')).toBe('Tooltip: info');
  });

  test('should apply filter in value attribute', () => {
    const tpl = createMockTemplate('<input type="text" value="{data.text|trim}">');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { text: '  hello  ' },
      filters: {
        trim: (comp, v) => String(v).trim()
      }
    });
    const app = new AppBlock(config);

    const input = app.el.querySelector('input');
    expect(input.getAttribute('value')).toBe('hello');
  });

  test('should apply filter in placeholder attribute', () => {
    const tpl = createMockTemplate('<input type="text" placeholder="{data.hint|uppercase}">');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { hint: 'enter name' },
      filters: {
        uppercase: (comp, v) => String(v).toUpperCase()
      }
    });
    const app = new AppBlock(config);

    const input = app.el.querySelector('input');
    expect(input.getAttribute('placeholder')).toBe('ENTER NAME');
  });

  test('should chain filters in attributes', () => {
    const tpl = createMockTemplate('<div class="{data.status|validate|prefix}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { status: 'ok' },
      filters: {
        validate: (comp, v) => v || 'unknown',
        prefix: (comp, v) => `state-${v}`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('state-ok');
  });

  test('should apply multiple filters to different attributes on same element', () => {
    const tpl = createMockTemplate(`
      <div
        class="{data.type|typeClass}"
        id="{data.name|slugify}"
        data-count="{data.num|double}">
      </div>
    `);
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { type: 'primary', name: 'My Div', num: 10 },
      filters: {
        typeClass: (comp, v) => `type-${v}`,
        slugify: (comp, v) => v.toLowerCase().replace(/\s+/g, '-'),
        double: (comp, v) => v * 2
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('type-primary');
    expect(div.getAttribute('id')).toBe('my-div');
    expect(div.getAttribute('data-count')).toBe('20');
  });

  test('should apply filters in attributes within c-for', () => {
    const tpl = createMockTemplate(`
      <div c-for="item in data.items" class="{item.status|statusClass}">
        {item.name}
      </div>
    `);
    const config = createMockAppBlockConfig({
      template: tpl,
      data: {
        items: [
          { name: 'Item 1', status: 'active' },
          { name: 'Item 2', status: 'inactive' }
        ]
      },
      filters: {
        statusClass: (comp, v) => `item-${v}`
      }
    });
    const app = new AppBlock(config);

    const divs = app.el.querySelectorAll('div');
    expect(divs[0].getAttribute('class')).toBe('item-active');
    expect(divs[1].getAttribute('class')).toBe('item-inactive');
  });

  test('should handle mixed static and filtered content in attributes', () => {
    const tpl = createMockTemplate('<div class="base {data.extra|modifier}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { extra: 'special' },
      filters: {
        modifier: (comp, v) => `mod-${v}`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('base mod-special');
  });

  test('should apply filter to multiple placeholders in same attribute', () => {
    const tpl = createMockTemplate('<div style="width: {data.width|px}; height: {data.height|px}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { width: 100, height: 200 },
      filters: {
        px: (comp, v) => `${v}px`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('style')).toBe('width: 100px; height: 200px');
  });

  test('should update filtered attributes when data changes', () => {
    const tpl = createMockTemplate('<div class="{data.theme|themeClass}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { theme: 'light' },
      filters: {
        themeClass: (comp, v) => `theme-${v}`
      }
    });
    const app = new AppBlock(config);

    let div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('theme-light');

    // Update data
    app.data.theme = 'dark';
    app.render();

    div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('theme-dark');
  });

  test('should apply filter in aria-label attribute', () => {
    const tpl = createMockTemplate('<button aria-label="{data.action|capitalize}">Click</button>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { action: 'submit form' },
      filters: {
        capitalize: (comp, v) => v.charAt(0).toUpperCase() + v.slice(1)
      }
    });
    const app = new AppBlock(config);

    const button = app.el.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Submit form');
  });

  test('should handle filter that accesses comp.data in attribute', () => {
    const tpl = createMockTemplate('<div class="{data.base|withPrefix}"></div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { base: 'value', prefix: 'custom' },
      filters: {
        withPrefix: (comp, v) => `${comp.data.prefix}-${v}`
      }
    });
    const app = new AppBlock(config);

    const div = app.el.querySelector('div');
    expect(div.getAttribute('class')).toBe('custom-value');
  });
});
