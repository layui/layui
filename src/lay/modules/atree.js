/**

 @Name：layui.atree2.0 树组件
 @Author：smallwei
 @License：MIT
    
 */

layui.define('jquery', function(exports) {
  "use strict";

  var $ = layui.$,
    hint = layui.hint();
  //勾选集合
  var changeList = [];
  //变量别名
  var props = {
    name: 'name',
    id: 'id',
    children: 'children',
    checkbox: 'checkbox',
    spread: 'spread',
    deleteBtnLabelKey: 'delete',
    addBtnLabelKey: 'add',
  };

  var enterSkin = 'layui-atree-enter',
    Atree = function(options) {
      this.options = options;
      this.nodes = options.nodes || [];
      this.props = this.options.props || props;
      this.nameKey = this.props.name || props.name;
      this.idKey = this.props.id || props.id;
      this.childrenKey = this.props.children || props.children;
      this.checkboxKey = this.props.checkbox || props.checkbox;
      this.spreadKey = this.props.spread || props.spread;
      this.addBtnLabelKey = this.props.addBtnLabel || props.addBtnLabel;
      this.deleteBtnLabelKey = this.props.deleteBtnLabel || props.deleteBtnLabel;
    };
  //图标
  var icon = {
    arrow: ['&#xe623;', '&#xe625;'] //箭头
      ,
    checkbox: ['&#xe68c;', '&#xe624;'] //复选框
      ,
    leaf: '&#xe621;' //叶节点
  };

  //初始化
  Atree.prototype.init = function(elem) {
    var that = this;
    elem.addClass('layui-box layui-atree'); //添加tree样式
    if(that.options.skin) {
      elem.addClass('layui-atree-skin-' + that.options.skin);
    }
    that.tree(elem);
    that.on(elem);
  };

  //树节点解析
  Atree.prototype.tree = function(elem, children) {
    var that = this,
      options = that.options
    var nodes = children || options.nodes;
    layui.each(nodes, function(index, item) {
      var hasChild = item[that.childrenKey] && item[that.childrenKey].length > 0;
      var dom = that.getDom(item);
      var ul = $(dom.ul(item));
      var li = $(that.getNode(item));

      //如果被选中加入checkbox集合里
      if(item[that.checkboxKey]) {
        changeList.push(item);
      }

      //如果有子节点，则递归继续生成树
      if(hasChild) {
        li.append(ul);
        that.tree(ul, item[that.childrenKey]);
      }
      //伸展节点
      that.spread(li, item);
      that.bindUlEvent(li, item);
      elem.append(li);

    });
  };

  //节点dom拼接
  Atree.prototype.getDom = function(item) {
    var that = this,
      options = that.options,
      item = item,
      hasChild = item[that.childrenKey] && item[that.childrenKey].length > 0;
    return {
      spread: function() {
        return hasChild ? '<i class="layui-icon layui-atree-spread">' + (
          item[that.spreadKey] || options.spreadAll ? icon.arrow[1] : icon.arrow[0]
        ) + '</i>' : '';
      },
      checkbox: function() {
        return options.check ? (
          '<i class="layui-icon layui-atree-check' + (item[that.checkboxKey] ? ' is-checked' : '') + '">' + (
            item[that.checkboxKey] ? icon.checkbox[1] : icon.checkbox[0]
          ) + '</i>'
        ) : '';
      },
      ul: function() {
        return '<ul class="' + (item[that.spreadKey] || options.spreadAll ? "layui-show" : "") + '"></ul>'
      },
      node: function() {
        return '<a href="' + (item.href || 'javascript:;') + '" ' + (
            options.target && item.href ? 'target=\"' + options.target + '\"' : ''
          ) + '>' +
          ('<cite>' + (item[that.nameKey] || '未命名') + '</cite></a>')
      },
      menu: function() {
        return '<div class="layui-atree-menu">' +
          '<span class="layui-atree-add">' + that.addBtnLabelKey + '</span>' +
          '<span class="layui-atree-delete">' + that.deleteBtnLabelKey + '</span>' +
          '</div>'
      }
    }

  }
  //获取树节点
  Atree.prototype.getNode = function(item) {
    var that = this,
      options = that.options
    var dom = that.getDom(item);
    var li = ['<li ' +
      (item[that.spreadKey] || options.spreadAll ? 'data-spread="' + (item[that.spreadKey] || true) + '"' : '') +
      (item[that.checkboxKey] ? 'data-check="' + item[that.checkboxKey] + '"' : '') +
      ('data-id=' + item[that.idKey]) +
      '><div class="layui-atree-node">'
      //展开箭头
      ,
      dom.spread()

      //复选框
      ,
      dom.checkbox()

      //节点
      ,
      dom.node()
      //菜单
      ,
      dom.menu(),
      '</div></li>'
    ].join('');
    return li;
  }

  //父绑定事件
  Atree.prototype.bindUlEvent = function(li, item) {
    var that = this,
      options = that.options
    //触发点击节点回调
    typeof options.click === 'function' && that.click(li, item);

    //节点选择
    typeof options.change === 'function' && options.check === 'checkbox' && that.checkbox(li, item);

    //新增方法
    typeof options.addClick === 'function' && that.add(li, item);

    //删除方法
    typeof options.deleteClick === 'function' && that.delete(li, item);

    //拖拽节点
    options.drag && that.drag(li, item);
  }

  //选中回调函数
  Atree.prototype.change = function() {
      var that = this,
        options = that.options;
      options.change(changeList);
    },

    //新增方法回调
    Atree.prototype.add = function(elem, item) {
      var that = this,
        options = that.options;
      var node = elem.children('.layui-atree-node');
      var addBtn = node.children('.layui-atree-menu').children('.layui-atree-add')
      var arrow = node.children('.layui-atree-spread')
      var ul = elem.children('ul'),
        a = node.children('a');
      var addEvent = function(e) {
        layui.stope(e);
        var _addEvent = {
          add: function(itemAddObj) {
            if(!item[that.childrenKey]) {
              item[that.childrenKey] = [];
            }
            item[that.childrenKey].push(itemAddObj);
            var dom = that.getDom(item);
            if(!ul[0]) {
              ul = $(dom.ul())
              elem.append(ul);
            }
            if(!arrow[0]) {
              arrow = $(dom.spread());
              node.prepend(arrow);
              that.spread(elem, item);
            }
            if(!elem.data('spread')) {
              that.open(elem, ul, arrow)
            }
            var li = $(that.getNode(itemAddObj));
            that.bindUlEvent(li, itemAddObj);
            ul.append(li);
          }
        }
        options.addClick(item, elem, _addEvent.add)
      }
      addBtn.on('click', addEvent);
    }

  //删除方法回调
  Atree.prototype.delete = function(elem, item) {
    var that = this,
      options = that.options;
    var node = elem.children('.layui-atree-node');
    var deleteBtn = node.children('.layui-atree-menu').children('.layui-atree-delete')
    var ul = elem.children('ul'),
      a = elem.children('a');
    var deleteEvent = function(e) {
      layui.stope(e);
      var _deleteEvent = {
        done: function() {
          var parent = elem.parent();
          var arrow = parent.parent().children('.layui-atree-spread')
          if(parent.children('li').length === 1) {
            arrow.remove();
          }
          elem.remove();
        }
      }
      options.deleteClick(item, elem, _deleteEvent.done)
    }
    deleteBtn.on('click', deleteEvent);
  }

  //点击节点回调
  Atree.prototype.click = function(elem, item) {
    var that = this,
      options = that.options;
    var node = elem.children('.layui-atree-node');
    node.children('a').on('click', function(e) {
      layui.stope(e);
      options.click(item)
    });
  };

  //节点选择
  Atree.prototype.checkbox = function(elem, item) {
    var that = this,
      options = that.options;
    var node = elem.children('.layui-atree-node');
    var checkbox = node.children('.layui-atree-check')
    var ul = elem.children('ul'),
      a = node.children('a');
    var whileAllCheck = function(dom, item, type) {
      var list = dom.children('.layui-show').find('li');
      var children = item ? item.children || [] : [];
      for(var i = 0; i < list.length; i++) {
        var li = $(list[i]);
        setCheck(li, children[i], type);
        whileAllCheck(li, children[i], type);
      }
    }
    var setCheck = function(elem, item, type) {
      var checkbox = elem.children('.layui-atree-node').find('.layui-atree-check');
      if(type) {
        elem.data('check', true)
        checkbox.html(icon.checkbox[1])
        checkbox.addClass(' is-checked');
      } else {
        elem.data('check', null);
        checkbox.removeClass(' is-checked');
        checkbox.html(icon.checkbox[0])
      }
      if(item) {
        var index = layui.findObj(changeList, item[that.idKey], that.idKey);
        if(index === -1 && type === true) {
          changeList.push(item);
        } else if(type === false) {
          changeList.splice(index, 1);
        }
      }
    }
    var check = function() {
      var checkFlag;
      if(elem.data('check')) {
        checkFlag = false;
      } else {
        checkFlag = true;
      }
      setCheck(elem, item, checkFlag)
      whileAllCheck(elem, item, checkFlag);
      that.change();
    }
    checkbox.on('click', check);

  };

  //伸展节点
  Atree.prototype.spread = function(elem, item) {
    var that = this,
      options = that.options;
    var node = elem.children('.layui-atree-node');
    var arrow = node.children('.layui-atree-spread')
    var ul = elem.children('ul'),
      a = node.children('a');
    //如果没有子节点，则不执行
    if(!ul[0]) return;
    arrow.on('click', function() {
      that.open(elem, ul, arrow)
    });
  }

  //打开节点
  Atree.prototype.open = function(elem, ul, arrow) {
    if(elem.data('spread')) {
      elem.data('spread', null)
      ul.removeClass('layui-show');
      arrow.html(icon.arrow[0]);
    } else {
      elem.data('spread', true);
      ul.addClass('layui-show');
      arrow.html(icon.arrow[1]);
    }
  };
  //通用事件
  Atree.prototype.on = function(elem) {
    var that = this,
      options = that.options;
    var dragStr = 'layui-atree-drag';

    //屏蔽选中文字
    elem.find('i').on('selectstart', function(e) {
      return false
    });

    //拖拽
    if(options.drag) {
      $(document).on('mousemove', function(e) {
        var move = that.move;
        if(move.from) {
          var to = move.to,
            treeMove = $('<div class="layui-box ' + dragStr + '"></div>');
          e.preventDefault();
          $('.' + dragStr)[0] || $('body').append(treeMove);
          var dragElem = $('.' + dragStr)[0] ? $('.' + dragStr) : treeMove;
          (dragElem).addClass('layui-show').html(move.from.elem.children('a').html());
          dragElem.css({
            left: e.pageX + 10,
            top: e.pageY + 10
          })
        }
      }).on('mouseup', function() {
        var move = that.move;
        if(move.from) {
          move.from.elem.children('a').removeClass(enterSkin);
          move.to && move.to.elem.children('a').removeClass(enterSkin);
          that.move = {};
          $('.' + dragStr).remove();
        }
      });
    }
  };

  //拖拽节点
  Atree.prototype.move = {};
  Atree.prototype.drag = function(elem, item) {
    var that = this,
      options = that.options;
    var a = elem.children('a'),
      mouseenter = function() {
        var othis = $(this),
          move = that.move;
        if(move.from) {
          move.to = {
            item: item,
            elem: elem
          };
          othis.addClass(enterSkin);
        }
      };
    a.on('mousedown', function() {
      var move = that.move
      move.from = {
        item: item,
        elem: elem
      };
    });
    a.on('mouseenter', mouseenter).on('mousemove', mouseenter)
      .on('mouseleave', function() {
        var othis = $(this),
          move = that.move;
        if(move.from) {
          delete move.to;
          othis.removeClass(enterSkin);
        }
      });
  };

  //暴露接口
  exports('atree', function(options) {
    var atree = new Atree(options = options || {});
    var elem = $(options.elem);
    if(!elem[0]) {
      return hint.error('layui.atree 没有找到' + options.elem + '元素');
    }
    atree.init(elem);
  });
});