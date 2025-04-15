<pre class="layui-code" lay-options="{preview: true, layout: ['preview'], codeStyle: 'max-height: 520px;', copy: false, tools: ['full'], addTools: null}">
  <textarea>
{{!
<style>
  .laytpl-demo{border: 1px solid #eee;}
  .laytpl-demo:first-child{border-right: none;}
  .laytpl-demo>textarea{position: relative; display: block; width:100%; height: 320px; padding: 11px; border: 0; box-sizing: border-box; resize: none; background-color: #fff; font-family: Courier New; font-size: 13px;}
  .laytpl-demo>div:first-child{height: 32px; line-height: 32px; padding: 6px 11px; border-bottom: 1px solid #eee; background-color: #F8F9FA;}
  .laytpl-demo .layui-tabs{top: -1px;}

  #ID-tpl-view-body {
    max-height: 320px; overflow: auto; clear: both;
  }
  #ID-tpl-view-body > div {
    display: none;
  }
  .laytpl-demo pre {
    margin: 0; padding: 16px; background-color: #1F1F1F; color: #F8F9FA; font-family: 'Courier New',Consolas, monospace;
  }
</style>
<div class="layui-row">
  <div class="layui-col-xs6 laytpl-demo">
    <div>
      <div style="cursor: pointer;" id="ID-tpl-src-title">
        <strong>模板（旧版本）</strong>
        <i class="layui-icon layui-icon-down layui-font-12"></i>
      </div>
    </div>
    &lt;textarea id="ID-tpl-src"&gt;&lt;/textarea>
  </div>
  <div class="layui-col-xs6 laytpl-demo">
    <div><strong>数据</strong></div>
    &lt;textarea id="ID-tpl-data"&gt;
{
  "title": "Layui 常用组件",
  "desc": "<a style=\"color:blue;\">一段带 HTML 的内容</a>",
  "list": [
    {
      "title": "弹层",
      "name": "layer"
    },
    {
      "title": "表单",
      "name": "form"
    },
    {
      "title": "表格",
      "name": "table"
    },
    {
      "title": "日期选择器",
      "name": "laydate"
    },
    {
      "title": "标签页",
      "name": "tabs"
    }
  ]
}
    &lt;/textarea&gt;
  </div>
  <div class="layui-col-xs12 laytpl-demo" style="border-top: none;">
    <div class="layui-row">
      <div class="layui-col-xs6 layui-tabs" id="ID-tpl-view-header">
        <ul class="layui-tabs-header">
          <li><strong>渲染结果</strong></li>
          <li><strong>源码</strong></li>
        </ul>
      </div>
      <div class="layui-col-xs6" style="text-align: right">
        <span class="layui-badge" id="ID-tpl-view-time"></span>
      </div>
    </div>
    <div id="ID-tpl-view-body">
      <div class="layui-show layui-padding-3 layui-text" id="ID-tpl-view"></div>
      <div><pre id="ID-tpl-view-code"  ></pre></div>
    </div>
  </div>
</div>
<div class="layui-clear"></div>

<!-- 新版本模板 -->
<script type="text/html" id="ID-tpl-template-modern">
<p>转义输出：{{= d.desc }}</p>
<p>原文输出：{{- d.desc }}</p>

{{#注释标签 - 仅在模板中显示，不在视图中输出 }}

<p>&#123;&#123;! 忽略标签，可显示原始标签：
{{ let a = 0; }} {{= escape }} {{- source }} {{#comments }} &#123;&#123;! ignore !&#125;&#125;
!&#125;&#125;</p>

{{#标签空主体测试 }}
{{}} {{  }} {{   }} {{= }} {{=}} {{= }}

<p>
  条件语句：
  {{= d.list.length ? d.title : '' }}
  {{ if(d.title){}} - #AAAA{{='A'}}{{ } }}
</p>
<p>循环语句：</p>
<ul>
{{ d.list.forEach(function(item) { }}
  <li>
    <span>{{= item.title }}</span>
    <span>{{= item.name }}</span>
  </li>
{{ }); }}
</ul>
{{ if (d.list.length === 0) { }}
  无数据
{{} }}
</script>

<!-- 旧版本模板 -->
<script type="text/html" id="ID-tpl-template-legacy">
<p>转义输出：{{= d.desc }}</p>
<p>原文输出：{{- d.desc }}</p>
<p>
  条件语句：
  {{= d.list.length ? d.title : '' }}
  {{#if(d.title){}} - #AAAA{{='A'}}{{#}}}
</p>
<p>循环语句：</p>
<ul>
{{#d.list.forEach(function(item) { }}
  <li>
    <span>{{= item.title }}</span>
    <span>{{= item.name }}</span>
  </li>
{{#}); }}
</ul>
{{#if (d.list.length === 0) { }}
  无数据
{{#} }}
</script>

<!-- import layui -->
<script>
layui.use(['laytpl', 'util', 'tabs', 'dropdown'], function() {
  var laytpl = layui.laytpl;
  var util = layui.util;
  var tabs = layui.tabs;
  var dropdown = layui.dropdown;
  var $ = layui.$;

  // 默认设置
  laytpl.config({
    // tagStyle: 'modern' // 初始化标签风格
  });

  // 获取模板和数据
  var getData = function(type) {
    return {
      template: $('#ID-tpl-src').val(), // 获取模板
      data: function(){  // 获取数据
        try {
          return JSON.parse($('#ID-tpl-data').val());
        } catch(e) {
          $('#ID-tpl-view').html(e);
        }
      }()
    };
  };

  // 视图渲染
  var renderView = function(html, startTime) {
    timer(startTime);
    $('#ID-tpl-view').html(html);
    $('#ID-tpl-view-code').html(util.escape(html));
  };

  // 生成模板
  var createTemplate = function(opts) {
    opts = $.extend({
      tagStyle: 'legacy'
    }, opts);

    // 初始化模板
    var elem = $('#ID-tpl-template-'+ opts.tagStyle);
    $('#ID-tpl-src').val(elem.html().replace(/^\s+/g, ''));

    return opts;
  };
  var tplConfig = createTemplate();
  var data = getData();

  // 耗时计算
  var timer = function(startTime, title) {
    var endTime = new Date();
    $('#ID-tpl-view-time').html((title || '本次渲染总耗时：')+ (endTime - startTime) + 'ms');
  };
  var startTime = new Date();

  // 创建一个模板实例
  var templateInst = laytpl(data.template, {
    condense: false, // 不处理连续空白符，即保留模板原始结构
    tagStyle: tplConfig.tagStyle
  });

  // 初始渲染
  templateInst.render(data.data, function(html) {
    renderView(html, startTime);
  });

  // 编辑
  $('.laytpl-demo textarea').on('input', function() {
    var data = getData();
    var startTime = new Date();

    // 若模板有变化，则重新编译模板
    if (this.id === 'ID-tpl-src') {
      templateInst.compile(data.template);
    }

    // 若模板没变，数据有变化，则从模板缓存中直接渲染数据（效率大增）
    templateInst.render(data.data, function(html) {
      renderView(html, startTime);
    });
  });

  // 视图结果 tabs
  tabs.render({
    elem: '#ID-tpl-view-header',
    body: ['#ID-tpl-view-body', '>div']
  });

  // 切换模板
  dropdown.render({
    elem: '#ID-tpl-src-title',
    data: [{
      title: '新版本模板',
      tagStyle: 'modern'
    }, {
      title: '旧版本模板',
      tagStyle: 'legacy'
    }],
    click: function(obj){
      createTemplate({
        tagStyle: obj.tagStyle
      });
      this.elem.children('strong').html(obj.title);

      // 同步设置标签风格
      templateInst.config.tagStyle = obj.tagStyle;

      var data = getData();
      var startTime = new Date();

      // 重新渲染
      templateInst.compile(data.template).render(data.data, function(html) {
        renderView(html, startTime);
      });
    }
  })
});
</script>!}}</textarea>
</pre>
