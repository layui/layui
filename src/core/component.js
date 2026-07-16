/**
 * Component
 * 组件构建器
 */

import { lay } from './lay.js';
import { $ } from 'jquery';

// 组件实例存储桶
const instanceBuckets = new WeakMap();

/**
 * 获取当前组件的实例存储桶
 * @param {Function} ctor - 组件构造器
 * @returns {Object}
 */
const getInstanceBucket = (ctor) => {
  let bucket = instanceBuckets.get(ctor);

  // 初始化存储桶
  if (!bucket) {
    bucket = Object.create(null);
    instanceBuckets.set(ctor, bucket);
  }

  return bucket;
};

// 组件基类
export class Component {
  // 默认配置项
  static options = {};

  // 设置默认配置项
  static config(options) {
    $.extend(true, this.options, options);
    return this;
  }

  // 组件名。子类应显式声明，避免 terser 启用 class 混淆后组件名受影响
  static get componentName() {
    return this.name.toLowerCase();
  }

  // 通用常量集，一般存放固定字符，如属性名、CSS 类名等
  static get CONST() {
    return {
      ATTR_ID: `lay-${this.componentName}-id`, // 用于记录组件实例 id 的属性名
      EVENT_NAMESPACE: `.lay_${this.componentName}_events`, // 组件事件命名空间

      // 状态类名
      CLASS_IS_ACTIVE: 'lay-is-active', // 激活
      CLASS_IS_SELECTED: 'lay-is-selected', // 选中
      CLASS_IS_CHECKED: 'lay-is-checked', // 勾选
      CLASS_IS_DISABLED: 'lay-is-disabled', // 禁用
      CLASS_IS_OPEN: 'lay-is-open', // 打开
      CLASS_IS_EXPANDED: 'lay-is-expanded', // 展开
      CLASS_IS_LOADING: 'lay-is-loading', // 加载中
      CLASS_IS_EMPTY: 'lay-is-empty', // 空的
      CLASS_IS_VISIBLE: 'lay-is-visible', // 可见
      CLASS_IS_HIDDEN: 'lay-is-hidden', // 隐藏
      CLASS_IS_INVISIBLE: 'lay-is-invisible', // 隐形
      CLASS_IS_TRANSPARENT: 'lay-is-transparent', // 透明

      // legacy (后续移除)
      CLASS_THIS: 'lay-this',
      CLASS_SHOW: 'lay-show',
      CLASS_HIDE: 'lay-hide',
      CLASS_HIDEV: 'lay-hide-v',
      CLASS_DISABLED: 'lay-disabled',
      CLASS_NONE: 'lay-none',
    };
  }

