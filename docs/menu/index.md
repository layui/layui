---
title: 基础菜单 menu
toc: true
---
 
# 基础菜单

> 基础菜单 `menu` 是垂直导航菜单的另一个替代方案，它是基于 `dropdown` 组件驱动的静态元素结构。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<pre class="layui-code" lay-options="{preview: 'iframe', style: 'height: 535px;', layout: ['preview', 'code'], tools: ['full', 'window']}">
  <textarea>
{{- d.include("/menu/examples/demo.md") }}
  </textarea>
</pre>

<h2 id="layout" lay-toc="{}">结构</h2>

基础菜单层级与样式结构如下：

- 通过 `<ul class="layui-menu"></ul>` 命名基础菜单容器
  - 追加 `className` 为 `layui-menu-lg` 可设置基础菜单的大尺寸风格
  - 通过 `<li></li>` 放置菜单列表项
    - 属性：
      - 追加 `className` 为　`layui-menu-item-group` 可设置当前菜单为菜单组，即子菜单为纵向层级。
      - 或追加 `className` 为 `layui-menu-item-parent` 可设置当前菜单为父级菜单，即子菜单为横向层级。
      - 追加 `className` 为 `layui-menu-item-divider` 可设置分隔线。
      - 追加 `className` 为 `layui-menu-item-up` 或 `layui-menu-item-down` 可设置子菜单默认收缩或展开。
      - 追加 `className` 为 `layui-menu-item-checked` 可设置当前菜单为选中状态
      - 添加 `lay-options="{}"` 可设置对应菜单列表的基础属性
    - 内容：
      - 通过 `<div class="layui-menu-body-title"></div>` 放置菜单标题容器
      - 通过 `<div class="layui-panel layui-menu-body-panel"></div>` 放置横向子菜单外层面板
      - 通过 `<ul><li></li></ul>` 放置子菜单列表，其中 `<li>` 中的规则同父级。
- 再将基础菜单放置在一个面板容器中，以更好地定义尺寸、边框或阴影等外观，详细可参考上述示例。


<h2 id="options" lay-toc="{}">属性</h2>

属性即命名在基础菜单列表元素 `<li></li>` 中的 `lay-options` 属性值，如：`<li lay-options="{type: 'parent'}"></li>`，其支持的属性如下：

| 属性 | 描述 |
| --- | --- |
| title | 设置菜单标题。默认读取标题容器内容中的文本。 |
| type | 设置菜单类型。可选值如下：<ul><li>若不设定，则表示为常规菜单项</li><li>`type:'group'` 菜单组，子菜单为纵向层级</li><li>`type:'parent'` 父级菜单，子菜单为横向层级</li></ul> |
| isAllowSpread | 子菜单是否允许展开收缩操作。默认 `true` |

<h3 id="on" lay-toc="{}" class="ws-bold">事件</h3>

`dropdown.on('click(filter)', callback)`

- 参数 `click(filter)` 是一个特定结构。
  - `click` 为基础菜单项点击事件固定值；
  - `filter` 为基础菜单容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 object 类型的参数。

点击菜单列表项时触发。用法：[#详见示例](#examples)

## 贴士

基础菜单相当于是 `dropdown` 组件的一种静态化呈现，因此在事件等动态操作上需借助 `dropdown` 组件的 API 来完成。
