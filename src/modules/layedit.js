/**
 * layedit 富文本编辑器
 */
 
layui.define(['layer', 'form'], function(exports){
  "use strict";
  
  var $ = layui.$
  ,layer = layui.layer
  ,form = layui.form
  ,hint = layui.hint()
  ,device = layui.device()
  
  ,MOD_NAME = 'layedit', THIS = 'layui-this', SHOW = 'layui-show', ABLED = 'layui-disabled'
  
  ,Edit = function(){
    var that = this;
    that.index = 0;
    
    //全局配置
    that.config = {
      //默认工具bar
      tool: [
        'strong', 'italic', 'underline', 'del'
        ,'|'
        ,'left', 'center', 'right'
        ,'|'
        ,'link', 'unlink'
      ]
      ,hideTool: []
      ,height: 280 //默认高
    };
  };
  
  //全局设置
  Edit.prototype.set = function(options){
    var that = this;
    $.extend(true, that.config, options);
    return that;
  };
  
  //事件
  Edit.prototype.on = function(events, callback){
    return layui.onevent(MOD_NAME, events, callback);
  };
  
  //建立编辑器
  Edit.prototype.build = function(id, settings){
    settings = settings || {};
    
    var that = this
    ,config = that.config
    ,ELEM = 'layui-layedit', textArea = $(typeof(id)=='string'?'#'+id:id)
    ,name =  'LAY_layedit_'+ (++that.index)
    ,haveBuild = textArea.next('.'+ELEM)
    
    ,set = $.extend({}, config, settings)
    
    ,tool = function(){
      var node = [], hideTools = {};
      layui.each(set.hideTool, function(_, item){
        hideTools[item] = true;
      });
      layui.each(set.tool, function(_, item){
        if(tools[item] && !hideTools[item]){
          node.push(tools[item]);
        }
      });
      return node.join('');
    }()
 
    
    ,editor = $(['<div class="'+ ELEM +'">'
      ,'<div class="layui-unselect layui-layedit-tool">'+ tool +'</div>'
      ,'<div class="layui-layedit-iframe">'
        ,'<iframe id="'+ name +'" name="'+ name +'" textarea="'+ id +'" frameborder="0"></iframe>'
      ,'</div>'
    ,'</div>'].join(''))
    
    //编辑器不兼容ie8以下
    if(device.ie && device.ie < 8){
      return textArea.removeClass('layui-hide').addClass(SHOW);
    }

    haveBuild[0] && (haveBuild.remove());

    setIframe.call(that, editor, textArea[0], set)
    textArea.addClass('layui-hide').after(editor);

    return that.index;
  };
  
  //获得编辑器中内容
  Edit.prototype.getContent = function(index){
    var iframeWin = getWin(index);
    if(!iframeWin[0]) return;
    return toLower(iframeWin[0].document.body.innerHTML);
  };
  
  //获得编辑器中纯文本内容
  Edit.prototype.getText = function(index){
    var iframeWin = getWin(index);
    if(!iframeWin[0]) return;
    return $(iframeWin[0].document.body).text();
  };
  /**
   * 设置编辑器内容
   * @param {[type]} index   编辑器索引
   * @param {[type]} content 要设置的内容
   * @param {[type]} flag    是否追加模式
   */
  Edit.prototype.setContent = function(index, content, flag){
    var iframeWin = getWin(index);
    if(!iframeWin[0]) return;
    if(flag){
      $(iframeWin[0].document.body).append(content)
    }else{
      $(iframeWin[0].document.body).html(content)
    };
    layedit.sync(index)
  };
  //将编辑器内容同步到textarea（一般用于异步提交时）
  Edit.prototype.sync = function(index){
    var iframeWin = getWin(index);
    if(!iframeWin[0]) return;
    var textarea = $('#'+iframeWin[1].attr('textarea'));
    textarea.val(toLower(iframeWin[0].document.body.innerHTML));
  };
  
  //获取编辑器选中内容
  Edit.prototype.getSelection = function(index){
    var iframeWin = getWin(index);
    if(!iframeWin[0]) return;
    var range = Range(iframeWin[0].document);
    return document.selection ? range.text : range.toString();
  };

  //iframe初始化
  var setIframe = function(editor, textArea, set){
    var that = this, iframe = editor.find('iframe');

    iframe.css({
      height: set.height
    }).on('load', function(){
      var conts = iframe.contents()
      ,iframeWin = iframe.prop('contentWindow')
      ,head = conts.find('head')
      ,style = $(['<style>'
        ,'*{margin: 0; padding: 0;}'
        ,'body{padding: 10px; line-height: 20px; overflow-x: hidden; word-wrap: break-word; font: 14px Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma,Arial,sans-serif; -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;}'
        ,'a{color:#01AAED; text-decoration:none;}a:hover{color:#c00}'
        ,'p{margin-bottom: 10px;}'
        ,'img{display: inline-block; border: none; vertical-align: middle;}'
        ,'pre{margin: 10px 0; padding: 10px; line-height: 20px; border: 1px solid #ddd; border-left-width: 6px; background-color: #F2F2F2; color: #333; font-family: Courier New; font-size: 12px;}'
      ,'</style>'].join(''))
      ,body = conts.find('body');
      
      head.append(style);
      body.attr('contenteditable', 'true').css({
        'min-height': set.height
      }).html(textArea.value||'');

      hotkey.apply(that, [iframeWin, iframe, textArea, set]); //快捷键处理
      toolActive.call(that, iframeWin, editor, set); //触发工具

    });
  }
  
  //获得iframe窗口对象
  ,getWin = function(index){
    var iframe = $('#LAY_layedit_'+ index)
    ,iframeWin = iframe.prop('contentWindow');
    return [iframeWin, iframe];
  }
  
  //IE8下将标签处理成小写
  ,toLower = function(html){
    if(device.ie == 8){
      html = html.replace(/<.+>/g, function(str){
        return str.toLowerCase();
      });
    }
    return html;
  }
  
  //快捷键处理
  ,hotkey = function(iframeWin, iframe, textArea, set){
    var iframeDOM = iframeWin.document, body = $(iframeDOM.body);
    body.on('keydown', function(e){
      var keycode = e.keyCode;
      //处理回车
      if(keycode === 13){
        var range = Range(iframeDOM);
        var container = getContainer(range)
        ,parentNode = container.parentNode;
        
        if(parentNode.tagName.toLowerCase() === 'pre'){
          if(e.shiftKey) return
          layer.msg('请暂时用shift+enter');
          return false;
        }
        iframeDOM.execCommand('formatBlock', false, '<p>');
      }
    });
    
    //给textarea同步内容
    $(textArea).parents('form').on('submit', function(){
      var html = body.html();
      //IE8下将标签处理成小写
      if(device.ie == 8){
        html = html.replace(/<.+>/g, function(str){
          return str.toLowerCase();
        });
      }
      textArea.value = html;
    });
    
    //处理粘贴
    body.on('paste', function(e){
      iframeDOM.execCommand('formatBlock', false, '<p>');
      setTimeout(function(){
        filter.call(iframeWin, body);
        textArea.value = body.html();
      }, 100); 
    });
  }
  
  //标签过滤
  ,filter = function(body){
    var iframeWin = this
    ,iframeDOM = iframeWin.document;
    
    //清除影响版面的css属性
    body.find('*[style]').each(function(){
      var textAlign = this.style.textAlign;
      this.removeAttribute('style');
      $(this).css({
        'text-align': textAlign || ''
      })
    });
    
    //修饰表格
    body.find('table').addClass('layui-table');
    
    //移除不安全的标签
    body.find('script,link').remove();
  }
  
  //Range对象兼容性处理
  ,Range = function(iframeDOM){
    return iframeDOM.selection 
      ? iframeDOM.selection.createRange()
    : iframeDOM.getSelection().getRangeAt(0);
  }
  
  //当前Range对象的endContainer兼容性处理
  ,getContainer = function(range){
    return range.endContainer || range.parentElement().childNodes[0]
  }
  
  //在选区插入内联元素
  ,insertInline = function(tagName, attr, range){
    var iframeDOM = this.document
    ,elem = document.createElement(tagName)
    for(var key in attr){
      elem.setAttribute(key, attr[key]);
    }
    elem.removeAttribute('text');

    if(iframeDOM.selection){ //IE
      var text = range.text || attr.text;
      if(tagName === 'a' && !text) return;
      if(text){
        elem.innerHTML = text;
      }
      range.pasteHTML($(elem).prop('outerHTML')); 
      range.select();
    } else { //非IE
      var text = range.toString() || attr.text;
      if(tagName === 'a' && !text) return;
      if(text){
        elem.innerHTML = text;
      }
      range.deleteContents();
      range.insertNode(elem);
    }
  }
  
  //工具选中
  ,toolCheck = function(tools, othis){
    var iframeDOM = this.document
    ,CHECK = 'layedit-tool-active'
    ,container = getContainer(Range(iframeDOM))
    ,item = function(type){
      return tools.find('.layedit-tool-'+type)
    }

    if(othis){
      othis[othis.hasClass(CHECK) ? 'removeClass' : 'addClass'](CHECK);
    }
    
    tools.find('>i').removeClass(CHECK);
    item('unlink').addClass(ABLED);

    $(container).parents().each(function(){
      var tagName = this.tagName.toLowerCase()
      ,textAlign = this.style.textAlign;

      //文字
      if(tagName === 'b' || tagName === 'strong'){
        item('b').addClass(CHECK)
      }
      if(tagName === 'i' || tagName === 'em'){
        item('i').addClass(CHECK)
      }
      if(tagName === 'u'){
        item('u').addClass(CHECK)
      }
      if(tagName === 'strike'){
        item('d').addClass(CHECK)
      }
      
      //对齐
      if(tagName === 'p'){
        if(textAlign === 'center'){
          item('center').addClass(CHECK);
        } else if(textAlign === 'right'){
          item('right').addClass(CHECK);
        } else {
          item('left').addClass(CHECK);
        }
      }
      
      //超链接
      if(tagName === 'a'){
        item('link').addClass(CHECK);
        item('unlink').removeClass(ABLED);
      }
    });
  }

  //触发工具
  ,toolActive = function(iframeWin, editor, set){
    var iframeDOM = iframeWin.document
    ,body = $(iframeDOM.body)
    ,toolEvent = {
      //超链接
      link: function(range){
        var container = getContainer(range)
        ,parentNode = $(container).parent();
        
        link.call(body, {
          href: parentNode.attr('href')
          ,target: parentNode.attr('target')
        }, function(field){
          var parent = parentNode[0];
          if(parent.tagName === 'A'){
            parent.href = field.url;
          } else {
            insertInline.call(iframeWin, 'a', {
              target: field.target
              ,href: field.url
              ,text: field.url
            }, range);
          }
        });
      }
      //清除超链接
      ,unlink: function(range){
        iframeDOM.execCommand('unlink');
      }
      //插入代码
      ,code: function(range){
        code.call(body, function(pre){
          insertInline.call(iframeWin, 'pre', {
            text: pre.code
            ,'lay-lang': pre.lang
          }, range);
        });
      }
      //帮助
      ,help: function(){
        layer.open({
          type: 2
          ,title: '帮助'
          ,area: ['600px', '380px']
          ,shadeClose: true
          ,shade: 0.1
          ,skin: 'layui-layer-msg'
          ,content: ['', 'no']
        });
      }
    }
    ,tools = editor.find('.layui-layedit-tool')
    
    ,click = function(){
      var othis = $(this)
      ,events = othis.attr('layedit-event')
      ,command = othis.attr('lay-command');
      
      if(othis.hasClass(ABLED)) return;

      body.focus();
      
      var range = Range(iframeDOM)
      ,container = range.commonAncestorContainer
      
      if(command){
        iframeDOM.execCommand(command);
        if(/justifyLeft|justifyCenter|justifyRight/.test(command)){
          iframeDOM.execCommand('formatBlock', false, '<p>');
        }
        setTimeout(function(){
          body.focus();
        }, 10);
      } else {
        toolEvent[events] && toolEvent[events].call(this, range);
      }
      toolCheck.call(iframeWin, tools, othis);
    }
    
    ,isClick = /image/

    tools.find('>i').on('mousedown', function(){
      var othis = $(this)
      ,events = othis.attr('layedit-event');
      if(isClick.test(events)) return;
      click.call(this)
    }).on('click', function(){
      var othis = $(this)
      ,events = othis.attr('layedit-event');
      if(!isClick.test(events)) return;
      click.call(this)
    });
    
    //触发内容区域
    body.on('click', function(){
      toolCheck.call(iframeWin, tools);
    });
  }
  
  //超链接面板
  ,link = function(options, callback){
    var body = this, index = layer.open({
      type: 1
      ,id: 'LAY_layedit_link'
      ,area: '350px'
      ,shade: 0.05
      ,shadeClose: true
      ,moveType: 1
      ,title: '超链接'
      ,skin: 'layui-layer-msg'
      ,content: ['<ul class="layui-form" style="margin: 15px;">'
        ,'<li class="layui-form-item">'
          ,'<label class="layui-form-label" style="width: 60px;">URL</label>'
          ,'<div class="layui-input-block" style="margin-left: 90px">'
            ,'<input name="url" lay-verify="url" value="'+ (options.href||'') +'" autofocus="true" autocomplete="off" class="layui-input">'
            ,'</div>'
        ,'</li>'
        ,'<li class="layui-form-item">'
          ,'<label class="layui-form-label" style="width: 60px;">打开方式</label>'
          ,'<div class="layui-input-block" style="margin-left: 90px">'
            ,'<input type="radio" name="target" value="_self" class="layui-input" title="当前窗口"'
            + ((options.target==='_self' || !options.target) ? 'checked' : '') +'>'
            ,'<input type="radio" name="target" value="_blank" class="layui-input" title="新窗口" '
            + (options.target==='_blank' ? 'checked' : '') +'>'
          ,'</div>'
        ,'</li>'
        ,'<li class="layui-form-item" style="text-align: center;">'
          ,'<button type="button" lay-submit lay-filter="layedit-link-yes" class="layui-btn"> 确定 </button>'
          ,'<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
        ,'</li>'
      ,'</ul>'].join('')
      ,success: function(layero, index){
        var eventFilter = 'submit(layedit-link-yes)';
        form.render('radio');  
        layero.find('.layui-btn-primary').on('click', function(){
          layer.close(index);
          body.focus();
        });
        form.on(eventFilter, function(data){
          layer.close(link.index);
          callback && callback(data.field);
        });
      }
    });
    link.index = index;
  }
  
  //插入代码面板
  ,code = function(callback){
    var body = this, index = layer.open({
      type: 1
      ,id: 'LAY_layedit_code'
      ,area: '550px'
      ,shade: 0.05
      ,shadeClose: true
      ,moveType: 1
      ,title: '插入代码'
      ,skin: 'layui-layer-msg'
      ,content: ['<ul class="layui-form layui-form-pane" style="margin: 15px;">'
        ,'<li class="layui-form-item">'
          ,'<label class="layui-form-label">请选择语言</label>'
          ,'<div class="layui-input-block">'
            ,'<select name="lang">'
              ,'<option value="JavaScript">JavaScript</option>'
              ,'<option value="HTML">HTML</option>'
              ,'<option value="CSS">CSS</option>'
              ,'<option value="Java">Java</option>'
              ,'<option value="PHP">PHP</option>'
              ,'<option value="C#">C#</option>'
              ,'<option value="Python">Python</option>'
              ,'<option value="Ruby">Ruby</option>'
              ,'<option value="Go">Go</option>'
            ,'</select>'
          ,'</div>'
        ,'</li>'
        ,'<li class="layui-form-item layui-form-text">'
          ,'<label class="layui-form-label">代码</label>'
          ,'<div class="layui-input-block">'
            ,'<textarea name="code" lay-verify="required" autofocus="true" class="layui-textarea" style="height: 200px;"></textarea>'
          ,'</div>'
        ,'</li>'
        ,'<li class="layui-form-item" style="text-align: center;">'
          ,'<button type="button" lay-submit lay-filter="layedit-code-yes" class="layui-btn"> 确定 </button>'
          ,'<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
        ,'</li>'
      ,'</ul>'].join('')
      ,success: function(layero, index){
        var eventFilter = 'submit(layedit-code-yes)';
        form.render('select');  
        layero.find('.layui-btn-primary').on('click', function(){
          layer.close(index);
          body.focus();
        });
        form.on(eventFilter, function(data){
          layer.close(code.index);
          callback && callback(data.field);
        });
      }
    });
    code.index = index;
  }
  
  //全部工具
  ,tools = {
    html: '<i class="layui-icon layedit-tool-html" title="HTML源代码" lay-command="html" layedit-event="html"">&#xe64b;</i><span class="layedit-tool-mid"></span>'
    ,strong: '<i class="layui-icon layedit-tool-b" title="加粗" lay-command="Bold" layedit-event="b"">&#xe62b;</i>'
    ,italic: '<i class="layui-icon layedit-tool-i" title="斜体" lay-command="italic" layedit-event="i"">&#xe644;</i>'
    ,underline: '<i class="layui-icon layedit-tool-u" title="下划线" lay-command="underline" layedit-event="u"">&#xe646;</i>'
    ,del: '<i class="layui-icon layedit-tool-d" title="删除线" lay-command="strikeThrough" layedit-event="d"">&#xe64f;</i>'
    
    ,'|': '<span class="layedit-tool-mid"></span>'
    
    ,left: '<i class="layui-icon layedit-tool-left" title="左对齐" lay-command="justifyLeft" layedit-event="left"">&#xe649;</i>'
    ,center: '<i class="layui-icon layedit-tool-center" title="居中对齐" lay-command="justifyCenter" layedit-event="center"">&#xe647;</i>'
    ,right: '<i class="layui-icon layedit-tool-right" title="右对齐" lay-command="justifyRight" layedit-event="right"">&#xe648;</i>'
    ,link: '<i class="layui-icon layedit-tool-link" title="插入链接" layedit-event="link"">&#xe64c;</i>'
    ,unlink: '<i class="layui-icon layedit-tool-unlink layui-disabled" title="清除链接" lay-command="unlink" layedit-event="unlink"">&#xe64d;</i>'
    ,face: '<i class="layui-icon layedit-tool-face" title="表情" layedit-event="face"">&#xe650;</i>'
    ,image: '<i class="layui-icon layedit-tool-image" title="图片" layedit-event="image">&#xe64a;<input type="file" name="file"></i>'
    ,code: '<i class="layui-icon layedit-tool-code" title="插入代码" layedit-event="code">&#xe64e;</i>'
    
    ,help: '<i class="layui-icon layedit-tool-help" title="帮助" layedit-event="help">&#xe607;</i>'
  }
  
  ,edit = new Edit();

  exports(MOD_NAME, edit);
});
