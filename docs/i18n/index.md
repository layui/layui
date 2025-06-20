---
title: 国际化 i18n
toc: true
---

# 国际化 <sup>2.12+</sup>

> `i18n` 是 2.12 版本新增的国际化模块，用于实现各组件消息文本的多语言支持。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<div class="ws-docs-showcase"></div>

<pre class="layui-code" lay-options="{preview: 'iframe', text: {preview: '完整演示'}, style: 'height: 560px;', layout: ['preview', 'code'], tools: ['full','window']}">
  <textarea>
{{- d.include("/i18n/detail/demo.md") }}
  </textarea>
</pre>

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var i18n = layui.i18n | 获得 `i18n` 模块。|
| [i18n.set(options)](#set) | 设置语言包及默认语言。|
| [i18n.$t(options)](#translation) | 从国际化消息中获取翻译后的内容。 |

<h3 id="set" lay-toc="{level: 2}">配置方式</h3>

i18n 支持两种配置方式，您可以根据实际场景选择任一方式。

#### 1. 通过 `i18n.set()` 方法配置

`i18n.set(options)`

- 参数 `options` : 基础属性选项。[#详见语言包选项](#options)

```js
layui.use(function() {
  var i18n = layui.i18n;

  // 设置语言
  i18n.set({
    locale: 'zh-CN', // 当前语言环境。zh-CN 为内置简体中文语言包
    messages: { // 扩展其他语言包
      'en': {},
      'zh-HK': {},
    }
  });
});
```

🔔 请注意：如果您的页面有用到 Layui 组件的自动渲染（如 table 模板配置渲染方式），因为执行顺序的问题，组件在自动渲染时可能无法读取到 `i18n.set()` 的配置信息，此时建议采用下述 `LAYUI_GLOBAL.i18n` 全局配置。

#### 2. 通过 `LAYUI_GLOBAL.i18n` 全局配置

由于 i18n 配置与组件渲染存在执行顺序问题，为了确保 i18n 配置始终在组件渲染之前生效，更推荐采用该全局配置方式。

```html
<script>
  window.LAYUI_GLOBAL = {
    // 选项同 i18n.set(options)
    i18n: {
      locale: 'zh-CN', // 当前语言环境
      messages: { // 扩展其他语言包
        'en': {},
        'zh-HK': {},
      }
    }
  };
</script>
<script src="/layui/layui.js"></script>
```

<h3 id="options" lay-toc="{level: 2}">语言包选项</h3>

i18n 默认采用简体中文（`zh-CN`）语言环境，以下为各组件消息文本对应的选项：

<div>
{{- d.include("/i18n/detail/options.md") }}
</div>


您可以基于上述选项，扩展更多语言包，如：

```js
i18n.set({
  locale: 'en', // 当前语言环境
  messages: { // 扩展更多语言包
    'en': { // 通用英语
      code: {
        copy: 'Copy Code',
        copied: 'Copied',
        // ……
      },
      // ……
    },
    'fr': {}, // 通用法语
    'zh-HK': {}, // 繁体中文
    // …… // 更多语言
  }
});
```

## 💖 心语

待写


