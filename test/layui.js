/**
 * @file layui - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global layui */
/* eslint-disable max-nested-callbacks, fecs-indent */

var $ = layui.$;

/**
 * 是否基于`phantomjs`测试, 因为有些特殊的case在ie中是不可用的, 比如: `window.event = {}`
 *
 * @type {boolean}
 */
var IS_PHANTOMJS = layui.device('phantomjs').phantomjs;

describe('layui', function () {
  it('version', function () {
    expect(layui.v).to.be.a('string');
    expect(layui.v).to.not.be.empty;
  });

  it('layui.config', function () {
    expect(layui.config()).to.deep.equal(layui);
    expect(layui.config({
      testName: 'layui'
    })).to.deep.equal(layui);
    expect(layui.cache.testName).to.equal('layui');
  });

  describe('layui.router', function () {
    var defaultData = {
      path: [],
      search: {},
      hash: ''
    };

    it('default params', function () {
      expect(layui.router).to.be.a('function');
      expect(layui.router()).to.be.a('object').and.deep.equal(defaultData);
    });

    it('error router', function () {
      [
        null,
        '',
        '#123',
        '123',
        '##'
      ].forEach(function (key) {
        expect(layui.router(key)).to.deep.equal(defaultData);
      });
    });

    it('router querystring', function () {
      expect(layui.router('#/a=1/b=2/c=')).to.deep.equal($.extend({}, defaultData, {
        href: '/a=1/b=2/c=',
        search: {
          a: '1',
          b: '2',
          c: ''
        }
      }));

      expect(layui.router('#/a=测试/b=2').search).to.deep.equal({
        a: '测试',
        b: '2'
      });

      // todo
      // urlencode
      // urldecode
    });

    it('router hash', function () {
      expect(layui.router('#/name#layui')).to.deep.equal($.extend({}, defaultData, {
        hash: '#layui',
        path: ['name'],
        href: '/name#layui'
      }));
      expect(layui.router('#/name#layui').hash).to.equal('#layui');
      expect(layui.router('#/name#layui=1').hash).to.equal('#layui=1');
      expect(layui.router('#/name##layui').hash).to.equal('##layui');
      expect(layui.router('#/name=1#layui').hash).to.equal('#layui');
      expect(layui.router('#/name=1/b=2#layui').hash).to.equal('#layui');
    });

    it('router path', function () {
      expect(layui.router('#/a/b/c=2#hash')).to.deep.equal({
        path: ['a', 'b'],
        search: {
          c: '2'
        },
        hash: '#hash',
        href: '/a/b/c=2#hash'
      });
    });
  });

  describe('layui.each', function () {
    it('check params', function () {
      expect(layui.each).to.be.a('function');
      expect(layui.each()).to.deep.equal(layui);
      expect(layui.each({})).to.deep.equal(layui);
      expect(layui.each([])).to.deep.equal(layui);
      expect(layui.each({}, function () {})).to.deep.equal(layui);
      expect(layui.each([], function () {})).to.deep.equal(layui);
    });

    it('null params', function (done) {
      var index = 0;
      layui.each(null, function (index) {
        index += 1;
      });
      setTimeout(function () {
        expect(index).to.equal(0);
        done();
      });
    });

    it('object each', function (done) {
      layui.each({
        name: 'layui'
      }, function (key, value) {
        expect(this + '').to.deep.equal(value).and.equal('layui');
        expect(key).to.equal('name');
        done();
      });
    });

    it('array each', function (done) {
      layui.each([
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
      layui.each(arr, function (index) {
        flag = index;
        if (index > 5) {
          return true;
        }
      });
      expect(flag).to.equal(6);

      flag = -1;
      layui.each(arr, function (index) {
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
      layui.each(obj, function (key) {
        flag = key;
        return true;
      });
      expect(flag).to.equal('name');

      flag = null;
      layui.each(obj, function (key) {
        flag = key;
        return false;
      });
      expect(flag).to.equal('version');
    });
  });

  describe('layui.img', function () {
    var base64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    it('success callback', function (done) {
      layui.img(base64, function (img) {
        expect(img).to.not.undefined;
        expect(typeof(img)).to.equal('object', '是img对象');
        expect(img.nodeType).to.equal(1, 'img标签节点');

        // 在ie11中不通过, 原因目前不明
        // expect(img.width).to.equal(1);
        // expect(img.height).to.equal(1);
        done();
      });
    });

    it('error callback', function (done) {
      layui.img('/api/mock?statusCode=404', function () {}, function (e) {
        expect(e).to.not.undefined;
        done();
      });
    });

    // 先删除, 因为没有哪个图片是决定不变的
    // it('http 200', function (done) {
    //   layui.img('https://www.baidu.com/img/bd_logo1.png', function (img) {
    //     expect(img).to.not.undefined;
    //     done();
    //   });
    // });

    // 由于没有超时配置, 在部分设备中, dns解析可能超时
    // it('http 404', function (done) {
    //   layui.img('http://www.404.xx/logo.404.gif', function () {}, function (e) {
    //     expect(e).to.not.undefined;
    //     done();
    //   });
    // });

    it('load complete', function (done) {
      layui.img(base64, function () {
        layui.img(base64, function (img) {
          expect(img).to.not.undefined;
          done();
        });
      });
    });
  });

  it('layui.hint', function () {
    expect(layui.hint).to.be.a('function');
    expect(layui.hint()).to.be.a('object');
    expect(layui.hint().error).to.be.a('function');
  });

  describe('layui.stope', function () {
    it('stopPropagation', function (done) {
      layui.stope({
        stopPropagation: function (e) {
          expect(e).to.be.undefined;
          done();
        }
      });
    });

    it('cancelBubble', function () {
      var event = {};
      layui.stope(event);
      expect(event.cancelBubble).to.be.true;
    });

    // ie中不支持, 只针对phantomjs测试
    if (IS_PHANTOMJS) {
      it('window.event', function () {
        var old = window.event;
        var event = window.event = {};
        layui.stope();
        expect(event.cancelBubble).to.be.true;
        window.event = old;
      });
    }
  });

  describe('layui.onevent', function () {
    it('check params and return value', function () {
      expect(layui.onevent).to.be.a('function');
      expect(layui.onevent()).to.deep.equal(layui);
      expect(layui.onevent([], [], [])).to.deep.equal(layui);
      expect(layui.onevent({}, {}, {})).to.deep.equal(layui);
      expect(layui.onevent('test-' + Date.now(), 'click', function () {})).to.not.deep.equal(layui);
    });

    it('bind event', function (done) {
      var id = 'test-bind-event';
      var data = {
        name: 'layui'
      };
      layui.onevent(id, 'click', function (param) {
        expect(this).to.deep.equal(layui);
        expect(param).to.deep.equal(data);
        done();
      });
      layui.event(id, 'click', data);
    });

    it('coverage of the same name event', function () {
      var id = 'test-same-event';
      var index = 0;
      layui.onevent(id, 'click', function () {
        index = 1;
      });
      layui.onevent(id, 'click', function () {
        index = 2;
      });
      layui.event(id, 'click');
      expect(index).to.equal(2);
    });
  });

  describe('layui.event', function () {
    it('trigger event', function (done) {
      layui.onevent('test-trigger', 'click(*)', function (data) {
        expect(data).to.be.true;
        done();
      });
      layui.event('test-trigger', 'click(*)', true);
    });

    it.skip('trigger multiple', function () {
      var index = 0;
      var id = 'test-trigger-multiple';
      layui.onevent(id, 'nav', function () {
        index += 1;
      });
      layui.event(id, 'nav');
      layui.event(id, 'nav');
      layui.event(id, 'nav');
      expect(index).to.equal(3);
    });

    it('return value', function () {
      expect(layui.event('id', 'event')).to.be.null;

      // 只有在返回 false 时, 结果才是 false
      layui.onevent('test-return-value-1', 'click', function (data) {
        return data;
      });
      expect(layui.event('test-return-value-1', 'click', false)).to.be.false;
      expect(layui.event('test-return-value-1', 'click', true)).to.be.null;
      expect(layui.event('test-return-value-1', 'click')).to.be.null;
    });
  });

  describe('layui.sort', function () {
    var numberData = [
      {
        name: 1
      },
      {
        name: 3
      },
      {
        name: 2
      }
    ];

    it('check params and return value', function () {
      expect(layui.sort()).to.deep.equal([], '空参数时默认为空数组');

      expect(layui.sort({})).to.deep.equal({}, '只传空对象默认返回');
      expect(layui.sort({
        name: 'layui'
      })).to.deep.equal({
        name: 'layui'
      }, '只传一个对象参数时返回');

      expect(layui.sort([{
        name: 'layui'
      }], 'name')).to.deep.equal([{
        name: 'layui'
      }]);

      expect(layui.sort([{
        name: 'layui'
      }], 'name', true)).to.deep.equal([{
        name: 'layui'
      }]);
    });

    // 测试是否污染原数据
    it('clone object', function () {
      var clone = layui.sort(numberData, 'name');

      // 往clone对象添加
      clone.push('layui');

      expect(clone).to.have.lengthOf(4);
      expect(numberData).to.have.lengthOf(3);
    });

    it('format value number', function () {
      var result = layui.sort([
        {
          key: '1'
        },
        {
          key: '-1'
        },
        {
          key: 2
        },
        {
          key: 3
        }
      ], 'key');
      expect(result).to.deep.equal([
        {
          key: '-1'
        },
        {
          key: '1'
        },
        {
          key: 2
        },
        {
          key: 3
        }
      ]);
    });

    it('asc order', function () {
      var result = layui.sort(numberData, 'name');
      expect(result).to.deep.equal([
        {
          name: 1
        },
        {
          name: 2
        },
        {
          name: 3
        }
      ]);
    });

    it('desc order', function () {
      var result = layui.sort(numberData, 'name', true);
      expect(result).to.deep.equal([
        {
          name: 3
        },
        {
          name: 2
        },
        {
          name: 1
        }
      ]);
    });

    it('error data', function () {
      var data = [
        // null,
        {
          name: 5
        },
        {},
        [],
        'test',
        {
          name: '3'
        }
      ];
      expect(layui.sort(data, 'name')).to.deep.equal([
        {},
        [],
        'test',
        {
          name: '3'
        },
        {
          name: 5
        }
      ]);
    });
  });

  it('layui.device', function () {
    expect(layui.device).to.be.a('function');
    expect(layui.device()).to.be.a('object');
    expect(layui.device().ie).to.be.not.undefined;
    expect(layui.device().ios).to.be.not.undefined;
    expect(layui.device().android).to.be.not.undefined;
    expect(layui.device().weixin).to.be.a('boolean');
    expect(layui.device('weixin').weixin).to.be.false;
    expect(layui.device('.*')['.*']).to.be.not.empty;
    expect(layui.device('layui.com')['layui.com']).to.be.false;
  });

  describe('layui.getStyle', function () {
    it('real test', function () {
      var elem = $('<div />').css({
        position: 'fixed',
        zIndex: 10
      }).appendTo('body').get(0);

      expect(layui.getStyle(elem, 'position')).to.equal('fixed');
      expect(layui.getStyle(elem, 'z-index')).to.equal('10');
    });

    it('mock currentStyle', function (done) {
      var node = {
        currentStyle: {
          getPropertyValue: function (name) {
            expect(name).to.equal('layui');
            done();
          }
        }
      };
      layui.getStyle(node, 'layui');
    });
  });

  it('layui.extend', function () {
    expect(layui.extend).to.be.a('function');
    expect(layui.extend()).to.deep.equal(layui);
    expect(layui.extend({
      v: 'v',
      util: 'util'
    })).to.deep.equal(layui);

    var id = 'test-extend-' + Date.now();
    var data = {};
    data[id] = id;
    expect(layui.modules[id]).to.be.undefined;
    layui.extend(data);
    expect(layui.modules[id]).to.be.not.undefined;
    expect(layui.modules[id]).to.equal(id);
    delete layui.modules[id];
  });

  describe('layui.data', function () {
    if (IS_PHANTOMJS) {
      it('not support JSON', function () {
        var old = window.JSON;
        window.JSON = null;
        expect(layui.data()).to.be.undefined;
        window.JSON = {};
        expect(layui.data()).to.be.undefined;
        window.JSON = old;
      });
    }

    // 在支持情况下才测试
    if (window.localStorage) {
      it('delete table data', function() {
        var id = 'test-delete-data';
        localStorage[id] = true;
        expect(localStorage[id]).to.equal('true');
        expect(layui.data(id, null)).to.be.true;
        expect(localStorage[id]).to.be.undefined;
      });

      it('get table data', function () {
        var table = 'test-get-table-data';
        expect(layui.data(table)).to.deep.equal({});

        layui.data(table, {
          key: 'name',
          value: 'layui'
        });
        expect(layui.data(table)).to.deep.equal({
          name: 'layui'
        });

        // 删除数据
        layui.data(table, null);
      });

      it('get data', function () {
        var id = 'test-get-data';

        // 直接获取肯定为空
        expect(layui.data(null, id)).to.be.undefined;

        // 写入数据
        expect(layui.data(null, {
          key: id,
          value: true
        })).to.be.true;

        expect(layui.data(null, id)).to.be.true;

        // 清除数据
        layui.data(null, {
          key: id,
          remove: true
        });
      });

      it('remove data', function () {
        var id = 'test-remove-data';

        layui.data(null, {
          key: id,
          value: true
        });
        expect(layui.data(null, id)).to.be.true;
        layui.data(null, {
          key: id,
          remove: true
        });
        expect(layui.data(null, id)).to.be.undefined;
      });
    }
  });
});
/* eslint-enable max-nested-callbacks, fecs-indent */
