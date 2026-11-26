/**
 * splitter
 * 分隔面板组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

// 浮点误差容忍阈值
const EPSILON = 0.01;

// 共享的容器尺寸观察器
let sharedResizeObserver = null;
const getSharedResizeObserver = () => {
  if (!sharedResizeObserver) {
    sharedResizeObserver = lay.createSharedResizeObserver('splitter');
  }
  return sharedResizeObserver;
};

/**
 * 数值区间钳制
 * @param {number} val - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 钳制后的数值
 */
export const clampNumber = (val, min, max) => {
  const safeMax = max < min ? min : max;
  return Math.min(Math.max(val, min), safeMax);
};

/**
 * 解析尺寸配置（支持 number、'200px'、'30%'）为像素值
 * @param {number|string|undefined|null} raw - 原始尺寸配置
 * @param {number} availableSize - 可用主轴总尺寸（px）
 * @param {number|null} [defaultValue=null] - 无法解析时的回退值
 * @returns {number|null} 像素值或回退值
 */
export const parseSizeValue = (raw, availableSize, defaultValue = null) => {
  if (raw === undefined || raw === null || raw === '' || raw === 'auto') {
    return defaultValue;
  }

  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? Math.max(0, raw) : defaultValue;
  }

  if (typeof raw === 'string') {
    const str = raw.trim();
    if (!str || str === 'auto') return defaultValue;

    if (str.endsWith('%')) {
      const pct = parseFloat(str);
      return Number.isFinite(pct)
        ? Math.max(0, (pct / 100) * availableSize)
        : defaultValue;
    }

    const num = parseFloat(str);
    return Number.isFinite(num) ? Math.max(0, num) : defaultValue;
  }

  return defaultValue;
};

/**
 * 解析单个面板在指定位置允许折叠的方位
 * - `start` 表示可通过前侧分隔条 `bar[panelIndex - 1]` 向左/上折叠（仅 `panelIndex > 0` 有效）
 * - `end` 表示可通过后侧分隔条 `bar[panelIndex]` 向右/下折叠（仅 `panelIndex < panelCount - 1` 有效）
 * @param {boolean|'start'|'end'|{start?: boolean, end?: boolean}} collapsible - 原始折叠配置
 * @param {number} panelIndex - 面板索引
 * @param {number} panelCount - 面板总数
 * @returns {{ start: boolean, end: boolean }} 规范化后的两侧可折叠标记
 */
export const resolvePanelCollapsible = (
  collapsible,
  panelIndex,
  panelCount,
) => {
  if (!collapsible || panelCount < 2) {
    return { start: false, end: false };
  }

  const hasStartBar = panelIndex > 0;
  const hasEndBar = panelIndex < panelCount - 1;

  if (collapsible === true) {
    if (panelIndex === 0) return { start: false, end: hasEndBar };
    if (panelIndex === panelCount - 1)
      return { start: hasStartBar, end: false };
    return { start: hasStartBar, end: hasEndBar };
  }

  if (collapsible === 'start') {
    return { start: hasStartBar, end: false };
  }

  if (collapsible === 'end') {
    return { start: false, end: hasEndBar };
  }

  if (typeof collapsible === 'object') {
    return {
      start: Boolean(collapsible.start) && hasStartBar,
      end: Boolean(collapsible.end) && hasEndBar,
    };
  }

  return { start: false, end: false };
};

/**
 * 解析单个面板的最小/最大像素边界
 * @param {Object} panelMeta - 面板配置
 * @param {number} availableSize - 可用主轴总尺寸（px）
 * @returns {{ min: number, max: number }} 像素边界对象
 */
export const resolvePanelBounds = (panelMeta, availableSize) => {
  const rawMin = parseSizeValue(panelMeta?.min, availableSize, 0);
  const min = clampNumber(rawMin, 0, availableSize);

  const hasMax =
    panelMeta?.max !== undefined &&
    panelMeta?.max !== null &&
    panelMeta?.max !== '' &&
    panelMeta?.max !== Infinity;
  const parsedMax = hasMax
    ? parseSizeValue(panelMeta.max, availableSize, Infinity)
    : Infinity;
  const max = parsedMax < min ? min : parsedMax;

  return { min, max };
};

/**
 * 在指定候选面板集合中按比例分摊尺寸差值，确保严格遵守 [min, max] 约束
 * @param {number[]} sizes - 当前尺寸数组（原地修改）
 * @param {Array<{min: number, max: number}>} bounds - 边界数组
 * @param {number[]} candidateIndices - 允许参与调整的面板索引列表
 * @param {number} targetTotal - 期望总尺寸
 * @returns {void}
 */
const distributeDiffAmong = (sizes, bounds, candidateIndices, targetTotal) => {
  for (let round = 0; round < candidateIndices.length + 2; round++) {
    const currentTotal = sizes.reduce((sum, s) => sum + s, 0);
    const diff = targetTotal - currentTotal;

    if (Math.abs(diff) <= EPSILON) break;

    if (diff > 0) {
      const growable = candidateIndices.filter(
        (idx) => sizes[idx] < bounds[idx].max - EPSILON,
      );
      if (!growable.length) break;

      const weightSum = growable.reduce((sum, idx) => sum + sizes[idx], 0);
      growable.forEach((idx) => {
        const share =
          weightSum > EPSILON
            ? diff * (sizes[idx] / weightSum)
            : diff / growable.length;
        sizes[idx] = Math.min(bounds[idx].max, sizes[idx] + share);
      });
    } else {
      const shrinkNeed = -diff;
      const shrinkable = candidateIndices.filter(
        (idx) => sizes[idx] > bounds[idx].min + EPSILON,
      );
      if (!shrinkable.length) break;

      const roomSum = shrinkable.reduce(
        (sum, idx) => sum + (sizes[idx] - bounds[idx].min),
        0,
      );
      shrinkable.forEach((idx) => {
        const room = sizes[idx] - bounds[idx].min;
        const share =
          roomSum > EPSILON
            ? shrinkNeed * (room / roomSum)
            : shrinkNeed / shrinkable.length;
        sizes[idx] = Math.max(bounds[idx].min, sizes[idx] - share);
      });
    }
  }
};

/**
 * 计算所有面板的初始像素尺寸
 * @param {Array<Object>} panelsMeta - 面板元数据列表
 * @param {number} availableSize - 可用主轴总尺寸（px）
 * @returns {{ sizes: number[], bounds: Array<{min: number, max: number}> }}
 */
export const computeInitialSizes = (panelsMeta, availableSize) => {
  const safeAvailable = Math.max(0, availableSize);
  const count = panelsMeta.length;
  if (!count) return { sizes: [], bounds: [] };

  const bounds = panelsMeta.map((p) => resolvePanelBounds(p, safeAvailable));
  const sizes = new Array(count).fill(null);
  const autoIndices = [];
  const activeIndices = [];

  panelsMeta.forEach((panel, i) => {
    if (panel.collapsed) {
      sizes[i] = 0;
      return;
    }

    activeIndices.push(i);
    const parsed = parseSizeValue(panel.size, safeAvailable, null);
    if (parsed !== null) {
      sizes[i] = clampNumber(parsed, bounds[i].min, bounds[i].max);
    } else {
      autoIndices.push(i);
    }
  });

  const explicitUsed = sizes.reduce((sum, s) => sum + (s ?? 0), 0);
  const remaining = Math.max(0, safeAvailable - explicitUsed);

  if (autoIndices.length > 0) {
    const share = remaining / autoIndices.length;
    autoIndices.forEach((idx) => {
      sizes[idx] = clampNumber(share, bounds[idx].min, bounds[idx].max);
    });
    // 优先在自适应面板之间消化差额
    distributeDiffAmong(sizes, bounds, autoIndices, safeAvailable);
  }

  // 若仍有剩余差额，在所有未折叠面板之间二次平衡
  distributeDiffAmong(sizes, bounds, activeIndices, safeAvailable);

  return { sizes, bounds };
};

/**
 * 容器尺寸变化时，按原有面板比例重新缩放尺寸
 * @param {number[]} prevSizes - 缩放前各面板像素尺寸
 * @param {Array<Object>} panelsMeta - 面板元数据列表
 * @param {number} newAvailableSize - 新的可用总尺寸（px）
 * @returns {{ sizes: number[], bounds: Array<{min: number, max: number}> }}
 */
