
# v1.0.7  2016-11-30

* 修复发布1.0.6时，因构建工具的重写引发的一些列样式问题


---


# v1.0.6  2016-11-30

* 修复导航点击二级菜单时，未取消其它菜单的bug
* 修复上传按钮与表单组2px偏差

* 当引入layui.all.js时，如果仍然使用了layui.use，则不加载相应模块（因为layui.all.js已包含）。
* 剔除 layui.all(callback) 方法，如果要用到全部模块，直接用 layui.all.js 的方式即可
* 整个框架文件减少了 150kb


---


# v1.0.5  2016-11-29

* 增加多种table样式（表格相关的功能和数据操作会在 2.0大版本时推出）

* Flow模块的信息流改为从第一页开始，done在初始时就会执行一次（更新时请特别注意，在你用到flow的地方进行微调，详见最新文档。为之前这个愚蠢的机制表示抱歉！）
* Flow模块的信息流剔除参数：isShowEnd
* Flow模块的信息流新增参数：end，用于显示末页内容（默认为：没有更多了）
* 导航菜单新增点击事件监听：element.on('nav(filter)', callback);
* 导航二级菜单增加当前选中样式，并对导航增加点击选中事件
* 导航一级菜单的树形选中块调短，及多处细节调整

* 修复表单select选择下拉时对浏览器滚动条造成的不良体验
* 修复如果对Tab选项卡设置了lay-allowClose属性，新增选项卡时未出现关闭图标的bug
* 修复layer组件如果end回调中再执行close出现死循环的问题


---


# v1.0.4  2016-11-18

* Tab选项卡新增用于添加Tab选项的接口：element.tabAdd(filter, options);
* Tab选项卡新增用于外部删除Tab选项的接口：element.tabDelete(filter, index);
* Tab选项卡新增用于动态切换的接口：element.tabChange(filter, index);
* 表单组select、checkbox、radio等新增 disabled 属性的禁用支持

* 修复水平导航二级菜单在ie8下无法使用的bug
* 修复layPage分页在ie8的样式兼容问题
* 修复Form表单组radio框使用name="a[b]"、name="a.b"这种格式出现报错的bug
* 修复在使用了element.init()后，Tab选项卡的相关事件出现多次执行的bug
* 修复在使用了element.init()后，面包屑重复插入了分隔符的bug

* checkbox框样式调整，勾选图标放在左侧
* 导航菜单在ie10以下浏览器开启了hover效果


---


# v1.0.3  2016-11-10

* 集成 layer 3.0
* 重点增加导航菜单的二级菜单支持（水平导航和树形导航都支持）
* 表单select增加optgroup的分组支持
* 富文本编辑器新增获取选中内容的方法：layedit.getSelection(index)

* 修复layer模块无法使用layer.config的extend来加载拓展皮肤的bug
* 修复Tab选项卡与select的小冲突
* 修复Tab选项卡简洁模式与内容区域的导航的样式小冲突
* 修复Tab选项卡与内容区域的子Tab选项卡存在冲突的bug
* 修除表单组label标签、layDate与第三方框架（如Bootstrap）的样式冲突
* 修复flow流加载模块的的信息流，在设置isLazyimg:true时下拉报错的bug

* 表单select内容若超出最大宽度，则自适应宽度
* layui.js合并到layui.all.js中，也就是说，如果你不采用layui模块化规范，只需引入layui.all.js即可。


---


# v1.0.2 2016-10-18

* 修复layui.data('table', null); 无法删除本地表的bug
* 修改自定义事件监听机制

* 新增“引用”的区块多套显示风格
* 新增“字段集”多套显示风格
* 新增“纯圆角”公共CSS类
* 新增 hr标签 全局初始化CSS类

* 富文本编辑器增加用于同步编辑器内容到textarea的sync方法（一般用于异步提交）
* 修复富文本编辑器点击编辑区域无法关闭表情的bug
* 修复富文本编辑器未正确把内容同步到textarea的较严重bug
* 修复富文本编辑器中的一个css语法错误
* 修复表单input框ie8下某些小兼容问题

* 将复选框风格瘦身（因为群众普遍认为之前的“复选框”实在太胖了）
* 将表单下边距由20px调整为15px
* 完善表单响应式
* 处理layPage分页可能被第三方框架（如Bootstrap）引发的样式冲突

