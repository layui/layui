/**
 * @file laytpl - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global layui */
/* eslint-disable max-nested-callbacks, fecs-indent */

var laytpl = layui.laytpl;

describe('laytpl', function () {
  it('param is error', function () {
    [
      [], {},
      null,
      1,
      true
    ].forEach(function (key) {
      expect(laytpl(key)).to.have.string('Laytpl Error');
    });
  });

  it('async render callback', function (done) {
    expect(laytpl('').render()).to.have.string('Laytpl Error');

    laytpl('{{ d.name }}是一位公猿').render({
      name: '贤心'
    }, function (result) {
      expect(result).to.equal('贤心是一位公猿');
      done();
    });
  });

  it('sync result', function () {
    var result = laytpl('{{ d.name }}是一位公猿').render({
      name: '贤心'
    });
    expect(result).to.equal('贤心是一位公猿');
  });

  it('cached', function () {
    var compile = laytpl('{{ d.name }}');

    expect(compile.render({
      name: 1
    })).to.equal('1');

    expect(compile.render({
      name: 2
    })).to.equal('2');
  });

  it('unescape result', function () {
    var result = laytpl('{{ d.name }}<div></div>').render({
      name: '<em>laytpl</em>'
    });
    expect(result).to.equal('<em>laytpl</em><div></div>');
  });

  it('escape result', function () {
    var result = laytpl('{{= d.name }}<div></div>').render({
      name: '<em>laytpl</em>'
    });
    expect(result).to.equal('&lt;em&gt;laytpl&lt;/em&gt;<div></div>');
  });

  describe('typeof result', function () {
    it('string', function () {
      expect(laytpl('{{ d.name }}').render({
        name: 1
      })).to.be.a('string');

      expect(laytpl([
        '{{# ',
        '   if (true) {',
        '       return "1";',
        '   }',
        '}}'
      ].join('')).render({})).to.be.a('string');
    });

    // 表达式返回boolean
    it('boolean', function () {
      expect(laytpl([
        '{{# ',
        '   if (true) {',
        '       return true;',
        '   }',
        '}}'
      ].join('')).render({})).to.be.a('boolean');
    });

    it('number', function () {
      expect(laytpl([
        '{{# ',
        '   if (true) {',
        '       return 1;',
        '   }',
        '}}'
      ].join('')).render({})).to.be.a('number');
    });
  });

  describe('method config', function () {
    // reset
    afterEach(function () {
      laytpl.config({
        open: '{{',
        close: '}}'
      });
    });

    it('typeof', function () {
      expect(laytpl.config).to.be.a('function');
    });

    it('param is empty', function () {
      expect(laytpl.config()).to.be.undefined;
    });

    it('set open', function () {
      laytpl.config({
        open: '<%'
      });

      var result = laytpl([
        '<%# var name = "laytpl"; }}',
        '你好, <% name }}, <% d.date }}'
      ].join('')).render({
        date: '2017'
      });
      expect(result).to.equal('你好, laytpl, 2017');
    });

    it('set open and close', function () {
      laytpl.config({
        open: '<%',
        close: '%>'
      });

      var result = laytpl([
        '<%# var name = "laytpl"; %>',
        '你好, <% name %>, <% d.date %>'
      ].join('')).render({
        date: '2017'
      });
      expect(result).to.equal('你好, laytpl, 2017');
    });
  });

  describe('js expression', function () {
    it('var', function () {
      var result = laytpl('{{# var type = 1; }}{{ type }}{{ d.name }}').render({
        name: 2
      });
      expect(result).to.equal('12');
    });

    it('function', function () {
      var result = laytpl('{{# var fn = function () {return "ok"}; }}{{ fn() }}').render({});
      expect(result).to.equal('ok');
    });

    it('for', function () {
      var result = laytpl([
        '{{# ',
        '   var fn = function () {',
        '       var num = 0;',
        '       for (var i = 0; i < 10;i++) {',
        '           num += 1;',
        '       }',
        '       return num',
        '   };',
        '}}',
        '{{# ',
        '   var name = "laytpl";',
        '}}',
        '你好, {{ name }}, {{ d.name }}, {{ fn() }}'
      ].join('')).render({
        name: 'ok'
      });
      expect(result).to.equal('你好, laytpl, ok, 10');
    });

    it('if else', function () {
      var result;
      result = laytpl([
        '{{# ',
        '   if (true) {',
        '       return true;',
        '   }',
        '   else {',
        '       return false',
        '   }',
        '}}'
      ].join('')).render({});
      expect(result).to.be.true;

      result = laytpl([
        '{{# ',
        '   if (!true) {',
        '       return true;',
        '   }',
        '   else {',
        '       return false',
        '   }',
        '}}'
      ].join('')).render({});
      expect(result).to.be.false;
    });
  });

  describe('parse error', function () {
    it('error var', function () {
      var result = laytpl('{{ data.xxoo }}').render({});

      expect(result).to.have.string('data');
      expect(result).to.have.string('ReferenceError');
      expect(result).to.have.string('Laytpl Error');
    });

    it('error expression', function () {
      var result = laytpl('{{# var xxoo = ; }}').render({});

      expect(result).to.have.string('Laytpl Error');
      expect(result).to.have.string('SyntaxError');
    });
  });
});
/* eslint-enable max-nested-callbacks, fecs-indent */
