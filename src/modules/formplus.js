layui.define(["jquery", "util", "form"], function (exports) {
  if (!window.$) window.$ = layui.$;
  /**
   * 记录下原始的render方法
   */
  const renderForever = layui.form.render;

  /**
   * 定义一系列的公共常量
   */
  let constant = {
    /**
     * @var {*} 全局计数
     */
    INTERNAL_INDEX: 0,

    /**
     * @var {*} 事件序列号
     */
    EVENT_SERIAL: 0,

    /**
     * @var {String} 字符串分隔符 -> .
     * @description
     *    主要用于拆分属性key的时候使用
     */
    separator: ".",

    /**
     * @var {String} 数组前缀标志 -> [
     * @description
     *    主要用于拆分属性key的时候使用，数组是用[] 里面加下标来调用的
     */
    ARRAY_SEPARATOR_PREFIX: "[",

    /**
     * @var {String} 数组后缀标志 -> ]
     * @description
     *    主要用于拆分属性key的时候使用，数组是用[] 里面加下标来调用的
     */
    ARRAY_SEPARATOR_SUFFIX: "]",

    /**
     * @var {String} layui里面过滤属性的名称
     */
    LAYUI_FILTER: "lay-filter",

    /**
     * @var {String} layui里面表单标志class名称
     */
    LAYUI_FORM: "layui-form",

    /**
     * @var {String} layui表单验证 是否懒校验的属性值
     * @desc
     *    不设置这个属性 input采用 input onporpertychange 事件监听
     *    设置这个属性值 input采用 onbulr 事件监听
     *    当这个值设置为true的时候，属性值修改时不进行校验，在表单提交时通过方法一起校验
     *    当这个值设置为false or 其它时，在属性值发生改变时校验
     */
    LAYUI_LAZY: "lay-lazy",
  };

  /**
   * 工具方法集合
   */
  let util = {
    /**
     * @method 获取表单元素的lay-filter属性值
     * @param {*} formItem
     */
    getFormFilterName(formItem) {
      let filter = formItem.getAttribute(constant.LAYUI_FILTER);
      if (filter) return filter;
      filter = "layui-formplus-" + formItem.name;
      formItem.setAttribute(constant.LAYUI_FILTER, filter);
      return filter;
    },

    /**
     * @method 获取当前form表单的name,就是它的lay-filter属性值，如果没有就生成一个
     * @param {*} item 表单的dom
     * @return 表单名称
     */
    getFormName: function (item) {
      let name = item.getAttribute(constant.LAYUI_FILTER);
      if (!name) {
        name = "layui-formplus" + constant.INTERNAL_INDEX++;
        item.setAttribute(constant.LAYUI_FILTER, name);
      }
      return name;
    },

    /**
     * @method 通过名称在form里面寻找合适的formProxy
     * @param {*} name form的名称
     */
    getFormByName: function (name) {
      let res = null;
      layui.util.every(layui.form.$children, (c) => {
        // 移除已经失效的
        if (!document.contains(c.$ele)) {
          c.$destroy();
          if (layui.form.$children.indexOf(c) >= 0)
            layui.form.$children.splice(layui.form.$children.indexOf(c), 1);
          return;
        }

        if (c.$name == name) {
          res = c;
          return false;
        }
        return true;
      });
      return res;
    },

    /**
     * @method 遍历子节点并执行回调函数
     * @param {*} children
     * @param {*} cb
     * @returns
     */
    findChildren: function (children, cb) {
      if (children.length == 0) return;
      layui.util.each(children, (child) => {
        cb && cb(child);
        util.findChildren(child.children, cb);
      });
    },

    /**
     * @method 冒泡执行回调函数
     * @param {*} s XXX.YYY.ZZZ 格式的属性key
     * @param {*} fn 回调函数
     * @desc
     *
     *   对属性key,按照 XXX.YYY.ZZZ  XXX.YYY  XXX 的顺序执行回调函数
     */
    bubble(s, fn) {
      if (layui.util.isString(s)) {
        let res = s;
        do {
          let k = res.lastIndexOf(constant.separator);
          if (k >= 0) res = res.substring(0, k);
          layui.util.isFunction(fn) && fn.call(this, res, s);
        } while (res.indexOf(constant.separator) > 0);
      }
    },

    /**
     * 从当前对象中 通过属性key获取对应的值
     * @param {*} k XXX.YYY.ZZZ 格式的属性key
     * @param {*} v 设置值
     * @returns
     */
    getValue(k, v) {
      let [currentContext, flag, parent, key] = [this, true];
      layui.util.every(k.split(constant.separator), (v1) => {
        let r = currentContext[v1];
        parent = currentContext;
        key = v1;
        // 数组特殊处理
        if (/\[\d+\]/.test(v1))
          r =
            currentContext[
              v1.substring(0, v1.indexOf(constant.ARRAY_SEPARATOR_PREFIX))
            ][
              v1.substring(
                v1.indexOf(constant.ARRAY_SEPARATOR_PREFIX) + 1,
                v1.indexOf(constant.ARRAY_SEPARATOR_SUFFIX)
              )
            ];
        if (r === undefined) {
          flag = false;
          return false;
        }
        currentContext = r;
        return true;
      });
      // 赋值
      if (flag && v !== undefined) {
        parent[key] = v;
        return v;
      }
      return flag ? currentContext : null;
    },
    /**
     * 监视某个数据
     * @param {*} o
     *  target: 准备监视的数据
     *  key: 属性的唯一标志字符串, 比如:a.b.c[d]
     *
     * @return 已经被封装监视的对象
     */
    observe(o) {
      let self = this;
      // 数组对象特殊处理
      if (layui.util.isArray(o.target)) {
        o.target.__self__ = self;
        o.target.__key__ = o.key;
        o.target.__proto__ = arrayMethods;
        layui.util.each(o.target, (v, k) => {
          v = util.doObserve.call(self, {
            target: o.target,
            value: v,
            name: k,
            key: o.key ? o.key : k,
          });
        });
        return o.target;
      }
      if (!o.target || !layui.util.isObject(o.target)) return o.target;
      // 普通对象的处理
      layui.util.each(o.target, (v, k) => {
        util.doObserve.call(self, {
          target: o.target,
          value: v,
          name: k,
          key: o.key,
        });
      });
      return o.target;
    },
    /**
     * 监视属性添加:
     *  将 value属性 加到 target 下面
     * @param {*} o
     *  target: 属性被添加的目标
     *  value:  待添加的属性值
     *  name：  待添加的属性对应目标的key
     *  key:    当前属性的唯一索引值 比如: a.b.c[d]
     */
    doObserve(o) {
      // 根据传入的属性name，生成全新的索引值
      let self = this,
        fKey = o.key ? o.key + constant.separator + o.name : o.name;
      // 创建代理对象,将待监听的对象也创建为响应式数据
      let _proxy = util.observe.call(self, {
        target: o.value,
        key: fKey,
      });
      // 创建事件描述对象
      self.dispatcher.add(fKey);
      Object.defineProperty(o.target, o.name, {
        configurable: true,
        enumerable: true,
        get() {
          self.dispatcher &&
            self.dispatcher.get.call(self, fKey, _proxy, o.name);
          return _proxy;
        },
        set(value) {
          if (value === _proxy) return;
          let oldValue = _proxy;
          self.dispatcher.before.call(self, fKey, value, oldValue, o.name);
          _proxy = util.observe.call(self, {
            target: value,
            key: fKey,
          });
          self.dispatcher.after.call(self, fKey, value, oldValue, o.name);
        },
      });
    },
  };

  /**
   * @constructor
   * @param {*} options
   * @returns
   */
  let formProxy = function (options) {
    return new formProxy.fn.newInstance(options);
  };
  formProxy.prototype = formProxy.fn = {
    newInstance: function (options) {
      this.dispatcher = new AOP.Dispatcher();
      // 初始化数据
      this._initData(options.data, options.dataSource);
      // 初始化方法
      this._initMethods(options.methods);
      // 初始化监视属性
      this._initWatchs(options.watchs);
      this.isAlive = true;
      this.getValue = function (k, v) {
        return util.getValue.call(this, k, v);
      };
      /**
       * 添加事件监听
       * @param {*} fn 待执行的事件，也是监听改变时调用的事件，如果是函数，就需要率先封装好
       */
      this.addListener = function (fn) {
        let res = null,
          serial = constant.EVENT_SERIAL++;
        const f = layui.util.isFunction(fn);
        if (f) this.dispatcher.enableAccess.push(serial);
        res = f ? fn.apply(this) : util.getValue.call(this, fn);
        if (f) this.dispatcher.addListener(fn, false, serial);
        return res;
      };
      options.created && options.created.apply(this);
      return this;
    },
    /**
     * 给obj下面设置属性
     * @param {*} obj
     * @param {*} k
     * @param {*} v
     * @returns
     */
    $set(obj, k, v) {
      return this._set.call(this, obj, k, v);
    },
    /**
     * 添加监视属性
     * @param {*} key
     * @param {*} value
     * @returns
     */
    $watch(key, value) {
      return this._watch.call(this, key, value);
    },
    /**
     * 销毁实例
     */
    $destroy() {
      layui.util.each(this.$children, (v) => v.$destroy());
      this.isAlive = false;
    },
    _initData(dataOption = {}, dataSource = {}) {
      let self = this;
      let data = layui.util.isFunction(dataOption)
        ? dataOption.call(self, dataSource)
        : dataOption;
      self.$data = util.observe.call(self, { target: data });
      Object.keys(self.$data).forEach((key) => {
        Object.defineProperty(self, key, {
          configurable: true,
          enumerable: true,
          get() {
            return self.$data[key];
          },
          set(value) {
            if (value == self.$data[key]) return;
            self.$data[key] = value;
          },
        });
      });
    },
    _initMethods(methods = {}) {
      let self = this;
      layui.util.each(methods, (v1, k1) => (self[k1] = v1));
    },
    _initWatchs(watchs = {}) {
      let self = this;
      layui.util.each(watchs, (v, k) => self._watch.call(self, k, v));
    },
    _watch(key, fn) {
      let self = this;
      if (layui.util.isFunction(fn)) {
        self.dispatcher.watch(self, key, fn);
      } else {
        self.dispatcher.watch(self, key, fn.handler, fn.deep, fn.immediate);
      }
    },
    _set(obj, k, v) {
      let self = this;
      if (layui.util.isFunction(obj)) {
        obj.apply(self);
      } else {
        let o = {};
        o[k] = v;
        obj = Object.assign(obj, o);
      }
      self.$data = util.observe.call(self, { target: self.$data });
      Object.keys(self.$data).forEach((key) => {
        Object.defineProperty(self, key, {
          configurable: true,
          enumerable: true,
          get() {
            return self.$data[key];
          },
          set(value) {
            if (value == self.$data[key]) return;
            self.$data[key] = value;
          },
        });
      });
    },
  };
  formProxy.fn.newInstance.prototype = formProxy.fn;

  /**
   * @namespace AOP
   * @desc
   *    事件监听
   */
  let AOP = {
    /**
     * @constructor  事件分发器
     */
    Dispatcher: function () {
      let self = this;
      /**
       * @var {Array} 序列号栈
       * 里面存放的是{@linkplain constant.EVENT_SERIAL 事件序列号}
       * 如果它的length是0，代表当前没有需要捕获的工作，否则它的最后一项代表当前捕获任务的序列号
       */
      this.enableAccess = [];
      /**
       * @var {*}  事件切面容器池
       * 存放 {@linkplain AOP.Aspect 事件切面} ,以属性的key为值
       */
      this.coreMap = {};
      /**
       * @method 添加事件监听
       * @desc
       *
       * @param {*} fn    待加入的监听回调函数
       * @param {*} flag  是否深监听 true 是  false 否
       * @param {*} serial    当前捕获序列号
       * @param {*} cb    每次添加后执行的回调函数
       * @returns
       */
      this.addListener = (fn, flag = false, serial, cb) => {
        layui.util.each(self.coreMap, (v) =>
          v.add(fn, flag ? "deep" : "bind", serial, cb)
        );
        self.enableAccess.splice(self.enableAccess.indexOf(serial), 1);
        if (self.enableAccess.length == 0)
          layui.util.each(self.coreMap, (v) => v.offline());
      };
      /**
       * @method 添加监视属性
       * @desc
       *    这个方法绕过了事件触发 {@linkplain AOP.Dispatcher.addListener 类似于这种形式}
       *  是直接向事件集合里面添加回调函数。
       *    这个方法可以用在创建对象的时候添加监视属性，和单位为一个属性添加一个监视属性
       *
       * @param {*} obj     指定对象，
       * @param {*} key    数据的唯一key
       * @param {*} fn     触发回调函数
       * @param {*} deep   是否是深监视
       * @param {*} immediate  回调函数是否立即执行
       */
      this.watch = (obj, key, fn, deep = false, immediate = false) => {
        // 没有就添加一个
        if (!self.coreMap[key]) self.add(key);
        self.coreMap[key].add(fn, deep ? "deep" : "bind", null, null, true);
        // 需要立即执行
        if (immediate) fn.call(obj, util.getValue.call(obj, key), null, key);
      };
      /**
       * 添加一个事件切面
       * @param {*} key 属性的唯一key
       * @returns
       */
      this.add = (key) => {
        if (!self.coreMap[key]) self.coreMap[key] = new AOP.Aspect(key);
      };
      /**
       * 在一个属性值被调用前的回调函数
       * @param {*} key 该属性值的唯一key
       * @param {*} v   当前属性值
       * @param {*} k   当前属性的key(对应父属性)
       */
      this.get = function (key, v, k) {
        // 开启添加事件的监听
        self.enableAccess.length > 0 &&
          self.coreMap[key].online(self.enableAccess);
      };
      /**
       * 在一个属性值被修改前的回调函数
       * @param {*} key  该属性值的唯一key
       * @param {*} v    当前属性值
       * @param {*} v1   属性旧值
       * @param {*} k    当前属性的key(对应父属性)
       */
      this.before = function (key, v, v1, k) {};
      /**
       * 在一个属性值被修改后的回调函数
       * @param {*} key  该属性值的唯一key
       * @param {*} v    当前属性值
       * @param {*} v1   属性旧值
       * @param {*} k    当前属性的key(对应父属性)
       */
      this.after = function (key, v, v1, k) {
        let _this = this;
        // 1. 执行直接监听回调,  如果回调函数返回值为 false 那么在执行之后会被移除列表
        self.coreMap[key].pool = layui.util.filter(
          self.coreMap[key].pool,
          function (event) {
            return false !== event.fn.call(_this, v, v1, k, key);
          }
        );
        // 2.冒泡触发
        util.bubble(key, (v) => {
          if (v !== key && self.coreMap[v])
            layui.util.each(
              self.coreMap[v].pool,
              (e) => "deep" === e.type && e.fn.call(_this, v, v1, k, key)
            );
        });
      };
    },
    Aspect: function (key) {
      let self = this;
      this.access = false;
      this.serial = [];
      this.pool = [];
      this.key = key;
      this.online = (serial) => {
        self.access = true;
        layui.util.each(serial, (s) => {
          if (self.serial.indexOf(s) < 0) self.serial.push(s);
        });
      };
      this.offline = () => {
        self.access = false;
        self.serial = [];
      };
      this.add = (fn, type, serial, cb, flag) => {
        if (flag) return self.pool.push(new AOP.Event(fn, type));
        if (!self.access) return false;
        if (!!serial && self.serial.indexOf(serial) >= 0) {
          self.pool.push(new AOP.Event(fn, type));
          cb && cb(self.key);
        } else if (!serial) {
          self.pool.push(new AOP.Event(fn, type));
          cb && cb(self.key);
        }
      };
    },
    Event: function (fn, type = "bind") {
      this.fn = fn;
      this.type = type;
    },
  };

  /**
   * @namespace formRenderer
   * 表单渲染方式
   */
  let formRenderer = {
    /**
     * 初始化方法
     */
    listen: function () {
      /**
       * 在form下面防置一个空间变量，用来保存后面生成的{@linkplain formProxy 对象}
       */
      if (!layui.form.$children) {
        layui.form.$children = [];
      } else {
        // 如果存在说明初始化过了,不用重复调用
        return false;
      }
      /**
       * 拦截render函数
       * @param {*} type    待渲染组件的类型
       * @param {*} filter  待渲染组件的form的filter
       * @param {*} deploy  是否使用formplus进行处理,默认false
       * @returns 原来返回的是layui.form对象;现在返回的是 {@linkplain formProxy 对象}
       */
      layui.form.render = function (type, filter, deploy = false) {
        if (!deploy) return renderForever.call(layui.form, type, filter);
        // 获取表单选择器
        let selector = filter
          ? `.${constant.LAYUI_FORM}[${constant.LAYUI_FILTER}="${filter}"]`
          : `.${constant.LAYUI_FORM}`;
        let res = null;
        document.querySelectorAll(selector).forEach((ele) => {
          if (ele instanceof HTMLElement) {
            // 渲染过一次之后添加上vform的属性防止重复渲染
            if (ele.getAttribute("formplus") == null) {
              ele.setAttribute("formplus", "true");
              // 1. 获取当前表单的lay-filter 如果没有就自动生成一个，这个必须有，是作为表单的name存在的
              let name = util.getFormName(ele);
              // 2. 获取视图对象赋值给返回值
              res = util.getFormByName(name) || formRenderer.render(ele);
            }
            // 最后调用原生的render方法渲染表单
            renderForever.call(layui.form, type, filter);
          }
        });
        return res;
      };
    },

    /**
     * @method 处理layui的form创建并返回{@linkplain formProxy 对象}
     * @param {*} item 待处理的form表单
     */
    render: function (item) {
      // 1.获取form的名字
      let name = util.getFormName(item);
      // 3.创建一个{@linkplain formProxy 对象}
      let proxy = new formProxy({
        data: {},
        created() {
          /**
           * 由于这个对象不用挂载dom,所以在创建完毕的回调里面添加逻辑
           *
           * 1.从数据到dom，这里需要通过监视属性来实现
           * 2.从dom到数据，这里通过添加dom的监听事件来实现(由于layui会对表单进行美化，这里需要抢占layui的监听事件)
           */
          let self = this;
          // 将表单的name和dom带上,name方便下一次找到这个formProxy对象;ele方便判断dom是否下树,释放对象
          self.$name = name;
          self.$ele = item;
          // 首先遍历表单元素
          let fieldElems = $(item).find("input,select,textarea");
          layui.util.each(fieldElems, (formItem) => {
            if (formItem instanceof HTMLElement) {
              // lay-ignore标注后不会对这个进行美化,这里就放弃渲染它
              if (formItem.getAttribute("lay-ignore") === null) {
                // 获取元素的name属性，作为它的key
                let _name = formItem.name;
                // 由于表单可能由layui渲染过了，生成了一些干扰表单元素， 有点干扰，这里尽量避免干扰, 没得name属性的不进行渲染
                if (_name) {
                  // 获取元素的type属性，checkbox对应的是数组，其它的就直接就是值
                  let _type =
                    formItem.type == "checkbox"
                      ? "checkbox"
                      : formItem.type == "radio"
                      ? "radio"
                      : formItem.tagName.toLowerCase() == "select"
                      ? "select"
                      : "input";
                  // switch 特殊判断
                  if (
                    formItem.type == "checkbox" &&
                    formItem.getAttribute("lay-skin") == "switch"
                  )
                    _type = "switch";
                  // 判断当前是否有以这个name为key的值，如果没有就添加一个
                  if (!self.$data[_name])
                    self.$set(self.$data, _name, "checkbox" == _type ? [] : "");
                  // 挑选合适的方法继续渲染
                  Array.prototype.every.call(
                    formRenderer.getRenderers(),
                    function (r) {
                      if (r.canDeal(formItem, _type)) {
                        r.deal(item, formItem, self);
                        return false;
                      }
                      return true;
                    }
                  );
                }
              }
            }
          });
        },
      });
      // 放入form中
      layui.form.$children.push(proxy);
      // 返回这个新建的对象
      return proxy;
    },

    /**
     * 表单元素处理器
     * @constructor
     * @param {*} condition
     * @param {*} action
     */
    renderer: function (condition, action) {
      this.canDeal = layui.util.isFunction(condition)
        ? (...param) => condition.apply(this, param)
        : (...param) => new Function(condition, param);
      this.deal = (...param) => action.apply(this, param);
    },

    getRenderers: function () {
      // 如果没有初始化就调用方法初始化
      if (!formRenderer.renderers) formRenderer.initRenderers();
      return formRenderer.renderers;
    },

    initRenderers: function () {
      if (formRenderer.renderers) return formRenderer.renderers;
      formRenderer.renderers = [];
      formRenderer.renderers.push(MyRenderers.input);
      formRenderer.renderers.push(MyRenderers.date);
      formRenderer.renderers.push(MyRenderers.switch);
      formRenderer.renderers.push(MyRenderers.checkbox);
      formRenderer.renderers.push(MyRenderers.radio);
      formRenderer.renderers.push(MyRenderers.select);
      return formRenderer.renderers;
    },
  };

  let MyRenderers = {
    // 普通输入框
    input: new formRenderer.renderer(
      function (formItem, type) {
        // 是输入框,但是没有被标注是时间选择框以及没有被laydate渲染
        return (
          type == "input" &&
          formItem.getAttribute("laydate") === null &&
          formItem.getAttribute("layui-laydate-id") === null
        );
      },
      function (item, formItem, formProxy) {
        // 初始化数据
        formProxy.getValue(formItem.name, formItem.value);

        let eventKey =
          formItem.getAttribute(constant.LAYUI_LAZY) != null
            ? "blur"
            : "input propertychange";
        // 按照普通的input or textarea 处理
        // input 和textarea 不考虑页面美化带来的影响
        layui.util.each(eventKey.split(" "), (v) => {
          formItem.addEventListener(v, function () {
            formProxy.getValue(formItem.name, this.value);
          });
        });

        /**
         * 新增文本域字数限制
         *  首先判断这个文本域是否带有 属性 maxlength 这样可以限制它的输入字数
         *
         *  1. 获取最大限制字数
         *  2. 创建一个变量 这个变量需要依托当前的属性值，直接放在视图对象下面
         *  3. 创建一个属性，
         *  4. 创建一个监视属性，在当前文本域录入的时候，更新上面的属性值
         *  5. 利用伪标签读取属性值的特性将这个结果动态的展示出来
         *
         *  为了保证实时更新，建议不要添加lay-lazy属性。
         */
        if (formItem.getAttribute("maxlength") != undefined) {
          // lay-affix="number" input的结构会发生改变,先定向渲染它,然后再进行事件绑定
          if(formItem.getAttribute("lay-affix") == "number")
            renderForever.call(layui.form, $(formItem));
          // 1. 获取最大限制字数
          let maxlength = formItem.getAttribute("maxlength");
          // 2. 创建一个变量
          let _tempName = formItem.name + "-limit";
          formProxy.$set(formProxy.$data, _tempName, "0/" + maxlength);
          // 4. 创建监视属性
          formProxy.$watch(formItem.name, {
            immediate: true,
            deep: false,
            handler: function (v) {
              let length = v ? v.length : 0;
              // 设置在父标签上面,因为输入框这类标签不支持:after
              formItem.parentElement.setAttribute(
                "dataMaxlength",
                "" + length + "/" + maxlength
              );
            },
          });
        }

        /**
         * 新增输入框 lay-affix类型和number事件的监听
         *  首先判断这个文本域是否带有 属性  lay-affix
         *  然后在事件中获取值进行处理
         */
        if (
          formItem.getAttribute("lay-affix") == "number" ||
          formItem.getAttribute("lay-affix") == "clear"
        ) {
          layui.form.on(
            "input-affix(" + util.getFormFilterName(formItem) + ")",
            function (data) {
              var elem = data.elem; // 获取输入框 DOM 对象
              formProxy.getValue(formItem.name, elem.value);
            }
          );
        }

        // 添加监视属性
        formProxy.$watch(formItem.name, function (v) {
          formItem.value = v;
        });
      }
    ),
    // 时间选择框
    date: new formRenderer.renderer(
      function (formItem, type) {
        let flag =
          type == "input" &&
          (formItem.getAttribute("laydate") !== null ||
            formItem.getAttribute("layui-laydate-id") !== null);
        return flag;
      },
      function (item, formItem, formProxy) {
        if (
          formItem.getAttribute("layui-laydate-id") === null &&
          formItem.getAttribute("lay-key") === null
        ) {
          let optionsAttr = formItem.getAttribute("lay-options");
          let options = optionsAttr ? JSON.parse(String(optionsAttr).replace(/\'/g, () => '"')) : {};
          options.elem = formItem;
          layui.laydate.render(options);
        }
        let laydateKey =
          formItem.getAttribute("layui-laydate-id") ||
          formItem.getAttribute("lay-key");
        // 获取laydate对象
        let laydateInstance = layui.laydate.getInst(laydateKey);
        /**
         * 修改它的done回调，使值发生改变时修改对应的属性值
         */
        let done = laydateInstance.config.done;
        let newDone = function (value, date, endDate, p) {
          if (p) value = p.value;
          let params = {
            value: value,
            date: date,
            endDate: endDate,
          };
          done && done(value, date, endDate, params);
          formProxy.getValue(formItem.name, params.value);
        };
        laydateInstance.config.done = newDone;

        // 初始化数据
        formProxy.getValue(formItem.name, formItem.value);

        // 添加监视属性
        formProxy.$watch(formItem.name, function (v) {
          formItem.value = v;
        });
      }
    ),
    checkbox: new formRenderer.renderer(
      function (formItem, type) {
        return (
          type == "checkbox" && formItem.getAttribute("lay-skin") != "switch"
        );
      },
      function (item, formItem, formProxy) {
        // 初始化数据
        item
          .querySelectorAll('[name="' + formItem.name + '"]')
          .forEach((checkbox) => {
            if (checkbox.checked)
              formProxy.$data[formItem.name].push(checkbox.value);
          });
        /**
         * 由于页面会被layui美化过，使用dom自带的change事件似乎不太行，
         * 这里使用layui提供的on事件进行监听，但是前提是需要对当前表单元素添加上了lay-filter属性
         * 如果没有lay-filter属性，这里为它根据name自动添加一个filter属性，保证可以正常的使用
         *
         * 由于checkbox或者radio可能触发多次绑定，但是layui事件管理都是一对一的不会重复
         */
        layui.form.on(
          "checkbox(" + util.getFormFilterName(formItem) + ")",
          function () {
            formItem.parentElement
              .querySelectorAll('[name="' + formItem.name + '"]')
              .forEach((checkbox) => {
                // 首先获取对应的多项数据值，每次都要重新获取
                let _data = formProxy.getValue(formItem.name);
                // 如果元素被选中就添加上这一项，否则移除这一项
                if (checkbox.checked) {
                  if (layui.util.indexOf(_data, checkbox.value) < 0)
                    _data.push(checkbox.value);
                } else {
                  if (layui.util.indexOf(_data, checkbox.value) >= 0)
                    _data.splice(layui.util.indexOf(_data, checkbox.value), 1);
                }
              });
          }
        );

        // 添加监视属性
        formProxy.$watch(formItem.name, function (v) {
          item
            .querySelectorAll('[name="' + formItem.name + '"]')
            .forEach((checkbox) => {
              if (layui.util.indexOf(v, checkbox.value) >= 0) {
                checkbox.checked = true;
                checkbox.setAttribute("checked", "checked");
              } else {
                checkbox.checked = false;
                checkbox.removeAttribute("checked");
              }
            });
          layui.form.render(
            "checkbox",
            item.getAttribute(constant.LAYUI_FILTER)
          );
        });
      }
    ),
    radio: new formRenderer.renderer(
      function (formItem, type) {
        return type == "radio";
      },
      function (item, formItem, formProxy) {
        // 初始化数据
        let value = "";
        item
          .querySelectorAll('[name="' + formItem.name + '"]')
          .forEach((radio) => {
            if (radio.checked) value = radio.value;
          });
        formProxy.$data[formItem.name] = value;
        /**
         * 由于页面会被layui美化过，使用dom自带的change事件似乎不太行，
         * 这里使用layui提供的on事件进行监听，但是前提是需要对当前表单元素添加上了lay-filter属性
         * 如果没有lay-filter属性，这里为它根据name自动添加一个filter属性，保证可以正常的使用
         *
         * 由于checkbox或者radio可能触发多次绑定，但是layui事件管理都是一对一的不会重复
         */
        layui.form.on(
          "radio(" + util.getFormFilterName(formItem) + ")",
          function () {
            formItem.parentElement
              .querySelectorAll('[name="' + formItem.name + '"]')
              .forEach((radio) => {
                // 如果元素被选中就直接修改对应的值
                if (radio.checked)
                  formProxy.getValue(formItem.name, radio.value);
              });
          }
        );
        // 添加监视属性
        formProxy.$watch(formItem.name, function (v) {
          item
            .querySelectorAll('[name="' + formItem.name + '"]')
            .forEach((radio) => {
              if (v == radio.value) {
                radio.checked = true;
                radio.setAttribute("checked", "checked");
              } else {
                radio.checked = false;
                radio.removeAttribute("checked");
              }
            });
          layui.form.render("radio", item.getAttribute(constant.LAYUI_FILTER));
        });
      }
    ),
    select: new formRenderer.renderer(
      function (formItem, type) {
        return type == "select";
      },
      function (item, formItem, formProxy) {
        // 初始化数据
        formProxy.$data[formItem.name] = formItem.value;
        /**
         * 由于页面会被layui美化过，使用dom自带的change事件似乎不太行，
         * 这里使用layui提供的on事件进行监听，但是前提是需要对当前表单元素添加上了lay-filter属性
         * 如果没有lay-filter属性，这里为它根据name自动添加一个filter属性，保证可以正常的使用
         */
        layui.form.on(
          "select(" + util.getFormFilterName(formItem) + ")",
          function () {
            // 直接修改对应的值
            formProxy.getValue(formItem.name, formItem.value);
          }
        );

        // 添加监视属性
        formProxy.$watch(formItem.name, function (v) {
          formItem.value = v;
          formItem.querySelectorAll("option").forEach((option) => {
            if (v == option.value) {
              option.setAttribute("selected", "selected");
            } else {
              option.removeAttribute("selected");
            }
          });
          layui.form.render("select", item.getAttribute(constant.LAYUI_FILTER));
        });
      }
    ),
    switch: new formRenderer.renderer(
      function (formItem, type) {
        return (
          type == "switch" && formItem.getAttribute("lay-skin") == "switch"
        );
      },
      function (item, formItem, formProxy) {
        // 初始化数据
        item
          .querySelectorAll('[name="' + formItem.name + '"]')
          .forEach((checkbox) => {
            formProxy.$data[formItem.name] = checkbox.checked;
          });
        /**
         * 由于页面会被layui美化过，使用dom自带的change事件似乎不太行，
         * 这里使用layui提供的on事件进行监听，但是前提是需要对当前表单元素添加上了lay-filter属性
         * 如果没有lay-filter属性，这里为它根据name自动添加一个filter属性，保证可以正常的使用
         *
         * 由于checkbox或者radio可能触发多次绑定，但是layui事件管理都是一对一的不会重复
         */
        layui.form.on(
          "switch(" + util.getFormFilterName(formItem) + ")",
          function () {
            formProxy.getValue(formItem.name, this.checked);
          }
        );

        // 添加监视属性
        formProxy.$watch(formItem.name, function (v) {
          item
            .querySelectorAll('[name="' + formItem.name + '"]')
            .forEach((checkbox) => {
              if (formProxy.getValue(formItem.name) == true) {
                checkbox.checked = true;
                checkbox.setAttribute("checked", "checked");
              } else {
                checkbox.checked = false;
                checkbox.removeAttribute("checked");
              }
            });
          layui.form.render(
            "checkbox",
            item.getAttribute(constant.LAYUI_FILTER)
          );
        });
      }
    ),
  };

  /**
   * 输入框maxlength属性的特殊处理样式
   */
  let css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = `
      [datamaxlength]:after {
        content: attr(datamaxlength);
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 12px;
        line-height: 38px;
        color: #666;
        user-select: none;
        pointer-events: none;
      }

      .layui-input-wrap[datamaxlength]:after{
        right: 27px;
      }

    `;
  document.getElementsByTagName("HEAD").item(0).appendChild(css);
  /**
   * 监听数组的特殊处理
   */
  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse",
  ];
  methodsToPatch.forEach(function (method) {
    var original = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
      value: function () {
        var formProxy = this.__self__;
        if (!formProxy) return original.apply(this, arguments);
        var key = this.__key__;
        // TODO
        var proxy = layui.util.cloneDeep(this);
        original.apply(proxy, arguments);
        return formProxy.getValue(key, proxy);
      },
      enumerable: !!0,
      writable: true,
      configurable: true,
    });
  });
  // 开启
  formRenderer.listen();
  exports("formplus", formRenderer);
});
