/**
 * test
 * 可视化简易单元测试
 * 该模块依赖 Layui umd 版本
 */

const { lay, code: layCode, loader, $ } = layui;

class Test {
  constructor(options) {
    lay.extend(this.options, options);
    this.#init();
    this.#render();
  }

  static stats = {
    total: 0,
    passes: 0,
    failures: 0,
  };

  options = {
    elem: '#root', // 容器元素选择器
    sideWidth: '160px', // 侧边栏宽度
    activeIndex: 0, // 默认激活的测试套件索引
  };

  #init() {
    const options = this.options;

    options.el = $(options.elem);
  }

  #render() {
    const options = this.options;
    const { el } = options;

    const wrapperElem = lay.elem('div', {
      class: 'test-wrapper',
    });
    const sideElem = lay.elem('div', {
      class: 'layui-panel test-side',
    });
    const menuElem = (this.menuElem = lay.elem('div', {
      class: 'layui-menu',
    }));
    const mainElem = (this.mainElem = lay.elem('div', {
      class: 'test-main',
    }));
    const suitesElem = (this.suitesElem = lay.elem('div', {
      class: 'test-suites',
    }));

    lay.style({
      target: wrapperElem,
      text: `
.test-wrapper {
  --lay-test-menu-width: ${options.sideWidth};
}
      `,
    });

    // 初始化 menu
    (function renderMenu(target, items, parentName) {
      items.forEach((item) => {
        const liElem = lay.elem('li');
        const title = item.title || item.name;

        if (item.type === '-') {
          $(liElem).attr('class', 'layui-menu-item-divider');
        } else {
          const hasChildren = item.children && item.children.length;
          const anchor = hasChildren
            ? 'javascript:;'
            : `#${parentName ? parentName + '.' : ''}${item.name}`;

          item.hash = anchor;

          $(liElem).addClass('test-menu-item').append(`
            <div class="layui-menu-body-title">
              <a href="${anchor}">${title}</a>
            </div>
          `);

          if (hasChildren) {
            const ulElem = lay.elem('ul');
            $(liElem).attr(
              'class',
              'layui-menu-item-group layui-menu-item-down',
            );
            renderMenu(ulElem, item.children, item.name);
            $(liElem).append(ulElem);
          }
        }

        $(target).append(liElem);
      });
    })(menuElem, options.items || []);

    const flatItems = lay.treeToFlat(options.items).filter((item) => {
      return item.type !== '-' && !item.children;
    });
    // console.log(flatItems);

    // 根据 hash，初始化默认显示的测试套件
    this.initSwitchSuite = () => {
      const hash = location.hash;
      const foundIndex = flatItems.findIndex((item) => item.hash === hash);
      const index = foundIndex >= 0 ? foundIndex : options.activeIndex;

      this.#switchSuite(index >= 0 ? index : 0);
    };

    // hash 切换事件
    window.addEventListener('hashchange', this.initSwitchSuite);

    sideElem.append(menuElem);
    mainElem.append(suitesElem);
    wrapperElem.append(sideElem);
    wrapperElem.append(mainElem);
    el.html('').append(wrapperElem);
  }

  static tools = {
    // 是否纯对象或纯数组
    isPlainObjectOrArray(obj) {
      return lay.isPlainObject(obj) || Array.isArray(obj);
    },
    // 相等比较
    equal(a, b) {
      const isPlainObjectOrArray = Test.tools.isPlainObjectOrArray;

      if (isPlainObjectOrArray(a) || isPlainObjectOrArray(b)) {
        a = isPlainObjectOrArray(a) ? JSON.stringify(a) : a;
        b = isPlainObjectOrArray(b) ? JSON.stringify(b) : b;
      }
      return a === b;
    },
    // 输出
    output(obj) {
      const isPlainObjectOrArray = Test.tools.isPlainObjectOrArray;
      if (isPlainObjectOrArray(obj)) {
        return JSON.stringify(obj);
      }
      return obj;
    },
  };

  /**
   * 描述测试用例
   * @param {(string|Object)} opts - 描述信息或配置项
   * @param {Function} fn - 测试用例函数
   */
  describe(opts, fn) {
    const { el } = this.options;

    if (typeof opts === 'string') {
      opts = {
        title: opts,
        id: opts,
      };
    }

    const describer = (this.describer = lay.extend(
      {
        suiteElem: lay.elem('div', {
          class: 'layui-text test-suite',
          id: opts.id,
        }),
        itemsElem: lay.elem('div', {
          class: 'test-items',
        }),
      },
      opts,
    ));

    $(describer.suiteElem).append(`<h2>${opts.title} : </h2>`);
    $(describer.suiteElem).append(describer.itemsElem);
    $(this.suitesElem).append(describer.suiteElem);

    fn?.(this.#it.bind(this));
    return this;
  }

  /**
   * 测试用例
   * @param {Object} opts - 配置项
   * @param {string} opts.title - 测试用例标题
   * @param {string} opts.code - 测试用例代码
   * @param {string} opts.expected - 测试用例预期结果
   * @param {Function} opts.assert - 测试用例断言函数
   * @param {Object} opts.vars - 测试用例变量
   * @param {boolean} opts.showActual - 是否显示实际结果
   * @returns {Promise<void>}
   */
  async #it(opts = {}) {
    let { code, expected, title, assert } = opts;
    const describer = this.describer;
    const stats = Test.stats;
    const startTime = Date.now();

    // 在沙箱环境中执行测试代码，并获取实际结果
    const actual = await (async () => {
      try {
        const vars = {
          ...this.options.vars,
          ...opts.vars,
        };
        const sandboxedTestFn = `async function(layui,${Object.keys(vars).join(',')}) {
  let result;
  const console = Object.assign({}, window.console);
  console.log = (a) => result = a;
  ${code}
  return result;
}
        `;
        // console.log(sandboxedTestFn);
        return new Function(`return ${sandboxedTestFn};`)()(
          layui,
          ...Object.values(vars),
        );
      } catch (e) {
        console.error(e);
        return e.message;
      }
    })();

    const duration = (Date.now() - startTime) / 1000;

    // 是否通过
    const passed = await (
      assert ? assert.bind(arguments[0]) : Test.tools.equal.bind(this)
    )(actual, expected);
    const result = passed ? '✅' : '❌';
    const output = Test.tools.output;
    const itemElem = lay.elem('div', { class: 'test-item' });

    stats.total++;
    title = title || `任务 ${stats.total}`;

    if (passed) {
      stats.passes++;
    } else {
      stats.failures++;
      console.error(
        `${describer.title} → ${title} : Test failed\nExpected: ${output(expected)}\nActual: ${output(actual)}`,
      );
    }

    itemElem.innerHTML = `
      <div><strong>${title}：</strong></div>
      <pre class="layui-code">${code}</pre>
      <div class="test-result">
        <ul>
          <li><strong>预期：</strong><code>${output(expected)}</code></li>
          ${
            !passed || opts.showActual
              ? '<li><strong>实际：</strong><code>' +
                output(actual) +
                '</code></li>'
              : ''
          }
          <li>
            <span><strong>结果：</strong>${output(result)}</span>
            <!-- <span><strong>耗时：</strong>${duration.toFixed(2)} s</span> -->
          </li>
        </ul>
      </div>
    `;

    const codeInst = layCode({
      elem: $(itemElem).find('.layui-code')[0],
      theme: 'dark',
      encode: false,
    });

    // 代码高亮
    (async () => {
      // 加载 highlight.js
      const HLJS_VERSION = '11.11.1';
      const CDN_BASE = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}`;
      await loader.script(`${CDN_BASE}/highlight.min.js`);
      await loader.css(`${CDN_BASE}/styles/github-dark.min.css`);
      codeInst.reload({
        highlighter: 'hljs',
        codeRender: (code, opts) => {
          code = lay.unescape(code);
          return hljs.highlight(code, {
            language: 'javascript',
          }).value;
        },
      });
    })();

    $(describer.itemsElem).append(itemElem);

    // 更新统计信息
    this.#stats();

    this.initSwitchSuite();

    // 测试完成的回调
    opts.done?.({ itemElem, actual, expected, passed, duration });
  }

  // 切换测试套件的显示
  #switchSuite(activeIndex) {
    const CLASS_ACTIVE = 'active';
    const CLASS_MENU_ITEM_CHECKED = 'layui-menu-item-checked';
    const menuItem = $(this.menuElem).find('li.test-menu-item');

    menuItem.removeClass(CLASS_MENU_ITEM_CHECKED);
    menuItem.eq(activeIndex).addClass(CLASS_MENU_ITEM_CHECKED);
    $(this.suitesElem)
      .children('.test-suite')
      .eq(activeIndex)
      .addClass(CLASS_ACTIVE)
      .siblings()
      .removeClass(CLASS_ACTIVE);
  }

  // 统计
  #stats() {
    const options = this.options;
    const { el } = options;
    const stats = Test.stats;
    const statsElem = lay.elem('div', { class: 'test-stats' });
    const existingStatsElem = this.mainElem.querySelector('.test-stats');

    $(statsElem).html(`
      <span><strong>测试数量 : </strong>${stats.total}</span>
      <span><strong>✅ 通过 : </strong>${stats.passes}</span>
      <span><strong>❌ 失败 : </strong>${stats.failures}${stats.failures > 0 ? '（控制台查看详情）' : ''}</span>
    `);

    if (existingStatsElem) {
      existingStatsElem.replaceWith(statsElem);
    } else {
      this.mainElem.prepend(statsElem);
    }
  }
}

/**
 * 创建测试实例
 * @param {Object} options - 配置项
 * @param {(string|HTMLElement|JQuery)} options.elem - 容器元素选择器或对象
 * @param {Array} options.items - 测试项列表
 * @param {Object} options.vars - 传递给测试沙箱中的变量
 * @param {string} options.sideWidth - 侧边栏宽度
 * @returns {Test} 测试实例
 */
export function test(options) {
  return new Test(options);
}
