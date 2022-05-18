/**
 * layer - 通用 Web 弹出层组件
 * MIT Licensed 
 */

;!function(window, undefined){
"use strict";

var isLayui = window.layui && layui.define, $, win, ready = {
  getPath: function(){
    var jsPath = document.currentScript ? document.currentScript.src : function(){
      var js = document.scripts
      ,last = js.length - 1
      ,src;
      for(var i = last; i > 0; i--){
        if(js[i].readyState === 'interactive'){
          src = js[i].src;
          break;
        }
      }
      return src || js[last].src;
    }()
    ,GLOBAL = window.LAYUI_GLOBAL || {};
    return GLOBAL.layer_dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }(),

  config: {}, end: {}, minIndex: 0, minLeft: [],
  btn: ['&#x786E;&#x5B9A;', '&#x53D6;&#x6D88;'],

  //五种原始层模式
  type: ['dialog', 'page', 'iframe', 'loading', 'tips'],
  
  //获取节点的style属性值
  getStyle: function(node, name){
    var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
    return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
  },
  
  //载入 CSS 依赖
  link: function(href, fn, cssname){
    //未设置路径，则不主动加载css
    if(!layer.path) return;
    
    var head = document.getElementsByTagName("head")[0]
    ,link = document.createElement('link');
    
    if(typeof fn === 'string') cssname = fn;
    
    var app = (cssname || href).replace(/\.|\//g, '');
    var id = 'layuicss-'+ app
    ,STAUTS_NAME = 'creating'
    ,timeout = 0;
    
    link.rel = 'stylesheet';
    link.href = layer.path + href;
    link.id = id;
    
    if(!document.getElementById(id)){
      head.appendChild(link);
    }

    if(typeof fn !== 'function') return;

    //轮询 css 是否加载完毕
    (function poll(status) {
      var delay = 100
      ,getLinkElem = document.getElementById(id); //获取动态插入的 link 元素
      
      //如果轮询超过指定秒数，则视为请求文件失败或 css 文件不符合规范
      if(++timeout > 10 * 1000 / delay){
        return window.console && console.error(app +'.css: Invalid');
      };
      
      //css 加载就绪
      if(parseInt(ready.getStyle(getLinkElem, 'width')) === 1989){
        //如果参数来自于初始轮询（即未加载就绪时的），则移除 link 标签状态
        if(status === STAUTS_NAME) getLinkElem.removeAttribute('lay-status');
        //如果 link 标签的状态仍为「创建中」，则继续进入轮询，直到状态改变，则执行回调
        getLinkElem.getAttribute('lay-status') === STAUTS_NAME ? setTimeout(poll, delay) : fn();
      } else {
        getLinkElem.setAttribute('lay-status', STAUTS_NAME);
        setTimeout(function(){
          poll(STAUTS_NAME);
        }, delay);
      }

      //parseInt(ready.getStyle(document.getElementById(id), 'width')) === 1989 ? fn() : setTimeout(poll, 1000);
    }());

  }
};

//默认内置方法。
var layer = {
  v: '3.5.1',
  ie: function(){ //ie版本
    var agent = navigator.userAgent.toLowerCase();
    return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
      (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
    ) : false;
  }(),
  index: (window.layer && window.layer.v) ? 100000 : 0,
  path: ready.getPath,
  config: function(options, fn){
    options = options || {};
    layer.cache = ready.config = $.extend({}, ready.config, options);
    layer.path = ready.config.path || layer.path;
    typeof options.extend === 'string' && (options.extend = [options.extend]);
    
    //如果设置了路径，则加载样式
    if(ready.config.path) layer.ready();
    
    if(!options.extend) return this;
    
    isLayui 
      ? layui.addcss('modules/layer/' + options.extend)
    : ready.link('theme/' + options.extend);
    
    return this;
  },

  //主体CSS等待事件
  ready: function(callback){
    var cssname = 'layer', ver = ''
    ,path = (isLayui ? 'modules/layer/' : 'theme/') + 'default/layer.css?v='+ layer.v + ver;
    isLayui ? layui.addcss(path, callback, cssname) : ready.link(path, callback, cssname);
    return this;
  },
  
  //各种快捷引用
  alert: function(content, options, yes){
    var type = typeof options === 'function';
    if(type) yes = options;
    return layer.open($.extend({
      content: content,
      yes: yes
    }, type ? {} : options));
  }, 
  
  confirm: function(content, options, yes, cancel){ 
    var type = typeof options === 'function';
    if(type){
      cancel = yes;
      yes = options;
    }
    return layer.open($.extend({
      content: content,
      btn: ready.btn,
      yes: yes,
      btn2: cancel
    }, type ? {} : options));
  },
  
  msg: function(content, options, end){ //最常用提示层
    var type = typeof options === 'function', rskin = ready.config.skin;
    var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '')||'layui-layer-msg';
    var anim = doms.anim.length - 1;
    if(type) end = options;
    return layer.open($.extend({
      content: content,
      time: 3000,
      shade: false,
      skin: skin,
      title: false,
      closeBtn: false,
      btn: false,
      resize: false,
      end: end
    }, (type && !ready.config.skin) ? {
      skin: skin + ' layui-layer-hui',
      anim: anim
    } : function(){
       options = options || {};
       if(options.icon === -1 || options.icon === undefined && !ready.config.skin){
         options.skin = skin + ' ' + (options.skin||'layui-layer-hui');
       }
       return options;
    }()));  
  },
  
  load: function(icon, options){
    return layer.open($.extend({
      type: 3,
      icon: icon || 0,
      resize: false,
      shade: 0.01
    }, options));
  }, 
  
  tips: function(content, follow, options){
    return layer.open($.extend({
      type: 4,
      content: [content, follow],
      closeBtn: false,
      time: 3000,
      shade: false,
      resize: false,
      fixed: false,
      maxWidth: 260
    }, options));
  }
};

var Class = function(setings){  
  var that = this, creat = function(){
    that.creat();
  };
  that.index = ++layer.index;
  that.config.maxWidth = $(win).width() - 15*2; //初始最大宽度：当前屏幕宽，左右留 15px 边距
  that.config = $.extend({}, that.config, ready.config, setings);
  document.body ? creat() : setTimeout(function(){
    creat();
  }, 30);
};

Class.pt = Class.prototype;

//缓存常用字符
var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];
doms.anim = ['layer-anim-00', 'layer-anim-01', 'layer-anim-02', 'layer-anim-03', 'layer-anim-04', 'layer-anim-05', 'layer-anim-06'];

