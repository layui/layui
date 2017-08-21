'use strict';

var isUncPath = require('is-unc-path');

module.exports = function isRelative(fp) {
  if (typeof fp !== 'string') {
    throw new TypeError('isRelative expects a string.');
  }
  // Windows UNC paths are always considered to be absolute.
  return !isUncPath(fp) && !/^([a-z]:)?[\\\/]/i.test(fp);
};
