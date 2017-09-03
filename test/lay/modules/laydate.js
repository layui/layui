/**
 * @file laydate - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global layui */
/* eslint-disable max-nested-callbacks, fecs-indent */

var $ = layui.$;
var laydate = layui.laydate;

/**
 * 创建dom元素, 并返回 jquery 对象
 *
 * @param  {string} html 标签
 *
 * @return {jQuery}
 */
var createNode = function (html) {
  return $(html).addClass('test-node').appendTo('body');
};

/**
 * 日期格式化
 *
 * @param {string} str 格式
 * @param {Date|number|string} date 时间对象或者时间缀
 * @return {string}
 *
 * @example
 * yyyy-MM-dd hh:mm:ss.S
 * yyyy-MM-dd E HH:mm:ss
 * yyyy-MM-dd EE hh:mm:ss
 * yyyy-MM-dd EEE hh:mm:ss
 * yyyy-M-d h:m:s.S
 */
var dateFormat = function (str, date) {
  str = str || 'yyyy-MM-dd HH:mm';

  if (date) {
    if ('number' === typeof date && String(date).length !== 13) {
      var temp = new Date();
      temp.setDate(temp.getDate() + date);
      date = temp;
    }
    else if (!(date instanceof Date)) {
      date = new Date(date);
    }
  }
  else {
    date = new Date();
  }

  var getTime = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S': date.getMilliseconds()
  };

  // 如果有年
  if (/(y+)/i.test(str)) {
    // RegExp.$1为上次正则匹配的第1个结果，那么length就不用说了吧
    str = str.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  layui.each(getTime, function (key) {
    if (new RegExp('(' + key + ')').test(str)) {
      str = str.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (getTime[key])
        : (('00' + getTime[key]).substr(('' + getTime[key]).length)));
    }
  });

  return str;
};