export const rescaleSizes = (prevSizes, panelsMeta, newAvailableSize) => {
  const safeAvailable = Math.max(0, newAvailableSize);
  const count = panelsMeta.length;
  if (!count) return { sizes: [], bounds: [] };

  const bounds = panelsMeta.map((p) => resolvePanelBounds(p, safeAvailable));
  const activeIndices = [];
  let prevActiveTotal = 0;

  panelsMeta.forEach((panel, i) => {
    if (!panel.collapsed) {
      activeIndices.push(i);
      prevActiveTotal += prevSizes[i] || 0;
    }
  });

  if (!activeIndices.length) {
    return { sizes: new Array(count).fill(0), bounds };
  }

  const sizes = panelsMeta.map((panel, i) => {
    if (panel.collapsed) return 0;
    const rawScaled =
      prevActiveTotal > 0
        ? ((prevSizes[i] || 0) / prevActiveTotal) * safeAvailable
        : safeAvailable / activeIndices.length;
    return clampNumber(rawScaled, bounds[i].min, bounds[i].max);
  });

  distributeDiffAmong(sizes, bounds, activeIndices, safeAvailable);

  return { sizes, bounds };
};

/**
 * 计算拖拽第 barIndex 条分隔条后的相邻双面板尺寸与折叠状态
 * @param {Object} params
 * @param {number[]} params.startSizes - 拖拽起始时各面板尺寸
 * @param {Array<{min: number, max: number}>} params.bounds - 边界数组
 * @param {Array<Object>} params.panelsMeta - 面板元数据
 * @param {number} params.barIndex - 分隔条索引（位于 barIndex 与 barIndex + 1 之间）
 * @param {number} params.rawDelta - 指针原始位移（px）
 * @returns {{ sizes: number[], delta: number, prevCollapsed: boolean, nextCollapsed: boolean }}
 */
export const computeDragStep = ({
  startSizes,
  bounds,
  panelsMeta,
  barIndex,
  rawDelta,
}) => {
  const count = panelsMeta.length;
  const i = barIndex;
  const j = barIndex + 1;
  const sizes = startSizes.slice();
  const prevMeta = panelsMeta[i];
  const nextMeta = panelsMeta[j];

  if (
    !prevMeta ||
    !nextMeta ||
    !bounds[i] ||
    !bounds[j] ||
    prevMeta.resizable === false ||
    nextMeta.resizable === false
  ) {
    return {
      sizes,
      delta: 0,
      prevCollapsed: Boolean(prevMeta?.collapsed),
      nextCollapsed: Boolean(nextMeta?.collapsed),
    };
  }

  const s0 = startSizes[i];
  const s1 = startSizes[j];
  const pairTotal = s0 + s1;
  const b0 = bounds[i];
  const b1 = bounds[j];

  // 严格按当前分隔条所在侧判断是否允许吸附折叠，保持与按钮方向一致
  const canCollapsePrev = resolvePanelCollapsible(
    prevMeta.collapsible,
    i,
    count,
  ).end;
  const canCollapseNext = resolvePanelCollapsible(
    nextMeta.collapsible,
    j,
    count,
  ).start;

  const desiredPrev = s0 + rawDelta;
  const desiredNext = s1 - rawDelta;

  // 向左/上拖过阈值触发吸附折叠 prev 面板
  const prevSnapThreshold = b0.min > 0 ? b0.min * 0.4 : 0;
  if (
    canCollapsePrev &&
    desiredPrev <= prevSnapThreshold &&
    pairTotal <= b1.max &&
    pairTotal > 0
  ) {
    sizes[i] = 0;
    sizes[j] = pairTotal;
    return {
      sizes,
      delta: -s0,
      prevCollapsed: true,
      nextCollapsed: false,
    };
  }

  // 向右/下拖过阈值触发吸附折叠 next 面板
  const nextSnapThreshold = b1.min > 0 ? b1.min * 0.4 : 0;
  if (
    canCollapseNext &&
    desiredNext <= nextSnapThreshold &&
    pairTotal <= b0.max &&
    pairTotal > 0
  ) {
    sizes[i] = pairTotal;
    sizes[j] = 0;
    return {
      sizes,
      delta: s1,
      prevCollapsed: false,
      nextCollapsed: true,
    };
  }

  // 常规区间钳制（若起始已处于折叠态且未拖过 min，则维持折叠态，拖过则展开）
  const effectiveMin0 =
    prevMeta.collapsed && s0 === 0 && desiredPrev < b0.min ? 0 : b0.min;
  const effectiveMin1 =
    nextMeta.collapsed && s1 === 0 && desiredNext < b1.min ? 0 : b1.min;

  const minDelta = -Math.min(s0 - effectiveMin0, b1.max - s1);
  const maxDelta = Math.min(b0.max - s0, s1 - effectiveMin1);
  const clampedDelta = clampNumber(rawDelta, minDelta, maxDelta);

  sizes[i] = s0 + clampedDelta;
  sizes[j] = s1 - clampedDelta;

  if (prevMeta.collapsed && sizes[i] > 0 && sizes[i] < b0.min) {
    sizes[i] = 0;
    sizes[j] = pairTotal;
  }
  if (nextMeta.collapsed && sizes[j] > 0 && sizes[j] < b1.min) {
    sizes[j] = 0;
    sizes[i] = pairTotal;
  }

  return {
    sizes,
    delta: sizes[i] - s0,
    prevCollapsed: sizes[i] === 0 && (canCollapsePrev || prevMeta.collapsed),
    nextCollapsed: sizes[j] === 0 && (canCollapseNext || nextMeta.collapsed),
  };
};

/**
 * 从候选的未折叠面板中挑选首选相邻面板索引
 * @param {number[]} otherExpanded - 其他未折叠面板索引集合
 * @param {number} panelIndex - 目标面板索引
 * @param {number} count - 面板总数
 * @param {number} [preferredNeighbor] - 调用方建议的邻居索引
 * @returns {number} 首选邻居索引
 */
const pickPrimaryNeighbor = (
  otherExpanded,
  panelIndex,
  count,
  preferredNeighbor,
) => {
  if (
    preferredNeighbor !== undefined &&
    otherExpanded.includes(preferredNeighbor)
  ) {
    return preferredNeighbor;
  }

  const defaultOrder =
    panelIndex === count - 1
      ? [panelIndex - 1]
      : [panelIndex + 1, panelIndex - 1];

  for (const candidate of defaultOrder) {
    if (otherExpanded.includes(candidate)) {
      return candidate;
    }
  }

  // 回退选择距离最近的未折叠面板
  return otherExpanded.reduce((closest, idx) =>
    Math.abs(idx - panelIndex) < Math.abs(closest - panelIndex) ? idx : closest,
  );
};

/**
 * 计算单面板折叠或展开后的尺寸更新（支持多面板空间协同借用，严格保护 min/max 与其他折叠面板状态）
 * @param {Object} params
 * @param {number[]} params.sizes - 当前尺寸数组
 * @param {Array<{min: number, max: number}>} params.bounds - 边界数组
 * @param {Array<Object>} params.panelsMeta - 面板元数据
 * @param {Object<number, number|string>} params.savedSizes - 折叠前保存的历史尺寸记录
 * @param {number} params.panelIndex - 目标面板索引
 * @param {boolean} params.collapsed - 目标折叠状态（true: 折叠, false: 展开）
 * @param {number} [params.neighborIndex] - 优先交换空间的相邻面板索引
 * @param {number} [params.availableSize=0] - 当前容器可用总尺寸
 * @returns {{ changed: boolean, sizes: number[], neighborIndex: number }}
 */
