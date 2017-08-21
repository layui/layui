'use strict';

var match = require('gulp-match');
var ternaryStream = require('ternary-stream');
var through2 = require('through2');

module.exports = function (condition, trueChild, falseChild, minimatchOptions) {
	if (!trueChild) {
		throw new Error('gulp-if: child action is required');
	}

	if (typeof condition === 'boolean') {
		// no need to evaluate the condition for each file
		// other benefit is it never loads the other stream
		return condition ? trueChild : (falseChild || through2.obj());
	}

	function classifier (file) {
		return !!match(file, condition, minimatchOptions);
	}

	return ternaryStream(classifier, trueChild, falseChild);
};
