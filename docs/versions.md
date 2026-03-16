---
title: 更新日志
toc: true
---

# 更新日志

> 导读：📑 [Layui 不同版本的浏览器兼容说明](/notes/browser-support.html) · 📑 [Layui 2.x 系列版本主要升级变化](/notes/share/2x-major-upgrade-changes.html) · 📑 [Layui 2.8+ 《升级指南》](/notes/2.8/upgrade-guide.html)

<div id="WS-switch-v"></div>

<h2 id="2.10+" lay-toc="{title: '2.10+'}"></h2>

<h2 id="v2.13.5" lay-pid="2.10+" class="ws-anchor">
  v2.13.5
  <span class="layui-badge-rim">2026-03-16</span>
</h2>

- 优化 i18n 部分选项命名 #3006 @Sight-wcg
- 更新 code 结合 shiki 实现语法高亮的示例及修复文档中失效的链接 #3008 @Sight-wcg
- 修复 laydate 公历节日标记颜色不跟随主题色变化的问题 #3013 @coredwriter

### 下载： [layui-v2.13.5.zip](#download)

---

<h2 id="v2.13.4" lay-pid="2.10+" class="ws-anchor">
  v2.13.4
  <span class="layui-badge-rim">2026-03-01</span>
</h2>

- 优化 table 在 #2825 中的边缘问题，避免隐藏时触发 resize #2970 @Sight-wcg
- 修复 `laypage.render()` 方法返回值错误的问题 #2994 @axguowen

### 下载： [layui-v2.13.4.zip](#download)

---

<h2 id="v2.13.3" lay-pid="2.10+" class="ws-anchor">
  v2.13.3
  <span class="layui-badge-rim">2025-12-29</span>
</h2>

- 修复 table 表头同时开启 sort 和 colTool 时的事件冒泡问题 #2954 @sentsim
- 修复 table 大小的微小变化触发 resize 循环的问题 #2964 @Sight-wcg
- 修复 menu 菜单标题若存在嵌套元素时未溢出隐藏的问题 #2955 @sentsim
- 修复 flow 图片懒加载在某些场景下的报错问题 #2965 @Sight-wcg

### 下载： [layui-v2.13.3.zip](#download)

---

<h2 id="v2.13.2" lay-pid="2.10+" class="ws-anchor">
  v2.13.2
  <span class="layui-badge-rim">2025-11-21</span>
</h2>

- 修复 laydate 开启范围联动选择模式时，点击月份报错的问题 #2949 @sentsim
- 修复 dropdown 设置 `show: true` 时 render 重复执行的问题 #2946 @Diyar-IT
- 恢复 font-family 字体，避免产生不必要的细微兼容问题 #2950 @sentsim

### 下载： [layui-v2.13.2.zip](#download)

---

<h2 id="v2.13.1" lay-pid="2.10+" class="ws-anchor">
  v2.13.1
  <span class="layui-badge-rim">2025-11-16</span>
</h2>

- 添加 lint / format 工具、CI 流程，提升版本发行质量 #2905 @sunxiaobin89 @sentsim
- 优化 font-family, 让页面字体更清晰均匀 #2924 @sentsim
- 修复 table 当存在横向滚动条时，尾部列出现错位的问题 #2931 @sentsim
- 修复 laydate 的 `btns` 数组参与深拷贝的问题 #2909 @sentsim
- 修复 upload 代码中变量 `hint` 未声明的问题 #2901 @sentsim
- 修复 IE11 下的若干异常 #2920 @sentsim

### 下载： [layui-v2.13.1.zip](#download)

---

<h2 id="v2.13.0" lay-pid="2.10+" class="ws-anchor">
  v2.13.0
  <span class="layui-badge-rim">2025-10-24</span>
</h2>

- #### component
  - 重构 carousel 组件 #2857 @sentsim
  - 重构 colorpicker 组件 #2858 @sentsim
  - 重构 flow 组件 #2860 @sentsim
  - 重构 transfer 组件 #2862 @sentsim
  - 重构 tree 组件 #2863 @sentsim
  - 重构 element 模块，保留原接口，拆分成如下 5 个组件模块 #2885 @sentsim
  - 新增 tab 组件模块 (*已被 tabs 平替，仅为兼容保留*) #2885 @sentsim
  - 新增 nav 组件模块 #2885 @sentsim
  - 新增 breadcrumb 组件模块 #2885 @sentsim
  - 新增 progress 组件模块 #2885 @sentsim
  - 新增 collapse 组件模块 #2885 @sentsim
