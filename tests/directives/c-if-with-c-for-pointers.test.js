import { createMockAppBlockConfig, createMockTemplate, resetDOM } from '../fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-if and c-ifnot with c-for pointers', () => {
  afterEach(() => resetDOM());

  test('should access c-for pointer in c-if condition', () => {
    const template = createMockTemplate(`
      <ul>
        <li c-for="item in data.items">
          <span c-if="item.active">{item.name}</span>
        </li>
      </ul>
    `);

    const config = createMockAppBlockConfig({
      template,
      data: {
        items: [
          { name: 'Active Item', active: true },
          { name: 'Inactive Item', active: false },
          { name: 'Another Active', active: true }
        ]
      }
    });

    const app = new AppBlock(config);

    // Should render only items where active is true
    expect(app.el.textContent).toContain('Active Item');
    expect(app.el.textContent).toContain('Another Active');
    expect(app.el.textContent).not.toContain('Inactive Item');
  });

  test('should access c-for pointer in c-ifnot condition', () => {
    const template = createMockTemplate(`
      <ul>
        <li c-for="item in data.items">
          <span c-ifnot="item.active">{item.name}</span>
        </li>
      </ul>
    `);

    const config = createMockAppBlockConfig({
      template,
      data: {
        items: [
          { name: 'Active Item', active: true },
          { name: 'Inactive Item', active: false },
          { name: 'Another Inactive', active: false }
        ]
      }
    });

    const app = new AppBlock(config);

    // Should render only items where active is false
    expect(app.el.textContent).toContain('Inactive Item');
    expect(app.el.textContent).toContain('Another Inactive');
    expect(app.el.textContent).not.toContain('Active Item');
  });

  test('should access nested c-for pointer properties', () => {
    const template = createMockTemplate(`
      <ul>
        <li c-for="todo in data.todos">
          <input c-if="todo.done" type="checkbox" checked>
          <input c-ifnot="todo.done" type="checkbox">
          <span>{todo.text}</span>
        </li>
      </ul>
    `);

    const config = createMockAppBlockConfig({
      template,
      data: {
        todos: [
          { id: 1, text: 'Learn AppBlocks', done: false },
          { id: 2, text: 'Build an app', done: true }
        ]
      }
    });

    const app = new AppBlock(config);

    const checkboxes = app.el.querySelectorAll('input[type="checkbox"]');

    // First todo (done: false) should have unchecked checkbox
    expect(checkboxes[0].hasAttribute('checked')).toBe(false);

    // Second todo (done: true) should have checked checkbox
    expect(checkboxes[1].hasAttribute('checked')).toBe(true);
  });

  test('should handle complex expressions with c-for pointers', () => {
    const template = createMockTemplate(`
      <ul>
        <li c-for="item in data.items">
          <span c-if="item.value > 10 && item.active">High and active: {item.name}</span>
          <span c-ifnot="item.value > 10 && item.active">Other: {item.name}</span>
        </li>
      </ul>
    `);

    const config = createMockAppBlockConfig({
      template,
      data: {
        items: [
          { name: 'A', value: 15, active: true },   // Should show "High and active"
          { name: 'B', value: 5, active: true },    // Should show "Other"
          { name: 'C', value: 20, active: false }   // Should show "Other"
        ]
      }
    });

    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('High and active: A');
    expect(app.el.textContent).toContain('Other: B');
    expect(app.el.textContent).toContain('Other: C');
  });

  test('should access dual-pointer syntax in c-if', () => {
    const template = createMockTemplate(`
      <ul>
        <li c-for="key, value in data.settings">
          <span c-if="value">Enabled: {key}</span>
          <span c-ifnot="value">Disabled: {key}</span>
        </li>
      </ul>
    `);

    const config = createMockAppBlockConfig({
      template,
      data: {
        settings: {
          notifications: true,
          darkMode: false,
          autoSave: true
        }
      }
    });

    const app = new AppBlock(config);

    expect(app.el.textContent).toContain('Enabled: notifications');
    expect(app.el.textContent).toContain('Disabled: darkMode');
    expect(app.el.textContent).toContain('Enabled: autoSave');
  });

  test('should not conflict with data properties of same name', () => {
    const template = createMockTemplate(`
      <div>
        <p c-if="data.show">Global show is true</p>
        <ul>
          <li c-for="show in data.items">
            <span c-if="show">Item is truthy</span>
          </li>
        </ul>
      </div>
    `);

    const config = createMockAppBlockConfig({
      template,
      data: {
        show: true,
        items: [true, false, true]
      }
    });

    const app = new AppBlock(config);

    // Global data.show should work
    expect(app.el.textContent).toContain('Global show is true');

    // Pointer 'show' should shadow global in c-for context
    const spans = app.el.querySelectorAll('span');
    expect(spans.length).toBe(2); // Only 2 truthy items
  });
});
