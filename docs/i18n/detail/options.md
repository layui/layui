<pre class="layui-code" lay-options="{style: 'height: 525px;', layout: ['code'], tools: []}">
  <textarea>
// 简体中文语言包（内置）
var zhCN = {
  code: {
    copy: '复制代码',
    copied: '已复制',
    copyError: '复制失败',
    maximize: '最大化显示',
    restore: '还原显示',
    preview: '在新窗口预览'
  },
  colorpicker: {
    clear: '清除',
    confirm: '确定'
  },
  dropdown: {
    noData: '暂无数据'
  },
  flow: {
    loadMore: '加载更多',
    noMore: '没有更多了'
  },
  form: {
    select: {
      noData: '暂无数据',
      noMatch: '无匹配数据',
      placeholder: '请选择'
    },
    validateMessages: {
      required: '必填项不能为空',
      phone: '手机号格式不正确',
      email: '邮箱格式不正确',
      url: '链接格式不正确',
      number: '只能填写数字',
      date: '日期格式不正确',
      identity: '身份证号格式不正确'
    },
    verifyErrorPromptTitle: '提示'
  },
  laydate: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    time: ['时', '分', '秒'],
    literal: {
      year: '年'
    },
    selectDate: '选择日期',
    selectTime: '选择时间',
    startTime: '开始时间',
    endTime: '结束时间',
    tools: {
      confirm: '确定',
      clear: '清空',
      now: '现在',
      reset: '重置'
    },
    rangeOrderPrompt: '结束时间不能早于开始时间\n请重新选择',
    invalidDatePrompt: '不在有效日期或时间范围内\n',
    formatErrorPrompt: '日期格式不合法\n必须遵循：\n{format}\n',
    autoResetPrompt: '已自动重置',
    preview: '当前选中的结果'
  },
  layer: {
    confirm: '确定',
    cancel: '取消',
    defaultTitle: '信息',
    prompt: {
      InputLengthPrompt: '最多输入 {length} 个字符'
    },
    photos: {
      noData: '没有图片',
      tools:{
        rotate: '旋转',
        scaleX: '水平变换',
        zoomIn: '放大',
        zoomOut: '缩小',
        reset: '还原',
        close: '关闭'
      },
      viewPicture: '查看原图',
      urlError: {
        prompt: '当前图片地址异常，\n是否继续查看下一张？',
        confirm: '下一张',
        cancel: '不看了'
      }
    }
  },
  laypage: {
    prev: '上一页',
    next: '下一页',
    first: '首页',
    last: '尾页',
    total: '共 {total} 条',
    pagesize: '条/页',
    goto: '到第',
    page: '页',
    confirm: '确定'
  },
  table: {
    sort: {
      asc: '升序',
      desc: '降序'
    },
    noData: '暂无数据',
    tools:{
      filter: {
        title: '筛选列'
      },
      export: {
        title: '导出',
        noDataPrompt: '当前表格无数据',
        compatPrompt: '导出功能不支持 IE，请用 Chrome 等高级浏览器导出',
        csvText : '导出 CSV 文件'
      },
      print: {
        title: '打印',
        noDataPrompt: '当前表格无数据'
      }
    },
    dataFormatError: '返回的数据不符合规范，正确的成功状态码应为："{statusName}": {statusCode}',
    xhrError: '请求异常，错误提示：{msg}'
  },
  transfer: {
    noData: '暂无数据',
    noMatch: '无匹配数据',
    title: ['列表一', '列表二'],
    searchPlaceholder: '关键词搜索'
  },
  tree: {
    defaultNodeName: '未命名',
    noData: '暂无数据',
    deleteNodePrompt: '确认删除"{name}"节点吗？'
  },
  upload: {
    fileType: {
      file: '文件',
      image: '图片',
      video: '视频',
      audio: '音频'
    },
    validateMessages: {
      fileExtensionError: '选择的{fileType}中包含不支持的格式',
      filesOverLengthLimit: '同时最多只能上传: {length} 个文件',
      currentFilesLength: '当前已经选择了: {length} 个文件',
      fileOverSizeLimit: '文件大小不能超过 {size}'
    },
    chooseText: '{length} 个文件'
  },
  util: {
    timeAgo: {
      days: '{days} 天前',
      hours: '{hours} 小时前',
      minutes: '{minutes} 分钟前',
      future: '未来',
      justNow: '刚刚'
    },
    toDateString: {
      // https://www.unicode.org/cldr/charts/47/supplemental/day_periods.html
      meridiem: function(hours, minutes){
        var hm = hours * 100 + minutes;
        if (hm < 500) {
          return '凌晨';
        } else if (hm < 800) {
          return '早上';
        } else if (hm < 1200) {
          return '上午';
        } else if (hm < 1300) {
          return '中午';
        } else if (hm < 1900) {
          return '下午';
        }
        return '晚上';
      }
    }
  }
};
i18n.set({
  locale: 'zh-CN', // 设置语言环境
  messages: { // 语言包
    'zh-CN': zhCN
  }
});
  </textarea>
</pre>