export const computeCollapseTransition = ({
  sizes,
  bounds,
  panelsMeta,
  savedSizes,
  panelIndex,
  collapsed,
  neighborIndex,
  availableSize = 0,
}) => {
  const count = panelsMeta.length;
  const nextSizes = sizes.slice();

  if (
    panelIndex < 0 ||
    panelIndex >= count ||
    count < 2 ||
    bounds.length < count
  ) {
    return { changed: false, sizes: nextSizes, neighborIndex: -1 };
  }

  const targetMeta = panelsMeta[panelIndex];
  if (Boolean(targetMeta.collapsed) === Boolean(collapsed)) {
    return { changed: false, sizes: nextSizes, neighborIndex: -1 };
  }

  // 仅允许在当前未折叠的面板之间收放空间，绝不静默展开其他已折叠面板
  const otherExpanded = [];
  panelsMeta.forEach((meta, idx) => {
    if (idx !== panelIndex && !meta.collapsed) {
      otherExpanded.push(idx);
    }
  });

  if (collapsed) {
    // 若没有其他未折叠面板可吸收空间，拒绝将最后一个可见面板折叠为空白
    if (!otherExpanded.length) {
      return { changed: false, sizes: nextSizes, neighborIndex: -1 };
    }

    const freed = nextSizes[panelIndex];
    const totalGrowRoom = otherExpanded.reduce(
      (sum, idx) => sum + Math.max(0, bounds[idx].max - nextSizes[idx]),
      0,
    );

    if (freed > totalGrowRoom + EPSILON) {
      return { changed: false, sizes: nextSizes, neighborIndex: -1 };
    }

    if (freed > 0) {
      savedSizes[panelIndex] = freed;
    }

    const primary = pickPrimaryNeighbor(
      otherExpanded,
      panelIndex,
      count,
      neighborIndex,
    );
    const currentTotal = nextSizes.reduce((sum, s) => sum + s, 0);

    nextSizes[panelIndex] = 0;
    const primaryGain = Math.min(
      freed,
      Math.max(0, bounds[primary].max - nextSizes[primary]),
    );
    nextSizes[primary] += primaryGain;

    // 若直接邻居受 max 限制未能吸收全部空间，余量分摊给其余未折叠面板
    if (freed - primaryGain > EPSILON) {
      distributeDiffAmong(nextSizes, bounds, otherExpanded, currentTotal);
    }

    return { changed: true, sizes: nextSizes, neighborIndex: primary };
  }

  // 展开分支：若此前所有面板均处于折叠态，直接占用容器可用空间
  if (!otherExpanded.length) {
    if (availableSize <= EPSILON || availableSize < bounds[panelIndex].min) {
      return { changed: false, sizes: nextSizes, neighborIndex: -1 };
    }
    const rawSaved = parseSizeValue(
      savedSizes[panelIndex],
      availableSize,
      null,
    );
    const initConfigured = parseSizeValue(
      targetMeta.initialSize ?? targetMeta.size,
      availableSize,
      null,
    );
    const restored = clampNumber(
      rawSaved ?? initConfigured ?? availableSize,
      bounds[panelIndex].min,
      Math.min(bounds[panelIndex].max, availableSize),
    );
    if (restored <= EPSILON) {
      return { changed: false, sizes: nextSizes, neighborIndex: -1 };
    }
    nextSizes[panelIndex] = restored;
    return { changed: true, sizes: nextSizes, neighborIndex: -1 };
  }

  // 计算所有其他未折叠面板可让出的总空间
  const totalShrinkRoom = otherExpanded.reduce(
    (sum, idx) => sum + Math.max(0, nextSizes[idx] - bounds[idx].min),
    0,
  );
  const minRequired = bounds[panelIndex].min;

  // 若可让出总空间不足以满足目标面板的 min（或无可让出空间），严格保持折叠态并返回 false
  if (totalShrinkRoom <= EPSILON || totalShrinkRoom + EPSILON < minRequired) {
    return { changed: false, sizes: nextSizes, neighborIndex: -1 };
  }

  const primary = pickPrimaryNeighbor(
    otherExpanded,
    panelIndex,
    count,
    neighborIndex,
  );
  const effectiveTotal =
    availableSize > 0
      ? availableSize
      : nextSizes.reduce((sum, s) => sum + s, 0);

  const savedPx = parseSizeValue(savedSizes[panelIndex], effectiveTotal, null);
  const configuredPx = parseSizeValue(
    targetMeta.initialSize ?? targetMeta.size,
    effectiveTotal,
    null,
  );
  const fallbackSize =
    configuredPx && configuredPx > 0
      ? configuredPx
      : Math.max(minRequired, (nextSizes[primary] || totalShrinkRoom) / 2);
  const desired = clampNumber(
    savedPx && savedPx > 0 ? savedPx : fallbackSize,
    minRequired,
    bounds[panelIndex].max,
  );
  const restoredSize = Math.min(desired, totalShrinkRoom);

  if (restoredSize <= EPSILON || restoredSize + EPSILON < minRequired) {
    return { changed: false, sizes: nextSizes, neighborIndex: primary };
  }

  const currentTotal = nextSizes.reduce((sum, s) => sum + s, 0);
  const takeFromPrimary = Math.min(
    restoredSize,
    Math.max(0, nextSizes[primary] - bounds[primary].min),
  );
  nextSizes[primary] -= takeFromPrimary;
  nextSizes[panelIndex] = restoredSize;

  // 若直接邻居达到 min 后仍差部分空间，继续从其余富余的未折叠面板中按余量分摊扣减
  if (restoredSize - takeFromPrimary > EPSILON) {
    const remainingDonors = otherExpanded.filter((idx) => idx !== primary);
    distributeDiffAmong(nextSizes, bounds, remainingDonors, currentTotal);
  }

  return { changed: true, sizes: nextSizes, neighborIndex: primary };
};

export class Splitter extends Component {
  static componentName = 'splitter';

  // 默认配置项
  static options = {
    // 绑定的目标容器选择器、DOM 元素或 jQuery 对象
    elem: '.lay-splitter',

    // 分割排列方向；可选值：horizontal（左右分栏）| vertical（上下分栏）
    orientation: 'horizontal',

    // 分隔条占用的主轴轨道尺寸，单位 px
    barSize: 2,

    // 是否全局禁用拖拽调整
    disabled: false,

    // 是否开启延迟拖拽模式；开启后拖拽过程中仅移动预览线，松开指针后一次性应用新尺寸
    lazy: false,

    // 双击分隔条时是否快捷折叠或展开关联的可折叠面板
    dblClickCollapse: true,

    // 分隔条聚焦时按下键盘方向键单次调整的像素步长，单位 px
    keyboardStep: 10,

    // 自定义根容器附加样式类名
    // className: '',

    // 面板配置数组；用于数据驱动生成面板或按索引覆盖已有 DOM 面板配置
    // 每项支持：{ size, min, max, resizable, collapsible, collapsed, content, className }
    // panels: null,

    // 开始拖拽或键盘调整前的回调函数：({ instance, options, index, sizes, e }) => boolean | void
    // 返回 false 时可阻止本次拖拽或键盘调整
    // onResizeStart: null,

    // 拖拽或键盘调整进行中的回调函数：({ instance, options, index, sizes, e }) => void
    // 注：在 lazy 模式下，sizes 表示预览条对应的目标尺寸，此时尚未应用到面板 DOM
    // onResize: null,

    // 拖拽释放或键盘调整完成后的回调函数：({ instance, options, index, sizes, e }) => void
    // 单纯点击分隔条未发生位移时不会触发该回调
    // onResizeEnd: null,

    // 面板折叠或展开状态变化后的回调函数：({ instance, options, index, collapsed, sizes }) => void
    // onCollapse: null,
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-splitter',
      MOD_HORIZONTAL: 'lay-splitter-is-horizontal',
      MOD_VERTICAL: 'lay-splitter-is-vertical',
      PANEL: 'lay-splitter-panel',
      BAR: 'lay-splitter-bar',
      BAR_HANDLE: 'lay-splitter-bar-handle',
      BAR_BTNS: 'lay-splitter-bar-btns',
      COLLAPSE_BTN: 'lay-splitter-collapse-btn',
      GHOST_BAR: 'lay-splitter-ghost-bar',
      MOVING_MASK: 'lay-auxiliar-moving',

      CLASS_IS_COLLAPSED: 'lay-is-collapsed',
      CLASS_IS_DRAGGING: 'lay-is-dragging',
      CLASS_AT_START: 'lay-is-at-start',
      CLASS_AT_END: 'lay-is-at-end',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods([
      'getSizes',
      'setSizes',
      'collapse',
      'expand',
      'toggle',
      'refresh',
    ]);
  }

  /**
   * 渲染入口
   * 当无参调用 `splitter.render()` 时，仅批量初始化页面中尚未渲染过的 `.lay-splitter` 容器，
   * 避免将通过 JS 自定义配置渲染的已有实例误重置为默认选项。
   * @param {Object} [options] - 组件配置项
   * @returns {Splitter|Splitter[]}
   */
  static render(options) {
    if (!options || !lay.hasOwn(options, 'elem')) {
      const selector = this.options.elem;
      const attrId = this.CONST.ATTR_ID;
      const $unrendered = $(selector).filter(
        (_, el) => !el.hasAttribute(attrId),
      );
      if (!$unrendered.length) {
        return [];
      }
      return super.render({ ...options, elem: $unrendered });
    }
    return super.render(options);
  }

  // 内部状态
  #panelsMeta = [];
  #$panels = null;
  #$bars = null;
  #sizes = [];
  #bounds = [];
  #savedSizes = Object.create(null);
  #lastAvailableSize = 0;
  #currentOrientation = null;
  #pendingLayout = true;
  #isGeneratedPanels = false;
  #rawInitOptions = null;
  #reloadRawOptions = null;
  #addedRootClasses = new Set();
  #panelRestoreMap = new WeakMap();
  #rootTrackingInitialized = false;
  #cleanupDrag = null;
  #rafId = null;

  constructor(options) {
    super(options);
    this.#rawInitOptions = options || {};
    this.overrideArrayOptions(options);
  }