doms.SHADE = 'layui-layer-shade';
doms.MOVE = 'layui-layer-move';

//默认配置
Class.pt.config = {
  type: 0,
  shade: 0.3,
  fixed: true,
  move: doms[1],
  title: '&#x4FE1;&#x606F;',
  offset: 'auto',
  area: 'auto',
  closeBtn: 1,
  time: 0, //0表示不自动关闭
  zIndex: 19891014, 
  maxWidth: 360,
  anim: 0,
  isOutAnim: true, //退出动画
  minStack: true, //最小化堆叠
  icon: -1,
  moveType: 1,
  resize: true,
  scrollbar: true, //是否允许浏览器滚动条
  tips: 2
};

//容器
Class.pt.vessel = function(conType, callback){
  var that = this, times = that.index, config = that.config;
  var zIndex = config.zIndex + times, titype = typeof config.title === 'object';
  var ismax = config.maxmin && (config.type === 1 || config.type === 2);
  var titleHTML = (config.title ? '<div class="layui-layer-title" style="'+ (titype ? config.title[1] : '') +'">' 
    + (titype ? config.title[0] : config.title) 
  + '</div>' : '');
  
  config.zIndex = zIndex;
  callback([
    //遮罩
    config.shade ? ('<div class="'+ doms.SHADE +'" id="'+ doms.SHADE + times +'" times="'+ times +'" style="'+ ('z-index:'+ (zIndex-1) +'; ') +'"></div>') : '',
    
    //主体
    '<div class="'+ doms[0] + (' layui-layer-'+ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '') + ' ' + (config.skin||'') +'" id="'+ doms[0] + times +'" type="'+ ready.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + ';position:'+ (config.fixed ? 'fixed;' : 'absolute;') +'">'
      + (conType && config.type != 2 ? '' : titleHTML)
      + '<div id="'+ (config.id||'') +'" class="layui-layer-content'+ ((config.type == 0 && config.icon !== -1) ? ' layui-layer-padding' :'') + (config.type == 3 ? ' layui-layer-loading'+config.icon : '') +'">'
        + (config.type == 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico'+ config.icon +'"></i>' : '')
        + (config.type == 1 && conType ? '' : (config.content||''))
      + '</div>'
      + '<span class="layui-layer-setwin">'+ function(){
        var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
        config.closeBtn && (closebtn += '<a class="layui-layer-ico '+ doms[7] +' '+ doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2')) +'" href="javascript:;"></a>');
        return closebtn;
      }() + '</span>'
      + (config.btn ? function(){
        var button = '';
        typeof config.btn === 'string' && (config.btn = [config.btn]);
        for(var i = 0, len = config.btn.length; i < len; i++){
          button += '<a class="'+ doms[6] +''+ i +'">'+ config.btn[i] +'</a>'
        }
        return '<div class="'+ doms[6] +' layui-layer-btn-'+ (config.btnAlign||'') +'">'+ button +'</div>'
      }() : '')
      + (config.resize ? '<span class="layui-layer-resize"></span>' : '')
    + '</div>'
  ], titleHTML, $('<div class="'+ doms.MOVE +'" id="'+ doms.MOVE +'"></div>'));
  return that;
};

//创建骨架
Class.pt.creat = function(){
  var that = this
  ,config = that.config
  ,times = that.index, nodeIndex
  ,content = config.content
  ,conType = typeof content === 'object'
  ,body = $('body');
  
  if(config.id && $('#'+config.id)[0])  return;

  if(typeof config.area === 'string'){
    config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
  }
  
  //anim兼容旧版shift
  if(config.shift){
    config.anim = config.shift;
  }
  
  if(layer.ie == 6){
    config.fixed = false;
  }
  
  switch(config.type){
    case 0:
      config.btn = ('btn' in config) ? config.btn : ready.btn[0];
      layer.closeAll('dialog');
    break;
    case 2:
      var content = config.content = conType ? config.content : [config.content||'', 'auto'];
      config.content = '<iframe scrolling="'+ (config.content[1]||'auto') +'" allowtransparency="true" id="'+ doms[4] +''+ times +'" name="'+ doms[4] +''+ times +'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
    break;
    case 3:
      delete config.title;
      delete config.closeBtn;
      config.icon === -1 && (config.icon === 0);
      layer.closeAll('loading');
    break;
    case 4:
      conType || (config.content = [config.content, 'body']);
      config.follow = config.content[1];
      config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
      delete config.title;
      config.tips = typeof config.tips === 'object' ? config.tips : [config.tips, true];
      config.tipsMore || layer.closeAll('tips');
    break;
  }
  
  //建立容器
  that.vessel(conType, function(html, titleHTML, moveElem){
    body.append(html[0]);
    conType ? function(){
      (config.type == 2 || config.type == 4) ? function(){
        $('body').append(html[1]);
      }() : function(){
        if(!content.parents('.'+doms[0])[0]){
          content.data('display', content.css('display')).show().addClass('layui-layer-wrap').wrap(html[1]);
          $('#'+ doms[0] + times).find('.'+doms[5]).before(titleHTML);
        }
      }();
    }() : body.append(html[1]);
    $('#'+ doms.MOVE)[0] || body.append(ready.moveElem = moveElem);
    
    that.layero = $('#'+ doms[0] + times);
    that.shadeo = $('#'+ doms.SHADE + times);
    
    config.scrollbar || doms.html.css('overflow', 'hidden').attr('layer-full', times);
  }).auto(times);
  
  //遮罩
  that.shadeo.css({
    'background-color': config.shade[1] || '#000'
    ,'opacity': config.shade[0] || config.shade
  });

  config.type == 2 && layer.ie == 6 && that.layero.find('iframe').attr('src', content[0]);

  //坐标自适应浏览器窗口尺寸
  config.type == 4 ? that.tips() : function(){
    that.offset()
    //首次弹出时，若 css 尚未加载，则等待 css 加载完毕后，重新设定尺寸
    parseInt(ready.getStyle(document.getElementById(doms.MOVE), 'z-index')) ||  function(){
      that.layero.css('visibility', 'hidden');
      layer.ready(function(){
        that.offset();
        that.layero.css('visibility', 'visible');
      });
    }();
  }();
  
  //如果是固定定位
  if(config.fixed){
    win.on('resize', function(){
      that.offset();
      (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
      config.type == 4 && that.tips();
    });
  }
  
  config.time <= 0 || setTimeout(function(){
    layer.close(that.index);
  }, config.time);
  that.move().callback();
  
  //为兼容jQuery3.0的css动画影响元素尺寸计算
  if(doms.anim[config.anim]){
    var animClass = 'layer-anim '+ doms.anim[config.anim];
    that.layero.addClass(animClass).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(animClass);
    });
  };
  
  //记录关闭动画
  if(config.isOutAnim){
    that.layero.data('isOutAnim', true);
  }
};

//自适应
Class.pt.auto = function(index){
  var that = this, config = that.config, layero = $('#'+ doms[0] + index);
  
  if(config.area[0] === '' && config.maxWidth > 0){
    //为了修复IE7下一个让人难以理解的bug
    if(layer.ie && layer.ie < 8 && config.btn){
      layero.width(layero.innerWidth());
    }
    layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
  }
  
  var area = [layero.innerWidth(), layero.innerHeight()]
  ,titHeight = layero.find(doms[1]).outerHeight() || 0
  ,btnHeight = layero.find('.'+doms[6]).outerHeight() || 0
  ,setHeight = function(elem){
    elem = layero.find(elem);
    elem.height(area[1] - titHeight - btnHeight - 2*(parseFloat(elem.css('padding-top'))|0));
  };

  switch(config.type){
    case 2: 
      setHeight('iframe');
    break;
    default:
      if(config.area[1] === ''){
        if(config.maxHeight > 0 && layero.outerHeight() > config.maxHeight){
          area[1] = config.maxHeight;
          setHeight('.'+doms[5]);
        } else if(config.fixed && area[1] >= win.height()){
          area[1] = win.height();
          setHeight('.'+doms[5]);
        }
      } else {
        setHeight('.'+doms[5]);
      }
    break;
  };
  
  return that;
};

//计算坐标
Class.pt.offset = function(){
  var that = this, config = that.config, layero = that.layero;
  var area = [layero.outerWidth(), layero.outerHeight()];
  var type = typeof config.offset === 'object';
  that.offsetTop = (win.height() - area[1])/2;
  that.offsetLeft = (win.width() - area[0])/2;
  
  if(type){
    that.offsetTop = config.offset[0];
    that.offsetLeft = config.offset[1]||that.offsetLeft;
  } else if(config.offset !== 'auto'){
    
    if(config.offset === 't'){ //上
      that.offsetTop = 0;
    } else if(config.offset === 'r'){ //右
      that.offsetLeft = win.width() - area[0];
    } else if(config.offset === 'b'){ //下
      that.offsetTop = win.height() - area[1];
    } else if(config.offset === 'l'){ //左
      that.offsetLeft = 0;
    } else if(config.offset === 'lt'){ //左上角
      that.offsetTop = 0;
      that.offsetLeft = 0;
    } else if(config.offset === 'lb'){ //左下角
      that.offsetTop = win.height() - area[1];
      that.offsetLeft = 0;
    } else if(config.offset === 'rt'){ //右上角
      that.offsetTop = 0;
      that.offsetLeft = win.width() - area[0];
    } else if(config.offset === 'rb'){ //右下角
      that.offsetTop = win.height() - area[1];
      that.offsetLeft = win.width() - area[0];
    } else {
      that.offsetTop = config.offset;
    }
    
  }
 
  if(!config.fixed){
    that.offsetTop = /%$/.test(that.offsetTop) ? 
      win.height()*parseFloat(that.offsetTop)/100
    : parseFloat(that.offsetTop);
    that.offsetLeft = /%$/.test(that.offsetLeft) ? 
      win.width()*parseFloat(that.offsetLeft)/100
    : parseFloat(that.offsetLeft);
    that.offsetTop += win.scrollTop();
    that.offsetLeft += win.scrollLeft();
  }
  
  if(layero.attr('minLeft')){
    that.offsetTop = win.height() - (layero.find(doms[1]).outerHeight() || 0);
    that.offsetLeft = layero.css('left');
  }

  layero.css({top: that.offsetTop, left: that.offsetLeft});
};

//Tips
Class.pt.tips = function(){
  var that = this, config = that.config, layero = that.layero;
  var layArea = [layero.outerWidth(), layero.outerHeight()], follow = $(config.follow);
  if(!follow[0]) follow = $('body');
  var goal = {
    width: follow.outerWidth(),
    height: follow.outerHeight(),
    top: follow.offset().top,
    left: follow.offset().left
  }, tipsG = layero.find('.layui-layer-TipsG');
  
  var guide = config.tips[0];
  config.tips[1] || tipsG.remove();
  
  goal.autoLeft = function(){
    if(goal.left + layArea[0] - win.width() > 0){
      goal.tipLeft = goal.left + goal.width - layArea[0];
      tipsG.css({right: 12, left: 'auto'});
    } else {
      goal.tipLeft = goal.left;
    };
  };
  
  //辨别tips的方位
  goal.where = [function(){ //上        
    goal.autoLeft();
    goal.tipTop = goal.top - layArea[1] - 10;
    tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
  }, function(){ //右
    goal.tipLeft = goal.left + goal.width + 10;
    goal.tipTop = goal.top;
    tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]); 
  }, function(){ //下
    goal.autoLeft();
    goal.tipTop = goal.top + goal.height + 10;
    tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
  }, function(){ //左
    goal.tipLeft = goal.left - layArea[0] - 10;
    goal.tipTop = goal.top;
    tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
  }];
  goal.where[guide-1]();
  
  /* 8*2为小三角形占据的空间 */
  if(guide === 1){
    goal.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && goal.where[2]();
  } else if(guide === 2){
    win.width() - (goal.left + goal.width + layArea[0] + 8*2) > 0 || goal.where[3]()
  } else if(guide === 3){
    (goal.top - win.scrollTop() + goal.height + layArea[1] + 8*2) - win.height() > 0 && goal.where[0]();
  } else if(guide === 4){
     layArea[0] + 8*2 - goal.left > 0 && goal.where[1]()
  }

  layero.find('.'+doms[5]).css({
    'background-color': config.tips[1], 
    'padding-right': (config.closeBtn ? '30px' : '')
  });
  layero.css({
    left: goal.tipLeft - (config.fixed ? win.scrollLeft() : 0), 
    top: goal.tipTop  - (config.fixed ? win.scrollTop() : 0)
  });
}

