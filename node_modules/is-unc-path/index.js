'use strict';

var regex = require('unc-path-regex');

module.exports = function isUNC(fp) {
  if (typeof fp !== 'string') return false;
  return regex().test(fp);
};
