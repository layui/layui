/**
 * @file karma配置
 * @author fe.xiaowu@gmail.com
 */

const base = require('./karma.conf.base.js');

module.exports = function(config) {
    const options = Object.assign(base(config), {

    });

    config.set(options);
};