//拖拽层
Class.pt.move = function(){
  var that = this
  ,config = that.config
  ,_DOC = $(document)
  ,layero = that.layero
  ,moveElem = layero.find(config.move)
  ,resizeElem = layero.find('.layui-layer-resize')
  ,dict = {};
  
  if(config.move){
    moveElem.css('cursor', 'move');
  }

  moveElem.on('mousedown', function(e){
    e.preventDefault();
    if(config.move){
      dict.moveStart = true;
      dict.offset = [
        e.clientX - parseFloat(layero.css('left'))
        ,e.clientY - parseFloat(layero.css('top'))
      ];
      ready.moveElem.css('cursor', 'move').show();
    }
  });
  
  resizeElem.on('mousedown', function(e){
    e.preventDefault();
    dict.resizeStart = true;
    dict.offset = [e.clientX, e.clientY];
    dict.area = [
      layero.outerWidth()
      ,layero.outerHeight()
    ];
    ready.moveElem.css('cursor', 'se-resize').show();
  });
  
  _DOC.on('mousemove', function(e){

    //拖拽移动
    if(dict.moveStart){
      var X = e.clientX - dict.offset[0]
      ,Y = e.clientY - dict.offset[1]
      ,fixed = layero.css('position') === 'fixed';
      
      e.preventDefault();
      
      dict.stX = fixed ? 0 : win.scrollLeft();
      dict.stY = fixed ? 0 : win.scrollTop();

      //控制元素不被拖出窗口外
      if(!config.moveOut){
        var setRig = win.width() - layero.outerWidth() + dict.stX
        ,setBot = win.height() - layero.outerHeight() + dict.stY;  
        X < dict.stX && (X = dict.stX);
        X > setRig && (X = setRig); 
        Y < dict.stY && (Y = dict.stY);
        Y > setBot && (Y = setBot);
      }
      
      layero.css({
        left: X
        ,top: Y
      });
    }
    
    //Resize
    if(config.resize && dict.resizeStart){
      var X = e.clientX - dict.offset[0]
      ,Y = e.clientY - dict.offset[1];
      
      e.preventDefault();
      
      layer.style(that.index, {
        width: dict.area[0] + X
        ,height: dict.area[1] + Y
      })
      dict.isResize = true;
      config.resizing && config.resizing(layero);
    }
  }).on('mouseup', function(e){
    if(dict.moveStart){
      delete dict.moveStart;
      ready.moveElem.hide();
      config.moveEnd && config.moveEnd(layero);
    }
    if(dict.resizeStart){
      delete dict.resizeStart;
      ready.moveElem.hide();
    }
  });
  
  return that;
};

