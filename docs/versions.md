---
title: 更新日志
toc: true
---

# 更新日志

> 导读：📑 [Layui 不同版本的浏览器兼容说明](/notes/browser-support.html) · 📑 [Layui 2.x 系列版本主要升级变化](/notes/share/2x-major-upgrade-changes.html) · 📑 [Layui 2.8+ 《升级指南》](/notes/2.8/upgrade-guide.html)

<div id="WS-switch-v"></div>

<h2 id="2.10+" lay-toc="{title: '2.10+'}"></h2>

<h2 id="v2.11.0" lay-pid="2.10+" class="ws-anchor">
  v2.11.0
  <span class="layui-badge-rim">2025-04-21</span>
</h2>

- #### 新特性
  - 新增 无缝扩展任意外部模块的支持，及优化大量核心 #2560 @sentsim
  - 重构 laytpl 模板引擎，增强对更多复杂模板结构的解析能力 #2577 @sentsim
- #### Core
  - 新增 `layui.extend()` 无缝扩展任意外部模块的支持，即无需遵循 Layui 模块规范的第三方模块
  - 优化 `layui.use(), layui.link()` 核心逻辑
  - 优化 `layui.js` 整体代码风格
- #### [laytpl](./laytpl/)
  - 新增 `cache` 选项，用于是否开启模板缓存
  - 新增 `condense` 选项，用于是否压缩模板空白符，如将多个连续的空白符压缩为单个空格
  - 新增 `tagStyle` 选项，用于设置界定符风格。默认仍采用 `< 2.11` 版本风格
  - 新增 `laytpl.extendVars()` 方法，用于扩展模板内部变量
  - 新增 `compile` 实例方法，用于清除缓存后以便渲染时重新对模板进行编译
  - 新增 在模板中通过 `include()` 方法导入子模板的功能
  - 新增 新的界定符风格：{{!`{{ 语句 }}` `{{= 转义输出 }}` `{{- 原文输出 }}` `{{# 注释 }}`!}}
  - 新增 template 报错时的上下文捕获，基于映射，可更精确定位到模板具体错误行 #2650 @sentsim
  - 提升 模板解析的整体性能及稳定性
  - 内置 对多种模块加载方式的支持，以同时适配 Node.js 和浏览器端的使用场景
- #### rate
  - 重构 组件代码结构，由 component 模块构建，并继承其全部基础接口 #2626 @sentsim
- #### component
  - 剔除 `isRenderOnEvent, isRenderWithoutElem` 实验型选项 #2625 @sentsim
- #### tabs
  - 新增 `tabs.add()` 的 `active` 选项，用于是否将新增项设置为活动标签 #2607 @lanrenbulan
  - 修复 `box-sizing` 对主体区域中其他组件的样式影响 #2622 @sentsim
- #### 其他
  - 新增 dropdown 可点击面板外部 iframe 区域关闭的功能 #2629 @Sight-wcg
  - 新增 select 可点击面板外部 iframe 区域关闭的功能 #2631 @Sight-wcg
  - 新增 layui.hash() 返回的成员 `pathname`, 与 layui.url() 一致 #2649 @sentsim
  - 优化 card 面板头部样式，去除高度限制 #2621 @sentsim
  - 优化 laypage 快速点击时文本被选中的问题 #2623 @sentsim
  - 优化 util 的 `escape` 和 `unescape` 在解析某些特殊字符串时的潜在问题 #2628 @sentsim

### 下载： [layui-v2.11.0.zip](https://gitee.com/layui/layui/attach_files/2158121/download)

---

<h2 id="v2.10.3" lay-pid="2.10+" class="ws-anchor">
  v2.10.3
  <span class="layui-badge-rim">2025-03-30</span>
</h2>

- #### component
  - 新增 `component.removeInst()` 基础方法，用于移除缓存中的组件实例 #2597 @sentsim
  - 调整 `component.getThis` → `component.getInst` #2597 @sentsim
- #### table
  - 优化 数据请求时的竞态问题 #2584 @Sight-wcg
- #### layer
  - 修复 空图片容器动态添加图片时，无法获取 data 的问题 #2581 @Sight-wcg
  - 修复 `layer.getFrameIndex()` 方法行为，与 2.9 保持一致 #2592 @Sight-wcg
- #### form
  - 优化 `lay-ignore` 的判断逻辑，支持设置在父元素上 #2585 @augushong

### 下载： [layui-v2.10.3.zip](https://gitee.com/layui/layui/attach_files/2128275/download)

---

😐 `2.10.2` 版本因为存在一个小缺陷（ #2605 ）而被跳过

---

<h2 id="v2.10.1" lay-pid="2.10+" class="ws-anchor">
  v2.10.1
  <span class="layui-badge-rim">2025-03-19</span>
</h2>

- #### component
  - 修复 `reload` 时传入的选项未正确合并的问题 #2566 @sentsim
  - 优化 `lay-options` 属性上的配置在重载时的优先级 #2566 @sentsim
