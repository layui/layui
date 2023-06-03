---
title: 时间线 timeline
toc: true
---
 
# 时间线

> 时间线 `timeline` 用于将时间抽象到二维平面，垂直呈现一段从过去到现在的故事。

<h2 id="examples" lay-toc="{}" style="margin-bottom: 0;">常规时间线</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-timeline">
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
    <div class="layui-timeline-content layui-text">
      <h3 class="layui-timeline-title">8月18日</h3>
      <p>
        多年前，Layui 2.0 的发布前夜，记录着这样的一段心理活动。
        <br>这是一个怎样的版本？它将受众如何？
        <br>又是谁在指引着我去创作，是基于成就感的驱动，还是试图建立我与客观世界的某种沟通 <i class="layui-icon">&#xe650;</i>
      </p>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
    <div class="layui-timeline-content layui-text">
      <h3 class="layui-timeline-title">8月16日</h3>
      <p>Layui 使用率最高的组件有</p>
      <ul>
        <li>layer</li>
        <li>table</li>
        <li>form</li>
      </ul>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
    <div class="layui-timeline-content layui-text">
      <h3 class="layui-timeline-title">8月15日</h3>
      <p>
        这片广袤的土地孕育了璀璨的华夏文化，和我们这个饱受沧桑的民族。
        <br>勤劳、淳朴、善良而又充满智慧的国人，一代又一代人的艰苦奋斗，古老的文明重新焕发出光彩。
      </p>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
    <div class="layui-timeline-content layui-text">
      <div class="layui-timeline-title">过去</div>
    </div>
  </div>
</div>
  </textarea>
</pre>

时间线上的图标可任意定义，右侧内容区域可自由填充。

<h2 id="timeline" lay-toc="{}">简约时间线</h2>

<pre class="layui-code" lay-options="{preview: true, previewStyle: 'padding-top: 32px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-timeline">
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis layui-icon-face-smile"></i>
    <div class="layui-timeline-content layui-text">
      <div class="layui-timeline-title">2023年，Layui 情怀版本 2.8.0 发布，新官网上线，且文档全部重写并开源。</div>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis layui-icon-face-cry"></i>
    <div class="layui-timeline-content layui-text">
      <div class="layui-timeline-title">2021年，Layui 原官网下线，此后 Layui 进入两年的低谷期。</div>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis layui-icon-fire"></i>
    <div class="layui-timeline-content layui-text">
      <div class="layui-timeline-title">2017年，Layui 里程碑版本 2.0.0 发布，此后 Layui 进入三年的高光期。</div>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-timeline-axis layui-icon-circle"></i>
    <div class="layui-timeline-content layui-text">
      <div class="layui-timeline-title">2016年，Layui 首个版本发布</div>
    </div>
  </div>
  <div class="layui-timeline-item">
    <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop layui-timeline-axis">&#xe63e;</i>
    <div class="layui-timeline-content layui-text">
      <div class="layui-timeline-title">最初，Layui 在爱与期许中孵化。</div>
    </div>
  </div>
</div>
  </textarea>
</pre>

透过这示例，见证 Layui 的起起伏伏。