Class.pt.callback = function(){
  var that = this, layero = that.layero, config = that.config;
  that.openLayer();
  if(config.success){
    if(config.type == 2){
      layero.find('iframe').on('load', function(){
        config.success(layero, that.index, that);
      });
    } else {
      config.success(layero, that.index, that);
    }
  }
  layer.ie == 6 && that.IE6(layero);
  
  //按钮
  layero.find('.'+ doms[6]).children('a').on('click', function(){
    var index = $(this).index();
    if(index === 0){
      if(config.yes){
        config.yes(that.index, layero)
      } else if(config['btn1']){
        config['btn1'](that.index, layero)
      } else {
        layer.close(that.index);
      }
    } else {
      var close = config['btn'+(index+1)] && config['btn'+(index+1)](that.index, layero);
      close === false || layer.close(that.index);
    }
  });
  
  //取消
  function cancel(){
    var close = config.cancel && config.cancel(that.index, layero);
    close === false || layer.close(that.index);
  }
  
  //右上角关闭回调
  layero.find('.'+ doms[7]).on('click', cancel);
  
  //点遮罩关闭
  if(config.shadeClose){
    that.shadeo.on('click', function(){
      layer.close(that.index);
    });
  } 
  
  //最小化
  layero.find('.layui-layer-min').on('click', function(){
    var min = config.min && config.min(layero, that.index);
    min === false || layer.min(that.index, config);
  });
  
  //全屏/还原
  layero.find('.layui-layer-max').on('click', function(){
    if($(this).hasClass('layui-layer-maxmin')){
      layer.restore(that.index);
      config.restore && config.restore(layero, that.index);
    } else {
      layer.full(that.index, config);
      setTimeout(function(){
        config.full && config.full(layero, that.index);
      }, 100);
    }
  });

  config.end && (ready.end[that.index] = config.end);
};

