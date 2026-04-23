/**
 * loader
 * 加载器
 */

import { lay } from './lay.js';

// 生成 URL Key
const createUrlKey = (url) => {
  const u = new URL(url, location.href);
  return u.host + u.pathname;
};

/**
 * 资源加载器
 * @param {string} url - 资源路径
 * @param {Object} opts - 配置项
 * @param {HTMLElement} opts.elem - 资源 DOM 元素
 * @param {string} [opts.id] - 资源元素 ID，若未提供且 opts.autoId 为 true，则自动生成
 * @param {boolean} [opts.autoId=false] - 是否根据 url 自动生成元素唯一 ID
 * @param {Function} [opts.success] - 加载成功的回调函数
 * @param {Function} [opts.error] - 加载失败的回调函数
 * @param {Function} [opts.done] - 资源加载完成后的回调函数
 * @param {Function} [opts.afterCreate] - 资源元素创建后、插入 DOM 前的钩子函数
 * @returns {Promise<Object>} 加载结果对象
 * @example
 * // 一、传统回调方式
 *
 * // 加载单个资源
 * loadResource('url', {
 *   elem: document.createElement('link'),
 *   success(elem) {
 *     // 资源加载成功
 *   },
 *   error(e) {
 *     // 资源加载失败
 *   },
 * });
 * // 加载多个资源
 * loadResource(['url1', 'url2'], opts);
 *
 * // 二、Promise 方式
 *
 * // 链式调用
 * loadResource('url', opts).then((result) => {});
 * // async/await
 * const result = await loadResource('url', opts);
 */
const loadResource = async (url, opts = {}) => {
  // 根据 url 生成唯一 id
  const generateId = (url) => {
    const base64Id = lay.btoa(createUrlKey(url), 'url');
    return `LAY-LOADER-${base64Id}`;
  };

  // 元素唯一 id
  const id = opts.id || (opts.autoId ? generateId(url) : undefined);
  // console.log(`${url} → ${id}`);

  // 元素是否已存在
  const existingElem = document.getElementById(id);

  if (existingElem) {
    opts.elem = existingElem;
  }

  return new Promise((resolve) => {
    const { elem } = opts;
    const result = { elem, id, url };

    // 加载完成的标记，用于幂等保护
    let complete = false;

    // 加载完成后的相关处理
    const done = (ret) => {
      complete = true;
      opts.done?.(ret);
      resolve(ret);
    };

    const controller = new AbortController();
    const { signal } = controller;

    // 加载成功 handler
    const onLoad = function (e) {
      controller.abort();
      if (complete) return;

      // 给元素标记加载完成状态，避免重复调用方法时的回调问题
      elem.__lay_state__ = 'complete';

      // 执行回调
      opts.success?.(result, e);
      done(result);
    };
    // 加载失败 handler
    const onError = function (e) {
      controller.abort();
      if (complete) return;

      const ret = {
        ...result,
        error: new Error(`Failed to load resource: ${url}`),
      };

      // 清除加载状态标记
      delete elem.__lay_state__;

      opts.error?.(ret, e);
      done(ret);
    };

    // 在外链资源前绑定事件，避免「竞态条件」导致事件错过触发
    elem.addEventListener('load', onLoad, { signal });
    elem.addEventListener('error', onError, { signal });

    // 创建元素之后的回调函数，用于处理后续逻辑
    opts.afterCreate?.(result, onLoad, onError);

    // 若元素的「加载状态」已完成
    if (elem.__lay_state__ === 'complete') {
      onLoad();
    }
  });
};

/**
 * 加载多个资源
 * @param {Array} urls - 资源路径数组列表
 * @param {Object<typeof loadResource>} opts - 参数结构同 {@link loadResource}
 * @param {Function} resourceLoader - 资源加载函数（必填），应为 loader.script | loader.css | loader.image
 * @returns {Promise<Object>} 加载结果集对象
 */
const loadAll = async (urls, opts = {}, resourceLoader = loadResource) => {
  let successful = 0;
  let completed = 0;
  const results = {};

  // 处理成结果集
  const aggregateResults = (result) => {
    for (const [key, value] of Object.entries(result)) {
      const values = results[key] || [];
      values.push(value);
      results[key] = values;
    }
  };

  // 并行加载所有资源
  await Promise.all(
    urls.map((u) =>
      resourceLoader(u, {
        ...opts,
        success(result, ...args) {
          aggregateResults(result);

          // 所有资源加载成功后执行 success 回调
          if (++successful === urls.length) {
            opts.success?.(results, ...args);
          }
        },
        error(result) {
          aggregateResults(result);
        },
        done(_result, ...args) {
          if (++completed === urls.length) {
            // 任意资源加载失败即执行 error 回调
            if (results.error?.length) {
              opts.error?.(results, ...args);
            }
            opts.done?.(results, ...args);
          }
        },
      }),
    ),
  );

  return Promise.resolve(results);
};

// 核心类
class Loader {
  constructor(options) {
    this.config(options);
  }

