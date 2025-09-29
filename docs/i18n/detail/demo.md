<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>i18n 演示 - Layui</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui[2].cdn.css }}" rel="stylesheet">
</head>
<body class="layui-padding-3">
  <div id="root"></div>{{!
  <template id="template">
    {{ const i18n = layui.i18n; }}
    <div class="layui-form">
      <div class="layui-inline">
        <strong>{{= i18n.$t('custom.switchLanguage') }}: </strong>
      </div>
      <div class="layui-inline">
        <select id="change-locale" lay-filter="change-locale">
          <option value="zh-CN">简体中文</option>
          <option value="en">English</option>
          <option value="zh-HK">繁體中文</option>
        </select>
      </div>
    </div>
    <br>
    <fieldset class="layui-elem-field">
      <legend>README</legend>
      <div class="layui-field-box layui-text" id="tpl-test">
        <p>{{= i18n.$t('custom.readme.description') }}</p>
        <ul>
          <li><strong>locale</strong>: <span style="color:red">{{= i18n.config.locale }}</span></li>
          <li><strong>Date</strong>: {{= new Date().toLocaleDateString(i18n.config.locale) }}</li>
          <li><strong>Hello</strong>: {{= i18n.$t('custom.readme.hello') }}</li>
        </ul>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>code</legend>
      <div class="layui-field-box">
        <pre id="demo-code" class="layui-code" lay-options="{}">
          code content
        </pre>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>colorpicker</legend>
      <div class="layui-field-box">
        <div id="demo-colorpicker"></div>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>dropdown</legend>
      <div class="layui-field-box">
        <button id="demo-dropdown" class="layui-btn demo-dropdown-base">
          <span>Dropdown</span>
          <i class="layui-icon layui-icon-down layui-font-12"></i>
        </button>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>flow</legend>
      <div class="layui-field-box">
        <div class="flow-demo" id="demo-flow"></div>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>form</legend>
      <div class="layui-field-box">
        <form class="layui-form" action="">
          <div class="layui-form-item">
            <label class="layui-form-label">{{= i18n.$t('custom.form.required') }}</label>
            <div class="layui-input-block">
              <input type="text" name="username" lay-verify="required" lay-vertype="alert" placeholder="{{= i18n.$t('custom.form.placeholder') }}" autocomplete="off" class="layui-input">
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-inline">
              <label class="layui-form-label">{{= i18n.$t('custom.form.phone') }}</label>
              <div class="layui-input-inline layui-input-wrap">
                <input type="tel" name="phone" lay-verify="phone" autocomplete="off" value="123456" lay-affix="clear"
                  class="layui-input demo-phone">
              </div>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-inline">
              <label class="layui-form-label">{{= i18n.$t('custom.form.email') }}</label>
              <div class="layui-input-inline">
                <input type="text" name="email" value="123.com" lay-verify="email" autocomplete="off"
                  class="layui-input">
              </div>
            </div>
            <div class="layui-inline">
              <label class="layui-form-label">{{= i18n.$t('custom.form.date') }}</label>
              <div class="layui-input-inline layui-input-wrap">
                <div class="layui-input-prefix">
                  <i class="layui-icon layui-icon-date"></i>
                </div>
                <input type="text" name="date" value="2077" id="date" lay-verify="date" placeholder="yyyy-MM-dd"
                  autocomplete="off" class="layui-input">
              </div>
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">{{= i18n.$t('custom.form.select') }}</label>
            <div class="layui-input-block">
              <select name="interest" lay-filter="aihao" lay-search>
                <option value=""></option>
                <option value="0">AAA</option>
                <option value="1" selected>BBB</option>
                <option value="2">CCC</option>
                <option value="3">DDD</option>
                <option value="4">EEE</option>
              </select>
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-block">
              <button type="submit" class="layui-btn" lay-submit lay-filter="demo1">
                {{= i18n.$t('custom.form.submit') }}
              </button>
              <button type="reset" class="layui-btn layui-btn-primary">
                {{= i18n.$t('custom.form.reset') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>laydate</legend>
      <div class="layui-field-box">
        <div class="layui-inline">
          <input class="layui-input" id="demo-laydate" />
        </div>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>layer</legend>
      <div class="layui-field-box">
        <button type="button" class="layui-btn layui-btn-primary" lay-on="alert">Alert</button>
        <button type="button" class="layui-btn layui-btn-primary" lay-on="prompt">Prompt</button>
        <button type="button" class="layui-btn layui-btn-primary" lay-on="photos">Photos</button>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>laypage</legend>
      <div class="layui-field-box">
        <div id="demo-laypage-all"></div>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>table</legend>
      <div class="layui-field-box">
        <table class="layui-hide" id="demo-table" lay-filter="test"></table>
        </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>transfer</legend>
      <div class="layui-field-box">
        <div id="demo-transfer"></div>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>tree</legend>
      <div class="layui-field-box">
        <div id="demo-tree"></div>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>upload</legend>
      <div class="layui-field-box">
        <button type="button" class="layui-btn" id="demo-upload">
          <i class="layui-icon layui-icon-upload"></i> Upload
        </button>
      </div>
    </fieldset>
    <fieldset class="layui-elem-field">
      <legend>utils</legend>
      <div class="layui-field-box">
        <label>
          timeAgo: <input id="demo-time-ago-picker" type="datetime-local" /> <span id="demo-time-ago-display"></span>
        </label>
        <br>
        <label>
          toDateString: <div id="demo-toDateString"></div>
        </label>
      </div>
    </fieldset>
  </template>!}}

  <script>
  // 配置 Layui 组件语言包
  window.LAYUI_GLOBAL = {
    i18n: {
      locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
      messages: { // 扩展其他语言包
        // English
        'en': {
          code: {
            copy: 'Copy Code',
            copied: 'Copied',
            copyError: 'Copy Failed',
            maximize: 'Maximize',
            restore: 'Restore',
            preview: 'Open Preview in New Window'
          },
          colorpicker: {
            clear: 'Clear',
            confirm: 'OK'
          },
          dropdown: {
            noData: 'No Data'
          },
          flow: {
            loadMore: 'Load More',
            noMore: 'No More Data'
          },
          form: {
            select: {
              noData: 'No Data',
              noMatch: 'No Matching Data',
              placeholder: 'Please Select'
            },
            validateMessages: {
              required: 'This field is required',
              phone: 'Invalid phone number format',
              email: 'Invalid email format',
              url: 'Invalid URL format',
              number: 'Numbers only',
              date: 'Invalid date format',
              identity: 'Invalid ID number format'
            },
            verifyErrorPromptTitle: 'Notice'
          },
          laydate: {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            time: ['Hour', 'Minute', 'Second'],
            literal: {
              year: ''
            },
            selectDate: 'Select Date',
            selectTime: 'Select Time',
            startTime: 'Start Time',
            endTime: 'End Time',
            tools: {
              confirm: 'Confirm',
              clear: 'Clear',
              now: 'Now',
              reset: 'Reset'
            },
            rangeOrderPrompt: 'End time cannot be less than start Time\nPlease re-select',
            invalidDatePrompt: 'Invalid date\n',
            formatErrorPrompt: 'Date format is invalid\nMust follow the format:\n{format}\n',
            autoResetPrompt: 'It has been reset',
            preview: 'The selected result'
          },
          layer: {
            confirm: 'OK',
            cancel: 'Cancel',
            defaultTitle: 'Info',
            prompt: {
              InputLengthPrompt: 'Maximum {length} characters'
            },
            photos: {
              noData: 'No Image',
              tools: {
                rotate: 'Rotate',
                scaleX: 'Flip Horizontally',
                zoomIn: 'Zoom In',
                zoomOut: 'Zoom Out',
                reset: 'Reset',
                close: 'Close'
              },
              viewPicture: 'View Picture',
              urlError: {
                prompt: 'Image URL is invalid, \nContinue to next one?',
                confirm: 'Next',
                cancel: 'Cancel'
              }
            }
          },
          laypage: {
            prev: 'Prev',
            next: 'Next',
            first: 'First',
            last: 'Last',
            total: 'Total {total} items',
            pagesize: '/page',
            goto: 'Go to',
            page: 'page',
            confirm: 'Confirm'
          },
          table: {
            sort: {
              asc: 'Ascending',
              desc: 'Descending'
            },
            noData: 'No Data',
            tools: {
              filter: {
                title: 'Filter Columns'
              },
              export: {
                title: 'Export',
                noDataPrompt: 'No data in the table',
                compatPrompt: 'Export is not supported in IE. Please use Chrome or another modern browser.',
                csvText: 'Export CSV File'
              },
              print: {
                title: 'Print',
                noDataPrompt: 'No data in the table'
              }
            },
            dataFormatError: 'Returned data is invalid. The correct success status code should be: "{statusName}": {statusCode}',
            xhrError: 'Request Error: {msg}'
          },
          transfer: {
            noData: 'No Data',
            noMatch: 'No Match',
            title: ['List 1', 'List 2'],
            searchPlaceholder: 'Search by Keyword'
          },
          tree: {
            defaultNodeName: 'Unnamed',
            noData: 'No Data',
            deleteNodePrompt: 'Are you sure you want to delete the node "{name}"?'
          },
          upload: {
            fileType: {
              file: 'File',
              image: 'Image',
              video: 'Video',
              audio: 'Audio'
            },
            validateMessages: {
              fileExtensionError: 'Unsupported format in selected {fileType}',
              filesOverLengthLimit: 'Maximum {length} files allowed at once',
              currentFilesLength: 'You have selected {length} files',
              fileOverSizeLimit: 'File size must not exceed {size}'
            },
            chooseText: '{length} files'
          },
          util: {
            timeAgo: {
              days: '{days} days ago',
              hours: '{hours} hours ago',
              minutes: '{minutes} minutes ago',
              future: 'In the future',
              justNow: 'Just now'
            },
            toDateString: {
              meridiem: function (hours, minutes) {
                return hours < 12 ? 'AM' : 'PM';
              }
            }
          }
        },
        // 繁體中文
        'zh-HK': {
          code: {
            copy: '複製代碼',
            copied: '已複製',
            copyError: '複製失敗',
            maximize: '最大化顯示',
            restore: '還原顯示',
            preview: '在新視窗預覽'
          },
          colorpicker: {
            clear: '清除',
            confirm: '確定'
          },
          dropdown: {
            noData: '暫無資料'
          },
          flow: {
            loadMore: '載入更多',
            noMore: '沒有更多了'
          },
          form: {
            select: {
              noData: '暫無資料',
              noMatch: '無匹配資料',
              placeholder: '請選擇'
            },
            validateMessages: {
              required: '必填項不能為空',
              phone: '手機號碼格式不正確',
              email: '電郵格式不正確',
              url: '連結格式不正確',
              number: '只能填寫數字',
              date: '日期格式不正確',
              identity: '身份證號碼格式不正確'
            },
            verifyErrorPromptTitle: '提示'
          },
          laydate: {
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            time: ['時', '分', '秒'],
            literal: {
              year: '年'
            },
            selectDate: '選擇日期',
            selectTime: '選擇時間',
            startTime: '開始時間',
            endTime: '結束時間',
            tools: {
              confirm: '確定',
              clear: '清除',
              now: '現在',
              reset: '重設'
            },
            rangeOrderPrompt: '結束時間不能早於開始時間\n請重新選擇',
            invalidDatePrompt: '不在有效日期或時間範圍內\n',
            formatErrorPrompt: '日期格式不合法\n必須遵循：\n{format}\n',
            autoResetPrompt: '已自動重設',
            preview: '當前選中的結果'
          },
          layer: {
            confirm: '確定',
            cancel: '取消',
            defaultTitle: '資訊',
            prompt: {
              InputLengthPrompt: '最多輸入 {length} 個字符'
            },
            photos: {
              noData: '沒有圖片',
              tools:{
                rotate: '旋轉',
                scaleX: '水平變換',
                zoomIn: '放大',
                zoomOut: '縮小',
                reset: '還原',
                close: '關閉'
              },
              viewPicture: '查看原圖',
              urlError: {
                prompt: '當前圖片地址異常，\n是否繼續查看下一張？',
                confirm: '下一張',
                cancel: '不看了'
              }
            }
          },
          laypage: {
            prev: '上一頁',
            next: '下一頁',
            first: '首頁',
            last: '尾頁',
            total: '共 {total} 條',
            pagesize: '條/頁',
            goto: '到第',
            page: '頁',
            confirm: '確定'
          },
          table: {
            sort: {
              asc: '升序',
              desc: '降序'
            },
            noData: '無資料',
            tools:{
              filter: {
                title: '篩選列'
              },
              export: {
                title: '匯出',
                noDataPrompt: '當前表格無資料',
                compatPrompt: '匯出功能不支援 IE，請用 Chrome 等高級瀏覽器匯出',
                csvText : '匯出 CSV 檔案'
              },
              print: {
                title: '列印',
                noDataPrompt: '當前表格無資料'
              }
            },
            dataFormatError: '返回的資料不符合規範，正確的成功狀態碼應為："{statusName}": {statusCode}',
            xhrError: '請求異常，錯誤提示：{msg}'
          },
          transfer: {
            noData: '無資料',
            noMatch: '無匹配資料',
            title: ['列表一', '列表二'],
            searchPlaceholder: '關鍵詞搜尋'
          },
          tree: {
            defaultNodeName: '未命名',
            noData: '無資料',
            deleteNodePrompt: '確認刪除"{name}"節點嗎？'
          },
          upload: {
            fileType: {
              file: '檔案',
              image: '圖片',
              video: '影片',
              audio: '音訊'
            },
            validateMessages: {
              fileExtensionError: '選擇的{fileType}中包含不支援的格式',
              filesOverLengthLimit: '同時最多只能上傳: {length} 個檔案',
              currentFilesLength: '您當前已經選擇了: {length} 個檔案',
              fileOverSizeLimit: '檔案大小不能超過 {size}'
            },
            chooseText: '{length} 個檔案'
          },
          util: {
            timeAgo: {
              days: '{days} 天前',
              hours: '{hours} 小時前',
              minutes: '{minutes} 分鐘前',
              future: '未來',
              justNow: '剛剛'
            },
            toDateString: {
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
        },
      }
    }
  }
  </script>

  <script src="{{= d.layui[2].cdn.js }}"></script>
  <script>
  layui.use(async function () {
    const {
      $, colorpicker, dropdown, flow, form,
      i18n, laydate, laypage, laytpl, layer,
      table, transfer, tree, upload, util
    } = layui;

    /**
     * 业务 i18n 配置
     * 说明：此处仅为了让演示的「页面内容」与「Layui 组件」语言保持一致。实际使用时通常只需指定 Layui 组件语言环境，而页面内容的语言建议由您的项目本身进行管理。
     */
    i18n.set({
      messages: {
        'zh-CN': {
          custom: {
            switchLanguage: '切换语言',
            readme: {
              description: 'layui.i18n.$t 是私有方法（未文档化），此处仅用于演示',
              hello: '你好',
            },
            form: {
              required: '验证必填项',
              phone: '验证手机号',
              email: '验证邮箱',
              date: '验证日期',
              select: '选择框',
              submit: '立即提交',
              reset: '重置',
              placeholder: '请输入'
            }
          }
        },
        'en': {
          custom: {
            switchLanguage: 'Switch Language',
            readme: {
              description: 'layui.i18n.$t is a private method (undocumented), used here for demonstration only.',
              hello: 'Hello',
            },
            form: {
              required: 'Required',
              phone: 'Telephone',
              email: 'Email',
              date: 'Date',
              select: 'Select',
              submit: 'Submit',
              reset: 'Reset',
              placeholder: 'Please enter'
            }
          }
        },
        'zh-HK': {
          custom: {
            switchLanguage: '切換語言',
            readme: {
              description: 'layui.i18n.$t 是私有方法（未文檔化），此處僅用於示範',
              hello: '你好',
            },
            form: {
              required: '驗證必填項',
              phone: '驗證手機號',
              email: '驗證郵箱',
              date: '驗證日期',
              select: '選擇框',
              submit: '立即提交',
              reset: '重置',
              placeholder: '請輸入'
            }
          }
        }
      }
    });

    // 渲染页面模板
    const template = $('#template').html();
    const html = laytpl(template, { tagStyle: 'modern' }).render();
    $('#root').html(html);


    /**
      * 组件示例
      */

    // code
    layui.code({
      elem: "#demo-code",
      preview: true,
      tools: ['copy'],
      header: true,
      lang: 'html',
      langMarker: true,
    });

    // colorpicker
    colorpicker.render({
      elem: "#demo-colorpicker",
    });

    // dropdown
    dropdown.render({
      elem: "#demo-dropdown",
    });

    // flow
    flow.load({
      elem: '#demo-flow',
      scrollElem: '#demo-flow',
      done: function (page, next) {
        // 模拟数据插入
        setTimeout(function () {
          var lis = [];
          for (var i = 0; i < 3; i++) {
            lis.push('<li>' + ((page - 1) * 3 + i + 1) + '</li>')
          }
          next(lis.join(''), page < 2);
        }, 200);
      }
    });

    // form
    form.on('submit(demo1)', function (data) {
      var field = data.field;
      // 显示填写结果，仅作演示用
      layer.alert(JSON.stringify(field));
      return false;
    });

    // laydate
    laydate.render({
      elem: "#demo-laydate",
      type: "datetime",
      calendar: true
    });

    // layer
    util.on({
      alert: function () {
        layer.alert("Hello world");
      },
      prompt: function () {
        layer.prompt({ formType: 1, maxlength: 3 }, function (value, index) {
          layer.close(index);
        });
      },
      photos: function () {
        layer.photos({
          photos: {
            "title": "Photos Demo",
            "start": 0,
            "data": [
              {
                "alt": "layer",
                "pid": 1,
                "src": "https://unpkg.com/outeres@0.1.1/demo/layer.png",
              },
              {
                "alt": "error",
                "pid": 3,
                "src": "error.png",
              },
              {
                "alt": "universe",
                "pid": 5,
                "src": "https://unpkg.com/outeres@0.1.1/demo/outer-space.jpg",
              }
            ]
          }
        });
      }
    })

    // laypage
    laypage.render({
      elem: "demo-laypage-all",
      count: 100,
      layout: ["count", "prev", "page", "next", "limit", "refresh", "skip"],
    });

    // table
    table.render({
      elem: '#demo-table',
      cols: [[{ field: 'test', title: '1', sort: true }, { field: 'test2', title: '2', sort: true }]],
      data: new Array(0),
      toolbar: 'default',
      defaultToolbar: ['filter', 'exports', 'print'],
      height: 'full',
      page: true,
      text: {
        // none: 'none'
      }
    });

    // transfer
    transfer.render({
      elem: '#demo-transfer',
      data: [
        { "value": "1", "title": "Item 1" },
        { "value": "2", "title": "Item 2" },
        { "value": "3", "title": "Item 3" },
      ],
      showSearch: true
    });

    // tree
    tree.render({
      elem: '#demo-tree',
      data: [{ title: 'Item 1', id: 1, children: [{ title: 'Item 1-1', id: 2 }] }],
      edit: ['add', 'update', 'del']
    });

    // upload
    upload.render({
      elem: '#demo-upload',
      url: '', // 实际使用时改成您自己的上传接口即可。
      multiple: true,
      accept: 'file',
      number: 1
    });

    // util
    $('#demo-time-ago-picker').on('change', function(){
      $('#demo-time-ago-display').html(
        util.timeAgo(this.value)
      );
    })

    $('#demo-toDateString').html(
      util.toDateString('2023-01-01 11:35:25', 'yyyy-MM-dd HH:mm:ss A')
      + '<br>'
      + util.toDateString('2023-01-01 18:35:25', 'yyyy-MM-dd HH:mm:ss A')
    )

    // 演示：切换语言
    $("#change-locale").val(i18n.config.locale);
    form.render('select').on("select(change-locale)", function (elem) {
      // 记录语言，并重载页面（推荐）
      localStorage.setItem('layui-i18n-local-test', elem.value);
      window.location.reload();
    });

    $("body").css("opacity", 1);
    console.log(i18n.config)
  });
  </script>
</body>
</html>