//for ie6 恢复select
ready.reselect = function(){
  $.each($('select'), function(index , value){
    var sthis = $(this);
    if(!sthis.parents('.'+doms[0])[0]){
      (sthis.attr('layer') == 1 && $('.'+doms[0]).length < 1) && sthis.removeAttr('layer').show(); 
    }
    sthis = null;
  });
}; 

Class.pt.IE6 = function(layero){
  //隐藏select
  $('select').each(function(index , value){
    var sthis = $(this);
    if(!sthis.parents('.'+doms[0])[0]){
      sthis.css('display') === 'none' || sthis.attr({'layer' : '1'}).hide();
    }
    sthis = null;
  });
};

//需依赖原型的对外方法
Class.pt.openLayer = function(){
  var that = this;
  
  //置顶当前窗口
  layer.zIndex = that.config.zIndex;
  layer.setTop = function(layero){
    var setZindex = function(){
      layer.zIndex++;
      layero.css('z-index', layer.zIndex + 1);
    };
    layer.zIndex = parseInt(layero[0].style.zIndex);
    layero.on('mousedown', setZindex);
    return layer.zIndex;
  };
};

//记录宽高坐标，用于还原
ready.record = function(layero){
  var area = [
    layero.width(),
    layero.height(),
    layero.position().top, 
    layero.position().left + parseFloat(layero.css('margin-left'))
  ];
  layero.find('.layui-layer-max').addClass('layui-layer-maxmin');
  layero.attr({area: area});
};

ready.rescollbar = function(index){
  if(doms.html.attr('layer-full') == index){
    if(doms.html[0].style.removeProperty){
      doms.html[0].style.removeProperty('overflow');
    } else {
      doms.html[0].style.removeAttribute('overflow');
    }
    doms.html.removeAttr('layer-full');
  }
};

/** 内置成员 */

window.layer = layer;

//获取子iframe的DOM
layer.getChildFrame = function(selector, index){
  index = index || $('.'+doms[4]).attr('times');
  return $('#'+ doms[0] + index).find('iframe').contents().find(selector);  
};

//得到当前iframe层的索引，子iframe时使用
layer.getFrameIndex = function(name){
  return $('#'+ name).parents('.'+doms[4]).attr('times');
};

//iframe层自适应宽高
layer.iframeAuto = function(index){
  if(!index) return;
  var heg = layer.getChildFrame('html', index).outerHeight();
  var layero = $('#'+ doms[0] + index);
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  layero.css({height: heg + titHeight + btnHeight});
  layero.find('iframe').css({height: heg});
};

//重置iframe url
layer.iframeSrc = function(index, url){
  $('#'+ doms[0] + index).find('iframe').attr('src', url);
};