  // 默认配置项
  static options = {
    alias: {}, // script、link 资源路径别名
    urlParams: '', // 加载 script、link 资源时，是否在 URL 后添加一个参数，避免浏览器缓存
    debug: false, // 是否开启调试模式，若开启，不会移除已加载的 script 节点
    // timeout: 10, // 请求最长等待秒数
  };

  // 模块加载缓存信息
  #cache = {
    status: {}, // script 资源加载状态集
  };

  /**
   * 设置选项
   * @param {Object} options
   */
  config(options) {
    this.options = lay.extend({}, Loader.options, options);
  }

  /**
   * 外部 script 加载器
   * @param {string} url - 外部 script 文件路径
   * @param {Object} [opts] - 加载配置项（可选），参数结构同 {@link loadResource}
   * @returns {Object} 加载结果
   */
  async script(url, opts = {}) {
    const { options } = this;
    const cache = this.#cache;
    const head = document.head;

    // 若批量加载
    if (Array.isArray(url) && url.length) {
      return await loadAll(url, opts, this.script.bind(this));
    }

    // 匹配别名
    if (options.alias[url]) {
      url = options.alias[url];
    }

    const urlKey = opts.id || createUrlKey(url);

    return await loadResource(url, {
      elem: document.createElement('script'),
      ...opts,
      autoId: true,
      success(result, e) {
        cache.status[urlKey] = true;

        // 保证文档加载完毕再执行回调
        lay.use(() => {
          opts.success?.(result, e);
        });
      },
      error(result, e) {
        // 加载失败，清除加载状态
        delete cache.status[urlKey];
        opts.error?.(result, e);
      },
      done(result) {
        // 加载完成，移除节点
        if (!options.debug) {
          if (document.contains(result.elem)) {
            head.removeChild(result.elem);
          }
        }
        opts.done?.(result);
      },
      afterCreate: (result, onLoad) => {
        const { elem, id } = result;

        // 是否已加载
        if (cache.status[urlKey]) {
          onLoad();
        } else {
          // 首次加载，创建节点
          if (!elem.__lay_state__) {
            const src = this.#normalizeUrl(url);

            Object.assign(elem, { src, async: true, id });
            head.appendChild(elem);

            // 资源开始加载的标记
            elem.__lay_state__ = 'loading';
          }
        }
      },
    });
  }

  /**
   * 外部 CSS 加载器
   * @param {string} url - 外部 CSS 文件路径
   * @param {Object} [opts] - 加载配置项（可选），参数结构同 {@link loadResource}
   * @returns {Promise<HTMLLinkElement>} 加载完成的 `<link>` 元素
   */
  async css(url, opts = {}) {
    const { options } = this;
    const head = document.head;

    // 若批量加载
    if (Array.isArray(url) && url.length) {
      return await loadAll(url, opts, this.css.bind(this));
    }

    // 匹配别名
    if (options.alias[url]) {
      url = options.alias[url];
    }

    // 若第二个参数为 string 类型，则该参数为 opts.id
    if (typeof opts === 'string') {
      opts = { id: opts };
    }

    return await loadResource(url, {
      elem: document.createElement('link'),
      ...opts,
      autoId: true,
      error(result, e) {
        // 加载失败，移除节点
        if (document.contains(result.elem)) {
          head.removeChild(result.elem);
        }
        opts.error?.(result, e);
      },
      afterCreate: (result) => {
        const { elem, id } = result;
        const href = this.#normalizeUrl(url);

        // 初始创建节点
        if (!document.contains(elem)) {
          Object.assign(elem, { href, rel: 'stylesheet', id });
          head.appendChild(elem);
        }

        // 若目标 href 与当前节点 href 值不同（一般为参数差异），则重新赋值
        if (href !== elem.getAttribute('href')) {
          elem.href = href;
        }
      },
    });
  }

  /**
   * 图片加载器
   * @param {string|string[]} url - 图片路径
   * @param {Object} [opts] - 加载配置项，参数结构同 {@link loadResource}
   * @returns {Promise<HTMLImageElement>} 加载完成的 `<img>` 元素
   */
  async image(url, opts = {}) {
    // 若批量加载
    if (Array.isArray(url) && url.length) {
      return await loadAll(url, opts, this.image.bind(this));
    }

    return await loadResource(url, {
      elem: new Image(),
      ...opts,
      afterCreate(result, onLoad, onError) {
        const { elem } = result;

        elem.src = url;

        // 若元素的「加载状态」已完成，则根据 naturalWidth 执行相应的回调函数
        if (elem.complete) {
          elem.naturalWidth > 0 ? onLoad() : onError();
        }
      },
    });
  }

  /**
   * 规范化 URL
   * @param {string} url - 原始 URL
   * @return {string} 规范化后的 URL
   */
  #normalizeUrl(url) {
    const urlParams = this.options.urlParams.trim?.().replace(/^(\?|&)/, '');
    if (!urlParams) return url;
    const u = new URL(url, location.href);
    return `${url}${u.search ? '&' : '?'}${urlParams}`;
  }
}

// 内置实例
const loader = new Loader();

export { loadResource, Loader, loader };
