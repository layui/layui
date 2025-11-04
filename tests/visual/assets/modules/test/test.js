/**
 * test
 * Layui 可视化简易单元测试
 */

const { lay, code: layCode } = layui;

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
    elem: '#root',
    sideWidth: '160px',
  };

  #init() {
    const options = this.options;

    options.el = lay(options.elem);
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
    const menuElem = lay.elem('div', {
      class: 'layui-menu',
    });
    const mainElem = (this.mainElem = lay.elem('div', {
      class: 'test-main',
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
          lay(liElem).attr('class', 'layui-menu-item-divider');
        } else {
          const hasChildren = item.children && item.children.length;
          const anchor = hasChildren
            ? 'javascript:;'
            : `#${parentName ? parentName + '.' : ''}${item.name}`;

          lay(liElem).append(`
            <div class="layui-menu-body-title">
              <a href="${anchor}">${title}</a>
            </div>
          `);

          if (hasChildren) {
            const ulElem = lay.elem('ul');
            lay(liElem).attr(
              'class',
              'layui-menu-item-group layui-menu-item-down',
            );
            renderMenu(ulElem, item.children, item.name);
            lay(liElem).append(ulElem);
          }
        }

        lay(target).append(liElem);
      });
    })(menuElem, options.items || []);

    sideElem.append(menuElem);
    wrapperElem.append(sideElem);
    wrapperElem.append(mainElem);
    el.html('').append(wrapperElem);
  }

  static tools = {
    isPlainObjectOrArray(obj) {
      return lay.isPlainObject(obj) || Array.isArray(obj);
    },
    equal(a, b) {
      const isPlainObjectOrArray = Test.tools.isPlainObjectOrArray;

      if (isPlainObjectOrArray(a) || isPlainObjectOrArray(b)) {
        a = isPlainObjectOrArray(a) ? JSON.stringify(a) : a;
        b = isPlainObjectOrArray(b) ? JSON.stringify(b) : b;
      }
      return a === b;
    },
    output(obj) {
      const isPlainObjectOrArray = Test.tools.isPlainObjectOrArray;
      if (isPlainObjectOrArray(obj)) {
        return JSON.stringify(obj);
      }
      return obj;
    },
  };

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

    lay(describer.suiteElem).append(`<h2>${opts.title} : </h2>`);
    lay(describer.suiteElem).append(describer.itemsElem);
    lay(this.mainElem).append(describer.suiteElem);

    fn?.(this.#it.bind(this));
    return this;
  }

  async #it(opts = {}) {
    let { code, expected, title, assert } = opts;
    const describer = this.describer;
    const stats = Test.stats;

    const startTime = Date.now();
    const actual = (() => {
      try {
        return new Function(`return function() {
          let result;
          const console = Object.assign({}, window.console);
          console.log = (a) => result = a;
          ${code}
          return result;
        }`)()();
      } catch (e) {
        return e.message;
      }
    })();

    const duration = (Date.now() - startTime) / 1000;
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

    layCode({
      elem: lay(itemElem).find('.layui-code')[0],
      theme: 'dark',
      encode: false,
    });

    lay(describer.itemsElem).append(itemElem);

    // 更新统计信息
    this.#stats();
  }

  #stats() {
    const options = this.options;
    const { el } = options;
    const stats = Test.stats;
    const statsElem = lay.elem('div', { class: 'test-stats' });
    const existingStatsElem = this.mainElem.querySelector('.test-stats');

    lay(statsElem).html(`
      <span><strong>测试数量 : </strong>${stats.total}</span>
      <span><strong>✅ 通过 : </strong>${stats.passes}</span>
      <span><strong>❌ 失败 : </strong>${stats.failures}</span>
    `);

    if (existingStatsElem) {
      existingStatsElem.replaceWith(statsElem);
    } else {
      this.mainElem.prepend(statsElem);
    }
  }
}

export function test(options) {
  return new Test(options);
}