- #### 其他
  - 优化 tabs `reload` 未按照 `closable` 正确渲染可关闭状态的问题 #2566 @sentsim
  - 优化 form 的 `checkbox` 标签风格选中且禁用时的显示 #2563 @bxjt123
  - 修复 body 初始 `line-height` 无效的问题 #2569 @sentsim

### 下载： [layui-v2.10.1.zip](https://gitee.com/layui/layui/attach_files/2100525/download)

---

<h2 id="v2.10.0" lay-pid="2.10+" class="ws-anchor">
  v2.10.0
  <span class="layui-badge-rim">2025-03-13</span>
</h2>

- #### 新特性
  - 新增 component 组件构建器，旨在为 2.x 系列版本逐步构建统一规范的组件 #2477 @sentsim
  - 新增 tabs 全新标签页组件，以替代原 `element` 模块中的 `tab` 组件 #2477 @sentsim
  - 升级 jQuery v3.7.1 #2477 @sentsim
  - 调整 将最低浏览器兼容标准过渡到 IE9。如需兼容 IE8，可使用 2.9.x 版本 #2477 @sentsim
- #### component  <sup>new</sup>
  - 继「轻量级模块系统」之后的又一个重要底层模块，重定义 Layui 特有的组件范式
  - 支持 创建不同的展示和交互形态的组件
  - 支持 输出组件通用的基础接口，如渲染、重载、全局设置、事件、获取实例等
  - 支持 扩展组件任意接口
  - 支持 扩展和重构组件原型，实现更灵活的个性化定制
- #### tabs  <sup>new</sup>
  - 由 component 构建的首个加强型组件
  - 支持 标签头部左右滚动模式，以应对复杂的多标签页使用场景
  - 支持 关闭当前标签和批量关闭「其他、右侧、全部」标签
  - 支持 关闭前后、切换前后等周期事件
  - 支持 标签「自动渲染、方法渲染、任意绑定」三种渲染方式
  - 支持 原 tab 组件的全部功能，并重新优化了界面和交互体验
- #### input-number
  - 新增 限制允许输入的字符功能 #2465 @Sight-wcg
  - 新增 `lay-step-strictly` 属性，可开启步长严格模式，只能输入步长的倍数 #2465 @Sight-wcg
  - 新增 `lay-wheel` 属性，可通过鼠标滚轮或触摸板改变数值功能 #2465 @Sight-wcg
  - 新增 按 Up/Down 键时改变数值功能 #2465 @Sight-wcg
- #### layer
  - 修复在 `success` 中关闭上一个弹层报错的问题 #2548 @sentsim
- #### util
  - 优化 `util.toDateString` 规范化字符串日期 #2543 @Sight-wcg
- #### 其他
  - 调低 `.layui-text` 中的 `<a>` 标签文字颜色优先级  #2477 @sentsim

### 下载： [layui-v2.10.0.zip](https://gitee.com/layui/layui/attach_files/2092421/download)

<script>
(function() {
  // 解析更新日志关联链接
  var elem = document.querySelectorAll('#WS-text li, #WS-text p');
  var types = [
    { rule: /(#)Gitee-(\S+)/g, href: 'https://gitee.com/layui/layui/issues/'},
    { rule: /(#)(\d+)/g, href: 'https://github.com/layui/layui/pull/' },
    { rule: /\[()([\d\w]+)\]/g, href: 'https://github.com/layui/layui/commit/' },
    { rule: /(@)(\S+)/g, href: 'https://github.com/' }
  ];
  elem.forEach(function (item) {
    item.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var nodeValue = node.nodeValue;
        var i = 0;
        var sNode = document.createElement('span');
        for (; i < types.length; i++) {
          if (types[i].rule.test(nodeValue)) {
            nodeValue = nodeValue.replace(types[i].rule, function(s, s1, s2) {
              return '<a href="'+ types[i].href + s2 +'" target="_blank">'+ s1 + s2 +'</a>';
            });
            node.matched = true;
          }
        }
        if (node.matched) {
          sNode.innerHTML = nodeValue;
          node.parentNode.insertBefore(sNode, node);
          node.parentNode.removeChild(node);
        }
      }
    });
  });
})();
</script>

---

<h2 id="2.9.x" lay-toc="{title: '2.9.x', href: '/docs/2/versions/2.9.x.html'}">
  <a href="/docs/2/versions/2.9.x.html">2.9.x</a>
</h2>

查看 <a href="/docs/2/versions/2.9.x.html">2.9.x</a> 系列版本更新日志

---

<h2 id="2.8.x" lay-toc="{title: '2.8.x', href: '/docs/2/versions/2.8.x.html'}">
  <a href="/docs/2/versions/2.8.x.html">2.8.x</a>
</h2>

查看 <a href="/docs/2/versions/2.8.x.html">2.8.x</a> 系列版本更新日志

---

<h2 id="2.7.x" lay-toc="{title: '2.7.x', href: '/2.7/docs/base/changelog.html'}">
  <a href="/2.7/docs/base/changelog.html" target="_blank">2.7.x</a>
</h2>

查看 <a href="/2.7/docs/base/changelog.html" target="_blank">2.7.x</a> 系列及更早前版本更新日志
