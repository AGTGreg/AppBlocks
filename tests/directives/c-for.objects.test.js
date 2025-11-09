import {
  createMockAppBlockConfig,
  createTemplateWithCFor,
  createMockObjectData,
  createMockNestedObjectData,
  createConsoleSpy,
  restoreConsoleSpy,
  resetDOM
} from 'tests/fixtures/mockData.js';
import { AppBlock } from 'src/core.js';

describe('c-for directive - object iteration', () => {

  afterEach(() => resetDOM());

  describe('Basic object iteration', () => {
    test('should iterate over simple object with dual pointers', () => {
      // Arrange
      const template = createTemplateWithCFor('key, value in data.settings', '{key}: {value}');
      const settings = { theme: 'dark', lang: 'en' };
      const config = createMockAppBlockConfig({ template, data: { settings } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('theme: dark');
      expect(app.el.textContent).toContain('lang: en');
    });

    test('should iterate over object with single pointer (value only)', () => {
      // Arrange
      const template = createTemplateWithCFor('value in data.colors', '{value}');
      const colors = { primary: 'blue', secondary: 'green' };
      const config = createMockAppBlockConfig({ template, data: { colors } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('blue');
      expect(app.el.textContent).toContain('green');
      expect(app.el.textContent).not.toContain('primary');
      expect(app.el.textContent).not.toContain('secondary');
    });

    test('should iterate using fixture object data', () => {
      // Arrange
      const template = createTemplateWithCFor('k, v in data.obj', '{k}={v}');
      const obj = createMockObjectData();
      const config = createMockAppBlockConfig({ template, data: { obj } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('key1=value1');
      expect(app.el.textContent).toContain('key2=value2');
      expect(app.el.textContent).toContain('key3=value3');
    });
  });

  describe('Edge cases', () => {
    test('should render nothing for empty object', () => {
      // Arrange
      const template = createTemplateWithCFor('key, value in data.empty', '{key}: {value}');
      const config = createMockAppBlockConfig({ template, data: { empty: {} } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent.trim()).toBe('');
    });

    test('should handle null object gracefully', () => {
      // Arrange
      const template = createTemplateWithCFor('key, value in data.missing', '{key}: {value}');
      const config = createMockAppBlockConfig({ template, data: { missing: null } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent.trim()).toBe('');
    });

    test('should handle undefined object gracefully', () => {
      // Arrange
      const template = createTemplateWithCFor('key, value in data.notDefined', '{key}: {value}');
      const config = createMockAppBlockConfig({ template, data: {} });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent.trim()).toBe('');
    });

    test('should iterate over object with falsy values', () => {
      // Arrange
      const template = createTemplateWithCFor('key, value in data.flags', '{key}: {value}');
      const flags = {
        zero: 0,
        empty: '',
        isFalse: false,
        isNull: null
      };
      const config = createMockAppBlockConfig({ template, data: { flags } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('zero');
      expect(app.el.textContent).toContain('empty');
      expect(app.el.textContent).toContain('isFalse');
      expect(app.el.textContent).toContain('isNull');
    });
  });

  describe('Nested object values', () => {
    test('should handle nested object values', () => {
      // Arrange
      const template = createTemplateWithCFor('key, user in data.users', '{key}: {user.name}');
      const users = createMockNestedObjectData();
      const config = createMockAppBlockConfig({ template, data: { users } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('user1: Alice');
      expect(app.el.textContent).toContain('user2: Bob');
      expect(app.el.textContent).toContain('user3: Carol');
    });

    test('should access nested properties in object values', () => {
      // Arrange
      const template = createTemplateWithCFor('id, user in data.users', '{user.name} ({user.age})');
      const users = createMockNestedObjectData();
      const config = createMockAppBlockConfig({ template, data: { users } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('Alice (30)');
      expect(app.el.textContent).toContain('Bob (25)');
      expect(app.el.textContent).toContain('Carol (35)');
    });
  });

  describe('Method calls returning objects', () => {
    test('should iterate over object returned from method', () => {
      // Arrange
      const template = createTemplateWithCFor('key, value in getConfig()', '{key}: {value}');
      const methods = {
        getConfig: (app) => ({
          apiUrl: 'https://api.example.com',
          timeout: 5000
        })
      };
      const config = createMockAppBlockConfig({ template, methods });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('apiUrl: https://api.example.com');
      expect(app.el.textContent).toContain('timeout: 5000');
    });

    test('should iterate over object from method with single pointer', () => {
      // Arrange
      const template = createTemplateWithCFor('val in getColors()', '{val}');
      const methods = {
        getColors: (app) => ({
          primary: 'red',
          secondary: 'blue'
        })
      };
      const config = createMockAppBlockConfig({ template, methods });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('red');
      expect(app.el.textContent).toContain('blue');
      expect(app.el.textContent).not.toContain('primary');
      expect(app.el.textContent).not.toContain('secondary');
    });
  });

  describe('Prototype chain handling', () => {
    test('should exclude inherited properties from iteration', () => {
      // Arrange
      function Config() {
        this.ownProp = 'own';
      }
      Config.prototype.inheritedProp = 'inherited';

      const instance = new Config();
      const template = createTemplateWithCFor('key, value in data.config', '{key}: {value}');
      const config = createMockAppBlockConfig({ template, data: { config: instance } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('ownProp: own');
      expect(app.el.textContent).not.toContain('inheritedProp');
      expect(app.el.textContent).not.toContain('inherited');
    });
  });

  describe('Nested c-for with objects', () => {
    test('should support nested c-for with object of objects', () => {
      // Arrange
      const innerDiv = '<span c-for="empId, emp in employees">{empId}: {emp.name} </span>';
      const outerDiv = `<div c-for="dept, employees in data.company">${innerDiv}</div>`;
      const template = document.createElement('template');
      template.innerHTML = outerDiv;

      const company = {
        Engineering: {
          E001: { name: 'Alice' },
          E002: { name: 'Bob' }
        },
        Sales: {
          S001: { name: 'Carol' }
        }
      };
      const config = createMockAppBlockConfig({ template, data: { company } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('E001: Alice');
      expect(app.el.textContent).toContain('E002: Bob');
      expect(app.el.textContent).toContain('S001: Carol');
    });

    test('should support nested c-for with object of arrays', () => {
      // Arrange
      const innerLi = '<li c-for="product in products">{product.name}</li>';
      const outerDiv = `<div c-for="category, products in data.catalog"><h3>{category}</h3><ul>${innerLi}</ul></div>`;
      const template = document.createElement('template');
      template.innerHTML = outerDiv;

      const catalog = {
        Electronics: [
          { name: 'Laptop' },
          { name: 'Mouse' }
        ],
        Books: [
          { name: 'JavaScript Guide' }
        ]
      };
      const config = createMockAppBlockConfig({ template, data: { catalog } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('Electronics');
      expect(app.el.textContent).toContain('Laptop');
      expect(app.el.textContent).toContain('Mouse');
      expect(app.el.textContent).toContain('Books');
      expect(app.el.textContent).toContain('JavaScript Guide');
    });
  });

  describe('Backward compatibility', () => {
    test('should not break existing array iteration with single pointer', () => {
      // Arrange
      const template = createTemplateWithCFor('item in data.items', '{item}');
      const items = ['a', 'b', 'c'];
      const config = createMockAppBlockConfig({ template, data: { items } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('a');
      expect(app.el.textContent).toContain('b');
      expect(app.el.textContent).toContain('c');
    });

    test('should not break existing array iteration with object items', () => {
      // Arrange
      const template = createTemplateWithCFor('user in data.users', '{user.name}');
      const users = [
        { name: 'Alice' },
        { name: 'Bob' }
      ];
      const config = createMockAppBlockConfig({ template, data: { users } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('Alice');
      expect(app.el.textContent).toContain('Bob');
    });

    test('should use second pointer for array items when dual pointer syntax used', () => {
      // Arrange
      const template = createTemplateWithCFor('ignored, item in data.items', '{item}');
      const items = ['x', 'y', 'z'];
      const config = createMockAppBlockConfig({ template, data: { items } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('x');
      expect(app.el.textContent).toContain('y');
      expect(app.el.textContent).toContain('z');
    });
  });

  describe('Whitespace handling', () => {
    test('should handle dual pointer with no spaces around comma', () => {
      // Arrange
      const template = createTemplateWithCFor('key,value in data.obj', '{key}:{value}');
      const obj = { a: '1', b: '2' };
      const config = createMockAppBlockConfig({ template, data: { obj } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('a:1');
      expect(app.el.textContent).toContain('b:2');
    });

    test('should handle dual pointer with extra spaces', () => {
      // Arrange
      const template = createTemplateWithCFor('key , value in data.obj', '{key}:{value}');
      const obj = { x: 'foo', y: 'bar' };
      const config = createMockAppBlockConfig({ template, data: { obj } });

      // Act
      const app = new AppBlock(config);

      // Assert
      expect(app.el.textContent).toContain('x:foo');
      expect(app.el.textContent).toContain('y:bar');
    });
  });

});
