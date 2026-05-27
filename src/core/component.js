/**
 * component
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

  // 组件名
  static get componentName() {
    return this.name.toLowerCase();
  }

  // 通用常量集，一般存放固定字符，如属性名、CSS 类名等
  static get CONST() {
    return {
      ATTR_ID: `lay-${this.componentName}-id`, // 用于记录组件实例 id 的属性名

      CLASS_THIS: 'lay-this',
      CLASS_SHOW: 'lay-show',
      CLASS_HIDE: 'lay-hide',
      CLASS_HIDEV: 'lay-hide-v',
      CLASS_DISABLED: 'lay-disabled',
      CLASS_NONE: 'lay-none',
    };
  }

  // 事件
  static on(events, callback) {
    return lay.onevent.call(this, this.componentName, events, callback);
  }

  /**
   * 获取指定的实例
   * @param {string|number} id - 实例 id
   * @returns {InstanceType<typeof this>|undefined} - 组件实例
   */
  static getInst(id) {
    if (id === undefined) {
      throw new Error('ID argument required');
    }
    return getInstanceBucket(this)[id];
  }

  /**
   * 移除实例
   * @param {string|number} id - 实例 id
   */
  static removeInst(id) {
    delete getInstanceBucket(this)[id];
  }

  // 获取所有实例
  static getAllInst() {
    return getInstanceBucket(this);
  }

  // 移除所有实例（置空）
  static removeAllInst() {
    instanceBuckets.set(this, Object.create(null));
  }

  /**
   * 组件重载
   * @param {string|number} id - 实例 id
   * @param {Object} options - 配置项
   * @returns {InstanceType<typeof this>|undefined} - 组件实例
   */
  static reload(id, options) {
    var inst = this.getInst(id);
    if (!inst) return;

    return inst.reload(options);
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

  // 重载实例
  reload(options) {
    $.extend(this.options, options);
    return this.#init(true);
  }

  /**
   * 初始化处理（若由事件触发渲染，则必经此步）
   * @param {boolean} rerender - 是否为重载渲染
   * @returns
   */
  #init(rerender) {
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

      return $elem
        .map((_, elem) => Constructor.render({ ...batchOptions, elem }))
        .get();
    }

    // 合并 lay-options 属性上的配置信息（鉴于 CSP 策略，后续将移除此功能）
    const layOptions = lay.options($elem[0]);
    if (rerender) {
      // 若重载渲染，则重载传入的 options 配置优先
      options = this.options = $.extend(layOptions, options);
    } else {
      $.extend(options, layOptions); // 若首次渲染，则 lay-options 配置优先
    }

    // 若对目标元素重复渲染，则视为 reload 处理
    if (!rerender) {
      if (existingId) {
        const inst = Constructor.getInst(existingId);
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
      this.render(rerender); // 渲染核心
    }

    return this;
  }

  /**
   * 元素缓存操作。非文档化接口,一般用于组件内部
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   * @param {boolean} remove - 是否删除缓存
   * @returns {*} - 若 value 未传，则返回缓存值
   */
  cache(key, value, remove) {
    const options = this.options;
    const $elem = options.$elem;
    const Constructor = this.constructor;
    const ATTR_ID = Constructor.CONST.ATTR_ID;
    const ATTR_ID_CACHE = `${ATTR_ID}-cache`;

    if (!$elem) return;

    const data = $elem.data(ATTR_ID_CACHE) || {};

    // 若 value 未传，则视为取值
    if (value === undefined) {
      return data[key];
    }

    if (remove) {
      delete data[key]; // 删除缓存
    } else {
      data[key] = value; // 设置缓存
    }

    $elem.data(ATTR_ID_CACHE, data);
  }

  /**
   * 清除元素缓存
   * @param {string} key - 缓存键
   */
  removeCache(key) {
    this.cache(key, null, true);
  }
}
