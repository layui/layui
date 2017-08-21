const rechoir = require('rechoir');
const isString = require('lodash.isstring');

module.exports = function(eventEmitter, extensions, configPath, cwd) {
  extensions = extensions || {};

  if (!isString(configPath)) {
    return;
  }

  var autoloads = rechoir.prepare(extensions, configPath, cwd, true);
  if (autoloads instanceof Error) {
    autoloads = autoloads.failures;
  }

  if (Array.isArray(autoloads)) {
    autoloads.forEach(function (attempt) {
      if (attempt.error) {
        eventEmitter.emit('requireFail', attempt.moduleName, attempt.error);
      } else {
        eventEmitter.emit('require', attempt.moduleName, attempt.module);
      }
    });
  }
};
