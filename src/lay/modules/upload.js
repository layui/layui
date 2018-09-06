/**

 @Title: layui.upload 文件上传
 @Author: 贤心
 @License：MIT

 */
 
layui.define('layer' , function(exports){
  "use strict";
  
  var $ = layui.$
  ,layer = layui.layer
  ,hint = layui.hint()
  ,device = layui.device()

  //外部接口
  ,upload = {
    config: {} //全局配置项

    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件监听
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }
  
  //操作当前实例
  ,thisUpload = function(){
    var that = this;
    return {
      upload: function(files){
        that.upload.call(that, files);
      }
      ,config: that.config
    }
  }
  
  //字符常量
  ,MOD_NAME = 'upload', ELEM = '.layui-upload', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled'
  
  ,ELEM_FILE = 'layui-upload-file', ELEM_FORM = 'layui-upload-form', ELEM_IFRAME = 'layui-upload-iframe', ELEM_CHOOSE = 'layui-upload-choose', ELEM_DRAG = 'layui-upload-drag'
  
  
  //构造器
  ,Class = function(options){
    var that = this;
    that.config = $.extend({}, that.config, upload.config, options);
    that.render();
  };
  
  //默认配置
  Class.prototype.config = {
    accept: 'images' //允许上传的文件类型：images/file/video/audio
    ,exts: '' //允许上传的文件后缀名
    ,auto: true //是否选完文件后自动上传
    ,bindAction: '' //手动上传触发的元素
    ,url: '' //上传地址
    ,field: 'file' //文件字段名
    ,method: 'post' //请求上传的 http 类型
    ,data: {} //请求上传的额外参数
    ,drag: true //是否允许拖拽上传
    ,size: 0 //文件限制大小，默认不限制
    ,number: 0 //允许同时上传的文件数，默认不限制
    ,multiple: false //是否允许多文件上传，不支持ie8-9
  };
  
  //初始渲染
  Class.prototype.render = function(options){
    var that = this
    ,options = that.config;

    options.elem = $(options.elem);
    options.bindAction = $(options.bindAction);

    that.file();
    that.events();
  };
  
  //追加文件域
  Class.prototype.file = function(){
    var that = this
    ,options = that.config
    ,elemFile = that.elemFile = $([
      '<input class="'+ ELEM_FILE +'" type="file" accept="'+ options.acceptMime +'" name="'+ options.field +'"'
      ,(options.multiple ? ' multiple' : '') 
      ,'>'
    ].join(''))
    ,next = options.elem.next();
    
    if(next.hasClass(ELEM_FILE) || next.hasClass(ELEM_FORM)){
      next.remove();
    }
    
    //包裹ie8/9容器
    if(device.ie && device.ie < 10){
      options.elem.wrap('<div class="layui-upload-wrap"></div>');
    }
    
    that.isFile() ? (
      that.elemFile = options.elem
      ,options.field = options.elem[0].name
    ) : options.elem.after(elemFile);
    
    //初始化ie8/9的Form域
    if(device.ie && device.ie < 10){
      that.initIE();
    }
  };
  
  //ie8-9初始化
  Class.prototype.initIE = function(){
    var that = this
    ,options = that.config
    ,iframe = $('<iframe id="'+ ELEM_IFRAME +'" class="'+ ELEM_IFRAME +'" name="'+ ELEM_IFRAME +'" frameborder="0"></iframe>')
    ,elemForm = $(['<form target="'+ ELEM_IFRAME +'" class="'+ ELEM_FORM +'" method="post" key="set-mine" enctype="multipart/form-data" action="'+ options.url +'">'
    ,'</form>'].join(''));
    
    //插入iframe    
    $('#'+ ELEM_IFRAME)[0] || $('body').append(iframe);

    //包裹文件域
    if(!options.elem.next().hasClass(ELEM_FORM)){
      that.elemFile.wrap(elemForm);      
      
      //追加额外的参数
      options.elem.next('.'+ ELEM_FORM).append(function(){
        var arr = [];
        layui.each(options.data, function(key, value){
          value = typeof value === 'function' ? value() : value;
          arr.push('<input type="hidden" name="'+ key +'" value="'+ value +'">')
        });
        return arr.join('');
      }());
    }
  };
  
  //异常提示
  Class.prototype.msg = function(content){
    return layer.msg(content, {
      icon: 2
      ,shift: 6
    });
  };
  
  //判断绑定元素是否为文件域本身
  Class.prototype.isFile = function(){
    var elem = this.config.elem[0];
    if(!elem) return;
    return elem.tagName.toLocaleLowerCase() === 'input' && elem.type === 'file'
  }
  
  //预读图片信息
  Class.prototype.preview = function(callback){
    var that = this;
    if(window.FileReader){
      layui.each(that.chooseFiles, function(index, file){
        var reader = new FileReader();
        reader.readAsDataURL(file);  
        reader.onload = function(){
          callback && callback(index, file, this.result);
        }
      });
    }
  };
  
  //执行上传
  Class.prototype.upload = function(files, type){
    var that = this
    ,options = that.config
    ,elemFile = that.elemFile[0]
    
    //高级浏览器处理方式，支持跨域
    ,ajaxSend = function(){
      var successful = 0, aborted = 0
      ,items = files || that.files || that.chooseFiles || elemFile.files
      ,allDone = function(){ //多文件全部上传完毕的回调
        if(options.multiple && successful + aborted === that.fileLength){
          typeof options.allDone === 'function' && options.allDone({
            total: that.fileLength
            ,successful: successful
            ,aborted: aborted
          });
        }
      };
      layui.each(items, function(index, file){
        var formData = new FormData();
        
        formData.append(options.field, file);
        
        //追加额外的参数
        layui.each(options.data, function(key, value){
          value = typeof value === 'function' ? value() : value;
          formData.append(key, value);
        });
        
        //提交文件
        $.ajax({
          url: options.url
          ,type: 'post'
          ,data: formData
          ,contentType: false 
          ,processData: false
          ,dataType: 'json'
          ,headers: options.headers || {}
          ,success: function(res){
            successful++;
            done(index, res);
            allDone();
          }
          ,error: function(){
            aborted++;
            that.msg('请求上传接口出现异常');
            error(index);
            allDone();
          }
        });
      });
    }
    
    //低版本IE处理方式，不支持跨域
    ,iframeSend = function(){
      var iframe = $('#'+ ELEM_IFRAME);
    
      that.elemFile.parent().submit();

      //获取响应信息
      clearInterval(Class.timer);
      Class.timer = setInterval(function() {
        var res, iframeBody = iframe.contents().find('body');
        try {
          res = iframeBody.text();
        } catch(e) {
          that.msg('获取上传后的响应信息出现异常');
          clearInterval(Class.timer);
          error();
        }
        if(res){
          clearInterval(Class.timer);
          iframeBody.html('');
          done(0, res);
        }
      }, 30); 
    }
    
    //统一回调
    ,done = function(index, res){
      that.elemFile.next('.'+ ELEM_CHOOSE).remove();
      elemFile.value = '';
      if(typeof res !== 'object'){
        try {
          res = JSON.parse(res);
        } catch(e){
          res = {};
          return that.msg('请对上传接口返回有效JSON');
        }
      }
      typeof options.done === 'function' && options.done(res, index || 0, function(files){
        that.upload(files);
      });
    }
    
    //统一网络异常回调
    ,error = function(index){
      if(options.auto){
        elemFile.value = '';
      }
      typeof options.error === 'function' && options.error(index || 0, function(files){
        that.upload(files);
      });
    }
    
    ,exts = options.exts
    ,check ,value = function(){
      var arr = [];
      layui.each(files || that.chooseFiles, function(i, item){
        arr.push(item.name);
      });
      return arr;
    }()
    
    //回调返回的参数
    ,args = {
      //预览
      preview: function(callback){
        that.preview(callback);
      }
      //上传
      ,upload: function(index, file){
        var thisFile = {};
        thisFile[index] = file;
        that.upload(thisFile);
      }
      //追加文件到队列
      ,pushFile: function(){
        that.files = that.files || {};
        layui.each(that.chooseFiles, function(index, item){
          that.files[index] = item;
        });
        return that.files;
      }
      //重置文件
      ,resetFile: function(index, file, filename){
        var newFile = new File([file], filename);
        that.files = that.files || {};
        that.files[index] = newFile;
      }
    }
    
    //提交上传
    ,send = function(){      
      //选择文件的回调      
      if(type === 'choose' || options.auto){
        options.choose && options.choose(args);
        if(type === 'choose'){
          return;
        }
      }
      
      //上传前的回调
      options.before && options.before(args);

      //IE兼容处理
      if(device.ie){
        return device.ie > 9 ? ajaxSend() : iframeSend();
      }
      
      ajaxSend();
    }

    //校验文件格式
    value = value.length === 0 
      ? ((elemFile.value.match(/[^\/\\]+\..+/g)||[]) || '')
    : value;
    
    if(value.length === 0) return;

    switch(options.accept){
      case 'file': //一般文件
        if(exts && !RegExp('\\w\\.('+ exts +')$', 'i').test(escape(value))){
          that.msg('选择的文件中包含不支持的格式');
          return elemFile.value = '';
        }
      break;
      case 'video': //视频文件
        if(!RegExp('\\w\\.('+ (exts || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv') +')$', 'i').test(escape(value))){
          that.msg('选择的视频中包含不支持的格式');
          return elemFile.value = '';
        }
      break;
      case 'audio': //音频文件
        if(!RegExp('\\w\\.('+ (exts || 'mp3|wav|mid') +')$', 'i').test(escape(value))){
          that.msg('选择的音频中包含不支持的格式');
          return elemFile.value = '';
        }
      break;
      default: //图片文件
        layui.each(value, function(i, item){
          if(!RegExp('\\w\\.('+ (exts || 'jpg|png|gif|bmp|jpeg$') +')', 'i').test(escape(item))){
            check = true;
          }
        });
        if(check){
          that.msg('选择的图片中包含不支持的格式');
          return elemFile.value = '';
        }
      break;
    }
    
    //检验文件数量
    that.fileLength = function(){
      var length = 0
      ,items = files || that.files || that.chooseFiles || elemFile.files;
      layui.each(items, function(){
        length++;
      });
      return length;
    }();
    if(options.number && that.fileLength > options.number){
      return that.msg('同时最多只能上传的数量为：'+ options.number);
    }
    
    //检验文件大小
    if(options.size > 0 && !(device.ie && device.ie < 10)){
      var limitSize;
      
      layui.each(that.chooseFiles, function(index, file){
        if(file.size > 1024*options.size){
          var size = options.size/1024;
          size = size >= 1 ? (size.toFixed(2) + 'MB') : options.size + 'KB'
          elemFile.value = '';
          limitSize = size;
        }
      });
      if(limitSize) return that.msg('文件不能超过'+ limitSize);
    }
    send();
  };
  
  //事件处理
  Class.prototype.events = function(){
    var that = this
    ,options = that.config
    
    //设置当前选择的文件队列
    ,setChooseFile = function(files){
      that.chooseFiles = {};
      layui.each(files, function(i, item){
        var time = new Date().getTime();
        that.chooseFiles[time + '-' + i] = item;
      });
    }
    
    //设置选择的文本
    ,setChooseText = function(files, filename){
      var elemFile = that.elemFile
      ,value = files.length > 1 
        ? files.length + '个文件' 
      : ((files[0] || {}).name || (elemFile[0].value.match(/[^\/\\]+\..+/g)||[]) || '');
      
      if(elemFile.next().hasClass(ELEM_CHOOSE)){
        elemFile.next().remove();
      }
      that.upload(null, 'choose');
      if(that.isFile() || options.choose) return;
      elemFile.after('<span class="layui-inline '+ ELEM_CHOOSE +'">'+ value +'</span>');
    };

    //点击上传容器
    options.elem.off('upload.start').on('upload.start', function(){
      var othis = $(this), data = othis.attr('lay-data');
      
      if(data){
        try{
          data = new Function('return '+ data)();
          that.config = $.extend({}, options, data);
        } catch(e){
          hint.error('Upload element property lay-data configuration item has a syntax error: ' + data)
        }
      }
      
      that.config.item = othis;
      that.elemFile[0].click();
    });
    
    //拖拽上传
    if(!(device.ie && device.ie < 10)){
      options.elem.off('upload.over').on('upload.over', function(){
        var othis = $(this)
        othis.attr('lay-over', '');
      })
      .off('upload.leave').on('upload.leave', function(){
        var othis = $(this)
        othis.removeAttr('lay-over');
      })
      .off('upload.drop').on('upload.drop', function(e, param){
        var othis = $(this), files = param.originalEvent.dataTransfer.files || [];
        
        othis.removeAttr('lay-over');
        setChooseFile(files);
        
        if(options.auto){
          that.upload(files);
        } else {
          setChooseText(files);
        }
      });
    }
    
    //文件选择
    that.elemFile.off('upload.change').on('upload.change', function(){
      var files = this.files || [];
      setChooseFile(files);
      options.auto ? that.upload() : setChooseText(files); //是否自动触发上传
    });
    
    //手动触发上传
    options.bindAction.off('upload.action').on('upload.action', function(){
      that.upload();
    });
    
    //防止事件重复绑定
    if(options.elem.data('haveEvents')) return;
    
    that.elemFile.on('change', function(){
      $(this).trigger('upload.change');
    });
    
    options.elem.on('click', function(){
      if(that.isFile()) return;
      $(this).trigger('upload.start');
    });
    
    if(options.drag){
      options.elem.on('dragover', function(e){
        e.preventDefault();
        $(this).trigger('upload.over');
      }).on('dragleave', function(e){
        $(this).trigger('upload.leave');
      }).on('drop', function(e){
        e.preventDefault();
        $(this).trigger('upload.drop', e);
      });
    }
    
    options.bindAction.on('click', function(){
      $(this).trigger('upload.action');
    });
    
    options.elem.data('haveEvents', true);
  };
  
  //核心入口  
  upload.render = function(options){
    var inst = new Class(options);
    return thisUpload.call(inst);
  };
  
  exports(MOD_NAME, upload);
});