describe('laydate', function () {
  // 输出测试节点
  beforeEach(function () {
    createNode('<div id="test-div"></div>');
    createNode('<input id="test-input" type="text">');
  });

  // 删除节点
  afterEach(function () {
    $('.layui-laydate, .test-node').remove();
  });

  it('version', function () {
    expect(laydate.v).to.be.a('string');
    expect(laydate.v).to.not.be.empty;
  });

  describe('laydate.render()', function () {
    it('check params and return value', function () {
      expect(laydate.render()).to.be.a('object', 'render() 返回值必须是对象');
      expect(laydate.render('str')).to.have.property('hint');
      expect(laydate.render().hint).to.be.a('function', 'render() 返回值必须包含 hint()');
      expect(laydate.render({})).to.have.property('config');
    });

    describe('options.ready', function () {
      it('not elem', function (done) {
        var flag = true;
        laydate.render({
          ready: function () {
            flag = false;
          }
        });

        setTimeout(function () {
          expect(flag).to.be.true;
          done();
        }, 360);
      });

      it('trigger', function (done) {
        laydate.render({
          elem: '#test-div',
          ready: function (data) {
            expect(data).to.be.a('object');
            done();
          }
        });

        $('#test-div').click();
      });

      // 如果是div则自动切换成click
      it('multiple trigger', function (done) {
        var index = 0;

        laydate.render({
          elem: '#test-div',
          ready: function () {
            index += 1;
          }
        });
        $('#test-div').click().click().click();

        setTimeout(function () {
          expect(index).to.equal(3);
          done();
        });
      });
    });

    it('options.elem', function () {
      expect(function () {
        laydate.render({
          elem: '#test-div'
        });

        laydate.render({
          elem: '#test-div-layui'
        });

        laydate.render({
          elem: '.ok-layui'
        });
      }).to.not.throw;

      expect($('.layui-laydate').length).to.equal(0);
    });

    describe('options.type', function () {
      it('default value', function () {
        expect(laydate.render().config.type).to.equal('date');
        expect(laydate.render({
          elem: '#test-div'
        }).config.type).to.equal('date', 'render 方法 options.type 默认值必须是 date');
      });

      it('error value', function () {
        expect(function () {
          laydate.render({
            elem: '#test-div',
            type: 'layui'
          });
        }).to.throw();
      });

      it('is year', function () {
        var result = laydate.render({
          elem: '#test-div',
          type: 'year'
        });

        expect(result.config.type).to.equal('year');
        expect($('.laydate-set-ym').length).to.equal(0);

        $('#test-div').click();

        expect($('.laydate-set-ym').length).to.equal(1);
        expect($('.laydate-year-list .layui-this').text()).to.equal(dateFormat('yyyy年'), '默认高亮显示当前年');

        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy'), '确认后输出选中的值');
      });

      it('is month', function () {
        var result = laydate.render({
          elem: '#test-div',
          type: 'month'
        });

        expect(result.config.type).to.equal('month');
        expect($('.laydate-set-ym').length).to.equal(0);

        $('#test-div').click();

        expect($('.laydate-set-ym').length).to.equal(1);
        expect($('.laydate-month-list .layui-this').attr('lay-ym'))
          .to.equal(dateFormat('M') - 1 + '', '默认高亮显示当前月');

        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy-MM'), '确认后输出选中的值');
      });

      it('is date', function () {
        var result = laydate.render({
          elem: '#test-div',
          type: 'date'
        });
        var now = new Date();

        expect(result.config.type).to.equal('date');
        expect($('.laydate-set-ym').length).to.equal(0);

        $('#test-div').click();

        expect($('.laydate-set-ym').text()).to.equal(dateFormat('yyyy年M月'), '标头内显示当前年+月');
        expect($('.layui-laydate-content .layui-this').attr('lay-ymd'))
          .to.equal(dateFormat('yyyy-M-d'), '默认高亮显示当前日');

        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy-MM-dd'), '确认后输出选中的值');
      });

      it('is time', function () {
        var result = laydate.render({
          elem: '#test-div',
          type: 'time'
        });

        expect(result.config.type).to.equal('time');
        expect($('.laydate-time-text').length).to.equal(0);

        $('#test-div').click();

        expect($('.laydate-time-text').text()).to.equal('选择时间', '标头内显示当前年+月');
        expect($('.laydate-time-list').length).to.equal(1);

        expect($('#test-div').text()).to.equal('');
        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal('00:00:00');
      });

      it('is datetime', function () {
        var result = laydate.render({
          elem: '#test-div',
          type: 'datetime'
        });
        var now = new Date();

        expect(result.config.type).to.equal('datetime');
        expect($('.laydate-set-ym').length).to.equal(0);

        $('#test-div').click();

        expect($('.laydate-set-ym').text()).to.equal(
          now.getFullYear() + '年' + (now.getMonth() + 1) + '月',
          '标头内显示当前年+月'
        );
        expect($('.layui-laydate-content .layui-this').attr('lay-ymd')).to.equal(
          now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
          '默认高亮显示当前日'
        );
        expect($('.laydate-btns-time').text()).to.equal('选择时间');
        expect($('.laydate-time-text').text()).to.equal('');

        // 断定选择时间的切换
        $('.laydate-btns-time').click();
        expect($('.laydate-time-text').text()).to.equal('选择时间');
        expect($('.laydate-btns-time').text()).to.equal('返回日期');
        $('.laydate-btns-time').click();
        expect($('.laydate-time-text').text()).to.equal('');
        expect($('.laydate-btns-time').text()).to.equal('选择时间');

        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy-MM-dd 00:00:00'), '确认后输出选中的值');
      });
    });

    describe('options.range', function () {
      it('time type and range', function () {
        laydate.render({
          elem: '#test-div',
          type: 'time',
          range: true
        });

        $('#test-div').click();
        expect($('.laydate-time-text').length).to.equal(2);
        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal('00:00:00 - 00:00:00', '确认后输出范围值');
      });

      it('year type and range is split', function () {
        laydate.render({
          elem: '#test-div',
          type: 'year',
          range: '到'
        });

        $('#test-div').click();
        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.match(/\d+\s到\s\d+/, '确认后输出范围值');
      });
    });

    describe('options.format', function () {
      it('default value', function () {
        expect(laydate.render().config.format).to.equal('yyyy-MM-dd');
        expect(laydate.render({
          elem: '#test-div'
        }).config.format).to.equal('yyyy-MM-dd', 'render 方法 options.format 默认值必须是 yyyy-MM-dd');
      });

      it('yyyy年MM月dd日 HH时mm分ss秒', function () {
        var result = laydate.render({
          format: 'yyyy年MM月dd日 HH时mm分ss秒',
          elem: '#test-div'
        });

        expect(result.config.format).to.equal('yyyy年MM月dd日 HH时mm分ss秒', '设置 option.format 返回配置内必须相等');
        $('#test-div').click();
        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy年MM月dd日 00时00分00秒'), '确认后输出选中的值');
      });

      it('datetime type and yyyy年的M月某天晚上，大概H点', function () {
        laydate.render({
          format: 'yyyy年的M月某天晚上，大概H点',
          elem: '#test-div',
          type: 'datetime'
        });

        $('#test-div').click();
        $('.laydate-btns-time').click();
        $('.laydate-time-list li').eq(0).find('li').eq(5).click();
        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy年的M月某天晚上，大概5点'), '确认后输出选中的值');
      });
    });

    describe('options.value', function () {
      it('yyyy-MM-dd', function () {
        laydate.render({
          elem: '#test-div',
          value: '1990年11月27日',
          format: 'yyyy年MM月dd日'
        });

        $('#test-div').click();
        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal('1990年11月27日', '确认后输出选中的值');
      });

      it('yyyy-MM-dd not format value', function () {
        laydate.render({
          elem: '#test-div',
          value: '1990-11月-日',
          format: 'yyyy年MM月dd日'
        });

        $('#test-div').click();

        // 错误提示
        expect($('.layui-laydate-hint').text()).to.match(/日期格式不合法/);
        expect($('.layui-laydate-hint').text()).to.match(/yyyy年MM月dd日/);

        $('.laydate-btns-confirm').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy年MM月dd日'), '确认后输出选中的值');
      });

      it('number not format value', function () {
        laydate.render({
          elem: '#test-div',
          value: Date.now()
        });

        $('#test-div').click();

        // 错误提示
        expect($('.layui-laydate-hint').text()).to.match(/日期格式不合法/);
      });

      it('div default html value format error', function () {
        laydate.render({
          elem: '#test-div',
          value: Date.now()
        });

        $('#test-div').text('layui').click();

        // 错误提示
        expect($('.layui-laydate-hint').text()).to.match(/日期格式不合法/);
      });

      it('input default value format error', function (done) {
        createNode('<input id="test-input-2" type="text" value="layui">');

        laydate.render({
          elem: '#test-input-2'
        });

        $('#test-input-2').focus();

        // 错误提示
        setTimeout(function () {
          expect($('.layui-laydate-hint').text()).to.match(/日期格式不合法/);
          done();
        });
      });
    });

    describe('options.min and options.max', function () {
      it('date string', function () {
        laydate.render({
          elem: '#test-div',
          min: '2017-7-7',
          max: '2017-7-8'
        });

        $('#test-div').click();
        $('.laydate-set-ym').find('[lay-type="year"]').click();
        expect($('.laydate-year-list .layui-this').text()).to.equal('2017年');

        // 只有2017年可用
        expect($('.laydate-year-list [lay-ym="2016"]').hasClass('laydate-disabled')).to.be.true;
        expect($('.laydate-year-list [lay-ym="2018"]').hasClass('laydate-disabled')).to.be.true;

        $('#test-div').click();
        $('.laydate-set-ym').find('[lay-type="month"]').click();

        // 只有7月可用
        expect($('.laydate-month-list [lay-ym="5"]').hasClass('laydate-disabled')).to.be.true;
        expect($('.laydate-month-list [lay-ym="7"]').hasClass('laydate-disabled')).to.be.true;
      });

      // 错误字符串时直接设为当天最小
      it('error string', function () {
        laydate.render({
          elem: '#test-div',
          min: 'layui',
          max: 'layui'
        });

        $('#test-div').click();

        expect($('.layui-laydate-content .layui-this').attr('lay-ymd')).to.equal(dateFormat('yyyy-M-d'), '默认选中日期');

        // 昨天不可用, 判断是为了处理跨月
        var $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', -1) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.true;
        }

        // 明天不可用, 判断是为了处理跨月
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', 1) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.true;
        }
      });

      it('date number', function () {
        laydate.render({
          elem: '#test-div',
          min: -2,
          max: 2
        });

        $('#test-div').click();

        // 前两天应该是可用, 判断是为了处理跨月
        var $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', -2) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.false;
        }

        // 前三天应该是禁用的
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', -3) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.true;
        }

        // 后两天可用
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', 2) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.false;
        }

        // 后三天禁用
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', 3) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.true;
        }
      });

      it('timestamp', function () {
        var date = new Date();
        var date2 = new Date();

        // 获取前三天的时间缀
        date.setDate(date.getDate() + -3);
        date2.setDate(date2.getDate() + 3);

        laydate.render({
          elem: '#test-div',
          min: date.getTime(),
          max: date2.getTime()
        });

        $('#test-div').click();

        // 前三天可用, 防止跨月
        var $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', -3) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.false;
        }

        // 前四天不可用
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', -4) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.true;
        }

        // 后三天可用
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', 3) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.false;
        }

        // 后四天不可用
        $elem = $('.layui-laydate-content [lay-ymd="' + dateFormat('yyyy-M-d', 4) + '"]');
        if ($elem.length) {
          expect($elem.hasClass('laydate-disabled')).to.be.true;
        }
      });

      it('and options.value', function () {
        laydate.render({
          elem: '#test-div',
          min: '2017-7-7',
          max: '2017-7-7',
          value: '2017-7-7'
        });

        $('#test-div').click();

        expect($('.layui-laydate-content .layui-this').attr('lay-ymd')).to.equal('2017-7-7', '默认选中日期');
        expect($('.layui-laydate-content [lay-ymd="2017-7-6"]').hasClass('laydate-disabled')).to.be.true;
        expect($('.layui-laydate-content [lay-ymd="2017-7-8"]').hasClass('laydate-disabled')).to.be.true;
      });

      // 当最大小于最小时, 日期选择都不可用
      it('options.max < options.min', function () {
        laydate.render({
          elem: '#test-div',
          min: '2017-7-7',
          max: '2017-7-1'
        });

        $('#test-div').click();
        $('.laydate-set-ym').find('[lay-type="year"]').click();

        // 查找可用的年
        var year = $('.laydate-year-list li').filter(function () {
          return !$(this).hasClass('laydate-disabled');
        }).get();
        expect(year.length).to.equal(0);

        $('#test-div').click();
        $('.laydate-set-ym').find('[lay-type="month"]').click();

        // 查找可用的月
        var month = $('.laydate-month-list li').filter(function () {
          return !$(this).hasClass('laydate-disabled');
        }).get();
        expect(month.length).to.equal(0);
      });
    });

    describe('options.trigger', function () {
      it('default value', function () {
        var result = laydate.render({
          elem: '#test-input'
        });
        expect(result.config.trigger).to.equal('focus');

        result = laydate.render({
          elem: '#test-div'
        });
        // div会默认转成click
        expect(result.config.trigger).to.equal('click');
      });

      it('not click', function (done) {
        laydate.render({
          elem: '#test-div',
          trigger: 'layui',
          ready: done
        });

        $('#test-div').click();

        setTimeout(done);
      });
    });

    describe('options.show', function () {
      it('default value', function (done) {
        laydate.render({
          elem: '#test-div',
          ready: done
        });
        setTimeout(done);
      });

      it('show is true', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          ready: function () {
            done();
          }
        });
      });

      // 以下2个是测试和`options.closeStop`的配合
      it('element trigger show', function (done) {
        createNode('<button id="test-trigger-show">显示</button>');
        $('#test-trigger-show').on('click', function () {
          laydate.render({
            elem: '#test-div',
            show: true
          });
        }).click();

        setTimeout(function () {
          expect($('.layui-laydate').length).to.equal(0);
          done();
        }, 100);
      });
      it('element trigger show and options.closeStop', function (done) {
        createNode('<button id="test-trigger-show">显示</button>');
        $('#test-trigger-show').on('click', function () {
          laydate.render({
            elem: '#test-div',
            show: true,
            closeStop: '#test-trigger-show'
          });
        }).click();

        setTimeout(function () {
          expect($('.layui-laydate').length).to.equal(1);
          done();
        }, 100);
      });
    });

    describe('options.position', function () {
      it('static', function () {
        laydate.render({
          elem: '#test-div',
          position: 'static'
        });

        expect($('#test-div').find('.layui-laydate-static').length).to.equal(1);
      });

      it('fixed', function () {
        laydate.render({
          elem: '#test-div',
          position: 'fixed',
          show: true
        });

        expect($('.layui-laydate').css('position')).to.equal('fixed');
      });
    });

    describe('options.zIndex', function () {
      it('options.position is fixed', function () {
        laydate.render({
          elem: '#test-div',
          position: 'fixed',
          show: true,
          zIndex: 10086
        });

        expect($('.layui-laydate').css('zIndex')).to.equal('10086');
      });

      it('options.position is abolute', function () {
        laydate.render({
          elem: '#test-div',
          show: true,
          position: 'abolute',
          zIndex: 10086
        });

        expect($('.layui-laydate').css('zIndex')).to.equal('10086');
      });

      it('options.position is static', function () {
        laydate.render({
          elem: '#test-div',
          position: 'static',
          show: true,
          zIndex: 10086
        });

        expect($('.layui-laydate').css('zIndex')).to.equal('10086');
      });
    });

    describe('options.showBottom', function () {
      it('default value', function () {
        laydate.render({
          elem: '#test-div',
          show: true
        });

        expect($('.layui-laydate-footer').length).to.equal(1);
      });

      it('is false', function () {
        laydate.render({
          elem: '#test-div',
          show: true,
          showBottom: false
        });

        expect($('.layui-laydate-footer').length).to.equal(0);
      });
    });

    describe('options.btns', function () {
      it('default value', function () {
        laydate.render({
          elem: '#test-div',
          show: true
        });

        var btns = $('.laydate-footer-btns span').map(function () {
          return $(this).attr('lay-type');
        }).get();

        expect(btns).to.deep.equal([
          'clear',
          'now',
          'confirm'
        ]);
      });

      it('[confirm, now]', function () {
        laydate.render({
          elem: '#test-div',
          show: true,
          btns: ['confirm', 'now']
        });

        var btns = $('.laydate-footer-btns span').map(function () {
          return $(this).attr('lay-type');
        }).get();

        expect(btns).to.deep.equal([
          'confirm',
          'now'
        ]);
      });

      it('error value', function () {
        laydate.render({
          elem: '#test-div',
          show: true,
          btns: ['layui']
        });

        var btns = $('.laydate-footer-btns span').map(function () {
          return $(this).attr('lay-type');
        }).get();

        expect(btns).to.deep.equal([
          'layui',
        ]);
      });
    });
  });
});

/* eslint-enable max-nested-callbacks, fecs-indent */
