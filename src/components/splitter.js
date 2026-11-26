/**
 * splitter
 * 分隔面板组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

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
 * @returns {number}
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
 * @returns {number|null}
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
 * 解析单个面板的最小/最大像素边界
 * @param {Object} panelMeta - 面板配置
 * @param {number} availableSize - 可用主轴总尺寸（px）
 * @returns {{ min: number, max: number }}
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
 * 在指定候选面板集合中按比例分摊尺寸差值，确保遵守 [min, max] 约束
 * @param {number[]} sizes - 当前尺寸数组（原地修改）
 * @param {Array<{min: number, max: number}>} bounds - 边界数组
 * @param {number[]} candidateIndices - 允许参与调整的面板索引列表
 * @param {number} targetTotal - 期望总尺寸
 */
const distributeDiffAmong = (sizes, bounds, candidateIndices, targetTotal) => {
  const EPSILON = 0.01;

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
  const i = barIndex;
  const j = barIndex + 1;
  const sizes = startSizes.slice();
  const prevMeta = panelsMeta[i];
  const nextMeta = panelsMeta[j];

  if (
    !prevMeta ||
    !nextMeta ||
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

  const canCollapsePrev = Boolean(prevMeta.collapsible);
  const canCollapseNext = Boolean(nextMeta.collapsible);

  const desiredPrev = s0 + rawDelta;
  const desiredNext = s1 - rawDelta;

  // 向左/上拖过阈值触发吸附折叠 prev 面板
  const prevSnapThreshold = b0.min > 0 ? b0.min * 0.4 : 0;
  if (
    canCollapsePrev &&
    desiredPrev <= prevSnapThreshold &&
    pairTotal <= b1.max
  ) {
    sizes[i] = 0;
    sizes[j] = pairTotal;
    return {
      sizes,
      delta: -s0,
      prevCollapsed: true,
      nextCollapsed: pairTotal === 0 ? Boolean(nextMeta.collapsed) : false,
    };
  }

  // 向右/下拖过阈值触发吸附折叠 next 面板
  const nextSnapThreshold = b1.min > 0 ? b1.min * 0.4 : 0;
  if (
    canCollapseNext &&
    desiredNext <= nextSnapThreshold &&
    pairTotal <= b0.max
  ) {
    sizes[i] = pairTotal;
    sizes[j] = 0;
    return {
      sizes,
      delta: s1,
      prevCollapsed: pairTotal === 0 ? Boolean(prevMeta.collapsed) : false,
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
 * 计算单面板折叠或展开后的尺寸更新
 * @param {Object} params
 * @param {number[]} params.sizes - 当前尺寸数组
 * @param {Array<{min: number, max: number}>} params.bounds - 边界数组
 * @param {Array<Object>} params.panelsMeta - 面板元数据
 * @param {Object<number, number>} params.savedSizes - 折叠前保存的历史尺寸记录
 * @param {number} params.panelIndex - 目标面板索引
 * @param {boolean} params.collapsed - 目标折叠状态（true: 折叠, false: 展开）
 * @param {number} [params.neighborIndex] - 指定空间交换的相邻面板索引
 * @param {number} [params.availableSize] - 当前容器可用总尺寸
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

  if (panelIndex < 0 || panelIndex >= count || count < 2) {
    return { changed: false, sizes: nextSizes, neighborIndex: -1 };
  }

  const targetMeta = panelsMeta[panelIndex];
  if (Boolean(targetMeta.collapsed) === Boolean(collapsed)) {
    return { changed: false, sizes: nextSizes, neighborIndex: -1 };
  }

  // 选择相邻面板：优先使用显式传入的邻居；否则首尾面板取内侧邻居，中间面板优先取后一个未折叠邻居
  let neighbor = neighborIndex;
  if (neighbor === undefined || neighbor < 0 || neighbor >= count) {
    if (panelIndex === count - 1) {
      neighbor = panelIndex - 1;
    } else if (!panelsMeta[panelIndex + 1]?.collapsed) {
      neighbor = panelIndex + 1;
    } else if (panelIndex > 0 && !panelsMeta[panelIndex - 1]?.collapsed) {
      neighbor = panelIndex - 1;
    } else {
      neighbor = panelIndex + 1;
    }
  }

  const pairTotal = nextSizes[panelIndex] + nextSizes[neighbor];

  if (collapsed) {
    // 折叠目标面板：校验邻居是否能容纳释放的空间
    if (pairTotal > bounds[neighbor].max) {
      return { changed: false, sizes: nextSizes, neighborIndex: neighbor };
    }
    if (nextSizes[panelIndex] > 0) {
      savedSizes[panelIndex] = nextSizes[panelIndex];
    }
    nextSizes[panelIndex] = 0;
    nextSizes[neighbor] = pairTotal;
    return { changed: true, sizes: nextSizes, neighborIndex: neighbor };
  }

  // 展开目标面板：优先恢复历史尺寸 -> 配置初始尺寸 -> 默认均分/最小尺寸
  const configuredSize = parseSizeValue(targetMeta.size, availableSize, null);
  const fallbackSize =
    configuredSize ??
    Math.max(bounds[panelIndex].min || 0, pairTotal / 2 || 100);
  const desiredRestore = savedSizes[panelIndex] ?? fallbackSize;

  const neighborMin = panelsMeta[neighbor].collapsed ? 0 : bounds[neighbor].min;
  const maxAvailableFromNeighbor = Math.max(0, pairTotal - neighborMin);
  const restoredSize = clampNumber(
    desiredRestore,
    Math.min(bounds[panelIndex].min, maxAvailableFromNeighbor),
    Math.min(bounds[panelIndex].max, maxAvailableFromNeighbor),
  );

  if (restoredSize <= 0 && bounds[panelIndex].min > 0) {
    return { changed: false, sizes: nextSizes, neighborIndex: neighbor };
  }

  nextSizes[panelIndex] = restoredSize;
  nextSizes[neighbor] = pairTotal - restoredSize;
  return { changed: true, sizes: nextSizes, neighborIndex: neighbor };
};

export class Splitter extends Component {
  static componentName = 'splitter';

  // 默认配置项
  static options = {
    elem: '.lay-splitter',
    orientation: 'horizontal', // 分割排列方向：horizontal | vertical
    barSize: 2, // 分隔条轨道尺寸（px）
    disabled: false, // 是否全局禁用拖拽
    lazy: false, // 是否开启延迟拖拽预览模式
    dblClickCollapse: true, // 双击分隔条是否快捷切换折叠
    keyboardStep: 10, // 键盘方向键单步调整像素值（px）
    // panels: null, // 面板配置项数组
    // onResizeStart: null,
    // onResize: null,
    // onResizeEnd: null,
    // onCollapse: null,
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-splitter',
      PANEL: 'lay-splitter-panel',
      BAR: 'lay-splitter-bar',
      BAR_HANDLE: 'lay-splitter-bar-handle',
      COLLAPSE_BTN: 'lay-splitter-collapse-btn',
      GHOST_BAR: 'lay-splitter-ghost-bar',
      MOVING_MASK: 'lay-auxiliar-moving',

      CLASS_IS_COLLAPSED: 'lay-is-collapsed',
      CLASS_IS_DRAGGING: 'lay-is-dragging',
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

  // 内部状态
  #panelsMeta = [];
  #$panels = null;
  #$bars = null;
  #sizes = [];
  #bounds = [];
  #savedSizes = Object.create(null);
  #lastAvailableSize = 0;
  #isLayoutInitialized = false;
  #isGeneratedPanels = false;
  #cleanupDrag = null;
  #rafId = null;

  constructor(options) {
    super(options);
    this.overrideArrayOptions(options);
  }

  /**
   * 重写 reload，确保传入的 panels 数组完整覆盖旧数组
   * @param {Object} options - 重载配置项
   */
  reload(options = {}) {
    this.overrideArrayOptions(options);
    return super.reload(options);
  }

  /**
   * 渲染组件
   * @param {{ isReload?: boolean }} [internalParams]
   * @returns {void}
   */
  render({ isReload = false } = {}) {
    const options = this.options;
    const $elem = options.$elem;

    if (!$elem?.length) return;

    this.#stopActiveDrag();
    this.#normalizeOptions();

    if (isReload) {
      this.#savedSizes = Object.create(null);
      this.#isLayoutInitialized = false;
    }

    this.#prepareDom();
    this.#layoutPanels(true);
    this.#bindEvents();
    this.#observeContainer();
  }

  /**
   * 获取当前各面板尺寸
   * @param {'px'|'%'} [unit='px'] - 返回单位
   * @returns {number[]}
   */
  getSizes(unit = 'px') {
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
   * 动态设置各面板尺寸
   * @param {Array<number|string>} nextSizes - 新尺寸数组（支持 px 数字、'200px'、'30%'）
   * @returns {void}
   */
  setSizes(nextSizes) {
    if (!Array.isArray(nextSizes) || !this.#panelsMeta.length) return;

    nextSizes.forEach((sizeVal, idx) => {
      if (idx >= this.#panelsMeta.length) return;
      const meta = this.#panelsMeta[idx];
      if (sizeVal === 0 || sizeVal === '0' || sizeVal === '0px') {
        if (meta.collapsible) {
          meta.collapsed = true;
        }
        meta.size = 0;
      } else if (sizeVal !== undefined && sizeVal !== null) {
        meta.collapsed = false;
        meta.size = sizeVal;
      }
    });

    this.#layoutPanels(true);
  }

  /**
   * 折叠指定索引面板
   * @param {number} index - 面板索引
   * @param {number} [neighborIndex] - 指定吸收空间的相邻面板索引
   * @returns {boolean} 是否发生状态变更
   */
  collapse(index, neighborIndex) {
    return this.#setCollapsedState(Number(index), true, neighborIndex);
  }

  /**
   * 展开指定索引面板
   * @param {number} index - 面板索引
   * @param {number} [neighborIndex] - 指定出让空间的相邻面板索引
   * @returns {boolean} 是否发生状态变更
   */
  expand(index, neighborIndex) {
    return this.#setCollapsedState(Number(index), false, neighborIndex);
  }

  /**
   * 切换指定索引面板折叠态
   * @param {number} index - 面板索引
   * @param {number} [neighborIndex] - 相邻面板索引
   * @returns {boolean} 是否发生状态变更
   */
  toggle(index, neighborIndex) {
    const idx = Number(index);
    const meta = this.#panelsMeta[idx];
    if (!meta) return false;
    return this.#setCollapsedState(idx, !meta.collapsed, neighborIndex);
  }

  /**
   * 手动刷新计算面板布局
   * @returns {void}
   */
  refresh() {
    this.#layoutPanels(!this.#isLayoutInitialized);
  }

  /**
   * 销毁组件实例并清理 DOM 与监听
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
        .removeClass(`${CONST.ELEM} ${CONST.CLASS_IS_DRAGGING}`)
        .removeAttr('data-lay-orientation')
        .css('--lay-splitter-bar-size', '');

      if (this.#isGeneratedPanels) {
        $elem.empty();
      } else {
        this.#$panels?.removeClass(CONST.CLASS_IS_COLLAPSED).css('flex', '');
      }
    }

    this.#panelsMeta = [];
    this.#$panels = null;
    this.#$bars = null;
    this.#sizes = [];
    this.#bounds = [];
    this.#savedSizes = Object.create(null);
    this.#isLayoutInitialized = false;

    super.destroy();
  }

  /**
   * 规范化配置项
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
   * 构建面板与分隔条 DOM 结构
   */
  #prepareDom() {
    const options = this.options;
    const $elem = options.$elem;

    $elem
      .addClass(CONST.ELEM)
      .attr('data-lay-orientation', options.orientation)
      .css('--lay-splitter-bar-size', `${options.barSize}px`);

    if (options.className) {
      $elem.addClass(options.className);
    }

    // 清理可能由上次渲染生成的分隔条或预览条
    $elem.children(`.${CONST.BAR}, .${CONST.GHOST_BAR}`).remove();

    // 检查是否已有静态子面板（必须仅匹配直接子代，保证嵌套 Splitter 互不干扰）
    let $existingPanels = $elem.children(`.${CONST.PANEL}`);

    // 若为纯数据生成模式（或此前已由数据生成）
    if (
      (!$existingPanels.length || this.#isGeneratedPanels) &&
      Array.isArray(options.panels) &&
      options.panels.length
    ) {
      this.#isGeneratedPanels = true;
      $elem.empty();
      options.panels.forEach((panelOpt) => {
        const $panel = $(`<div class="${CONST.PANEL}"></div>`);
        if (panelOpt?.className) {
          $panel.addClass(panelOpt.className);
        }
        if (panelOpt?.content !== undefined) {
          $panel.append(panelOpt.content);
        }
        $elem.append($panel);
      });
      $existingPanels = $elem.children(`.${CONST.PANEL}`);
    }

    this.#$panels = $existingPanels;

    // 合并每个面板的 dataset 配置与 options.panels[i] 配置
    this.#panelsMeta = $existingPanels
      .map((idx, panelElem) => {
        const datasetOpts = lay.parseDataset(panelElem);
        const jsPanelOpts = Array.isArray(options.panels)
          ? options.panels[idx] || {}
          : {};
        const merged = {
          min: 0,
          max: Infinity,
          resizable: true,
          collapsible: false,
          collapsed: false,
          ...datasetOpts,
          ...jsPanelOpts,
        };

        if (!this.#isGeneratedPanels && jsPanelOpts.content !== undefined) {
          $(panelElem).html(jsPanelOpts.content);
        }
        if (!this.#isGeneratedPanels && jsPanelOpts.className) {
          $(panelElem).addClass(jsPanelOpts.className);
        }

        return merged;
      })
      .get();

    // 在相邻面板之间插入分隔条
    const isVertical = options.orientation === 'vertical';
    const barAriaOrientation = isVertical ? 'horizontal' : 'vertical';
    const panelCount = this.#panelsMeta.length;
    const barElems = [];

    for (let i = 0; i < panelCount - 1; i++) {
      const prevMeta = this.#panelsMeta[i];
      const nextMeta = this.#panelsMeta[i + 1];
      const barDisabled =
        options.disabled ||
        prevMeta.resizable === false ||
        nextMeta.resizable === false;

      const $bar = $(
        `<div class="${CONST.BAR} lay-unselect" role="separator" aria-orientation="${barAriaOrientation}" data-bar-index="${i}"></div>`,
      );

      if (barDisabled) {
        $bar.addClass(CONST.CLASS_IS_DISABLED);
      } else {
        $bar.attr('tabindex', '0');
      }

      const $handle = $(`<div class="${CONST.BAR_HANDLE}"></div>`);
      $bar.append($handle);

      // 判定哪些可折叠面板挂载在当前分隔条上：
      // 面板 k (k < N - 1) 默认挂载在 bar[k]（除非显式设为 'start'）；末面板 N - 1 默认挂载在 bar[N - 2]（或任意设为 'start' 的后置面板）
      const attachPrevCollapse =
        prevMeta.collapsible === true || prevMeta.collapsible === 'end';
      const attachNextCollapse =
        nextMeta.collapsible === 'start' ||
        (i === panelCount - 2 && nextMeta.collapsible === true);

      if (attachPrevCollapse) {
        $bar.prepend(this.#createCollapseBtn(i, i + 1, 'prev'));
      }
      if (attachNextCollapse) {
        $bar.append(this.#createCollapseBtn(i + 1, i, 'next'));
      }

      $existingPanels.eq(i).after($bar);
      barElems.push($bar[0]);
    }

    this.#$bars = $(barElems);
  }

  /**
   * 创建分隔条上的快捷折叠/展开按钮
   * @param {number} panelIndex - 被控制的面板索引
   * @param {number} neighborIndex - 空间交换的邻居面板索引
   * @param {'prev'|'next'} side - 面板相对于分隔条的方位
   * @returns {JQuery}
   */
  #createCollapseBtn(panelIndex, neighborIndex, side) {
    return $(
      `<button type="button" class="${CONST.COLLAPSE_BTN}" data-panel-index="${panelIndex}" data-neighbor-index="${neighborIndex}" data-side="${side}"><i class="lay-icon"></i></button>`,
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
   * @param {boolean} isInitial - 是否按初始配置分配（false 时按比例缩放）
   */
  #layoutPanels(isInitial = false) {
    const count = this.#panelsMeta.length;
    if (!count) return;

    const availableSize = this.#getAvailableSize();

    // 若容器当前不可见（如位于未激活的 Tab 内，尺寸为 0），预设 CSS 回退比例并等待 ResizeObserver 激活后首次初始化
    if (availableSize <= 0) {
      this.#applyFallbackUnmeasuredStyles();
      return;
    }

    const result =
      isInitial || !this.#isLayoutInitialized
        ? computeInitialSizes(this.#panelsMeta, availableSize)
        : rescaleSizes(this.#sizes, this.#panelsMeta, availableSize);

    this.#sizes = result.sizes;
    this.#bounds = result.bounds;
    this.#lastAvailableSize = availableSize;
    this.#isLayoutInitialized = true;

    this.#applySizesToDom();
  }

  /**
   * 当容器初始隐藏（宽/高为 0）时应用优雅的 CSS 初始占位样式
   */
  #applyFallbackUnmeasuredStyles() {
    this.#panelsMeta.forEach((meta, idx) => {
      const $panel = this.#$panels.eq(idx);
      if (meta.collapsed) {
        $panel.addClass(CONST.CLASS_IS_COLLAPSED).css('flex', '0 0 0px');
      } else if (
        meta.size !== undefined &&
        meta.size !== null &&
        meta.size !== 'auto'
      ) {
        const basis =
          typeof meta.size === 'number' ? `${meta.size}px` : String(meta.size);
        $panel
          .removeClass(CONST.CLASS_IS_COLLAPSED)
          .css('flex', `0 0 ${basis}`);
      } else {
        $panel.removeClass(CONST.CLASS_IS_COLLAPSED).css('flex', '1 1 0%');
      }
    });
    this.#syncCollapseButtons();
  }

  /**
   * 将当前 #sizes 像素值与折叠状态同步至 DOM 与 ARIA 属性
   */
  #applySizesToDom() {
    const availableSize = this.#lastAvailableSize || this.#getAvailableSize();

    this.#panelsMeta.forEach((meta, idx) => {
      const size = this.#sizes[idx] ?? 0;
      const isCollapsed = Boolean(meta.collapsed);
      const $panel = this.#$panels.eq(idx);

      $panel.toggleClass(CONST.CLASS_IS_COLLAPSED, isCollapsed);
      $panel.css('flex', `0 0 ${isCollapsed ? 0 : size}px`);
    });

    // 更新分隔条无障碍数值与折叠按钮箭头方向
    this.#$bars.each((barIdx, barElem) => {
      const prevSize = this.#sizes[barIdx] ?? 0;
      const pct =
        availableSize > 0 ? Math.round((prevSize / availableSize) * 100) : 0;
      barElem.setAttribute('aria-valuenow', String(pct));
      barElem.setAttribute('aria-valuemin', '0');
      barElem.setAttribute('aria-valuemax', '100');
    });

    this.#syncCollapseButtons();
  }

  /**
   * 同步分隔条上折叠按钮的箭头图标与状态
   */
  #syncCollapseButtons() {
    const isVertical = this.options.orientation === 'vertical';

    this.#$bars.find(`.${CONST.COLLAPSE_BTN}`).each((_, btnElem) => {
      const $btn = $(btnElem);
      const panelIdx = Number($btn.attr('data-panel-index'));
      const side = $btn.attr('data-side');
      const isCollapsed = Boolean(this.#panelsMeta[panelIdx]?.collapsed);

      // 计算箭头指向：
      // prev 面板未折叠时向左/上收起，已折叠时向右/下展开；next 面板相反
      let iconClass;
      if (side === 'prev') {
        if (isVertical) {
          iconClass = isCollapsed ? 'lay-icon-down' : 'lay-icon-up';
        } else {
          iconClass = isCollapsed ? 'lay-icon-right' : 'lay-icon-left';
        }
      } else {
        if (isVertical) {
          iconClass = isCollapsed ? 'lay-icon-up' : 'lay-icon-down';
        } else {
          iconClass = isCollapsed ? 'lay-icon-left' : 'lay-icon-right';
        }
      }

      $btn
        .toggleClass(CONST.CLASS_IS_ACTIVE, isCollapsed)
        .children('.lay-icon')
        .attr('class', `lay-icon ${iconClass}`);
    });
  }

  /**
   * 执行单个面板的折叠/展开切换
   * @param {number} panelIndex - 目标面板索引
   * @param {boolean} targetCollapsed - 目标折叠态
   * @param {number} [neighborIndex] - 指定邻居索引
   * @returns {boolean}
   */
  #setCollapsedState(panelIndex, targetCollapsed, neighborIndex) {
    if (!this.#isLayoutInitialized) {
      this.#layoutPanels(true);
    }

    const availableSize = this.#getAvailableSize();
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
    this.#panelsMeta[panelIndex].collapsed = targetCollapsed;
    if (
      transition.neighborIndex >= 0 &&
      this.#sizes[transition.neighborIndex] > 0
    ) {
      this.#panelsMeta[transition.neighborIndex].collapsed = false;
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

    // 键盘方向键微调 & Enter 快捷折叠
    $elem.on(`keydown${ns}`, `.${CONST.BAR}`, (e) => {
      if (!isOwnBar(e.currentTarget)) return;
      const $bar = $(e.currentTarget);
      if ($bar.hasClass(CONST.CLASS_IS_DISABLED)) return;

      const barIndex = Number($bar.attr('data-bar-index'));
      const isVertical = options.orientation === 'vertical';

      if (e.key === 'Enter') {
        if (this.#handleBarQuickToggle(barIndex)) {
          e.preventDefault();
        }
        return;
      }

      let stepDelta = 0;
      if (!isVertical && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        stepDelta =
          e.key === 'ArrowRight' ? options.keyboardStep : -options.keyboardStep;
      } else if (isVertical && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        stepDelta =
          e.key === 'ArrowDown' ? options.keyboardStep : -options.keyboardStep;
      }

      if (!stepDelta) return;
      e.preventDefault();

      if (!this.#isLayoutInitialized) {
        this.#layoutPanels(true);
      }

      const startPrevCollapsed = Boolean(this.#panelsMeta[barIndex]?.collapsed);
      const startNextCollapsed = Boolean(
        this.#panelsMeta[barIndex + 1]?.collapsed,
      );

      const stepResult = computeDragStep({
        startSizes: this.#sizes,
        bounds: this.#bounds,
        panelsMeta: this.#panelsMeta,
        barIndex,
        rawDelta: stepDelta,
      });

      if (stepResult.delta === 0) return;

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
   * 双击或按 Enter 时切换分隔条关联的可折叠面板
   * @param {number} barIndex - 分隔条索引
   * @returns {boolean}
   */
  #handleBarQuickToggle(barIndex) {
    const prevMeta = this.#panelsMeta[barIndex];
    const nextMeta = this.#panelsMeta[barIndex + 1];

    // 优先展开已处于折叠态的相邻面板
    if (prevMeta?.collapsed && prevMeta?.collapsible) {
      return this.expand(barIndex, barIndex + 1);
    }
    if (nextMeta?.collapsed && nextMeta?.collapsible) {
      return this.expand(barIndex + 1, barIndex);
    }

    // 否则折叠声明了 collapsible 的相邻面板
    if (prevMeta?.collapsible) {
      return this.collapse(barIndex, barIndex + 1);
    }
    if (nextMeta?.collapsible) {
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

    if (!this.#isLayoutInitialized) {
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
      const finalStep = latestStep;
      this.#stopActiveDrag();

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
      const availableSize = this.#getAvailableSize();
      if (availableSize <= 0) return;

      // 从隐藏态首次变为可见态时，执行初始配置分配；否则若可用尺寸变化则执行比例缩放
      if (!this.#isLayoutInitialized) {
        this.#layoutPanels(true);
      } else if (Math.abs(availableSize - this.#lastAvailableSize) > 0.5) {
        this.#layoutPanels(false);
      }
    });
  }
}

const CONST = Splitter.CONST;

export { Splitter as splitter };
