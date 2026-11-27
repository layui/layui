describe('lay.flatToTree', () => {
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

  test.each(['toString', 'constructor', 'hasOwnProperty', '__proto__'])(
    'retains a root when its missing parent ID is %s',
    (parentId) => {
      const data = [{ id: 'leaf', parentId }];
      const inheritedParent = {}[parentId];
      const originalChildren = Object.getOwnPropertyDescriptor(
        inheritedParent,
        'children',
      );

      try {
        expect(lay.flatToTree(data)).toEqual(data);
        expect(
          Object.getOwnPropertyDescriptor(inheritedParent, 'children'),
        ).toEqual(originalChildren);
      } finally {
        if (originalChildren) {
          Object.defineProperty(inheritedParent, 'children', originalChildren);
        } else {
          delete inheritedParent.children;
        }
      }
    },
  );

  test.each(['toString', 'constructor', 'hasOwnProperty', '__proto__'])(
    'attaches children to a real parent with ID %s in either input order',
    (id) => {
      const parent = { id, parentId: null };
      const child = { id: 'leaf', parentId: id };
      const expected = [{ ...parent, children: [child] }];

      expect(lay.flatToTree([parent, child])).toEqual(expected);
      expect(lay.flatToTree([child, parent])).toEqual(expected);
      expect(parent).toEqual({ id, parentId: null });
      expect(child).toEqual({ id: 'leaf', parentId: id });
    },
  );

  test('retains missing parents and assembles numeric IDs including zero', () => {
    const data = [
      { id: 2, parentId: 0 },
      { id: 0, parentId: null },
      { id: 3, parentId: 'missing' },
    ];

    expect(lay.flatToTree(data)).toEqual([
      { id: 0, parentId: null, children: [{ id: 2, parentId: 0 }] },
      { id: 3, parentId: 'missing' },
    ]);
    expect(lay.flatToTree([])).toEqual([]);
  });

  test('supports custom fields and removing parent IDs without changing input', () => {
    const data = [
      { key: 'leaf', parent: '__proto__' },
      { key: '__proto__', parent: null, nodes: [{ key: 'old' }] },
      { key: 'orphan', parent: 'missing' },
    ];
    const original = JSON.parse(JSON.stringify(data));

    expect(
      lay.flatToTree(data, {
        idKey: 'key',
        parentKey: 'parent',
        childrenKey: 'nodes',
        keepParentId: false,
      }),
    ).toEqual([
      { key: '__proto__', nodes: [{ key: 'leaf' }] },
      { key: 'orphan' },
    ]);
    expect(data).toEqual(original);
  });
});
