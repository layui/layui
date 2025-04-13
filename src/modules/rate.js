/**
 * rate
 * 评分组件
 */

layui.define('component', function(exports) {
  "use strict";

  var $ = layui.$;
  var lay = layui.lay;

  // 创建组件
  var component = layui.component({
    name: 'rate',

    // 默认配置
    config: {
      length: 5,  // 评分的最大长度值
      value: 0, // 评分的初始值
      half: false,  // 是否可以选择半星
      text: false,  // 是否显示评分对应的文本
      readonly: false,  // 是否只读
      theme: '' // 主题颜色
    },

    CONST: {
      ELEM: 'layui-rate',
      ICON_RATE: 'layui-icon-rate',
      ICON_RATE_SOLID: 'layui-icon-rate-solid',
      ICON_RATE_HALF: 'layui-icon-rate-half',
      ICON_SOLID_HALF: 'layui-icon-rate-solid layui-icon-rate-half',
      ICON_SOLID_RATE: 'layui-icon-rate-solid layui-icon-rate',
      ICON_HALF_RATE: 'layui-icon-rate layui-icon-rate-half',
    },

    // 渲染
    render: function() {
      var that = this;
      var options = that.config;

      // 自定义主题
      var style = options.theme ? ('style="color: '+ options.theme + ';"') : '';

      // 最大值不能大于总长度
      if (options.value > options.length) {
        options.value = options.length;
      }

      // 如果没有选择半星的属性，却给了小数的数值，统一向上或向下取整
      if (parseInt(options.value) !== options.value) {
        if (!options.half) {
          options.value = (Math.ceil(options.value) - options.value) < 0.5
            ? Math.ceil(options.value)
            : Math.floor(options.value)
        }
      }

      // 组件模板
      var template = '<ul class="layui-rate" '+ (options.readonly ? 'readonly' : '') +'>';
      for (var i = 1; i <= options.length; i++) {
        var item = '<li class="layui-inline"><i class="layui-icon '
          + (i > Math.floor(options.value) ? CONST.ICON_RATE : CONST.ICON_RATE_SOLID)
        + '" '+ style +'></i></li>';
        if (options.half && parseInt(options.value) !== options.value && i == Math.ceil(options.value)) {
          template = template + '<li><i class="layui-icon layui-icon-rate-half" '+ style +'></i></li>';
        } else {
          template = template + item;
        }
      }
      template += '</ul>';

      if (options.text) {
        template += '<span class="layui-inline">'+ options.value + '</span>';
      }

      // 开始插入替代元素
      var othis = options.elem;
      var hasRender = othis.next('.' + CONST.ELEM);

      // 生成替代元素
      hasRender[0] && hasRender.remove(); // 如果已经渲染，则 Rerender
      that.elemTemplate = $(template);

      options.span = that.elemTemplate.next('span');
      options.setText && options.setText(options.value);

      othis.html(that.elemTemplate);
      othis.addClass("layui-inline");

      // 若非只读，则添加触控事件
      if (!options.readonly) {
        that.action();
      }
    },

    // 扩展实例方法
    extendsInstance: function() {
      var that = this;
      var options = that.config;
      return {
        setvalue: function (value) {
          options.value = value;
          that.render();
        }
      };
    }
  });

  var CONST = component.CONST;

  /**
   * 扩展组件原型方法
   */

  var Class = component.Class;

  // li 相关事件
  Class.prototype.action = function() {
    var that = this;
    var options = that.config;
    var _ul = that.elemTemplate;
    var wide = _ul.find("i").width();
    var liElems =  _ul.children("li");

    liElems.each(function(index) {
      var ind = index + 1;
      var othis = $(this);

      // 点击
      othis.on('click', function(e) {
        // 将当前点击li的索引值赋给 value
        options.value = ind;
        if (options.half) {
          // 获取鼠标在 li 上的位置
          var x = e.pageX - $(this).offset().left;
          if (x <= wide / 2) {
            options.value = options.value - 0.5;
          }
        }

        if (options.text) {
          _ul.next("span").text(options.value);
        }

        options.choose && options.choose(options.value);
        options.setText && options.setText(options.value);
      });

      // 移入
      othis.on('mousemove', function(e) {
        _ul.find("i").each(function() {
          $(this).addClass(CONST.ICON_RATE).removeClass(CONST.ICON_SOLID_HALF)
        });
        _ul.find("i:lt(" + ind + ")").each(function() {
          $(this).addClass(CONST.ICON_RATE_SOLID).removeClass(CONST.ICON_HALF_RATE)
        });
        // 如果设置可选半星，那么判断鼠标相对 li 的位置
        if (options.half) {
          var x = e.pageX - $(this).offset().left;
          if (x <= wide / 2) {
            othis.children("i").addClass(CONST.ICON_RATE_HALF).removeClass(CONST.ICON_RATE_SOLID)
          }
        }
      })

      // 移出
      othis.on('mouseleave', function() {
        _ul.find("i").each(function() {
          $(this).addClass(CONST.ICON_RATE).removeClass(CONST.ICON_SOLID_HALF)
        });
        _ul.find("i:lt(" + Math.floor(options.value) + ")").each(function() {
          $(this).addClass(CONST.ICON_RATE_SOLID).removeClass(CONST.ICON_HALF_RATE)
        });
        // 如果设置可选半星，根据分数判断是否有半星
        if (options.half) {
          if (parseInt(options.value) !== options.value) {
            _ul.children("li:eq(" + Math.floor(options.value) + ")").children("i").addClass(CONST.ICON_RATE_HALF).removeClass(CONST.ICON_SOLID_RATE)
          }
        }
      })

    })

    lay.touchSwipe(_ul, {
      onTouchMove: function(e, state) {
        if(Date.now() - state.timeStart <= 200) return;
        var pageX = e.touches[0].pageX;
        var rateElemWidth = _ul.width();
        var itemElemWidth = rateElemWidth / options.length; // 单颗星的宽度
        var offsetX = pageX - _ul.offset().left;
        var num = offsetX / itemElemWidth; // 原始值
        var remainder = num % 1;
        var integer = num - remainder;

        // 最终值
        var score = remainder <= 0.5 && options.half ? integer + 0.5 : Math.ceil(num);
        if(score > options.length) score = options.length;
        if(score < 0) score = 0;

        liElems.each(function(index) {
          var iconElem = $(this).children('i');
          var isActiveIcon = (Math.ceil(score) - index === 1);
          var needSelect = Math.ceil(score) > index;
          var shouldHalfIcon = (score - index === 0.5);

          if (needSelect) {
            // 设置选中样式
            iconElem.addClass(CONST.ICON_RATE_SOLID).removeClass(CONST.ICON_HALF_RATE);
            if(options.half && shouldHalfIcon){
              iconElem.addClass(CONST.ICON_RATE_HALF).removeClass(CONST.ICON_RATE_SOLID);
            }
          } else {
            // 恢复初始样式
            iconElem.addClass(CONST.ICON_RATE).removeClass(CONST.ICON_SOLID_HALF);
          }

          // 设置缩放样式
          iconElem.toggleClass('layui-rate-hover', isActiveIcon);
        });

        // 更新最终值
        options.value = score;
        if(options.text)  _ul.next("span").text(options.value);
        options.setText && options.setText(options.value);
      },
      onTouchEnd: function(e, state) {
        if(Date.now() - state.timeStart <= 200) return;
        _ul.find('i').removeClass('layui-rate-hover');
        options.choose && options.choose(options.value);
        options.setText && options.setText(options.value);
      }
    });
  };

  exports(CONST.MOD_NAME, component);
});
