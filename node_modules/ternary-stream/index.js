'use strict';

var through2 = require('through2');
var ForkStream = require('fork-stream');
var mergeStream = require('merge-stream');
var duplexify = require('duplexify');

module.exports = function (condition, trueStream, falseStream) {
	if (!trueStream) {
		throw new Error('fork-stream: child action is required');
	}

	// output stream
	var outStream = through2.obj();

	// create fork-stream
	var forkStream = new ForkStream({
		classifier: function (e, cb) {
			var ans = !!condition(e);
			return cb(null, ans);
		}
	});

	// if condition is true, pipe input to trueStream
	forkStream.a.pipe(trueStream);

	var mergedStream;

	if (falseStream) {
		// if there's an 'else' condition
		// if condition is false
		// pipe input to falseStream
		forkStream.b.pipe(falseStream);
		// merge output with trueStream's output
		mergedStream = mergeStream(falseStream, trueStream);
		// redirect falseStream errors to mergedStream
		falseStream.on('error', function(err) { mergedStream.emit('error', err); });
	} else {
		// if there's no 'else' condition
		// if condition is false
		// merge output with trueStream's output
		mergedStream = mergeStream(forkStream.b, trueStream);
	}

	// redirect trueStream errors to mergedStream
	trueStream.on('error', function(err) { mergedStream.emit('error', err); });

	// send everything down-stream
	mergedStream.pipe(outStream);
	// redirect mergedStream errors to outStream
	mergedStream.on('error', function(err) { outStream.emit('error', err); });

	// consumers write in to forkStream, we write out to outStream
	return duplexify.obj(forkStream, outStream);
};
