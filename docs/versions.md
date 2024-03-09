---
title: 更新日志
toc: true
---

# 更新日志

> 导读：📑 [Layui 2.8+ 《升级指南》](/notes/2.8/upgrade-guide.html) · 📑 [Layui 新版文档站上线初衷](/notes/2.8/news.html)

<h2 id="2.9.x" lay-toc="{title: '2.9.x'}"></h2>


<h2 id="v2.9.7" class="ws-anchor">
  v2.9.7
  <!-- <span class="layui-badge-rim" style="color: #16b777;">稳定版</span> -->
  <span class="layui-badge-rim">2024-02-28</span>
</h2>

- #### select
  - 新增 `lay-creatable` 属性，用于在开启搜索时允许创建新选项 #1618 @Sight-wcg
- #### table
  - 修复 禁止拖拽列宽后仍可拖拽的问题 #1591 @Sight-wcg
- #### layer
  - 新增 遮罩层添加过渡效果 #1616 @Sight-wcg
  - 修复 弹出高度设置为 `auto` 时，恢复大小时内容区高度错误 #1617 @Sight-wcg
  - 优化 最大/小化再恢复大小后宽高偶现细微差异的问题 #1653 @Sight-wcg
- #### laydate
  - 新增时间选择器根据 `format` 格式进行显隐支持 #1656 @Sight-wcg
- #### dropdown
  - 新增 close 选项，用于下拉面板被关闭后触发的回调函数 #1605 @Sight-wcg
- #### flow
  - 新增 direction 选项，用于设置触发加载的方向 #1638 @Sight-wcg
- #### 其他
  - 修改 源码 Unicode 编码转换为中文字符 #1600 @Sight-wcg

### 下载： [layui-v2.9.7.zip](https://gitee.com/layui/layui/attach_files/1685481/download)

---

<h2 id="v2.9.6" class="ws-anchor">
  v2.9.6
  <span class="layui-badge-rim">2024-01-24</span>
</h2>

- #### table
  - 新增 `table.updateRow` 方法，用于更新指定行 #1540 @Sight-wcg
  - 修复 关闭展开状态时，未重置单元格滚动条位置的问题 #1536 @Sight-wcg
  - ~~修复 Chrome DevTools 审查 iframe srcdoc 中的 table 元素时导致页面崩溃的问题~~ #1571
    <br> Chrome 121.0.x 版本自身已修复 DevTools 导致的网页崩溃问题，因此上述补丁已在 v2.9.6 中移除 #1584
- #### laydate
  - 优化 时间选择器在 Safari on iOS, Firefox for Android 中的滑动操作 #1550 @Sight-wcg
- #### slider
  - 新增 `tipsAlways` 选项，用于设置提示文本是否始终显示 #1520 @yxb94616

### 下载： [layui-v2.9.6.zip](https://gitee.com/layui/layui/attach_files/1660301/download)

---

`2.9.4 / 2.9.5` 版本因为存在缺陷而被跳过

---

<h2 id="v2.9.3" class="ws-anchor">
  v2.9.3
  <span class="layui-badge-rim">2023-12-31</span>
</h2>

2023 收官。

- #### form
  - 优化 `input` 组件圆角时后缀存在方框的问题 #1467 @bxjt123
  - 优化 `select` 搜索面板打开逻辑，以适配文字直接粘贴触发搜索的情况 #1498 @Sight-wcg
- #### table
  - 修复非常规列设置 `field` 表头选项时，导出 excel 出现合计行错位的问题 #1522 @Sight-wcg
- #### treeTable
  - 修复 `treeTable.updateNode()` 更新已打开的节点时，未重新渲染表单元素的问题 #1468 @Sight-wcg
- #### laydate
  - 修复 开启 `rangeLinked` 时，选择同一日期，某些情况时间会反选的问题 #1517 @Sight-wcg
- #### upload
  - 加强 `data` 选项的函数写法，支持获取文件相关数据 #1494 @Sight-wcg
- #### transfer
  - 新增 `dblclick` 回调函数选项 #1491 @Sight-wcg
- #### 移动端的适配
  - 修复 `rate,carousel` 一些小问题 #1469 @Sight-wcg

### 下载： [layui-v2.9.3.zip](https://gitee.com/layui/layui/attach_files/1633409/download)

---

<h2 id="v2.9.2" class="ws-anchor">
  v2.9.2
  <span class="layui-badge-rim">2023-12-18</span>
</h2>

`2.9.x` 是对 `2.8.18` 的进一步完善，旨在打造一个可长期用于生产环境的稳定版本。对 `2.8.x` 向下兼容，可覆盖升级。

- #### 移动端的改进
  - 新增 `slider,layer,carousel,laydate,rate,colorpicker` 手势操作支持 #1446 @Sight-wcg
  - 新增 `lay` 模块中针对手势操作的多个基础方法 #1446 @Sight-wcg
- #### table
  - 修复 IE 下的报错问题 #1453 @Sight-wcg
- #### form
  - 修复 `select` 在 IE10+ 中的兼容性问题 #1452 @Sight-wcg
- #### dropdown
  - 增强 `delay` 选项，支持设置 显示/隐藏 的延迟时间 #1454 @Sight-wcg

### 下载： [layui-v2.9.2.zip](https://gitee.com/layui/layui/attach_files/1615568/download)

---

<h2 id="2.9.1" class="ws-anchor">
  2.9.1
  <span class="layui-badge-rim">2023-12-11</span>
</h2>

- #### table
  - 增强 `height` 选项，支持函数 #1437  @Sight-wcg
  - 增强 `table.setRowChecked()` 方法，支持批量选中 [7c12ddf]
  - 修复 全选时，禁用行仍有选中样式的问题 #1436 @Sight-wcg
  - 修复 `templet` 模板字符中的一些特殊 laytpl 界定符被转义的问题 #1438 @Sight-wcg
- #### layer
  - 修复 `iframe` 层在某些情况出现异常纵向滚动条的问题 [8f0c87f]
  - 优化 `layer.tips` 在触发元素高度较小时的定位 #1439 @Sight-wcg
- #### treeTable
  - 修复 `treeTable.reloadData()` 在某些情况下报错的问题 [3f148a9]
- #### laydate
  - 清除 内部 `MODE_NAME` 变量重复声明 #1441 @mek1986
- #### laypage
  - 新增 `countText` 选项，用于自定义数据总数区域文本 #1444 @Sight-wcg
- #### nav
  - 修复 IE8 下子菜单背景色问题 #1445 @Sight-wcg
- #### util
  - 优化 `util.on()` 在特殊情况下的用法问题 [3b78139]

### 下载： [layui-v2.9.1.zip](https://gitee.com/layui/layui/attach_files/1608279/download)

---

<h2 id="2.9.0" class="ws-anchor">
  2.9.0
  <span class="layui-badge-rim">2023-11-29</span>
</h2>

