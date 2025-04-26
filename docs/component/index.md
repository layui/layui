---
title: 组件构建器 component
toc: true
---

# 组件构建器 <sup>2.10+</sup>

> 组件构建器 `component` 是 2.10 版本新增的重要模块，旨在为 Layui 2 系列版本逐步构建统一 API 规范的组件。

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| [layui.component(options)](#create) | 创建组件 |

<h3 id="create" lay-toc="{level: 2}">创建组件</h3>

`layui.component(options);`

- 参数 `options` : 基础属性选项。[#详见属性](#options)

该方法返回一个对象，包含用于组件对外的基础接口，如：组件渲染、重载、事件操作，及构造函数等等。用法示例：

```js
/**
 * tabs
 * 标签页组件
 */
layui.define('component', function(exports) {
  // 创建组件
  var component = layui.component({
    name: 'tabs', // 组件名称
    config: { // 组件默认配置项
      // …
    },
    render: function() { // 组件渲染逻辑
      // …
    },
    // 其他选项
  });

  // 将创建组件时返回的 `component` 对象作为组件的接口输出
  // 组件将继承通用的基础接口，如 render, reload, set 等方法
  exports(component.CONST.MOD_NAME, component);
});
```

<h3 id="options" lay-toc="{level: 2}">属性选项</h3>

<div>
{{- d.include("/component/detail/options.md") }}
</div>

<h2 id="export" lay-toc="{}">基础接口 🔥</h2>

通过 `component` 模块创建的组件，均会继承内部定义的「基础对外接口」和「组件渲染的通用选项」。

| 接口 | 描述 |
| --- | --- |
| [component.render(options)](#render) | 组件渲染 |
| [component.reload(id, options)](#reload) | 组件重载 |
| [component.set(options)](#set) | 设置组件渲染时的全局配置项 |
| [component.on(\'event(filter)\', callback)](#on) | 组件的自定义事件 |
| [component.getInst(id)](#getInst) | 获取组件指定的实例对象 |
| [component.removeInst(id)](#removeInst) <sup>2.10.2+</sup> | 删除组件指定的实例对象 |
| component.index | 获得组件的自增索引 |
| component.config | 获得组件渲染时的全局配置项。一般通过 `set` 方法设置 |
| component.cache | 获得组件的缓存数据集。如组件实例 ID 集 |
| [component.CONST](#CONST) | 获得组件的通用常量集。如 `MOD_NAME` 等 |
| [component.Class](#Class) | 获得组件的构造函数。一般用于扩展原型方法 |

> 😊 注：上表中的 `component` 为组件的基础对象，实际使用时，请根据实组件名称进行替换。如 `tabs` 组件，对应的接口则为：`tabs.render(options)` `tabs.on('event(filter)', callback)` 等。

<h3 id="render" lay-toc="{level: 2}">组件渲染</h3>

`component.render(options)`

- 参数 `options` : 组件渲染的配置项。可继承的通用选项见下表：

| 选项 | 描述 |
| --- | --- |
| elem | 组件渲染指定的目标元素选择器或 DOM 对象 |
| id | 组件渲染的唯一实例 ID |
| show | 是否初始即渲染组件。通常结合创建组件设定的 `isRenderOnEvent` 选项决定是否启用 |

更多渲染时的选项则由各组件内部单独定义，具体可查阅各组件对应的文档。

```js
// 以 tabs 组件为例
// 渲染
tabs.render({
  elem: '#id',
  // …
});
```

<h3 id="reload" lay-toc="{level: 2}">组件重载</h3>

`component.reload(id, options)`

- 参数 `id` : 组件实例 ID。
- 参数 `options` : 组件重载的配置项。

该方法可实现对组件的完整重载。部分组件通常还提供了「仅数据重载」，具体可参考各组件对应的文档。

```js
// 以 tabs 组件为例
// 重载 tabs 组件实例
tabs.reload('id', {
  // …
})
```

<h3 id="set" lay-toc="{level: 2}">全局设置</h3>

`component.set(options)`

- 参数 `options` : 组件渲染的配置项。

该方法用于全局设置组件渲染时的默认配置项，需在组件渲染之前执行。

```js
// 以 tabs 组件为例
// 全局设置。后续所有渲染均会生效，除非对选项进行覆盖
tabs.set({
  trigger: 'mouseenter' // 默认的触发事件
  // …
});

// 渲染实例 1
tabs.render({ id: 'id1'}); // 继承全局设置

// 渲染实例 2
tabs.render({
  id: 'id2',
  trigger: 'click' // 覆盖全局的触发事件
});
```

<h3 id="on" lay-toc="{level: 2}">事件定义</h3>

`component.on('event(id)', callback)`

- 参数 `event(id)` : 是事件的特定结构。 `event` 为事件名，支持的事件见各组件列表。`id` 为组件的实例 ID。
- 参数 `callback` : 事件回调函数。返回的参数由各组件内部单独定义。

具体事件一般由组件内部单独定义，具体可查看各组件对应的文档。

```js
// 以 tabs 组件为例：
// 组件渲染成功后的事件
tabs.on('afterRender(id)', function(data) {
  console.log(obj);
});
```

<h3 id="getInst" lay-toc="{level: 2}">获取实例</h3>

`component.getInst(id)`

- 参数 `id` : 组件的实例 ID。

该方法可获取组件渲染时对应的实例，以调用组件内部的原型方法，一般用于在外部对组件进行扩展或重构。

```js
// 以 tabs 组件为例
var tabInstance = tabs.getInst('id');
// 调用内部的标签滚动方法
tabInstance.roll();
```

<h3 id="removeInst" lay-toc="{level: 2}">删除实例 <sup>2.10.2+</sup></h3>

`component.removeInst(id)`

- 参数 `id` : 组件的实例 ID。

该方法可删除组件渲染时对应的实例，*一般在完全移除组件时使用，否则可能造成组件相关方法失效*。

```js
// 以 tabs 组件为例
tabs.removeInst('id');
```

<h3 id="CONST" lay-toc="{level: 2}">基础常量</h3>

`component.CONST`

获取组件的通用常量集，一般存放固定字符，如类名等。

```js
// 基础常量如下
component.CONST.MOD_NAME; // 组件名称
component.CONST.MOD_INDEX; // 组件自增索引
component.CONST.CLASS_THIS; // layui-this
component.CONST.CLASS_SHOW; // layui-show
component.CONST.CLASS_HIDE; // layui-hide
component.CONST.CLASS_HIDEV; // layui-hide-v
component.CONST.CLASS_DISABLED; // layui-disabled
component.CONST.CLASS_NONE; // layui-none

// 更多常量一般在各组件内部单独定义，以 tabs 组件为例
tabs.CONST.ELEM; // layui-tabs
```

<h3 id="extend" lay-toc="{level: 2}">扩展接口</h3>

除上述「基础接口」外，你也可以对接口进行任意扩展，如：

```js
/**
 * 定义组件
 */
layui.define('component', function(exports) {
  // 创建组件
  var component = layui.component({
    name: 'test',
    // …
  });
  // 扩展组件接口
  layui.$.extend(component, {
    // 以扩展一个关闭组件面板的接口为例
    close: function(id) {
      var that = component.getInst(id);
      if(!that) return this;
      that.remove(obj); // 调用原型中的 remove 方法
    }
  });
  // 输出组件接口
  exports(component.CONST.MOD_NAME, component);
});
```

```js
/**
 * 使用组件（以上述定义的 test 组件为例）
 */
layui.use('test', function() {
  var test = layui.test;
  // 渲染组件
  test.render({
    elem: '#id',
    id: 'test-1'
  });
  // 关闭组件面板（通常在某个事件中使用）
  test.close('test-1');
});
```

<h3 id="Class" lay-toc="{level: 2}">扩展原型</h3>

`component.Class`

当通过 `layui.component()` 方法创建一个新的组件时，通常需借助 `Class` 构造函数扩展组件原型，以灵活实现组件的个性化定制。但一般不推荐重写 `component.js` 原型中已经定义的基础方法，如：`init, reload, cache`

```
/**
 * 定义组件
 */
layui.define('component', function(exports) {
  // 创建组件
  var component = layui.component({
    name: '', // 组件名称
    // …
  });

  // 获取构造器
  var Class = component.Class;

  // 扩展原型
  Class.prototype.xxx = function() {
    // …
  };
  Class.prototype.aaa = function() {
    // …
  };

  // 输出组件接口
  exports(component.CONST.MOD_NAME, component);
});
```

通过 `Class` 构造函数也可以对某个组件的原型进行重构，但一般不推荐，因为这可能破坏组件的基础功能。

```
//  以 tabs 组件为例
var tabs = layui.tabs;

// 获得 tabs 组件构造函数
var Class = tabs.Class;

// 重构 tabs 组件内部的 xxx 方法（不推荐）
Class.prototype.xxx = function() {
  // …
};
```

您也可以直接参考 tabs 组件源码中关于扩展原型的具体实践。

## 💖 心语

一直以来，Layui 的很多组件自成一体，使得无法对组件进行较好的统一管理。尽管我们也曾努力尝试改善这个问题，但很多时候为了向下兼容而又不得不保留许多旧有的特性，随着组件的增加，该问题也显得越加明显。而 component 模块的出现，将在一定程度上填补这一缺憾，它的初衷正是为了确保 Layui 组件的一致性，如核心逻辑和 API 设计等，主要意义在于：**给 Layui 2 系列版本提供一个构建通用组件的方式**，增强其「生命力」。

