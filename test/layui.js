/**
 * @file layui - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global layui */
/* eslint-disable max-nested-callbacks */

var $ = layui.$;

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
        path: ['name']
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
        hash: '#hash'
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
        expect(this + '').to.deep.equal(value).and.equal('layui')
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
});
/* eslint-enable max-nested-callbacks */
