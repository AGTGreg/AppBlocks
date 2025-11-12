import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('asHTML filter', () => {
  afterEach(() => resetDOM());

  test('should render HTML content when using asHTML filter', () => {
    const tpl = createMockTemplate('<div>{data.content|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { content: '<strong>Bold</strong> text' }
    });
    const app = new AppBlock(config);

    const strong = app.el.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong.textContent).toBe('Bold');
  });

  test('should render plain text without asHTML filter', () => {
    const tpl = createMockTemplate('<div>{data.content}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { content: '<strong>Bold</strong> text' }
    });
    const app = new AppBlock(config);

    // Should render as escaped text, not HTML
    expect(app.el.textContent).toContain('<strong>Bold</strong>');
    const strong = app.el.querySelector('strong');
    expect(strong).toBeNull();
  });

  test('should render multiple HTML elements with asHTML', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { html: '<p>Paragraph 1</p><p>Paragraph 2</p><span>Span</span>' }
    });
    const app = new AppBlock(config);

    const paragraphs = app.el.querySelectorAll('p');
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].textContent).toBe('Paragraph 1');
    expect(paragraphs[1].textContent).toBe('Paragraph 2');

    const span = app.el.querySelector('span');
    expect(span).not.toBeNull();
    expect(span.textContent).toBe('Span');
  });

  test('should render HTML with attributes using asHTML', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { html: '<div class="test-class" id="test-id">Content</div>' }
    });
    const app = new AppBlock(config);

    const inserted = app.el.querySelector('.test-class');
    expect(inserted).not.toBeNull();
    expect(inserted.id).toBe('test-id');
    expect(inserted.textContent).toBe('Content');
  });

  test('should handle nested HTML with asHTML', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: {
        html: '<div><p><strong>Nested</strong> <em>HTML</em></p></div>'
      }
    });
    const app = new AppBlock(config);

    const strong = app.el.querySelector('strong');
    const em = app.el.querySelector('em');
    expect(strong).not.toBeNull();
    expect(em).not.toBeNull();
    expect(strong.textContent).toBe('Nested');
    expect(em.textContent).toBe('HTML');
  });

  test('should handle empty string with asHTML', () => {
    const tpl = createMockTemplate('<div id="container">{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { html: '' }
    });
    const app = new AppBlock(config);

    const container = app.el.querySelector('#container');
    expect(container.innerHTML.trim()).toBe('');
  });

  test('should handle plain text with asHTML', () => {
    const tpl = createMockTemplate('<div>{data.text|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { text: 'Just plain text' }
    });
    const app = new AppBlock(config);

    expect(app.el.textContent.trim()).toBe('Just plain text');
  });

  test('should work with asHTML in c-for loops', () => {
    const tpl = createMockTemplate(`
      <div c-for="item in data.items">
        {item.html|asHTML}
      </div>
    `);
    const config = createMockAppBlockConfig({
      template: tpl,
      data: {
        items: [
          { html: '<span class="item1">Item 1</span>' },
          { html: '<span class="item2">Item 2</span>' }
        ]
      }
    });
    const app = new AppBlock(config);

    const item1 = app.el.querySelector('.item1');
    const item2 = app.el.querySelector('.item2');
    expect(item1).not.toBeNull();
    expect(item2).not.toBeNull();
    expect(item1.textContent).toBe('Item 1');
    expect(item2.textContent).toBe('Item 2');
  });

  test('should chain filters before asHTML', () => {
    const tpl = createMockTemplate('<div>{data.tag|wrapTag|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { tag: 'content' },
      filters: {
        wrapTag: (comp, v) => `<strong>${v}</strong>`
      }
    });
    const app = new AppBlock(config);

    const strong = app.el.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong.textContent).toBe('content');
  });

  test('should handle asHTML with other filters in chain', () => {
    const tpl = createMockTemplate('<div>{data.name|uppercase|toTag|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { name: 'hello' },
      filters: {
        uppercase: (comp, v) => String(v).toUpperCase(),
        toTag: (comp, v) => `<em>${v}</em>`
      }
    });
    const app = new AppBlock(config);

    const em = app.el.querySelector('em');
    expect(em).not.toBeNull();
    expect(em.textContent).toBe('HELLO');
  });

  test('should update HTML when data changes', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { html: '<span class="original">Original</span>' }
    });
    const app = new AppBlock(config);

    let span = app.el.querySelector('.original');
    expect(span).not.toBeNull();
    expect(span.textContent).toBe('Original');

    // Update data
    app.data.html = '<span class="updated">Updated</span>';
    app.render();

    span = app.el.querySelector('.updated');
    expect(span).not.toBeNull();
    expect(span.textContent).toBe('Updated');

    // Original should be gone
    const original = app.el.querySelector('.original');
    expect(original).toBeNull();
  });

  test('should handle self-closing tags with asHTML', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { html: '<img src="test.jpg" alt="Test"><br><hr>' }
    });
    const app = new AppBlock(config);

    const img = app.el.querySelector('img');
    const br = app.el.querySelector('br');
    const hr = app.el.querySelector('hr');

    expect(img).not.toBeNull();
    expect(br).not.toBeNull();
    expect(hr).not.toBeNull();
    expect(img.getAttribute('src')).toBe('test.jpg');
  });

  test('should handle special characters in HTML with asHTML', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: { html: '<p>&lt;script&gt; &amp; special chars</p>' }
    });
    const app = new AppBlock(config);

    const p = app.el.querySelector('p');
    expect(p).not.toBeNull();
    expect(p.innerHTML).toContain('&lt;script&gt;');
  });

  test('should handle complex HTML structure with asHTML', () => {
    const tpl = createMockTemplate('<div>{data.html|asHTML}</div>');
    const config = createMockAppBlockConfig({
      template: tpl,
      data: {
        html: `
          <article>
            <h1>Title</h1>
            <p>Paragraph with <a href="#link">link</a></p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </article>
        `
      }
    });
    const app = new AppBlock(config);

    const article = app.el.querySelector('article');
    const h1 = app.el.querySelector('h1');
    const link = app.el.querySelector('a');
    const items = app.el.querySelectorAll('li');

    expect(article).not.toBeNull();
    expect(h1.textContent).toBe('Title');
    expect(link.getAttribute('href')).toBe('#link');
    expect(items.length).toBe(2);
  });
});
