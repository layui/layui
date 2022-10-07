/**
 * 整合layui.form
 * 需要 layui.form layui.laydate layui.binder
 */
("use strict");
layui.define(["form"],function (exports) {
  let VM = layui.binder;
  const LAYUI_VERIFY = "lay-verify";
  const LAYUI_VERIFY_TYPE = "lay-verType";
  const LAYUI_VERIFY_TEXT = "lay-reqText";
  const LAYUI_DANGER = "layui-form-danger";
  const LAYDATE_CONFIG = {
    elem: "",
    type: "date",
    range: false,
    format: "yyyy-MM-dd",
    value: new Date(),
    min: "1900-1-1",
    max: "2099-12-31",
    trigger: "click",
    show: false,
    position: "absolute",
    zIndex: 19930607,
    showBottom: true,
    btns: ["clear", "now", "confirm"],
    lang: "cn",
    theme: "default",
    calendar: false,
    mark: {},
    ready: null,
    change: null,
    done: null,
  };

  layui.form.verify({
    "yyyy-MM-dd": function (value, item) {
      if (!/^\d{4}-(1[0-2]|0\d)-(3[0-1]|[0-2]\d)$/.test(value)) {
        return "当前时间类型为yyyy-MM-dd！";
      }
    },
    "yyyy-MM": function (value, item) {
      if (!/^\d{4}-(1[0-2]|0\d)$/.test(value)) {
        return "当前时间类型为yyyy-MM！";
      }
    },
    yyyy: function (value, item) {
      if (!/^\d{4}$/.test(value)) {
        return "当前时间类型为yyyy！";
      }
    },
    "yyyy-MM-dd HH:mm:ss": function (value, item) {
      if (
        !/^\d{4}-(1[0-2]|0\d)-(3[0-1]|[0-2]\d)\s+(2[0-3]|[0-1]\d)(:([0-5]\d)){2,2}$/.test(
          value
        )
      ) {
        return "当前时间类型为yyyy-MM-dd HH:mm:ss！";
      }
    },
    "yyyy-MM-dd HH": function (value, item) {
      if (
        !/^\d{4}-(1[0-2]|0\d)-(3[0-1]|[0-2]\d)\s+(2[0-3]|[0-1]\d)$/.test(value)
      ) {
        return "当前时间类型为yyyy-MM-dd HH！";
      }
    },
    number: function (value, item) {
      if (!!value && !/^\d{1,9}$/.test(value)) {
        return "请输入9位或9位以下的数字！";
      }
    },
    distance: function (value, item) {
      if (!!value && !/^(([1-9][0-9]{0,7})|0)(\.[0-9]?[0-9]?)?$/.test(value)) {
        return "请输入数字，最多两位小数！";
      }
    },
    float: function(value, item){
      if(!/^([1-9]\d*|0)(\.\d+)?$/.test(value)) {
        return "请输入小数！";
      }
    },
    mmsi: function (value, item) {
      if (value.length > 9) {
        return "请输入9位船舶mmsi！";
      }
    },
  });

  var INTERVAL_FOCUS_TIME = new Date();
  function debounceFocus() {
    if (new Date() - INTERVAL_FOCUS_TIME > 2000) {
      INTERVAL_FOCUS_TIME = new Date();
      return true;
    }
    return false;
  }
  VM.Method("verifyItem", function (item) {
    let othis = $(item);
    let parent = othis.parents().filter(".layui-form");
    let filter = parent.attr("lay-filter");
    let _type = othis.get(0).type;
    let verifys = [];
    if (othis.attr(LAYUI_VERIFY)) verifys = othis.attr(LAYUI_VERIFY).split("|");
    if ("radio" === _type && verifys.length > 0 && verifys[0] == "required") {
      if (!this.proxy.formMap[filter].radio)
        this.proxy.formMap[filter].radio = {};
      let radioName = othis.attr("name"),
        radioIndex = 0;
      if (this.proxy.formMap[filter].radio[radioName]) return true;
      this.proxy.formMap[filter].radio[radioName] = {};
      parent.find('[name="' + radioName + '"]').each(function () {
        if ($(this).get(0).checked === true) radioIndex++;
      });
      if (radioIndex === 1) return true;
      layui.layer.msg(othis.attr(LAYUI_VERIFY_TEXT), { icon: 5 });
      return false;
    }
    if (
      "checkbox" === _type &&
      verifys.length > 0 &&
      verifys[0] == "required"
    ) {
      if (!this.proxy.formMap[filter].checkbox)
        this.proxy.formMap[filter].checkbox = {};
      let checkboxName = othis.attr("name"),
        checkboxIndex = 0;
      if (this.proxy.formMap[filter].checkbox[checkboxName]) return true;
      this.proxy.formMap[filter].checkbox[checkboxName] = {};
      parent.find('[name="' + checkboxName + '"]').each(function () {
        if ($(this).get(0).checked === true) checkboxIndex++;
      });
      if (checkboxIndex > 0) return true;
      layui.layer.msg(othis.attr(LAYUI_VERIFY_TEXT), { icon: 5 });
      return false;
    }
    let verifyType = othis.attr(LAYUI_VERIFY_TYPE);
    let value = othis.val();
    let verify = layui.form.config.verify;
    let flag = true;
    _.every(verifys, function (v) {
      let isTrue = true,
        errorText = "",
        isFunction = _.isFunction(verify[v]);
      if (verify[v]) {
        isTrue = isFunction
          ? (errorText = verify[v](value, othis.get(0)))
          : !verify[v][0].test(value);
        errorText = errorText || verify[v][1];
        if (v === "required")
          errorText = othis.attr(LAYUI_VERIFY_TEXT) || errorText;
        if (isTrue) {
          let parentNode =
            othis.parents().filter(".layui-form-scrollNode").length == 1
              ? othis.parents().filter(".layui-form-scrollNode")
              : othis.parents().filter(".layui-layer-content");
          let scrollFlag =
            parentNode.length == 1 &&
            (parentNode.get(0).scrollHeight > parentNode.get(0).clientHeight ||
              parentNode.get(0).offsetHeight > parentNode.get(0).clientHeight);
          let proxyOthis =
            othis.get(0).tagName.toLowerCase() === "select" ||
            /^checkbox|radio$/.test(othis.get(0).type)
              ? othis.next()
              : othis;
          if (verifyType === "tips") {
            !scrollFlag &&
              proxyOthis.get(0).getBoundingClientRect().height > 0 &&
              layui.layer.tips(
                errorText,
                (function () {
                  if (typeof othis.attr("lay-ignore") !== "string") {
                    if (
                      othis.get(0).tagName.toLowerCase() === "select" ||
                      /^checkbox|radio$/.test(othis.get(0).type)
                    ) {
                      return othis.next();
                    }
                  }
                  return othis;
                })(),
                { tips: 1, tipsMore: true }
              );
          } else if (verifyType === "alert") {
            layui.layer.alert(errorText, { title: "提示", shadeClose: true });
          } else {
            layui.layer.msg(errorText, { icon: 5, shift: 6 });
          }
          scrollFlag &&
            parentNode.animate(
              {
                scrollTop:
                  othis.offset().top -
                  parentNode.offset().top +
                  parentNode.scrollTop(),
              },
              800,
              function () {
                verifyType === "tips" &&
                  proxyOthis.get(0).getBoundingClientRect().height > 0 &&
                  layui.layer.tips(
                    errorText,
                    (function () {
                      if (typeof othis.attr("lay-ignore") !== "string") {
                        if (
                          othis.get(0).tagName.toLowerCase() === "select" ||
                          /^checkbox|radio$/.test(othis.get(0).type)
                        ) {
                          return othis.next();
                        }
                      }
                      return othis;
                    })(),
                    { tips: 1, tipsMore: true }
                  );
              }
            );
          if (!layui.device().android && !layui.device().ios) {
            setTimeout(function () {
              if (debounceFocus()) {
                othis.get(0).focus();
              }
            }, 7);
          }
          othis.addClass(LAYUI_DANGER);
          flag = !isTrue;
        }
      }
      return flag;
    });
    return flag;
  });
  VM.Method("verifyForm", function (filter) {
    let that = this;
    let tempForm = filter ? $('[lay-filter="' + filter + '"]') : that.parent;
    let itemForm = tempForm.hasClass("layui-form")
      ? tempForm
      : tempForm.find(".layui-form");
    let flag = true;
    let fieldElem = itemForm.find("input,select,textarea");
    let key = itemForm.attr("lay-filter");
    if (!this.proxy.formMap) this.proxy.formMap = {};
    if (!this.proxy.formMap[key]) this.proxy.formMap[key] = {};
    this.proxy.formMap[key].radio = null;
    this.proxy.formMap[key].checkbox = null;
    _.every(fieldElem, function (item) {
      flag = that.verifyItem.call(that, $(item));
      return flag;
    });
    return flag;
  });
  VM.Method("formData", function (filter) {
    if (!this.verifyForm(filter)) return null;
    return this.proxy.getValue.call(this, this.proxy.formMap[filter].value);
  });
  VM.diretive("form", function (element, binding) {
    let that = this;
    let instance = binding.modifiers.instance;
    if (!that.proxy.formMap) that.proxy.formMap = {};
    instance.target.removeAttr("v-form");
    instance.target.removeClass("layui-form").addClass("layui-form");
    let formData = instance["v-form"];
    let formFilter = instance.target.attr("lay-filter");
    if (!that.proxy.formMap[formFilter])
      that.proxy.formMap[formFilter] = { value: formData };
    let fieldElem = instance.target.find("input,select,textarea");
    _.each(fieldElem, (item) => {
      if(item instanceof HTMLElement){
        let othis = $(item);
        item.name = (item.name || "").replace(/^\s*|\s*&/, "");
        if (item.name && !othis.attr("v-model"))
          othis.attr("v-model", `${formData}.${item.name}`);
      }
    });
  });
  VM.diretive("model", function (element, binding) {
    let that = this;
    let ele = $(element);
    let data = that.proxy.getValue.call(that, binding.expression);
    let instance = binding.modifiers.instance;
    let pool = binding.modifiers.pool;
    if ("checkbox" == instance.target.get(0).type) {
      return renderCheckBox.call(this, ele, data, instance, pool);
    } else if ("radio" == instance.target.get(0).type) {
      return renderRadio.call(this, ele, data, instance, pool);
    } else if ("SELECT" == instance.target.prop("tagName")) {
      return renderSelect.call(this, ele, data, instance, pool);
    } else {
      return renderInput.call(this, ele, data, instance, pool);
    }
  });
  function renderCheckBox(ele, data, instance, pool) {
    let that = this;
    if (!that.proxy.checkBoxMap) that.proxy.checkBoxMap = {};
    let filter = instance.target.attr("lay-filter");
    let value = instance.target.val();
    if (_.indexOf(data, value) < 0) {
      instance.target.prop("checked", false);
    } else {
      instance.target.prop("checked", true);
    }
    let parent = instance.target.parents().filter(".layui-form");
    if (
      parent.find('[name="' + name + '"]:last-of-type').eq(0).outerHtml ==
      instance.target.get(0).outerHtml
    )
      layui.form.render("checkbox", parent.attr("lay-filter"));
    if (undefined !== instance.target.attr("v-model")) {
      instance.target.removeAttr("v-model");
      that.proxy.checkBoxMap[filter] = true;
      layui.form.on("checkbox(" + filter + ")", function (d) {
        let name = $(d.elem).attr("name");
        let res = [];
        instance.target
          .parents()
          .filter(".layui-form")
          .find('[name="' + name + '"]')
          .each(function () {
            if (this.checked) {
              res.push($(this).val());
            }
          });
        let sourseKey = instance["v-model"];
        let i = sourseKey.indexOf(".");
        let obj =
          i < 0
            ? that
            : that.proxy.getValue.call(
                that,
                sourseKey.substring(0, sourseKey.lastIndexOf("."))
              );
        obj[
          sourseKey.substring(sourseKey.lastIndexOf(".") + 1, sourseKey.length)
        ] = res;
      });
    }
  }
  function renderRadio(ele, data, instance, pool) {
    let that = this;
    if (!that.proxy.radioMap) that.proxy.radioMap = {};
    let filter = instance.target.attr("lay-filter");
    let value = instance.target.val();
    if (data != value) {
      instance.target.prop("checked", false);
    } else {
      instance.target.prop("checked", true);
    }
    let parent = instance.target.parents().filter(".layui-form");
    if (
      parent.find('[name="' + name + '"]:last-of-type').eq(0).outerHtml ==
      instance.target.get(0).outerHtml
    )
      layui.form.render("radio", parent.attr("lay-filter"));
    if (undefined !== instance.target.attr("v-model")) {
      instance.target.removeAttr("v-model");
      that.proxy.radioMap[filter] = true;
      layui.form.on("radio(" + filter + ")", function (d) {
        let res = $(d.elem).val();
        let sourseKey = instance["v-model"];
        let i = sourseKey.indexOf(".");
        let obj =
          i < 0
            ? that
            : that.proxy.getValue.call(
                that,
                sourseKey.substring(0, sourseKey.lastIndexOf("."))
              );
        obj[
          sourseKey.substring(sourseKey.lastIndexOf(".") + 1, sourseKey.length)
        ] = res;
      });
    }
  }
  function renderSelect(ele, data, instance, pool) {
    let that = this;
    if (!that.proxy.selectMap) that.proxy.selectMap = {};
    if (!that.proxy.elist) that.proxy.elist = {};
    if (!that.proxy.eobj) that.proxy.eobj = {};
    let filter = instance.target.attr("lay-filter");
    if (undefined !== instance.target.attr("v-model")) {
      instance.target.removeAttr("v-model");
      that.proxy.selectMap[filter] = {
        sourseStr: instance.target.attr("lay-select"),
        paramStr: instance.target.attr("lay-param"),
        k: instance.target.attr("lay-k") || "id",
        v: instance.target.attr("lay-v") || "name",
        key: instance.target.attr("key"),
        option: instance.target.attr("lay-option"),
        flag: false,
      };
      instance.target.removeAttr("lay-k");
      instance.target.removeAttr("lay-v");
      instance.target.removeAttr("lay-option");
      instance.target.removeAttr("key");
      instance.target.removeAttr("lay-select");
      instance.target.removeAttr("lay-param");
      if (that.proxy.selectMap[filter].sourseStr) instance.target.empty();
      layui.form.on("select(" + filter + ")", function (d) {
        let res = $(d.elem).val();
        let sourseKey = instance["v-model"];
        let i = sourseKey.indexOf(".");
        let obj =
          i < 0
            ? that
            : that.proxy.getValue.call(
                that,
                sourseKey.substring(0, sourseKey.lastIndexOf("."))
              );
        that.proxy.selectMap[filter].flag = true;
        obj[
          sourseKey.substring(sourseKey.lastIndexOf(".") + 1, sourseKey.length)
        ] = res;
        that.proxy.selectMap[filter].flag = false;
      });
    }
    if (that.proxy.selectMap[filter].flag) return;
    if (!that.proxy.selectMap[filter].sourseStr) {
      let parent = instance.target.parents().filter(".layui-form");
      instance.target.val(data);
      layui.form.render("select", parent.attr("lay-filter"));
      return;
    }
    let sourse = [],
      param = {};
    let _list = that.proxy.monitor.call(that, function () {
      sourse = that.proxy.getValue.call(
        that,
        that.proxy.selectMap[filter].sourseStr
      );
      if (that.proxy.selectMap[filter].paramStr)
        param = parseSelectParam.call(
          that,
          that.proxy.getValue.call(that, that.proxy.selectMap[filter].paramStr)
        );
    });
    _.each(_list, function (value) {
      let prefix = that.config.propertychangeprefix;
      that.proxy.on.call(
        that,
        prefix + value,
        "parseselect-" + filter,
        function () {
          let value = that.proxy.getValue.call(that, instance["v-model"]);
          renderSelect.call(that, ele, value, instance, pool);
        }
      );
    });
    if (_.isArray(sourse))
      return doRenderSelect.call(that, ele, data, instance, pool, sourse);
    $.ajax({
      url: sourse,
      data: param,
      method: "POST",
      success: function (res) {
        return doRenderSelect.apply(that, [
          ele,
          data,
          instance,
          pool,
          res.code == 200 ? res.data : [],
        ]);
      },
    });
  }
  function parseSelectParam(_res) {
    let res = _.cloneDeep(_res);
    if (!res) return res;
    let that = this;
    _.each(res, function (v, k) {
      if (/({{[^{}]+}})/.test(v)) {
        let _v = that.proxy.getValue.call(
          that,
          _.trim(v.substring(2, v.length - 2))
        );
        if (_.isFunction(_v)) {
          let value = _v.call(that);
          if (value !== undefined) res[k] = value;
        } else {
          res[k] = _v;
        }
      }
    });
    return res;
  }
  function doRenderSelect(ele, data, instance, pool, sourse) {
    let that = this;
    let filter = instance.target.attr("lay-filter");
    if (!that.proxy.elist[filter]) that.proxy.elist[filter] = [];
    if (!that.proxy.eobj[filter]) that.proxy.eobj[filter] = {};
    let _pool = [];
    let _tempObj = {};
    _.each(sourse, (v, k) => {
      let obj = {};
      obj.target = $(
        `<option value = "${v[that.proxy.selectMap[filter].k]}">${
          v[that.proxy.selectMap[filter].v]
        }</option> `
      );
      let _key = that.proxy.selectMap[filter].key
        ? v[that.proxy.selectMap[filter].key]
        : k;
      obj.key = _key;
      obj.visible = true;
      obj.create = false;
      _pool.push(obj);
      let _index = _pool.length - 1;
      _tempObj[_key] = { index: _index, sourse: v };
    });
    let keys = Object.keys(_tempObj).sort(function (a, b) {
      return Number(a - b);
    });
    let prevKey;
    _.each(keys, (v) => {
      if (prevKey) {
        _pool[_tempObj[v].index].prev = _tempObj[prevKey].index;
      }
      prevKey = v;
    });
    _.each(keys, (key) => {
      let _tempObjects = _pool[_tempObj[key].index];
      let _cacheLink = that.proxy.eobj[filter][key];
      if (!_cacheLink) {
        if (_tempObjects.prev && _pool[_tempObjects.prev].create == true) {
          that.insertNode(
            _tempObjects,
            _pool,
            _tempObjects.target,
            instance.target
          );
        } else if (that.proxy.elist[filter][_tempObjects.prev]) {
          that.insertNode(
            _tempObjects,
            that.proxy.elist[filter],
            _tempObjects.target,
            instance.target
          );
        } else {
          instance.target.prepend(_tempObjects.target);
        }
        _tempObjects.create = true;
        if (!that.proxy.elist[filter][_tempObj[key].index]) {
          that.proxy.elist[filter][_tempObj[key].index] =
            _pool[_tempObj[key].index];
          that.proxy.elist[filter][_tempObj[key].index].last = true;
        }
      } else if (!_.isEqual(_tempObj[key].sourse, _cacheLink.sourse)) {
        if (that.proxy.elist[filter][_tempObjects.prev]) {
          that.insertNode(
            _tempObjects,
            that.proxy.elist[filter],
            _tempObjects.target,
            instance.target
          );
        } else {
          instance.target.prepend(_tempObjects.target);
        }
        _tempObjects.create = true;
      } else {
        _tempObjects.target =
          that.proxy.elist[filter][that.proxy.eobj[filter][key].index].target;
        _tempObjects.create = true;
        that.proxy.eobj[filter][key].last = true;
      }
    });
    _.each(that.proxy.eobj[filter], (v) => {
      if (!v.last) {
        that.proxy.elist[filter][v.index].target.remove();
      }
    });
    that.proxy.eobj[filter] = _tempObj;
    that.proxy.elist[filter] = _pool;
    if (that.proxy.selectMap[filter].defaultOption)
      that.proxy.selectMap[filter].defaultOption.remove();
    if (that.proxy.selectMap[filter].option) {
      that.proxy.selectMap[filter].defaultOption = $(
        `<option value = "">${that.proxy.selectMap[filter].option}</option>`
      );
      instance.target.prepend(that.proxy.selectMap[filter].defaultOption);
    }
    instance.target.find("option").each(function () {
      $(this).removeAttr("selected");
    });
    if (data !== undefined) {
      let selectedIndex = -1,
        i = 0;
      instance.target.find("option").each(function () {
        let $this = $(this);
        if ($this.val() == data) {
          $(this).attr("selected", "selected");
          selectedIndex = i;
          return false;
        }
        i++;
      });
      if (selectedIndex >= 0) {
        instance.target.get(0).selectedIndex = selectedIndex;
      } else {
        instance.target.get(0).selectedIndex = selectedIndex;
        let sourseKey = instance["v-model"];
        let index = sourseKey.indexOf(".");
        let obj =
          index < 0
            ? that
            : that.proxy.getValue.call(
                that,
                sourseKey.substring(0, sourseKey.lastIndexOf("."))
              );
        that.proxy.selectMap[filter].flag = true;
        obj[
          sourseKey.substring(sourseKey.lastIndexOf(".") + 1, sourseKey.length)
        ] = "";
        that.proxy.selectMap[filter].flag = false;
      }
    }
    let parent = instance.target.parents().filter(".layui-form");
    layui.form.render("select", parent.attr("lay-filter"));
  }
  function renderInput(ele, data, instance, pool) {
    let that = this;
    if (!that.proxy.inputMap) that.proxy.inputMap = {};
    let name = instance.target.attr("name");
    let _val = instance.target.val();
    if (_val != data) {
      instance.target.val(data);
      this.verifyItem.call(this, instance.target);
    } else if (0 === data || "0" === data) {
      if (_val !== data) {
        instance.target.val(data);
        this.verifyItem.call(this, instance.target);
      }
    }
    if (undefined !== instance.target.attr("v-model")) {
      instance.target.removeAttr("v-model");
      that.proxy.inputMap[name] = {
        lazy: undefined !== instance.target.attr("lay-lazy"),
      };
      instance.target.removeAttr("lay-lazy");
      let eventKey = that.proxy.inputMap[name].lazy
        ? "blur"
        : "input onpropertychange";
      // 添加监听事件  
      instance.target.off(eventKey).on(eventKey, function () {
        setInputValue.apply(that, [$(this), name, instance]);
      });
      let laydate = instance.target.attr("laydate");
      if (null == laydate) return;
      parseLaydate.call(that, instance);
    }
  }
  function setInputValue(item, name, instance) {
    this.verifyItem.call(this, item);
    let res = item.val();
    let sourseKey = instance["v-model"];
    if (/{{[\s|\S]*}}/.test(sourseKey))
      sourseKey = sourseKey.substring(2, sourseKey.length - 2);
    let i = sourseKey.indexOf(".");
    let obj =
      i < 0
        ? this
        : this.proxy.getValue.call(
            this,
            sourseKey.substring(0, sourseKey.lastIndexOf("."))
          );
    obj[sourseKey.substring(sourseKey.lastIndexOf(".") + 1, sourseKey.length)] =
      res;
  }
  function parseObject(_res) {
    let res = _.cloneDeep(_res);
    if (!res) return res;
    let that = this;
    _.each(res, function (v, k) {
      if (_.isString(v)) res[k] = that.proxy.replaceAll.call(that, v);
      if (_.isFunction(v)) {
        let value = v.call(that);
        if (value !== undefined) res[k] = value;
      }
    });
    return res;
  }
  function parseLaydate(instance, flag) {
    let that = this,
      item = instance.target;
    if (!that.proxy.laydateMap) that.proxy.laydateMap = {};
    let filter = item.attr("lay-filter");
    let _config = null;
    let _list = that.proxy.monitor.call(that, function () {
      let attr = item.attr("laydate");
      _config = _.assign(
        {},
        LAYDATE_CONFIG,
        parseObject.call(that, that.proxy.getValue.call(that, attr)),
        { value: item.val() },
        { elem: item.get(0) }
      );
    });
    _.each(_list, function (value) {
      let prefix = that.config.propertychangeprefix;
      that.proxy.on.call(
        that,
        prefix + value,
        "parselaydate-" + filter,
        function () {
          parseLaydate.call(that, instance, true);
        }
      );
    });
    if (!flag) {
      let done = _config.done;
      let cb = function (value, date, endDate) {
        setInputValue.apply(that, [item, "", instance]);
        done && done(value, date, endDate);
      };
      _config.done = cb;
      let layDate = layui.laydate.render(_config);
      that.proxy.laydateMap[filter] = layDate;
    } else {
      if (_config.max) {
        let maxs = _config.max.split("-");
        that.proxy.laydateMap[filter].config.max = _.assign(
          {},
          {
            year: maxs[0],
            month: maxs[1] - 1,
            date: maxs[2],
            hours: 0,
            minutes: 0,
            seconds: 0,
          }
        );
      }
      if (_config.min) {
        let mins = _config.min.split("-");
        that.proxy.laydateMap[filter].config.min = _.assign(
          {},
          {
            year: mins[0],
            month: mins[1] - 1,
            date: mins[2],
            hours: 0,
            minutes: 0,
            seconds: 0,
          }
        );
      }
    }
  }
  exports("vform", {});
});
