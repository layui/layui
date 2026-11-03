describe('lay.extend', () => {
  let lay;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

  beforeAll(async () => {
    globalThis.window = { document: {} };
    ({ lay } = await import('../../src/core/lay.js'));
  });

  afterAll(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow);
    } else {
      delete globalThis.window;
    }
  });

  test('merges objects and arrays and applies a customizer', () => {
    const sources = [
      { a: [1, 3], b: { first: 1 } },
      { a: [5], b: { second: 2 } },
    ];

    expect(lay.extend({}, ...sources)).toEqual({
      a: [5, 3],
      b: { first: 1, second: 2 },
    });
    expect(
      lay.extend({}, ...sources, (targetValue, sourceValue) => {
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          return sourceValue;
        }
      }),
    ).toEqual({ a: [5], b: { first: 1, second: 2 } });
  });

  test('merges multiple sources into the original target', () => {
    const target = { value: 1, nested: { first: true } };

    expect(
      lay.extend(target, { value: 2, nested: { second: true } }, { value: 3 }),
    ).toBe(target);
    expect(target).toEqual({
      value: 3,
      nested: { first: true, second: true },
    });
  });

  test('copies only own source properties, including null-prototype sources', () => {
    const inherited = Object.create({ inherited: true });
    inherited.own = 1;
    const nullPrototype = Object.assign(Object.create(null), { other: 2 });

    expect(lay.extend({}, inherited, nullPrototype)).toEqual({
      own: 1,
      other: 2,
    });
  });

  test('customizer receives merge context and can retain an existing value', () => {
    const target = { nested: { value: 1 } };
    const source = { nested: { value: 2 } };
    const calls = [];

    expect(
      lay.extend(target, source, (targetValue, sourceValue, key, obj, src) => {
        calls.push({ targetValue, sourceValue, key, obj, src });
        if (key === 'value') return targetValue;
      }),
    ).toEqual({ nested: { value: 1 } });
    expect(calls[1]).toEqual({
      targetValue: 1,
      sourceValue: 2,
      key: 'value',
      obj: target.nested,
      src: source.nested,
    });
  });

  test('returns an empty object without arguments', () => {
    expect(lay.extend()).toEqual({});
    expect(lay.extend(() => {})).toEqual({});
  });

  test('returns a single target unchanged', () => {
    const target = { value: 1 };
    expect(lay.extend(target)).toBe(target);
  });

  describe('targets and sources', () => {
    test.each([
      ['undefined', undefined],
      ['null', null],
      ['boolean', false],
      ['number', 42],
      ['string', 'target'],
    ])(
      'creates a new target for %s when a source is supplied',
      (_name, value) => {
        expect(lay.extend(value, { key: 'value' })).toEqual({ key: 'value' });
      },
    );

    test('ignores null and undefined sources between valid sources', () => {
      const target = { retained: true };

      expect(
        lay.extend(target, null, { first: 1 }, undefined, { second: 2 }),
      ).toBe(target);
      expect(target).toEqual({ retained: true, first: 1, second: 2 });
    });

    test('returns the original target when all sources are empty', () => {
      const target = { value: 1 };

      expect(lay.extend(target, {}, null, undefined)).toBe(target);
      expect(target).toEqual({ value: 1 });
    });

    test('merges into an array target by index', () => {
      const target = [1, 2, 3];

      expect(lay.extend(target, [4, 5])).toBe(target);
      expect(target).toEqual([4, 5, 3]);
    });

    test('handles a source with its own hasOwnProperty field', () => {
      const source = Object.assign(Object.create(null), {
        hasOwnProperty: 'data',
        value: 1,
      });

      expect(lay.extend({}, source)).toEqual({
        hasOwnProperty: 'data',
        value: 1,
      });
    });

    test('does not copy non-enumerable or inherited source properties', () => {
      const source = Object.create({ inherited: 1 });
      Object.defineProperty(source, 'hidden', { value: 2, enumerable: false });
      source.visible = 3;

      expect(lay.extend({}, source)).toEqual({ visible: 3 });
    });

    test('preserves a null-prototype target', () => {
      const target = Object.create(null);

      expect(lay.extend(target, { nested: { value: 1 } })).toBe(target);
      expect(Object.getPrototypeOf(target)).toBeNull();
      expect(target.nested).toEqual({ value: 1 });
    });

    test('propagates errors from source property getters', () => {
      const error = new Error('source getter failed');
      const source = Object.defineProperty({}, 'value', {
        enumerable: true,
        get() {
          throw error;
        },
      });

      expect(() => lay.extend({}, source)).toThrow(error);
    });

    test('propagates errors when the target cannot be written', () => {
      expect(() => lay.extend(Object.freeze({}), { value: 1 })).toThrow(
        TypeError,
      );
    });
  });

  describe('deep merge', () => {
    test('preserves and merges constructor data at every level', () => {
      const constructor = { first: 1 };
      const target = { constructor };
      const source = {
        constructor: { second: 2 },
        nested: { constructor: 'Widget' },
        items: [{ constructor: 'Item' }],
      };

      expect(lay.extend(target, source)).toEqual({
        constructor: { first: 1, second: 2 },
        nested: { constructor: 'Widget' },
        items: [{ constructor: 'Item' }],
      });
      expect(target.constructor).toBe(constructor);
    });

    test.each(['data', 'constructor'])(
      'merges proxy-backed %s without inspecting its constructor descriptor',
      (key) => {
        const data = new Proxy(
          { first: 1 },
          {
            getOwnPropertyDescriptor(target, key) {
              if (key === 'constructor') {
                throw new Error('unexpected constructor descriptor access');
              }
              return Reflect.getOwnPropertyDescriptor(target, key);
            },
          },
        );
        const target = { [key]: data };

        expect(lay.extend(target, { [key]: { second: 2 } })).toBe(target);
        expect(target[key]).toBe(data);
        expect(data.first).toBe(1);
        expect(data.second).toBe(2);
      },
    );

    test('does not access a constructor function prototype while merging data', () => {
      const constructor = new Proxy(function Example() {}, {
        get(target, key, receiver) {
          if (key === 'prototype')
            throw new Error('unexpected prototype access');
          return Reflect.get(target, key, receiver);
        },
      });
      const target = { data: { constructor, first: 1 } };

      expect(lay.extend(target, { data: { second: 2 } })).toBe(target);
      expect(target.data).toEqual({ constructor, first: 1, second: 2 });
    });

    test('preserves constructor data in null-prototype sources and targets', () => {
      const source = Object.assign(Object.create(null), { constructor: 2 });
      const target = Object.create(null);

      expect(lay.extend(target, source)).toBe(target);
      expect(Object.getPrototypeOf(target)).toBeNull();
      expect(Object.keys(target)).toEqual(['constructor']);
      expect(target.constructor).toBe(2);
    });

    test('retains constructor translation keys in i18n settings', async () => {
      const { i18n } = await import('../../src/core/i18n.js');
      const locale = i18n.config.locale;
      const messages = i18n.config.messages;
      const testLocale = 'lay-extend-test';

      try {
        i18n.set({
          locale: testLocale,
          messages: {
            [testLocale]: { fields: { constructor: 'Manufacturer' } },
          },
        });
        expect(i18n.translate('fields.constructor')).toBe('Manufacturer');
      } finally {
        delete messages[testLocale];
        i18n.set({ locale });
      }
    });

    test('matches the documented multi-source example', () => {
      const sources = [
        { a: [1, 3], b: { ba: 1 } },
        { a: [5], b: { bb: 2 } },
        { b: { ba: 3 }, c: 3 },
      ];

      expect(lay.extend({}, ...sources)).toEqual({
        a: [5, 3],
        b: { ba: 3, bb: 2 },
        c: 3,
      });
    });

    test('copies nested plain objects and arrays without mutating sources', () => {
      const source = { nested: { values: [{ value: 1 }, [2, 3]] } };
      const result = lay.extend({}, source);

      expect(result).toEqual(source);
      expect(result.nested).not.toBe(source.nested);
      expect(result.nested.values).not.toBe(source.nested.values);
      expect(result.nested.values[0]).not.toBe(source.nested.values[0]);
      expect(result.nested.values[1]).not.toBe(source.nested.values[1]);

      result.nested.values[0].value = 9;
      result.nested.values[1].push(4);
      expect(source).toEqual({ nested: { values: [{ value: 1 }, [2, 3]] } });
    });

    test('merges into existing nested objects and arrays', () => {
      const nested = { first: 1 };
      const values = [{ first: 1 }, 2];
      const target = { nested, values };

      lay.extend(target, {
        nested: { second: 2 },
        values: [{ second: 2 }, 3],
      });

      expect(target.nested).toBe(nested);
      expect(target.values).toBe(values);
      expect(target).toEqual({
        nested: { first: 1, second: 2 },
        values: [{ first: 1, second: 2 }, 3],
      });
    });

    test('keeps independently copied branches separate when a source is reused', () => {
      const source = { nested: { value: 1 } };
      const result = lay.extend({}, { first: source }, { second: source });

      expect(result.first).toEqual(source);
      expect(result.second).toEqual(source);
      expect(result.first).not.toBe(result.second);
      expect(result.first.nested).not.toBe(result.second.nested);
    });

    test('merges sparse array elements without replacing untouched indices', () => {
      const source = [];
      source[1] = 'updated';

      expect(
        lay.extend({ list: ['first', 'second', 'third'] }, { list: source }),
      ).toEqual({ list: ['first', 'updated', 'third'] });
    });

    test.each([
      ['object with array', { value: { old: 1 } }, { value: [2] }, [2]],
      [
        'array with object',
        { value: [1] },
        { value: { next: 2 } },
        { next: 2 },
      ],
      ['scalar with object', { value: 1 }, { value: { next: 2 } }, { next: 2 }],
      ['scalar with array', { value: 1 }, { value: [2] }, [2]],
    ])('replaces an incompatible %s', (_name, target, source, expected) => {
      expect(lay.extend(target, source).value).toEqual(expected);
    });

    test.each([
      ['null', null],
      ['undefined', undefined],
      ['false', false],
      ['zero', 0],
      ['empty string', ''],
    ])('overwrites existing values with %s', (_name, value) => {
      const result = lay.extend({ key: 'before' }, { key: value });

      expect(Object.hasOwn(result, 'key')).toBe(true);
      expect(result.key).toBe(value);
    });

    test('merges null-prototype nested objects as plain objects', () => {
      const nested = Object.assign(Object.create(null), { value: 1 });
      const result = lay.extend({ nested: { existing: true } }, { nested });

      expect(result.nested).toEqual({ existing: true, value: 1 });
      expect(result.nested).not.toBe(nested);
    });

    test('assigns non-plain values by reference', () => {
      class Example {}
      const values = {
        date: new Date('2024-01-01T00:00:00Z'),
        regexp: /example/g,
        instance: new Example(),
        map: new Map([['key', 'value']]),
        fn: () => 'value',
      };
      const result = lay.extend({}, values);

      for (const key of Object.keys(values)) {
        expect(result[key]).toBe(values[key]);
      }
    });
  });

  describe('customizer', () => {
    test('passes constructor data to the customizer', () => {
      const keys = [];
      const result = lay.extend(
        {},
        { constructor: 'Acme' },
        (_old, value, key) => {
          keys.push(key);
          if (key === 'constructor') return value.toUpperCase();
        },
      );

      expect(keys).toEqual(['constructor']);
      expect(result.constructor).toBe('ACME');
    });

    test.each([
      ['null', null],
      ['false', false],
      ['zero', 0],
      ['empty string', ''],
    ])('uses the returned %s instead of default merging', (_name, value) => {
      const result = lay.extend(
        { key: { old: 1 } },
        { key: { next: 2 } },
        () => value,
      );

      expect(result.key).toBe(value);
    });

    test('falls back to recursive merging when it returns undefined', () => {
      const seen = [];
      const target = { nested: { first: 1 } };
      const source = { nested: { second: 2 } };

      expect(
        lay.extend(target, source, (_targetValue, _sourceValue, key) => {
          seen.push(key);
        }),
      ).toEqual({ nested: { first: 1, second: 2 } });
      expect(seen).toEqual(['nested', 'second']);
    });

    test('passes array indices and nested merge context to the customizer', () => {
      const target = { items: [{ value: 1 }] };
      const source = { items: [{ value: 2 }] };
      const calls = [];

      lay.extend(target, source, (targetValue, sourceValue, key, obj, src) => {
        calls.push({ targetValue, sourceValue, key, obj, src });
      });

      expect(calls.map((call) => call.key)).toEqual(['items', '0', 'value']);
      expect(calls[2]).toEqual({
        targetValue: 1,
        sourceValue: 2,
        key: 'value',
        obj: target.items[0],
        src: source.items[0],
      });
    });

    test('processes sources in order and sees the previously merged value', () => {
      const values = [];

      expect(
        lay.extend({}, { key: 1 }, { key: 2 }, (oldValue, newValue, key) => {
          values.push([key, oldValue, newValue]);
        }),
      ).toEqual({ key: 2 });
      expect(values).toEqual([
        ['key', undefined, 1],
        ['key', 1, 2],
      ]);
    });

    test('does not recurse when the customizer provides a replacement', () => {
      const keys = [];
      const replacement = { provided: true };
      const result = lay.extend(
        {},
        { nested: { value: 1 } },
        (_old, _new, key) => {
          keys.push(key);
          if (key === 'nested') return replacement;
        },
      );

      expect(result.nested).toBe(replacement);
      expect(keys).toEqual(['nested']);
    });

    test('propagates customizer exceptions', () => {
      const error = new Error('customizer failed');

      expect(() =>
        lay.extend({}, { value: 1 }, () => {
          throw error;
        }),
      ).toThrow(error);
    });
  });

  describe('prototype pollution protection', () => {
    test.each([
      [
        'top-level',
        '{"__proto__":{"layExtendPolluted":true},"ok":1}',
        { ok: 1 },
      ],
      [
        'nested',
        '{"a":{"__proto__":{"layExtendPolluted":true},"ok":1}}',
        { a: { ok: 1 } },
      ],
      [
        'array element',
        '{"a":[{"__proto__":{"layExtendPolluted":true},"ok":1}]}',
        { a: [{ ok: 1 }] },
      ],
      [
        'constructor path',
        '{"constructor":{"prototype":{"layExtendPolluted":true}}}',
        { constructor: { prototype: { layExtendPolluted: true } } },
      ],
      [
        'nested constructor path',
        '{"a":{"constructor":{"prototype":{"layExtendPolluted":true}}}}',
        { a: { constructor: { prototype: { layExtendPolluted: true } } } },
      ],
    ])(
      'does not pollute Object.prototype through %s',
      (_name, json, expected) => {
        const marker = 'layExtendPolluted';
        const original = Object.getOwnPropertyDescriptor(
          Object.prototype,
          marker,
        );
        const target = {};

        try {
          expect(lay.extend(target, JSON.parse(json))).toEqual(expected);
          expect(
            Object.getOwnPropertyDescriptor(Object.prototype, marker),
          ).toEqual(original);
          expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
        } finally {
          if (original) {
            Object.defineProperty(Object.prototype, marker, original);
          } else {
            delete Object.prototype[marker];
          }
        }
      },
    );

    test('skips __proto__ before reading the source or target property', () => {
      const key = '__proto__';
      const source = { safe: 1 };
      const target = {};
      Object.defineProperty(source, key, {
        enumerable: true,
        get() {
          throw new Error('source getter must not run');
        },
      });
      Object.defineProperty(target, key, {
        get() {
          throw new Error('target getter must not run');
        },
      });

      expect(lay.extend(target, source)).toBe(target);
      expect(target.safe).toBe(1);
    });

    test('skips __proto__ recursively without calling the customizer for it', () => {
      const source = JSON.parse(
        '{"nested":{"__proto__":{"bad":1},"constructor":{"bad":2},"safe":3}}',
      );
      const keys = [];

      expect(
        lay.extend({}, source, (_old, _new, key) => {
          keys.push(key);
        }),
      ).toEqual({ nested: { constructor: { bad: 2 }, safe: 3 } });
      expect(keys).toEqual(['nested', 'constructor', 'bad', 'safe']);
    });

    test('blocks __proto__ in a null-prototype source and target', () => {
      const source = Object.assign(
        Object.create(null),
        JSON.parse('{"__proto__":{"bad":1},"constructor":2,"safe":3}'),
      );
      const target = Object.create(null);

      expect(lay.extend(target, source)).toBe(target);
      expect(Object.getPrototypeOf(target)).toBeNull();
      expect(Object.keys(target)).toEqual(['constructor', 'safe']);
      expect(target.constructor).toBe(2);
      expect(target.safe).toBe(3);
    });

    test('blocks __proto__ in every source while preserving constructor', () => {
      const first = JSON.parse('{"__proto__":{"bad":1},"first":1}');
      const second = JSON.parse(
        '{"__proto__":{"bad":2},"constructor":{"bad":2},"second":2}',
      );
      const marker = 'bad';
      const original = Object.getOwnPropertyDescriptor(
        Object.prototype,
        marker,
      );

      try {
        expect(lay.extend({}, first, second)).toEqual({
          first: 1,
          constructor: { bad: 2 },
          second: 2,
        });
        expect(
          Object.getOwnPropertyDescriptor(Object.prototype, marker),
        ).toEqual(original);
      } finally {
        if (original) {
          Object.defineProperty(Object.prototype, marker, original);
        } else {
          delete Object.prototype[marker];
        }
      }
    });
  });
});
