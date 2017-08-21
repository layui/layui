# gulp-uglify [![][travis-shield-img]][travis-shield][![][appveyor-shield-img]][appveyor-shield][![][npm-dl-shield-img]][npm-shield][![][npm-v-shield-img]][npm-shield][![][coveralls-shield-img]][coveralls-shield]

> Minify JavaScript with UglifyJS2.

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-uglify`

## Usage

```javascript
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('compress', function (cb) {
  pump([
        gulp.src('lib/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});
```

To help properly handle error conditions with Node streams, this project
recommends the use of [`pump`](https://github.com/mafintosh/pump). For more
information, see [Why Use Pump?](docs/why-use-pump/README.md#why-use-pump).

## Options

- `mangle`

	Pass `false` to skip mangling names.

- `output`

	Pass an object if you wish to specify additional [output
	options](http://lisperator.net/uglifyjs/codegen). The defaults are
	optimized for best compression.

- `compress`

	Pass an object to specify custom [compressor
	options](http://lisperator.net/uglifyjs/compress). Pass `false` to skip
	compression completely.

- `preserveComments`

	A convenience option for `options.output.comments`. Defaults to preserving no
	comments.

	- `all`

		Preserve all comments in code blocks

	- `license`

		Attempts to preserve comments that likely contain licensing information,
		even if the comment does not have directives such as `@license` or `/*!`.

		Implemented via the [`uglify-save-license`](https://github.com/shinnn/uglify-save-license)
		module, this option preserves a comment if one of the following is true:

		1. The comment is in the *first* line of a file
		2. A regular expression matches the string of the comment.
				For example: `MIT`, `@license`, or `Copyright`.
		3. There is a comment at the *previous* line, and it matches 1, 2, or 3.

	- `function`

		Specify your own comment preservation function. You will be passed the
		current node and the current comment and are expected to return either
		`true` or `false`.

	- `some` (deprecated)

		Preserve comments that start with a bang (`!`) or include a Closure Compiler
		directive (`@preserve`, `@license`, `@cc_on`).
		Deprecated in favor of the `license` option, documented above.

You can also pass the `uglify` function any of the options [listed
here](https://github.com/mishoo/UglifyJS2#the-simple-way) to modify
UglifyJS's behavior.

## Errors

`gulp-uglify` emits an 'error' event if it is unable to minify a specific file.
Wherever possible, the PluginError object will contain the following properties:

- `fileName`
- `lineNumber`
- `message`

## Using a Different UglifyJS

By default, `gulp-uglify` uses the version of UglifyJS installed as a dependency.
It's possible to configure the use of a different version using the "minifier" entry point.

```javascript
var uglifyjs = require('uglify-js'); // can be a git checkout
                                     // or another module (such as `uglify-js-harmony` for ES6 support)
var minifer = require('gulp-uglify/minifier');
var pump = require('pump');

gulp.task('compress', function (cb) {
  // the same options as described above
  var options = {
    preserveComments: 'license'
  };

  pump([
      gulp.src('lib/*.js'),
      minifier(options, uglifyjs),
      gulp.dest('dist')
    ],
    cb
  );
});
```

[travis-shield-img]: https://img.shields.io/travis/terinjokes/gulp-uglify/master.svg?label=Travis%20CI&style=flat-square
[travis-shield]: https://travis-ci.org/terinjokes/gulp-uglify
[appveyor-shield-img]: https://img.shields.io/appveyor/ci/terinjokes/gulp-uglify/master.svg?label=AppVeyor&style=flat-square
[appveyor-shield]: https://ci.appveyor.com/project/terinjokes/gulp-uglify
[npm-dl-shield-img]: https://img.shields.io/npm/dm/gulp-uglify.svg?style=flat-square
[npm-shield]: http://browsenpm.org/package/gulp-uglify
[npm-v-shield-img]: https://img.shields.io/npm/v/gulp-uglify.svg?style=flat-square
[coveralls-shield-img]: https://img.shields.io/coveralls/terinjokes/gulp-uglify/master.svg?style=flat-square
[coveralls-shield]: https://coveralls.io/github/terinjokes/gulp-uglify
