---
title: 更新日志
toc: true
---
 
# 更新日志

<h2 id="2.8.0" lay-toc="{title: '2.8.0'}">
  2.8.0 
  <span class="layui-badge-rim">2023-04-24</span>
</h2>

从 `2.8.0-beta.1` 到 `rc.16`，经二十个预览版的持续迭代，Layui 终于迎来了：`2.8.0` 正式版。
<br>同时，新域名下的 [新官网](https://layui.dev) 也正式上线（导读：[Layui 新版文档站上线初衷](https://gitee.com/layui/layui/issues/)），新版文档亦开源在 [Github](https://github.com/layui/layui/tree/main/docs) 以供协同维护。

正是开发者们依然坚持的热爱，促使了 `Layui` 这一朴实的归来。

- #### 基础
  - 优化 css 的构建，将原先 layer/laydate/code 的 css 统一构建到 layui.css，以尽量减少请求
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
  - 新增 `previewStyle/codeStyle` 属性，用于设 Code 区域、预览区域的样式
  - 新增 `text` 属性，用于自定义默认文本
  - 新增 `header` 属性，用于是否开启 Code 区域的头部栏
  - 新增 `layout` 属性，用于设定开启预览时的标签排列方式
  - 新增 `tools` 属性，用于开启头部右侧区域工具栏（内置：全屏）
  - 新增 `toolsEvent` 属性，用于自定义工具栏事件
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

### 下载： [layui-v2.8.0.zip](https://gitee.com/layui/layui/attach_files/)

---

<h2 id="2.7.x" lay-toc="{href: '/2.7/docs/base/changelog.html'}">2.7.x</h2>

[前往查看](/2.7/docs/base/changelog.html) `2.7.x` 及更早前版本更新日志