/**
 * laytpl
 * 轻量级通用模板引擎
 */

(function(global) {
  'use strict';

  var MOD_NAME = 'laytpl';

  // 实例接口
  var thisModule = function() {
    var that = this;
    var options = that.config;

    return {
      config: options,

      /**
       * 渲染模板
       * @param {Object} data - 模板数据
       * @param {Function} callback - 回调函数
       * @returns {string} 渲染后的模板
       */
      render: function(data, callback) {
        options.data = data
        var html = that.render();

        // 如果传入目标元素选择器，则直接将模板渲染到目标元素中
        if (options.target) {
          var elem = document.querySelector(options.target);
          if (elem) {
            elem.innerHTML = html;
          }
        }

        // 返回结果
        return typeof callback === 'function'
          ? (callback(html), this)
          : html;
      },

      /**
       * 编译新的模板
       * @param {string} template - 模板
       * @returns {this}
       */
      compile: function(template) {
        options.template = template;
        delete that.compilerCache; // 清除模板缓存
        // that.compile(template);
        return this;
      },

      /**
       * 模板编译错误事件
       * @param {Function} callback
       * @returns {this}
       */
      error: function(callback) {
        callback && (options.error = callback);
        return this;
      },

      /**
       * 以下为兼容旧版本相关方法
       */

      // 解析并渲染模板
      parse: function(template, data) {
        return this.compile(template).render(data);
      }
    };
  };

  // 模板内部变量
  var vars = {
    // 字符转义
    escape: function(html) {
      var exp = /[<"'>]|&(?=#?[a-zA-Z0-9]+)/g;
      if (html === undefined || html === null) return '';
      html += '';
      if (!exp.test(html)) return html;
      return html.replace(exp, function(str) {
        return '&#'+ str.charCodeAt(0) + ';';
      });
    }
  };

  // 组件工具类方法
  var tools = {
    /**
     * 创建动态正则表达式
     * @param {string} str - 表达式字符
     * @param {string} mod - 修饰符
     * @returns {RegExp} - 正则表达式
     */
    regex: function(str, mod) {
      return new RegExp(str, mod || 'g');
    },

    /**
     * 错误提示
     * @param {string} e - 原始错误信息
     * @param {Object} opts - 自定义选项
     * @param {Function} error - 错误回调
     * @returns {string} - 错误提示
     */
    error: function(e, opts, error) {
      opts = opts || {};
      opts = Object.assign({
        errorContext: ''
      }, opts);

      // 向控制台输出错误信息
      var message = 'Laytpl '+ (opts.type || '') +'Error: ' + e;
      var errorContext = opts.errorContext;

      delete opts.errorContext;
      typeof console === 'object' && console.error(message, '\n', errorContext, '\n', opts);
      typeof error === 'function' && error(opts); // 执行错误回调
      return message; // 向视图返回错误提示
    }
  };

  // 默认配置
  var config = {
    open: '{{', // 起始界定符
    close: '}}', // 结束界定符
    cache: true, // 是否开启模板缓存，以便下次渲染时不重新编译模板
    condense: true, // 是否压缩模板空白符，如：将多个连续的空白符压缩为单个空格
    tagStyle: '' // 标签风格。默认采用 < 2.11 的风格，设置 modern 则采用 2.11+ 风格
  };

  // 构造器
  var Class = function(template, options) {
    var that = this;

    // 选项合并
    options = that.config = Object.assign({
      template: template
    }, config, options);

    // 当前实例的模板内工具
    that.vars = Object.assign({
      /**
       * 引用外部模板。若在 Node.js 环境，可通过重置该方法实现模板文件导入
       * @param {string} id - 模板 ID
       * @param {Object} data - 模板数据
       * @returns {string} 模板渲染后内容
       */
      include: function(id, data) {
        var elem = document.getElementById(id);
        var template = elem ? elem.innerHTML : '';
        return template ? that.render(template, data) : '';
      }
    }, vars);

    // 编译模板
    that.compile(options.template);
  };

  /**
   * 渲染
   * @param {Object} template - 模板
   * @param {Object} data - 数据
   * @returns {string} 渲染后的模板内容
   */
  Class.prototype.render = function(template, data) {
    var that = this;
    var options = that.config;

    // 获得模板渲染函数
    var compiler = template ? that.compile(template) : (
      that.compilerCache || that.compile(options.template)
    );

    // 获取渲染后的字符
    var html = function() {
      data = data || options.data || {};
      try {
        return compiler(data);
      } catch(e) {
        template = template || options.template;
        return tools.error(e, {
          errorContext: that.extractErrorContext(template, data),
          template: template,
          type: 'Render'
        }, options.error);
      }
    }();

    // 缓存编译器
    if (options.cache && !template) {
      that.compilerCache = compiler;
    }

    return html; // 返回渲染后的字符
  };

  /**
   * 编译模板
   * @param {string} template - 原始模板
   * @returns {Function} 模板编译器，用于后续数据渲染
   */
  Class.prototype.compile = function(template) {
    var that = this;
    var options = that.config;
    var openDelimiter = options.open;
    var closeDelimiter = options.close;
    var condense = options.condense;
    var regex = tools.regex;
    var placeholder = '\u2028'; // Unicode 行分隔符

    // console.log('compile');

    // 模板必须为 string 类型，且不能为空
    if (typeof template !== 'string' || !template) {
      return function() {
        return '';
      };
    }

    /**
     * 完整标签正则
     * @param {string[]} cores - 标签内部核心表达式，含：前置、主体、后置
     * @param {Object} sides - 标签两侧外部表达式
     * @returns {RegExp}
     */
    var tagRegex = function(cores, sides) {
      var arr = [
        '(?:'+ openDelimiter + (cores[0] || '') +'\\s*)', // 界定符前置
        '('+ (cores[1] || '[\\s\\S]') +'*?)', // 标签主体
        '(?:\\s*'+ (cores[2] || '') + closeDelimiter +')' // 界定符后置
      ];
      sides = sides || {};
      sides.before && arr.unshift(sides.before); // 标签前面的表达式
      sides.after && arr.push(sides.after); // 标签后面的表达式
      return regex(arr.join(''));
    };

    // 匹配非输出类型标签两侧的换行符和空白符，避免渲染后占用一行
    var sidesRegex = condense ? ['', ''] : ['(?:(?:\\n)*\\s*)', '(?:\\s*?)'];
    var delimSides = {
      before: sidesRegex[0],
      after: sidesRegex[1]
    };

    /**
     * 清理多余符号
     * @param {string} body - 标签主体字符
     * @param {boolean} nowrap - 是否强制不换行
     * @returns {string} 清理后的字符
     */
    var clear = function(body, nowrap) {
      if (!condense) {
        // 还原语句中的 Unicode 行分隔符
        body = body.replace(regex(placeholder), nowrap ? '' : '\n');
      }
      body = body.replace(/\\(\\|")/g, '$1'); // 去除多余反斜杠
      return body;
    };

    // 纠正标签结构
    var correct = function(tpl) {
      return tpl.replace(regex('([}\\]])'+ closeDelimiter), '$1 '+ closeDelimiter);
    };

    // 模板解析
    var parse = that.parse = function(tpl) {
      tpl = tpl || '';
      if (!tpl) return tpl;

      // 压缩连续空白符
      if (condense) {
        tpl = tpl.replace(/\t/g, ' ').replace(/\s+/g, ' ');
      }

      // 初始整理
      tpl = correct(tpl) // 纠正标签
      .replace(/(?=\\|")/g, '\\')  // 转义反斜杠和双引号
      .replace(/\r?\n/g, condense ? '' : placeholder); // 整理换行符

      // 忽略标签 - 即区域中的内容不进行标签解析
      tpl = tpl.replace(tagRegex(['!', '', '!'], delimSides), function(str, body) {
        body = body.replace(regex(openDelimiter + '|' + closeDelimiter), function(tag) {
          return tag.replace(/(?=.)/g, '\\');
        });
        return body;
      });

      // 模板字符拼接
      var strConcatenation = function(body) {
        // 通过对 20k+ 行的模板进行编译测试， 发现 Chrome `+=` 性能竟优于 `push`
        // 1k 次循环 + 1k 行数据量进行模板编译+渲染，发现 `+=` 性能仍然优于 `push`
        // 考虑可能是 V8 做了 Ropes 结构优化？ 或跟模板采用「静态拼接」的实现有关（可能性更大）
        return ['";', body, '__laytpl__+="'].join('\n');
        // return ['");', body, '__laytpl__.push("'].join('\n');
      };

      // 解析输出标签
      var output = function(str, delimiter, body) {
        var _escape;

        if (!body) return '';
        body = clear(body, true);

        // 输出方式
        if (delimiter === '-') {  // 原文输出，即不对 HTML 原文进行转义
          _escape = '';
        } else { // 转义输出
          _escape = '_escape';
        }

        return body ? strConcatenation(
          '__laytpl__+='+ _escape +'('+ body +');'
          // '__laytpl__.push('+ _escape +'('+ body +'));'
        ) : '';
      };

      // 解析 Scriptlet
      var statement = function(str, body) {
        if (!body) return '';
        body = clear(body);
        return strConcatenation(body);
      };

      // 标签风格
      if (options.tagStyle === 'modern') { // 2.11+ 版本风格
        // 注释标签 - 仅在模板中显示，不进行解析，也不在视图中输出
        tpl = tpl.replace(tagRegex(['#'], delimSides), '');
        // 输出标签
        tpl = tpl.replace(tagRegex(['(=|-)']), output);
        // Scriptlet 标签
        tpl = tpl.replace(tagRegex([], delimSides), statement);
      } else { // < 2.11 版本风格
        // Scriptlet 标签
        tpl = tpl.replace(tagRegex(['#'], delimSides), statement);
        // 输出标签
        tpl = tpl.replace(tagRegex(['(=|-)*']), output);
      }

      // 恢复换行符
      if (!condense) {
        tpl = tpl.replace(regex(placeholder), '\\n');
      }

      return tpl;
    };

    /**
     * 创建模板编译器
     * 请注意: 开发者在使用模板语法时，需确保模板中的 JS 语句不来自于页面用户输入。
     * 即模板中的 JS 语句必须在页面开发者自身的可控范围内，否则请避免使用该模板解析。
     */
    var createCompiler = that.createCompiler = function(template, builder) {
      builder = builder || createBuilder(template);
      return new Function('laytpl', 'return '+ builder)(that.vars);
    };
    var createBuilder = that.createBuilder = function(template, builder) {
       builder = builder || [
        'function(d){',
          '"use strict";',
          'var __laytpl__="",'+
          function() { // 内部变量
            // 内部方法
            var arr = [];
            for (var key in that.vars) {
              arr.push(((key === 'escape' ? '_' : '') + key) +'=laytpl.'+ key);
            }
            return arr.join(',');
          }() + ';',
          '__laytpl__="'+ parse(template) +'";',
          'return __laytpl__;',
          // '__laytpl__.push("'+ parse(template) +'");',
          // 'return __laytpl__.join("");',
        '};'
      ].join('\n');
      // console.log(builder);
      return builder;
    };

    try {
      return createCompiler(template); // 返回编译器
    } catch(e) {
      delete that.compilerCache;
      return function() {
        return tools.error(e, {
          errorContext: that.extractErrorContext(template),
          template: template,
          type: 'Compile'
        }, options.error);
      };
    }
  };

  /**
   * 获取模板出错行上下文
   * @param {string} template - 原始模板
   * @param {Object} data - 数据
   * @returns {string}
   */
  Class.prototype.extractErrorContext = function(template, data) {
    var that = this;

    // 给模板每行开头添加行号标记
    var lineNum = 1; // 行号
    var templateArr = template.split(/\r?\n/g);

    template = template.replace(/(?=^)/gm, function() {
      return '/*LINE:'+ (lineNum++) +'*/';
    });

    var builder = that.createBuilder(template);
    var builderArr = builder.split(/\r?\n/);
    var sourceURL = 'laytpl.builder.map';

    // 模板出错行上下文
    var errorContext = function(errLineNum) {
      errLineNum = parseInt(errLineNum) - 1;

      var arr = [''];
      var contextLines = 3; // 错误行上下延伸的行数
      var start = Math.max(0, errLineNum - contextLines);
      var end = Math.min(templateArr.length, errLineNum + contextLines);

      for (; start <= end; start++) {
        arr.push(
          (start == errLineNum ? '? ' : '  ') +
          ((start + 1) + '| ') +
          templateArr[start]
        );
      }

      return arr.join('\n') + '\n';
    };

    try {
      builder += ('\n//# sourceURL='+ sourceURL); // 添加映射
      var compiler = that.createCompiler(template, builder);
      if (data) compiler(data);
    } catch(e) {
      // 提取堆栈报错行号
      var stackLineNumRegxp = tools.regex(sourceURL.replace(/\./g, '\\.')+':(\\d+)', 'i');
      var stackLineNum = (e.stack.match(stackLineNumRegxp) || [])[1] || 0;

      // 提取模板实际行号
      var extractErrLineNum = function(stackLineNum, isRecursion) {
        var lineNumRegxp = isRecursion ? /\/\*LINE:(\d+)\*\/[^*]*$/ : /\/\*LINE:(\d+)\*\//;
        var errLineNum = String(builderArr[stackLineNum - 1]).match(lineNumRegxp) || [];
        errLineNum = errLineNum[1];

        // 若当前行未找到行号映射，则递归查找上一行
        if (!errLineNum && stackLineNum > 0) {
          return extractErrLineNum(stackLineNum - 1, true);
        }

        return errLineNum;
      };

      // 此处减去 anonymous 开头占用的 2 行
      var errLineNum = extractErrLineNum(stackLineNum - 2);

      // 若未找到映射行号，则直接返回 SyntaxError 对象（通过 DevTools 映射源查看模板行号标记）
      return errLineNum ? errorContext(errLineNum) : e;
    }
  };

  /**
   * 创建实例
   * @param {string} template - 模板
   * @param {Object} options - 选项
   * @returns {Object}
   */
  var laytpl = function(template, options) {
    var inst = new Class(template, options);
    return thisModule.call(inst);
  };

  /**
   * 扩展模板内部变量
   * @param {Object} variables - 扩展内部变量，变量值通常为函数
   */
  laytpl.extendVars = function(variables) {
    Object.assign(vars, variables);
  };

  /**
   * 设置默认配置
   * @param {Object} options - 选项
   */
  laytpl.config = laytpl.set = function(options) {
    Object.assign(config, options);
  };

  // 输出接口
  typeof layui === 'object' ? layui.define(function(exports) { // Layui
    exports(MOD_NAME, laytpl);
  }) : (
    typeof module === 'object' && typeof exports === 'object'
      ? module.exports = laytpl // CommonJS
    : (
      typeof define === 'function' && define.amd ? define(function() { // RequireJS
        return laytpl;
      }) : global.laytpl = laytpl // 单独引入
    )
  );
})(this);
