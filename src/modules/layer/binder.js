/**
 * 需要引入 jQuey Lodash layui  这三个库
 * 
 *    现在只是作为windows管理组件的渲染容器，不做其它用
 *    里面使用到的语法与layui差别过大，不建议直接使用
 * 
 * 2022-08-20 因为要融入layui中 Lodash 不能要求必须引入，如果没有引入就需要创建一个 _ 变量支持之前的操作
 * 
 */
("use strict");
layui.define(function (exports) {

  // 创建 Lodash 变量
  if(!window._){
    // 重写lodash中常用方法
    window._ = {};
    // 判断传入的参数是不是数组类型
    _.isArray = function(object){
      return Object.prototype.toString.call(object) === '[object Array]';
    };
    // 判断传入的参数是不是string类型
    _.isString = function(object){
      return Object.prototype.toString.call(object) === '[object String]';
    };
    // 判断传入的参数是不是function类型
    _.isFunction = function (object) {
      return Object.prototype.toString.call(object) === '[object Function]';
    };
    // 判断传入的参数是不是Date类型
    _.isDate = function(object){
      return Object.prototype.toString.call(object) === '[object Date]';
    };
    // 判断传入的参数是不是Object类型
    _.isObject = function(object){
      return Object.prototype.toString.call(object) === '[object Object]';
    };
    _.isRegExp = function(object){
      return Object.prototype.toString.call(object) === '[object RegExp]';
    };
    // 深拷贝
    _.cloneDeep = function(object){
      var res;
      switch(typeof(object)){
        case 'undefined':
          break;
        case "string":
          res = object + "";
          break;
        case 'boolean': 
          res = !!object;
          break; 
        case 'number':
          res = object + 0
          break;
        case "object":
          if(object == null){
            res = null;
          }else{
            if(_.isArray(object)){
              res = [];
              _.each(object,(v) => res.push(_.cloneDeep(v)));
            }else if(_.isDate(object)){
              res = new Date();
              res.setTime(object.getTime());
            }else if(_.isObject(object)){
              res = {};
              _.each(object,(v,k) => {res[k] = _.cloneDeep(v)});
            }else if(_.isRegExp(object)){
              res = new RegExp(object);
            }else{
              res = object;
            }
          }
        break;
        default:
          res = object;
        break;
      }
      return res;
    };
    // 返回数组，or字符串下标
    _.indexOf = function(arr, value){
      return arr.indexOf(value);
    };
    // 遍历
    _.each = function(object,cb){
      // 放弃使用layui的each，它在return true会退出循环
      // layui.each(object, function(key, value){
      //   if(cb && _.isFunction(cb)) cb(value, key, object);
      // });
      var key;

      //优先处理数组结构
      if(_.isArray(object)){
        for(key = 0; key < object.length; key++){
          cb && _.isFunction(cb) && cb(object[key], key, object);
        }
      } else {
        for(key in object){
          cb && _.isFunction(cb) && cb(object[key], key, object);
        }
      }
    };
    _.every = function(object,cb){
      let res = true;
      layui.each(object, function(key, value){
        if(cb && _.isFunction(cb)){
          if(!cb(value, key, object)){
            res = false;
            return false;
          } 
        } 
      });
      return res;
    };
    // 从string字符串中移除前面和后面的 空格 或 指定的字符。
    _.trim = function(string){
      return $.trim(string);
    };
    // 参数合并
    _.assign = function(){
      //很垃圾，jq的后面的参数没有值它就不以最后一个为准了。所以后面的值必须给出默认值''
      return $.extend.apply(this, arguments);
    };
    // 用标点符号将数组拼接起来
    _.join = function(arr, mark){
      var res = "";
      _.each(arr, (v) => {res += (String(v) + mark)});
      if(res != "") res = res.substring(0, res.length - mark.length);
      return res;
    };
    // 数组过滤，返回回调为true的数组
    _.filter = function(object,cb){
      var res = [];
      _.each(object,function(v, k){
        if(cb && _.isFunction(cb)){
          if(cb(v, k, object)) res.push(v);
        }
      })
      return res;
    };
    // 字符串小驼峰，这里都是一个字符串，就转小写
    _.camelCase = function(string){
      return String(string).toLowerCase();
    };
    // 反转数组
    _.reverse = function(array){
      return array.reverse();
    };
    // 数组排序
    _.sortBy = function(array, cb){
      if(!_.isArray(array)){
        let temp = [];
        _.each(array, (v) => temp.push(v));
        array = temp;
      }
      return array.sort(function(a, b){
        return cb(a) -cb(b)
      });
    };
    // 移除数组中predicate（断言）返回为真值的所有元素，并返回移除元素组成的数组
    // true 移除 false的不移除
    _.remove = function(object, cb){
      // var res = [];
      _.each(object,function(v, k, arr){
        if(cb && _.isFunction(cb)){
          if(!!cb(v, k, object)){
            // res.push(v);
            arr.splice(k,1); 
          }
        }
      })
      // return res;
    };
    // 获取对象的所有key
    _.keys = function(object){
      return Object.keys(object);
    };
    // 字符串是否以什么打头
    _.startsWith = function(string, target){
      return string.startsWith(target);
    };
    _.isEqual = function(obj1, obj2){
      // 参数有一个不是对象 直接判断值是否相等就行
      if(!_.isObject(obj1) || !_.isObject(obj2)){
        return obj1 === obj2;
      }
      // 如果两个数都是数组或者对象
      // 1. 先比较keys的个数，如果个数不相同 直接就不想等了
      let obj1Keys = Object.keys(obj1)
      let obj2Keys = Object.keys(obj2)
      if (obj1Keys.length !== obj2Keys.length) {
        return false;
      }
      // 如果个数相同再以obj1为基准 和 obj2依次递归比较
      // for...in 适用于对象，也适用于数组
      for (let key in obj1) {
        const res = _.isEqual(obj1[key], obj2[key]); // 递归
        if (!res) {
          return false;
        }
      }
      return true;
    }
  }



  const CONSTANT = {
    name: "binder",
    version: "3",
    defaultkey: 19930607001,
    classattr: "class",
  };
  var POOL = {
    INSTANCE: {},
    COMMON_DIRETIVES: {},
    COMMON_METHODS: {},
    COMMON_EXTENDS: {},
    GLOBAL_CURRENT_OBJECT: null,
  };
  var PRIVATE_CONFIG = {
    isDebugger: false,
    propertychangeprefix: "pcp-",
    BEFORE_CREATE_KEY: "beforeCreate",
    CREATED_KEY: "created",
    BEFORE_DESTROY_KEY: "beforeDestroy",
    DESTROYED_KEY: "destroyed",
    BEFORE_MOUNT_KEY: "beforeMount",
    MOUNTED_KEY: "mounted",
    GET_VALUE_KEY: "getValue",
    BEFORE_SET_KEY: "beforeUpdate",
    SETTED_KEY: "updated",
  };
  var _debugger = {
    log(msg) {
      if (this.config.isDebugger) console.log(msg);
    },
  };
  var _Proxy = function () {
    this.capture = false;
    this.propertyKeys = new Set();
    this.elementPool = [];
    this.aops = {};
    this.diretives = {};
    this.components = {};
    this.monitor = function (event) {
      let res = null;
      this.proxy.propertyKeys.clear();
      this.proxy.capture = true;
      if (_.isString(event)) res = this.proxy.getValue(event);
      if (_.isFunction(event)) res = event.apply(this);
      this.proxy.capture = false;
      let list = Array.from(this.proxy.propertyKeys);
      return list;
    };
    this.bindAop = function (value, key) {
      let that = this;
      let aop = _.isFunction(value)
        ? {
            immediate: false,
            deep: false,
            handler: value,
          }
        : value;
      let keys = [key];
      if (aop.deep) {
        keys = that.proxy.monitor.call(that, function () {
          _.cloneDeep(that.proxy.getValue.call(that, key));
        });
      }
      _.each(keys, (v) => {
        if (!that.proxy.aops[v]) that.proxy.aops[v] = [];
        that.proxy.aops[v].push(aop);
      });
      if (aop.immediate)
        aop.handler.call(that, that[key], that[key], that[key]);
    };
    this.getComponent = function (component) {
      if (component instanceof Component) return component;
      if (_.isString(component)) return POOL.COMMON_EXTENDS[component];
      if (_.isObject(component)) return binder.extend(component);
      return null;
    };
    this.parseHtml = function () {
      return _template.parseHtml.apply(this, arguments);
    };
    this.on = function () {
      return _listener.on.apply(this, arguments);
    };
    this.off = function () {
      return _listener.off.apply(this, arguments);
    };
    this.execute = function () {
      return _listener.execute.apply(this, arguments);
    };
    // this.getValue = function (key) {
    //   let thisParent = this,
    //     thisValue = null,
    //     flag = true;
    //   _.each(key.split("."), function (v) {
    //     let res = thisParent[v];
    //     if (/\[\d+\]/.test(v))
    //       res =
    //         thisParent[v.substring(0, v.indexOf("["))][
    //           v.substring(v.indexOf("[") + 1, v.indexOf("]"))
    //         ];
    //     if (!res && "" != res) {
    //       flag = false;
    //       return false;
    //     }
    //     thisValue = res;
    //     thisParent = res;
    //   });
    //   return flag ? thisValue : null;
    // };
    this.getValue = function (key, value) {
      let thisParent = this,
        thisValue = null,
        _parent = null,
        _key = null,
        flag = true;
      _.each(key.split("."), function (v) {
        let res = thisParent[v];
        _parent = thisParent;
        _key = v;
        if (/\[\d+\]/.test(v)) {
          res =
            thisParent[v.substring(0, v.indexOf("["))][
              v.substring(v.indexOf("[") + 1, v.indexOf("]"))
            ];
        }
        if (!res && "" != res) {
          flag = false;
          return false;
        }
        thisValue = res;
        thisParent = res;
      });
      if (flag && value !== undefined) _parent[_key] = value;
      return flag ? thisValue : null;
    };

    this.getValueStr = function (str) {
      try {
        str = str.trim();
        str = str.replace(/({{[^{}]+}})/g, function (s) {
          return _.trim(s.substring(2, s.length - 2));
        });
        let res = new Function(
          ` return ${str.startsWith("this.") ? "" : "this."}${str};`
        ).apply(this);
        return res;
      } catch (error) {
        return null;
      }
    };
    this.replace = function (string) {
      if (string.indexOf("{{") >= 0)
        return this.proxy.replaceAll.call(this, string);
      let value = this.proxy.getValue.call(this, string);
      return value !== undefined ? value : string;
    };
    this.replaceAll = function (string) {
      let that = this;
      return String(string).replace(/({{[^{}]+}})/g, function (str) {
        let source = _.trim(str.substring(2, str.length - 2));
        return that.proxy.replace.call(that, source);
      });
    };
  };
  var _initialize = {
    initConfig(configOption = {}) {
      this.config = _.assign({}, PRIVATE_CONFIG, configOption);
      this.$children = [];
      this.proxy = new _Proxy();
    },
    initEvents(options = {}) {
      let that = this;
      that[that.config.BEFORE_CREATE_KEY] =
        options[that.config.BEFORE_CREATE_KEY];
      that[that.config.CREATED_KEY] = options[that.config.CREATED_KEY];
      that[that.config.BEFORE_DESTROY_KEY] =
        options[that.config.BEFORE_DESTROY_KEY];
      that[that.config.DESTROYED_KEY] = options[that.config.DESTROYED_KEY];
      that[that.config.BEFORE_MOUNT_KEY] =
        options[that.config.BEFORE_MOUNT_KEY];
      that[that.config.MOUNTED_KEY] = options[that.config.MOUNTED_KEY];
      that[that.config.GET_VALUE_KEY] = function (value, key, sKey) {
        let fKey = sKey ? sKey + "." + key : key;
        POOL.GLOBAL_CURRENT_OBJECT = {
          key: that.key,
          fKey: fKey,
          value: value,
        };
        _debugger.log.call(that, fKey + "被调用，当前的值为:" + value);
        if (that.proxy.capture) that.proxy.propertyKeys.add(fKey);
        options[that.config.GET_VALUE_KEY] &&
          _.isFunction(options[that.config.GET_VALUE_KEY]) &&
          options[that.config.GET_VALUE_KEY].call(that, value, key, sKey);
      };
      that[that.config.BEFORE_SET_KEY] = function (value, oldValue, key, sKey) {
        let fKey = sKey ? sKey + "." + key : key;
        let msg = _.join(
          [
            fKey,
            "的值将会被修改，当前的值为:{",
            oldValue,
            "}, 修改后的值为:{",
            value,
            "}",
          ],
          ""
        );
        _debugger.log.call(that, msg);
        options[that.config.BEFORE_SET_KEY] &&
          _.isFunction(options[that.config.BEFORE_SET_KEY]) &&
          options[that.config.BEFORE_SET_KEY].call(
            that,
            value,
            oldValue,
            key,
            sKey
          );
      };
      that[that.config.SETTED_KEY] = function (value, oldValue, key, sKey) {
        let fKey = sKey ? sKey + "." + key : key;
        let msg = _.join([fKey, "的值已被修改，当前的值为:{", value, "}"], "");
        _debugger.log.call(that, msg);
        that.proxy.execute.call(that, that.config.propertychangeprefix + fKey, [
          value,
          oldValue,
        ]);
        if (that.proxy.aops[fKey])
          // _.each(that.proxy.aops[fKey], (aop) =>
          //   aop.handler.call(that, value, oldValue, sKey ? sKey : key)
          // );
          that.proxy.aops[fKey] = _.filter(
            that.proxy.aops[fKey],
            (aop) =>
              false !==
              aop.handler.call(that, value, oldValue, sKey ? sKey : key)
          );
        options[that.config.SETTED_KEY] &&
          _.isFunction(options[that.config.SETTED_KEY]) &&
          options[that.config.SETTED_KEY].call(
            that,
            value,
            oldValue,
            key,
            sKey
          );
      };
    },
    initMethods(methodOption = {}) {
      let that = this;
      _.each(POOL.COMMON_METHODS, (v, k) => (that[k] = v));
      _.each(methodOption, (v1, k1) => (that[k1] = v1));
    },
    initDiretives(diretiveOption = {}) {
      let that = this;
      _.each(POOL.COMMON_DIRETIVES, (v, k) => (that.proxy.diretives[k] = v));
      _.each(diretiveOption, (v1, k1) => (that.proxy.diretives[k1] = v1));
    },
    initAop(aopOption = {}) {
      let that = this;
      _.each(aopOption, (v, k) => that.proxy.bindAop.call(that, v, k));
    },
    initComponent(componentOption) {
      let that = this;
      _.each(POOL.COMMON_EXTENDS, (v, k) => (that.proxy.components[k] = v));
      _.each(componentOption, (v1, k1) => {
        let _k = _.camelCase(k1);
        if (_.isArray(v1) && v1.length == 2) {
          let component = that.proxy.getComponent(v1[0]);
          if (null != component) that.proxy.components[_k] = [component, v1[1]];
        } else {
          let component = that.proxy.getComponent(v1);
          if (null != component) that.proxy.components[_k] = component;
        }
      });
    },
    initData(dataOption = {}, dataSource = {}) {
      let that = this;
      let data = _.isFunction(dataOption)
        ? dataOption.call(that, dataSource)
        : dataOption;
      that.$data = _observer.observe.call(that, {
        target: data,
        sKey: "",
        callbackGet: that[that.config.GET_VALUE_KEY],
        callbackBeforeSet: that[that.config.BEFORE_SET_KEY],
        callbackSetted: that[that.config.SETTED_KEY],
      });
      Object.keys(that.$data).forEach((key) => {
        Object.defineProperty(that, key, {
          configurable: true,
          enumerable: true,
          get() {
            return that.$data[key];
          },
          set(value) {
            if (value == that.$data[key]) return;
            that.$data[key] = value;
          },
        });
      });
    },
    initComputed(computedOption) {
      let that = this,
        tempProxy = {};
      _.each(computedOption, (v, k) => {
        let _getter = _.isFunction(v) ? v : v.get;
        let _setter =
          v.set ||
          function (s) {
            tempProxy[k] = s;
          };
        let sKey = "";
        let list = that.proxy.monitor.call(that, function () {
          tempProxy[k] = _getter.apply(that);
          Object.defineProperty(that, k, {
            configurable: true,
            enumerable: true,
            get() {
              that[that.config.GET_VALUE_KEY].call(that, tempProxy[k], k, sKey);
              return tempProxy[k];
            },
            set(value) {
              let oldValue = tempProxy[k];
              if (value == oldValue) return;
              that[that.config.BEFORE_SET_KEY].call(
                that,
                value,
                oldValue,
                k,
                sKey
              );
              _setter.call(that, value);
              that[that.config.SETTED_KEY].call(that, value, oldValue, k, sKey);
            },
          });
        });
        _.each(list, (value) => {
          let prefix = that.config.propertychangeprefix;
          that.proxy.on.call(that, prefix + value, prefix + k, function () {
            that[k] = _getter.apply(that);
          });
        });
      });
    },
  };
  var _listener = {
    on(event, group, cb) {
      if (_.isFunction(group))
        return _listener.add.call(this, event, null, group);
      _listener.off.call(this, event, group);
      _listener.add.apply(this, arguments);
    },
    execute(event, ...param) {
      let that = this;
      _.each(_listener.getPool.call(that, event), (value) => {
        if (_.isArray(value)) {
          _.each(value, (v) => v.apply(that, ...param));
        } else {
          value && value.apply(that, ...param);
        }
      });
    },
    off(event, cb) {
      let eventPool = _listener.getPool.call(this, event);
      if (!_.isFunction(cb)) {
        delete eventPool[cb];
        return;
      }
      delete this.proxy.eventPool[event];
    },
    add(event, group, cb) {
      if (group) return _listener.getPool.call(this, event, group).push(cb);
      if (this.proxy.eventIndex) this.proxy.eventIndex = 0;
      this.proxy.eventIndex++;
      _listener.getPool.call(this, event)["event" + this.proxy.eventIndex] = cb;
    },
    getPool(event, group) {
      if (!this.proxy.eventPool) this.proxy.eventPool = {};
      if (!this.proxy.eventPool[event]) this.proxy.eventPool[event] = {};
      if (!group) return this.proxy.eventPool[event];
      if (!this.proxy.eventPool[event][group])
        this.proxy.eventPool[event][group] = [];
      return this.proxy.eventPool[event][group];
    },
  };
  var _observer = {
    observe(option) {
      let that = this;
      if (!option.target || typeof option.target != "object")
        return option.target;
      if (_.isArray(option.target)) {
        _.each(option.target, (v, k) => {
          option.target[k] = _observer.observe.call(
            that,
            _.assign({}, option, {
              target: v,
              sKey: option.sKey ? option.sKey + "[" + k + "]" : "[" + k + "]",
            })
          );
        });
        return option.target;
      }
      Object.keys(option.target).forEach(function (key) {
        _observer.doSet.call(
          that,
          _.assign({}, option, {
            key: key,
            value: option.target[key],
          })
        );
      });
      return option.target;
    },
    doSet(option) {
      let that = this;
      let fKey = option.sKey ? option.sKey + "." + option.key : option.key;
      let _proxy = _observer.observe.call(
        that,
        _.assign({}, option, {
          target: option.value,
          sKey: fKey,
        })
      );
      Object.defineProperty(option.target, option.key, {
        configurable: true,
        enumerable: true,
        get() {
          option.callbackGet &&
            option.callbackGet(_proxy, option.key, option.sKey);
          return _proxy;
        },
        set(value) {
          if (value === _proxy) return;
          let oldValue = _proxy;
          option.callbackBeforeSet &&
            option.callbackBeforeSet(value, oldValue, option.key, option.sKey);
          _proxy = _observer.observe.call(
            that,
            _.assign({}, option, {
              target: value,
              sKey: fKey,
            })
          );
          option.callbackSetted &&
            option.callbackSetted(_proxy, oldValue, option.key, option.sKey);
        },
      });
    },
  };
  var _template = {
    parseHtml(ele, pool, parentID, eventPrefix) {
      pool.push({
        target: ele,
        exist: true,
        children: [],
        pIndex: parentID,
        visible: true,
        nodeType: ele.get(0).nodeType,
      });
      let index = pool.length - 1;
      pool[index].index = index;
      if (pool[index].nodeType == 3)
        return _template.parseTextNode.call(this, index, pool, parentID);

      if (pool[index].nodeType == 1)
        return _template.parseDocumentNode.apply(this, [
          index,
          pool,
          parentID,
          eventPrefix,
        ]);
      return pool[index];
    },
    parseTextNode(index, pool, parentID) {
      let _this = pool[index];
      let text = _.trim(_this.target.get(0).nodeValue);
      if (!text) return _this;
      if (parentID !== undefined) pool[parentID].children.push(index);
      _this.tempTarget = $(_this.target.get(0));
      _this.textValue = "";
      _this.tagName = "TEXTNODE";
      _this.text = text;
      _template.parseText.call(this, _this, pool);
      return _this;
    },
    parseText(node, pool) {
      let that = this;
      let index = node.index;
      let textTemplate = node.text;
      let oldValue = node.target.get(0).nodeValue;
      let _thisValue = "";
      let list = that.proxy.monitor.call(that, function () {
        _thisValue = that.proxy.replaceAll.call(that, textTemplate);
      });
      if (_thisValue == textTemplate) return;
      if (_thisValue == oldValue && _thisValue != "") return;
      _.each(list, (value) => {
        that.proxy.off.call(
          that,
          that.config.propertychangeprefix + value,
          "parsetest" + index
        );
        that.proxy.on.call(
          that,
          that.config.propertychangeprefix + value,
          "parsetest" + index,
          function () {
            _template.parseText.call(that, node, pool);
          }
        );
      });
      let parentNode = pool[node.pIndex].target.get(0);
      // 还是转义一下, 这里的createTextNode本来就是防xss的
      // _thisValue = _.escape(_thisValue);
      let newNode = document.createTextNode(_thisValue);
      try {
        parentNode.insertBefore(newNode, node.target.get(0));
      } catch (error) {
        _debugger.log.call(that, "更新的节点已被删除!" + _thisValue);
      }
      node.target.remove();
      node.target = $(newNode);
    },
    findPrev(list, pool) {
      let id;
      let _list = _.cloneDeep(list);
      _.each(_.reverse(_list), (v) => {
        if (pool[v].tagName != "TEXTNODE") id = pool[v].index;
      });
      return id;
    },
    parseDocumentNode(index, pool, parentID, eventPrefix) {
      let that = this,
        ele = pool[index].target;
      if (undefined !== ele.attr("lay-ignore")) return pool[index];
      if (undefined !== ele.attr("v-pre")) return pool[index];
      if (parentID !== undefined) {
        pool[parentID].children.push(index);
        let prevId = _template.findPrev.call(
          that,
          pool[parentID].children,
          pool
        );
        pool[index].prev = prevId && prevId != index ? prevId : undefined;
      } else {
        pool[index].prev = undefined;
      }
      pool[index].next = undefined;
      if (pool[index].prev) pool[pool[index].prev].next = index;
      pool[index].tagName = ele.prop("tagName");
      ele.removeAttr("lay-clock");
      if (that.proxy.components[_.camelCase(pool[index].tagName)])
        return _template.parseComponentNode.call(
          that,
          index,
          pool,
          parentID,
          eventPrefix
        );
      let head = ele
        .prop("outerHTML")
        .match(/<\w+[^\>]*([^\>]*\w+[^\>]*=[^\>]*[\"|\'].*[\"|\'][^\>]*)*>/)[0];
      head.replace(
        /[:|@|v-]+\w*\-?\w+\s*=\s*[\"|\'][^\"|\']*[\"|\']/g,
        function (v) {
          let vs = v.split("=");
          let key = _.trim(vs[0]);
          let value = ele.attr(key);
          pool[index][key] = value;
          _template.parseAttr.call(that, index, pool, key, eventPrefix);
          return "";
        }
      );
      if (pool[index].visible === false) return pool[index];
      ele.contents().each(function () {
        let $this = $(this);
        _template.parseHtml.call(that, $this, pool, index, eventPrefix);
      });
      // 这里如果不将filter传入，多个表单中相同的name属性的表单元素会有影响
      if (pool[index]["v-form"] && layui.form) layui.form.render(null, $(pool[index].target).attr("lay-filter"));
      return pool[index];
    },
    parseComponentNode(index, pool, parentID, eventPrefix) {
      let that = this;
      let componentStr = _.camelCase(pool[index].tagName);
      let component = that.proxy.components[componentStr];
      let param = {};
      if (_.isArray(component)) {
        param = _.isFunction(component[1])
          ? component[1].apply(that)
          : component[1];
        component = component[0];
      }
      let key = that[componentStr]
        ? pool[index].target.attr("key")
        : componentStr;
      let vc = component.create(param);
      vc.$mount(pool[index].target);
      that.$children.push(vc);
      if (!key) key = vc.id;
      vc.super = this;
      that[key] = vc;
      pool[index].target = vc.parent;
      return pool[index].target;
    },
    parseAttr(index, pool, key, eventPrefix) {
      let that = this;
      let attrTemplate = pool[index][key];
      if (!attrTemplate) return;
      let target = pool[index].target;
      if (_.indexOf(key, "@") == 0)
        return _template.parseEvent.call(that, index, pool, key);
      let _thisValue = "";
      let list = that.proxy.monitor.call(that, function () {
        _thisValue = that.proxy.replace.call(that, attrTemplate);
      });
      let eventKey = eventPrefix
        ? `${eventPrefix}-parseattr-${index}`
        : `parseattr-${index}`;
      if (/^v-{1,1}\w*\-?\w+\s*$/.test(key)) {
        let order = key.substring(2, key.length);
        if (that.proxy.diretives[order]) {
          let binding = {
            def: {
              bind: that.proxy.diretives[order].bind,
              update: that.proxy.diretives[order].update,
            },
            expression: attrTemplate,
            modifiers: {
              instance: pool[index],
              pool: pool,
              fKey: that.config.propertychangeprefix + attrTemplate,
            },
            name: order,
            rawName: key,
            value: _thisValue,
          };
          _.each(list, (value) => {
            that.proxy.off.call(
              that,
              that.config.propertychangeprefix + value,
              eventKey
            );
            that.proxy.on.call(
              that,
              that.config.propertychangeprefix + value,
              eventKey,
              function () {
                that.proxy.diretives[order].update.call(
                  that,
                  target.get(0),
                  binding
                );
              }
            );
          });
          return that.proxy.diretives[order].bind.call(
            that,
            target.get(0),
            binding
          );
        }
      }
      if (_.indexOf(key, ":") != 0) return;
      _.each(list, (value) => {
        that.proxy.off.call(
          that,
          that.config.propertychangeprefix + value,
          eventKey
        );
        that.proxy.on.call(
          that,
          that.config.propertychangeprefix + value,
          eventKey,
          function () {
            _template.parseAttr.call(that, index, pool, key);
          }
        );
      });
      if (_.indexOf(key, ":") != 0) {
      } else {
        let newKey = key.substring(1, key.length);
        if (CONSTANT.classattr == newKey) {
          if (!pool[index].oldClass && pool[index].oldClassFlag === undefined)
            pool[index].oldClass = target.attr("class");
          if (pool[index].oldClassFlag === undefined)
            pool[index].oldClassFlag = true;
          target.removeClass();
          target.addClass(pool[index].oldClass);
          if (_.isArray(_thisValue))
            _.each(_thisValue, (v) => target.addClass(v));
          if (_.isString(_thisValue))
            target.addClass(_thisValue.replace(/,/g, " "));
          target.removeAttr(key);
        } else {
          target.attr(newKey, _thisValue);
          target.removeAttr(key);
        }
      }
    },
    parseEvent(index, pool, key) {
      let that = this;
      let attrTemplate = pool[index][key];
      let newKey = key.substring(1, key.length);
      let params = "";
      let pos = attrTemplate.search(/\(([^\(\)]*\w+[^\(\)]*,?)*\)/);
      if (pos > 0) {
        params = attrTemplate.substring(pos, attrTemplate.length);
        attrTemplate = attrTemplate.substring(0, pos);
      }
      let resFN = that.proxy.getValue.call(that, attrTemplate);
      pool[index].target.off(newKey).on(newKey, function (e) {
        resFN && _.isFunction(resFN)
          ? (function () {
              that.proxy.getValue
                .call(that, attrTemplate)
                .apply(
                  that,
                  params
                    ? Array.from(
                        params.substring(1, params.length - 1).split(",")
                      )
                    : [e]
                );
            })()
          : new Function(
              attrTemplate.startsWith("this.")
                ? attrTemplate
                : "this." + attrTemplate
            ).apply(that, [e]);
      });
    },
  };
  var Component = function (options) {
    this.create = function (param) {
      return binder(_.assign({}, options, param));
    };
    return this;
  };
  var binder = function (options) {
    return new binder.fn.VM(options);
  };
  binder.Config = (v, k) => {
    if (k) PRIVATE_CONFIG[k] = v;
    return PRIVATE_CONFIG;
  };
  binder.Method = (k, fn) => (POOL.COMMON_METHODS[k] = fn);
  binder.diretive = (k, fn) => {
    if (_.isFunction(fn))
      return (POOL.COMMON_DIRETIVES[k] = {
        bind: fn,
        update: fn,
      });
    POOL.COMMON_DIRETIVES[k] = fn;
  };
  binder.extend = function (option) {
    let component = new Component(option);
    if (option.name) POOL.COMMON_EXTENDS[option.name] = component;
    return component;
  };
  binder.component = function (key, value) {
    if (value instanceof Object && !value instanceof Component)
      value = binder.extend(value);
    if (value instanceof Component) {
      POOL.COMMON_EXTENDS[key] = value;
    } else {
      _debugger.log.call(this, "invalid component!" + value);
    }
  };
  binder.Set = function (object, key, value) {
    if (
      POOL.GLOBAL_CURRENT_OBJECT &&
      POOL.GLOBAL_CURRENT_OBJECT.value === object
    ) {
      let instance = POOL.INSTANCE[POOL.GLOBAL_CURRENT_OBJECT.key];
      if (instance instanceof binder) {
        return _observer.doSet.call(instance, {
          parent: object,
          key: key,
          value: value,
          sKey: POOL.GLOBAL_CURRENT_OBJECT.fKey,
          callbackGet: instance[instance.config.GET_VALUE_KEY],
          callbackBeforeSet: instance[instance.config.BEFORE_SET_KEY],
          callbackSetted: instance[instance.config.SETTED_KEY],
        });
      }
    }
    return (object[key] = value);
  };
  binder.Get = function (scope) {
    if ("config" == scope) return PRIVATE_CONFIG;
    if ("pool" == scope) return POOL;
    return CONSTANT;
  };
  binder.prototype = binder.fn = {
    VM: function (options) {
      this.key =
        options.id || _.isString(options.el)
          ? options.el
          : CONSTANT.defaultkey++;
      let instance = POOL.INSTANCE[this.key];
      if (instance instanceof binder) return instance;
      _initialize.initConfig.call(this, options.config);
      _initialize.initEvents.call(this, options);
      if (
        this[this.config.BEFORE_CREATE_KEY] &&
        _.isFunction(this[this.config.BEFORE_CREATE_KEY])
      )
        this[this.config.BEFORE_CREATE_KEY].apply(this);
      if (options.el) this.parent = $(options.el);
      _initialize.initMethods.call(this, options.methods);
      _initialize.initDiretives.call(this, options.diretives);
      _initialize.initComponent.call(this, options.components);
      _initialize.initData.call(this, options.data, options.dataSource);
      _initialize.initComputed.call(this, options.computeds);
      _initialize.initAop.call(this, options.watchs);
      if (
        this[this.config.CREATED_KEY] &&
        _.isFunction(this[this.config.CREATED_KEY])
      )
        this[this.config.CREATED_KEY].apply(this);
      if (options.template) this.template = options.template;
      if (options.el) this.$mount.call(this, $(options.el));
      this.isAlive = true;
      return this;
    },
    $set() {
      return binder.Set.apply(this, arguments);
    },
    $watch(key, value) {
      return this.proxy.bindAop.call(this, value, key);
    },
    $mount(destination) {
      let $destination = $(destination);
      if (this.template !== undefined) {
        if ($destination.children().length == 0) {
          let $template = $(this.template);
          $destination.after($template);
          $destination.remove();
          this.parent = $template;
        } else {
          $destination.empty().append($(this.template));
          this.parent = $destination;
        }
      } else {
        this.parent = $destination;
      }
      if (
        this[this.config.BEFORE_MOUNT_KEY] &&
        _.isFunction(this[this.config.BEFORE_MOUNT_KEY])
      )
        this[this.config.BEFORE_MOUNT_KEY].apply(this);
      this.proxy.parseHtml.call(this, this.parent, this.proxy.elementPool);
      if (
        this[this.config.MOUNTED_KEY] &&
        _.isFunction(this[this.config.MOUNTED_KEY])
      )
        this[this.config.MOUNTED_KEY].apply(this);
    },
    $bind(data, sKey) {
      return _observer.observe.call(this, {
        target: data,
        sKey: sKey,
        callbackGet: this[this.config.GET_VALUE_KEY],
        callbackBeforeSet: this[this.config.BEFORE_SET_KEY],
        callbackSetted: this[this.config.SETTED_KEY],
      });
    },
    $destroy() {
      if (
        this[this.config.BEFORE_DESTROY_KEY] &&
        _.isFunction(this[this.config.BEFORE_DESTROY_KEY])
      )
        this[this.config.BEFORE_DESTROY_KEY].apply(this);
      _.each(this.$children, (v) => v.$destroy());
      this.isAlive = false;
      this.proxy.eventPool = {};
      this.proxy.aops = {};
      delete POOL.INSTANCE[this.key];
      if (
        this[this.config.DESTROYED_KEY] &&
        _.isFunction(this[this.config.DESTROYED_KEY])
      )
        this[this.config.DESTROYED_KEY].apply(this);
    },
  };
  binder.fn.VM.prototype = binder.fn;
  binder.Method("insertNode", function (node, pool, target, destination) {
    if (node.prev === undefined) {
      if (destination) return destination.prepend(target);
      return pool[node.pIndex].target.prepend(target);
    }
    if (node.prev !== undefined && pool[node.prev].visible === true)
      return pool[node.prev].target.after(target);
    return this.insertNode(pool[node.prev], pool, target);
  });
  binder.diretive("if", function (element, binding) {
    let data = this.proxy.getValueStr.call(this, binding.expression);
    let node = binding.modifiers.instance;
    let pool = binding.modifiers.pool;
    node.target.removeAttr("v-if");
    if (!data) {
      if (node.visible == false) return;
      node.visible = false;
      node.target.detach();
    } else {
      if (node.visible == true) return;
      node.visible = true;
      this.insertNode(node, pool, node.target, pool[node.pIndex].target);
    }
  });
  binder.Method("shrink", function (fKey) {
    let that = this;
    if (!that.proxy.eventPool) that.proxy.eventPool = {};
    let tempKeys = _.keys(that.proxy.eventPool);
    _.each(tempKeys, function (key) {
      if (_.startsWith(key, fKey)) {
        let value = that.proxy.getValue.call(
          that,
          key.substring(4, key.length)
        );
        if (!value) {
          _.each(_.keys(that.proxy.eventPool[key]), function (v) {
            if (that.proxy.eventPool[fKey] && that.proxy.eventPool[fKey][v])
              delete that.proxy.eventPool[fKey][v];
          });
          delete that.proxy.eventPool[key];
        }
      }
    });
  });
  binder.diretive("each", function (element, binding) {
    let that = this,
      ele = $(element),
      node = binding.modifiers.instance;
    node.target.removeAttr("v-each");
    if (!that.proxy.elist) that.proxy.elist = {};
    if (!that.proxy.eobj) that.proxy.eobj = {};
    if (!that.proxy.eindex) that.proxy.eindex = 1;
    let eachId = node.eachId;
    if (!eachId) {
      eachId = that.proxy.eindex++;
      node.eachId = eachId;
      node.keyStr = ele.attr("key");
      node.eachText = ele.children().prop("outerHTML");
      node.eachMark = node.target.attr("mark");
      node.eachOrder = node.target.attr("order") || "asc";
      node.callBack = node.target.attr("lay-event");
      ele.children().remove();
    }
    if (!that.proxy.elist[node.eachId]) that.proxy.elist[node.eachId] = [];
    if (!that.proxy.eobj[node.eachId]) that.proxy.eobj[node.eachId] = {};
    let attrTemplate = binding.expression;
    let mark = node.eachMark;
    let list = that.proxy.getValue.call(that, attrTemplate);
    let _pool = [],
      _tempPool = [],
      _tempObj = {};
    that.shrink(binding.modifiers.fKey);
    _.each(list, (v, k) => {
      let _key = !node.keyStr ? k : v[node.keyStr];
      let domStr = String(node.eachText).replace(
        /(#{[^{}]+})/g,
        function (str) {
          return new Function(
            mark,
            str.indexOf("return") > 0
              ? str.substring(2, str.length - 1)
              : "return " + str.substring(2, str.length - 1)
          ).call(that, list[k]);
        }
      );
      domStr = domStr.replace(/({{[^{}]+}})/g, function (str) {
        str = _.trim(str);
        if (/{{[\s|\S]*index[\s|\S]*}}/.test(str))
          return new Function(
            "index",
            " return " + str.substring(2, str.length - 2)
          ).call(that, _key);
        if (str.indexOf(mark) < 0) return str;
        str = str.replace(new RegExp(mark, "gim"), function (s) {
          return attrTemplate + "[" + k + "]";
        });
        return str.substring(2, str.length - 2);
      });
      let obj = that.proxy.parseHtml.call(
        that,
        $(domStr),
        _tempPool,
        undefined,
        "each-" + eachId
      );
      obj.target.removeAttr("key");
      obj.key = _key;
      obj.create = false;
      _pool.push(obj);
      let _index = _pool.length - 1;
      _tempObj[_key] = { index: _index, source: v };
    });
    let keys = Object.keys(_tempObj).sort(function (a, b) {
      if (/^\d+$/.test(a))
        return node.eachOrder == "desc" ? Number(b - a) : Number(a - b);
      return node.eachOrder == "desc" ? (b < a ? -1 : 1) : a < b ? -1 : 1;
    });
    let prevKey;
    _.each(keys, (v) => {
      if (prevKey) {
        _pool[_tempObj[v].index].prev = _tempObj[prevKey].index;
      }
      prevKey = v;
    });
    _.each(keys, (v) => {
      if (!that.proxy.eobj[eachId][v]) {
        let _tempObjects = _pool[_tempObj[v].index];
        if (_tempObjects.prev && _pool[_tempObjects.prev].create == true) {
          that.insertNode(_tempObjects, _pool, _tempObjects.target, ele);
        } else if (that.proxy.elist[eachId][_tempObjects.prev]) {
          that.insertNode(
            _tempObjects,
            that.proxy.elist[eachId],
            _tempObjects.target,
            ele
          );
        } else {
          ele.prepend(_tempObjects.target);
          _tempObjects.create = true;
        }
        if (!that.proxy.elist[eachId][_tempObj[v].index]) {
          that.proxy.elist[eachId][_tempObj[v].index] =
            _pool[_tempObj[v].index];
          that.proxy.elist[eachId][_tempObj[v].index].last = true;
        }
      } else if (
        !_.isEqual(_tempObj[v].source, that.proxy.eobj[eachId][v].source)
      ) {
        let _tempObjects = _pool[_tempObj[v].index];
        if (that.proxy.elist[eachId][_tempObjects.prev]) {
          that.insertNode(
            _tempObjects,
            that.proxy.elist[node.eachId],
            _tempObjects.target,
            ele
          );
        } else {
          ele.prepend(_tempObjects.target);
        }
        _tempObjects.create = true;
      } else {
        let _tempObjects = _pool[_tempObj[v].index];
        _tempObjects.target =
          that.proxy.elist[eachId][that.proxy.eobj[eachId][v].index].target;
        _tempObjects.create = true;
        that.proxy.eobj[eachId][v].last = true;
      }
    });
    _.each(that.proxy.eobj[eachId], (v) => {
      if (!v.last) {
        that.proxy.elist[eachId][v.index].target.remove();
      }
    });
    that.proxy.eobj[node.eachId] = _tempObj;
    that.proxy.elist[node.eachId] = _pool;
    node.callBack && that[node.callBack].call(that, element, binding);
  });
  exports("binder", binder);
});
