// uglify-save-license.js v0.4.1
// Copyright (c) 2013 - 2014 Shinnosuke Watanabe
// Licensed uder the MIT license

'use strict';

var licenseRegexp = /@preserve|@cc_on|\bMIT\b|\bMPL\b|\bGPL\b|\bBSD\b|\bISCL\b|\(c\)|License|Copyright/mi;

// number of line where license comment appeared last
var prevCommentLine = 0;
// name of the file minified last
var prevFile = '';

module.exports = function saveLicense(node, comment) {
  if (comment.file !== prevFile) {
    prevCommentLine = 0;
  }

  var isLicense = licenseRegexp.test(comment.value) ||
                  (comment.type === 'comment2' &&
                  comment.value.charAt(0) === '!') ||
                  comment.line === 1 ||
                  comment.line === prevCommentLine + 1;
  
  if (isLicense) {
    prevCommentLine = comment.line;
  } else {
    prevCommentLine = 0;
  }
  
  prevFile = comment.file;
  
  return isLicense;
};
