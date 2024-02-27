/**
 * flow 流加载组件
 */


layui.define('jquery', function(exports){
  "use strict";

  var $ = layui.$, Flow = function(options){}
  ,ELEM_MORE = 'layui-flow-more'
  ,ELEM_LOAD = '<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon ">&#xe63e;</i>';

  //主方法
  Flow.prototype.load = function(options){
    var that = this, page = 0, lock, isOver, lazyimg, timer;
    options = options || {};

    var elem = $(options.elem); if(!elem[0]) return;
    var scrollElem = $(options.scrollElem || document); // 滚动条所在元素
    var threshold = 'mb' in options ? options.mb : 50; // 临界距离
    var isAuto = 'isAuto' in options ? options.isAuto : true; // 否自动滚动加载
    var end = options.end || '没有更多了'; // “末页”显示文案
    var direction = options.direction || 'bottom';
    var isTop = direction === 'top';

    //滚动条所在元素是否为document
    var notDocument = options.scrollElem && options.scrollElem !== document;

    //加载更多
    var ELEM_TEXT = '<cite>加载更多</cite>'
    ,more = $('<div class="layui-flow-more"><a href="javascript:;">'+ ELEM_TEXT +'</a></div>');

    if(!elem.find('.layui-flow-more')[0]){
      elem[isTop ? 'prepend' : 'append'](more);
    }

    //加载下一个元素
    var next = function(html, over){
      var scrollHeightStart = notDocument ? scrollElem.prop('scrollHeight') : document.documentElement.scrollHeight;
      var scrollTopStart = scrollElem.scrollTop();
      html = $(html);
      more[isTop ? 'after' : 'before'](html);
      over = over == 0 ? true : null;
      over ? more.html(end) : more.find('a').html(ELEM_TEXT);
      isOver = over;
      lock = null;
      lazyimg && lazyimg();
      if(isTop){
        var scrollHeightEnd = notDocument ? scrollElem.prop('scrollHeight') : document.documentElement.scrollHeight;
        if(page === 1){
          // 首次渲染后滑动到底部
          scrollElem.scrollTop(scrollHeightEnd);
        }else if(page > 1){
          var nextElementHeight = scrollHeightEnd - scrollHeightStart;
          scrollElem.scrollTop(scrollTopStart + nextElementHeight);
        }
      }
    };

    //触发请求
    var done = function(){
      lock = true;
      more.find('a').html(ELEM_LOAD);
      typeof options.done === 'function' && options.done(++page, next);
    };

    done();

    //不自动滚动加载
    more.find('a').on('click', function(){
      var othis = $(this);
      if(isOver) return;
      lock || done();
    });

    //如果允许图片懒加载
    if(options.isLazyimg){
      lazyimg = that.lazyimg({
        elem: options.elem + ' img'
        ,scrollElem: options.scrollElem
        ,direction: options.direction
      });
    }

    if(!isAuto) return that;

    scrollElem.on('scroll', function(){
      var othis = $(this), top = othis.scrollTop();

      if(timer) clearTimeout(timer);
      if(isOver || !elem.width()) return; //如果已经结束，或者元素处于隐藏状态，则不执行滚动加载

      timer = setTimeout(function(){
        //计算滚动所在容器的可视高度
        var height = notDocument ? othis.height() : $(window).height();

        //计算滚动所在容器的实际高度
        var scrollHeight = notDocument
          ? othis.prop('scrollHeight')
        : document.documentElement.scrollHeight;

        //临界点
        if(!isTop ? scrollHeight - top - height <= threshold : top <= threshold){
          lock || done();
        }
      }, 100);
    });

    return that;
  };

  //图片懒加载
  Flow.prototype.lazyimg = function(options){
    var that = this, index = 0, haveScroll;
    options = options || {};

    var scrollElem = $(options.scrollElem || document); //滚动条所在元素
    var elem = options.elem || 'img';
    var direction = options.direction || 'bottom';
    var isTop = direction === 'top';

    //滚动条所在元素是否为document
    var notDocument = options.scrollElem && options.scrollElem !== document;

    //显示图片
    var show = function(item, height){
      var start = scrollElem.scrollTop(), end = start + height;
      var elemTop = notDocument ? function(){
        return item.offset().top - scrollElem.offset().top + start;
      }() : item.offset().top;

      /* 始终只加载在当前屏范围内的图片 */
      if((isTop ? elemTop + item.height() : elemTop) >= start && elemTop <= end){
        if(item.attr('lay-src')){
          var src = item.attr('lay-src');
          layui.img(src, function(){
            var next = that.lazyimg.elem.eq(index);
            item.attr('src', src).removeAttr('lay-src');

            /* 当前图片加载就绪后，检测下一个图片是否在当前屏 */
            next[0] && render(next);
            index++;
          }, function(){
            var next = that.lazyimg.elem.eq(index);
            item.removeAttr('lay-src');
          });
        }
      }
    }, render = function(othis, scroll){

      //计算滚动所在容器的可视高度
      var height = notDocument ? (scroll||scrollElem).height() : $(window).height();
      var start = scrollElem.scrollTop(), end = start + height;

      that.lazyimg.elem = $(elem);

      if(othis){
        show(othis, height);
      } else {
        //计算未加载过的图片
        for(var i = 0; i < that.lazyimg.elem.length; i++){
          var item = that.lazyimg.elem.eq(i), elemTop = notDocument ? function(){
            return item.offset().top - scrollElem.offset().top + start;
          }() : item.offset().top;

          show(item, height);
          index = i;

          //如果图片的top坐标，超出了当前屏，则终止后续图片的遍历
          if(elemTop > end) break;
        }
      }
    };

    render();

    if(!haveScroll){
      var timer;
      scrollElem.on('scroll', function(){
        var othis = $(this);
        if(timer) clearTimeout(timer)
        timer = setTimeout(function(){
          render(null, othis);
        }, 50);
      });
      haveScroll = true;
    }
    return render;
  };

  //暴露接口
  exports('flow', new Flow());
});