//设定层的样式
layer.style = function(index, options, limit){
  var layero = $('#'+ doms[0] + index)
  ,contElem = layero.find('.layui-layer-content')
  ,type = layero.attr('type')
  ,titHeight = layero.find(doms[1]).outerHeight() || 0
  ,btnHeight = layero.find('.'+doms[6]).outerHeight() || 0
  ,minLeft = layero.attr('minLeft');
  
  if(type === ready.type[3] || type === ready.type[4]){
    return;
  }
  
  if(!limit){
    if(parseFloat(options.width) <= 260){
      options.width = 260;
    };
    
    if(parseFloat(options.height) - titHeight - btnHeight <= 64){
      options.height = 64 + titHeight + btnHeight;
    };
  }
  
  layero.css(options);
  btnHeight = layero.find('.'+doms[6]).outerHeight();
  
  if(type === ready.type[2]){
    layero.find('iframe').css({
      height: parseFloat(options.height) - titHeight - btnHeight
    });
  } else {
    contElem.css({
      height: parseFloat(options.height) - titHeight - btnHeight
      - parseFloat(contElem.css('padding-top'))
      - parseFloat(contElem.css('padding-bottom'))
    })
  }
};

//最小化
layer.min = function(index, options){
  options = options || {};
  var layero = $('#'+ doms[0] + index)
  ,shadeo = $('#'+ doms.SHADE + index)
  ,titHeight = layero.find(doms[1]).outerHeight() || 0
  ,left = layero.attr('minLeft') || (181*ready.minIndex)+'px'
  ,position = layero.css('position')
  ,settings = {
    width: 180
    ,height: titHeight
    ,position: 'fixed'
    ,overflow: 'hidden'
  };
  
  //记录宽高坐标，用于还原
  ready.record(layero);
  
  if(ready.minLeft[0]){
    left = ready.minLeft[0];
    ready.minLeft.shift();
  }
  
  //是否堆叠在左下角
  if(options.minStack){
    settings.left = left;
    settings.top = win.height() - titHeight;
    layero.attr('minLeft') || ready.minIndex++; //初次执行，最小化操作索引自增
    layero.attr('minLeft', left);
  }
  
  layero.attr('position', position);
  layer.style(index, settings, true);

  layero.find('.layui-layer-min').hide();
  layero.attr('type') === 'page' && layero.find(doms[4]).hide();
  ready.rescollbar(index);

  //隐藏遮罩
  shadeo.hide();
};

//还原
layer.restore = function(index){
  var layero = $('#'+ doms[0] + index)
  ,shadeo = $('#'+ doms.SHADE + index)
  ,area = layero.attr('area').split(',')
  ,type = layero.attr('type');
  
  //恢复原来尺寸
  layer.style(index, {
    width: parseFloat(area[0]), 
    height: parseFloat(area[1]), 
    top: parseFloat(area[2]), 
    left: parseFloat(area[3]),
    position: layero.attr('position'),
    overflow: 'visible'
  }, true);
  
  layero.find('.layui-layer-max').removeClass('layui-layer-maxmin');
  layero.find('.layui-layer-min').show();
  layero.attr('type') === 'page' && layero.find(doms[4]).show();
  ready.rescollbar(index);
  
  //恢复遮罩
  shadeo.show();
};

//全屏
layer.full = function(index){
  var layero = $('#'+ doms[0] + index), timer;
  ready.record(layero);
  if(!doms.html.attr('layer-full')){
    doms.html.css('overflow','hidden').attr('layer-full', index);
  }
  clearTimeout(timer);
  timer = setTimeout(function(){
    var isfix = layero.css('position') === 'fixed';
    layer.style(index, {
      top: isfix ? 0 : win.scrollTop(),
      left: isfix ? 0 : win.scrollLeft(),
      width: win.width(),
      height: win.height()
    }, true);
    layero.find('.layui-layer-min').hide();
  }, 100);
};

//改变title
layer.title = function(name, index){
  var title = $('#'+ doms[0] + (index||layer.index)).find(doms[1]);
  title.html(name);
};

//关闭layer总方法
layer.close = function(index, callback){
  var layero = $('#'+ doms[0] + index), type = layero.attr('type'), closeAnim = 'layer-anim-close';
  if(!layero[0]) return;
  var WRAP = 'layui-layer-wrap', remove = function(){
    if(type === ready.type[1] && layero.attr('conType') === 'object'){
      layero.children(':not(.'+ doms[5] +')').remove();
      var wrap = layero.find('.'+WRAP);
      for(var i = 0; i < 2; i++){
        wrap.unwrap();
      }
      wrap.css('display', wrap.data('display')).removeClass(WRAP);
    } else {
      //低版本IE 回收 iframe
      if(type === ready.type[2]){
        try {
          var iframe = $('#'+doms[4]+index)[0];
          iframe.contentWindow.document.write('');
          iframe.contentWindow.close();
          layero.find('.'+doms[5])[0].removeChild(iframe);
        } catch(e){}
      }
      layero[0].innerHTML = '';
      layero.remove();
    }
    typeof ready.end[index] === 'function' && ready.end[index]();
    delete ready.end[index];
    typeof callback === 'function' && callback();
  };
  
  if(layero.data('isOutAnim')){
    layero.addClass('layer-anim '+ closeAnim);
  }
  
  $('#layui-layer-moves, #'+ doms.SHADE + index).remove();
  layer.ie == 6 && ready.reselect();
  ready.rescollbar(index); 
  if(layero.attr('minLeft')){
    ready.minIndex--;
    ready.minLeft.push(layero.attr('minLeft'));
  }
  
  if((layer.ie && layer.ie < 10) || !layero.data('isOutAnim')){
    remove()
  } else {
    setTimeout(function(){
      remove();
    }, 200);
  }
};