- #### tree
  - 修复 点击复选框时触发了节点展开收缩的问题 #2863 @sentsim
  - 优化 父、子节点的 checked 状态关系 #2863 @sentsim
  - 优化 叶子节点的图标 #2863 @sentsim
- #### checkbox
  - 修复 初始半选时，再点击选中后的图标状态异常问题 #2882 @Sight-wcg
- #### layer
  - 增强 prompt 的 `formType` 选项，支持原生语义化 input 类型 #2873 @Sight-wcg
  - 修复 tips 在触发元素宽度较小时的定位 #2871 @Sight-wcg
- #### laydate
  - 优化 `lang: 'en'` 时的报错提示 #2884 @sentsim
- #### lay
  - 新增 `lay.treeToFlat, lay.flatToTree` 方法 #2863 @sentsim
  - 重构 `lay.extend` 实现，增强整体逻辑 #2879 @sentsim
  - 新增 `lay.extend` 最后一个参数为函数的支持，用于定制合并值 #2879 @sentsim
  - 修复 `lay.extend` 合并嵌套的数组类型值时产生引用的问题 #2879 @sentsim


### 下载： [layui-v2.13.0.zip](#download)

---

<h2 id="v2.12.1" lay-pid="2.10+" class="ws-anchor">
  v2.12.1
  <span class="layui-badge-rim">2025-10-11</span>
</h2>

- 修复 table 浏览器兼容性问题 #2850 @sentsim
- 修复 carousel 设置 `anim: 'fade'` 无效的问题 #2855 @sentsim
- 优化 slider 提示条的箭头样式 #2849 @sentsim

### 下载： [layui-v2.12.1.zip](#download)

---

<h2 id="v2.12.0" lay-pid="2.10+" class="ws-anchor">
  v2.12.0
  <span class="layui-badge-rim">2025-09-29</span>
</h2>

- #### 新特性
  - 新增 i18n 模块，用于提供国际化多语言支持 #2698 @Sight-wcg @sentsim
- #### table
  - 新增 `ajax` 选项，用于自定义 Ajax 请求 #2752 @Sight-wcg
  - 新增 `syncFixedRowHeight` 选项，用于行高自适应时同步固定列行高 #2825 @Sight-wcg
  - 修复 checkbox/radio 列触发行事件的问题 #2836 @Sight-wcg
- #### code
  - 新增 `highlightLine` 选项，用于实现行高亮功能 #2763 @Sight-wcg
- #### slider
  - 使用 component 模块重构组件，并继承其全部基础接口 #2781 @Sight-wcg
- #### dropdown
  - 新增 同时打开多个下拉面板的功能支持 #2827 @Sight-wcg
  - 优化 目标元素尺寸变化时重新定位 #2827 @Sight-wcg
  - 优化 点击目标元素的外部区域关闭面板的逻辑 #2827 @Sight-wcg
- #### form
  - 优化 select 面板在大小出现变化时定位问题 #2824 @Sight-wcg
- #### layer
  - 修复 `layer.iframeAuto()` 最大高度未限制在浏览器高度内的问题 #2839 @Sight-wcg
- #### laydate
  - 优化 左下角预览区域过渡色未与主题色保持一致的问题 #2840 @Sight-wcg
- #### nav
  - 修复 纵向菜单出现滚动条时滑块位置异常的问题 #2826 @Sight-wcg

### 下载： [layui-v2.12.0.zip](#download)

---

<h2 id="v2.11.6" lay-pid="2.10+" class="ws-anchor">
  v2.11.6
  <span class="layui-badge-rim">2025-08-29</span>
  <span class="layui-badge-rim" style="color: #16b777;">稳定版</span>
</h2>

- 修复 table 设置 `even:true` 时，行选中背景色异常 #2776 @Sight-wcg
- 修复 checkbox / radio 和 label 关联时的问题 #2795 @Sight-wcg
- 移除 laypage 中 input 元素不必要的过渡效果 #2796 @Sight-wcg
- 修复 tabs 获取标签内容项 `lay-id` 不存在时返回最后一项的问题 #2806 @Sight-wcg

