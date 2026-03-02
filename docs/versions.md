---
title: 更新日志
toc: true
---

# 更新日志

> 导读：📑 [Layui 不同版本的浏览器兼容说明](/notes/browser-support.html) · 📑 [Layui 2.x 系列版本主要升级变化](/notes/share/2x-major-upgrade-changes.html) · 📑 [Layui 2.8+ 《升级指南》](/notes/2.8/upgrade-guide.html)

<div id="WS-switch-v"></div>


<h2 id="v3" lay-toc="{title: 'v3'}"></h2>

<h2 id="v3.0.0-alpha" lay-pid="v3" class="ws-anchor">
  v3.0.0-alpha
</h2>

- https://github.com/layui/layui/releases/tag/v3.0.0-alpha.3
- https://github.com/layui/layui/releases/tag/v3.0.0-alpha.2
- https://github.com/layui/layui/releases/tag/v3.0.0-alpha.1
- https://github.com/layui/layui/releases/tag/v3.0.0-alpha.0

---

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
})();
</script>

<h2 id="2.x" lay-toc="{title: '2.x', href: '/docs/2/versions.html'}">
  <a href="/docs/2/versions.html">2.x</a>
</h2>

查看 <a href="/docs/2/versions.html">2.x</a> 系列版本更新日志
