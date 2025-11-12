import { AppBlock } from 'src/core.js';
import { createMockAppBlockConfig, createMockTemplate, resetDOM } from 'tests/fixtures/mockData.js';

describe('Filters edge cases', () => {
  afterEach(() => resetDOM());

  describe('Null and undefined values', () => {
    test('should handle null value in filter', () => {
      const tpl = createMockTemplate('<div>{data.value|stringify}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { value: null },
        filters: {
          stringify: (comp, v) => String(v)
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('null');
    });

    test('should handle undefined value in filter', () => {
      const tpl = createMockTemplate('<div>{data.missing|orDefault}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: {},
        filters: {
          orDefault: (comp, v) => v !== undefined ? v : 'default'
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('default');
    });

    test('should handle filter returning null', () => {
      const tpl = createMockTemplate('<div>{data.text|nullify}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: 'test' },
        filters: {
          nullify: (comp, v) => null
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('');
    });

    test('should handle filter returning undefined', () => {
      const tpl = createMockTemplate('<div>{data.text|makeUndefined}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: 'test' },
        filters: {
          makeUndefined: (comp, v) => undefined
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('');
    });
  });

  describe('Empty and falsy values', () => {
    test('should handle empty string', () => {
      const tpl = createMockTemplate('<div>{data.text|orFallback}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: '' },
        filters: {
          orFallback: (comp, v) => v || 'fallback'
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('fallback');
    });

    test('should handle zero value', () => {
      const tpl = createMockTemplate('<div>{data.count|showZero}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { count: 0 },
        filters: {
          showZero: (comp, v) => v === 0 ? '0' : v
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('0');
    });

    test('should handle false boolean', () => {
      const tpl = createMockTemplate('<div>{data.flag|boolToString}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { flag: false },
        filters: {
          boolToString: (comp, v) => v ? 'yes' : 'no'
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('no');
    });

    test('should handle empty array', () => {
      const tpl = createMockTemplate('<div>{data.items|count}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { items: [] },
        filters: {
          count: (comp, v) => Array.isArray(v) ? v.length : 0
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('0');
    });

    test('should handle empty object', () => {
      const tpl = createMockTemplate('<div>{data.obj|hasKeys}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { obj: {} },
        filters: {
          hasKeys: (comp, v) => Object.keys(v).length > 0 ? 'yes' : 'no'
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('no');
    });
  });

  describe('Type coercion and conversion', () => {
    test('should handle number to string conversion', () => {
      const tpl = createMockTemplate('<div>{data.num|prefix}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { num: 42 },
        filters: {
          prefix: (comp, v) => `Number: ${v}`
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('Number: 42');
    });

    test('should handle string to number conversion', () => {
      const tpl = createMockTemplate('<div>{data.str|toNumber|double}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { str: '21' },
        filters: {
          toNumber: (comp, v) => Number(v),
          double: (comp, v) => v * 2
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('42');
    });

    test('should handle boolean to number', () => {
      const tpl = createMockTemplate('<div>{data.flag|boolToNum}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { flag: true },
        filters: {
          boolToNum: (comp, v) => v ? 1 : 0
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('1');
    });

    test('should handle array to string', () => {
      const tpl = createMockTemplate('<div>{data.arr|join}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { arr: ['a', 'b', 'c'] },
        filters: {
          join: (comp, v) => Array.isArray(v) ? v.join(', ') : v
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('a, b, c');
    });
  });

  describe('Special characters and whitespace', () => {
    test('should handle strings with special characters', () => {
      const tpl = createMockTemplate('<div>{data.text|escape}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: 'Test & <script>' },
        filters: {
          escape: (comp, v) => v.replace(/[&<>"']/g, '-')
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toContain('Test -');
    });

    test('should handle strings with newlines', () => {
      const tpl = createMockTemplate('<div>{data.text|removeNewlines}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: 'Line1\nLine2\nLine3' },
        filters: {
          removeNewlines: (comp, v) => v.replace(/\n/g, ' ')
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('Line1 Line2 Line3');
    });

    test('should handle strings with tabs', () => {
      const tpl = createMockTemplate('<div>{data.text|removeTabs}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: 'Tab\there' },
        filters: {
          removeTabs: (comp, v) => v.replace(/\t/g, ' ')
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('Tab here');
    });

    test('should handle strings with leading/trailing whitespace', () => {
      const tpl = createMockTemplate('<div>{data.text|trim}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: '   trim me   ' },
        filters: {
          trim: (comp, v) => String(v).trim()
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('trim me');
    });

    test('should handle unicode characters', () => {
      const tpl = createMockTemplate('<div>{data.emoji|repeat}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { emoji: '🎉' },
        filters: {
          repeat: (comp, v) => v + v
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('🎉🎉');
    });
  });

  describe('Nested data access', () => {
    test('should handle deeply nested property access', () => {
      const tpl = createMockTemplate('<div>{data.user.profile.name|uppercase}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: {
          user: {
            profile: {
              name: 'john'
            }
          }
        },
        filters: {
          uppercase: (comp, v) => String(v).toUpperCase()
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('JOHN');
    });

    test('should handle missing nested property', () => {
      const tpl = createMockTemplate('<div>{data.user.missing.prop|orDefault}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { user: {} },
        filters: {
          orDefault: (comp, v) => v !== undefined ? v : 'N/A'
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('N/A');
    });

    test('should handle array element access with filter', () => {
      const tpl = createMockTemplate('<div>{data.items.0|uppercase}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { items: ['first', 'second'] },
        filters: {
          uppercase: (comp, v) => String(v).toUpperCase()
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('FIRST');
    });
  });

  describe('Filter error handling', () => {
    test('should handle filter that throws error gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const tpl = createMockTemplate('<div>{data.value|throwError}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { value: 'test' },
        filters: {
          throwError: (comp, v) => {
            throw new Error('Filter error');
          }
        }
      });

      // Should not crash the app
      expect(() => new AppBlock(config)).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    test('should handle unknown filter without crashing', () => {
      const tpl = createMockTemplate('<div>{data.value|unknownFilter}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { value: 'test' }
      });

      expect(() => new AppBlock(config)).not.toThrow();
    });
  });

  describe('Long and complex values', () => {
    test('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const tpl = createMockTemplate('<div>{data.text|length}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: longString },
        filters: {
          length: (comp, v) => v.length
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('10000');
    });

    test('should handle large arrays', () => {
      const largeArray = new Array(1000).fill('item');
      const tpl = createMockTemplate('<div>{data.arr|count}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { arr: largeArray },
        filters: {
          count: (comp, v) => v.length
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('1000');
    });

    test('should handle floating point numbers', () => {
      const tpl = createMockTemplate('<div>{data.num|round}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { num: 3.14159265359 },
        filters: {
          round: (comp, v) => v.toFixed(2)
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('3.14');
    });

    test('should handle very large numbers', () => {
      const tpl = createMockTemplate('<div>{data.big|format}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { big: 1234567890 },
        filters: {
          format: (comp, v) => v.toLocaleString()
        }
      });
      const app = new AppBlock(config);

      // Should format the number with separators
      expect(app.el.textContent.trim()).toContain('1');
    });

    test('should handle negative numbers', () => {
      const tpl = createMockTemplate('<div>{data.num|abs}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { num: -42 },
        filters: {
          abs: (comp, v) => Math.abs(v)
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('42');
    });
  });

  describe('Mixed content scenarios', () => {
    test('should handle filter with both text and HTML special chars', () => {
      const tpl = createMockTemplate('<div>{data.mixed|sanitize}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { mixed: 'Text with <tags> & symbols' },
        filters: {
          sanitize: (comp, v) => v.replace(/[<>]/g, '')
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('Text with tags & symbols');
    });

    test('should handle filter with date objects', () => {
      const testDate = new Date('2025-01-01');
      const tpl = createMockTemplate('<div>{data.date|formatDate}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { date: testDate },
        filters: {
          formatDate: (comp, v) => v instanceof Date ? v.toISOString().split('T')[0] : v
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('2025-01-01');
    });

    test('should handle filter with regular expressions', () => {
      const tpl = createMockTemplate('<div>{data.text|removeDigits}</div>');
      const config = createMockAppBlockConfig({
        template: tpl,
        data: { text: 'Test123Value456' },
        filters: {
          removeDigits: (comp, v) => v.replace(/\d+/g, '')
        }
      });
      const app = new AppBlock(config);

      expect(app.el.textContent.trim()).toBe('TestValue');
    });
  });
});
