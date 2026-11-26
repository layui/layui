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
 * 计算调用 `setSizes(nextSizes)` 后的各面板像素尺寸
 * 显式传入的值严格优先满足，省略或设为 `'auto'` 的未折叠面板按其当前相对比例承接剩余空间
 * @param {Object} params
 * @param {number[]} params.prevSizes - 调用前各面板像素尺寸
 * @param {Array<Object>} params.panelsMeta - 面板元数据列表（已更新最新 collapsed 标记）
 * @param {Array<number|string|undefined|null>} params.nextSizes - 调用方传入的目标尺寸数组
 * @param {number} params.availableSize - 可用主轴总尺寸（px）
 * @returns {{ sizes: number[], bounds: Array<{min: number, max: number}> }}
 */
export const computeSetSizes = ({
  prevSizes,
  panelsMeta,
  nextSizes,
  availableSize,
}) => {
  const safeAvailable = Math.max(0, availableSize);
  const count = panelsMeta.length;
  if (!count) return { sizes: [], bounds: [] };

  const bounds = panelsMeta.map((p) => resolvePanelBounds(p, safeAvailable));
  const sizes = new Array(count).fill(0);
  const explicitIndices = [];
  const implicitIndices = [];
  const activeIndices = [];

  panelsMeta.forEach((panel, idx) => {
    if (panel.collapsed) {
      sizes[idx] = 0;
      return;
    }

    activeIndices.push(idx);
    const rawVal = idx < nextSizes.length ? nextSizes[idx] : undefined;
    const parsed = parseSizeValue(rawVal, safeAvailable, null);

    if (parsed !== null) {
      sizes[idx] = clampNumber(parsed, bounds[idx].min, bounds[idx].max);
      explicitIndices.push(idx);
    } else {
      implicitIndices.push(idx);
    }
  });

  const explicitSum = explicitIndices.reduce((sum, idx) => sum + sizes[idx], 0);
  const remaining = Math.max(0, safeAvailable - explicitSum);

  if (implicitIndices.length > 0) {
    const prevImplicitSum = implicitIndices.reduce(
      (sum, idx) => sum + (prevSizes?.[idx] > 0 ? prevSizes[idx] : 0),
      0,
    );

    implicitIndices.forEach((idx) => {
      const prevWeight = prevSizes?.[idx] > 0 ? prevSizes[idx] : 0;
      const rawShare =
        prevImplicitSum > EPSILON
          ? remaining * (prevWeight / prevImplicitSum)
          : remaining / implicitIndices.length;
      sizes[idx] = clampNumber(rawShare, bounds[idx].min, bounds[idx].max);
    });

    // 优先在省略的未传面板之间消化差额，避免篡改显式传入的尺寸
    distributeDiffAmong(sizes, bounds, implicitIndices, safeAvailable);
  }

  // 仅当省略面板均触及边界无法消化全部差额时，在所有活动面板间做最终平衡
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

  // 向左/上拖过阈值触发吸附折叠 prev 面板（必须同时满足接收侧 b1 的 min 与 max 边界）
  const prevSnapThreshold = b0.min > 0 ? b0.min * 0.4 : 0;
  if (
    canCollapsePrev &&
    desiredPrev <= prevSnapThreshold &&
    pairTotal >= b1.min &&
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

  // 向右/下拖过阈值触发吸附折叠 next 面板（必须同时满足接收侧 b0 的 min 与 max 边界）
  const nextSnapThreshold = b1.min > 0 ? b1.min * 0.4 : 0;
  if (
    canCollapseNext &&
    desiredNext <= nextSnapThreshold &&
    pairTotal >= b0.min &&
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
 * 计算单面板折叠或展开后的尺寸更新
 * 展开时优先消耗容器尚未分配的空白空间，不足部分再向其他未折叠面板借用，严格保护 min/max 与其他折叠面板状态
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

  const currentUsed = nextSizes.reduce((sum, s) => sum + s, 0);
  const freeSpace =
    availableSize > 0 ? Math.max(0, availableSize - currentUsed) : 0;

  // 展开分支：若此前所有面板均处于折叠态，直接使用容器可用空间
  if (!otherExpanded.length) {
    if (freeSpace <= EPSILON || freeSpace + EPSILON < bounds[panelIndex].min) {
      return { changed: false, sizes: nextSizes, neighborIndex: -1 };
    }
    const rawSaved = parseSizeValue(savedSizes[panelIndex], freeSpace, null);
    const initConfigured = parseSizeValue(
      targetMeta.initialSize ?? targetMeta.size,
      freeSpace,
      null,
    );
    const restored = clampNumber(
      rawSaved ?? initConfigured ?? freeSpace,
      bounds[panelIndex].min,
      Math.min(bounds[panelIndex].max, freeSpace),
    );
    if (restored <= EPSILON) {
      return { changed: false, sizes: nextSizes, neighborIndex: -1 };
    }
    nextSizes[panelIndex] = restored;
    return { changed: true, sizes: nextSizes, neighborIndex: -1 };
  }

  // 计算容器尚未分配的自由空白空间 + 所有其他未折叠面板可让出的总空间
  const totalShrinkRoom = otherExpanded.reduce(
    (sum, idx) => sum + Math.max(0, nextSizes[idx] - bounds[idx].min),
    0,
  );
  const totalAvailableRoom = freeSpace + totalShrinkRoom;
  const minRequired = bounds[panelIndex].min;

  // 若总可用空间不足以满足目标面板的 min（或无可分配空间），严格保持折叠态并返回 false
  if (
    totalAvailableRoom <= EPSILON ||
    totalAvailableRoom + EPSILON < minRequired
  ) {
    return { changed: false, sizes: nextSizes, neighborIndex: -1 };
  }

  const primary = pickPrimaryNeighbor(
    otherExpanded,
    panelIndex,
    count,
    neighborIndex,
  );
  const effectiveTotal = availableSize > 0 ? availableSize : currentUsed;

  const savedPx = parseSizeValue(savedSizes[panelIndex], effectiveTotal, null);
  const configuredPx = parseSizeValue(
    targetMeta.initialSize ?? targetMeta.size,
    effectiveTotal,
    null,
  );
  const fallbackSize =
    configuredPx && configuredPx > 0
      ? configuredPx
      : Math.max(
          minRequired,
          freeSpace > EPSILON
            ? freeSpace
            : (nextSizes[primary] || totalShrinkRoom) / 2,
        );
  const desired = clampNumber(
    savedPx && savedPx > 0 ? savedPx : fallbackSize,
    minRequired,
    bounds[panelIndex].max,
  );
  const restoredSize = Math.min(desired, totalAvailableRoom);

  if (restoredSize <= EPSILON || restoredSize + EPSILON < minRequired) {
    return { changed: false, sizes: nextSizes, neighborIndex: primary };
  }

  // 优先消耗尚未分配的自由空白空间，不足部分再向其他未折叠面板借用
  const fromFree = Math.min(restoredSize, freeSpace);
  const needBorrow = Math.max(0, restoredSize - fromFree);
  nextSizes[panelIndex] = restoredSize;

  if (needBorrow > EPSILON) {
    const targetTotalAfterExpand = currentUsed + fromFree;
    const takeFromPrimary = Math.min(
      needBorrow,
      Math.max(0, nextSizes[primary] - bounds[primary].min),
    );
    nextSizes[primary] -= takeFromPrimary;

    // 若直接邻居达到 min 后仍差部分空间，继续从其余富余的未折叠面板中按余量分摊扣减
    if (needBorrow - takeFromPrimary > EPSILON) {
      const remainingDonors = otherExpanded.filter((idx) => idx !== primary);
      distributeDiffAmong(
        nextSizes,
        bounds,
        remainingDonors,
        targetTotalAfterExpand,
      );
    }
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
      CLASS_TOUCHING_NEXT: 'lay-is-touching-next',
      CLASS_TOUCHING_PREV: 'lay-is-touching-prev',
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
   * - 无配置项调用 `splitter.render()` 时，仅扫描并初始化尚未渲染过的 `.lay-splitter` 容器，避免重置已通过 JS 自定义配置的实例；
   * - 传入配置项（如 `splitter.render({ disabled: true })` 或指定 `elem`）时，走基类标准渲染/重载流程。
   * @param {Object} [options] - 组件配置项
   * @returns {Splitter|Splitter[]|undefined}
   */
  static render(options) {
    if (!options || Object.keys(options).length === 0) {
      const selector = this.options.elem;
      const attrId = this.CONST.ATTR_ID;
      const $unrendered = $(selector).filter(
        (_, el) => !el.hasAttribute(attrId),
      );
      if (!$unrendered.length) {
        return [];
      }
      return super.render({ elem: $unrendered });
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
  #hasMeasured = false;
  #pendingInitialLayout = true;
  #pendingSetSizes = null;
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
   * 重载组件实例，原地复用面板 DOM 并仅按需更新变更项
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

    const prevHasMeasured = this.#hasMeasured;
    const prevOrientation = this.#currentOrientation;

    this.#stopActiveDrag();
    this.#normalizeOptions();

    const explicitReloadPanels =
      isReload && Array.isArray(this.#reloadRawOptions?.panels);
    const orientationChanged =
      isReload &&
      prevOrientation !== null &&
      prevOrientation !== options.orientation;

    if (!isReload || explicitReloadPanels || orientationChanged) {
      this.#pendingInitialLayout = true;
      this.#pendingSetSizes = null;
      if (orientationChanged || explicitReloadPanels) {
        this.#hasMeasured = false;
      }
    }

    this.#prepareDom({ isReload, prevHasMeasured, prevOrientation });
    this.#currentOrientation = options.orientation;
    this.#layoutPanels(this.#pendingInitialLayout ? 'initial' : 'rescale');
    this.#bindEvents();
    this.#observeContainer();
  }

  /**
   * 获取当前各面板尺寸数组
   * @param {'px'|'%'} [unit='px'] - 尺寸单位，可选 `'px'` 或 `'%'`
   * @returns {number[]} 各面板尺寸数组
   */
  getSizes(unit = 'px') {
    if (
      (this.#pendingInitialLayout || this.#pendingSetSizes !== null) &&
      this.#getAvailableSize() > 0
    ) {
      this.#layoutPanels(
        this.#pendingSetSizes !== null ? 'setSizes' : 'initial',
      );
    }

    if (unit === '%') {
      const total = this.#getAvailableSize() || this.#lastAvailableSize;
      if (total <= 0) return this.#sizes.map(() => 0);
      return this.#sizes.map((size) =>
        Number(((size / total) * 100).toFixed(2)),
      );
    }
    return this.#sizes.map((size) => Math.round(size * 100) / 100);
  }

  /**
   * 动态设置各面板尺寸
   * 显式传入项严格优先满足，省略项按当前比例承接剩余空间；写入 0 前自动保存原尺寸以支持后续展开
   * @param {Array<number|string|undefined>} nextSizes - 新尺寸数组（支持 px 数字、'200px'、'30%'）
   * @returns {void}
   */
  setSizes(nextSizes) {
    if (!Array.isArray(nextSizes) || !this.#panelsMeta.length) return;

    const count = this.#panelsMeta.length;
    const collapseChanges = [];

    this.#panelsMeta.forEach((meta, idx) => {
      if (
        idx >= nextSizes.length ||
        nextSizes[idx] === undefined ||
        nextSizes[idx] === null
      ) {
        return;
      }

      const sizeVal = nextSizes[idx];
      const isZeroInput =
        sizeVal === 0 ||
        (typeof sizeVal === 'string' && /^(0|0px|0%)$/i.test(sizeVal.trim()));

      if (isZeroInput) {
        if (this.#hasMeasured && this.#sizes[idx] > 0) {
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

    this.#pendingSetSizes = nextSizes.slice();
    this.#layoutPanels('setSizes');

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
    const mode =
      this.#pendingSetSizes !== null
        ? 'setSizes'
        : this.#pendingInitialLayout
          ? 'initial'
          : 'rescale';
    this.#layoutPanels(mode);
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
        this.#destroyDescendantSplitters($elem);
        $elem.empty();
      } else if (this.#$panels) {
        this.#$panels.each((_, panelElem) => {
          const $panel = $(panelElem);
          const restoreInfo = this.#panelRestoreMap.get(panelElem);
          const keepInert = Boolean(restoreInfo?.hadInert);

          $panel.removeClass(CONST.CLASS_IS_COLLAPSED);
          if (keepInert) {
            $panel.attr('inert', '');
          } else {
            $panel.removeAttr('inert');
          }
          if ('inert' in panelElem) {
            panelElem.inert = keepInert;
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
    this.#hasMeasured = false;
    this.#pendingInitialLayout = true;
    this.#pendingSetSizes = null;
    this.#currentOrientation = null;

    super.destroy();
  }

  /**
   * 销毁指定作用域内挂载的后代 Splitter 实例，防止移除节点后残留孤儿实例
   * @param {JQuery} $scope - 待移除或清空的容器
   */
  #destroyDescendantSplitters($scope) {
    if (!$scope?.length) return;
    const attrId = CONST.ATTR_ID;
    $scope.find(`[${attrId}]`).each((_, el) => {
      const childId = el.getAttribute(attrId);
      if (childId !== null && childId !== '') {
        Splitter.getInstance(childId)?.destroy();
      }
    });
  }

  /**
   * 安全更新面板内容：若目标单节点已在面板内则跳过重建以保留其绑定的事件与数据
   * @param {Element} panelElem - 面板 DOM 节点
   * @param {string|Node|JQuery} content - 面板内容
   */
  #applyPanelContent(panelElem, content) {
    const singleNode =
      content && typeof content === 'object' && content.jquery
        ? content.length === 1
          ? content[0]
          : null
        : content && typeof content === 'object' && content.nodeType
          ? content
          : null;

    if (
      singleNode &&
      panelElem.childNodes?.length === 1 &&
      panelElem.firstChild === singleNode
    ) {
      return;
    }

    const $panel = $(panelElem);
    this.#destroyDescendantSplitters($panel);
    $panel.empty().append(content);
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
   * 记录并同步单个面板的恢复信息、作者初始 inert 状态、自定义类名与无障碍 ID
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
        hadInert:
          Boolean(panelElem.hasAttribute?.('inert')) ||
          Boolean(panelElem.inert),
        addedClasses: new Set(),
        autoAssignedId: false,
      };
      this.#panelRestoreMap.set(panelElem, restoreInfo);
    } else {
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

    if (!$panel.attr('id') || restoreInfo.autoAssignedId) {
      $panel.attr('id', `lay-splitter-panel-${this.options.id}-${idx}`);
      restoreInfo.autoAssignedId = true;
    }
  }

  /**
   * 构建或增量复用面板与分隔条 DOM 结构
   * @param {{ isReload?: boolean, prevHasMeasured?: boolean, prevOrientation?: string|null }} params
   */
  #prepareDom({
    isReload = false,
    prevHasMeasured = false,
    prevOrientation = null,
  } = {}) {
    const options = this.options;
    const $elem = options.$elem;
    const isVertical = options.orientation === 'vertical';

    this.#syncRootClasses($elem, options.className);

    $elem
      .toggleClass(CONST.MOD_VERTICAL, isVertical)
      .toggleClass(CONST.MOD_HORIZONTAL, !isVertical)
      .css('--lay-splitter-bar-size', `${options.barSize}px`);

    $elem.children(`.${CONST.BAR}, .${CONST.GHOST_BAR}`).remove();

    let $existingPanels = $elem.children(`.${CONST.PANEL}`);
    const hasPanelsArray = Array.isArray(options.panels);
    const rawReloadPanels =
      isReload && Array.isArray(this.#reloadRawOptions?.panels)
        ? this.#reloadRawOptions.panels
        : null;

    // 数据生成模式（首次容器无静态面板且提供了 panels 数组，或此前已处于数据生成模式）
    if (
      this.#isGeneratedPanels ||
      (!$existingPanels.length && hasPanelsArray)
    ) {
      this.#isGeneratedPanels = true;
      const targetPanels = hasPanelsArray ? options.panels : [];

      // 若重载传入空数组 panels: []，销毁嵌套实例并彻底清空面板与历史尺寸缓存
      if (!targetPanels.length) {
        this.#destroyDescendantSplitters($existingPanels);
        $existingPanels.remove();
        this.#$panels = $();
        this.#panelsMeta = [];
        this.#sizes = [];
        this.#bounds = [];
        this.#savedSizes = Object.create(null);
        this.#$bars = $();
        return;
      }

      targetPanels.forEach((panelOpt, idx) => {
        const cfg = panelOpt || {};
        if (
          rawReloadPanels?.[idx] &&
          (lay.hasOwn(rawReloadPanels[idx], 'size') ||
            lay.hasOwn(rawReloadPanels[idx], 'collapsed'))
        ) {
          delete this.#savedSizes[idx];
        }

        if (idx < $existingPanels.length) {
          const panelElem = $existingPanels[idx];
          this.#syncPanelElementAttributes(panelElem, cfg.className, idx);
          if (
            rawReloadPanels?.[idx] &&
            lay.hasOwn(rawReloadPanels[idx], 'content')
          ) {
            this.#applyPanelContent(panelElem, rawReloadPanels[idx].content);
          }
        } else {
          delete this.#savedSizes[idx];
          const $newPanel = $(`<div class="${CONST.PANEL}"></div>`);
          this.#syncPanelElementAttributes($newPanel[0], cfg.className, idx);
          if (cfg.content !== undefined) {
            this.#applyPanelContent($newPanel[0], cfg.content);
          }
          $elem.append($newPanel);
        }
      });

      // 移除超出新数组长度的尾部旧面板，并清理其后代实例与历史尺寸记录
      for (let k = targetPanels.length; k < $existingPanels.length; k++) {
        const $removed = $existingPanels.eq(k);
        this.#destroyDescendantSplitters($removed);
        $removed.remove();
        delete this.#savedSizes[k];
      }

      $existingPanels = $elem.children(`.${CONST.PANEL}`);
    }

    this.#$panels = $existingPanels;

    const rawExplicitPanels = isReload
      ? rawReloadPanels
      : Array.isArray(this.#rawInitOptions?.panels)
        ? this.#rawInitOptions.panels
        : null;

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

        merged.initialSize = merged.size;

        if (
          rawReloadPanels?.[idx] &&
          (lay.hasOwn(rawReloadPanels[idx], 'size') ||
            lay.hasOwn(rawReloadPanels[idx], 'collapsed'))
        ) {
          delete this.#savedSizes[idx];
        }

        // 若仅为修改非面板配置的重载，保留此前已交互的折叠状态，同方向下保留已调整尺寸
        if (isReload && prevMeta && !rawExplicitPanels) {
          merged.collapsed = prevMeta.collapsed;
          if (
            prevHasMeasured &&
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
            this.#applyPanelContent(panelElem, rawExplicitPanels[idx].content);
          }
        }

        return merged;
      })
      .get();

    // 在相邻面板之间插入分隔条（动态属性统一通过 .attr() 设置，避免特殊字符截断 HTML）
    const barAriaOrientation = isVertical ? 'horizontal' : 'vertical';
    const panelCount = this.#panelsMeta.length;
    const barElems = [];

    for (let i = 0; i < panelCount - 1; i++) {
      const prevMeta = this.#panelsMeta[i];
      const nextMeta = this.#panelsMeta[i + 1];
      const prevId = $existingPanels.eq(i).attr('id') || '';
      const nextId = $existingPanels.eq(i + 1).attr('id') || '';
      const barDisabled =
        options.disabled ||
        prevMeta.resizable === false ||
        nextMeta.resizable === false;

      const $bar = $(
        `<div class="${CONST.BAR} lay-unselect" role="separator"></div>`,
      ).attr({
        'aria-orientation': barAriaOrientation,
        'aria-label': 'Resize panels',
        'aria-controls': `${prevId} ${nextId}`.trim(),
        'data-bar-index': String(i),
      });

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
      `<button type="button" class="${CONST.COLLAPSE_BTN}"><i class="lay-icon"></i></button>`,
    ).attr({
      'aria-controls': panelId,
      'data-panel-index': String(panelIndex),
      'data-neighbor-index': String(neighborIndex),
      'data-side': side,
    });
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
   * @param {'initial'|'setSizes'|'rescale'} [mode='rescale'] - 布局计算模式
   */
  #layoutPanels(mode = 'rescale') {
    const count = this.#panelsMeta.length;
    if (!count) return;

    const availableSize = this.#getAvailableSize();

    // 若容器当前不可见（宽/高为 0）：保留已测量过的 #sizes（不无条件重置 #pendingInitialLayout）
    if (availableSize <= 0) {
      this.#applyFallbackUnmeasuredStyles();
      return;
    }

    let result;
    if (mode === 'setSizes' && this.#pendingSetSizes !== null) {
      result = computeSetSizes({
        prevSizes: this.#sizes,
        panelsMeta: this.#panelsMeta,
        nextSizes: this.#pendingSetSizes,
        availableSize,
      });
      this.#pendingSetSizes = null;
    } else if (
      mode === 'initial' ||
      this.#pendingInitialLayout ||
      !this.#hasMeasured
    ) {
      result = computeInitialSizes(this.#panelsMeta, availableSize);
    } else {
      result = rescaleSizes(this.#sizes, this.#panelsMeta, availableSize);
    }

    this.#sizes = result.sizes;
    this.#bounds = result.bounds;
    this.#lastAvailableSize = availableSize;
    this.#hasMeasured = true;
    this.#pendingInitialLayout = false;

    this.#applySizesToDom();
  }

  /**
   * 同步单个面板的折叠无障碍状态（尊重作者初始设置的 inert 属性）
   * @param {JQuery} $panel - 面板 jQuery 对象
   * @param {boolean} isCollapsed - 是否折叠
   */
  #syncPanelCollapsedA11y($panel, isCollapsed) {
    const panelElem = $panel[0];
    const restoreInfo = panelElem ? this.#panelRestoreMap.get(panelElem) : null;
    const effectiveInert = isCollapsed || Boolean(restoreInfo?.hadInert);

    $panel.toggleClass(CONST.CLASS_IS_COLLAPSED, isCollapsed);
    if (effectiveInert) {
      $panel.attr('inert', '');
    } else {
      $panel.removeAttr('inert');
    }
    if (panelElem && 'inert' in panelElem) {
      panelElem.inert = effectiveInert;
    }
  }

  /**
   * 当容器隐藏（宽/高为 0）时应用 CSS 比例或已知像素占位样式
   */
  #applyFallbackUnmeasuredStyles() {
    this.#panelsMeta.forEach((meta, idx) => {
      const $panel = this.#$panels.eq(idx);
      const isCollapsed = Boolean(meta.collapsed);
      this.#syncPanelCollapsedA11y($panel, isCollapsed);

      if (isCollapsed) {
        $panel.css('flex', '0 0 0px');
        return;
      }

      const pendingVal =
        this.#pendingSetSizes && idx < this.#pendingSetSizes.length
          ? this.#pendingSetSizes[idx]
          : undefined;

      if (
        pendingVal !== undefined &&
        pendingVal !== null &&
        pendingVal !== 'auto'
      ) {
        const basis =
          typeof pendingVal === 'number'
            ? `${pendingVal}px`
            : String(pendingVal);
        $panel.css('flex', `0 0 ${basis}`);
      } else if (
        this.#hasMeasured &&
        !this.#pendingInitialLayout &&
        this.#pendingSetSizes === null &&
        this.#sizes[idx] > 0
      ) {
        $panel.css('flex', `0 0 ${this.#sizes[idx]}px`);
      } else if (
        !this.#pendingSetSizes &&
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
   * 将当前 #sizes 像素值、边缘对齐状态、紧邻防重叠状态与无障碍属性同步至 DOM
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
   * 同步分隔条上折叠按钮的箭头图标、双侧折叠去重隐藏、紧邻防重叠位移与无障碍属性
   */
  #syncCollapseButtons() {
    if (!this.#$bars) return;
    const isVertical = this.options.orientation === 'vertical';
    const panelCount = this.#panelsMeta.length;

    this.#$bars.find(`.${CONST.COLLAPSE_BTN}`).each((_, btnElem) => {
      const $btn = $(btnElem);
      const panelIdx = Number($btn.attr('data-panel-index'));
      const side = $btn.attr('data-side');
      const meta = this.#panelsMeta[panelIdx];
      const isCollapsed = Boolean(meta?.collapsed);
      const colFlags = resolvePanelCollapsible(
        meta?.collapsible,
        panelIdx,
        panelCount,
      );

      // 当中间面板同时具有两侧折叠按钮且已折叠为 0px 时，隐藏后侧分隔条上的重复展开按钮
      const hideDuplicateExpandBtn =
        isCollapsed && colFlags.start && colFlags.end && side === 'prev';

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
        .toggleClass(CONST.CLASS_IS_HIDDEN, hideDuplicateExpandBtn)
        .attr('aria-expanded', String(!isCollapsed))
        .attr('aria-label', isCollapsed ? 'Expand panel' : 'Collapse panel')
        .children('.lay-icon')
        .attr('class', `lay-icon ${iconClass}`);
    });

    // 仅当中间面板折叠导致相邻两条分隔条紧贴、且两条分隔条上均存在可见按钮时，向外侧错开按钮组防止重叠
    const hasVisibleBtn = (barElem) =>
      $(barElem)
        .find(`.${CONST.COLLAPSE_BTN}`)
        .filter((_, el) => !$(el).hasClass(CONST.CLASS_IS_HIDDEN)).length > 0;

    this.#$bars.each((barIdx, barElem) => {
      const $bar = $(barElem);
      const ownHasVisible = hasVisibleBtn(barElem);
      const isAtStart = $bar.hasClass(CONST.CLASS_AT_START);
      const isAtEnd = $bar.hasClass(CONST.CLASS_AT_END);

      const touchingNext =
        !isAtStart &&
        ownHasVisible &&
        barIdx + 1 < panelCount - 1 &&
        Boolean(this.#panelsMeta[barIdx + 1]?.collapsed) &&
        hasVisibleBtn(this.#$bars[barIdx + 1]);

      const touchingPrev =
        !isAtEnd &&
        ownHasVisible &&
        barIdx > 0 &&
        Boolean(this.#panelsMeta[barIdx]?.collapsed) &&
        hasVisibleBtn(this.#$bars[barIdx - 1]);

      $bar
        .toggleClass(CONST.CLASS_TOUCHING_NEXT, touchingNext)
        .toggleClass(CONST.CLASS_TOUCHING_PREV, touchingPrev);
    });
  }

  /**
   * 执行单个面板的折叠/展开切换（支持隐藏态下保留已测量尺寸直接计算）
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

    const liveAvailableSize = this.#getAvailableSize();

    // 若容器当前隐藏但此前已完成过有效测量（且无待执行的配置级重置），直接基于 #lastAvailableSize 更新 #sizes，保留拖拽/键盘调整结果
    if (liveAvailableSize <= 0 && !this.#hasMeasured) {
      if (targetCollapsed) {
        const hasOtherExpanded = this.#panelsMeta.some(
          (m, idx) => idx !== panelIndex && !m.collapsed,
        );
        if (!hasOtherExpanded) return false;

        const pendingVal =
          this.#pendingSetSizes?.[panelIndex] ?? targetMeta.size;
        if (pendingVal && pendingVal !== 'auto' && pendingVal !== 0) {
          this.#savedSizes[panelIndex] = pendingVal;
        }
        if (this.#pendingSetSizes) {
          this.#pendingSetSizes[panelIndex] = 0;
        }
      } else {
        const restoredCfg =
          this.#savedSizes[panelIndex] ??
          targetMeta.initialSize ??
          targetMeta.size;
        targetMeta.size = restoredCfg;
        if (this.#pendingSetSizes) {
          this.#pendingSetSizes[panelIndex] = restoredCfg;
        }
      }

      targetMeta.collapsed = targetCollapsed;
      this.#pendingInitialLayout = true;
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

    if (
      liveAvailableSize > 0 &&
      (this.#pendingInitialLayout || this.#pendingSetSizes !== null)
    ) {
      this.#layoutPanels(
        this.#pendingSetSizes !== null ? 'setSizes' : 'initial',
      );
    }

    const effectiveAvailableSize =
      liveAvailableSize > 0 ? liveAvailableSize : this.#lastAvailableSize;

    const transition = computeCollapseTransition({
      sizes: this.#sizes,
      bounds: this.#bounds,
      panelsMeta: this.#panelsMeta,
      savedSizes: this.#savedSizes,
      panelIndex,
      collapsed: targetCollapsed,
      neighborIndex,
      availableSize: effectiveAvailableSize,
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

    const isOwnBar = (barNode) => barNode?.parentElement === elemNode;

    $elem.on(`pointerdown${ns}`, `.${CONST.COLLAPSE_BTN}`, (e) => {
      const barNode = e.currentTarget.closest(`.${CONST.BAR}`);
      if (!isOwnBar(barNode)) return;
      e.stopPropagation();
    });

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
      if (this.#pendingInitialLayout || this.#pendingSetSizes !== null) {
        this.#layoutPanels(
          this.#pendingSetSizes !== null ? 'setSizes' : 'initial',
        );
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

      // 先预计算步进结果：若已处于极限位置无法移动，不空触发 onResizeStart
      const stepResult = computeDragStep({
        startSizes: this.#sizes,
        bounds: this.#bounds,
        panelsMeta: this.#panelsMeta,
        barIndex,
        rawDelta,
      });

      if (stepResult.delta === 0) return;

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

      if (!startPrevCollapsed && this.#sizes[barIndex] > 0) {
        this.#savedSizes[barIndex] = this.#sizes[barIndex];
      }
      if (!startNextCollapsed && this.#sizes[barIndex + 1] > 0) {
        this.#savedSizes[barIndex + 1] = this.#sizes[barIndex + 1];
      }

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
   * 双击或按 Enter 时切换分隔条关联的可折叠面板
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

    if (canPrev && prevMeta?.collapsed) {
      return this.expand(barIndex, barIndex + 1);
    }
    if (canNext && nextMeta?.collapsed) {
      return this.expand(barIndex + 1, barIndex);
    }

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
    if (this.#pendingInitialLayout || this.#pendingSetSizes !== null) {
      this.#layoutPanels(
        this.#pendingSetSizes !== null ? 'setSizes' : 'initial',
      );
    }

    const options = this.options;
    const $elem = options.$elem;
    const isVertical = options.orientation === 'vertical';
    const basePayload = {
      instance: this,
      options,
      index: barIndex,
    };

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

    if (!startPrevCollapsed && startSizes[barIndex] > 0) {
      this.#savedSizes[barIndex] = startSizes[barIndex];
    }
    if (!startNextCollapsed && startSizes[barIndex + 1] > 0) {
      this.#savedSizes[barIndex + 1] = startSizes[barIndex + 1];
    }

    const cursor = isVertical ? 'row-resize' : 'col-resize';
    const $mask = $(`<div class="${CONST.MOVING_MASK}"></div>`).css(
      'cursor',
      cursor,
    );
    $('body').append($mask);

    $elem.addClass(CONST.CLASS_IS_DRAGGING);
    $bar.addClass(CONST.CLASS_IS_ACTIVE);

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

      if (didMove) {
        this.#commitStepResult(
          barIndex,
          finalStep,
          startPrevCollapsed,
          startNextCollapsed,
          endEvent,
        );
      }

      // 若拖拽期间容器尺寸发生过变化，释放后立即补做一次比例重算消除留白或溢出
      const currentAvail = this.#getAvailableSize();
      if (
        currentAvail > 0 &&
        Math.abs(currentAvail - this.#lastAvailableSize) > 0.5
      ) {
        this.#layoutPanels('rescale');
      }
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
      if (this.#cleanupDrag) return;

      const availableSize = this.#getAvailableSize();
      if (availableSize <= 0) return;

      if (this.#pendingSetSizes !== null) {
        this.#layoutPanels('setSizes');
      } else if (this.#pendingInitialLayout || !this.#hasMeasured) {
        this.#layoutPanels('initial');
      } else if (Math.abs(availableSize - this.#lastAvailableSize) > 0.5) {
        this.#layoutPanels('rescale');
      }
    });
  }
}

const CONST = Splitter.CONST;

export { Splitter as splitter };
