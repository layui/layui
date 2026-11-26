import { jest } from '@jest/globals';

describe('splitter 分隔面板布局算法与基础接口', () => {
  let clampNumber;
  let parseSizeValue;
  let resolvePanelCollapsible;
  let resolvePanelBounds;
  let computeInitialSizes;
  let computeSetSizes;
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
      resolvePanelCollapsible,
      resolvePanelBounds,
      computeInitialSizes,
      computeSetSizes,
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

  describe('尺寸解析、折叠方位与边界规范化', () => {
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

    test('resolvePanelCollapsible 应按面板所处位置规范化两侧可折叠标记', () => {
      expect(resolvePanelCollapsible(true, 0, 3)).toEqual({
        start: false,
        end: true,
      });
      expect(resolvePanelCollapsible('start', 0, 3)).toEqual({
        start: false,
        end: false,
      });

      expect(resolvePanelCollapsible(true, 1, 3)).toEqual({
        start: true,
        end: true,
      });
      expect(
        resolvePanelCollapsible({ start: true, end: false }, 1, 3),
      ).toEqual({
        start: true,
        end: false,
      });

      expect(resolvePanelCollapsible(true, 2, 3)).toEqual({
        start: true,
        end: false,
      });
      expect(resolvePanelCollapsible('end', 2, 3)).toEqual({
        start: false,
        end: false,
      });

      expect(resolvePanelCollapsible(true, 0, 1)).toEqual({
        start: false,
        end: false,
      });
    });

    test('resolvePanelBounds 应规范化 min 与 max 像素边界并修正冲突值', () => {
      expect(resolvePanelBounds({}, 1000)).toEqual({ min: 0, max: Infinity });
      expect(resolvePanelBounds({ min: '10%', max: '50%' }, 1000)).toEqual({
        min: 100,
        max: 500,
      });
      expect(resolvePanelBounds({ min: 1200 }, 1000)).toEqual({
        min: 1000,
        max: Infinity,
      });
      expect(resolvePanelBounds({ min: 300, max: 200 }, 1000)).toEqual({
        min: 300,
        max: 300,
      });
    });
  });

  describe('初始尺寸分配与动态尺寸设置 (computeInitialSizes / computeSetSizes)', () => {
    test('computeInitialSizes 应处理空面板数组与非正数可用空间边界', () => {
      expect(computeInitialSizes([], 800)).toEqual({ sizes: [], bounds: [] });
      expect(computeInitialSizes([{}, {}], 0).sizes).toEqual([0, 0]);
      expect(computeInitialSizes([{}, {}], -50).sizes).toEqual([0, 0]);
    });

    test('computeInitialSizes 应优先在自适应面板间均分剩余空间并在触发边界时二次平衡', () => {
      const { sizes } = computeInitialSizes(
        [
          { size: 200, min: 100, max: 400 },
          { min: 100, max: 300 },
          { min: 100, max: Infinity },
        ],
        1000,
      );

      expect(sizes[0]).toBeCloseTo(200, 2);
      expect(sizes[1]).toBeCloseTo(300, 2);
      expect(sizes[2]).toBeCloseTo(500, 2);
    });

    test('computeInitialSizes 在全部显式指定尺寸但总和不等时应按比例平衡', () => {
      const growRes = computeInitialSizes([{ size: 100 }, { size: 200 }], 600);
      expect(growRes.sizes[0]).toBeCloseTo(200, 2);
      expect(growRes.sizes[1]).toBeCloseTo(400, 2);

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

    test('computeInitialSizes 在所有面板 min 超限或 max 不足时应安全终止在各自极值', () => {
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

    test('computeInitialSizes 应正确处理部分初始折叠与全部初始折叠场景', () => {
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

    test('computeSetSizes 应严格优先满足显式传入尺寸并让省略面板按原比例承接余量', () => {
      // 两栏 [240, 260] 在 500px 容器中调用 setSizes([160]) 应精确得到 [160, 340]
      const twoPaneRes = computeSetSizes({
        prevSizes: [240, 260],
        panelsMeta: [{ collapsed: false }, { collapsed: false }],
        nextSizes: [160],
        availableSize: 500,
      });
      expect(twoPaneRes.sizes).toEqual([160, 340]);

      // 三栏拖拽后为 [200, 150, 450]（后两栏 1:3），调用 setSizes([400]) 应保持后两栏 1:3 分摊剩余 400 -> [400, 100, 300]
      const threePaneRes = computeSetSizes({
        prevSizes: [200, 150, 450],
        panelsMeta: [
          { collapsed: false },
          { collapsed: false },
          { collapsed: false },
        ],
        nextSizes: [400],
        availableSize: 800,
      });
      expect(threePaneRes.sizes[0]).toBeCloseTo(400, 2);
      expect(threePaneRes.sizes[1]).toBeCloseTo(100, 2);
      expect(threePaneRes.sizes[2]).toBeCloseTo(300, 2);
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
    test('应钳制常规拖拽边界并严格按分隔条对应侧配置触发吸附折叠', () => {
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

      const step1 = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: 100,
      });
      expect(step1.sizes).toEqual([400, 400]);

      const step2 = computeDragStep({
        startSizes: [300, 500],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: -260,
      });
      expect(step2.sizes).toEqual([0, 800]);
      expect(step2.prevCollapsed).toBe(true);

      const mismatchMeta = [
        {
          min: 150,
          max: Infinity,
          resizable: true,
          collapsible: 'start',
          collapsed: false,
        },
        {
          min: 200,
          max: Infinity,
          resizable: true,
          collapsible: false,
          collapsed: false,
        },
      ];
      const noSnap = computeDragStep({
        startSizes: [300, 500],
        bounds: [
          { min: 150, max: Infinity },
          { min: 200, max: Infinity },
        ],
        panelsMeta: mismatchMeta,
        barIndex: 0,
        rawDelta: -280,
      });
      expect(noSnap.sizes).toEqual([150, 650]);
      expect(noSnap.prevCollapsed).toBe(false);

      const snapNext = computeDragStep({
        startSizes: [300, 500],
        bounds: [
          { min: 150, max: Infinity },
          { min: 200, max: Infinity },
        ],
        panelsMeta,
        barIndex: 0,
        rawDelta: 450,
      });
      expect(snapNext.sizes).toEqual([800, 0]);
      expect(snapNext.nextCollapsed).toBe(true);
    });

    test('吸附折叠应同时检查接收面板的 min 约束，防止将已折叠邻栏撑开到低于其 min', () => {
      // 三栏 [100, 0(collapsed, min: 200), 400] 在 bar[0] 按 Home（rawDelta: -100），因合计 100 < 面板 1 的 min(200)，应拒绝吸附并保持原状
      const panelsMeta = [
        { min: 50, resizable: true, collapsible: true, collapsed: false },
        { min: 200, resizable: true, collapsible: true, collapsed: true },
        { min: 100, resizable: true, collapsible: false, collapsed: false },
      ];
      const bounds = [
        { min: 50, max: Infinity },
        { min: 200, max: Infinity },
        { min: 100, max: Infinity },
      ];

      const homeStep = computeDragStep({
        startSizes: [100, 0, 400],
        bounds,
        panelsMeta,
        barIndex: 0,
        rawDelta: -100,
      });

      expect(homeStep.delta).toBe(0);
      expect(homeStep.sizes).toEqual([100, 0, 400]);
      expect(homeStep.prevCollapsed).toBe(false);
      expect(homeStep.nextCollapsed).toBe(true);
    });

    test('当任一相邻面板禁止伸缩、bounds 未初始化或分隔条索引越界时应锁定不可拖拽', () => {
      const bounds = [
        { min: 0, max: Infinity },
        { min: 0, max: Infinity },
      ];

      expect(
        computeDragStep({
          startSizes: [300, 500],
          bounds,
          panelsMeta: [{ resizable: false }, { resizable: true }],
          barIndex: 0,
          rawDelta: 100,
        }).delta,
      ).toBe(0);

      expect(
        computeDragStep({
          startSizes: [],
          bounds: [],
          panelsMeta: [{ resizable: true }, { resizable: true }],
          barIndex: 0,
          rawDelta: 100,
        }).delta,
      ).toBe(0);
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

    test('展开时应优先消耗容器尚未分配的空白空间，不足部分再向其他面板借用', () => {
      // 可用 500px，左栏初始折叠（size: 300, min: 150），右栏固定 100px（max: 100），存在 400px 空白空间
      const panelsMeta = [
        {
          size: 300,
          initialSize: 300,
          min: 150,
          collapsed: true,
          collapsible: true,
        },
        { size: 100, max: 100, collapsed: false },
      ];
      const bounds = [
        { min: 150, max: Infinity },
        { min: 0, max: 100 },
      ];

      const res = computeCollapseTransition({
        sizes: [0, 100],
        bounds,
        panelsMeta,
        savedSizes: {},
        panelIndex: 0,
        collapsed: false,
        availableSize: 500,
      });

      expect(res.changed).toBe(true);
      expect(res.sizes).toEqual([300, 100]);
    });

    test('展开时若空白空间与其他未折叠面板可让出总空间之和仍小于目标面板 min，应拒绝展开', () => {
      const panelsMeta = [
        { min: 120, collapsed: true, collapsible: true },
        { min: 150, collapsed: false },
        { min: 300, collapsed: false },
      ];
      const bounds = [
        { min: 120, max: Infinity },
        { min: 150, max: Infinity },
        { min: 300, max: Infinity },
      ];

      const res = computeCollapseTransition({
        sizes: [0, 200, 300],
        bounds,
        panelsMeta,
        savedSizes: { 0: 150 },
        panelIndex: 0,
        collapsed: false,
        availableSize: 500,
      });

      expect(res.changed).toBe(false);
      expect(res.sizes).toEqual([0, 200, 300]);
    });

    test('展开时若直接邻居已处于 min，应自动向其余有富余空间的未折叠面板借用空间', () => {
      const panelsMeta = [
        { min: 100, collapsed: true, collapsible: true },
        { min: 100, collapsed: false },
        { min: 100, collapsed: false },
      ];
      const bounds = [
        { min: 100, max: Infinity },
        { min: 100, max: Infinity },
        { min: 100, max: Infinity },
      ];

      const res = computeCollapseTransition({
        sizes: [0, 100, 700],
        bounds,
        panelsMeta,
        savedSizes: { 0: 200 },
        panelIndex: 0,
        collapsed: false,
        availableSize: 800,
      });

      expect(res.changed).toBe(true);
      expect(res.sizes[0]).toBeCloseTo(200, 2);
      expect(res.sizes[1]).toBeCloseTo(100, 2);
      expect(res.sizes[2]).toBeCloseTo(500, 2);
    });

    test('折叠时若直接邻居受 max 限制应将多余空间溢出分摊给其他未折叠面板，且绝不静默展开已折叠邻居', () => {
      const spillMeta = [
        { collapsed: false, collapsible: true },
        { max: 400, collapsed: false },
        { collapsed: false },
      ];
      const spillBounds = [
        { min: 0, max: Infinity },
        { min: 0, max: 400 },
        { min: 0, max: Infinity },
      ];
      const spillRes = computeCollapseTransition({
        sizes: [200, 300, 300],
        bounds: spillBounds,
        panelsMeta: spillMeta,
        savedSizes: {},
        panelIndex: 0,
        collapsed: true,
        availableSize: 800,
      });
      expect(spillRes.changed).toBe(true);
      expect(spillRes.sizes).toEqual([0, 400, 400]);

      const lastOpenMeta = [
        { collapsed: false, collapsible: true },
        { collapsed: true, collapsible: true },
      ];
      const lastOpenRes = computeCollapseTransition({
        sizes: [800, 0],
        bounds: [
          { min: 0, max: Infinity },
          { min: 0, max: Infinity },
        ],
        panelsMeta: lastOpenMeta,
        savedSizes: {},
        panelIndex: 0,
        collapsed: true,
        availableSize: 800,
      });
      expect(lastOpenRes.changed).toBe(false);
      expect(lastOpenRes.sizes).toEqual([800, 0]);
    });

    test('bounds 未初始化（隐藏容器）、越界索引、零可用空间全部折叠时应安全返回 changed 为 false', () => {
      expect(
        computeCollapseTransition({
          sizes: [],
          bounds: [],
          panelsMeta: [{ collapsed: false }, { collapsed: false }],
          savedSizes: {},
          panelIndex: 0,
          collapsed: true,
        }).changed,
      ).toBe(false);

      expect(
        computeCollapseTransition({
          sizes: [0, 0],
          bounds: [
            { min: 0, max: Infinity },
            { min: 0, max: Infinity },
          ],
          panelsMeta: [{ collapsed: true }, { collapsed: true }],
          savedSizes: {},
          panelIndex: 0,
          collapsed: false,
          availableSize: 0,
        }).changed,
      ).toBe(false);
    });
  });
});
