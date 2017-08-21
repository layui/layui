'use strict';
var through = require('through2');
var deap = require('deap');
var PluginError = require('gulp-util/lib/PluginError');
var log = require('fancy-log');
var applySourceMap = require('vinyl-sourcemaps-apply');
var saveLicense = require('uglify-save-license');
var isObject = require('isobject');
var createError = require('./lib/create-error');

var reSourceMapComment = /\n\/\/# sourceMappingURL=.+?$/;

function trycatch(fn, handle) {
  try {
    return fn();
  } catch (err) {
    return handle(err);
  }
}

function setup(opts) {
  if (opts && !isObject(opts)) {
    log('gulp-uglify expects an object, non-object provided');
    opts = {};
  }

  var options = deap({}, opts, {
    fromString: true,
    output: {}
  });

  if (options.preserveComments === 'all') {
    options.output.comments = true;
  } else if (options.preserveComments === 'some') {
    // preserve comments with directives or that start with a bang (!)
    options.output.comments = /^!|@preserve|@license|@cc_on/i;
  } else if (options.preserveComments === 'license') {
    options.output.comments = saveLicense;
  } else if (typeof options.preserveComments === 'function') {
    options.output.comments = options.preserveComments;
  }

  return options;
}

module.exports = function (opts, uglify) {
  function minify(file, encoding, callback) {
    var options = setup(opts || {});

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(createError(file, 'Streaming not supported'));
    }

    if (file.sourceMap) {
      options.outSourceMap = file.relative;
    }

    var originalContents = String(file.contents);

    var mangled = trycatch(function () {
      var m = uglify.minify(String(file.contents), options);
      m.code = new Buffer(m.code.replace(reSourceMapComment, ''));
      return m;
    }, createError.bind(null, file));

    if (mangled instanceof PluginError) {
      return callback(mangled);
    }

    file.contents = mangled.code;

    if (file.sourceMap) {
      var sourceMap = JSON.parse(mangled.map);
      sourceMap.sources = [file.relative];
      sourceMap.sourcesContent = [originalContents];
      applySourceMap(file, sourceMap);
    }

    callback(null, file);
  }

  return through.obj(minify);
};