- #### table
  - 修复 `complete` 属性导致 `$.ajaxSetup()` 的 `complete` 失效的问题 #1423 @Sight-wcg
  - 修复 单元格展开再收缩后，当列通过拖拽改变过宽度，列存在概率性错位的问题 [28347fc]
  - 修复 合计行单元格展开异常的问题 #Gitee-I8FH3K
  - 优化 `height` 属性高度铺满语法中不支持浮点型数值的问题 #Gitee-I8DSPH
  - 优化 关闭单元格多行展开状态后，悬停状态样式未移除的问题 #1425 @Sight-wcg
  - 优化 在末行展开单元格后，出现的固定列水平未对齐的问题 [85add62]
  - 优化 当数据值为 `0,undefined,null` 且开启列模板，编辑单元格会带入模板字符的问题 [1d408f0]
- #### util
  - 优化 `util.on()` 方法，提升参数的灵活性和代码的可读性 [d74abb4] [92c8580]
- #### layer
  - 优化 `layer.closeLast()` 方法，给第二个参数增加回调函数 [ab4ded2]
- #### tree
  - 修复 `title` 有特殊字符时点击编辑的显示问题 #1432 @Sight-wcg
- #### colorpicker
  - 优化 内部输入框取值，移除字符串两侧的空白字符 #1427 @Sight-wcg
- #### 其他
  - 优化 `lay.clipboard.writeText()` 逻辑，以适配无写入权限时的场景 #1421 @Sight-wcg

### 下载： [layui-v2.9.0.zip](https://gitee.com/layui/layui/attach_files/1597365/download)

