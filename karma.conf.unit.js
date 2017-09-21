/**
 * @file karma配置
 * @author fe.xiaowu@gmail.com
 */

var base = require('./karma.conf.base.js');

module.exports = function (config) {
    var options = Object.assign(base(config), {});

    config.set(options);
};