  /**
   * 将指定的「实例方法」委托为「静态方法」
   * 委托后暴露的静态方法的第一个参数为实例 id，后续参数同实例方法的参数一致
   * @param {string[]} methodNames - 方法名数组
   * @returns {void}
   */
  static delegateInstanceMethods(methodNames) {
    methodNames.forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(this.prototype, name);
      if (!descriptor || typeof descriptor.value !== 'function') return;

      Object.defineProperty(this, name, {
        configurable: true,
        value(id, ...args) {
          const inst = this.getInstance(id);
          if (!inst) return;
          return inst[name](...args);
        },
      });
    });
  }

  /**
   * 事件
   * 后续或考虑重构事件机制
   * @param {string} eventName - 事件名
   * @param {Function} callback - 回调函数
   * @returns {void}
   */
  static on(eventName, callback) {
    lay.onevent.call(this, this.componentName, eventName, callback);
  }

  /**
   * 获取指定的实例
   * @param {string|number} id - 实例 id
   * @returns {InstanceType<typeof this>|undefined} - 组件实例
   */
  static getInstance(id) {
    if (id === undefined) {
      throw new Error('ID argument required');
    }
    return getInstanceBucket(this)[id];
  }

  /**
   * 移除实例
   * @param {string|number} id - 实例 id
   * @returns {void}
   */
  static removeInstance(id) {
    delete getInstanceBucket(this)[id];
  }

  /**
   * 获取所有实例
   * @returns {Object} - 组件实例对象，键为实例 id，值为实例
   */
  static getInstances() {
    return { ...getInstanceBucket(this) };
  }

  /**
   * 移除所有实例（置空）
   * @returns {void}
   */
  static removeInstances() {
    instanceBuckets.set(this, Object.create(null));
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['reload', 'destroy']);
  }

  /**
   * 组件渲染（创建组件实例唯一入口）
   * @param {Object} options - 配置项
   * @returns {InstanceType<typeof this>|Array<InstanceType<typeof this>>}
   * 返回组件实例；若 options.elem 对应多个元素，则返回组件实例数组
   */
  static render(options) {
    const inst = new this(options);
    return inst.#init();
  }

  // 构造函数
  constructor(options) {
    const Constructor = this.constructor;

    // 自增索引
    this.index = lay.autoIncrementer(Constructor.componentName);

    // 扩展配置项：传入选项 -> 默认选项 = 当前选项
    this.options = $.extend(
      true,
      {},
      this.options,
      Constructor.options,
      options,
    );
  }

  /**
   * 覆盖数组选项，避免参与深度合并
   * 非文档化接口，一般用于组件内部
   * @param {Object} options - 配置项。仅处理值为数组的选项
   * @returns {void}
   */
  overrideArrayOptions(options = {}) {
    for (const [key, value] of Object.entries(options)) {
      if (Array.isArray(value)) {
        this.options[key] = value;
      }
    }
  }

  /**
   * 重载实例
   * @see render
   */
  reload(options) {
    $.extend(this.options, options);
    return this.#init(true);
  }

  /**
   * 销毁实例
   * @returns {void}
   */
  destroy() {
    const Constructor = this.constructor;
    const ATTR_ID = Constructor.CONST.ATTR_ID;
    const options = this.options;

    Constructor.removeInstance(options.id); // 移除实例记录
    options.$elem?.removeAttr(ATTR_ID); // 清理元素标记
    options.$elem?.off(Constructor.CONST.EVENT_NAMESPACE); // 移除事件绑定
  }

  /**
   * 初始化处理
   * @param {boolean} isReload - 是否来自 reload 调用
   * @returns {InstanceType<typeof this>|Array<InstanceType<typeof this>>}
   * 返回组件实例；若 options.elem 对应多个元素，则返回组件实例数组
   */
  #init(isReload = false) {
    let options = this.options;
    const $elem = $(options.elem);
    const Constructor = this.constructor;
    const ATTR_ID = Constructor.CONST.ATTR_ID;
    const existingId = $elem.attr(ATTR_ID);
    const instances = getInstanceBucket(Constructor);

    // 若 elem 非唯一，则进行多实例渲染
    if ($elem.length > 1) {
      const batchOptions = { ...options };
      delete batchOptions.id; // 多实例渲染过滤传入的 id 选项

      // 返回实例数组
      const batchInstances = $elem
        .map((_, elem) => Constructor.render({ ...batchOptions, elem }))
        .get();
      batchInstances.options = batchOptions; // 附加原始配置项
      return batchInstances;
    }

    // 仅来自 render 的调用
    if (!isReload) {
      // 合并 lay-options 属性上的配置信息
      // Tip: 鉴于 CSP 策略，后续将移除 `lay.options` 方法，改用 dataset 方案
      const layOptions = lay.options($elem[0]);
      $.extend(this.options, layOptions);

      // 合并 dataset 上的配置信息
      // Tip: 临时实现，后续将支持嵌套等功能
      const dataset = { ...$elem[0]?.dataset };
      $.extend(this.options, dataset);

      // 若对目标元素重复渲染，则视为 reload 处理
      if (existingId) {
        const inst = Constructor.getInstance(existingId);
        if (inst) {
          return inst.reload(options);
        }
        $elem.removeAttr(ATTR_ID); // 若实例不存在，清理失效标记
      }
    }

    // 添加元素的 jQuery 对象至选项，以供组件内部使用
    options.$elem = $elem;

    // 初始化 id 属性 - 优先取 options.id > 元素 id > 自增索引
    options.id = lay.hasOwn(options, 'id')
      ? options.id
      : $elem.attr('id') || this.index;

    // 记录当前实例
    instances[options.id] = this;

    // 渲染
    if (typeof this.render === 'function') {
      $elem.attr(ATTR_ID, options.id); // 目标元素已渲染过的标记
      this.render(isReload); // 渲染核心
    }

    return this;
  }
}
