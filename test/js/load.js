/**
 *
 @Name：load 无侵入的引入其他的js
 @Author：岁月小偷
 @License：MIT

 */
layui.define(['jquery'], function (exports) {
  "use strict";
  var modelName = 'load';
  var version = '0.1.0';
  // 适配一些常见的需要依赖jquery的第三方库
  window.$ = window.jQuery = window.jQuery || layui.$;

  // 设置组件的路径和then回调
  var config = function (option) {
    layui.each(option, function (key, value) {
      if (!config.option[key]) {
        config.option[key] = value;
      }
    });
  };
  config.option = {};

  // 根据配置信息做一些准备工作，主要完成模块的layui.extend
  var ready = function (modelOne) {
    var option = config.option[modelOne];
    if (option && !layui.modules[modelOne]) {
      option.extend = option.extend ? (option.extend.constructor === Array ? option.extend : [option.extend]) : [];
      layui.each(option.extend, function (index) {
        ready(option.extend[index]);
      });

      if (option.path) {
        var extend = {};
        extend[modelOne] = option.path;
        // 设置路径
        layui.extend(extend);
      }
    }
  };

  // 获得模块列表
  var getModelList = function (name) {
    var modelList = [];
    name = typeof name === 'string' ? [name] : name;
    layui.each(name, function (index, nameCurr) {
      var option = config.option[nameCurr];
      if (option && option.extend) {
        modelList = getModelList(option.extend).concat(modelList);
      }
    });
    return modelList.concat(name);
  };

  var uniArr = function (data) {
    var arrTemp = [];
    layui.each(data, function (index, dataTemp) {
      if (arrTemp.indexOf(dataTemp) === -1) {
        arrTemp.push(dataTemp);
      }
    });
    return arrTemp;
  };

  // 核心的方法
  var load = function (name, done) {
    name = name.constructor === Array ? name : [name];
    layui.each(name, function (index, modelOne) {
      ready(modelOne)
    });

    // 初始化use
    var listTemp = uniArr(getModelList(name));
    layui.use(listTemp, function () {
      var that = this;
      typeof done === 'function' && done.call(that);
    });

    var listTempClone = $.extend([], listTemp);
    var timer = setInterval(function () {
      if (!listTempClone.length) {
        clearInterval(timer);
      } else {
        var modeOne = listTempClone[0];

        if (layui.cache.status[modeOne]) { // define过
          listTempClone.splice(0, 1);
        } else if (layui.cache.scriptLoaded[modeOne]) { // 未define过但是已经加载完毕
          var options = config.option[modeOne];
          if (options) {
            layui.define(function (exports) {
              exports(modeOne, typeof options.then === 'function' ? options.then() : undefined)
            });
          }
        }
      }
    }, 4);

    return layui;
  };

  load.version = version;
  load.config = config;

  exports(modelName, load);
});
