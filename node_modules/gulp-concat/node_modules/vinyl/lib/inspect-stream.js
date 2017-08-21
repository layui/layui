'use strict';

var isStream = require('is-stream');

function inspectStream(stream) {
  if (!isStream(stream)) {
    return;
  }

  var streamType = stream.constructor.name;
  // Avoid StreamStream
  if (streamType === 'Stream') {
    streamType = '';
  }

  return '<' + streamType + 'Stream>';
}

module.exports = inspectStream;
