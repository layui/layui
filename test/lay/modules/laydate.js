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

  if (date && !(date instanceof Date)) {
      date = new Date(date);
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
  });
});

/* eslint-enable max-nested-callbacks, fecs-indent */
