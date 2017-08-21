'use strict';
var uglify = require('uglify-js');
var minifier = require('./minifier');

module.exports = function (opts) {
  return minifier(opts, uglify);
};
