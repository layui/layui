<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">日期</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-date">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">年份</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-year">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">年月</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-month">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">时间</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-time">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">日期时间</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-datetime">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">日期时间全面板</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-datetime-fullPanel">
      </div>
    </div>
    <hr>
    <div class="layui-inline">
      <label class="layui-form-label">日期范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-range-date" placeholder=" - ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">年份范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-range-year" placeholder=" - ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">年月范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-range-month" placeholder=" - ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">时间范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-shortcut-range-time" placeholder=" - ">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">日期时间范围</label>
    <div class="layui-input-block">
      <input type="text" class="layui-input" id="ID-laydate-shortcut-range-datetime" placeholder=" - ">
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;
  var util = layui.util;

  /*
   * 快捷选项
   */

  // 日期
  laydate.render({
    elem: "#ID-laydate-shortcut-date",
    shortcuts: [
      {
        text: "昨天",
        value: function(){
          var now = new Date();
          now.setDate(now.getDate() - 1);
          return now;
        }
      },
      { 
        text: "今天", 
        value: function(){
          return Date.now();
        } 
      },
      {
        text: "明天",
        value: function(){
          var now = new Date();
          now.setDate(now.getDate() + 1);
          return now;
        }
      },
      {
        text: "上个月",
        value: function(){
          var now = new Date();
          var month = now.getMonth() - 1;

          now.setMonth(month);

          // 若上个月数不匹配，则表示天数溢出
          if (now.getMonth() !== month) {
            now.setDate(0); // 重置天数
          }

          return [now];
        }
      },
      {
        text: "下个月",
        value: function(){
          var now = new Date();
          var month = now.getMonth() + 1;

          now.setMonth(month);

          // 若下个月数不匹配，则表示天数溢出
          if (now.getMonth() !== month) {
            now.setDate(0); // 重置天数
          }

          return [now];
        }
      },
      {
        text: "某一天",
        value: "2016-10-14"
      }
    ]
  });

  // 年份
  laydate.render({
    elem: "#ID-laydate-shortcut-year",
    type: "year",
    shortcuts: [
      {
        text: "去年",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() - 1);
          return now;
        }
      },
      {
        text: "明年",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() + 1);
          return now;
        }
      }
    ]
  });

  // 年月
  laydate.render({
    elem: "#ID-laydate-shortcut-month",
    type: "month",
    shortcuts: [
      {
        text: "上个月",
        value: function(){
          var now = new Date();
          now.setMonth(now.getMonth() - 1, 1);
          return now;
        }
      },
      {
        text: "下个月",
        value: function(){
          var now = new Date();
          now.setMonth(now.getMonth() + 1, 1);
          return now;
        }
      },
      {
        text: "去年本月",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() - 1);
          return now;
        }
      }
    ]
  });

  // 时间
  laydate.render({
    elem: "#ID-laydate-shortcut-time",
    type: "time",
    shortcuts: function(){ // 生成 30 分钟间隔的时间列表
      var value = [];
      var now = new Date();
      now.setHours(0, 0, 0, 0);
      for (var i = 0; i < 48; i++) {
        var nowTemp = now.setMinutes(now.getMinutes() + (i ? 30 : 0));
        var nowTimeStr = util.toDateString(nowTemp, "HH:mm:ss");
        value.push({
          text: nowTimeStr,
          value: nowTimeStr
        });
      }
      return value;
    }()
  });

  // 日期时间
  laydate.render({
    elem: "#ID-laydate-shortcut-datetime",
    type: "datetime",
    shortcuts: [
      {
        text: "昨天",
        value: function(){
          var now = new Date();
          now.setDate(now.getDate() - 1);
          return now;
        }
      },
      { 
        text: "今天", 
        value: function(){
          return Date.now();
        }
      },
      {
        text: "明天",
        value: function(){
          var now = new Date();
          now.setDate(now.getDate() + 1);
          return now;
        }
      },
      {
        text: "上个月",
        value: function(){
          var now = new Date();
          var month = now.getMonth() - 1;

          now.setMonth(month);

          // 若上个月数不匹配，则表示天数溢出
          if (now.getMonth() !== month) {
            now.setDate(0); // 重置天数
          }

          return [now];
        }
      },
      {
        text: "下个月",
        value: function(){
          var now = new Date();
          var month = now.getMonth() + 1;

          now.setMonth(month);

          // 若上个月数不匹配，则表示天数溢出
          if (now.getMonth() !== month) {
            now.setDate(0); // 重置天数
          }

          return [now];
        }
      },
      {
        text: "某一天",
        value: "2016-10-14 10:00:00"
      }
    ]
  }); 


  // 日期时间全面板
  laydate.render({
    elem: "#ID-laydate-shortcut-datetime-fullPanel",
    type: "datetime",
    fullPanel: true,
    shortcuts: [
      {
        text: "昨天",
        value: function(){
          var now = new Date();
          now.setDate(now.getDate() - 1);
          return now;
        }
      },
      { text: "今天", value: Date.now() },
      {
        text: "明天",
        value: function(){
          var now = new Date();
          now.setDate(now.getDate() + 1);
          return now;
        }
      },
      {
        text: "上个月",
        value: function(){
          var now = new Date();
          var month = now.getMonth() - 1;

          now.setMonth(month);

          // 若上个月数不匹配，则表示天数溢出
          if (now.getMonth() !== month) {
            now.setDate(0); // 重置天数
          }

          return [now];
        }
      },
      {
        text: "下个月",
        value: function(){
          var now = new Date();
          var month = now.getMonth() + 1;

          now.setMonth(month);

          // 若上个月数不匹配，则表示天数溢出
          if (now.getMonth() !== month) {
            now.setDate(0); // 重置天数
          }

          return [now];
        }
      },
      {
        text: "某一天",
        value: "2016-10-14 09:30:00"
      }
    ]
  });


  // 日期范围
  laydate.render({
    elem: "#ID-laydate-shortcut-range-date",
    range: true,
    shortcuts: [
      {
        text: "上个月",
        value: function(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth();

          return [
            new Date(year, month - 1, 1),
            new Date(year, month, 0)
          ];
        }
      },
      {
        text: "这个月",
        value: function(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth();

          return [
            new Date(year, month, 1),
            new Date(year, month + 1, 0)
          ];
        }
      },
      {
        text: "下个月",
        value: function(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth();

          return [
            new Date(year, month + 1, 1),
            new Date(year, month + 2, 0)
          ];
        }
      }
    ]
  });


  // 年份范围
  laydate.render({
    elem: "#ID-laydate-shortcut-range-year",
    type: "year",
    range: true,
    shortcuts: [
      {
        text: "过去一年",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() - 1);
          return [now, new Date()];
        }
      },
      {
        text: "未来一年",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() + 1);
          return [new Date(), now];
        }
      },
      {
        text: "近三年",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() - 3);
          return [now, new Date()];
        }
      }
    ]
  });

  // 年月范围
  laydate.render({
    elem: "#ID-laydate-shortcut-range-month",
    type: "month",
    range: true,
    shortcuts: [
      {
        text: "去年",
        value: function(){
          var now = new Date();
          var year = now.getFullYear() - 1;

          return [
            new Date(year, 0),
            new Date(year, 11)
          ];
        }
      },
      {
        text: "明年",
        value: function(){
          var now = new Date();
          var year = now.getFullYear() + 1;

          return [
            new Date(year, 0),
            new Date(year, 11)
          ];
        }
      },
      {
        text: "近三年",
        value: function(){
          var now = new Date();
          now.setFullYear(now.getFullYear() - 3);
          return [now, new Date()];
        }
      }
    ]
  });

  // 时间范围
  laydate.render({
    elem: "#ID-laydate-shortcut-range-time",
    type: "time",
    range: true,
    shortcuts: [
      {
        text: '09:30 <p style="text-align: center;">到</p> 11:30',
        value: (function () {
          var date1 = new Date();
          date1.setHours(9, 0, 0, 0);

          var date2 = new Date();
          date2.setHours(11, 30, 0, 0);

          return [date1, date2];
        })
      },
      {
        text: '13:00 <p style="text-align: center;">到</p> 15:00',
        value: (function () {
          var date1 = new Date();
          date1.setHours(13, 0, 0, 0);

          var date2 = new Date();
          date2.setHours(15, 0, 0, 0);

          return [date1, date2];
        })
      }
    ]
  });

  // 日期时间范围
  laydate.render({
    elem: "#ID-laydate-shortcut-range-datetime",
    type: "datetime",
    range: true,
    shortcuts: [
      {
        text: "上个月",
        value: function(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth();

          return [
            new Date(year, month - 1, 1),
            new Date(year, month, 0, 23, 59, 59)
          ];
        }
      },
      {
        text: "这个月",
        value: function(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth();

          return [
            new Date(year, month, 1),
            new Date(year, month + 1, 0, 23, 59, 59)
          ];
        }
      },
      {
        text: "下个月",
        value: function(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth();

          return [
            new Date(year, month + 1, 1),
            new Date(year, month + 2, 0, 23, 59, 59)
          ];
        }
      }
    ]
  });

});
</script>
