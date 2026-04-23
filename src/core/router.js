/**
 * router
 * 前端路由管理器
 */

class Router {
  constructor(options) {
    this.config(options);
  }

  // 默认配置项
  static options = {
    mode: 'hash', // 路由模式。可选项：'hash' | 'history'
  };

  /**
   * 设置选项
   * @param {Object} options
   */
  config(options) {
    this.options = { ...Router.options, ...options };
  }

  /**
   * URL 锚路由解析
   * @param {string} [hash] - URL 锚字符串
   * @returns {Object}
   * @example
   * hash('#/user/profile?tab=info#section1') // 返回结果同 `new URL()`
   */
  hash(anchor = location.hash) {
    // 去除锚字符开头的空白和 # 号。为空时视为 '/'（见 normalizeUrl 约定）
    const url = String(anchor ?? '').replace(/^\s*#?/, '') || '/';
    return new URL(url, location.href);
  }

  url(url = location.href) {
    return new URL(url, location.href);
  }

  /**
   * 标准化 URL
   * @param {string} url - 原始 URL
   * @returns {string} 标准化后的 URL
   */
  normalizeUrl(url = '') {
    const { options } = this;
    const currentUrl = this.url();
    const isProtocolRelative = /^\/\//.test(url);
    const isExplicitAbsolute = /^[a-zA-Z][\w+.-]*:/.test(url);

    if (!url) {
      return options.mode === 'hash' ? '/' : '';
    }

    // hash 模式下，保持 `/` 开头
    if (options.mode === 'hash' && !isExplicitAbsolute && !isProtocolRelative) {
      if (!/^\//.test(url)) {
        url = '/' + url;
      }
    }

    const parsedUrl = this.url(url);
    const normalizedPathname = parsedUrl.pathname.replace(/(\/+)/g, '/');
    const normalizedPath =
      normalizedPathname + parsedUrl.search + parsedUrl.hash;

    if (isProtocolRelative) {
      return '//' + parsedUrl.host + normalizedPath;
    }

    if (isExplicitAbsolute || parsedUrl.origin !== currentUrl.origin) {
      return parsedUrl.origin + normalizedPath;
    }

    return normalizedPath;
  }

  /**
   * 执行路由跳转
   * @param {string} url - 目标路径，支持相对或绝对路径（会自动标准化）
   * @param {Object} [opts] - 跳转选项
   * @param {boolean} [opts.replaceState=false] - 是否使用 replaceState 方式跳转（仅 history 模式有效）
   * @param {*} [opts.state=null] - 传递给 history 的状态对象（仅 history 模式有效）
   * @param {string} [opts.title=''] - 页面标题（部分浏览器忽略，仅 history 模式传入）
   * @param {string} [opts.target='_self'] - url 跨域时 window.open 的打开方式
   * @param {Function} [opts.done] - 跳转后的回调函数
   * @returns {void}
   * @example
   * router.navigate('/user/profile');
   */
  navigate(url, opts = {}) {
    const { options } = this;

    if (!url) return;
    url = this.normalizeUrl(url);

    // 默认值
    opts = {
      mode: options.mode,
      state: null,
      title: '',
      target: '_self',
      ...opts,
    };

    // 路由跳转方式
    if (opts.mode === 'hash') {
      location.hash = url;
    } else {
      const { href } = this.url();

      try {
        // 使用 replaceState 的任一条件：
        // - 目标 url 与当前页面 url 相同
        // - opts.replaceState 为 true
        const historyMethod =
          this.url(url).href === href || opts.replaceState
            ? 'replaceState'
            : 'pushState';

        history[historyMethod](opts.state, opts.title, url);
      } catch {
        // url 跨域等异常时的降级处理
        window.open(url, opts.target);
      }
    }

    opts.done?.({ url });
  }

  /**
   * 路由变化事件
   * @param {Function} callback - 路由变化时的回调函数
   * @returns {Function} 清除事件的函数
   */
  onRouteChange(callback) {
    const { options } = this;
    const type = options.mode === 'hash' ? 'hashchange' : 'popstate';

    window.addEventListener(type, callback);
    return () => window.removeEventListener(type, callback);
  }
}

// 内置实例
const router = new Router();

export { Router, router };
