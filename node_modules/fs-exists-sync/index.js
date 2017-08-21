/*!
 * fs-exists-sync (https://github.com/jonschlinkert/fs-exists-sync)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');

module.exports = function(filepath) {
  try {
    (fs.accessSync || fs.statSync)(filepath);
    return true;
  } catch (err) {}
  return false;
};