### 下载： [layui-v2.11.6.zip](#download)

---

<h2 id="v2.11.5" lay-pid="2.10+" class="ws-anchor">
  v2.11.5
  <span class="layui-badge-rim">2025-07-21</span>
</h2>

- 修复 laydate `range:false` 某些场景下确认按钮状态异常问题 #2754 @Sight-wcg
- 优化 CSS 部分属性兼容性书写规范 #2761 @firework-a

### 下载： [layui-v2.11.5.zip](#download)

---

<h2 id="v2.11.4" lay-pid="2.10+" class="ws-anchor">
  v2.11.4
  <span class="layui-badge-rim">2025-06-23</span>
</h2>

- 重构 collapse 展开收缩动画的核心逻辑 #2734 @sentsim
- 新增 collapse 列表项添加 `layui-show` 类设置默认展开的支持，且兼容旧版 #2734 @sentsim
- 修复 collapse 列表项的内容元素添加 `layui-show` 类时的收缩异常问题 #2734 @sentsim

### 下载： [layui-v2.11.4.zip](#download)

---

<h2 id="v2.11.3" lay-pid="2.10+" class="ws-anchor">
  v2.11.3
  <span class="layui-badge-rim">2025-06-18</span>
</h2>

- #### tabs
  - 优化 `close` 方法在标签顺序打乱时传入 `lay-id` 的支持 #2690 @sentsim
  - 优化 `closeMult` 方法的 `index` 参数值为 `lay-id` 时的无效问题 #2690 @sentsim
  - 优化 `getHeaderItem` 等方法的 `index` 参数的类型检测 #2690 @sentsim
- #### treeTable
  - 新增 `expandNode` 方法的 `done` 回调 #2721 @Sight-wcg
- #### collapse
  - 新增 折叠面板展开和收缩时的过渡动画 #2722 @sentsim

### 下载： [layui-v2.11.3.zip](#download)

---

<h2 id="v2.11.2" lay-pid="2.10+" class="ws-anchor">
  v2.11.2
  <span class="layui-badge-rim">2025-05-15</span>
</h2>

- #### form-select
  - 修复 `<option>` 文本两端的 Unicode 空格(U+00A0)被去除的问题 #2676 @Sight-wcg
- #### tabs
  - 优化 `header` 选项初始值的判断，允许数组为空 #2680 @sentsim
  - 优化 `tabs.getBodyItem()` 第二个参数，可接受索引或 `lay-id` 值 #2680
  - 优化 `tabs.add()` 的 `done` 回调，参数新增包含新标签项元素 #2680
  - 优化 `tabs.change()` 方法，标签项打乱顺序时仍可通过 `lay-id` 切换 #2680

### 下载： [layui-v2.11.2.zip](#download)

---

<h2 id="v2.11.1" lay-pid="2.10+" class="ws-anchor">
  v2.11.1
  <span class="layui-badge-rim">2025-05-06</span>
</h2>

- 修复 select 组件的字符转义问题 #2661 @sentsim
- 修复 checkbox/radio 在 WebKit/537.36 的异常 #2637 @Sight-wcg
- 优化 carousel 切换时的动画性能 #2654 @SessionHu

### 下载： [layui-v2.11.1.zip](#download)

---

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
  - 新增 `tagStyle` 选项，用于设置标签风格。默认仍采用 `< 2.11` 版本风格
  - 新增 `laytpl.extendVars()` 方法，用于扩展模板内部变量
  - 新增 `compile` 实例方法，用于清除缓存后以便渲染时重新对模板进行编译
  - 新增 在模板中通过 `include()` 方法导入子模板的功能
  - 新增 新的标签风格：{{!`{{ 语句 }}` `{{= 转义输出 }}` `{{- 原文输出 }}` `{{# 注释 }}`!}}
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

### 下载： [layui-v2.11.0.zip](#download)

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

### 下载： [layui-v2.10.3.zip](#download)

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

### 下载： [layui-v2.10.1.zip](#download)

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

### 下载： [layui-v2.10.0.zip](#download)

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

  // 解析发行版下载链接
  document.querySelectorAll('a[href="#download"]').forEach(function(item) {
    var filename = item.innerText.replace(/^\s+|\s+$/g, '');
    item.href = 'https://layui.github.io/releases/'+ filename;
    item.download = '';
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
