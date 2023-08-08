<h3 lay-toc="{id: 'examples', level: 2, hot: true}" class="layui-hide">综合演示</h3>


<pre class="layui-code" lay-options="{preview: true, text: {preview: '综合演示'}, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-sm" lay-on="getChecked">获取选中节点数据</button>
  <button type="button" class="layui-btn layui-btn-sm" lay-on="setChecked">勾选指定节点</button>
  <button type="button" class="layui-btn layui-btn-sm" lay-on="reload">重载实例</button>
</div>
 
<div id="ID-tree-demo"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var tree = layui.tree;
  var layer = layui.layer;
  var util = layui.util;
 
  // 模拟数据
  var data = [{title:'A-1',id:1,field:'name1',checked:true,spread:true,children:[{title:'B-1-1 可允许跳转',id:3,field:'name11',href:'',children:[{title:'C-1-1-3',id:23,field:'',children:[{title:'D-1-1-3-1',id:24,field:'',children:[{title:'E-1-1-3-1-1',id:30,field:''},{title:'E-1-1-3-1-2',id:31,field:''}]}]},{title:'C-1-1-1',id:7,field:'',children:[{title:'D-1-1-1-1 可允许跳转',id:15,field:'',href:''}]},{title:'C-1-1-2',id:8,field:'',children:[{title:'D-1-1-2-1',id:32,field:''}]}]},{title:'B-1-2',id:4,spread:true,children:[{title:'C-1-2-1',id:9,field:'',disabled:true},{title:'C-1-2-2',id:10,field:''}]},{title:'B-1-3',id:20,field:'',children:[{title:'C-1-3-1',id:21,field:''},{title:'C-1-3-2',id:22,field:''}]}]},{title:'A-2',id:2,field:'',spread:true,children:[{title:'B-2-1',id:5,field:'',spread:true,children:[{title:'C-2-1-1',id:11,field:''},{title:'C-2-1-2',id:12,field:''}]},{title:'B-2-2',id:6,field:'',children:[{title:'C-2-2-1',id:13,field:''},{title:'C-2-2-2',id:14,field:'',disabled:true}]}]},{title:'A-3',id:16,field:'',children:[{title:'B-3-1',id:17,field:'',fixed:true,children:[{title:'C-3-1-1',id:18,field:''},{title:'C-3-1-2',id:19,field:''}]},{title:'B-3-2',id:27,field:'',children:[{title:'C-3-2-1',id:28,field:''},{title:'C-3-2-2',id:29,field:''}]}]}];

  // 渲染
  tree.render({
    elem: '#ID-tree-demo',
    data: data,
    showCheckbox: true,  // 是否显示复选框
    onlyIconControl: true,  // 是否仅允许节点左侧图标控制展开收缩
    id: 'demo-id-1',
    isJump: true, // 是否允许点击节点时弹出新窗口跳转
    click: function(obj){
      var data = obj.data;  //获取当前点击的节点数据
      layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
    }
  });

  // 按钮事件
  util.event('lay-on', {
    getChecked: function(othis){
      var checkedData = tree.getChecked('demo-id-1'); // 获取选中节点的数据
      
      layer.alert(JSON.stringify(checkedData), {shade:0});
      console.log(checkedData);
    },
    setChecked: function(){
      tree.setChecked('demo-id-1', [12, 16]); // 勾选对应 id 值的节点
    },
    reload: function(){
      tree.reload('demo-id-1', {}); // 重载实例
    }
  });
  
});
</script>
  </textarea>
</pre>

<h3 id="demo-showLine" lay-toc="{level: 2}" class="ws-anchor ws-bold">无连接线风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-tree-demo-showLine"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var tree = layui.tree;

  // 模拟数据
  var data = [{title:'江西',id:1,children:[{title:'南昌',id:1000,children:[{title:'青山湖区',id:10001},{title:'高新区',id:10002}]},{title:'九江',id:1001},{title:'赣州',id:1002}]},{title:'广西',id:2,children:[{title:'南宁',id:2000},{title:'桂林',id:2001}]},{title:'陕西',id:3,children:[{title:'西安',id:3000},{title:'延安',id:3001}]},{title:'山西',id:3,children:[{title:'太原',id:4000},{title:'长治',id:4001}]}];

  // 渲染
  tree.render({
    elem: '#ID-tree-demo-showLine',
    data: data,
    showLine: false  // 是否开启连接线
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-icon-stretch" lay-toc="{level: 2}" class="ws-anchor ws-bold">仅图标控制伸缩</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-tree-demo-onlyIconControl"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var tree = layui.tree;
  var layer = layui.layer;

  // 模拟数据
  var data = [{title:'江西',id:1,children:[{title:'南昌',id:1000,children:[{title:'青山湖区',id:10001},{title:'高新区',id:10002}]},{title:'九江',id:1001},{title:'赣州',id:1002}]},{title:'广西',id:2,children:[{title:'南宁',id:2000},{title:'桂林',id:2001}]},{title:'陕西',id:3,children:[{title:'西安',id:3000},{title:'延安',id:3001}]},{title:'山西',id:3,children:[{title:'太原',id:4000},{title:'长治',id:4001}]}];

  // 渲染
  tree.render({
    elem: '#ID-tree-demo-onlyIconControl',
    data: data,
    onlyIconControl: true,  // 是否仅允许节点左侧图标控制展开收缩
    click: function(obj){
      layer.msg(JSON.stringify(obj.data));
    }
  });
  
});
</script>
  </textarea>
</pre>

<h3 id="demo-accordion" lay-toc="{level: 2}" class="ws-anchor ws-bold">手风琴模式</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-tree-demo-accordion"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var tree = layui.tree;

  // 渲染
  tree.render({
    elem: '#ID-tree-demo-accordion',
    data: [{
      title: '优秀',
      children: [{
        title: '80 ~ 90'
      },{
        title: '90 ~ 100'
      }]
    },{
      title: '良好',
      children: [{
        title: '70 ~ 80'
      },{
        title: '60 ~ 70'
      }]
    },{
      title: '一般',
      children: [{
        title: '0 ~ 60'
      }]
    }],
    accordion: true 
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-checkbox" lay-toc="{level: 2}" class="ws-anchor ws-bold">开启复选框</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-tree-demo-showCheckbox"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var tree = layui.tree;
 
  // 模拟数据
  var data = [{title:'早餐',id:1,children:[{title:'拌粉',id:5},{title:'蒸饺',id:6},{title:'豆浆',id:7}]},{title:'午餐',id:2,checked:true,children:[{title:'藜蒿炒腊肉',id:8},{title:'西湖醋鱼',id:9},{title:'小白菜',id:10},{title:'海带排骨汤',id:11}]},{title:'晚餐',id:3,children:[{title:'红烧肉',id:12,fixed:true},{title:'番茄炒蛋',id:13}]},{title:'夜宵',id:4,children:[{title:'小龙虾',id:14,checked:true},{title:'香辣蟹',id:15,disabled:true},{title:'烤鱿鱼',id:16}]}];

  // 渲染
  tree.render({
    elem: '#ID-tree-demo-showCheckbox',
    data: data,
    showCheckbox: true,
    edit: ['add', 'update', 'del'] // 开启节点的右侧操作图标
  });
});
</script>
  </textarea>
</pre>