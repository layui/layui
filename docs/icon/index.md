---
title: 图标
toc: true
---
 
# 图标

> Layui 图标采用字体形式，取材于阿里巴巴矢量图标库 `iconfont`，因此可以把一个 `icon` 看作是一个普通的文本，直接通过 `css` 即可设定其样式。图标支持 `font-class` 或 `unicode` 两种格式。

<h2 id="examples" lay-toc="">示例</h2>

<pre class="lay-code" lay-options="{preview: true}">
  <textarea>
<i class="lay-icon lay-icon-face-smile"></i> 
<div>
  你可以去定义它的颜色或者大小，如：  
  <i class="lay-icon lay-icon-face-smile" style="font-size: 30px; color: #1E9FFF;"></i> 
</div>
  </textarea>
</pre>

通过对一个内联元素（如 `<i>`标签）添加基础类 `class="lay-icon"` 来定义一个图标，然后对元素加上图标对应的 `font-class`，即可显示出你想要的图标，如上所示。


<h2 id="list" lay-toc="{hot: true, title: '图标列表'}">图标列表（192 个）</h2>

<div class="ws-docs-icon">
  <div>
    <i class="lay-icon lay-icon-bot"></i>
    <div class="docs-icon-name">机器人</div>
    <div class="docs-icon-code">&amp;#xe7d6;</div>
    <div class="docs-icon-fontclass">lay-icon-bot</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-leaf"></i>
    <div class="docs-icon-name">叶子节点</div>
    <div class="docs-icon-code">&amp;#xe701;</div>
    <div class="docs-icon-fontclass">lay-icon-leaf</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-folder" style="font-size: 32px;"></i>
    <div class="docs-icon-name">文件夹</div>
    <div class="docs-icon-code">&amp;#xeabe;</div>
    <div class="docs-icon-fontclass">lay-icon-folder</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-folder-open" style="font-size: 32px;"></i>
    <div class="docs-icon-name">文件夹打开</div>
    <div class="docs-icon-code">&amp;#xeac1;</div>
    <div class="docs-icon-fontclass lay-font-12">lay-icon-folder-open</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-gitee"></i>
    <div class="docs-icon-name">Gitee</div>
    <div class="docs-icon-code">&amp;#xe69b;</div>
    <div class="docs-icon-fontclass">lay-icon-gitee</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-github"></i>
    <div class="docs-icon-name">Github</div>
    <div class="docs-icon-code">&amp;#xe6a7;</div>
    <div class="docs-icon-fontclass">lay-icon-github</div>
  </div>

  <div>
    <i class="lay-icon lay-icon-light"></i>
    <div class="docs-icon-name">太阳/明亮</div>
    <div class="docs-icon-code">&amp;#xe748;</div>
    <div class="docs-icon-fontclass">lay-icon-light</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-moon"></i>
    <div class="docs-icon-name">月亮</div>
    <div class="docs-icon-code">&amp;#xe6c2;</div>
    <div class="docs-icon-fontclass">lay-icon-moon</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-error"></i>
    <div class="docs-icon-name">错误</div>
    <div class="docs-icon-code">&amp;#xe693;</div>
    <div class="docs-icon-fontclass">lay-icon-error</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-success"></i>
    <div class="docs-icon-name">成功</div>
    <div class="docs-icon-code">&amp;#xe697;</div>
    <div class="docs-icon-fontclass">lay-icon-success</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-question"></i>
    <div class="docs-icon-name">问号</div>
    <div class="docs-icon-code">&amp;#xe699;</div>
    <div class="docs-icon-fontclass">lay-icon-question</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-lock"></i>
    <div class="docs-icon-name">锁定</div>
    <div class="docs-icon-code">&amp;#xe69a;</div>
    <div class="docs-icon-fontclass">lay-icon-lock</div>
  </div>

  <div>
    <i class="lay-icon lay-icon-eye"></i>
    <div class="docs-icon-name">显示</div>
    <div class="docs-icon-code">&amp;#xe695;</div>
    <div class="docs-icon-fontclass">lay-icon-eye</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-eye-invisible"></i>
    <div class="docs-icon-name">隐藏</div>
    <div class="docs-icon-code">&amp;#xe696;</div>
    <div class="docs-icon-fontclass">lay-icon-eye-invisible</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-clear"></i>
    <div class="docs-icon-name">清空/删除</div>
    <div class="docs-icon-code">&amp;#xe788;</div>
    <div class="docs-icon-fontclass">lay-icon-clear</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-backspace"></i>
    <div class="docs-icon-name">退格</div>
    <div class="docs-icon-code">&amp;#xe694;</div>
    <div class="docs-icon-fontclass">lay-icon-backspace</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-disabled"></i>
    <div class="docs-icon-name">禁用</div>
    <div class="docs-icon-code">&amp;#xe6cc;</div>
    <div class="docs-icon-fontclass">lay-icon-disabled</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-tips-fill"></i>
    <div class="docs-icon-name">感叹号/提示</div>
    <div class="docs-icon-code">&amp;#xeb2e;</div>
    <div class="docs-icon-fontclass">lay-icon-tips-fill</div>
  </div>

  <div>
    <i class="lay-icon lay-icon-test"></i>
    <div class="docs-icon-name">测试/K线图</div>
    <div class="docs-icon-code">&amp;#xe692;</div>
    <div class="docs-icon-fontclass">lay-icon-test</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-music"></i>
    <div class="docs-icon-name">音乐/音符</div>
    <div class="docs-icon-code">&amp;#xe690;</div>
    <div class="docs-icon-fontclass">lay-icon-music</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-chrome"></i>
    <div class="docs-icon-name">Chrome</div>
    <div class="docs-icon-code">&amp;#xe68a;</div>
    <div class="docs-icon-fontclass">lay-icon-chrome</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-firefox"></i>
    <div class="docs-icon-name">Firefox</div>
    <div class="docs-icon-code">&amp;#xe686;</div>
    <div class="docs-icon-fontclass">lay-icon-firefox</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-edge"></i>
    <div class="docs-icon-name">Edge</div>
    <div class="docs-icon-code">&amp;#xe68b;</div>
    <div class="docs-icon-fontclass">lay-icon-edge</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-ie"></i>
    <div class="docs-icon-name">IE</div>
    <div class="docs-icon-code">&amp;#xe7bb;</div>
    <div class="docs-icon-fontclass">lay-icon-ie</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-heart-fill"></i>
    <div class="docs-icon-name">实心</div>
    <div class="docs-icon-code">&amp;#xe68f;</div>
    <div class="docs-icon-fontclass">lay-icon-heart-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-heart"></i>
    <div class="docs-icon-name">空心</div>
    <div class="docs-icon-code">&amp;#xe68c;</div>
    <div class="docs-icon-fontclass">lay-icon-heart</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-time"></i>
    <div class="docs-icon-name">时间/历史</div>
    <div class="docs-icon-code">&amp;#xe68d;</div>
    <div class="docs-icon-fontclass">lay-icon-time</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-at"></i>
    <div class="docs-icon-name">@艾特</div>
    <div class="docs-icon-code">&amp;#xe687;</div>
    <div class="docs-icon-fontclass">lay-icon-at</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-email"></i>
    <div class="docs-icon-name">邮箱</div>
    <div class="docs-icon-code">&amp;#xe618;</div>
    <div class="docs-icon-fontclass">lay-icon-email</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-rss"></i>
    <div class="docs-icon-name">RSS</div>
    <div class="docs-icon-code">&amp;#xe808;</div>
    <div class="docs-icon-fontclass">lay-icon-rss</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-sound"></i>
    <div class="docs-icon-name">声音</div>
    <div class="docs-icon-code">&amp;#xe69d;</div>
    <div class="docs-icon-fontclass">lay-icon-sound</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-mute"></i>
    <div class="docs-icon-name">静音</div>
    <div class="docs-icon-code">&amp;#xe685;</div>
    <div class="docs-icon-fontclass">lay-icon-mute</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-mike"></i>
    <div class="docs-icon-name">录音/麦克风</div>
    <div class="docs-icon-code">&amp;#xe6dc;</div>
    <div class="docs-icon-fontclass">lay-icon-mike</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-key"></i>
    <div class="docs-icon-name">密钥/钥匙</div>
    <div class="docs-icon-code">&amp;#xe683;</div>
    <div class="docs-icon-fontclass">lay-icon-key</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-gift"></i>
    <div class="docs-icon-name">礼物/活动</div>
    <div class="docs-icon-code">&amp;#xe627;</div>
    <div class="docs-icon-fontclass">lay-icon-gift</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-bluetooth"></i>
    <div class="docs-icon-name">蓝牙</div>
    <div class="docs-icon-code">&amp;#xe689;</div>
    <div class="docs-icon-fontclass">lay-icon-bluetooth</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-wifi"></i>
    <div class="docs-icon-name">WiFi</div>
    <div class="docs-icon-code">&amp;#xe7e0;</div>
    <div class="docs-icon-fontclass">lay-icon-wifi</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-logout"></i>
    <div class="docs-icon-name">退出/注销</div>
    <div class="docs-icon-code">&amp;#xe682;</div>
    <div class="docs-icon-fontclass">lay-icon-logout</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-android"></i>
    <div class="docs-icon-name">Android 安卓</div>
    <div class="docs-icon-code">&amp;#xe684;</div>
    <div class="docs-icon-fontclass">lay-icon-android</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-ios"></i>
    <div class="docs-icon-name">Apple IOS 苹果</div>
    <div class="docs-icon-code">&amp;#xe680;</div>
    <div class="docs-icon-fontclass">lay-icon-ios</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-windows"></i>
    <div class="docs-icon-name">Windows</div>
    <div class="docs-icon-code">&amp;#xe67f;</div>
    <div class="docs-icon-fontclass">lay-icon-windows</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-transfer"></i>
    <div class="docs-icon-name">穿梭框</div>
    <div class="docs-icon-code">&amp;#xe691;</div>
    <div class="docs-icon-fontclass">lay-icon-transfer</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-service"></i>
    <div class="docs-icon-name">客服</div>
    <div class="docs-icon-code">&amp;#xe626;</div>
    <div class="docs-icon-fontclass">lay-icon-service</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-subtraction"></i>
    <div class="docs-icon-name">减</div>
    <div class="docs-icon-code">&amp;#xe67e;</div>
    <div class="docs-icon-fontclass">lay-icon-subtraction</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-addition"></i>
    <div class="docs-icon-name">加</div>
    <div class="docs-icon-code">&amp;#xe624;</div>
    <div class="docs-icon-fontclass">lay-icon-addition</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-slider"></i>
    <div class="docs-icon-name">滑块</div>
    <div class="docs-icon-code">&amp;#xe714;</div>
    <div class="docs-icon-fontclass">lay-icon-slider</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-print"></i>
    <div class="docs-icon-name">打印</div>
    <div class="docs-icon-code">&amp;#xe66d;</div>
    <div class="docs-icon-fontclass">lay-icon-print</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-export"></i>
    <div class="docs-icon-name">导出</div>
    <div class="docs-icon-code">&amp;#xe67d;</div>
    <div class="docs-icon-fontclass">lay-icon-export</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-cols"></i>
    <div class="docs-icon-name">列</div>
    <div class="docs-icon-code">&amp;#xe610;</div>
    <div class="docs-icon-fontclass">lay-icon-cols</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-screen-restore"></i>
    <div class="docs-icon-name">退出全屏</div>
    <div class="docs-icon-code">&amp;#xe758;</div>
    <div class="docs-icon-fontclass">lay-icon-screen-restore</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-screen-full"></i>
    <div class="docs-icon-name">全屏</div>
    <div class="docs-icon-code">&amp;#xe622;</div>
    <div class="docs-icon-fontclass">lay-icon-screen-full</div>
  </div>

  <div>
    <i class="lay-icon lay-icon-rate-half"></i>
    <div class="docs-icon-name">半星</div>
    <div class="docs-icon-code">&amp;#xe6c9;</div>
    <div class="docs-icon-fontclass">lay-icon-rate-half</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-rate"></i>
    <div class="docs-icon-name">星星-空心</div>
    <div class="docs-icon-code">&amp;#xe67b;</div>
    <div class="docs-icon-fontclass">lay-icon-rate</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-rate-solid"></i>
    <div class="docs-icon-name">星星-实心</div>
    <div class="docs-icon-code">&amp;#xe67a;</div>
    <div class="docs-icon-fontclass">lay-icon-rate-solid</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-cellphone"></i>
    <div class="docs-icon-name">手机</div>
    <div class="docs-icon-code">&amp;#xe678;</div>
    <div class="docs-icon-fontclass">lay-icon-cellphone</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-vercode"></i>
    <div class="docs-icon-name">验证码</div>
    <div class="docs-icon-code">&amp;#xe679;</div>
    <div class="docs-icon-fontclass">lay-icon-vercode</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-login-wechat"></i>
    <div class="docs-icon-name">微信</div>
    <div class="docs-icon-code">&amp;#xe677;</div>
    <div class="docs-icon-fontclass">lay-icon-login-wechat</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-login-qq"></i>
    <div class="docs-icon-name">QQ</div>
    <div class="docs-icon-code">&amp;#xe676;</div>
    <div class="docs-icon-fontclass">lay-icon-login-qq</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-login-weibo"></i>
    <div class="docs-icon-name">微博</div>
    <div class="docs-icon-code">&amp;#xe675;</div>
    <div class="docs-icon-fontclass">lay-icon-login-weibo</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-password"></i>
    <div class="docs-icon-name">密码</div>
    <div class="docs-icon-code">&amp;#xe673;</div>
    <div class="docs-icon-fontclass">lay-icon-password</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-username"></i>
    <div class="docs-icon-name">用户名</div>
    <div class="docs-icon-code">&amp;#xe66f;</div>
    <div class="docs-icon-fontclass">lay-icon-username</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-refresh-3"></i>
    <div class="docs-icon-name">刷新-粗</div>
    <div class="docs-icon-code">&amp;#xe9aa;</div>
    <div class="docs-icon-fontclass">lay-icon-refresh-3</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-auz"></i>
    <div class="docs-icon-name">授权</div>
    <div class="docs-icon-code">&amp;#xe672;</div>
    <div class="docs-icon-fontclass">lay-icon-auz</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-spread-left"></i>
    <div class="docs-icon-name">左向右伸缩菜单</div>
    <div class="docs-icon-code">&amp;#xe66b;</div>
    <div class="docs-icon-fontclass">lay-icon-spread-left</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-shrink-right"></i>
    <div class="docs-icon-name">右向左伸缩菜单</div>
    <div class="docs-icon-code">&amp;#xe668;</div>
    <div class="docs-icon-fontclass">lay-icon-shrink-right</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-snowflake"></i>
    <div class="docs-icon-name">雪花</div>
    <div class="docs-icon-code">&amp;#xe6b1;</div>
    <div class="docs-icon-fontclass">lay-icon-snowflake</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-tips"></i>
    <div class="docs-icon-name">提示说明</div>
    <div class="docs-icon-code">&amp;#xe702;</div>
    <div class="docs-icon-fontclass">lay-icon-tips</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-note"></i>
    <div class="docs-icon-name">便签</div>
    <div class="docs-icon-code">&amp;#xe66e;</div>
    <div class="docs-icon-fontclass">lay-icon-note</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-home"></i>
    <div class="docs-icon-name">主页</div>
    <div class="docs-icon-code">&amp;#xe68e;</div>
    <div class="docs-icon-fontclass">lay-icon-home</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-senior"></i>
    <div class="docs-icon-name">高级</div>
    <div class="docs-icon-code">&amp;#xe674;</div>
    <div class="docs-icon-fontclass">lay-icon-senior</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-refresh"></i>
    <div class="docs-icon-name">刷新</div>
    <div class="docs-icon-code">&amp;#xe669;</div>
    <div class="docs-icon-fontclass">lay-icon-refresh</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-refresh-1"></i>
    <div class="docs-icon-name">刷新</div>
    <div class="docs-icon-code">&amp;#xe666;</div>
    <div class="docs-icon-fontclass">lay-icon-refresh-1</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-flag"></i>
    <div class="docs-icon-name">旗帜</div>
    <div class="docs-icon-code">&amp;#xe66c;</div>
    <div class="docs-icon-fontclass">lay-icon-flag</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-theme"></i>
    <div class="docs-icon-name">主题</div>
    <div class="docs-icon-code">&amp;#xe66a;</div>
    <div class="docs-icon-fontclass">lay-icon-theme</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-notice"></i>
    <div class="docs-icon-name">消息-通知</div>
    <div class="docs-icon-code">&amp;#xe667;</div>
    <div class="docs-icon-fontclass">lay-icon-notice</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-website"></i>
    <div class="docs-icon-name">网站</div>
    <div class="docs-icon-code">&amp;#xe7ae;</div>
    <div class="docs-icon-fontclass">lay-icon-website</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-console"></i>
    <div class="docs-icon-name">控制台</div>
    <div class="docs-icon-code">&amp;#xe665;</div>
    <div class="docs-icon-fontclass">lay-icon-console</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-face-surprised"></i>
    <div class="docs-icon-name">表情-惊讶</div>
    <div class="docs-icon-code">&amp;#xe664;</div>
    <div class="docs-icon-fontclass">lay-icon-face-surprised</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-set"></i>
    <div class="docs-icon-name">设置-空心</div>
    <div class="docs-icon-code">&amp;#xe716;</div>
    <div class="docs-icon-fontclass">lay-icon-set</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-template-1"></i>
    <div class="docs-icon-name">模板</div>
    <div class="docs-icon-code">&amp;#xe656;</div>
    <div class="docs-icon-fontclass">lay-icon-template-1</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-app"></i>
    <div class="docs-icon-name">应用</div>
    <div class="docs-icon-code">&amp;#xe653;</div>
    <div class="docs-icon-fontclass">lay-icon-app</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-template"></i>
    <div class="docs-icon-name">模板</div>
    <div class="docs-icon-code">&amp;#xe663;</div>
    <div class="docs-icon-fontclass">lay-icon-template</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-praise"></i>
    <div class="docs-icon-name">赞</div>
    <div class="docs-icon-code">&amp;#xe6c6;</div>
    <div class="docs-icon-fontclass">lay-icon-praise</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-tread"></i>
    <div class="docs-icon-name">踩</div>
    <div class="docs-icon-code">&amp;#xe6c5;</div>
    <div class="docs-icon-fontclass">lay-icon-tread</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-male"></i>
    <div class="docs-icon-name">男</div>
    <div class="docs-icon-code">&amp;#xe662;</div>
    <div class="docs-icon-fontclass">lay-icon-male</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-female"></i>
    <div class="docs-icon-name">女</div>
    <div class="docs-icon-code">&amp;#xe661;</div>
    <div class="docs-icon-fontclass">lay-icon-female</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-camera"></i>
    <div class="docs-icon-name">相机-空心</div>
    <div class="docs-icon-code">&amp;#xe660;</div>
    <div class="docs-icon-fontclass">lay-icon-camera</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-camera-fill"></i>
    <div class="docs-icon-name">相机-实心</div>
    <div class="docs-icon-code">&amp;#xe65d;</div>
    <div class="docs-icon-fontclass">lay-icon-camera-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-more"></i>
    <div class="docs-icon-name">菜单-水平</div>
    <div class="docs-icon-code">&amp;#xe65f;</div>
    <div class="docs-icon-fontclass">lay-icon-more</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-more-vertical"></i>
    <div class="docs-icon-name">菜单-垂直</div>
    <div class="docs-icon-code">&amp;#xe671;</div>
    <div class="docs-icon-fontclass">lay-icon-more-vertical</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-rmb"></i>
    <div class="docs-icon-name">金额-人民币</div>
    <div class="docs-icon-code">&amp;#xe65e;</div>
    <div class="docs-icon-fontclass">lay-icon-rmb</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-dollar"></i>
    <div class="docs-icon-name">金额-美元</div>
    <div class="docs-icon-code">&amp;#xe659;</div>
    <div class="docs-icon-fontclass">lay-icon-dollar</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-diamond"></i>
    <div class="docs-icon-name">钻石-等级</div>
    <div class="docs-icon-code">&amp;#xe735;</div>
    <div class="docs-icon-fontclass">lay-icon-diamond</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-fire"></i>
    <div class="docs-icon-name">火</div>
    <div class="docs-icon-code">&amp;#xe756;</div>
    <div class="docs-icon-fontclass">lay-icon-fire</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-return"></i>
    <div class="docs-icon-name">返回</div>
    <div class="docs-icon-code">&amp;#xe65c;</div>
    <div class="docs-icon-fontclass">lay-icon-return</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-location"></i>
    <div class="docs-icon-name">位置-地图</div>
    <div class="docs-icon-code">&amp;#xe715;</div>
    <div class="docs-icon-fontclass">lay-icon-location</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-read"></i>
    <div class="docs-icon-name">办公-阅读</div>
    <div class="docs-icon-code">&amp;#xe705;</div>
    <div class="docs-icon-fontclass">lay-icon-read</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-survey"></i>
    <div class="docs-icon-name">调查</div>
    <div class="docs-icon-code">&amp;#xe6b2;</div>
    <div class="docs-icon-fontclass">lay-icon-survey</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-face-smile"></i>
    <div class="docs-icon-name">表情-微笑</div>
    <div class="docs-icon-code">&amp;#xe6af;</div>
    <div class="docs-icon-fontclass">lay-icon-face-smile</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-face-cry"></i>
    <div class="docs-icon-name">表情-哭泣</div>
    <div class="docs-icon-code">&amp;#xe69c;</div>
    <div class="docs-icon-fontclass">lay-icon-face-cry</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-cart-simple"></i>
    <div class="docs-icon-name">购物车</div>
    <div class="docs-icon-code">&amp;#xe698;</div>
    <div class="docs-icon-fontclass">lay-icon-cart-simple</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-cart"></i>
    <div class="docs-icon-name">购物车</div>
    <div class="docs-icon-code">&amp;#xe657;</div>
    <div class="docs-icon-fontclass">lay-icon-cart</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-next"></i>
    <div class="docs-icon-name">下一页</div>
    <div class="docs-icon-code">&amp;#xe65b;</div>
    <div class="docs-icon-fontclass">lay-icon-next</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-prev"></i>
    <div class="docs-icon-name">上一页</div>
    <div class="docs-icon-code">&amp;#xe65a;</div>
    <div class="docs-icon-fontclass">lay-icon-prev</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-upload-drag"></i>
    <div class="docs-icon-name">上传-空心-拖拽</div>
    <div class="docs-icon-code">&amp;#xe681;</div>
    <div class="docs-icon-fontclass">lay-icon-upload-drag</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-upload"></i>
    <div class="docs-icon-name">上传-实心</div>
    <div class="docs-icon-code">&amp;#xe67c;</div>
    <div class="docs-icon-fontclass">lay-icon-upload</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-download-circle"></i>
    <div class="docs-icon-name">下载-圆圈</div>
    <div class="docs-icon-code">&amp;#xe601;</div>
    <div class="docs-icon-fontclass">lay-icon-download-circle</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-component"></i>
    <div class="docs-icon-name">组件</div>
    <div class="docs-icon-code">&amp;#xe857;</div>
    <div class="docs-icon-fontclass">lay-icon-component</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-file-b"></i>
    <div class="docs-icon-name">文件-粗</div>
    <div class="docs-icon-code">&amp;#xe655;</div>
    <div class="docs-icon-fontclass">lay-icon-file-b</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-user"></i>
    <div class="docs-icon-name">用户</div>
    <div class="docs-icon-code">&amp;#xe770;</div>
    <div class="docs-icon-fontclass">lay-icon-user</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-find-fill"></i>
    <div class="docs-icon-name">发现-实心</div>
    <div class="docs-icon-code">&amp;#xe670;</div>
    <div class="docs-icon-fontclass">lay-icon-find-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-loading lay-anim lay-anim-rotate lay-anim-loop"></i>
    <div class="docs-icon-name">loading</div>
    <div class="docs-icon-code">&amp;#xe63d;</div>
    <div class="docs-icon-fontclass">lay-icon-loading</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-loading-1 lay-anim lay-anim-rotate lay-anim-loop"></i>
    <div class="docs-icon-name">loading</div>
    <div class="docs-icon-code">&amp;#xe63e;</div>
    <div class="docs-icon-fontclass">lay-icon-loading-1</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-add-1"></i>
    <div class="docs-icon-name">添加</div>
    <div class="docs-icon-code">&amp;#xe654;</div>
    <div class="docs-icon-fontclass">lay-icon-add-1</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-play"></i>
    <div class="docs-icon-name">播放</div>
    <div class="docs-icon-code">&amp;#xe652;</div>
    <div class="docs-icon-fontclass">lay-icon-play</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-pause"></i>
    <div class="docs-icon-name">暂停</div>
    <div class="docs-icon-code">&amp;#xe651;</div>
    <div class="docs-icon-fontclass">lay-icon-pause</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-headset"></i>
    <div class="docs-icon-name">音频-耳机</div>
    <div class="docs-icon-code">&amp;#xe6fc;</div>
    <div class="docs-icon-fontclass">lay-icon-headset</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-video"></i>
    <div class="docs-icon-name">视频</div>
    <div class="docs-icon-code">&amp;#xe6ed;</div>
    <div class="docs-icon-fontclass">lay-icon-video</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-voice"></i>
    <div class="docs-icon-name">语音-声音</div>
    <div class="docs-icon-code">&amp;#xe688;</div>
    <div class="docs-icon-fontclass">lay-icon-voice</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-speaker"></i>
    <div class="docs-icon-name">消息-通知-喇叭</div>
    <div class="docs-icon-code">&amp;#xe645;</div>
    <div class="docs-icon-fontclass">lay-icon-speaker</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-fonts-del"></i>
    <div class="docs-icon-name">删除线</div>
    <div class="docs-icon-code">&amp;#xe64f;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-del</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-fonts-code"></i>
    <div class="docs-icon-name">代码</div>
    <div class="docs-icon-code">&amp;#xe64e;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-code</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-fonts-html"></i>
    <div class="docs-icon-name">HTML</div>
    <div class="docs-icon-code">&amp;#xe64b;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-html</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-fonts-strong"></i>
    <div class="docs-icon-name">字体加粗</div>
    <div class="docs-icon-code">&amp;#xe62b;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-strong</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-unlink"></i>
    <div class="docs-icon-name">删除链接</div>
    <div class="docs-icon-code">&amp;#xe64d;</div>
    <div class="docs-icon-fontclass">lay-icon-unlink</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-picture"></i>
    <div class="docs-icon-name">图片</div>
    <div class="docs-icon-code">&amp;#xe64a;</div>
    <div class="docs-icon-fontclass">lay-icon-picture</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-link"></i>
    <div class="docs-icon-name">链接</div>
    <div class="docs-icon-code">&amp;#xe64c;</div>
    <div class="docs-icon-fontclass">lay-icon-link</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-face-smile-b"></i>
    <div class="docs-icon-name">表情-笑-粗</div>
    <div class="docs-icon-code">&amp;#xe650;</div>
    <div class="docs-icon-fontclass">lay-icon-face-smile-b</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-align-left"></i>
    <div class="docs-icon-name">左对齐</div>
    <div class="docs-icon-code">&amp;#xe649;</div>
    <div class="docs-icon-fontclass">lay-icon-align-left</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-align-right"></i>
    <div class="docs-icon-name">右对齐</div>
    <div class="docs-icon-code">&amp;#xe648;</div>
    <div class="docs-icon-fontclass">lay-icon-align-right</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-align-center"></i>
    <div class="docs-icon-name">居中对齐</div>
    <div class="docs-icon-code">&amp;#xe647;</div>
    <div class="docs-icon-fontclass">lay-icon-align-center</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-fonts-u"></i>
    <div class="docs-icon-name">字体-下划线</div>
    <div class="docs-icon-code">&amp;#xe646;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-u</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-fonts-i"></i>
    <div class="docs-icon-name">字体-斜体</div>
    <div class="docs-icon-code">&amp;#xe644;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-i</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-tabs"></i>
    <div class="docs-icon-name">Tabs 选项卡</div>
    <div class="docs-icon-code">&amp;#xe62a;</div>
    <div class="docs-icon-fontclass">lay-icon-tabs</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-radio"></i>
    <div class="docs-icon-name">单选框-选中</div>
    <div class="docs-icon-code">&amp;#xe643;</div>
    <div class="docs-icon-fontclass">lay-icon-radio</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-circle"></i>
    <div class="docs-icon-name">单选框-候选</div>
    <div class="docs-icon-code">&amp;#xe63f;</div>
    <div class="docs-icon-fontclass">lay-icon-circle</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-edit"></i>
    <div class="docs-icon-name">编辑</div>
    <div class="docs-icon-code">&amp;#xe642;</div>
    <div class="docs-icon-fontclass">lay-icon-edit</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-share"></i>
    <div class="docs-icon-name">分享</div>
    <div class="docs-icon-code">&amp;#xe641;</div>
    <div class="docs-icon-fontclass">lay-icon-share</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-delete"></i>
    <div class="docs-icon-name">删除</div>
    <div class="docs-icon-code">&amp;#xe640;</div>
    <div class="docs-icon-fontclass">lay-icon-delete</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-form"></i>
    <div class="docs-icon-name">表单</div>
    <div class="docs-icon-code">&amp;#xe63c;</div>
    <div class="docs-icon-fontclass">lay-icon-form</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-cellphone-fine"></i>
    <div class="docs-icon-name">手机-细体</div>
    <div class="docs-icon-code">&amp;#xe63b;</div>
    <div class="docs-icon-fontclass">lay-icon-cellphone-fine</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-dialogue"></i>
    <div class="docs-icon-name">聊天 对话 沟通</div>
    <div class="docs-icon-code">&amp;#xe63a;</div>
    <div class="docs-icon-fontclass">lay-icon-dialogue</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-fonts-clear"></i>
    <div class="docs-icon-name">文字格式化</div>
    <div class="docs-icon-code">&amp;#xe639;</div>
    <div class="docs-icon-fontclass">lay-icon-fonts-clear</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-layer"></i>
    <div class="docs-icon-name">窗口</div>
    <div class="docs-icon-code">&amp;#xe638;</div>
    <div class="docs-icon-fontclass">lay-icon-layer</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-date"></i>
    <div class="docs-icon-name">日期</div>
    <div class="docs-icon-code">&amp;#xe637;</div>
    <div class="docs-icon-fontclass">lay-icon-date</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-water"></i>
    <div class="docs-icon-name">水 下雨</div>
    <div class="docs-icon-code">&amp;#xe636;</div>
    <div class="docs-icon-fontclass">lay-icon-water</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-code-circle"></i>
    <div class="docs-icon-name">代码-圆圈</div>
    <div class="docs-icon-code">&amp;#xe635;</div>
    <div class="docs-icon-fontclass">lay-icon-code-circle</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-carousel"></i>
    <div class="docs-icon-name">轮播组图</div>
    <div class="docs-icon-code">&amp;#xe634;</div>
    <div class="docs-icon-fontclass">lay-icon-carousel</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-prev-circle"></i>
    <div class="docs-icon-name">翻页</div>
    <div class="docs-icon-code">&amp;#xe633;</div>
    <div class="docs-icon-fontclass">lay-icon-prev-circle</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-layouts"></i>
    <div class="docs-icon-name">布局</div>
    <div class="docs-icon-code">&amp;#xe632;</div>
    <div class="docs-icon-fontclass">lay-icon-layouts</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-util"></i>
    <div class="docs-icon-name">工具</div>
    <div class="docs-icon-code">&amp;#xe631;</div>
    <div class="docs-icon-fontclass">lay-icon-util</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-templeate-1"></i>
    <div class="docs-icon-name">选择模板</div>
    <div class="docs-icon-code">&amp;#xe630;</div>
    <div class="docs-icon-fontclass">lay-icon-templeate-1</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-upload-circle"></i>
    <div class="docs-icon-name">上传-圆圈</div>
    <div class="docs-icon-code">&amp;#xe62f;</div>
    <div class="docs-icon-fontclass">lay-icon-upload-circle</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-tree"></i>
    <div class="docs-icon-name">树</div>
    <div class="docs-icon-code">&amp;#xe62e;</div>
    <div class="docs-icon-fontclass">lay-icon-tree</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-table"></i>
    <div class="docs-icon-name">表格</div>
    <div class="docs-icon-code">&amp;#xe62d;</div>
    <div class="docs-icon-fontclass">lay-icon-table</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-chart"></i>
    <div class="docs-icon-name">图表</div>
    <div class="docs-icon-code">&amp;#xe62c;</div>
    <div class="docs-icon-fontclass">lay-icon-chart</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-chart-screen"></i>
    <div class="docs-icon-name">图标 报表 屏幕</div>
    <div class="docs-icon-code">&amp;#xe629;</div>
    <div class="docs-icon-fontclass">lay-icon-chart-screen</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-engine"></i>
    <div class="docs-icon-name">引擎</div>
    <div class="docs-icon-code">&amp;#xe628;</div>
    <div class="docs-icon-fontclass">lay-icon-engine</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-triangle-d"></i>
    <div class="docs-icon-name">下三角</div>
    <div class="docs-icon-code">&amp;#xe625;</div>
    <div class="docs-icon-fontclass">lay-icon-triangle-d</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-triangle-r"></i>
    <div class="docs-icon-name">右三角</div>
    <div class="docs-icon-code">&amp;#xe623;</div>
    <div class="docs-icon-fontclass">lay-icon-triangle-r</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-file"></i>
    <div class="docs-icon-name">文件</div>
    <div class="docs-icon-code">&amp;#xe621;</div>
    <div class="docs-icon-fontclass">lay-icon-file</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-set-sm"></i>
    <div class="docs-icon-name">设置-小型</div>
    <div class="docs-icon-code">&amp;#xe620;</div>
    <div class="docs-icon-fontclass">lay-icon-set-sm</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-reduce-circle"></i>
    <div class="docs-icon-name">减少-圆圈</div>
    <div class="docs-icon-code">&amp;#xe616;</div>
    <div class="docs-icon-fontclass">lay-icon-reduce-circle</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-add-circle"></i>
    <div class="docs-icon-name">添加-圆圈</div>
    <div class="docs-icon-code">&amp;#xe61f;</div>
    <div class="docs-icon-fontclass">lay-icon-add-circle</div>
  </div>
  
  
  <div>
    <i class="lay-icon lay-icon-404"></i>
    <div class="docs-icon-name">404</div>
    <div class="docs-icon-code">&amp;#xe61c;</div>
    <div class="docs-icon-fontclass">lay-icon-404</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-about"></i>
    <div class="docs-icon-name">关于</div>
    <div class="docs-icon-code">&amp;#xe60b;</div>
    <div class="docs-icon-fontclass">lay-icon-about</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-up"></i>
    <div class="docs-icon-name">箭头 向上</div>
    <div class="docs-icon-code">&amp;#xe619;</div>
    <div class="docs-icon-fontclass">lay-icon-up</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-down"></i>
    <div class="docs-icon-name">箭头 向下</div>
    <div class="docs-icon-code">&amp;#xe61a;</div>
    <div class="docs-icon-fontclass">lay-icon-down</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-left"></i>
    <div class="docs-icon-name">箭头 向左</div>
    <div class="docs-icon-code">&amp;#xe603;</div>
    <div class="docs-icon-fontclass">lay-icon-left</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-right"></i>
    <div class="docs-icon-name">箭头 向右</div>
    <div class="docs-icon-code">&amp;#xe602;</div>
    <div class="docs-icon-fontclass">lay-icon-right</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-circle-dot"></i>
    <div class="docs-icon-name">圆点</div>
    <div class="docs-icon-code">&amp;#xe617;</div>
    <div class="docs-icon-fontclass">lay-icon-circle-dot</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-search"></i>
    <div class="docs-icon-name">搜索</div>
    <div class="docs-icon-code">&amp;#xe615;</div>
    <div class="docs-icon-fontclass">lay-icon-search</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-set-fill"></i>
    <div class="docs-icon-name">设置-实心</div>
    <div class="docs-icon-code">&amp;#xe614;</div>
    <div class="docs-icon-fontclass">lay-icon-set-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-group"></i>
    <div class="docs-icon-name">群组</div>
    <div class="docs-icon-code">&amp;#xe613;</div>
    <div class="docs-icon-fontclass">lay-icon-group</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-friends"></i>
    <div class="docs-icon-name">好友</div>
    <div class="docs-icon-code">&amp;#xe612;</div>
    <div class="docs-icon-fontclass">lay-icon-friends</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-reply-fill"></i>
    <div class="docs-icon-name">回复 评论 实心</div>
    <div class="docs-icon-code">&amp;#xe611;</div>
    <div class="docs-icon-fontclass">lay-icon-reply-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-menu-fill"></i>
    <div class="docs-icon-name">菜单 隐身 实心</div>
    <div class="docs-icon-code">&amp;#xe60f;</div>
    <div class="docs-icon-fontclass">lay-icon-menu-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-log"></i>
    <div class="docs-icon-name">记录</div>
    <div class="docs-icon-code">&amp;#xe60e;</div>
    <div class="docs-icon-fontclass">lay-icon-log</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-picture-fine"></i>
    <div class="docs-icon-name">图片-细体</div>
    <div class="docs-icon-code">&amp;#xe60d;</div>
    <div class="docs-icon-fontclass">lay-icon-picture-fine</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-face-smile-fine"></i>
    <div class="docs-icon-name">表情-笑-细体</div>
    <div class="docs-icon-code">&amp;#xe60c;</div>
    <div class="docs-icon-fontclass">lay-icon-face-smile-fine</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-list"></i>
    <div class="docs-icon-name">列表</div>
    <div class="docs-icon-code">&amp;#xe60a;</div>
    <div class="docs-icon-fontclass">lay-icon-list</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-release"></i>
    <div class="docs-icon-name">发布 纸飞机</div>
    <div class="docs-icon-code">&amp;#xe609;</div>
    <div class="docs-icon-fontclass">lay-icon-release</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-ok"></i>
    <div class="docs-icon-name">对 OK</div>
    <div class="docs-icon-code">&amp;#xe605;</div>
    <div class="docs-icon-fontclass">lay-icon-ok</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-help"></i>
    <div class="docs-icon-name">帮助</div>
    <div class="docs-icon-code">&amp;#xe607;</div>
    <div class="docs-icon-fontclass">lay-icon-help</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-chat"></i>
    <div class="docs-icon-name">客服</div>
    <div class="docs-icon-code">&amp;#xe606;</div>
    <div class="docs-icon-fontclass">lay-icon-chat</div>
  </div>
  
  <div>
    <i class="lay-icon lay-icon-top"></i>
    <div class="docs-icon-name">top 置顶</div>
    <div class="docs-icon-code">&amp;#xe604;</div>
    <div class="docs-icon-fontclass">lay-icon-top</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-star"></i>
    <div class="docs-icon-name">收藏-空心</div>
    <div class="docs-icon-code">&amp;#xe600;</div>
    <div class="docs-icon-fontclass">lay-icon-star</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-star-fill"></i>
    <div class="docs-icon-name">收藏-实心</div>
    <div class="docs-icon-code">&amp;#xe658;</div>
    <div class="docs-icon-fontclass">lay-icon-star-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-close-fill"></i>
    <div class="docs-icon-name">关闭-实心</div>
    <div class="docs-icon-code">&amp;#x1007;</div>
    <div class="docs-icon-fontclass">lay-icon-close-fill</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-close"></i>
    <div class="docs-icon-name">关闭-空心</div>
    <div class="docs-icon-code">&amp;#x1006;</div>
    <div class="docs-icon-fontclass">lay-icon-close</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-ok-circle"></i>
    <div class="docs-icon-name">正确</div>
    <div class="docs-icon-code">&amp;#x1005;</div>
    <div class="docs-icon-fontclass">lay-icon-ok-circle</div>
  </div>
  <div>
    <i class="lay-icon lay-icon-add-circle-fine"></i>
    <div class="docs-icon-name">添加-圆圈-细体</div>
    <div class="docs-icon-code">&amp;#xe608;</div>
    <div class="docs-icon-fontclass">lay-icon-add-circle-fine</div>
  </div>
