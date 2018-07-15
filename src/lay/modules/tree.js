/**

 @Name：layui.tree2.0 树组件
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
	var props ={
		  name: 'name',
           id: 'id',
           children:'children'
	};
	
	var enterSkin = 'layui-tree-enter',
		Tree = function(options) {
			this.options = options;
			this.props = this.options.props || props;
			this.nameKey  = this.props.name || props.name;
			this.idKey  = this.props.id || props.id;
			this.childrenKey  = this.props.children || props.children;
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
	Tree.prototype.init = function(elem) {
		var that = this;
		elem.addClass('layui-box layui-tree'); //添加tree样式
		if(that.options.skin) {
			elem.addClass('layui-tree-skin-' + that.options.skin);
		}
		that.tree(elem);
		that.on(elem);
	};

	//树节点解析
	Tree.prototype.tree = function(elem, children) {
		var that = this,
			options = that.options
		var nodes = children || options.nodes;

		layui.each(nodes, function(index, item) {
			var hasChild = item[that.childrenKey] && item[that.childrenKey].length > 0;
			var ul = $('<ul class="' + (item.spread ? "layui-show" : "") + '"></ul>');
			var li = that.getNode(item, hasChild);
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
	Tree.prototype.getDom = function() {
		var that = this,
			options = that.options
		return {
			spread: function(item, hasChild) {
				return hasChild ? '<i class="layui-icon layui-tree-spread">' + (
					item.spread ? icon.arrow[1] : icon.arrow[0]
				) + '</i>' : '';
			},
			checkbox: function(item) {
				return options.check ? (
					'<i class="layui-icon layui-tree-check">' + (
						options.check === 'checkbox' ? icon.checkbox[0] : (
							options.check === 'radio' ? icon.radio[0] : ''
						)
					) + '</i>'
				) : '';
			},
			node: function(item) {
				return '<a href="' + (item.href || 'javascript:;') + '" ' + (
						options.target && item.href ? 'target=\"' + options.target + '\"' : ''
					) + '>' +
					('<cite>' + (item[that.nameKey] || '未命名') + '</cite></a>')
			},
			menu: function(item) {
				return '<div class="layui-tree-menu">' +
					'<span class="layui-tree-add">Add</span>' +
					'<span class="layui-tree-delete">Delete</span>' +
					'</div>'
			}
		}

	}
	//获取树节点
	Tree.prototype.getNode = function(item, hasChild) {
		var that = this,
			options = that.options
		var dom = that.getDom();
		var li = $(['<li ' + (item.spread ? 'data-spread="' + item.spread + '"' : '') +('data-id=' +  item[that.idKey])+ '>'
			//展开箭头
			,
			dom.spread(item, hasChild)

			//复选框/单选框
			,
			dom.checkbox(item)

			//节点
			,
			dom.node(item)
			//菜单
			,
			dom.menu()
			,
			'</li>'
		].join(''));
		return li;
	}

	//父绑定事件
	Tree.prototype.bindUlEvent = function(li, item) {
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
	Tree.prototype.change = function() {
			var that = this,
				options = that.options;
			options.change(changeList);
		},

		//新增方法回调
		Tree.prototype.add = function(elem, item) {
			var that = this,
				options = that.options;
			var addBtn = elem.children('.layui-tree-menu').children('.layui-tree-add')
			var arrow = elem.children('.layui-tree-spread')
			var ul = elem.children('ul'),
				a = elem.children('a');
			var addEvent = function(e) {
				layui.stope(e);
				var _addEvent = {
					add: function(itemAddObj) {
						if(!ul[0]) {
							ul = $('<ul class="layui-show"></ul>');
							elem.append(ul);
						}
						if(!arrow[0]) {
							arrow = $('<i class="layui-icon layui-tree-spread">' + icon.arrow[1] + '</i>');
							elem.prepend(arrow);
							that.spread(elem, item);
						}
						if(!elem.data('spread')) {
							that.open(elem, ul, arrow)
						}
						var li = that.getNode(itemAddObj, false);
						that.bindUlEvent(li, itemAddObj);
						ul.append(li);
					}
				}
				options.addClick(item, elem, _addEvent.add)
			}
			addBtn.on('click', addEvent);
		}

	//删除方法回调
	Tree.prototype.delete = function(elem, item) {
		var that = this,
			options = that.options;
		var deleteBtn = elem.children('.layui-tree-menu').children('.layui-tree-delete')
		var ul = elem.children('ul'),
			a = elem.children('a');
		var deleteEvent = function(e) {
			layui.stope(e);
			var _deleteEvent = {
				done: function() {
					elem.html('');
				}
			}
			options.deleteClick(item, elem, _deleteEvent.done)
		}
		deleteBtn.on('click', deleteEvent);
	}

	//点击节点回调
	Tree.prototype.click = function(elem, item) {
		var that = this,
			options = that.options;
		elem.children('a').on('click', function(e) {
			layui.stope(e);
			options.click(item)
		});
	};

	//节点选择
	Tree.prototype.checkbox = function(elem, item) {
		var that = this,
			options = that.options;
		var checkbox = elem.children('.layui-tree-check')
		var ul = elem.children('ul'),
			a = elem.children('a');
		var check = function() {
			var index = layui.findObj(changeList, item);
			if(elem.data('check')) {
				elem.data('check', null)
				checkbox.html(icon.checkbox[0]);
			} else {
				elem.data('check', true);
				checkbox.html(icon.checkbox[1]);
			}
			if(index === -1) {
				changeList.push(item);
			} else {
				changeList.splice(index, 1);
			}
			that.change();
		}
		checkbox.on('click', check);

	};

	//伸展节点
	Tree.prototype.spread = function(elem, item) {
		var that = this,
			options = that.options;
		var arrow = elem.children('.layui-tree-spread')
		var ul = elem.children('ul'),
			a = elem.children('a');
		//如果没有子节点，则不执行
		if(!ul[0]) return;
		arrow.on('click', function() {
			that.open(elem, ul, arrow)
		});
	}

	//打开节点
	Tree.prototype.open = function(elem, ul, arrow) {
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
	Tree.prototype.on = function(elem) {
		var that = this,
			options = that.options;
		var dragStr = 'layui-tree-drag';

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
	Tree.prototype.move = {};
	Tree.prototype.drag = function(elem, item) {
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
	exports('tree', function(options) {
		var tree = new Tree(options = options || {});
		var elem = $(options.elem);
		if(!elem[0]) {
			return hint.error('layui.tree 没有找到' + options.elem + '元素');
		}
		tree.init(elem);
	});
});