<script>
(function(){
  // 解析更新日志关联链接
  var elem = document.querySelectorAll('#WS-text li');
  elem.forEach(function (item) {
    item.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var nodeValue = node.nodeValue;
        var types = [
          {
            rule: /(#)Gitee-(\S+)/g,
            href: 'https://gitee.com/layui/layui/issues/'
          },
          {
            rule: /(#)(\d+)/g,
            href: 'https://github.com/layui/layui/pull/'
          },
          {
            rule: /\[()([\d\w]+)\]/g,
            href: 'https://github.com/layui/layui/commit/'
          },
          {
            rule: /(@)(\S+)/g,
            href: 'https://github.com/'
          }
        ];
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

<h2 id="2.8.x" lay-toc="{title: '2.8.x'}"></h2>

<h2 id="2.8.18" class="ws-anchor">
  2.8.18
  <span class="layui-badge-rim">2023-10-31</span>
</h2>

- #### form
  - 新增 `input` 数字输入框组件的特定属性 `lay-precision`，用于设置数值精度 # 1375/I81SY4
  - 优化 `input` 数字输入框组件的失去焦点对值的有效范围约束 # 1375/I7KU6V
  - 优化 `input` 数字输入框组件当值达到临界点时加减按钮的禁用视觉效果 # 1375
  - 优化 `input` 数字输入框当表单验证失败时的边框颜色 # 1371
- #### nav
  - 新增 垂直导航菜单展开和收缩时的过渡动画 # 1407
  - 新增 `lay-accordion` 属性支持，用于开启手风琴，兼容旧版 `lay-shrink="all"` # 1384
- #### layer
  - 新增 `photos` 层的鼠标滚轮缩放功能 # I7ZAE8
  - 优化 移动端定位 # 1376
- #### table
  - 新增 `complete` 属性，当数据接口请求完成后执行，无论成功还是失败均会触发 # 1379
  - 修复 `ignoreExport` 表头属性值效果与文档不符的问题 # I86DBY
  - 修复 `type: 'radio'` 且为右侧固定列时，选择效果无效的问题 # 1406
  - 优化 鼠标在固定列滚轮时无法触发滚动条的问题 # I8CGZH
  - 优化 某些情况在 Firefox 的报错问题
- #### treeTable
  - 修复 `treeTable.removeNode()` 在开启 `data` 模式时删除异常问题 # I7Z0AB/I82E2S
  - 修复 `treeTable.setRowChecked()` 方法未逐层展开上级节点的问题 # 1385/I84RUT
  - 修复 `treeTable.addNodes()` 新增根节点时出现的报错问题 # 1414
  - 修复 数据格式为简单类型时 IE9+ 兼容问题 # 1415/I8C04Y
- #### upload
  - 修复 `unified: true` 时的报错问题 # 1391
  - 优化 渲染入口逻辑，以解决因重复渲染导致的若干问题 # 1391
  - 优化 实例的 `reload` 方法，可更好地进行完整重载 # 1391
- #### dropdown / menu
  - 新增 `accordion` 属性，开启手风琴效果（menu: 主容器设置 `lay-accordion` 属性） # 1397
  - 新增 折叠展开动画效果 # 1397
- #### laydate
  - 优化 `rangeLinked` 属性开启时，点击目标元素可重新渲染的问题 # 1391
  - 优化 `type` 为 `time,datetime` 选择器时，「现在」按钮的禁用状态判断条件 # I828CD
- #### laypage
  - 新增 `limitTemplet` 属性，用于自定义条目模板 # I80AHZ
  - 新增 `skipText` 属性，用于自定义跳页区域文本 # I80AHZ
- #### carousel
  - 优化 轮播切换时的动画效果 # 1378/I82STP
- #### rate / slider
  - 优化 代码细节 # 1374
- #### code
  - 新增 `code` 属性，用于设置原始 code 值，优先级高于目标元素中的内容 # 1391
  - 优化 预览区域显示效果 # 1398
  - 优化 其他若干小问题 # 1391
- #### 其他
  - 新增 Source Maps 支持  # 1404/I89W5P
  - 新增 lay 模块部分函数 JSDoc 注释和示例 #1401
  - 优化 `<hr>` 全局样式优先级 # I86R6G

### 下载： [layui-v2.8.18.zip](https://gitee.com/layui/layui/attach_files/1570299/download)

---

<h2 id="2.8.17" class="ws-anchor">
  2.8.17
  <span class="layui-badge-rim">2023-09-11</span>
</h2>

- #### table
  - 新增 `cellExpandedMode` 基础属性，用于设置所有单元格默认展开方式 # I7XW28 [8bd8415]
  - 新增 `cellExpandedWidth` 基础属性，用于设置所有单元格默认展开后的宽度 [8bd8415]
  - 新增 `expandedMode` 表头属性，用于设置当前表头单元格展开方式，优先级高于 `cellExpandedMode` [8bd8415]
  - 修复 导出来自 treeTable 数据的顺序错乱问题 # I7YOXZ [3123adf]
- #### form
  - 优化 验证机制，以确保自定义验证规则的灵活性，内置规则若为必填项，依旧需叠加 `required` 规则 [a00ecf2]
  - 剔除 `verIncludeRequired` 全局属性，因为会造成不必要的歧义 [a00ecf2]
- #### laydate
  - 修复 开启 `rangeLinked` 属性后，done 函数第二个参数未能正确返回开始日期的问题 #I7XBOA/I7YCHW [4d9365e]
  - 修复 开启 `rangeLinked` 且 `range` 为数组时，当初始值格式不符而自动校正导致的开始日期表单赋值异常问题 [4d9365e]
- #### upload
  - 新增 `dataType` 属性，用于定义服务端返回的数据类型 [58e675c]
  - 优化 多文件模式中，正在上传中的文件会被再次触发上传的问题 # I7XXTW/I4C6XE [9a6b85f]
- #### code
  - 重构 主体结构，以更好地适配第三方语法高亮库 # 1352 [ad5935c]
  - 新增 实例返回的对象，包含对当前实例进行重载等方法成员 [ad5935c]
  - 新增 `codeRender` 函数，用于重新渲染 code，譬如代码高亮处理 # 1352
  - 新增 `highlighter` 属性，用于指定语法高亮器，支持 `hljs,prism,shiki` 等流行库 # 1352
  - 新增 `lang` 属性，用于指定语言类型 # 1352
  - 新增 `langMarker` 属性，用于是否在代码域右上角显示语言类型 # 1352
  - 新增 `wordWrap` 属性，用于设置文字是否自动换行 [ad5935c]
  - 加强 `tools` 属性，进一步提升可扩展性 [ad5935c]
  - 优化 `dark` 模式主题，与 vscode 保持一致 [ad5935c]
- #### lay
  - 新增 `lay.clipboard.writeText(options)` 方法，用于写入剪切板（复制） [5a00d0a]
- #### 公共类
  - 新增 `layui-padding-*` 和 `layui-margin-*` 内外边距样式类名 [5e0d71d]

### 下载： [layui-v2.8.17.zip](https://gitee.com/layui/layui/attach_files/1523966/download)

---

<h2 id="2.8.16" class="ws-anchor">
  2.8.16
  <span class="layui-badge-rim">2023-08-30</span>
</h2>

- #### layer
  - 新增 `photos` 的 `toolbar` 属性，用于开启图片旋转 放大 缩小 还原等头部工具栏 # 1339
  - 调整 `photos` 的 属性名： `hideFooter → footer`，用于是否开启底部栏
- #### table
  - 优化 初始化时的样式渲染及多行模式的内容结构
  - 优化 `size` 为 `sm` / `lg` 时的展开状态
  - 优化 无数据时的导出和打印功能提示 # 1337
  - 优化 数据项为禁用状态的选中状态 # 1328
  - 优化 `table.renderData()` 方法执行了多余排序的问题 # 1358
- #### treeTable
  - 修复 部分操作之后 `radio` 列选中状态丢失的问题 # 1358
  - 修复 `data` 模式下排序之后出现节点结构错乱的问题 # 1358/I7TXXL
  - 优化 `data.cascade` 属性，新增 `none` 可选值，即操作节点时不做任何联动 # 1358
  - 优化 数据项为禁用状态时的全选复选框的状态 # 1329
  - 优化 异步加载子节点为空时的展开状态 # 1326
- #### laydate
  - 优化 `shortcuts.value` 快捷选项的赋值属性，支持函数类型 # 1324
- #### rate
  - 优化 代码书写格式 # 1343
- #### code
  - 修复 自定义工具栏出现的报错问题 # 1342
  - 优化 复制功能，以兼容非安全域下复制失败的问题 #1356
  - 优化 预览区未能显示滚动条的问题 # 1359

### 下载： [layui-v2.8.16.zip](https://gitee.com/layui/layui/attach_files/1511975/download)

---

<h2 id="2.8.15" class="ws-anchor">
  2.8.15
  <span class="layui-badge-rim">2023-08-16</span>
</h2>

- #### table
  - 新增 `expandedWidth` 表头属性，用于设置单元格被展开后的宽度
  - 优化 单元格内容下拉展开状态面板，以解决此前因展开后内容不可操作等问题 # I7RS8S
  - 优化 `table.reload()` 造成 `window resize` 事件重复绑定的问题 # I7RJWY
  - 优化 多行模式在 Firefox 的内容显示问题
- #### layer
  - 优化 开启默认动画弹出层后，鼠标移入按钮出现往上偏移的问题 # I7QVVP
  - 优化 弹层右上角关闭按钮因上个版本更新导致的主题样式异常问题 # I7TP11
- #### dropdown
  - 新增 `customName` 属性，用于自定义 `data` 属性中常用的字段名称
  - 修复 在某些特殊情况下调整浏览器窗口尺寸时出现的 `resize` 事件报错问题
- #### tree
  - 新增 `customName` 属性，用于自定义 `data` 中常用的字段名称
- #### lay
  - 新增 `lay.style()` 方法，用于向页面创建 style 样式
  - 优化 `lay.position()` 方法，可让下拉弹出元素的定位更智能

### 下载： [layui-v2.8.15.zip](https://gitee.com/layui/layui/attach_files/1499232/download)

---

因 `2.8.14` 版本存在 layer 主题样式异常问题，`2.8.14` 已被跳过。

---

<h2 id="2.8.13" class="ws-anchor">
  2.8.13
  <span class="layui-badge-rim">2023-08-08</span>
</h2>

- #### table
  - 优化 在自定义模板中放置 `checkbox` 时对应的文字显示异常问题 # I7LQNO
  - 优化 `totalRow` 属性在 `table.reloadData()` 数据重载时的支持 # I7R6VY
- #### treeTable
  - 修复 执行 `treeTable.addNodes()` 增加节点导致当前节点选中状态丢失的问题 # I7Q6IP
  - 优化 删除节点时，对容器尺寸重新进行自动适配
- #### tree
  - 优化 容器样式，以解决用于其他组件内部可能造成的样式异常问题 # I7QAO3
- #### dropdown
  - **调整** `data.title` 属性对 HTML 的转义处理。若不转义，可通过 `templet` 属性实现 # I7Q6IV
- #### util
  - 重构 `util.toDateString()` 转换日期格式字符组件，以提供更强大的占位符支持 # 1314
  - 修复 `util.fixbar()` 组件因 `default` 属性在 IE8 出现的保留字报错问题

### 下载： [layui-v2.8.13.zip](https://gitee.com/layui/layui/attach_files/1490273/download)

---


<h2 id="2.8.12" class="ws-anchor">
  2.8.12
  <span class="layui-badge-rim">2023-08-01</span>
</h2>

- #### form
  - 优化 `input` 数字输入框在前置后置结构中的样式 # I7KTQB
- #### layer
  - 修复 设置 `scrollbar` 属性禁用页面滚动条时，点击最大化再还原导致滚动条又重新出现的问题 # I7NTGX
  - 修复 弹层容器中的 `id` 值与其他弹层索引值相同时，导致关闭弹层存在冲突问题 # I7PF0O
- #### upload
  - 修复 `auto: false` 时，打开文件选择框并点击取消后，导致文件上传失效的问题 # I7NU31
- #### treeTable
  - 新增 `tree.data.cascade` 属性，用于设置复选的级联方式，默认 `all` # 1309
  - 修复 右侧固定列选中背景色没有和主体选中状态保持同步的问题 # I7NVCU
  - 调整 树形转平铺的方法，保留节点的 `children` 信息 # 1309
  - 调整 重载时的参数拷贝，由默认深拷贝换成默认浅拷贝，以便与 table 组件保持一致 # 1309/I7NN0O
- #### tree
  - 优化 `checked` 属性赋值机制，若初始数据源存在该属性，才对其进行动态赋值
  - 优化 `spread` 属性赋值机制，若初始数据源存在该属性，则展开和收缩时，自动对其更新状态值
- #### 其他
  - 修正 code 中部分单词拼写错误 # 1310

### 下载： [layui-v2.8.12.zip](https://gitee.com/layui/layui/attach_files/1482367/download)

---

<h2 id="2.8.11" class="ws-anchor">
  2.8.11
  <span class="layui-badge-rim">2023-07-13</span>
</h2>

- #### form
  - 修复 `radio` 标题模板中若存在图标，选中时该图标被强制更改的问题 # I7IERB
  - 优化 `input` 数字输入框的精度问题 # I7I7J2
  - 修正 `verIncludelRequired` 属性名为 `verIncludeRequired` # 1305
- #### table
  - 修复 导出统计行中若存在逗号出现的内容分隔异常问题 # I7IDA3
  - 修复 当点击筛选显示隐藏固定列时出现的未对齐的问题 # I7KQ0O
- #### menu
  - 修复 `menu` 标题项自定义图标在展开收缩后被强制更改的问题 # 1303/I7JAPU
- #### tree
  - 修复 点击复选框时未将对应的数据中的 `checked` 属性值进行同步的问题

### 下载： [layui-v2.8.11.zip](https://gitee.com/layui/layui/attach_files/1464525/download)

---

<h2 id="2.8.10" class="ws-anchor">
  2.8.10
  <span class="layui-badge-rim">2023-07-03</span>
</h2>

- 修复 `layui.js` 在 IE 和 Safari 等「古董浏览器」存在一个正则零宽断言报错的问题 # I7HZCZ/I7I0TO

### 下载： [layui-v2.8.10.zip](https://gitee.com/layui/layui/attach_files/1455365/download)

---

<h2 id="2.8.9" class="ws-anchor">
  2.8.9
  <span class="layui-badge-rim">2023-07-03</span>
</h2>

- #### form
  - 新增 `input` 数字输入框组件，通过动态点缀 `lay-affix="number"` 属性开启
  - 优化 `input,textarea` 禁用状态时的样式 # I7GN5Z
- #### table
  - 优化 点击单元格出现编辑框时，不触发行事件
- #### treeTable
  - 修复 选中和取消选中时，父节点和子节点的选中背景色未能正确同步的问题 # I7FUD6
- #### upload
  - 新增 `text` 属性，用于自定义内部各类场景下的提示文本
- #### util
  - 重构 `countdown` 倒计时组件，采用 `options` 参数写法，但仍对旧版兼容
  - 新增 `countdown` 的 `date,now,clock,done` 等属性
  - 新增 `countdown` 的 `clear,reload` 等实例方法，用于清除和重置倒计时等操作

### 下载： [~~layui-v2.8.9.zip~~](https://gitee.com/layui/layui/attach_files/1454465/download)

---

<h2 id="2.8.8" class="ws-anchor">
  2.8.8
  <span class="layui-badge-rim">2023-06-20</span>
</h2>

- #### form
  - 新增 `input` 获取焦点时的光环效果，以提升当前活动输入框的辨别度
  - 取消 上个版本对 `select` 开启搜索时 `value` 的改动，由于存在若干不可控的影响
- #### table
  - 新增 `colTool` 事件，点击表头自定义元素触发，并返回当前列的相关信息，提升 table 的可玩性
  - 新增 `row,tool,checkbox,radio` 事件返回的 `dataCache` 属性，可获得当前行缓存数据，包含特定字段
- #### upload
  - 新增 `unified` 属性，用于选择多文件时是否统一上传，即只发送一次请求 # I6Z171
- #### 其他
  - 优化 `layui.js,layer.js` 部分代码细节 # 1285

### 下载： [layui-v2.8.8.zip](https://gitee.com/layui/layui/attach_files/1444541/download)

---

<h2 id="2.8.7" class="ws-anchor">
  2.8.7
  <span class="layui-badge-rim">2023-06-16</span>
</h2>

- #### form
  - ~~优化 `select` 开启搜索时输入状态，将值转移到 `placeholder`，便于输入~~ # 1280
    <br>*注：由于存在若干影响，该项功能已在 `2.8.8` 中取消*
- #### table
  - 新增 表头复选框的半选效果，当数据项部分选中且未全选时显示
  - 优化 `table.setRowChecked()` 方法，新增当前行选中背景色，便于与 hover 等活动背景色区分
  - 剔除 `table.setRowChecked()` 方法中的 `selectedStyle` 属性，因为没有实质意义
  - 优化 表头部分字段为 `hide` 在数据异常的情况下可能出现的表头错位的问题 # 1281
  - 优化 `done` 回调函数，新增参数 `origin` 用于区分重载和重新渲染数据 # 1281
  - 加强 `ignoreExport` 表头属性，允许指定不排除哪些字段 # 1281
- #### treeTable
  - 新增 `view.expandAllDefault` 属性，用于设置是否默认展开全部节点 # 1281
  - 修复 开启排序且在 `done` 回调中执行了 `expandAll` 展开全部导致死循环问题 # 1281
  - 修复 执行 `treeTable.reload(id)` 若 `id` 未匹配到对应实例时出现的报错问题 # 1281/I7CXLN
- #### grid
  - 修复 space30 和 space32 边距相同的问题 # I7D7YP

### 下载： [layui-v2.8.7.zip](https://gitee.com/layui/layui/attach_files/1441026/download)

---

<h2 id="2.8.6" class="ws-anchor">
  2.8.6
  <span class="layui-badge-rim">2023-06-08</span>
</h2>

- #### table
  - 新增 `table.renderData(id)` 方法，用于重新渲染数据，可搭配 `table.cache` 使用 # 1273
  - 修复 `table.hideCol(id, cols)` 第二个参数为普通对象时的异常问题 # 1270/I7AAUN
  - 修复 多级表头在某些缩放比例的情况下出现表头跟表体错位问题 # 1273/I7A33T
  - 修复 `table.getTrHtml()` 方法 `tr` 节点代码中的 `numbers` 列信息错误问题
  - 优化 `table setRowChecked()` 方法中标注当前选中行样式的判断逻辑 # 1273
- #### treeTable
  - 修复 `treeTable.expandAll()` 展开全部之后节点的折叠状态没有记忆的问题 # 1273
  - 修复 无主键的树表 reloadData 之后节点被展开的问题 # 1273
  - 修复 部分情况下父节点展开之后子节点中的单选复选列和其他表单元素没有渲染的问题 1273/I7AWNV
  - 修复 初始化无数据时出现的数据报错的问题 # 1273
- #### tab
  - 修复 删除选项卡时，若标题栏存在其他元素，下标获取异常的问题 # 1271/I7AO7F
  - 优化 `element.tabAdd()` 方法，第二个参数中新增 `change` 属性支持，以支持添加即自动切换功能
  - 优化 折叠功能，切换选项时不自动折叠选项卡，且添加选项时若处于折叠状态则自动展开 # I79HUD
- #### util
  - 修复 fixbar 中添加了无效样式问题 # I79JTH

### 下载： [layui-v2.8.6.zip](https://gitee.com/layui/layui/attach_files/1432770/download)

---

因 `2.8.5` 版本中存在一个 tab 删除时下标的异常问题，`2.8.5` 已被跳过。

---

<h2 id="2.8.4" class="ws-anchor">
  2.8.4
  <span class="layui-badge-rim">2023-05-30</span>
</h2>

- #### form
  - 新增 `verIncludelRequired` 全局属性，用于设置验证规则中是否同时包含必填 # I737EW
  - 修复 checkbox 开关标题和半选图标未垂直居中的问题 # 1255
  - 修复 checkbox 在初始设置半选时，点击复选框时图标未恢复成非半选状态的问题
  - 修复 checkbox 被重新渲染时，标题模版未正确获取的问题 # 1257
  - 修复 select 经浏览器翻译成别的语言后，点击选项出现的显示异常问题 # 1256
  - 优化 checkbox 元素的 `lay-skin` ，当设置非内置风格时，不再强制显示为默认风格
- #### table
  - 新增 对 table 内元素的 `lay-unrow` 属性的识别，点击该元素时，可阻止执行 `row` 行单击事件
  - 修复 `table.setRowChecked()` 方法导致 `checkbox,radio` 事件失效的问题 # I73MLV/I76KBX/I78VI3
  - 修复 打印功能在 Edge 中可能出现的闪退问题 # 1264
  - 优化 `table.setRowChecked()` 方法，若未传 `checked` 属性，则自动对 `checkbox` 进行选中状态值切换
  - 优化 `row` 事件机制，若目标元素为 `checkbox,radio`，则不触发 `row` 事件
  - 优化 外层容器的高度，不再设置一个固定值，内部元素将根据 `height` 属性值自动撑满
  - 优化 底部边框问题
- #### treeTable
  - 新增 节点折叠状态记忆功能 # 1260/I777CJ
  - 新增 `customName.icon` 属性，用于自定义图标的属性名称 # 1260/I73BQU
  - 新增 `async.format` 回调函数，用于处理异步子节点数据，优先级高于 `async.url` # 1260
  - 新增 `treeTable.reloadAsyncNode(id, index)` 方法，用于重载异步子节点 # 1260
  - 新增 `treeTable.getNodeById(id)` 方法，用于获取节点信息集 # 1260
  - 新增 `treeTable.getNodesByFilter(id, filter, opts)` 方法，用于获取符合过滤规则的节点信息集 # 1260
  - 修复 `isSimpleData` 模式渲染后的默认数据排序异常问题 # 1260
  - 修复 展开全部节点排序失效的问题 # 1260/I73M2K
  - 修复 折叠叶子节点时，图标没有变化的问题 # 1260
  - 修复 节点选中状态判断异常问题 # 1260
  - 优化 `treeTable.checkStatus()` 方法，可通过设置第二个参数，用于是否返回半选状态的数据 # 1260/I73JAW
  - 优化 重新排序和视图内表单初始化的调用逻辑 # 1260
  - 优化 节点渲染方法 # 1260
- #### layer
  - 修复 `skin:'layui-layer-lan'` 时，导致 `btnAlign` 属性无效的问题 # I73PD1
- #### laydate
  - 优化 `theme` 属性，当其为数组格式，且第一个成员为 `hex` 格式主色值，则第二个成员为辅色值 # 1265
- #### upload
  - 新增 `exts` 属性对于图片类型时的 `.svg` 扩展名支持
- #### code
  - 优化 `copy` 属性开启时, 对 `tools` 属性的初始化配置 # I72QGO
  - 优化 `preview: 'iframe'` 时的 `<iframe>` 容器，以支持背景透明

### 下载： [layui-v2.8.4.zip](https://gitee.com/layui/layui/attach_files/1422378/download)

---

<h2 id="2.8.3" class="ws-anchor">
  2.8.3
  <span class="layui-badge-rim">2023-05-15</span>
</h2>

- #### 基础
  - 新增 `layui.debounce()` 和 `layui.throttle()`，分别用于防抖和节流 # 1252
- #### form
  - 新增 `checkbox` 的标题模板支持，可在下一个兄弟元素中加上 `lay-checkbox` 绑定 # I72HSK/I6YDGT
  - 修复 `radio` 经浏览器翻译成别的语言后出现的显示异常问题 # I6ZA12
  - 优化 `checkbox` 的边距细节
  - 优化 `checkbox` 标签风格的边框瑕疵 # I70OFE
  - **调整** 内置校验规则，仅当非空时进行校验，避免强制携带必填(`required`)的校验规则 # I72CTI
- #### table
  - 新增 `tool,checkbox,radio` 事件的 `obj.getCol()` 方法，用于获取当前列的配置信息 # I72D2C
  - 新增 `ignoreExport` 表头属性，用于在表格导出时对该列进行忽略 # 1252
  - 修复 某些特殊情况，表格页脚出现双底线的问题 # I70BDR
  - 优化 合计行内数据超过单元格长度时，无法查看全部的问题 # I6TOP8
- #### treeTable
  - 修复 默认的节点 icon 图标用错问题 # 1252
  - 修复 `showIcon` 为 `false` 在某些操作之后出现图标的问题 # 1252
  - 修复 展开全部之后再展开单个节点出现卡顿问题 # 1252
  - 修复 更新节点导致的图标重复及数据未正常更新的问题 # 1252
  - 修复 开启了 `sort` 属性后出现的一些异常问题 # 1252
- #### layer
  - 新增 `hideOnClose` 属性，用于关闭弹层时设置为隐藏，默认 `false`。须与 `id` 属性并用 # I72L74
  - 修复 `layer.min(index)` 方法与最小化按钮事件效果不一致的问题 # I6ZD3R
  - 优化 基础配置信息的记录，统一记录在 layer 容器的 `.data('config')` 中
  - 优化 当弹层设置 `id` 并最小化后，再次点击事件时，重新还原弹层 # I5N0QP
- #### laydate
  - 修复 点击限制范围外的标注日期仍然可点的问题，# I71D9C

### 下载： [layui-v2.8.3.zip](https://gitee.com/layui/layui/attach_files/1408565/download)

---

<h2 id="2.8.2" class="ws-anchor">
  2.8.2
  <span class="layui-badge-rim">2023-05-04</span>
</h2>

- #### table
  - 修复 `autoSort: true` 时，更改 `table.cache` 未同步到 `data` 属性的问题 # 1247
  - 修复 多级表头存在 `hide` 表头属性时，执行完整重载可能出现的错位问题 # 1247/I6WX8Y
  - 修复 未开启 `page` 属性时底边框缺失问题 # 1228
  - 优化 打印内容中包含过大图片时的显示问题
- #### treeTable
  - 修复 `checkbox,radio` 事件导致 table 组件不必要的异常提示问题 # I6Z5W5
  - 修复 执行重载并携带 `parseData` 和 `done` 属性导致的渲染异常问题 # 1247
  - 修复 `treeTable.updateNode()` 方法执行无效的问题 # 1247
  - 修复 `treeTable.expandAll()` 方法隐藏所有节点导致统计栏消失的问题 # 1247
  - 修复 单元格事件中执行 `obj.update()` 方法导致树节点特征丢失的问题 # 1247/I6ZW2R
  - 优化 `treeTable expandAll()` 方法，支持展开所有节点 # 1247
  - 优化 内部代码的若干细节 # 1247
  - **调整** `customName.rootId` 属性为 `data.rootPid`
- #### layer
  - 修复 `tab` 层的样式异常问题 # I6YS0F
- #### form
  - 优化 `checkbox` 半选状态的样式 # I6YXVV
- #### laydate
  - 优化 `shortcuts` 属性机制，当点击快捷选项时自动确认 #I6YQU6
- #### menu
  - 优化 菜单项样式，以解决当点击菜单边缘时，未点击到 `<a>` 标签的问题
- #### transfer
  - 优化 `value` 属性，按其顺序渲染初始值列表 # 1235
- #### icon
  - 更新 `Edge` 图标
- #### code
  - 新增 `copy` 属性，用于开启代码复制功能图标
  - 新增 `onCopy` 回调函数，用于自定义复制事件，而不触发内置的复制操作
  - **调整** `encode` 属性，默认 `true`，即开启对 code 的编码，且预览时强制开启

### 下载： [layui-v2.8.2.zip](https://gitee.com/layui/layui/attach_files/1396155/download)

---

<h2 id="2.8.1" class="ws-anchor">
  2.8.1
  <span class="layui-badge-rim">2023-04-25</span>
</h2>

- 修复 `table.reloadData()` 未支持 `page` 属性的问题
- 修复 `treeTable` 点击排序后导致树形结构功能异常的问题 # 1232/I6YGU6
- 修复 `layer` 的 win10 风格并开启 `icon` 属性时信息框显示异常问题
- 优化 `switch` 在选中前后的尺寸差异 # I6YJO4
- 优化 `colorpicker` 点击颜色滑块时跳动到顶部的问题

### 下载： [layui-v2.8.1.zip](https://gitee.com/layui/layui/attach_files/1387965/download)

---

<h2 id="2.8.0" class="ws-anchor">
  2.8.0
  <span class="layui-badge-rim">2023-04-24</span>
</h2>

从 `2.8.0-beta.1` 到 `rc.16`，经二十个预览版的持续迭代，Layui 终于迎来了：`2.8.0` 正式版。
<br>同时，新域名下的 [新文档站](https://layui.dev) 也正式上线（导读：[Layui 新版文档站上线初衷](/notes/2.8/news.html)），新版文档亦开源在 [Github](https://github.com/layui/layui/tree/main/docs) 以供协同维护。

正是开发者们依然坚持的热爱，促使了 `Layui` 这一朴实的归来。

- #### 基础
  - 优化 css 的构建，将原先 layer/laydate/code 的 css 统一构建到 `layui.css`，以尽量减少请求
  - 变更*主色调*为：`#16baaa` <i style="display:inline-block; vertical-align: middle; width: 16px; height: 16px; padding: 3px; margin-right: 16px; border-radius: 2px; background-color: #16baaa;"></i>*在原有的墨绿基础上赋予了清新*
  - 新增 `18` 个字体图标
  - 新增 grid 布局的超大屏 `xl` 响应式支持
  - 调整 `layui.event()` 方法，当组件事件中未设定 `filter` 时则可重复执行该事件 # 1135
  - ~~剔除 layer 等部分组件的图片资源~~，全部采用字体图标和纯 css 替代实现
  - ~~剔除 layedit 内置组件~~，详见：[关于将在 v2.8.0 版本中正式剔除 layedit 组件的公告](https://gitee.com/layui/layui/issues/I5JSE3)
  - lay: 优化 `lay.options()` 方法，以提供更直观的异常提示
- #### layer
  - 新增 `anim` 属性的四个弹出方向的动画类，可实现边缘抽屉弹出，同时关闭时自动匹配对应的动画
  - 新增 `skin` 属性可选值 `layui-layer-win10` ，可设置为 Windows 10 主题风格
  - 新增 `success` 等回调的第三个参数：即当前弹层实例对象，以便操作内部方法
  - 新增 `photos` 层的私有属性 `hideFooter`，用于控制是否隐藏图片底部栏
  - 新增 `photos` 层底部栏的「查看原图」功能
  - 新增 `photos` 层对 `lay-src` 属性的支持
  - 新增 `prompt` 层的 `placeholder` 属性 # 1136
  - 新增 `removeFocus` 属性，用于是否移除弹层触发元素的焦点，避免按回车键时重复弹出 # 1143
  - 新增 `layer.closeLast(type)` 方法，用于根据弹层类型关闭最近打开的层 # I66WI2
  - 优化 document 相关事件机制，避免全局事件叠加，以及大量弹出时可能存在的内存溢出
  - 优化 window resize 事件机制，避免事件不断叠加 # I38C2O
  - 优化 所有图标, 由原来的图片改为纯 css 和字体图标
  - 优化 创建弹层的初始化逻辑，以兼容 tampermonkey 等特殊应用场景
  - 优化 内部按钮标签，避免页面设置 `<base target="_blank">` 时，点击按钮导致的打开新页面 # 830
  - 修复 多次调用` min/max` 方法后再执行 `restore` 出现的异常问题 # 1135/I5QP66
  - 修复 最大化后再调整窗口大小出现的异常问题 # 1135/I5ROMW
  - 修复 最大/小后若浏览器窗口尺寸变化，再恢复状态后可能出现的不居中或大小异常问题 # 1135
  - 修复 最小化后再恢复后执行窗口 resize 时弹层的位置异常问题 # 1135
  - 修复 鼠标右键点击弹层可以区域时导致的弹层位置大小异常的问题 # 1143
  - 调整 `prompt` 层的确认回调，支持输入空值 # 1143/I5UO7N
  - 调整 除 `msg/load/tips` 层之外的弹出触发时的焦点，默认移除触发元素失去焦点 # 1143
- #### table
  - 新增 `cellMaxWidth` 属性和表头 `maxWidth` 属性，以设定列的最大宽度
  - 新增 `colResized` 列拖拽宽度后的事件，并返回当前列的相关信息 # I3URH8/I3QDBI
  - 新增 `colToggled` 列筛选（显示或隐藏）后的事件，并返回当前列的相关信息 # I3URH8
  - 新增 返回数据中的 data 成员为非对象时的渲染支持，如 `data: ["a","b","c"]`
  - 新增 `maxHeight` 属性，用于定义表格的最大高度 # 1135/I5R6F6
  - 新增 `fieldTitle` 表头属性，用于定义表头字段标题，该属性在筛选列和导出场景中优先级高于 `title` 属性 # 1170
  - 新增 `table.setRowChecked(id, opts)` 方法，用于设置行选中状态 # I6CRL7
  - 新增 `table.getOptions(id)` 方法，用于获取指定 id 对应的表格实例配置项 # 1135
  - 新增 `table.hideCol(id, cols)` 方法，用于外部设置列的显示隐藏 # 1135/I5RUAJ
  - 新增 `rowContextmenu` 事件，用于显示行的右键菜单，需设置属性 `defaultContextmenu:false` 才生效 # 1188
  - 新增 事件返回的 `obj.setRowChecked(opts)` 方法，用于设置当前行选中状态
  - 加强 `height` 属性，可设置对父元素的高度自适应，如：`height: '#父元素id-差值'` # 1111
  - 修复 多级表头模式下的头部工具栏的筛选在重载并还原勾选后，表格存在错位问题 # 1107 # I5L0B4
  - 修复 `size: 'sm'` 时，设置 `align: 'center'` 单元格内容未完全居中的问题 # 1107
  - 修复 document 全局事件中对当前实例引用错误的问题 # 1107
  - 修复 表头 `title` 属性存在 html 标签时，头工具栏筛选栏列表中存在的异常问题 # 1107
  - 修复 `width` 属性小于 `minWidth` 时，通过拖拽列调整宽度却以 `minWidth` 为起点宽度的问题 # 1107
  - 修复 当开启 `even:true` 后，多行表头也会跟着变色的问题 # 1113
  - 修复 头工具栏筛选下拉面板被下方表格遮挡的问题，并重新优化了表格内部层级关系 # 763
  - 修复 列宽值为百分比时，其分配的宽度超出最大和最小宽度的异常问题 # 1128 I5LM4S
  - 修复 转换静态表格时，若为特殊的多级表头且存在初始主体数据时出现的错列问题 # 1135/I5QAZM
  - 修复 `table.exportFile()` 方法导出任意数据时的某些异常问题 # 1135/I5S17X
  - 修复 统计行在重载后可能出现滚动条补丁丢失，并导致跟主体对应不上的问题 # 1150
  - 修复 多级表头操作筛选列后可能出现的固定列高度异常问题 # 1170/I60WQ4
  - 修复 `edit` 事件中返回的 `obj.data` 中的对应字段未同步更新值的问题 # I6A6SL
  - 修复 点击排序后导致 `scrollPos:'fixed'` 失效的问题 # I68MBC
  - 修复 设置 `align: 'center'` 表头属性时，打印时的合计行未能跟随居中的问题
  - 修复 `table.resize()` 方法导致的在无数据或请求异常时的右侧固定列显示异常问题 # I6F72U
  - 优化 事件的回调参数，可返回当前实例配置项：`config`
  - 优化 `edit` 事件的核心逻辑，新增返回 `obj.reedit()` 方法，可实现编辑内容校验不通过时重新显示编辑
  - 优化 `edit` 事件的返回参数，新增返回 `obj.oldValue` 属性，用于获取字段修改前的旧值： #1107
  - 优化 `edit` 事件的返回参数，新增返回 `obj.getCol()` 方法，用于获取当前列表头配置信息
  - 优化 `edit` 开启后的对应单元格在鼠标 hover 时显示可编辑样式
  - 优化 `radio` 事件，当返回数据中存在 `LAY_DISABLED` 状态时不触发
  - 优化 `templet` 表头属性函数时返回的数据可包含 `LAY_COL` 特定字段
  - 优化 复杂表头细节，避免当组合表头的父级表头内容过长引起的错位问题 #1107
  - 优化 表头内容超长时可通过鼠标 hover 显示其完整内容 #1107
  - 优化 无数据时若列超出最大宽度，也显示横向滚动条，以便能查看到所有表头字段 #1110
  - 优化 过滤器,若目标元素未设 `lay-filter` 属性值，则自动取实例 `id` 值，以减少冗余的属性设置
  - 优化 导出文件功能，避免内容中存在某些特殊符导致的 excel/csv 表格错位，及避免内容被强制转换格式
  - 优化 内部模板标签符，避免 laytpl 全局设置的影响
  - 优化 UI 细节，以便整体视觉更为清爽。
  - **调整** `page,limit` 属性，当 `page` 未开启时，则默认不再向后端传递这两个参数 # I6G5BO
  - **调整** 特定字段名称。序号: `LAY_INDEX` → `LAY_NUM`；下标: `LAY_TABLE_INDEX` → `LAY_INDEX`
- #### treeTable <sup>new</sup>
  - 新增「树形表格」组件。可视为 table 组件的树形结构的延伸
  - 详细用法可参考文档（/docs/treeTable/）
- #### form
  - 新增 输入框的动静态点缀，可在前后缀添加图标等任意内容。其中动态点缀内置：清空、密码显隐功能
  - 优化 `form.render()` 方法，若参数一传入的 jQuery 对象指向表单域容器，则渲染该表单域中的所有表单项
  - 优化 `select` 选中时的样式
  - 优化 `select` 开启搜索时，在清空搜索框文本后重置选中项（而非保留上次选中的值）
  - 优化 `checkbox、radio` 对 `title` 属性值为 HTML 内容的转义
  - 优化 `checkbox` 的内置风格，以支持半选效果  # 1224
  - 优化 `radio` 的 `checked` 机制，可通过 `form.val()` 方法取消单选框的选中 # 1224
  - 修复 `select` 子元素中以 `<optgroup>` 标签开头出现的异常问题 # I5MV17
  - **调整** `checkbox` 的 `lay-skin` 属性默认为原始风格，标签风格值为 `tag`
  - **调整** `checkbox` 的私有属性 `lay-text`，采用统一的 `title` 属性替代
- #### laydate
  - 新增 `shortcuts` 属性，用于开启面板左侧的快捷选择功能 # 1135
  - 新增 `fullPanel` 属性，当 `datetime` 类型且非 range 模式，可开启日期和时间在同一面板操作 #1128
  - 新增 `theme` 属性的多主题支持
  - 新增 `circle` 圆圈高亮的内置主题
  - 新增 `autoConfirm` 属性，用于开启选中目标值时即自动确认（默认 true） # 1138/I5T3GW
  - 新增 `shade` 属性，用于开启弹出日期面板时的遮罩，其用法同 layer 的 shade 参数 # 1149
  - 新增 `rangeLinked` 属性，用于是否开启日期范围选择时的区间联动标注模式，默认不开启 # 1172
  - 新增 对目标元素重新 render 覆盖的支持 #1128
  - 新增 对目标元素上的 `lay-options` 属性识别，可覆盖 render 方法中的 options # 1128
  - 新增 `laydate.getInst()` 方法，可返回指定 `id` 或绑定节点上的 `lay-key` 属性值对应的实例 # 1128
  - 新增 `laydate.unbind()` 方法，可对目标元素解除当前实例的绑定 # 1128
  - 新增 `onConfirm/onNow/onClear` 三个属性，分别用于确认、现在、清空三个事件的回调 # I65ZQ6
  - 修复 当设置 `min/max` 后，年和月列表面板中对应的最小/大的年月值无法选中的问题 # 1128 I442FW
  - 修复 当前日期未在 `min/max` 设定的范围内，仍能点击现在按钮的问题 # 573
  - 修复 当开启 `range` 属性，并在浏览器缩放后面板出现换行的问题 # 1156
- #### colorpicker
  - 新增 `cancel` 和 `close` 回调，分别用于在取消选择和面板关闭后触发 # I3SJC7
  - 优化 事件处理机制，避免 document 的事件重复绑定
  - 优化 组件选择块的尺寸(lg/md/sm/xs)，以更好地应用于其他组件内(如 table)
  - 修复 rgba 值在 input 框中修改时会自动变成 16 进制的问题  # I5QPZZ
- #### dropdown
  - 新增 `clickScope` 属性，用于设置触发点击事件的菜单范围(如 `all` 即代表父子菜单均可触发事件) # 3NRJD
  - 新增 `shade` 属性，用于开启弹出面板时的遮罩
  - 新增 `data` 中 `disabled` 属性的支持，以禁用某一菜单项 # I6GSCD
  - 新增 对绑定元素的 `lay-options` 属性识别，可与渲染方法的 `options` 属性合并
  - 新增 `dropdown.reloadData(id, options)` 方法，用于仅重载数据或内容 # 1224
  - 新增 `dropdown.close(id)` 方法，用于关闭对应的实例面板 # 1138
  - 优化 `templet` 属性，支持函数写法
  - 优化 `click` 回调函数，当其返回 `return false` 时，点击选项可不关闭面板 # I6DUMY
  - 优化 过滤器,若目标元素未设 `lay-filter` 属性值，则自动取实例 `id` 值，以减少冗余的属性设置
  - 修正 搜索框所在 input 元素的 type 值 # 1168
  - 修复 在移动设备下，点击其他元素无法关闭面板的问题 # 1189
  - 修复 `show: true` 时，`ready` 回调未执行的问题
- #### element
  - 新增 nav 导航菜单浅色背景主题
  - 优化 nav 导航当前选中菜单样式
  - 修复 `element.progress()` 方法不支持更新分数值的问题 #622
- #### upload
  - 调整 表单域 file 字段的顺序，以适应阿里云/腾讯云中的对象存储上传规则 # 1147
  - 修复 多上传设置文件大小限制时，删除超出大小的文件仍然校验不通过的问题 # I6LR5O
- #### carousel
  - 新增 `goto` 方法，用于轮播跳转。可通过 `var inst = carousel.render()` 的实例获取 # 1128 I5LIWJ
  - 新增 对绑定元素的 `lay-options` 属性识别，可与渲染方法的 `options` 属性合并
  - 优化 `elem` 属性，可传入 `class` 选择器同时绑定多个实例
- #### tree
  - 修复 `id` 属性为长数字时的初始选中状态在某些情况存在异常的问题 #1115
- #### slider
  - 新增 `done` 属性，用于值完成选中时触发的回调，与 change 不同的是滑块拖动过程中不会触发 # I3PZBT
  - 新增 对绑定元素的 `lay-options` 属性识别，可与渲染方法的 `options` 属性合并
  - 优化 `elem` 属性，可传入 `class` 选择器同时绑定多个实例
  - 修复 `min` 非 0 时调用 setValue 设置值结果异常的问题 # 1174/I6446N
- #### rate
  - 新增 对绑定元素的 `lay-options` 属性识别，可与渲染方法的 `options` 属性合并
  - 优化 `elem` 属性，可传入 `class` 选择器同时绑定多个实例
  - 优化 部分代码存在的冗余逻辑 # 1169
- #### code
  - 新增 `preview` 属性，用于开启 Code 预览功能
  - 新增 `style/previewStyle/codeStyle` 属性，用于设 Code 区域、预览区域的样式
  - 新增 `text` 属性，用于自定义默认文本
  - 新增 `header` 属性，用于是否开启 Code 区域的头部栏
  - 新增 `layout` 属性，用于设定开启预览时的标签排列方式
  - 新增 `tools` 属性，用于开启头部右侧区域工具栏（内置：全屏）
  - 新增 `toolsEvent` 属性，用于自定义工具栏事件
  - 新增 `id` 属性，设置实例的唯一索引，以便用于其他操作
  - 新增 `className` 属性，追加实例面板的 className，以便对其自定义样式
  - 新增 `done` 属性，即执行 Code 预览后的回调函数
- #### laytpl
  - 新增 模板局部自定义标签符功能，可在 `laytpl(str, options)` 的第二个参数中设置
- #### util
  - 重构 `util.fixbar` 组件
    - 新增 `bars` 属性，用于定义任意数量的 bar 列表信息
    - 新增 `default` 属性，用于是否显示默认的 bar 列表
    - 新增 `target` 属性，用于定义插入 fixbar 节点的目标元素选择器(默认 body)
    - 新增 `scroll` 属性，用于设定 fixbar 最外层容器滚动条所在的元素，若不设置则取 target
    - 新增 `duration` 属性，用于设定 top bar 等动画时长
    - 新增 `on` 属性，用于定义列表的任意事件
    - **调整** `showHeight` 属性名称为 `margin`
  - 新增 `util.openWin(options)` 方法，用于打开浏览器新标签页

### 下载： [layui-v2.8.0.zip](https://gitee.com/layui/layui/attach_files/1385823/download)

---

历史：[2.8.0 预览版更新日志](https://gitee.com/layui/layui/issues/I6FHNK)

---

<h2 id="2.7.x" lay-toc="{href: '/2.7/docs/base/changelog.html'}">2.7.x</h2>

[前往查看](/2.7/docs/base/changelog.html) `2.7.x` 及更早前版本更新日志