</div>


<h2 id="cors" lay-toc="">跨域处理</h2>

由于浏览器存在同源策略，若 Layui 文件地址与你当前的页面地址*不在同一个域下*，即会出现图标跨域问题。因此，要么将 Layui 文件与网站放在同一服务器，要么对 Layui 文件所在的静态资源服务器的 `Response Headers` 添加：`Access-Control-Allow-Origin: *` 或对跨资源共享指定域名，即可解决图标跨域问题。

<style>
#ID-icon-copy{display: none;}
</style>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview'], id: 'ID-icon-copy'}">
  <textarea>
<script>
  layui.use(function(){
    var $ = layui.jquery;
    var layer = layui.layer;
    var lay = layui.lay;
    var util = layui.util;
    // click
    $('.ws-docs-icon > div').on('click', function(e){
      var elem = $(this);
      var unicodeElem = elem.children('.docs-icon-code')
      var classnameElem = elem.children('.docs-icon-fontclass')
      var text = classnameElem.text();
      var html = text;

      if ($(e.target).is(unicodeElem)) {
        text = unicodeElem.text();
        html = unicodeElem.html();
      }

      lay.clipboard.writeText({
        text: text,
        done: function() {
          layer.msg('已复制 '+ html, {
            icon: 1,
            offset: '5%',
            anim: 'slideDown',
            isOutAnim: false
          });
        }
      });
    });
  });
</script>
  </textarea>
</pre>