//关闭所有层
layer.closeAll = function(type, callback){
  if(typeof type === 'function'){
    callback = type;
    type = null;
  };
  var domsElem = $('.'+doms[0]);
  $.each(domsElem, function(_index){
    var othis = $(this);
    var is = type ? (othis.attr('type') === type) : 1;
    is && layer.close(othis.attr('times'), _index === domsElem.length - 1 ? callback : null);
    is = null;
  });
  if(domsElem.length === 0) typeof callback === 'function' && callback();
};

/** 

  拓展模块，layui 开始合并在一起

 */

var cache = layer.cache||{}, skin = function(type){
  return (cache.skin ? (' ' + cache.skin + ' ' + cache.skin + '-'+type) : '');
}; 
 
//仿系统prompt
layer.prompt = function(options, yes){
  var style = '';
  options = options || {};
  
  if(typeof options === 'function') yes = options;
  
  if(options.area){
    var area = options.area;
    style = 'style="width: '+ area[0] +'; height: '+ area[1] + ';"';
    delete options.area;
  }
  var prompt, content = options.formType == 2 ? '<textarea class="layui-layer-input"' + style +'></textarea>' : function(){
    return '<input type="'+ (options.formType == 1 ? 'password' : 'text') +'" class="layui-layer-input">';
  }();
  
  var success = options.success;
  delete options.success;
  
  return layer.open($.extend({
    type: 1
    ,btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;']
    ,content: content
    ,skin: 'layui-layer-prompt' + skin('prompt')
    ,maxWidth: win.width()
    ,success: function(layero){
      prompt = layero.find('.layui-layer-input');
      prompt.val(options.value || '').focus();
      typeof success === 'function' && success(layero);
    }
    ,resize: false
    ,yes: function(index){
      var value = prompt.val();
      if(value === ''){
        prompt.focus();
      } else if(value.length > (options.maxlength||500)) {
        layer.tips('&#x6700;&#x591A;&#x8F93;&#x5165;'+ (options.maxlength || 500) +'&#x4E2A;&#x5B57;&#x6570;', prompt, {tips: 1});
      } else {
        yes && yes(value, index, prompt);
      }
    }
  }, options));
};

//tab层
layer.tab = function(options){
  options = options || {};
  
  var tab = options.tab || {}
  ,THIS = 'layui-this'
  ,success = options.success;
  
  delete options.success;
  
  return layer.open($.extend({
    type: 1,
    skin: 'layui-layer-tab' + skin('tab'),
    resize: false,
    title: function(){
      var len = tab.length, ii = 1, str = '';
      if(len > 0){
        str = '<span class="'+ THIS +'">'+ tab[0].title +'</span>';
        for(; ii < len; ii++){
          str += '<span>'+ tab[ii].title +'</span>';
        }
      }
      return str;
    }(),
    content: '<ul class="layui-layer-tabmain">'+ function(){
      var len = tab.length, ii = 1, str = '';
      if(len > 0){
        str = '<li class="layui-layer-tabli '+ THIS +'">'+ (tab[0].content || 'no content') +'</li>';
        for(; ii < len; ii++){
          str += '<li class="layui-layer-tabli">'+ (tab[ii].content || 'no  content') +'</li>';
        }
      }
      return str;
    }() +'</ul>',
    success: function(layero){
      var btn = layero.find('.layui-layer-title').children();
      var main = layero.find('.layui-layer-tabmain').children();
      btn.on('mousedown', function(e){
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        var othis = $(this), index = othis.index();
        othis.addClass(THIS).siblings().removeClass(THIS);
        main.eq(index).show().siblings().hide();
        typeof options.change === 'function' && options.change(index);
      });
      typeof success === 'function' && success(layero);
    }
  }, options));
};

