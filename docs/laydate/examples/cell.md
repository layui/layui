<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link href="{{= d.layui[2].cdn.css }}" rel="stylesheet">
    <style>
      .laydate-theme-lunar .layui-laydate-main{
        width: auto;
      }
      .laydate-theme-lunar .date-cell-inner{
        padding: 6px;
        width: 44px;
        height: 40px;
        border-radius: 4px !important;
      }
      .laydate-theme-lunar .layui-this{
        border-radius: 4px !important;
      }
      .laydate-theme-lunar .date-cell-inner b{
        display: block;
        font-weight: 400;
        height: 16px;
        font-size: 14px;
      }
      .laydate-theme-lunar .date-cell-inner i{
        display: block;
        font-style: normal;
        font-size: 10px;
      }
      .laydate-theme-lunar .laydate-month-list>li{
        height: 50px !important;
        line-height: 50px !important;
        width: 24.2% !important;
        margin: 18px 1px !important;
      }
      .laydate-theme-lunar .laydate-year-list>li{
        height: 40px !important;
        line-height: normal !important;
        width: 31.3% !important;
        margin: 8px 2px !important;
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

        laydate.render({
          elem: '#ID-laydate-cell-render',
          value: "2024-03-30",
          position: 'static',
          isPreview: false,
          btns: ['now'],
          theme: 'lunar',
          cellRender: function(ymd, render, info){
            var y = ymd[0];
            var m = ymd[1];
            var d = ymd[2];
          
            var lunarDate = Solar.fromYmd(y, m, d).getLunar();
            var jieQi = lunarDate.getJieQi();
            var holiday = HolidayUtil.getHoliday(y, m, d);
            var displayHoliday = (holiday && holiday.getTarget() === holiday.getDay()) ? holiday.getName() : undefined;
            
            if(info.type === 'date'){
              var lunar = lunarDate.getDayInChinese();
              var content = [
                '<div class="date-cell-inner">',
                  '<b>' + d + '</b>',
                  '<i>' + (displayHoliday || jieQi || lunar) + '</i>',
                '</div>'
              ].join('');
              render(content);
            }else if(info.type === 'year'){
              var lunarDate = Lunar.fromDate(new Date(y + 1, 0));
              var lunar = lunarDate.getYearInGanZhi() + lunarDate.getYearShengXiao()
              render(y + '年<div style="font-size:12px">' + lunar +'年</div>');
            }else if(info.type === 'month'){
              var lunar =  lunarDate.getMonthInChinese()
              render( m + '月(' + lunar  + '月)');
            }
          }
        })
      });
    </script>
  </body>
</html>
