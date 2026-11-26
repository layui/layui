import { jest } from '@jest/globals';

describe('splitter 分隔面板布局算法与基础接口', () => {
  let clampNumber;
  let parseSizeValue;
  let resolvePanelBounds;
  let computeInitialSizes;
  let rescaleSizes;
  let computeDragStep;
  let computeCollapseTransition;
  let Splitter;

  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

  beforeAll(async () => {
    globalThis.window = {
      document: {},
      navigator: { userAgent: '' },
      addEventListener() {},
      removeEventListener() {},
    };

    jest.unstable_mockModule('jquery', () => ({
      $: Object.assign(() => ({}), {
        extend: Object.assign,
      }),
    }));

    ({
      clampNumber,
      parseSizeValue,
      resolvePanelBounds,
      computeInitialSizes,
      rescaleSizes,
      computeDragStep,
      computeCollapseTransition,
      splitter: Splitter,
    } = await import('../../src/components/splitter.js'));
  });

  afterAll(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow);
    } else {
      delete globalThis.window;
    }
  });

  test('应正确暴露组件元信息、默认配置及静态委托方法', () => {
    expect(Splitter.componentName).toBe('splitter');
    expect(Splitter.options.orientation).toBe('horizontal');
    expect(typeof Splitter.render).toBe('function');
    expect(typeof Splitter.getSizes).toBe('function');
    expect(typeof Splitter.setSizes).toBe('function');
    expect(typeof Splitter.collapse).toBe('function');
    expect(typeof Splitter.expand).toBe('function');
    expect(typeof Splitter.toggle).toBe('function');
    expect(typeof Splitter.refresh).toBe('function');
  });

  describe('尺寸解析与边界规范化', () => {
    test('clampNumber 应限制数值区间并在 max 小于 min 时安全回退到 min', () => {
      expect(clampNumber(50, 0, 100)).toBe(50);
      expect(clampNumber(-10, 0, 100)).toBe(0);
      expect(clampNumber(150, 100, 120)).toBe(120);
      expect(clampNumber(50, 200, 100)).toBe(200);
    });

    test('parseSizeValue 应正确解析数字、px 字符串与百分比并安全处理非法输入', () => {
      expect(parseSizeValue(240, 1000)).toBe(240);
      expect(parseSizeValue(' 180px ', 1000)).toBe(180);
      expect(parseSizeValue(' 25% ', 800)).toBe(200);
      expect(parseSizeValue(-20, 800)).toBe(0);
      expect(parseSizeValue('-15%', 800)).toBe(0);
      expect(parseSizeValue('auto', 800, null)).toBeNull();
      expect(parseSizeValue('', 800, 50)).toBe(50);
      expect(parseSizeValue('   ', 800, 60)).toBe(60);
      expect(parseSizeValue('abc', 800, 40)).toBe(40);
      expect(parseSizeValue('%', 800, 30)).toBe(30);
      expect(parseSizeValue(NaN, 800, 20)).toBe(20);
      expect(parseSizeValue(Infinity, 800, 20)).toBe(20);
      expect(parseSizeValue(undefined, 800, 10)).toBe(10);
      expect(parseSizeValue(null, 800, 10)).toBe(10);
      expect(parseSizeValue({}, 800, 15)).toBe(15);
    });

    test('resolvePanelBounds 应规范化 min 与 max 像素边界并修正冲突值', () => {
      expect(resolvePanelBounds({}, 1000)).toEqual({ min: 0, max: Infinity });
      expect(resolvePanelBounds({ min: '10%', max: '50%' }, 1000)).toEqual({
        min: 100,
        max: 500,
      });
      // min 超出可用总长时应钳制到可用总长
      expect(resolvePanelBounds({ min: 1200 }, 1000)).toEqual({
        min: 1000,
        max: Infinity,
      });
      // max 小于 min 时应回退修正为 min
      expect(resolvePanelBounds({ min: 300, max: 200 }, 1000)).toEqual({
        min: 300,
        max: 300,
      });
    });
  });

  describe('初始尺寸分配 (computeInitialSizes)', () => {
    test('应处理空面板数组与非正数可用空间边界', () => {
      expect(computeInitialSizes([], 800)).toEqual({ sizes: [], bounds: [] });
      expect(computeInitialSizes([{}, {}], 0).sizes).toEqual([0, 0]);
      expect(computeInitialSizes([{}, {}], -50).sizes).toEqual([0, 0]);
    });

    test('应优先在自适应面板间均分剩余空间并在触发边界时二次平衡', () => {
      const { sizes } = computeInitialSizes(
        [
          { size: 200, min: 100, max: 400 },
          { min: 100, max: 300 },
          { min: 100, max: Infinity },
        ],
        1000,
      );

      // 面板 0 固定 200；剩余 800 在面板 1（受限于 max 300）与面板 2（承接剩余 500）之间分配
      expect(sizes[0]).toBeCloseTo(200, 2);
      expect(sizes[1]).toBeCloseTo(300, 2);
      expect(sizes[2]).toBeCloseTo(500, 2);
    });

    test('当所有面板均显式指定尺寸但总和与容器不等时应按比例二次平衡', () => {
      // 显式总和 300 < 600 -> 按权重比例放大至 [200, 400]
      const growRes = computeInitialSizes([{ size: 100 }, { size: 200 }], 600);
      expect(growRes.sizes[0]).toBeCloseTo(200, 2);
      expect(growRes.sizes[1]).toBeCloseTo(400, 2);

      // 显式总和 1200 > 800 -> 按可收缩余量缩小至 [400, 400]
      const shrinkRes = computeInitialSizes(
        [
          { size: 600, min: 200 },
          { size: 600, min: 200 },
        ],
        800,
      );
      expect(shrinkRes.sizes[0]).toBeCloseTo(400, 2);
      expect(shrinkRes.sizes[1]).toBeCloseTo(400, 2);
    });

    test('当所有面板 min 之和超限或 max 之和不足时应安全终止在各自极值', () => {
      const minOverflow = computeInitialSizes(
        [{ min: 300 }, { min: 300 }],
        400,
      );
      expect(minOverflow.sizes).toEqual([300, 300]);

      const maxUnderflow = computeInitialSizes(
        [{ max: 150 }, { max: 150 }],
        500,
      );
      expect(maxUnderflow.sizes).toEqual([150, 150]);
    });

    test('应正确处理部分面板初始折叠与全部面板初始折叠的场景', () => {
      const partial = computeInitialSizes(
        [
          { size: 250, collapsed: true, collapsible: true },
          {},
          { size: '25%' },
        ],
        800,
      );
      expect(partial.sizes[0]).toBe(0);
      expect(partial.sizes[1]).toBeCloseTo(600, 2);
      expect(partial.sizes[2]).toBeCloseTo(200, 2);

      const allCollapsed = computeInitialSizes(
        [{ collapsed: true }, { collapsed: true }],
        800,
      );
      expect(allCollapsed.sizes).toEqual([0, 0]);
    });
  });

  describe('容器缩放重算 (rescaleSizes)', () => {
    test('应维持已折叠面板为 0 并按原有比例重算未折叠面板且遵守边界约束', () => {
      const panels = [
        { collapsed: true },
        { min: 180, max: 400, collapsed: false },
        { min: 100, max: Infinity, collapsed: false },
      ];
      const { sizes } = rescaleSizes([0, 250, 750], panels, 500);

      // 500 的 25% 为 125 < min 180 -> 钳制为 180，面板 2 吸收差额变为 320
      expect(sizes[0]).toBe(0);
      expect(sizes[1]).toBeCloseTo(180, 2);
      expect(sizes[2]).toBeCloseTo(320, 2);
    });

    test('当缩放前有效总尺寸为 0、空面板或全部折叠时应正确回退', () => {
      expect(rescaleSizes([], [], 500)).toEqual({ sizes: [], bounds: [] });

      const fromZero = rescaleSizes(
        [0, 0],
        [{ collapsed: false }, { collapsed: false }],
        400,
      );
      expect(fromZero.sizes).toEqual([200, 200]);

      const allCollapsed = rescaleSizes(
        [0, 0],
        [{ collapsed: true }, { collapsed: true }],
        400,
      );
      expect(allCollapsed.sizes).toEqual([0, 0]);
    });
  });

  describe('拖拽步进与吸附计算 (computeDragStep)', () => {
    test('应钳制常规拖拽边界并支持前置面板与后置面板的双向吸附折叠', () => {
      const panelsMeta = [
        {
          min: 150,
          max: 500,
          resizable: true,
          collapsible: true,
          collapsed: false,
        },
        {
          min: 200,
          max: 800,
          resizable: true,
          collapsible: true,
          collapsed: false,
        },
      ];
      const bounds = panelsMeta.map((p) => resolvePanelBounds(p, 800));

      // 常规区间内拖拽
      const step1 = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: 100,
      });
      expect(step1.sizes).toEqual([400, 400]);
      expect(step1.prevCollapsed).toBe(false);
      expect(step1.nextCollapsed).toBe(false);

      // 未达到前置吸附阈值（150 * 0.4 = 60）前停留在 min (150)
      const step2 = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: -200,
      });
      expect(step2.sizes).toEqual([150, 650]);
      expect(step2.prevCollapsed).toBe(false);

      // 向左拖过前置吸附阈值（期望 40 <= 60）自动折叠前置面板至 0
      const step3 = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: -260,
      });
      expect(step3.sizes).toEqual([0, 800]);
      expect(step3.prevCollapsed).toBe(true);

      // 向右拖过后置吸附阈值（200 * 0.4 = 80），但因总和 800 > 面板 0 的 max(500) 被阻止吸附，停在 max 500
      const blockedSnapNext = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: 450,
      });
      expect(blockedSnapNext.sizes).toEqual([500, 300]);
      expect(blockedSnapNext.nextCollapsed).toBe(false);

      // 放宽面板 0 的 max 限制后，向右拖过阈值成功吸附折叠后置面板
      const looseBounds = [
        { min: 150, max: Infinity },
        { min: 200, max: Infinity },
      ];
      const snapNext = computeDragStep({
        startSizes: [300, 500],
        bounds: looseBounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: 450,
      });
      expect(snapNext.sizes).toEqual([800, 0]);
      expect(snapNext.nextCollapsed).toBe(true);
    });

    test('当任一相邻面板禁止伸缩或分隔条索引越界时应锁定不可拖拽', () => {
      const bounds = [
        { min: 0, max: Infinity },
        { min: 0, max: Infinity },
      ];

      const locked = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta: [{ resizable: false }, { resizable: true }],
        barIndex: 0,
        rawDelta: 100,
      });
      expect(locked.delta).toBe(0);
      expect(locked.sizes).toEqual([300, 500]);

      const outOfRange = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta: [{ resizable: true }, { resizable: true }],
        barIndex: 3,
        rawDelta: 100,
      });
      expect(outOfRange.delta).toBe(0);
      expect(outOfRange.sizes).toEqual([300, 500]);
    });

    test('已处于折叠状态的面板反向拖拽时应在未越过 min 前维持折叠、越过 min 后展开', () => {
      const collapsedPanels = [
        { min: 150, resizable: true, collapsible: true, collapsed: true },
        { min: 100, resizable: true, collapsible: false, collapsed: false },
      ];
      const bounds = [
        { min: 150, max: Infinity },
        { min: 100, max: Infinity },
      ];

      const stillCollapsed = computeDragStep({
        startSizes: [0, 800],
        bounds,
        panelsMeta: collapsedPanels,
        barIndex: 0,
        rawDelta: 100,
      });
      expect(stillCollapsed.sizes).toEqual([0, 800]);
      expect(stillCollapsed.prevCollapsed).toBe(true);

      const uncollapsed = computeDragStep({
        startSizes: [0, 800],
        bounds,
        panelsMeta: collapsedPanels,
        barIndex: 0,
        rawDelta: 220,
      });
      expect(uncollapsed.sizes).toEqual([220, 580]);
      expect(uncollapsed.prevCollapsed).toBe(false);
    });
  });

  describe('折叠与展开状态转换 (computeCollapseTransition)', () => {
    test('折叠时应保存原尺寸至历史记录并在展开时精确还原', () => {
      const panelsMeta = [
        { size: 240, min: 120, max: 400, collapsible: true, collapsed: false },
        { min: 200, max: Infinity, collapsible: false, collapsed: false },
      ];
      const bounds = panelsMeta.map((p) => resolvePanelBounds(p, 800));
      const savedSizes = Object.create(null);

      const collapsedRes = computeCollapseTransition({
        sizes: [260, 540],
        bounds,
        panelsMeta,
        savedSizes,
        panelIndex: 0,
        collapsed: true,
        availableSize: 800,
      });

      expect(collapsedRes.changed).toBe(true);
      expect(collapsedRes.sizes).toEqual([0, 800]);
      expect(savedSizes[0]).toBe(260);

      panelsMeta[0].collapsed = true;

      const expandedRes = computeCollapseTransition({
        sizes: collapsedRes.sizes,
        bounds,
        panelsMeta,
        savedSizes,
        panelIndex: 0,
        collapsed: false,
        availableSize: 800,
      });

      expect(expandedRes.changed).toBe(true);
      expect(expandedRes.sizes).toEqual([260, 540]);
    });

    test('越界索引、单面板或目标状态未改变时应返回 changed 为 false', () => {
      const bounds = [
        { min: 0, max: Infinity },
        { min: 0, max: Infinity },
      ];
      const panelsMeta = [{ collapsed: false }, { collapsed: false }];

      expect(
        computeCollapseTransition({
          sizes: [400, 400],
          bounds,
          panelsMeta,
          savedSizes: {},
          panelIndex: -1,
          collapsed: true,
        }).changed,
      ).toBe(false);

      expect(
        computeCollapseTransition({
          sizes: [400],
          bounds: [{ min: 0, max: Infinity }],
          panelsMeta: [{ collapsed: false }],
          savedSizes: {},
          panelIndex: 0,
          collapsed: true,
        }).changed,
      ).toBe(false);

      expect(
        computeCollapseTransition({
          sizes: [400, 400],
          bounds,
          panelsMeta,
          savedSizes: {},
          panelIndex: 0,
          collapsed: false,
        }).changed,
      ).toBe(false);
    });

    test('当相邻面板受 max 限制无法承接释放空间时应阻止折叠', () => {
      const res = computeCollapseTransition({
        sizes: [300, 500],
        bounds: [
          { min: 0, max: Infinity },
          { min: 0, max: 600 },
        ],
        panelsMeta: [{ collapsed: false }, { collapsed: false }],
        savedSizes: {},
        panelIndex: 0,
        collapsed: true,
      });

      expect(res.changed).toBe(false);
      expect(res.sizes).toEqual([300, 500]);
    });

    test('多栏场景应正确选择末面板与中间面板的空间交换邻居', () => {
      const threeBounds = [
        { min: 100, max: Infinity },
        { min: 100, max: Infinity },
        { min: 100, max: Infinity },
      ];

      // 折叠末面板（索引 2）应自动向内侧邻居（索引 1）释放空间
      const endMeta = [
        { collapsed: false },
        { collapsed: false },
        { collapsed: false },
      ];
      const endCollapse = computeCollapseTransition({
        sizes: [200, 350, 250],
        bounds: threeBounds,
        panelsMeta: endMeta,
        savedSizes: {},
        panelIndex: 2,
        collapsed: true,
      });
      expect(endCollapse.changed).toBe(true);
      expect(endCollapse.neighborIndex).toBe(1);
      expect(endCollapse.sizes).toEqual([200, 600, 0]);

      // 折叠中间面板（索引 1）：当后侧邻居已折叠时，自动回退选择前侧邻居（索引 0）吸收空间
      const midMeta = [
        { collapsed: false },
        { collapsed: false },
        { collapsed: true },
      ];
      const midCollapse = computeCollapseTransition({
        sizes: [300, 500, 0],
        bounds: threeBounds,
        panelsMeta: midMeta,
        savedSizes: {},
        panelIndex: 1,
        collapsed: true,
      });
      expect(midCollapse.changed).toBe(true);
      expect(midCollapse.neighborIndex).toBe(0);
      expect(midCollapse.sizes).toEqual([800, 0, 0]);
    });

    test('无历史保存尺寸时展开面板应回退读取配置 size 且不挤破邻居 min', () => {
      const initCollapsedMeta = [
        { size: '80%', min: 100, collapsed: true },
        { min: 300, collapsed: false },
      ];
      const expandNoHistory = computeCollapseTransition({
        sizes: [0, 800],
        bounds: [
          { min: 100, max: Infinity },
          { min: 300, max: Infinity },
        ],
        panelsMeta: initCollapsedMeta,
        savedSizes: {},
        panelIndex: 0,
        collapsed: false,
        availableSize: 800,
      });

      // 配置期望 640，但邻居要求至少保留 min 300，因此最多还原 500
      expect(expandNoHistory.changed).toBe(true);
      expect(expandNoHistory.sizes).toEqual([500, 300]);
    });
  });
});
