/**
 * @file laydate - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global layui */
/* eslint-disable max-nested-callbacks, fecs-indent */

var $ = layui.$;
var laydate = layui.laydate;
var lay = window.lay;

/**
 * 是否基于`phantomjs`测试, 因为有些特殊的case在ie中是不可用的, 比如: `window.event = {}`
 *
 * @const
 * @type {boolean}
 */
var IS_PHANTOMJS = layui.device('phantomjs').phantomjs;

/**
 * 创建dom元素, 并返回 jquery 对象
 *
 * @inner
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
 * @inner
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

  it('loaded css link', function () {
    // 验证页面元素
    expect($('#layuicss-laydate').length).to.equal(1, '加载laydate.css的link标签必须存在');
    expect($('#layuicss-laydate').css('display')).to.equal('none', '验证laydate.css是否生效');

    // 验证一个不存在的元素
    expect($('#layuicss-laydate-no-suceess').css('display')).to.be.undefined;
  });

  describe('laydate.render()', function () {
    it('check params and return value', function () {
      expect(laydate.render()).to.be.a('object', 'render() 返回值必须是对象');
      expect(laydate.render('str')).to.have.property('hint');
      expect(laydate.render().hint).to.be.a('function', 'render() 返回值必须包含 hint()');
      expect(laydate.render({})).to.have.property('config');
    });

    describe('options.elem', function () {
      it('selector', function () {
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

      it('error selector', function () {
        expect(function () {
          laydate.render({
            elem: '#test-div-no-selector',
            show: true
          });

          laydate.render({
            elem: '.test-div-no-selector',
            show: true
          });

        }).to.not.throw;

        expect($('.layui-laydate').length).to.equal(0);
      });
    });

    describe('options.type', function () {
      it('default value', function () {
        expect(laydate.render().config.type).to.equal('date');
        expect(laydate.render({
          elem: '#test-div'
        }).config.type).to.equal('date', 'render 方法 options.type 默认值必须是 date');
      });

      // 先不作错误值的校验了
      // it('error value', function () {
      //   expect(function () {
      //     laydate.render({
      //       elem: '#test-div',
      //       type: 'layui'
      //     });
      //   }).to.throw();
      // });

      it('is year', function (done) {
        var result = laydate.render({
          elem: '#test-div',
          type: 'year',
          show: true
        });

        expect(result.config.type).to.equal('year');

        setTimeout(function () {
          expect($('.laydate-set-ym').length).to.equal(1, '标头年月元素必须存在');
          expect($('.laydate-year-list .layui-this').text()).to.equal(dateFormat('yyyy年'), '默认高亮显示当前年');

          $('.laydate-btns-confirm').click();
          expect($('#test-div').text()).to.equal(dateFormat('yyyy'), '确认后输出选中的值');
          done();
        }, 100);
      });

      it('is month', function (done) {
        var result = laydate.render({
          elem: '#test-div',
          type: 'month',
          show: true
        });

        expect(result.config.type).to.equal('month');

        setTimeout(function () {
          expect($('.laydate-set-ym').length).to.equal(1);
          expect($('.laydate-month-list .layui-this').attr('lay-ym'))
            .to.equal(dateFormat('M') - 1 + '', '默认高亮显示当前月');

          $('.laydate-btns-confirm').click();
          expect($('#test-div').text()).to.equal(dateFormat('yyyy-MM'), '确认后输出选中的值');
          done();
        });
      });

      it('is date', function (done) {
        var result = laydate.render({
          elem: '#test-div',
          type: 'date',
          show: true
        });

        expect(result.config.type).to.equal('date');

        setTimeout(function () {
          expect($('.laydate-set-ym').text()).to.equal(dateFormat('yyyy年M月'), '标头内显示当前年+月');
          expect($('.layui-laydate-content .layui-this').attr('lay-ymd'))
            .to.equal(dateFormat('yyyy-M-d'), '默认高亮显示当前日');

          $('.laydate-btns-confirm').click();
          expect($('#test-div').text()).to.equal(dateFormat('yyyy-MM-dd'), '确认后输出选中的值');
          done();
        });
      });

      it('is time', function (done) {
        var result = laydate.render({
          elem: '#test-div',
          type: 'time',
          show: true
        });

        expect(result.config.type).to.equal('time');

        setTimeout(function () {
          expect($('.laydate-time-text').text()).to.equal('选择时间', '标头内显示当前年+月');
          expect($('.laydate-time-list').length).to.equal(1);

          expect($('#test-div').text()).to.equal('');
          $('.laydate-btns-confirm').click();
          expect($('#test-div').text()).to.equal('00:00:00');
          done();
        });
      });

      it('is datetime', function (done) {
        var result = laydate.render({
          elem: '#test-div',
          type: 'datetime',
          show: true
        });
        var now = new Date();

        expect(result.config.type).to.equal('datetime');

        setTimeout(function () {
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
          done();
        });
      });
    });

    describe('options.range', function () {
      it('time type and range', function (done) {
        laydate.render({
          elem: '#test-div',
          type: 'time',
          range: true,
          show: true
        });

        setTimeout(function () {
          expect($('.laydate-time-text').length).to.equal(2);
          $('.laydate-btns-confirm').click();
          expect($('#test-div').text()).to.equal('00:00:00 - 00:00:00', '确认后输出范围值');
          done();
        });
      });

      it('year type and range is split', function () {
        laydate.render({
          elem: '#test-div',
          type: 'year',
          range: '到',
          show: true
        });

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

      it('format and error value', function () {
        laydate.render({
          elem: '#test-div',
          value: '2017年7月7日',
          format: 'yyyy~MM~dd'
        });

        expect($('#test-div').text()).to.equal('2017年7月7日', '默认输出value的值到元素中');
        $('#test-div').click();
        expect($('#test-div').text()).to.equal(dateFormat('yyyy~MM~dd'), '根据options.format修正value为当天');

        // 错误提示
        expect($('.layui-laydate-hint').text()).to.match(/日期格式不合法/);
        expect($('.layui-laydate-hint').text()).to.match(/yyyy~MM~dd/);
      });

      // 验证当format为 yyyyMMdd 和 value=20170707 时是否通过
      it('format and number value', function (done) {
        laydate.render({
          elem: '#test-div',
          value: '20170707',
          format: 'yyyyMMdd',
          show: true
        });

        laydate.render({
          elem: '#test-input',
          value: '201777',
          format: 'yyyyMd',
          show: true
        });

        expect($('#test-div').text()).to.equal('20170707', '默认输出value的值到元素中');
        expect($('#test-input').val()).to.equal('201777', '默认输出value的值到元素中');

        setTimeout(function () {
          // 错误提示
          expect($('.layui-laydate-hint').length).to.equal(0, '格式正确没有错误提示');

          done();
        });
      });
    });

    describe('options.value', function () {
      it('2017-06-31', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-06-31',
          done: function (value) {
            expect(value).to.equal('2017-06-30', '6月最大为30号');
            done();
          }
        });

        $('.laydate-btns-confirm').click();
      });

      it('new Date()', function (done) {
        var date = new Date();
        date.setDate(date.getDate() + 1);

        laydate.render({
          elem: '#test-div',
          show: true,
          value: date,
          done: function (value) {
            expect(value).to.equal(dateFormat('yyyy-MM-dd', 1));
            done();
          }
        });

        $('.laydate-btns-confirm').click();
      });

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
          elem: '#test-input-2',
          show: true
        });

        // 错误提示
        setTimeout(function () {
          expect($('.layui-laydate-hint').text()).to.match(/日期格式不合法/);
          done();
        });
      });

      // 当元素值更新后, 再次显示日历时会更新
      it('change value', function () {
        laydate.render({
          show: true,
          value: '2017-3-7',
          elem: '#test-div'
        });

        expect($('.layui-this').text()).to.equal('7', '显示默认的7');

        $('.laydate-btns-confirm').click();
        $('#test-div').text('2017-7-10').click();
        expect($('.layui-this').text()).to.equal('10', '显示更新后的10');
      });
    });

    describe('options.min and options.max', function () {
      it('date string', function () {
        laydate.render({
          elem: '#test-div',
          min: '2017-7-7',
          max: '2017-7-8',
          value: '2017-7-8'
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
          'layui'
        ]);
      });
    });

    describe('options.lang', function () {
      it('default value is cn', function () {
        var result = laydate.render({
          show: true,
          elem: '#test-div'
        });

        var weeks = $('.layui-laydate-content').find('thead th').map(function () {
          return $(this).text();
        }).get();
        expect(weeks).to.deep.equal(['日', '一', '二', '三', '四', '五', '六'], 'cn版本星期的标头');

        expect($('.laydate-btns-confirm').text()).to.equal('确定', 'cn版本确定按钮');
        expect($('.laydate-btns-now').text()).to.equal('现在', 'cn版本当前按钮');
        expect($('.laydate-btns-clear').text()).to.equal('清空', 'cn版本清除按钮');
        expect(result.config.lang).to.equal('cn');
      });

      it('en', function () {
        var result = laydate.render({
          show: true,
          lang: 'en',
          elem: '#test-div'
        });

        var weeks = $('.layui-laydate-content').find('thead th').map(function () {
          return $(this).text();
        }).get();
        expect(weeks).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], 'en版本星期的标头');

        expect($('.laydate-btns-confirm').text()).to.equal('Confirm', 'en版本确定按钮');
        expect($('.laydate-btns-now').text()).to.equal('Now', 'en版本当前按钮');
        expect($('.laydate-btns-clear').text()).to.equal('Clear', 'en版本清除按钮');
        expect(result.config.lang).to.equal('en');
      });

      it('error vaue', function () {
        var result = laydate.render({
          show: true,
          lang: 'layui',
          elem: '#test-div'
        });

        expect($('.laydate-btns-confirm').text()).to.equal('确定', 'lang错误时默认为中文');
        expect(result.config.lang).to.equal('layui');
      });

      // todo month, time, timeTips
    });

    describe('options.theme', function () {
      it('molv', function () {
        laydate.render({
          show: true,
          elem: '#test-div',
          theme: 'molv'
        });

        expect($('.laydate-theme-molv').length).to.equal(1, '墨绿主题class存在');
      });

      it('grid', function () {
        laydate.render({
          show: true,
          elem: '#test-div',
          theme: 'grid'
        });

        expect($('.laydate-theme-grid').length).to.equal(1, '格子主题class存在');
      });

      it('error value', function () {
        laydate.render({
          show: true,
          elem: '#test-div',
          theme: 'layui-test'
        });

        expect($('.laydate-theme-layui-test').length).to.equal(1, '自定义主题class存在');
      });

      it('#color', function () {
        // 主要处理多浏览器兼容
        var colors = [
          'rgb(0, 0, 0)',
          'rgba(0, 0, 0, 0)',
          '#000'
        ];

        laydate.render({
          show: true,
          elem: '#test-div',
          theme: '#000'
        });

        $.each([
          '.layui-this',
          '.layui-laydate-header'
        ], function (index, selector) {
          expect(colors).to.includes($(selector).css('background-color'), '标头和当前选中颜色必须是设置的');
        });
      });
    });

    describe('options.calendar', function () {
      it('default value', function () {
        var result = laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-3-8'
        });

        expect(result.config.calendar).to.equal(false, '默认值为false');
        expect($('.layui-this').text()).to.equal('8', '显示数字');
      });

      it('is true', function () {
        var result = laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-3-8',
          calendar: true
        });

        expect(result.config.calendar).to.equal(true, '默认值为false');
        expect($('.layui-this').text()).to.equal('妇女', '显示妇女节');
      });

      it('options.lang is en', function () {
        laydate.render({
          elem: '#test-div',
          show: true,
          lang: 'en',
          value: '2017-3-8'
        });

        expect($('.layui-this').text()).to.equal('8', '国际版显示数字');
      });
    });

    describe('options.mark', function () {
      it('every year', function () {
        laydate.render({
          mark: {
            '0-3-7': '妹子'
          },
          show: true,
          value: '2017-3-7',
          elem: '#test-div'
        });

        expect($('.layui-this').text()).to.equal('妹子', '显示自定义的妹子');

        // 再看下4月7日
        $('.laydate-btns-confirm').click();
        $('#test-div').text('2017-4-7').click();
        expect($('.layui-this').text()).to.equal('7', '显示日期');
      });

      it('every year and month', function () {
        laydate.render({
          mark: {
            '0-0-7': '妹子'
          },
          show: true,
          value: '2017-7-7',
          elem: '#test-div'
        });

        expect($('.layui-this').text()).to.equal('妹子', '显示自定义的妹子');

        // 再看下4月7日
        $('.laydate-btns-confirm').click();
        $('#test-div').text('2017-4-7').click();
        expect($('.layui-this').text()).to.equal('妹子', '显示自定义的妹子');
      });

      it('yyyy-M-d', function () {
        laydate.render({
          mark: {
            '2017-3-7': '妹子'
          },
          show: true,
          value: '2017-3-7',
          elem: '#test-div'
        });

        expect($('.layui-this').text()).to.equal('妹子', '显示自定义的妹子');

        // 再看下2016年
        $('.laydate-btns-confirm').click();
        $('#test-div').text('2016-3-7').click();
        expect($('.layui-this').text()).to.equal('7', '显示日期');
      });

      it('options.calendar is true', function () {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-3-8',
          mark: {
            '2017-3-8': '快乐'
          },
          calendar: true
        });

        expect($('.layui-this').text()).to.equal('快乐', '显示被mark覆盖的 快乐');
      });
    });

    // 基于phantomjs测试内部方法
    if (IS_PHANTOMJS) {
      it('options.dateTime', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          dateTime: {
            year: 20000000,
            month: 15,
            minutes: 70,
            seconds: 60,
            hours: 25
          },
          done: function (value) {
            expect(value).to.equal(dateFormat('yyyy-MM-dd'), '设置日期超出范围, 初始化为当天');
            done();
          }
        });

        $('.laydate-btns-confirm').click();
      });
    }
  });

  describe('callbacks', function () {
    describe('render', function () {
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

      // 当show=true时应该直接显示并执行ready事件
      it('options.show is true', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          ready: function (data) {
            expect(data).to.be.a('object');
            done();
          }
        });
      });
    });

    describe('change', function () {
      it('trigger', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-07-07',
          range: false,
          change: function (value, date, endDate) {
            expect(value).to.equal('2017-08-07', '进入下一月的日期');
            expect(date).to.deep.equal({
              year: 2017,
              month: 8,
              date: 7,
              hours: 0,
              minutes: 0,
              seconds: 0
            }, '进入下一月的日期时间对象');
            expect(endDate).to.deep.equal({}, '没有开启 options.range 时 endDate 为空对象');

            done();
          }
        });

        $('.laydate-next-m').click();
      });

      it('options.range is true', function (done) {
        laydate.render({
          elem: '#test-div',
          range: true,
          show: true,
          change: function (value, date, endDate) {
            var start = dateFormat('yyyy-MM-dd');
            var end = dateFormat('yyyy-MM-dd', 1);

            // expect(value).to.equal(start + ' - ' + end, '进入下一月的日期');
            expect(date).to.be.a('Object');
            expect(date).to.not.deep.equal({});
            expect(endDate).to.be.a('Object');
            expect(endDate).to.not.deep.equal({}, '开启 options.range 时 endDate 不能为空');

            done();
          }
        });

        // 模拟点击当天和下一天
        $('[lay-ymd="' + dateFormat('yyyy-M-d') + '"]').click();
        $('[lay-ymd="' + dateFormat('yyyy-M-d', 1) + '"]').click();
      });
    });

    describe('done', function () {
      it('click date', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-07-07',
          range: false,
          done: function (value, date, endDate) {
            expect(value).to.equal('2017-07-07');
            expect(date).to.deep.equal({
              year: 2017,
              month: 7,
              date: 7,
              hours: 0,
              minutes: 0,
              seconds: 0
            });
            expect(endDate).to.deep.equal({});

            done();
          }
        });

        $('.layui-this').click();
      });

      it('click confirm btn', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-07-07',
          range: false,
          done: function (value, date, endDate) {
            expect(value).to.equal('2017-07-07');
            expect(date).to.deep.equal({
              year: 2017,
              month: 7,
              date: 7,
              hours: 0,
              minutes: 0,
              seconds: 0
            });
            expect(endDate).to.deep.equal({});

            done();
          }
        });

        $('.laydate-btns-confirm').click();
      });

      it('click clear btn', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-07-07',
          range: false,
          done: function (value, date, endDate) {
            expect(value).to.equal('');
            expect(date).to.deep.equal({});
            expect(endDate).to.deep.equal({});

            done();
          }
        });

        $('.laydate-btns-clear').click();
      });

      it('click now btn', function (done) {
        laydate.render({
          elem: '#test-div',
          show: true,
          value: '2017-07-07',
          range: false,
          done: function (value, date, endDate) {
            expect(value).to.equal(dateFormat('yyyy-MM-dd'));

            done();
          }
        });

        $('.laydate-btns-now').click();
      });
    });
  });

  describe('#hint', function () {
    it('set string', function () {
      var app = laydate.render({
        elem: '#test-div',
        show: true
      });

      expect(app.hint).to.be.a('function', '.hint 必须是方法');
      app.hint('layui');
      expect($('.layui-laydate-hint').text()).to.equal('layui');
    });

    it('timeout 3000', function (done) {
      var app = laydate.render({
        elem: '#test-div',
        show: true
      });

      app.hint('layui');
      expect($('.layui-laydate-hint').length).to.equal(1);
      setTimeout(function () {
        expect($('.layui-laydate-hint').length).to.equal(0);
        done();
      }, 3500);
    });
  });
  describe('.getEndDate', function () {
    it('default params and return value', function () {
      expect(laydate.getEndDate).to.be.a('function', 'laydate.getEndDate 必须是方法');
      expect(laydate.getEndDate()).to.be.a('number', 'laydate.getEndDate 返回值必须是数字');
      expect(laydate.getEndDate(10, 2017)).to.be.a('number', 'laydate.getEndDate 返回值必须是数字');
      expect(laydate.getEndDate(10)).to.be.a('number', 'laydate.getEndDate 返回值必须是数字');
    });

    it('getEndDate(year)', function () {
      expect(laydate.getEndDate(10)).to.equal(31, '10月最后一天为31');
      expect(laydate.getEndDate(11)).to.equal(30, '11月最后一天为30');
      expect(laydate.getEndDate(11, 2017)).to.equal(30, '2017年11月最后一天为30');
      expect(laydate.getEndDate(10, 2017)).to.equal(31, '2017年10月最后一天为31');
      expect(laydate.getEndDate(2, 2017)).to.equal(28, '2017年2月最后一天为28');
      expect(laydate.getEndDate(2, 2016)).to.equal(29, '2016年2月最后一天为29');
    });
  });

  describe('lay', function () {
    describe('lay.stope', function () {
      it('stopPropagation', function (done) {
        lay.stope({
          stopPropagation: function (e) {
            expect(e).to.be.undefined;
            done();
          }
        });
      });

      it('cancelBubble', function () {
        var event = {};
        lay.stope(event);
        expect(event.cancelBubble).to.be.true;
      });

      // ie中不支持, 只针对phantomjs测试
      if (IS_PHANTOMJS) {
        it('window.event', function () {
          var old = window.event;
          var event = window.event = {};
          lay.stope();
          expect(event.cancelBubble).to.be.true;
          window.event = old;
        });
      }
    });

    describe('lay.extend', function () {
      it('default params and return value', function () {
        expect(lay.extend).to.be.a('function', '必须是方法');
        expect(lay.extend()).to.be.a('object', '返回值必须是对象');
        expect(lay.extend({})).to.be.a('object', '返回值必须是对象');
        expect(lay.extend({}, {})).to.be.a('object', '返回值必须是对象');
      });

      it('multiple object', function () {
        expect(lay.extend({}, {})).to.deep.equal({});
        expect(lay.extend(true, {})).to.deep.equal({});
        expect(lay.extend(true, {a: 1}, {b: 2})).to.deep.equal({
          a: 1,
          b: 2
        }, '合并多个对象');
        expect(lay.extend({a: 1}, {b: 2})).to.deep.equal({
          a: 1,
          b: 2
        }, '合并多个对象');
      });

      it('recursion merge', function () {
        expect(lay.extend({
          a: 1,
          b: {
            b1: 1
          }
        }, {
          b: {
            b2: 1,
            b3: [1]
          }
        }, {
          c: null
        })).to.deep.equal({
          a: 1,
          b: {
            b1: 1,
            b2: 1,
            b3: [1]
          },
          c: null
        });
      });

      it('clone object', function () {
        var a = {};
        lay.extend(a, {
          b: 1
        }, {
          c: []
        });

        expect(a.b).to.equal(1, '污染了原对象');
        expect(a.c).to.deep.equal([], '污染了原对象');
      });
    });

    describe('lay.each', function () {
      it('check params', function () {
        expect(lay.each).to.be.a('function', '必须是方法');
        expect(lay.each()).to.deep.equal(lay, '返回值判断');
        expect(lay.each({})).to.deep.equal(lay);
        expect(lay.each([])).to.deep.equal(lay);
        expect(lay.each({}, function () {})).to.deep.equal(lay);
      });

      it('null params', function (done) {
        var index = 0;
        lay.each(null, function (index) {
          index += 1;
        });
        setTimeout(function () {
          expect(index).to.equal(0);
          done();
        });
      });

      it('object each', function (done) {
        lay.each({
          name: 'layui'
        }, function (key, value) {
          expect(this + '').to.deep.equal(value).and.equal('layui');
          expect(key).to.equal('name');
          done();
        });
      });

      it('array each', function (done) {
        lay.each([
          'layui'
        ], function (index, value) {
          expect(this + '').to.deep.equal(value).and.equal('layui');
          expect(index).to.equal(0);
          done();
        });
      });

      it('break array each', function () {
        var arr = new Array(100).join(',').split(',');
        var flag = -1;
        lay.each(arr, function (index) {
          flag = index;
          if (index > 5) {
            return true;
          }
        });
        expect(flag).to.equal(6);

        flag = -1;
        lay.each(arr, function (index) {
          flag = index;
          if (index > 5) {
            return false;
          }
        });
        expect(flag).to.equal(99);
      });

      it('break object each', function () {
        var obj = {
          name: 'layui',
          version: '2.x'
        };
        var flag = null;
        lay.each(obj, function (key) {
          flag = key;
          return true;
        });
        expect(flag).to.equal('name');

        flag = null;
        lay.each(obj, function (key) {
          flag = key;
          return false;
        });
        expect(flag).to.equal('version');
      });
    });

    describe('lay.elem', function () {
      it('create div', function () {
        expect(lay.elem('div')).to.be.an.instanceof(HTMLElement, '必须是 html 节点');
      });

      it('has error', function () {
        expect(function () {
          lay.elem([]);
        }).to.throw;

        expect(function () {
          lay.elem();
        }).to.throw;
      });

      it('set attrs', function () {
        var node = lay.elem('div', {
          'data-name': 'layui'
        });

        expect($(node).attr('data-name')).to.equal('layui');
      });
    });

    describe('lay.digit', function () {
      it('default params and return value', function () {
        expect(lay.digit).to.be.a('function', '必须是方法');
        expect(lay.digit()).to.equal('undefined', '无参数时返回 undefined');
      });

      it('default length', function () {
        expect(lay.digit(1)).to.equal('01');
        expect(lay.digit(1)).to.equal(lay.digit(1, 2));
        expect(lay.digit(11)).to.equal('11');
        expect(lay.digit('111')).to.equal('111');
      });

      it('set length', function () {
        expect(lay.digit(1, 1)).to.equal('1');
        expect(lay.digit(1, 2)).to.equal('01');
        expect(lay.digit(11, 1)).to.equal('11');
        expect(lay.digit('11', 10)).to.equal('0000000011', '补10位');
        expect(lay.digit(1, 5)).to.equal('00001');
        expect(lay.digit(1, 100).length).to.equal(100, '补100位');
      });
    });

    if (IS_PHANTOMJS) {
      it('lay.ie', function () {
        expect(lay.ie).to.be.a('boolean');
      });
    }
  });

  describe('lay()', function () {
    it('return value', function () {
      expect(lay).to.be.a('function', '必须是方法');
      expect(lay()).to.be.a('object');
    });

    it('#find', function () {
      expect(lay('body').find()[0]).to.be.undefined;
      expect(lay('body').find('.test-test-empty')[0]).to.be.undefined;
      expect(lay('body').find('div')[0]).to.not.be.undefined;
    });

    it('#addClass', function () {
      var $node = lay('#test-div');

      expect($('#test-div').hasClass('layui')).to.be.false;
      expect($node.addClass('layui')).to.deep.equal($node);
      expect($('#test-div').hasClass('layui')).to.be.true;
    });

    it('#removeClass', function () {
      var $node = lay('#test-div');

      lay('#test-div').addClass('layui');
      expect($('#test-div').hasClass('layui')).to.be.true;
      expect($node.removeClass('layui')).to.deep.equal($node);
      expect($('#test-div').hasClass('layui')).to.be.false;
    });

    it('#hasClass', function () {
      expect(lay('#test-div').hasClass('layui')).to.be.false;
      lay('#test-div').addClass('layui');
      expect(lay('#test-div').hasClass('layui')).to.be.true;
      lay('#test-div').removeClass('layui');
      expect(lay('#test-div').hasClass('layui')).to.be.false;
    });

    it('#attr', function () {
      $('#test-div').attr('data-name', 'layui');
      expect(lay('#test-div').attr('data-name')).to.equal('layui');

      var $node = lay('#test-div');
      expect($node.attr('data-name', 'layui-2')).to.deep.equal($node);
      expect(lay('#test-div').attr('data-name')).to.equal('layui-2');

      expect(lay('#test-test-empty').attr('data-name')).to.be.undefined;
    });

    it('#removeAttr', function () {
      var $node = lay('#test-div');

      lay('#test-div').attr('data-name', 'layui');
      expect(lay('#test-div').attr('data-name')).to.equal('layui');

      expect(lay('#test-div').removeAttr('data-name')).to.deep.equal($node);
      expect(lay('#test-div').attr('data-name')).to.not.equal('layui');
    });

    it('#html', function () {
      var str = '<b>layui</b>';
      var $node = lay('#test-div');
      expect($node.html(str)).to.deep.equal($node);

      expect($('#test-div').html()).to.equal(str);
    });

    it('#val', function () {
      var $node = lay('#test-input');
      expect($node.val('layui')).to.deep.equal($node);
      expect($('#test-input').val()).to.equal('layui');
    });

    it('#append', function () {
      var $node = lay('#test-div');

      expect($node.append('<b>1</b>')).to.deep.equal($node);
      lay('#test-div').append('<b>2</b>');
      expect($('#test-div').html()).to.equal('<b>1</b><b>2</b>');
      $('#test-div').empty();

      var node = $('<b />').html('layui').get(0);
      lay('#test-div').append(node);
      expect($('#test-div').html()).to.equal('<b>layui</b>');
    });

    it('#remove', function () {
      lay('#test-div').append('<div>1</div>');
      expect($('#test-div').children().length).to.equal(1);
      lay('#test-div').remove($('#test-div').children().get(0));
      expect($('#test-div').children().length).to.equal(0);

      lay('#test-div').append('<div>1</div>');
      expect($('#test-div').children().length).to.equal(1);
      lay('#test-div div').remove();
      expect($('#test-div').children().length).to.equal(0);
    });

    it('#on', function (done) {
      lay('#test-div').on('click', function (event) {
        expect(event).to.be.not.undefined;
        done();
      });
      $('#test-div').click();
    });

    // it('#off', function (done) {
    //   var fn = function () {
    //     done('off error');
    //   };
    //   lay('#test-div').on('click', fn).off('click', fn);
    //   $('#test-div').click();
    //   setTimeout(function () {
    //     done();
    //   });
    // });
  });
});

/* eslint-enable max-nested-callbacks, fecs-indent */