  /**
   * 重载组件实例，支持原地复用面板 DOM 并仅按需更新变更项
   * @param {Object} [options={}] - 重载配置项
   * @returns {Splitter}
   */
  reload(options = {}) {
    this.#reloadRawOptions = options;
    this.overrideArrayOptions(options);
    const result = super.reload(options);
    this.#reloadRawOptions = null;
    return result;
  }

  /**
   * 执行组件渲染与监听绑定
   * @param {{ isReload?: boolean }} [internalParams] - 内部渲染参数
   * @returns {void}
   */
  render({ isReload = false } = {}) {
    const options = this.options;
    const $elem = options.$elem;

    if (!$elem?.length) return;

    const wasPendingLayout = this.#pendingLayout;
    const prevOrientation = this.#currentOrientation;

    this.#stopActiveDrag();
    this.#normalizeOptions();

    if (isReload) {
      this.#pendingLayout = true;
    }

    this.#prepareDom({ isReload, wasPendingLayout, prevOrientation });
    this.#currentOrientation = options.orientation;
    this.#layoutPanels(true);
    this.#bindEvents();
    this.#observeContainer();
  }

  /**
   * 获取当前各面板尺寸数组
   * @param {'px'|'%'} [unit='px'] - 尺寸单位，可选 `'px'` 或 `'%'`
   * @returns {number[]} 各面板尺寸数组
   */
  getSizes(unit = 'px') {
    // 若此前在隐藏态修改了状态且当前容器已具备有效尺寸，立即同步一次布局
    if (this.#pendingLayout && this.#getAvailableSize() > 0) {
      this.#layoutPanels(true);
    }

    if (unit === '%') {
      const total = this.#getAvailableSize();
      if (total <= 0) return this.#sizes.map(() => 0);
      return this.#sizes.map((size) =>
        Number(((size / total) * 100).toFixed(2)),
      );
    }
    return this.#sizes.map((size) => Math.round(size * 100) / 100);
  }

  /**
   * 动态设置各面板尺寸（未传入的索引保持当前尺寸，设为 0 时保存原尺寸以支持后续展开）
   * @param {Array<number|string|undefined>} nextSizes - 新尺寸数组（支持 px 数字、'200px'、'30%'）
   * @returns {void}
   */
  setSizes(nextSizes) {
    if (!Array.isArray(nextSizes) || !this.#panelsMeta.length) return;

    const count = this.#panelsMeta.length;
    const collapseChanges = [];

    this.#panelsMeta.forEach((meta, idx) => {
      const hasInput = idx < nextSizes.length && nextSizes[idx] !== undefined;

      if (!hasInput) {
        // 未传入该项时：若已完成过布局且未折叠，保留其当前实际像素尺寸而非回退初始配置
        if (
          !this.#pendingLayout &&
          !meta.collapsed &&
          this.#sizes[idx] !== undefined
        ) {
          meta.size = this.#sizes[idx];
        }
        return;
      }

      const sizeVal = nextSizes[idx];
      if (sizeVal === null) return;

      const isZeroInput =
        sizeVal === 0 ||
        (typeof sizeVal === 'string' && /^(0|0px|0%)$/i.test(sizeVal.trim()));

      if (isZeroInput) {
        // 写入零值前记录当前非零尺寸，确保后续调用 expand() 可正常恢复
        if (!this.#pendingLayout && this.#sizes[idx] > 0) {
          this.#savedSizes[idx] = this.#sizes[idx];
        } else if (meta.size && meta.size !== 'auto' && meta.size !== 0) {
          this.#savedSizes[idx] = meta.size;
        }

        const colFlags = resolvePanelCollapsible(meta.collapsible, idx, count);
        if (colFlags.start || colFlags.end) {
          if (!meta.collapsed) {
            meta.collapsed = true;
            collapseChanges.push({ index: idx, collapsed: true });
          }
        }
        meta.size = 0;
      } else {
        if (meta.collapsed) {
          meta.collapsed = false;
          collapseChanges.push({ index: idx, collapsed: false });
        }
        meta.size = sizeVal;
      }
    });

    this.#pendingLayout = true;
    this.#layoutPanels(true);

    if (collapseChanges.length && this.options.onCollapse) {
      const currentSizes = this.getSizes();
      collapseChanges.forEach(({ index, collapsed }) => {
        this.options.onCollapse?.({
          instance: this,
          options: this.options,
          index,
          collapsed,
          sizes: currentSizes,
        });
      });
    }
  }

  /**
   * 折叠指定索引面板
   * @param {number} index - 面板索引
   * @param {number} [neighborIndex] - 优先承接空间的相邻面板索引
   * @returns {boolean} 是否成功发生折叠状态变更
   */
  collapse(index, neighborIndex) {
    return this.#setCollapsedState(Number(index), true, neighborIndex);
  }

  /**
   * 展开指定索引面板
   * @param {number} index - 面板索引
   * @param {number} [neighborIndex] - 优先出让空间的相邻面板索引
   * @returns {boolean} 是否成功发生展开状态变更
   */
  expand(index, neighborIndex) {
    return this.#setCollapsedState(Number(index), false, neighborIndex);
  }

  /**
   * 切换指定索引面板折叠态
   * @param {number} index - 面板索引
   * @param {number} [neighborIndex] - 优先交换空间的相邻面板索引
   * @returns {boolean} 是否成功发生状态变更
   */
  toggle(index, neighborIndex) {
    const idx = Number(index);
    const meta = this.#panelsMeta[idx];
    if (!meta) return false;
    return this.#setCollapsedState(idx, !meta.collapsed, neighborIndex);
  }

  /**
   * 手动触发容器测量与面板尺寸重算
   * @returns {void}
   */
  refresh() {
    this.#layoutPanels(this.#pendingLayout);
  }

  /**
   * 销毁组件实例，仅清理组件自身新增的节点、类名与内联样式，保留用户原始标记与属性
   * @returns {void}
   */
  destroy() {
    const options = this.options;
    const $elem = options.$elem;

    this.#stopActiveDrag();

    if ($elem?.[0]) {
      getSharedResizeObserver()?.unobserve($elem[0]);
      $elem.children(`.${CONST.BAR}, .${CONST.GHOST_BAR}`).remove();
      $elem
        .removeClass(
          `${CONST.MOD_HORIZONTAL} ${CONST.MOD_VERTICAL} ${CONST.CLASS_IS_DRAGGING}`,
        )
        .css('--lay-splitter-bar-size', '');

      this.#addedRootClasses.forEach((cls) => {
        $elem.removeClass(cls);
      });

      if (this.#isGeneratedPanels) {
        $elem.empty();
      } else if (this.#$panels) {
        this.#$panels.each((_, panelElem) => {
          const $panel = $(panelElem);
          const restoreInfo = this.#panelRestoreMap.get(panelElem);

          $panel.removeClass(CONST.CLASS_IS_COLLAPSED).removeAttr('inert');
          if ('inert' in panelElem) {
            panelElem.inert = false;
          }

          if (restoreInfo) {
            restoreInfo.addedClasses.forEach((cls) => $panel.removeClass(cls));
            $panel.css('flex', restoreInfo.prevFlex ?? '');
            if (restoreInfo.autoAssignedId) {
              $panel.removeAttr('id');
            }
          } else {
            $panel.css('flex', '');
          }
        });
      }
    }

    this.#panelsMeta = [];
    this.#$panels = null;
    this.#$bars = null;
    this.#sizes = [];
    this.#bounds = [];
    this.#savedSizes = Object.create(null);
    this.#addedRootClasses.clear();
    this.#rootTrackingInitialized = false;
    this.#pendingLayout = true;

    super.destroy();
  }

  /**
   * 规范化基础配置项
   * @returns {void}
   */
  #normalizeOptions() {
    const options = this.options;
    options.orientation =
      options.orientation === 'vertical' ? 'vertical' : 'horizontal';
    const barSize = Number(options.barSize);
    options.barSize = Number.isFinite(barSize) && barSize >= 0 ? barSize : 2;
    const step = Number(options.keyboardStep);
    options.keyboardStep = Number.isFinite(step) && step > 0 ? step : 10;
  }

  /**
   * 同步根容器由组件管理的类名（记录新增类名以便 destroy 精确还原）
   * @param {JQuery} $elem - 根容器
   * @param {string} [customClassName] - options.className
   */
  #syncRootClasses($elem, customClassName) {
    if (!this.#rootTrackingInitialized) {
      if (!$elem.hasClass(CONST.ELEM)) {
        $elem.addClass(CONST.ELEM);
        this.#addedRootClasses.add(CONST.ELEM);
      }
      this.#rootTrackingInitialized = true;
    }

    // 先移除上一轮由 options.className 添加的自定义类（保留 CONST.ELEM）
    for (const cls of Array.from(this.#addedRootClasses)) {
      if (cls !== CONST.ELEM) {
        $elem.removeClass(cls);
        this.#addedRootClasses.delete(cls);
      }
    }

    if (customClassName) {
      String(customClassName)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((cls) => {
          if (!$elem.hasClass(cls)) {
            $elem.addClass(cls);
            this.#addedRootClasses.add(cls);
          }
        });
    }
  }

  /**
   * 记录并同步单个面板的恢复信息、自定义类名与无障碍 ID
   * @param {Element} panelElem - 面板 DOM 节点
   * @param {string} [customClassName] - 面板 className
   * @param {number} idx - 面板索引
   */
  #syncPanelElementAttributes(panelElem, customClassName, idx) {
    const $panel = $(panelElem);
    let restoreInfo = this.#panelRestoreMap.get(panelElem);

    if (!restoreInfo) {
      restoreInfo = {
        prevFlex: panelElem.style?.flex || '',
        addedClasses: new Set(),
        autoAssignedId: false,
      };
      this.#panelRestoreMap.set(panelElem, restoreInfo);
    } else {
      // 清理上一轮动态附加的面板类名
      restoreInfo.addedClasses.forEach((cls) => $panel.removeClass(cls));
      restoreInfo.addedClasses.clear();
    }

    if (customClassName) {
      String(customClassName)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((cls) => {
          if (!$panel.hasClass(cls)) {
            $panel.addClass(cls);
            restoreInfo.addedClasses.add(cls);
          }
        });
    }

    if (!$panel.attr('id')) {
      $panel.attr('id', `lay-splitter-panel-${this.options.id}-${idx}`);
      restoreInfo.autoAssignedId = true;
    }
  }

  /**
   * 构建或增量复用面板与分隔条 DOM 结构
   * @param {{ isReload?: boolean, wasPendingLayout?: boolean, prevOrientation?: string|null }} params
   */
  #prepareDom({
    isReload = false,
    wasPendingLayout = true,
    prevOrientation = null,
  } = {}) {
    const options = this.options;
    const $elem = options.$elem;
    const isVertical = options.orientation === 'vertical';

    this.#syncRootClasses($elem, options.className);

    // 采用内部模式类控制样式，绝不修改或删除用户原始的 data-lay-orientation 属性
    $elem
      .toggleClass(CONST.MOD_VERTICAL, isVertical)
      .toggleClass(CONST.MOD_HORIZONTAL, !isVertical)
      .css('--lay-splitter-bar-size', `${options.barSize}px`);

    // 清理上次渲染生成的分隔条或预览条
    $elem.children(`.${CONST.BAR}, .${CONST.GHOST_BAR}`).remove();

    let $existingPanels = $elem.children(`.${CONST.PANEL}`);
    const hasPanelsArray = Array.isArray(options.panels);

    // 数据生成模式（首次容器无静态面板且提供了 panels 数组，或此前已处于数据生成模式）
    if (
      this.#isGeneratedPanels ||
      (!$existingPanels.length && hasPanelsArray)
    ) {
      this.#isGeneratedPanels = true;
      const targetPanels = hasPanelsArray ? options.panels : [];

      // 若重载传入空数组 panels: []，则清空全部面板
      if (!targetPanels.length) {
        $existingPanels.remove();
        this.#$panels = $();
        this.#panelsMeta = [];
        this.#sizes = [];
        this.#bounds = [];
        this.#$bars = $();
        return;
      }

      const rawReloadPanels =
        isReload && Array.isArray(this.#reloadRawOptions?.panels)
          ? this.#reloadRawOptions.panels
          : null;

      // 按索引原地复用已有面板节点，保护内部挂载的子组件与事件
      targetPanels.forEach((panelOpt, idx) => {
        const cfg = panelOpt || {};
        if (idx < $existingPanels.length) {
          const panelElem = $existingPanels[idx];
          this.#syncPanelElementAttributes(panelElem, cfg.className, idx);
          // 仅当本次 reload 显式传入了该面板的新 content 时才更新内容
          if (
            rawReloadPanels?.[idx] &&
            lay.hasOwn(rawReloadPanels[idx], 'content')
          ) {
            $(panelElem).empty().append(rawReloadPanels[idx].content);
          }
        } else {
          const $newPanel = $(`<div class="${CONST.PANEL}"></div>`);
          this.#syncPanelElementAttributes($newPanel[0], cfg.className, idx);
          if (cfg.content !== undefined) {
            $newPanel.append(cfg.content);
          }
          $elem.append($newPanel);
        }
      });

      // 移除超出新数组长度的尾部旧面板
      for (let k = targetPanels.length; k < $existingPanels.length; k++) {
        $existingPanels.eq(k).remove();
      }

      $existingPanels = $elem.children(`.${CONST.PANEL}`);
    }

    this.#$panels = $existingPanels;

    // 判定本次调用中哪些面板显式携带了新的 content
    const rawExplicitPanels = isReload
      ? Array.isArray(this.#reloadRawOptions?.panels)
        ? this.#reloadRawOptions.panels
        : null
      : Array.isArray(this.#rawInitOptions?.panels)
        ? this.#rawInitOptions.panels
        : null;

    // 合并每个面板的 dataset 配置与 options.panels[i] 配置
    this.#panelsMeta = $existingPanels
      .map((idx, panelElem) => {
        const datasetOpts = lay.parseDataset(panelElem);
        const jsPanelOpts = hasPanelsArray ? options.panels[idx] || {} : {};
        const prevMeta = isReload ? this.#panelsMeta[idx] : null;
        const merged = {
          min: 0,
          max: Infinity,
          resizable: true,
          collapsible: false,
          collapsed: false,
          ...datasetOpts,
          ...jsPanelOpts,
        };

        // 保留初始配置尺寸，供初始折叠面板在无历史记录时展开回退使用
        merged.initialSize = merged.size;

        // 若仅为修改非面板配置的重载，保留用户此前已交互的折叠状态，同方向下保留已拖拽尺寸
        if (isReload && prevMeta && !rawExplicitPanels) {
          merged.collapsed = prevMeta.collapsed;
          if (
            !wasPendingLayout &&
            prevOrientation === options.orientation &&
            this.#sizes[idx] !== undefined &&
            !prevMeta.collapsed
          ) {
            merged.size = this.#sizes[idx];
          }
        }

        if (!this.#isGeneratedPanels) {
          this.#syncPanelElementAttributes(
            panelElem,
            jsPanelOpts.className,
            idx,
          );
          if (
            rawExplicitPanels?.[idx] &&
            lay.hasOwn(rawExplicitPanels[idx], 'content')
          ) {
            $(panelElem).empty().append(rawExplicitPanels[idx].content);
          }
        }

        return merged;
      })
      .get();

    // 在相邻面板之间插入分隔条
    const barAriaOrientation = isVertical ? 'horizontal' : 'vertical';
    const panelCount = this.#panelsMeta.length;
    const barElems = [];

    for (let i = 0; i < panelCount - 1; i++) {
      const prevMeta = this.#panelsMeta[i];
      const nextMeta = this.#panelsMeta[i + 1];
      const prevId = $existingPanels.eq(i).attr('id');
      const nextId = $existingPanels.eq(i + 1).attr('id');
      const barDisabled =
        options.disabled ||
        prevMeta.resizable === false ||
        nextMeta.resizable === false;

      const $bar = $(
        `<div class="${CONST.BAR} lay-unselect" role="separator" aria-orientation="${barAriaOrientation}" aria-label="Resize panels" aria-controls="${prevId} ${nextId}" data-bar-index="${i}"></div>`,
      );

      if (barDisabled) {
        $bar.addClass(CONST.CLASS_IS_DISABLED);
      } else {
        $bar.attr('tabindex', '0');
      }

      const attachPrevCollapse = resolvePanelCollapsible(
        prevMeta.collapsible,
        i,
        panelCount,
      ).end;
      const attachNextCollapse = resolvePanelCollapsible(
        nextMeta.collapsible,
        i + 1,
        panelCount,
      ).start;

      if (attachPrevCollapse || attachNextCollapse) {
        const $btnsWrap = $(`<div class="${CONST.BAR_BTNS}"></div>`);
        if (attachPrevCollapse) {
          $btnsWrap.append(this.#createCollapseBtn(i, i + 1, 'prev', prevId));
        }
        if (attachNextCollapse) {
          $btnsWrap.append(this.#createCollapseBtn(i + 1, i, 'next', nextId));
        }
        $bar.append($btnsWrap);
      } else {
        $bar.append(`<div class="${CONST.BAR_HANDLE}"></div>`);
      }

      $existingPanels.eq(i).after($bar);
      barElems.push($bar[0]);
    }

    this.#$bars = $(barElems);
  }

  /**
   * 创建分隔条上的快捷折叠/展开按钮
   * @param {number} panelIndex - 被控制的面板索引
   * @param {number} neighborIndex - 优先交换空间的邻居面板索引
   * @param {'prev'|'next'} side - 面板相对于分隔条的方位
   * @param {string} panelId - 关联面板 DOM id
   * @returns {JQuery}
   */
  #createCollapseBtn(panelIndex, neighborIndex, side, panelId) {
    return $(
      `<button type="button" class="${CONST.COLLAPSE_BTN}" aria-controls="${panelId}" data-panel-index="${panelIndex}" data-neighbor-index="${neighborIndex}" data-side="${side}"><i class="lay-icon"></i></button>`,
    );
  }

  /**
   * 获取容器主轴像素总长度
   * @returns {number}
   */
  #getContainerSize() {
    const elem = this.options.$elem?.[0];
    if (!elem) return 0;
    return this.options.orientation === 'vertical'
      ? elem.clientHeight
      : elem.clientWidth;
  }

  /**
   * 获取扣除所有分隔条厚度后的可用主轴尺寸
   * @returns {number}
   */
  #getAvailableSize() {
    const containerSize = this.#getContainerSize();
    const barCount = Math.max(0, this.#panelsMeta.length - 1);
    return Math.max(0, containerSize - barCount * this.options.barSize);
  }

  /**
   * 计算并应用面板尺寸
   * @param {boolean} isInitial - 是否按配置重新分配（false 时按已有比例缩放）
   */
  #layoutPanels(isInitial = false) {
    const count = this.#panelsMeta.length;
    if (!count) return;

    const availableSize = this.#getAvailableSize();

    // 若容器当前不可见（宽/高为 0），保持 #pendingLayout = true 并设置 CSS 占位回退，待恢复可见后重算
    if (availableSize <= 0) {
      this.#pendingLayout = true;
      this.#applyFallbackUnmeasuredStyles();
      return;
    }

    const result =
      isInitial || this.#pendingLayout
        ? computeInitialSizes(this.#panelsMeta, availableSize)
        : rescaleSizes(this.#sizes, this.#panelsMeta, availableSize);

    this.#sizes = result.sizes;
    this.#bounds = result.bounds;
    this.#lastAvailableSize = availableSize;
    this.#pendingLayout = false;

    this.#applySizesToDom();
  }

  /**
   * 同步单个面板的折叠无障碍状态（inert 属性，防止 Tab 键聚焦折叠隐藏内容）
   * @param {JQuery} $panel - 面板 jQuery 对象
   * @param {boolean} isCollapsed - 是否折叠
   */
  #syncPanelCollapsedA11y($panel, isCollapsed) {
    const panelElem = $panel[0];
    $panel.toggleClass(CONST.CLASS_IS_COLLAPSED, isCollapsed);
    if (isCollapsed) {
      $panel.attr('inert', '');
    } else {
      $panel.removeAttr('inert');
    }
    if (panelElem && 'inert' in panelElem) {
      panelElem.inert = isCollapsed;
    }
  }

  /**
   * 当容器隐藏（宽/高为 0）时应用 CSS 初始比例占位样式
   */
  #applyFallbackUnmeasuredStyles() {
    this.#panelsMeta.forEach((meta, idx) => {
      const $panel = this.#$panels.eq(idx);
      const isCollapsed = Boolean(meta.collapsed);
      this.#syncPanelCollapsedA11y($panel, isCollapsed);

      if (isCollapsed) {
        $panel.css('flex', '0 0 0px');
      } else if (
        meta.size !== undefined &&
        meta.size !== null &&
        meta.size !== 'auto'
      ) {
        const basis =
          typeof meta.size === 'number' ? `${meta.size}px` : String(meta.size);
        $panel.css('flex', `0 0 ${basis}`);
      } else {
        $panel.css('flex', '1 1 0%');
      }
    });
    this.#syncCollapseButtons();
  }

  /**
   * 将当前 #sizes 像素值、边缘对齐状态与无障碍属性同步至 DOM
   */
  #applySizesToDom() {
    const availableSize = this.#lastAvailableSize || this.#getAvailableSize();
    const panelCount = this.#panelsMeta.length;

    this.#panelsMeta.forEach((meta, idx) => {
      const size = this.#sizes[idx] ?? 0;
      const isCollapsed = Boolean(meta.collapsed);
      const $panel = this.#$panels.eq(idx);

      this.#syncPanelCollapsedA11y($panel, isCollapsed);
      $panel.css('flex', `0 0 ${isCollapsed ? 0 : size}px`);
    });

    // 更新分隔条无障碍数值与贴边标记（防止折叠到 0 时悬浮按钮被容器边缘裁切）
    this.#$bars?.each((barIdx, barElem) => {
      const prevSize = this.#sizes[barIdx] ?? 0;
      const nextSize = this.#sizes[barIdx + 1] ?? 0;
      const pairTotal = prevSize + nextSize;
      const b0 = this.#bounds[barIdx] || { min: 0, max: Infinity };
      const b1 = this.#bounds[barIdx + 1] || { min: 0, max: Infinity };

      const canColPrev = resolvePanelCollapsible(
        this.#panelsMeta[barIdx]?.collapsible,
        barIdx,
        panelCount,
      ).end;
      const canColNext = resolvePanelCollapsible(
        this.#panelsMeta[barIdx + 1]?.collapsible,
        barIdx + 1,
        panelCount,
      ).start;

      const minPrevPx = canColPrev ? 0 : Math.max(b0.min, pairTotal - b1.max);
      const maxPrevPx = Math.min(b0.max, pairTotal - (canColNext ? 0 : b1.min));

      const toPct = (px) =>
        availableSize > 0
          ? clampNumber(Math.round((px / availableSize) * 100), 0, 100)
          : 0;

      barElem.setAttribute('aria-valuenow', String(toPct(prevSize)));
      barElem.setAttribute('aria-valuemin', String(toPct(minPrevPx)));
      barElem.setAttribute(
        'aria-valuemax',
        String(toPct(Math.max(minPrevPx, maxPrevPx))),
      );

      const isAtStart = barIdx === 0 && Boolean(this.#panelsMeta[0]?.collapsed);
      const isAtEnd =
        barIdx === panelCount - 2 &&
        Boolean(this.#panelsMeta[panelCount - 1]?.collapsed);

      $(barElem)
        .toggleClass(CONST.CLASS_AT_START, isAtStart)
        .toggleClass(CONST.CLASS_AT_END, isAtEnd);
    });

    this.#syncCollapseButtons();
  }

  /**
   * 同步分隔条上折叠按钮的箭头图标与无障碍属性
   */
  #syncCollapseButtons() {
    if (!this.#$bars) return;
    const isVertical = this.options.orientation === 'vertical';

    this.#$bars.find(`.${CONST.COLLAPSE_BTN}`).each((_, btnElem) => {
      const $btn = $(btnElem);
      const panelIdx = Number($btn.attr('data-panel-index'));
      const side = $btn.attr('data-side');
      const isCollapsed = Boolean(this.#panelsMeta[panelIdx]?.collapsed);

      // prev 面板未折叠时向左/上收起，已折叠时向右/下展开；next 面板相反
      let iconClass;
      if (side === 'prev') {
        iconClass = isVertical
          ? isCollapsed
            ? 'lay-icon-down'
            : 'lay-icon-up'
          : isCollapsed
            ? 'lay-icon-right'
            : 'lay-icon-left';
      } else {
        iconClass = isVertical
          ? isCollapsed
            ? 'lay-icon-up'
            : 'lay-icon-down'
          : isCollapsed
            ? 'lay-icon-left'
            : 'lay-icon-right';
      }

      $btn
        .toggleClass(CONST.CLASS_IS_ACTIVE, isCollapsed)
        .attr('aria-expanded', String(!isCollapsed))
        .attr('aria-label', isCollapsed ? 'Expand panel' : 'Collapse panel')
        .children('.lay-icon')
        .attr('class', `lay-icon ${iconClass}`);
    });
  }

  /**
   * 执行单个面板的折叠/展开切换（兼容隐藏容器安全延迟更新）
   * @param {number} panelIndex - 目标面板索引
   * @param {boolean} targetCollapsed - 目标折叠态
   * @param {number} [neighborIndex] - 优先交换空间的邻居面板索引
   * @returns {boolean}
   */
  #setCollapsedState(panelIndex, targetCollapsed, neighborIndex) {
    const count = this.#panelsMeta.length;
    if (panelIndex < 0 || panelIndex >= count || count < 2) return false;

    const targetMeta = this.#panelsMeta[panelIndex];
    if (Boolean(targetMeta.collapsed) === Boolean(targetCollapsed)) {
      return false;
    }

    const availableSize = this.#getAvailableSize();

    // 当容器处于隐藏态（宽高为 0）尚未可测量时，安全更新面板元数据并推迟像素计算至首次可见
    if (availableSize <= 0) {
      if (targetCollapsed) {
        const hasOtherExpanded = this.#panelsMeta.some(
          (m, idx) => idx !== panelIndex && !m.collapsed,
        );
        if (!hasOtherExpanded) return false;

        if (!this.#pendingLayout && this.#sizes[panelIndex] > 0) {
          this.#savedSizes[panelIndex] = this.#sizes[panelIndex];
        } else if (
          targetMeta.size &&
          targetMeta.size !== 'auto' &&
          targetMeta.size !== 0
        ) {
          this.#savedSizes[panelIndex] = targetMeta.size;
        }
      } else if (targetMeta.size === 0) {
        targetMeta.size =
          this.#savedSizes[panelIndex] ?? targetMeta.initialSize;
      }

      targetMeta.collapsed = targetCollapsed;
      this.#pendingLayout = true;
      this.#applyFallbackUnmeasuredStyles();

      this.options.onCollapse?.({
        instance: this,
        options: this.options,
        index: panelIndex,
        collapsed: targetCollapsed,
        sizes: this.getSizes(),
      });
      return true;
    }

    if (this.#pendingLayout) {
      this.#layoutPanels(true);
    }

    const transition = computeCollapseTransition({
      sizes: this.#sizes,
      bounds: this.#bounds,
      panelsMeta: this.#panelsMeta,
      savedSizes: this.#savedSizes,
      panelIndex,
      collapsed: targetCollapsed,
      neighborIndex,
      availableSize,
    });

    if (!transition.changed) return false;

    this.#sizes = transition.sizes;
    targetMeta.collapsed = targetCollapsed;
    if (!targetCollapsed && targetMeta.size === 0) {
      targetMeta.size = this.#sizes[panelIndex];
    }
    this.#applySizesToDom();

    this.options.onCollapse?.({
      instance: this,
      options: this.options,
      index: panelIndex,
      collapsed: targetCollapsed,
      sizes: this.getSizes(),
    });

    return true;
  }

  /**
   * 绑定分隔条拖拽、折叠按钮点击、双击与键盘无障碍事件
   */
  #bindEvents() {
    const options = this.options;
    const $elem = options.$elem;
    const elemNode = $elem[0];
    const ns = CONST.EVENT_NAMESPACE;

    $elem.off(ns);

    // 仅处理归属于当前 Splitter 实例的直接分隔条（防止嵌套 Splitter 冒泡串扰）
    const isOwnBar = (barNode) => barNode?.parentElement === elemNode;

    // 阻止折叠按钮的 pointerdown 冒泡触发分隔条拖拽
    $elem.on(`pointerdown${ns}`, `.${CONST.COLLAPSE_BTN}`, (e) => {
      const barNode = e.currentTarget.closest(`.${CONST.BAR}`);
      if (!isOwnBar(barNode)) return;
      e.stopPropagation();
    });

    // 点击折叠/展开按钮
    $elem.on(`click${ns}`, `.${CONST.COLLAPSE_BTN}`, (e) => {
      const barNode = e.currentTarget.closest(`.${CONST.BAR}`);
      if (!isOwnBar(barNode)) return;
      e.preventDefault();
      e.stopPropagation();
      const $btn = $(e.currentTarget);
      const panelIdx = Number($btn.attr('data-panel-index'));
      const neighborIdx = Number($btn.attr('data-neighbor-index'));
      this.toggle(panelIdx, neighborIdx);
    });

    // 双击分隔条快捷切换相邻可折叠面板
    if (options.dblClickCollapse) {
      $elem.on(`dblclick${ns}`, `.${CONST.BAR}`, (e) => {
        if (!isOwnBar(e.currentTarget)) return;
        if ($(e.target).closest(`.${CONST.COLLAPSE_BTN}`).length) return;
        const barIndex = Number($(e.currentTarget).attr('data-bar-index'));
        this.#handleBarQuickToggle(barIndex);
      });
    }

    // 键盘方向键 / Home / End 微调 & Enter 快捷折叠
    $elem.on(`keydown${ns}`, `.${CONST.BAR}`, (e) => {
      // 仅响应焦点位于分隔条自身时的按键，避免拦截内部折叠按钮上的 Enter/Space
      if (e.target !== e.currentTarget) return;
      if (!isOwnBar(e.currentTarget)) return;

      const $bar = $(e.currentTarget);
      if ($bar.hasClass(CONST.CLASS_IS_DISABLED) || options.disabled) return;

      const barIndex = Number($bar.attr('data-bar-index'));
      const isVertical = options.orientation === 'vertical';

      if (e.key === 'Enter') {
        if (this.#handleBarQuickToggle(barIndex)) {
          e.preventDefault();
        }
        return;
      }

      if (this.#getAvailableSize() <= 0) return;
      if (this.#pendingLayout) {
        this.#layoutPanels(true);
      }

      let rawDelta = 0;
      if (!isVertical && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        rawDelta =
          e.key === 'ArrowRight' ? options.keyboardStep : -options.keyboardStep;
      } else if (isVertical && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        rawDelta =
          e.key === 'ArrowDown' ? options.keyboardStep : -options.keyboardStep;
      } else if (e.key === 'Home') {
        rawDelta = -(this.#sizes[barIndex] + this.#sizes[barIndex + 1]);
      } else if (e.key === 'End') {
        rawDelta = this.#sizes[barIndex] + this.#sizes[barIndex + 1];
      }

      if (!rawDelta) return;
      e.preventDefault();

      const canStart = options.onResizeStart?.({
        instance: this,
        options,
        index: barIndex,
        sizes: this.getSizes(),
        e,
      });
      if (canStart === false) return;

      const startPrevCollapsed = Boolean(this.#panelsMeta[barIndex]?.collapsed);
      const startNextCollapsed = Boolean(
        this.#panelsMeta[barIndex + 1]?.collapsed,
      );

      // 预先记录未折叠尺寸，以便键盘步进触发吸附折叠后仍可还原
      if (!startPrevCollapsed && this.#sizes[barIndex] > 0) {
        this.#savedSizes[barIndex] = this.#sizes[barIndex];
      }
      if (!startNextCollapsed && this.#sizes[barIndex + 1] > 0) {
        this.#savedSizes[barIndex + 1] = this.#sizes[barIndex + 1];
      }

      const stepResult = computeDragStep({
        startSizes: this.#sizes,
        bounds: this.#bounds,
        panelsMeta: this.#panelsMeta,
        barIndex,
        rawDelta,
      });

      if (stepResult.delta === 0) return;

      options.onResize?.({
        instance: this,
        options,
        index: barIndex,
        sizes: stepResult.sizes.map((s) => Math.round(s * 100) / 100),
        e,
      });

      this.#commitStepResult(
        barIndex,
        stepResult,
        startPrevCollapsed,
        startNextCollapsed,
        e,
      );
    });

    // Pointer 拖拽调整
    $elem.on(`pointerdown${ns}`, `.${CONST.BAR}`, (e) => {
      if (!isOwnBar(e.currentTarget)) return;
      const origEvent = e.originalEvent || e;
      if (origEvent.pointerType === 'mouse' && origEvent.button !== 0) return;

      const $bar = $(e.currentTarget);
      if ($bar.hasClass(CONST.CLASS_IS_DISABLED) || options.disabled) return;
      if ($(e.target).closest(`.${CONST.COLLAPSE_BTN}`).length) return;

      const barIndex = Number($bar.attr('data-bar-index'));
      this.#startDrag(origEvent, $bar, barIndex);
    });
  }

  /**
   * 双击或按 Enter 时切换分隔条关联的可折叠面板（仅处理允许在当前侧折叠的面板）
   * @param {number} barIndex - 分隔条索引
   * @returns {boolean}
   */
  #handleBarQuickToggle(barIndex) {
    const count = this.#panelsMeta.length;
    const prevMeta = this.#panelsMeta[barIndex];
    const nextMeta = this.#panelsMeta[barIndex + 1];

    const canPrev = resolvePanelCollapsible(
      prevMeta?.collapsible,
      barIndex,
      count,
    ).end;
    const canNext = resolvePanelCollapsible(
      nextMeta?.collapsible,
      barIndex + 1,
      count,
    ).start;

    // 优先展开已处于折叠态的相邻可折叠面板
    if (canPrev && prevMeta?.collapsed) {
      return this.expand(barIndex, barIndex + 1);
    }
    if (canNext && nextMeta?.collapsed) {
      return this.expand(barIndex + 1, barIndex);
    }

    // 否则折叠允许在当前侧收起的相邻面板
    if (canPrev) {
      return this.collapse(barIndex, barIndex + 1);
    }
    if (canNext) {
      return this.collapse(barIndex + 1, barIndex);
    }

    return false;
  }

  /**
   * 启动 Pointer 拖拽会话
   * @param {PointerEvent} startEvent - pointerdown 原生事件
   * @param {JQuery} $bar - 当前分隔条
   * @param {number} barIndex - 分隔条索引
   */
  #startDrag(startEvent, $bar, barIndex) {
    this.#stopActiveDrag();

    if (this.#getAvailableSize() <= 0) return;
    if (this.#pendingLayout) {
      this.#layoutPanels(true);
    }

    const options = this.options;
    const $elem = options.$elem;
    const isVertical = options.orientation === 'vertical';
    const basePayload = {
      instance: this,
      options,
      index: barIndex,
    };

    // 执行 onResizeStart 回调，返回 false 时中止拖拽
    const canStart = options.onResizeStart?.({
      ...basePayload,
      sizes: this.getSizes(),
      e: startEvent,
    });
    if (canStart === false) return;

    startEvent.preventDefault();

    const barNode = $bar[0];
    // 上方 preventDefault() 会阻止浏览器默认的鼠标按下聚焦行为，此处手动聚焦以支持点击/拖拽后直接用方向键微调
    barNode.focus?.({ preventScroll: true });
    const pointerId = startEvent.pointerId;
    if (startEvent.isTrusted && pointerId !== undefined) {
      barNode.setPointerCapture?.(pointerId);
    }

    const startCoord = isVertical ? startEvent.clientY : startEvent.clientX;
    const startSizes = this.#sizes.slice();
    const startPrevCollapsed = Boolean(this.#panelsMeta[barIndex]?.collapsed);
    const startNextCollapsed = Boolean(
      this.#panelsMeta[barIndex + 1]?.collapsed,
    );

    // 若起始未折叠，预先记录尺寸以备拖拽吸附折叠后可还原
    if (!startPrevCollapsed && startSizes[barIndex] > 0) {
      this.#savedSizes[barIndex] = startSizes[barIndex];
    }
    if (!startNextCollapsed && startSizes[barIndex + 1] > 0) {
      this.#savedSizes[barIndex + 1] = startSizes[barIndex + 1];
    }

    // 挂载全屏防穿透遮罩，锁定全局拖拽光标并屏蔽 iframe/文本选中干扰
    const cursor = isVertical ? 'row-resize' : 'col-resize';
    const $mask = $(`<div class="${CONST.MOVING_MASK}"></div>`).css(
      'cursor',
      cursor,
    );
    $('body').append($mask);

    $elem.addClass(CONST.CLASS_IS_DRAGGING);
    $bar.addClass(CONST.CLASS_IS_ACTIVE);

    // Lazy 模式创建预览指示条
    let $ghostBar = null;
    if (options.lazy) {
      const barRect = barNode.getBoundingClientRect();
      const elemRect = $elem[0].getBoundingClientRect();
      const initialOffset = isVertical
        ? barRect.top - elemRect.top
        : barRect.left - elemRect.left;

      $ghostBar = $(`<div class="${CONST.GHOST_BAR}"></div>`).css(
        isVertical
          ? { top: `${initialOffset}px`, height: `${options.barSize}px` }
          : { left: `${initialOffset}px`, width: `${options.barSize}px` },
      );
      $elem.append($ghostBar);
    }

    let hasMoved = false;
    let latestStep = {
      sizes: startSizes,
      delta: 0,
      prevCollapsed: startPrevCollapsed,
      nextCollapsed: startNextCollapsed,
    };

    const onPointerMove = (moveEvent) => {
      if (pointerId !== undefined && moveEvent.pointerId !== pointerId) return;

      const currentCoord = isVertical ? moveEvent.clientY : moveEvent.clientX;
      const rawDelta = currentCoord - startCoord;
      if (!hasMoved && rawDelta === 0) return;
      hasMoved = true;

      latestStep = computeDragStep({
        startSizes,
        bounds: this.#bounds,
        panelsMeta: this.#panelsMeta,
        barIndex,
        rawDelta,
      });

      if (this.#rafId) {
        cancelAnimationFrame(this.#rafId);
      }

      this.#rafId = requestAnimationFrame(() => {
        this.#rafId = null;
        if (options.lazy && $ghostBar) {
          const translateProp = isVertical
            ? `translateY(${latestStep.delta}px)`
            : `translateX(${latestStep.delta}px)`;
          $ghostBar.css('transform', translateProp);
        } else {
          this.#sizes = latestStep.sizes;
          this.#panelsMeta[barIndex].collapsed = latestStep.prevCollapsed;
          this.#panelsMeta[barIndex + 1].collapsed = latestStep.nextCollapsed;
          this.#applySizesToDom();
        }

        options.onResize?.({
          ...basePayload,
          sizes: latestStep.sizes.map((s) => Math.round(s * 100) / 100),
          e: moveEvent,
        });
      });
    };

    const onPointerEnd = (endEvent) => {
      if (pointerId !== undefined && endEvent.pointerId !== pointerId) return;
      const didMove = hasMoved;
      const finalStep = latestStep;
      this.#stopActiveDrag();

      // 单纯点击或双击分隔条未发生指针移动时，不提交拖拽也不触发 onResizeEnd
      if (!didMove) return;

      this.#commitStepResult(
        barIndex,
        finalStep,
        startPrevCollapsed,
        startNextCollapsed,
        endEvent,
      );
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerEnd);
    document.addEventListener('pointercancel', onPointerEnd);

    this.#cleanupDrag = () => {
      if (this.#rafId) {
        cancelAnimationFrame(this.#rafId);
        this.#rafId = null;
      }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerEnd);
      document.removeEventListener('pointercancel', onPointerEnd);

      if (pointerId !== undefined && barNode.hasPointerCapture?.(pointerId)) {
        barNode.releasePointerCapture(pointerId);
      }

      $ghostBar?.remove();
      $mask.remove();
      $bar.removeClass(CONST.CLASS_IS_ACTIVE);
      $elem.removeClass(CONST.CLASS_IS_DRAGGING);
      this.#cleanupDrag = null;
    };
  }

  /**
   * 提交单次拖拽或键盘步进的最终状态并派发事件
   */
  #commitStepResult(
    barIndex,
    stepResult,
    startPrevCollapsed,
    startNextCollapsed,
    event,
  ) {
    const options = this.options;
    this.#sizes = stepResult.sizes;
    this.#panelsMeta[barIndex].collapsed = stepResult.prevCollapsed;
    this.#panelsMeta[barIndex + 1].collapsed = stepResult.nextCollapsed;
    this.#applySizesToDom();

    const currentSizes = this.getSizes();

    if (stepResult.prevCollapsed !== startPrevCollapsed) {
      options.onCollapse?.({
        instance: this,
        options,
        index: barIndex,
        collapsed: stepResult.prevCollapsed,
        sizes: currentSizes,
      });
    }
    if (stepResult.nextCollapsed !== startNextCollapsed) {
      options.onCollapse?.({
        instance: this,
        options,
        index: barIndex + 1,
        collapsed: stepResult.nextCollapsed,
        sizes: currentSizes,
      });
    }

    options.onResizeEnd?.({
      instance: this,
      options,
      index: barIndex,
      sizes: currentSizes,
      e: event,
    });
  }

  /**
   * 终止当前正在进行的拖拽清理句柄
   */
  #stopActiveDrag() {
    if (this.#cleanupDrag) {
      this.#cleanupDrag();
    }
  }

  /**
   * 监听根容器尺寸变化并按比例重算面板尺寸
   */
  #observeContainer() {
    const elem = this.options.$elem?.[0];
    if (!elem) return;

    getSharedResizeObserver()?.observe(elem, () => {
      // 拖拽进行中忽略容器尺寸抖动回调，避免覆盖拖拽状态
      if (this.#cleanupDrag) return;

      const availableSize = this.#getAvailableSize();
      if (availableSize <= 0) return;

      // 从隐藏态恢复可见或存在待应用的尺寸修改时执行初始分配；否则若尺寸变化则按比例缩放
      if (this.#pendingLayout) {
        this.#layoutPanels(true);
      } else if (Math.abs(availableSize - this.#lastAvailableSize) > 0.5) {
        this.#layoutPanels(false);
      }
    });
  }
}

const CONST = Splitter.CONST;

export { Splitter as splitter };
