---
title: 辅助元素 blockquote,fieldset,hr
toc: true
---
 
# 辅助元素

> 辅助元素是指对 `blockquote,fieldset,hr` 等标签的美化，主要是静态展示作用。

<h2 id="blockquote" lay-toc="{}" style="margin-bottom: 0;">引用</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<blockquote class="lay-elem-quote">
  引用内容，默认风格
</blockquote>

<blockquote class="lay-elem-quote lay-quote-nm">
  引用内容，边框风格
</blockquote>
  </textarea>
</pre>

<h2 id="fieldset" lay-toc="{}" style="margin-bottom: 0;">字段集</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<fieldset class="lay-elem-field">
  <legend>标题</legend>
  <div class="lay-field-box">
    任意内容
  </div>
</fieldset>
 
<hr class="ws-space-16">
 
<fieldset class="lay-elem-field lay-field-title">
  <legend>仅显示标题水平线</legend>
</fieldset>
内容写在外面
  </textarea>
</pre>


<h2 id="hr" lay-toc="{}" style="margin-bottom: 0;">水平线</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
默认分割线
<hr>
 
赤色分割线
<hr class="lay-border-red">
 
橙色分割线
<hr class="lay-border-orange">
 
墨绿分割线
<hr class="lay-border-green">
 
青色分割线
<hr class="lay-border-cyan">
 
蓝色分割线
<hr class="lay-border-blue">
 
深色分割线
<hr class="lay-border-black">
  </textarea>
</pre>
