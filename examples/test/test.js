/**
 * test
 * Layui 可视化简易单元测试
 */

const { lay, util } = layui;

class Test {
  constructor(options) {
    lay.extend(this.options, options);
    this.#init();
    this.#render();
  }

  static stats = {
    total: 0,
    passes: 0,
    failures: 0
  };

  options = {
    elem: '#tests'
  };

  #init() {
    const options = this.options;

    options.el = lay(options.elem);
  }

  #render() {
    const options = this.options;
    const { el } = options;

    el.html('');
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
    }
  };

  describe(opts, fn) {
    const { el } = this.options;

    if (typeof opts === 'string') {
      opts = {
        title: opts,
        id: opts
      };
    }

    const describer = (this.describer = lay.extend(
      {
        suiteElem: lay.elem('div', {
          class: 'layui-text test-suite',
          id: opts.id
        }),
        itemsElem: lay.elem('div', {
          class: 'test-items'
        })
      },
      opts
    ));

    lay(describer.suiteElem).append(`<h2>${opts.title} : </h2>`);
    lay(describer.suiteElem).append(describer.itemsElem);
    el.append(describer.suiteElem);

    fn?.(this.#it.bind(this));
    return this;
  }

  #it(opts = {}) {
    let { code, expected, title, assert } = opts;
    const describer = this.describer;
    const itemsElem = lay(describer.itemsElem);
    const stats = Test.stats;

    const startTime = Date.now();
    const actual = (function () {
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
    const passed = (
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
        `${describer.title} → ${title} : Test failed\nExpected: ${output(expected)}\nActual: ${output(actual)}`
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

    layui.code({
      elem: lay(itemElem).find('.layui-code')[0],
      theme: 'dark',
      encode: false
    });

    itemsElem.append(itemElem);
  }

  stats() {
    const options = this.options;
    const { el } = options;
    const stats = Test.stats;
    const statsElem = lay.elem('div', { class: 'test-stats' });

    lay(statsElem).html(`
      <span><strong>测试数量 : </strong>${stats.total}</span>
      <span><strong>✅ 通过 : </strong>${stats.passes}</span>
      <span><strong>❌ 失败 : </strong>${stats.failures}</span>
    `);
    el[0].prepend(statsElem);
  }
}

export function test(options) {
  return new Test(options);
}
