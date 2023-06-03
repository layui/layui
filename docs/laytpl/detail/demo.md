<pre class="layui-code" lay-options="{preview: true, layout: ['preview'], tools: ['full']}">
  <textarea>
{{!
<style>
.laytpl-demo{border: 1px solid #eee;}
.laytpl-demo:first-child{border-right: none;}
.laytpl-demo>textarea{position: relative; display: block; width:100%; height: 300px; padding: 11px; border: 0; box-sizing: border-box; resize: none; background-color: #fff; font-family: Courier New; font-size: 13px;}
.laytpl-demo>div:first-child{height: 32px; line-height: 32px; padding: 6px 11px; border-bottom: 1px solid #eee; background-color: #F8F9FA;}
</style>
<div class="layui-row">
  <div class="layui-col-xs6 laytpl-demo">
    <div>模板</div>
    &lt;textarea id="ID-tpl-src"&gt;
<h3>{{= d.title }}</h3>
<ul>
{{# layui.each(d.list, function(index, item){ }}
  <li>
    <span>{{= item.modname }}</span>
    <span>{{= item.alias }}：</span>
    <span>{{= item.site || '' }}</span>
  </li>
{{# }); }}
 
{{# if(d.list.length === 0){ }}
  无数据
{{# } }} 
</ul>
    &lt;/textarea>
  </div>
  
  <div class="layui-col-xs6 laytpl-demo">
    <div>数据</div>
    &lt;textarea id="ID-tpl-data"&gt;
{
  "title": "Layui 常用模块",
  "list": [
    {
      "modname": "弹层",
      "alias": "layer",
      "site": "layer.domain.com"
    },
    {
      "modname": "表单",
      "alias": "form"
    },
    {
      "modname": "表格",
      "alias": "table"
    },
    {
      "modname": "日期",
      "alias": "laydate"
    },
    {
      "modname": "上传",
      "alias": "upload"
    }
  ]
}
    &lt;/textarea&gt;
  </div>
  <div class="layui-col-xs12 laytpl-demo" style="border-top: none;">
    <div class="layui-row">
      <div class="layui-col-xs6">视图</div>
      <div class="layui-col-xs6" style="text-align: right">
        <span id="ID-tpl-viewtime"></span>
      </div>
     </div>
    <div class="layui-padding-sm" id="ID-tpl-view" style="max-height: 300px; padding: 16px; overflow: auto;">…</div>
  </div>
</div>
<div class="layui-clear"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laytpl = layui.laytpl;
  var util = layui.util;
  var $ = layui.$;

  // 获取模板和数据
  var get = function(type){
    return {
      template: $('#ID-tpl-src').val(), // 获取模板
      data: function(){  // 获取数据
        try {
          return JSON.parse($('#ID-tpl-data').val());
        } catch(e){
          $('#ID-tpl-view').html(e);
        }
      }()
    };
  };
  
  var data = get();
  
  // 耗时计算
  var startTime = new Date().getTime(), timer = function(startTime, title){
    var endTime = new Date().getTime();
    $('#ID-tpl-viewtime').html((title || '模板解析耗时：')+ (endTime - startTime) + 'ms');
  };

  // 渲染模板
  var thisTpl = laytpl(data.template);

  // 执行渲染
  thisTpl.render(data.data, function(view){
    timer(startTime);
    $('#ID-tpl-view').html(view);
  });
  
  // 编辑
  $('.laytpl-demo textarea').on('input propertychange', function(){
    var data = get();
    if(!data.data) return;
    
    // 计算模板渲染耗时
    var startTime = new Date().getTime();
    
    // 若模板有变化，则重新解析模板；若模板没变，数据有变化，则从模板缓存中直接渲染（效率大增）
    if(this.id === 'ID-tpl-src'){ 
      thisTpl.parse(data.template, data.data); // 解析模板
    }
    
    // 执行渲染
    thisTpl.render(data.data, function(view){
      timer(startTime);
      $('#ID-tpl-view').html(view);
    });
  });
});
</script>
!}}
  </textarea>
</pre>