/*!
 * global-modules <https://github.com/jonschlinkert/global-modules>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var prefix = require('global-prefix');
var isWindows = require('is-windows');

if (isWindows()) {
  module.exports = path.resolve(prefix, 'node_modules');
} else {
  module.exports = path.resolve(prefix, 'lib/node_modules');
}
