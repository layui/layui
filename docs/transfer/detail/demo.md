<pre class="layui-code" lay-options="{preview: true, text: {preview: '基础效果'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-transfer-demo"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;

  // 数据
  var data = [
    {"value": "1", "title": "李白"},
    {"value": "2", "title": "杜甫"},
    {"value": "3", "title": "苏轼"},
    {"value": "4", "title": "李清照"},
    {"value": "5", "title": "鲁迅", "disabled": true},
    {"value": "6", "title": "巴金"},
    {"value": "7", "title": "冰心"},
    {"value": "8", "title": "矛盾"},
    {"value": "9", "title": "贤心"}
  ];

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo',
    data: data
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-title" class="ws-anchor ws-bold">定义标题及数据源</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-transfer-demo-title"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;

  // 数据
  var data = [
    {"value": "1", "title": "李白"},
    {"value": "2", "title": "杜甫"},
    {"value": "3", "title": "苏轼"},
    {"value": "4", "title": "李清照"},
    {"value": "5", "title": "鲁迅", "disabled": true},
    {"value": "6", "title": "巴金"},
    {"value": "7", "title": "冰心"},
    {"value": "8", "title": "矛盾"},
    {"value": "9", "title": "贤心"}
  ];

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo-title',
    title: ['候选文人', '获奖文人'],  //自定义标题
    data: data,
    // width: 150, // 定义宽度
    height: 210 // 定义高度
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-value" class="ws-anchor ws-bold">初始右侧数据</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-transfer-demo-value"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;

  // 数据
  var data = [
    {"value": "1", "title": "瓦罐汤"},
    {"value": "2", "title": "油酥饼"},
    {"value": "3", "title": "炸酱面"},
    {"value": "4", "title": "串串香", "disabled": true},
    {"value": "5", "title": "豆腐脑"},
    {"value": "6", "title": "驴打滚"},
    {"value": "7", "title": "北京烤鸭"},
    {"value": "8", "title": "烤冷面"},
    {"value": "9", "title": "毛血旺", "disabled": true},
    {"value": "10", "title": "肉夹馍"},
    {"value": "11", "title": "臊子面"},
    {"value": "12", "title": "凉皮"},
    {"value": "13", "title": "羊肉泡馍"},
    {"value": "14", "title": "冰糖葫芦", "disabled": true},
    {"value": "15", "title": "狼牙土豆"}
  ];

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo-value',
    data: data,
    value: ["1", "3", "5", "7", "9", "11"]
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-showSearch" class="ws-anchor ws-bold">显示搜索框</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-transfer-demo-showSearch"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;

  // 数据
  var data = [
    {"value": "1", "title": "李白"},
    {"value": "2", "title": "杜甫"},
    {"value": "3", "title": "苏轼"},
    {"value": "4", "title": "李清照"},
    {"value": "5", "title": "鲁迅", "disabled": true},
    {"value": "6", "title": "巴金"},
    {"value": "7", "title": "冰心"},
    {"value": "8", "title": "矛盾"},
    {"value": "9", "title": "贤心"}
  ];

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo-showSearch',
    data: data,
    title: ['文本墨客', '获奖文人'],
    showSearch: true
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-parseData" class="ws-anchor ws-bold">数据格式解析</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-transfer-demo-parseData"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo-parseData',
    parseData: function(res){
      return {
        "value": res.id, // 数据值
        "title": res.name, // 数据标题
        "disabled": res.disabled,  // 是否禁用
        "checked": res.checked // 是否选中
      }
    },
    data: [
      {"id": "1", "name": "李白"},
      {"id": "2", "name": "杜甫"},
      {"id": "3", "name": "苏轼"}
    ],
    height: 150
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-onchange" class="ws-anchor ws-bold">穿梭时的回调</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-transfer-demo-onchange"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;
  var layer = layui.layer;

  // 数据
  var data = [
    {"value": "1", "title": "李白"},
    {"value": "2", "title": "杜甫"},
    {"value": "3", "title": "苏轼"},
    {"value": "4", "title": "李清照"},
    {"value": "5", "title": "鲁迅", "disabled": true},
    {"value": "6", "title": "巴金"},
    {"value": "7", "title": "冰心"},
    {"value": "8", "title": "矛盾"},
    {"value": "9", "title": "贤心"}
  ];

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo-onchange',
    data: data,
    onchange: function(obj, index){
      var arr = ['左边', '右边'];
       // 查看被穿梭时的数据 --  仅用于演示
      layer.alert('来自 <strong>'+ arr[index] + '</strong> 的数据：'+ JSON.stringify(obj));
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-inst" class="ws-anchor ws-bold">实例调用</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn" lay-on="getData">获取右侧数据</button>
  <button type="button" class="layui-btn" lay-on="reload">重载实例</button>
</div>
<div id="ID-transfer-demo-inst"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var transfer = layui.transfer;
  var util = layui.util;
  var layer = layui.layer;

  // 数据
  var data = [
    {"value": "1", "title": "李白"},
    {"value": "2", "title": "杜甫"},
    {"value": "3", "title": "苏轼"},
    {"value": "4", "title": "李清照"},
    {"value": "5", "title": "鲁迅", "disabled": true},
    {"value": "6", "title": "巴金"},
    {"value": "7", "title": "冰心"},
    {"value": "8", "title": "矛盾"},
    {"value": "9", "title": "贤心"}
  ];

  // 渲染
  transfer.render({
    elem: '#ID-transfer-demo-inst',
    data: data,
    id: 'demo-inst' // 定义唯一索引
  });

  // 批量事件
  util.on('lay-on', {
    getData: function(othis){
      var getData = transfer.getData('demo-inst'); // 获取右侧数据
      layer.alert(JSON.stringify(getData)); 
    },
    reload:function(){
      //实例重载
      transfer.reload('demo-inst', {
        title: ['文人', '喜欢的文人'],
        value: ['2', '5', '9'],
        showSearch: true
      })
    }
  });
});
</script>
  </textarea>
</pre>