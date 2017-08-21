var natives = process.binding('natives')
var module = require('module')
var normalRequire = require
exports.source = src
exports.require = req
var vm = require('vm')

// fallback for 0.x support
var runInThisContext, ContextifyScript, Script
/*istanbul ignore next*/
try {
  ContextifyScript = process.binding('contextify').ContextifyScript;
  runInThisContext = function runInThisContext(code, options) {
    var script = new ContextifyScript(code, options);
    return script.runInThisContext();
  }
} catch (er) {
  Script = process.binding('evals').NodeScript;
  runInThisContext = Script.runInThisContext;
}

var wrap = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];


// Basically the same functionality as node's (buried deep)
// NativeModule class, but without caching, or internal/ blocking,
// or a class, since that's not really necessary.  I assume that if
// you're loading something with this module, it's because you WANT
// a separate copy.  However, to preserve semantics, any require()
// calls made throughout the internal module load IS cached.
function req (id, whitelist) {
  var cache = Object.create(null)

  if (Array.isArray(whitelist)) {
    // a whitelist of things to pull from the "actual" native modules
    whitelist.forEach(function (id) {
      cache[id] = {
        loading: false,
        loaded: true,
        filename: id + '.js',
        exports: require(id)
      }
    })
  }

  return req_(id, cache)
}

function req_ (id, cache) {
  // Buffer is special, because it's a type rather than a "normal"
  // class, and many things depend on `Buffer.isBuffer` working.
  if (id === 'buffer') {
    return require('buffer')
  }

  // native_module isn't actually a natives binding.
  // weird, right?
  if (id === 'native_module') {
    return {
      getSource: src,
      wrap: function (script) {
        return wrap[0] + script + wrap[1]
      },
      wrapper: wrap,
      _cache: cache
    }
  }

  var source = src(id)
  if (!source) {
    return undefined
  }
  source = wrap[0] + source + wrap[1]

  var cachingRequire = function require (id) {
    if (cache[id]) {
      return cache[id].exports
    }
    return req_(id, cache)
  }

  var nm = {
    exports: {},
    loading: true,
    loaded: false,
    filename: id + '.js'
  }
  cache[id] = nm
  var fn
  try {
    /* istanbul ignore else */
    if (ContextifyScript) {
      fn = runInThisContext(source, {
        filename: nm.filename,
        lineOffset: 0,
        displayErrors: true
      });
    } else {
      fn = runInThisContext(source, nm.filename, true);
    }
    fn(nm.exports, cachingRequire, nm, nm.filename)
    nm.loaded = true
  } finally {
    nm.loading = false
  }

  return nm.exports
}

function src (id) {
  return natives[id]
}
