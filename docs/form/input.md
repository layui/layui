---
title: 输入框 / 文本域
toc: true
---

# 输入框

> 输入框组件是对文本框`<input type="text">`和多行文本框`<textarea>`元素的扩展


<h2 id="text" lay-toc="">普通输入框</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="text" name="" placeholder="文本框" class="layui-input">
  <hr class="ws-space-16">
  &lt;textarea name="" placeholder="多行文本框" class="layui-textarea"&gt;&lt;/textarea&gt;
</div>
  </textarea>
</pre>


<h2 id="wrap" lay-toc="{hot: true}">输入框点缀 <sup>2.8+</sup></h2>

输入框点缀是指给普通输入框附加其他元素来进行动静态修饰，其结构包含：*容器、前缀、输入框、后缀*。

```
<div class="layui-input-{容器类}">
  <div class="layui-input-{前缀类}"></div>
  <input class="layui-input" placeholder="输入框">
  <div class="layui-input-{后缀类}"></div>
</div>
```

- 容器类：
  - 前置和后置结构：`class="layui-input-group"`
  - 前缀和后缀结构：`class="layui-input-wrap"`
- 前缀类：`class="layui-input-prefix"`
- 后缀类：`class="layui-input-suffix"`
- 前缀显示分隔框：`class="layui-input-prefix layui-input-split"`
- 后缀显示分隔框：`class="layui-input-suffix layui-input-split"`

通过在不同层级中设置规定的 CSS 类来实现点缀布局，再按照不同需求，在前缀和后缀中放置图标等任意内容。


<h3 id="group" lay-toc="{level: 2}" class="ws-bold">前置和后置</h3>

前置和后置结构是*输入框的自适应结构*，可以很灵活地控制前后置内容与输入框的宽度比例。

- 结构：

```
<div class="layui-input-group">
  <div class="layui-input-prefix">前置内容</div>
  <input type="text" class="layui-input">
  <div class="layui-input-suffix">后缀内容</div>
</div>
```

- 示例：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/form/examples/input.group.md") }}
  </textarea>
</pre>


<h3 id="pre-suf" lay-toc="{level: 2}" class="ws-bold">前缀和后缀</h3>

输入框前缀和后缀是*输入框的纯修饰结构*，前缀和后缀宽度固定且其元素不可触及，即只能触及输入框本身。

- 结构：

```
<div class="layui-input-wrap">
  <div class="layui-input-prefix">前缀图标</div>
  <input type="text" class="layui-input">
  <div class="layui-input-suffix">后缀图标</div>
</div>
```

- 示例：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;',layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/form/examples/input.pre.suf.md") }}
  </textarea>
</pre>

注意「前置和后置」与「前缀和后缀」 二者使用时切勿混淆。


<h2 id="affix" lay-toc="{hot: true}">动态点缀 <sup>2.8+</sup></h2>

该功能允许对输入框内容进行相关动态操作。通过对输入框元素设置 `lay-affix` 属性来开启动态点缀。

