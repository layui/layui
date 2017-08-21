/*!
 * global-prefix <https://github.com/jonschlinkert/global-prefix>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var homedir = require('homedir-polyfill');
var path = require('path');
var ini = require('ini');
var fs = require('fs')

var prefix;

if (process.env.PREFIX) {
  prefix = process.env.PREFIX;
} else {
  // Start by checking if the global prefix is set by the user
  var home = homedir();
  if (home) {
    // homedir() returns undefined if $HOME not set; path.resolve requires strings
    var userConfig = path.resolve(home, '.npmrc');
    prefix = readPrefix(userConfig);
  }

  if (!prefix) {
    // Otherwise find the path of npm
    var npm = npmPath();
    if (npm) {
      // Check the built-in npm config file
      var builtinConfig = path.resolve(npm, '..', '..', 'npmrc');
      prefix = readPrefix(builtinConfig);

      if (prefix) {
        // Now the global npm config can also be checked.
        var globalConfig = path.resolve(prefix, 'etc', 'npmrc');
        prefix = readPrefix(globalConfig) || prefix;
      }
    }

    if (!prefix) fallback();
  }
}

function fallback() {
  var isWindows = require('is-windows');
  if (isWindows()) {
    // c:\node\node.exe --> prefix=c:\node\
    prefix = process.env.APPDATA
      ? path.join(process.env.APPDATA, 'npm')
      : path.dirname(process.execPath);
  } else {
    // /usr/local/bin/node --> prefix=/usr/local
    prefix = path.dirname(path.dirname(process.execPath));

    // destdir only is respected on Unix
    if (process.env.DESTDIR) {
      prefix = path.join(process.env.DESTDIR, prefix);
    }
  }
}

function npmPath() {
  try {
    return fs.realpathSync(require('which').sync('npm'));
  } catch (ex) {
  }
  return false;
}

function readPrefix(configPath) {
  try {
    var data = fs.readFileSync(configPath, 'utf-8');
    var config = ini.parse(data);
    if (config.prefix) return config.prefix;
  } catch (ex) {
    // file not found
  }
  return false;
}

module.exports = prefix;