//相册层
layer.photos = function(options, loop, key){
  var dict = {};
  options = options || {};
  if(!options.photos) return;
  
  //若 photos 并非选择器或 jQuery 对象，则为普通 object
  var isObject = !(typeof options.photos === 'string' || options.photos instanceof $)
  ,photos = isObject ? options.photos : {}
  ,data = photos.data || []
  ,start = photos.start || 0;
  
  dict.imgIndex = (start|0) + 1;
  options.img = options.img || 'img';
  
  var success = options.success;
  delete options.success;
  
  //如果 options.photos 不是一个对象
  if(!isObject){ //页面直接获取
    var parent = $(options.photos), pushData = function(){
      data = [];
      parent.find(options.img).each(function(index){
        var othis = $(this);
        othis.attr('layer-index', index);
        data.push({
          alt: othis.attr('alt'),
          pid: othis.attr('layer-pid'),
          src: othis.attr('layer-src') || othis.attr('src'),
          thumb: othis.attr('src')
        });
      });
    };
    
    pushData();
    
    if (data.length === 0) return;
    
    loop || parent.on('click', options.img, function(){
      pushData();
      var othis = $(this), index = othis.attr('layer-index'); 
      layer.photos($.extend(options, {
        photos: {
          start: index,
          data: data,
          tab: options.tab
        },
        full: options.full
      }), true);
    });
    
    //不直接弹出
    if(!loop) return;
    
  } else if (data.length === 0){
    return layer.msg('&#x6CA1;&#x6709;&#x56FE;&#x7247;');
  }
  
  //上一张
  dict.imgprev = function(key){
    dict.imgIndex--;
    if(dict.imgIndex < 1){
      dict.imgIndex = data.length;
    }
    dict.tabimg(key);
  };
  
  //下一张
  dict.imgnext = function(key,errorMsg){
    dict.imgIndex++;
    if(dict.imgIndex > data.length){
      dict.imgIndex = 1;
      if (errorMsg) {return};
    }
    dict.tabimg(key)
  };
  
  //方向键
  dict.keyup = function(event){
    if(!dict.end){
      var code = event.keyCode;
      event.preventDefault();
      if(code === 37){
        dict.imgprev(true);
      } else if(code === 39) {
        dict.imgnext(true);
      } else if(code === 27) {
        layer.close(dict.index);
      }
    }
  }
  
  //切换
  dict.tabimg = function(key){
    if(data.length <= 1) return;
    photos.start = dict.imgIndex - 1;
    layer.close(dict.index);
    return layer.photos(options, true, key);
    setTimeout(function(){
      layer.photos(options, true, key);
    }, 200);
  }
  
  //一些动作
  dict.event = function(){
    /*
    dict.bigimg.hover(function(){
      dict.imgsee.show();
    }, function(){
      dict.imgsee.hide();
    });
    */
    
    dict.bigimg.find('.layui-layer-imgprev').on('click', function(event){
      event.preventDefault();
      dict.imgprev(true);
    });  
    
    dict.bigimg.find('.layui-layer-imgnext').on('click', function(event){     
      event.preventDefault();
      dict.imgnext(true);
    });
    
    $(document).on('keyup', dict.keyup);
  };
  
  //图片预加载
  function loadImage(url, callback, error) {   
    var img = new Image();
    img.src = url; 
    if(img.complete){
      return callback(img);
    }
    img.onload = function(){
      img.onload = null;
      callback(img);
    };
    img.onerror = function(e){
      img.onerror = null;
      error(e);
    };  
  };
  
  dict.loadi = layer.load(1, {
    shade: 'shade' in options ? false : 0.9,
    scrollbar: false
  });

  loadImage(data[start].src, function(img){
    layer.close(dict.loadi);
    
    //切换图片时不出现动画
    if(key) options.anim = -1;
    
    //弹出图片层
    dict.index = layer.open($.extend({
      type: 1,
      id: 'layui-layer-photos',
      area: function(){
        var imgarea = [img.width, img.height];
        var winarea = [$(window).width() - 100, $(window).height() - 100];
        
        //如果 实际图片的宽或者高比 屏幕大（那么进行缩放）
        if(!options.full && (imgarea[0]>winarea[0]||imgarea[1]>winarea[1])){
          var wh = [imgarea[0]/winarea[0],imgarea[1]/winarea[1]];//取宽度缩放比例、高度缩放比例
          if(wh[0] > wh[1]){//取缩放比例最大的进行缩放
            imgarea[0] = imgarea[0]/wh[0];
            imgarea[1] = imgarea[1]/wh[0];
          } else if(wh[0] < wh[1]){
            imgarea[0] = imgarea[0]/wh[1];
            imgarea[1] = imgarea[1]/wh[1];
          }
        }
        
        return [imgarea[0]+'px', imgarea[1]+'px']; 
      }(),
      title: false,
      shade: 0.9,
      shadeClose: true,
      closeBtn: false,
      move: '.layui-layer-phimg img',
      moveType: 1,
      scrollbar: false,
      moveOut: true,
      anim: 5,
      isOutAnim: false,
      skin: 'layui-layer-photos' + skin('photos'),
      content: '<div class="layui-layer-phimg">'
        +'<img src="'+ data[start].src +'" alt="'+ (data[start].alt||'') +'" layer-pid="'+ data[start].pid +'">'
        +function(){
          if(data.length > 1){
            return '<div class="layui-layer-imgsee">'
              +'<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>'
              +'<div class="layui-layer-imgbar" style="display:'+ (key ? 'block' : '') +'"><span class="layui-layer-imgtit"><a href="javascript:;">'+ (data[start].alt || '') +'</a><em>'+ dict.imgIndex +' / '+ data.length +'</em></span></div>'
            +'</div>'
          }
          return '';
        }()
      +'</div>',
      success: function(layero, index){
        dict.bigimg = layero.find('.layui-layer-phimg');
        dict.imgsee = layero.find('.layui-layer-imgbar');
        dict.event(layero);
        options.tab && options.tab(data[start], layero);
        typeof success === 'function' && success(layero);
      }, end: function(){
        dict.end = true;
        $(document).off('keyup', dict.keyup);
      }
    }, options));
  }, function(){
    layer.close(dict.loadi);
    layer.msg('&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;', {
      time: 30000, 
      btn: ['&#x4E0B;&#x4E00;&#x5F20;', '&#x4E0D;&#x770B;&#x4E86;'], 
      yes: function(){
        data.length > 1 && dict.imgnext(true,true);
      }
    });
  });
};

//主入口
ready.run = function(_$){
  $ = _$;
  win = $(window);
  doms.html = $('html');
  layer.open = function(deliver){
    var o = new Class(deliver);
    return o.index;
  };
};

//加载方式
window.layui && layui.define ? (
  layer.ready()
  ,layui.define('jquery', function(exports){ //layui 加载
    layer.path = layui.cache.dir;
    ready.run(layui.$);

    //暴露模块
    window.layer = layer;
    exports('layer', layer);
  })
) : (
  (typeof define === 'function' && define.amd) ? define(['jquery'], function(){ //requirejs 加载
    ready.run(window.jQuery);
    return layer;
  }) : function(){ //普通 script 标签加载
    layer.ready();
    ready.run(window.jQuery);
  }()
);

}(window);



