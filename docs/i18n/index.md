---
title: 国际化 i18n
toc: true
---

# 国际化 <sup>2.12+</sup>

> `i18n` 是 2.12 版本新增的国际化模块，用于实现各组件提示文本的多语言支持。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<div class="ws-docs-showcase"></div>

<pre class="layui-code" lay-options="{preview: 'iframe', style: 'height: 560px;', layout: ['preview', 'code'], tools: ['full','window']}">
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

<h3 id="set" lay-toc="{level: 2}">国际化配置</h3>

i18n 支持两种配置方式，您可以根据实际场景选择任一方式。

#### 1. 通过 `i18n.set()` 方法配置

`i18n.set(options)`

- 参数 `options` : 基础属性选项。[#详见选项](#options)

#### 2. 通过 `LAYUI_GLOBAL.i18n` 全局配置

该方式通常用于 Layui 内置组件的自动渲染时的场景，需放置在 `layui.js` 导入之前，以确保国际化配置在组件渲染之前完成。

```html
<script>
  window.LAYUI_GLOBAL = {
    // 选项同 i18n.set(options)
    i18n: {
      locale: 'zh-CN',
      messages: {
        'en': {},
        'zh-HK': {},
      }
    }
  };
</script>
<script src="/layui/layui.js"></script>
```

<h3 id="options" lay-toc="{level: 2}">选项</h3>

<div>
{{- d.include("/i18n/detail/options.md") }}
</div>

## 💖 心语



