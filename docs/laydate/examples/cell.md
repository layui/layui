<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link href="{{= d.layui[2].cdn.css }}" rel="stylesheet">
  <style>
    .laydate-theme-lunar .layui-laydate-main {
      width: auto;
    }
    .laydate-theme-lunar .date-cell-inner {
      padding: 6px;
      width: 44px;
      height: 40px;
      border-radius: 4px !important;
    }
    .laydate-theme-lunar .layui-this {
      border-radius: 4px !important;
    }
    .laydate-theme-lunar .date-cell-inner b {
      display: block;
      font-weight: 400;
      height: 16px;
      font-size: 14px;
    }
    .laydate-theme-lunar .date-cell-inner i {
      display: block;
      font-style: normal;
      font-size: 10px;
    }
    .laydate-theme-lunar .badge {
      position: absolute;
      right: 0px;
      top: 0px;
      background-color: #4e5877;
      color: #fff;
      font-size: 12px;
      line-height: 14px;
      padding: 1px 2px;
      border-radius: 4px;
      text-decoration: none;
      transform: scale(0.7);
    }
    .laydate-theme-lunar .holiday .badge {
      background-color: #eb3333 !important;
    }
    .laydate-theme-lunar .hightlight i {
      color: #1e9fff;
    }
    .laydate-theme-lunar .layui-this .hightlight i {
      color: #fff;
    }
    .laydate-theme-lunar .laydate-month-list > li {
      height: 50px !important;
      line-height: 50px !important;
      width: 24.2% !important;
      margin: 18px 1px !important;
    }
    .laydate-theme-lunar .laydate-year-list > li {
      height: 40px !important;
      line-height: normal !important;
      width: 31.3% !important;
      margin: 8px 2px !important;
    }
    .laydate-theme-lunar .preview-inner>*{
      display: inline-block;
      margin-right: 5px;
      position:relative;
      font-size: 12px;
    }
    .laydate-theme-lunar .preview-inner>.badge{
      margin-right: 0;
    }
  </style>
</head>
<body class="layui-padding-3">
  <div class="layui-inline" id="ID-laydate-cell-render"></div>
  <script src="https://cdn.staticfile.org/lunar-javascript/1.6.12/lunar.min.js"></script>
  <script src="{{= d.layui[2].cdn.js }}"></script>
  <script>
  layui.use(function () {
    var laydate = layui.laydate;
    var $ = layui.$;
    var util = layui.util;
    // 渲染
    laydate.render({
      elem: '#ID-laydate-cell-render',
      position: 'static',
      // value: '2024-03-30',
      isPreview: false,
      btns: ['now'],
      theme: 'lunar',
      autoConfirm: false,
      ready: function (date) {
        if (!this._previewEl) {
          var key = this.elem.attr('lay-key');
          var panelEl = $('#layui-laydate' + key);
          this._previewEl = panelEl.find('.layui-laydate-preview');
          this.cellRender(date);
        }
      },
      change: function(value, date) {
        this.cellRender(date);
      },
      onNow: function(value, date) {
        this.cellRender(date);
      },
      cellRender: function (ymd, render, info) {
        var that = this;
        var y = ymd.year;
        var m = ymd.month;
        var d = ymd.date;
        var lunarDate = Solar.fromYmd(y, m, d).getLunar();
        var lunar = lunarDate.getDayInChinese();
        var jieQi = lunarDate.getJieQi();
        var holiday = HolidayUtil.getHoliday(y, m, d);
        var displayHoliday = holiday && holiday.getTarget() === holiday.getDay() ? holiday.getName() : undefined;
        var displayHolidayBadge = holiday && holiday.getTarget() ? (holiday.isWork() ? '班' : '休') : undefined;
        var isHoliday = holiday && holiday.getTarget() && !holiday.isWork();
        // 在预览区显示自定义农历相关信息
        if (that._previewEl && (!info || (info && info.type === "date"))) {
          var holidayBadgeStyle = [
            'color:#fff',
            'background-color:' + (isHoliday ? '#eb3333' : '#333'),
            'display:' + (displayHolidayBadge ? 'inline-block' : 'none')
          ].join(';')
          var festivalBadgeStyle = [
            'color:#fff',
            'background-color:#1e9fff',
            'display:' + (displayHoliday || jieQi ? 'inline-block' : 'none')
          ].join(';')
          var tipsText = [
            '<div class="preview-inner">',
              '<div style="color:#333;">农历' + lunarDate.getMonthInChinese() + '月' + lunarDate.getDayInChinese() + '</div>',
              '<div style="font-size:10px">' + lunarDate.getYearInGanZhi() + lunarDate.getYearShengXiao() + '年</div>',
              '<div style="font-size:10px">' + lunarDate.getMonthInGanZhi() + '月 ' + lunarDate.getDayInGanZhi() + '日</div>',
              '<div class="badge" style="' + holidayBadgeStyle  +'">' + displayHolidayBadge + '</div>',
              '<div class="badge" style="'+ festivalBadgeStyle +'">' + (displayHoliday || jieQi) + '</div>',
            '</div>'
          ].join('');
          that._previewEl.html(tipsText);
        };
        if (!render) return;
        // 面板类型
        if (info.type === 'date') {
          var clazz = [
            'date-cell-inner',
            isHoliday ? 'holiday' : '',
            displayHoliday || jieQi ? 'hightlight' : '',
          ].join(' ');
          var content = [
            '<div class="' + clazz + '">',
              '<b>' + d + '</b>',
              '<i>' + (displayHoliday || jieQi || lunar) + '</i>',
              displayHolidayBadge ? '<u class="badge">' + displayHolidayBadge + '</u>' : '',
            '</div>',
          ].join('');
          // render(content)
          // render($(content)[0])
          var contentEl = $(content);
          contentEl.on('contextmenu', function (e) {
            e.preventDefault();
            layer.tips(lunarDate.toString(), this, {
              tips: [1, '#16baaa'],
              zIndex: 999999999,
            });
          });
          render(contentEl);
        } else if (info.type === 'year') {
          var lunarDate = Lunar.fromDate(new Date(y + 1, 0));
          var lunar = lunarDate.getYearInGanZhi() + lunarDate.getYearShengXiao();
          render([
            y + '年',
            '<div style="font-size:12px">' + lunar + '年</div>',
          ].join(''));
        } else if (info.type === 'month') {
          var lunar = lunarDate.getMonthInChinese();
          render([m + '月(' + lunar + '月)'].join(''));
        }
      },
    });
  });
</script>
</body>
</html>