| 点缀 | 属性值 |
| --- | --- |
| [数字输入框](#affix-number) <sup>2.8.9+</sup> | `lay-affix="number"` |
| [密码框显隐](#affix-eye) | `lay-affix="eye"` |
| [内容清除](#affix-clear) | `lay-affix="clear"` |
| [自定义动态点缀](#affix-custom) | `lay-affix="customName"` |


<h3 id="affix-number" lay-toc="{level: 2, hot: true}" class="ws-bold">
  数字输入框 <sup>2.8.9+</sup>
</h3>

一般搭配 `<input type="number">` 使用，用于替代原生数字输入框，支持的属性如下：

| 属性 | 描述 |
| --- | --- |
| step | 设置数字的加减间隔 |
| min | 设置数字的最小值 |
| max | 设置数字的最大值 |
| lay-precision <sup>2.8.18+</sup> | 设置数字的小数位精度 |

### 示例

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="number" lay-affix="number" placeholder="" value="0" class="layui-input">
  <hr class="ws-space-16">
  <div class="layui-row layui-col-space16">
    <div class="layui-col-xs6">
      <input type="number" lay-affix="number" placeholder="设置 step 为 0.01" step="0.01" class="layui-input">
    </div>
    <div class="layui-col-xs6">
      <input type="number" lay-affix="number" placeholder="设置 step,min,max" step="10" min="0" max="100" class="layui-input">
    </div>
    <div class="layui-col-xs4">
      <input type="number" lay-affix="number" placeholder="设置小数位精度为 2" step="0.1" lay-precision="2" class="layui-input">
    </div>
    <div class="layui-col-xs4">
      <input type="number" lay-affix="number" readonly placeholder="不允许输入状态" class="layui-input">
    </div>
    <div class="layui-col-xs4">
      <input type="number" lay-affix="number" disabled placeholder="禁用状态" class="layui-input">
    </div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h3 id="affix-eye" lay-toc="{level: 2}" class="ws-bold">密码显隐</h3>

一般搭配 `<input type="password">` 使用，用于控制输入框内容的显示和隐藏。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-input-wrap">
    <input type="password" lay-affix="eye" placeholder="请输入" class="layui-input">
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="affix-clear" lay-toc="{level: 2}" class="ws-bold">内容清除</h3>

一般搭配 `<input type="text">` 使用，用于清除输入框的内容。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-input-wrap">
    <input type="text" lay-affix="clear" placeholder="请输入" class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" value="默认有值状态" lay-affix="clear" class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" value="禁用状态时" lay-affix="clear" disabled class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" value="只读状态时" lay-affix="clear" readonly class="layui-input">
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="affix-custom" lay-toc="{level: 2}" class="ws-bold">自定义动态点缀</h3>

我们还可以对 `lay-affix` 属性设置任意图标值，从而实现自定义动态点缀功能。 其中 `lay-affix="customName"` 值对应图标类`layui-icon-`后面的名称（[#详见图标列表](../icon/#list)）。且可通过「[点缀事件](#affix-event)」完成自定义操作。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/form/examples/input.affix.custom.md") }}
  </textarea>
</pre>

输入框的自定义动态点缀功能，让原本单一的输入框有了更多的想象空间。


<h3 id="on" lay-toc="{level: 2}" class="ws-bold">点缀事件</h3>

`form.on('input-affix(filter)', callback);`

- `input-affix` 为输入框动态点缀事件固定名称
- `filter` 为输入框对应的 `lay-filter` 属性值

该事件在点击输入框的点缀图标时触发，通过该事件可以完成一些自定义操作。

```
form.on('input-affix(filter)', function(data){
  var elem = data.elem; // 获取输入框 DOM 对象
  var affix = data.affix; // 获取输入框 lay-affix 属性值
  console.log(this); // 当前触发点缀事件的图标元素
});
```

<h2 id="select-tree" lay-toc="{hot: true}">下拉树 <sup>2.8.19+</sup></h2>

通过模拟下拉框美化结构内嵌layui的树组件实现下拉树形列表的效果。

```
<div class="layui-unselect layui-form-select" >
  <div class="layui-select-title">
    <input class="layui-input" placeholder="placeholder" name = "name" lay-options = "{}" lay-filter = "lay-filter" />
  </div>
</div>
```

- 需要将上面的结构作为这个整体放入 `class="layui-input-inline"` 等容器类中
- input标签里面的lay-options属性是必须要添加的,这个属性是用于自定义配置项;如果没有需要,也请填上'{}'
- 需要注意的是lay-options里面填写的是一个对象,对象的key也需要加上引号包裹,否则在解析时会出错
- input标签里面的name属性需要添加上,后面会生成一个 * + name 的输入框用于展示选择的内容
- 建议给input标签添加lay-filter方便后面的事件绑定

<h3 id="select-tree-simple" lay-toc="{hot: true,level: 2}" class="ws-bold">示例</h3>

在表单里面添加上上述的示例即可使用了

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-inline">
    <label class="layui-form-label">下拉树:</label>
    <div class="layui-input-inline">
      <div class="layui-unselect layui-form-select" >
        <div class="layui-select-title">
          <input class="layui-input" placeholder="请选择" name = "name" lay-options = "{}" lay-filter = "selectTree-demo01" />
        </div>
      </div>
    </div>
  </div>
</div>

<!-- import layui -->
<script>
layui.use(['jquery','form','tree'],function(){
  var form = layui.form;
  var tree = layui.tree;
  // 初始化jQuery对象
  var $ = layui.jquery;
  if (!window.$) window.$ = layui.$;

  // 模拟数据
  var data = [{title:'江西',id:1,children:[{title:'南昌',id:1000,children:[{title:'青山湖区',id:10001},{title:'高新区',id:10002}]},{title:'九江',id:1001},{title:'赣州',id:1002}]},{title:'广西',id:2,children:[{title:'南宁',id:2000},{title:'桂林',id:2001}]},{title:'陕西',id:3,children:[{title:'西安',id:3000},{title:'延安',id:3001}]},{title:'山西',id:3,children:[{title:'太原',id:4000},{title:'长治',id:4001}]}];

  // 获取tree实例
  var treeId = $('[lay-tree-id]').attr('lay-tree-id');

  // 重载树(修改树的数据源等)
  if(treeId){
    tree.reload(treeId, {
      data: data
    });
    // 修改tree之后建议重新渲染下拉树
    form.render();
  }

  // 表单赋值
  form.val({name: 10001});

  // 事件监听
  form.on('selectTree(selectTree-demo01)', function(obj){
    // 这里会提供被点击节点的数据源
    console.log(obj.value);
    // 使用返回值进行过滤:返回false,那么这个节点点击也不会被下拉树选中值(这里过滤条件是没有子节点的节点可以选中)
    return !obj.value.children || obj.value.children.length == 0;
  });

});
</script>
  </textarea>
</pre>

<h3 id="select-tree-attr" lay-toc="{hot: true,level: 2}" class="ws-bold">属性</h3>

这里指的是lay-options里面的属性

| 属性 | 是否必须 | 描述 | 默认值 |
| --- | --- | --- | --- |
| url | 非必须 | 请求数据源的地址 | --- |
| type| 非必须 | ajax请求type | GET |
| dataType | 非必须 | --- |  json |
| where | 非必须 | 请求参数 | {} |
| statusName | 非必须 | 返回结果中状态参数的key | code |
| statusCode | 非必须 | 返回结果中状态参数成功对应的值 | 200 |
| dataName | 非必须 | 返回结果中数据参数的key | data |
| customName | 非必须 | tree里面的自定义字段名称 | --- |
| data | 非必须 | tree里面的数据源(如果配置了url,可能会被url覆盖) | [] |
| onlyIconControl | 非必须 | 是否仅允许节点左侧图标控制展开伸缩 | true |

<h3 id="select-tree-method" lay-toc="{hot: true,level: 2}" class="ws-bold">方法</h3>

- 使用url加异步参数的方式可以解决一部分的需求,那么另一部分就使用这种方式来应付了:

> 下拉树的树是使用layui的tree组件渲染出来的,它可以看作一个单独的tree来进行操作;
> 我们在渲染结束后会将树的id放在dl下面的dd标签上面,可以通过使用tree的id重载树的数据源;
> 这种方式下,为了保持值与显示值的一致,建议再调用form.render进行刷新;

- 在下拉树的渲染之初这个树可能并没有完全成型,为了保持值与显示值的一致,建议在树创建完毕后使用form.val({})的方式进行赋值

<h3 id="select-tree-event" lay-toc="{hot: true,level: 2}" class="ws-bold">事件</h3>

这里是借鉴了下拉框的事件,这个回调函数的返回值可以决定当前的节点是否可以被下拉树选中(默认是都可以选中的)

```
  // 事件监听
  layui.form.on('selectTree(filter)', function(obj){
    // 这里会提供被点击节点的数据源
    obj.value;
    // 输入框domElement
    obj.elem;
    // 美化后的dom(.layui-form-select那一层)
    obj.othis;
    // 使用返回值进行过滤:返回false,那么这个节点点击也不会被下拉树选中值
    return true;
  });
```

<h3 id="select-tree-onevent" lay-toc="{hot: true,level: 2}" class="ws-bold">监听</h3>

- 对保存值的输入框和显示值的输入框进行监听,使他们的值是保持一一对应的,但是不排除js赋值后没有触发监听函数,
所以建议在改动下拉树内容后使用form.render方法进行刷新
- 在输入框(显示值的输入框)上输入信息会触发tree的模糊匹配搜索功能,这个是为了弥补下拉树虽然使用了下拉列表的事件,
但是并不是全部配套(比如选中项颜色改变,滚动条滚动到所选项)的缺点
