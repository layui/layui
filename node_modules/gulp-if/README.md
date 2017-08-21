gulp-if ![status](https://secure.travis-ci.org/robrich/gulp-if.png?branch=master)
=======

A ternary gulp plugin: conditionally control the flow of vinyl objects.

**Note**: Badly behaved plugins can often get worse when used with gulp-if.  Typically the fix is not in gulp-if.

**Note**: Works great with [lazypipe](https://github.com/OverZealous/lazypipe), see below

## Usage

1: Conditionally filter content

**Condition**

![][condition]

```javascript
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var condition = true; // TODO: add business logic

gulp.task('task', function() {
  gulp.src('./src/*.js')
    .pipe(gulpif(condition, uglify()))
    .pipe(gulp.dest('./dist/'));
});
```
Only uglify the content if the condition is true, but send all the files to the dist folder


2: Ternary filter

**Ternary**

![][ternary]

```javascript
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var beautify = require('gulp-beautify');

var condition = function (file) {
  // TODO: add business logic
  return true;
}

gulp.task('task', function() {
  gulp.src('./src/*.js')
    .pipe(gulpif(condition, uglify(), beautify()))
    .pipe(gulp.dest('./dist/'));
});
```

If condition returns true, uglify else beautify, then send everything to the dist folder


3: Remove things from the stream

**Remove from here on**

![][exclude]

```javascript
var gulpIgnore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var condition = './gulpfile.js';

gulp.task('task', function() {
  gulp.src('./*.js')
    .pipe(jshint())
    .pipe(gulpIgnore.exclude(condition))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
```

Run JSHint on everything, remove gulpfile from the stream, then uglify and write everything else.


4: Exclude things from the stream

**Exclude things from entering the stream**

![][glob]

```javascript
var uglify = require('gulp-uglify');

gulp.task('task', function() {
  gulp.src(['./*.js', '!./node_modules/**'])
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
```

Grab all JavaScript files that aren't in the node_modules folder, uglify them, and write them.
This is fastest because nothing in node_modules ever leaves `gulp.src()`


## works great with [lazypipe](https://github.com/OverZealous/lazypipe)

Lazypipe creates a function that initializes the pipe chain on use.  This allows you to create a chain of events inside the gulp-if condition.  This scenario will run jshint analysis and reporter only if the linting flag is true.

```js
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var lazypipe = require('lazypipe');

var linting = false;
var compressing = false;

var jshintChannel = lazypipe()
  // adding a pipeline step
  .pipe(jshint) // notice the stream function has not been called!
  .pipe(jshint.reporter)
  // adding a step with an argument
  .pipe(jshint.reporter, 'fail');

gulp.task('scripts', function () {
  return gulp.src(paths.scripts.src)
    .pipe(gulpif(linting, jshintChannel()))
    .pipe(gulpif(compressing, uglify()))
    .pipe(gulp.dest(paths.scripts.dest));
});
```
[source](https://github.com/spenceralger/gulp-jshint/issues/38#issuecomment-40423932)

## works great inside [lazypipe](https://github.com/OverZealous/lazypipe)

Lazypipe assumes that all function parameters are static, gulp-if arguments need to be instantiated inside each lazypipe.  This difference can be easily solved by passing a function on the lazypipe step

```js
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var lazypipe = require('lazypipe');

var compressing = false;

var jsChannel = lazypipe()
  // adding a pipeline step
  .pipe(jshint) // notice the stream function has not been called!
  .pipe(jshint.reporter)
  // adding a step with an argument
  .pipe(jshint.reporter, 'fail')
  // you can't say: .pipe(gulpif, compressing, uglify)
  // because uglify needs to be instantiated separately in each lazypipe instance
  // you can say this instead:
  .pipe(function () {
    return gulpif(compressing, uglify());
  });
  // why does this work? lazypipe calls the function, passing in the no arguments to it,
  // it instantiates a new gulp-if pipe and returns it to lazypipe.

gulp.task('scripts', function () {
  return gulp.src(paths.scripts.src)
    .pipe(jsChannel())
    .pipe(gulp.dest(paths.scripts.dest));
});
```

[source](https://github.com/robrich/gulp-if/issues/32)

## gulp-if API

### gulpif(condition, stream [, elseStream, [, minimatchOptions]])

gulp-if will pipe data to `stream` whenever `condition` is truthy.

If `condition` is falsey and `elseStream` is passed, data will pipe to `elseStream`

After data is piped to `stream` or `elseStream` or neither, data is piped down-stream.

#### Parameters

##### condition

Type: `boolean` or [`stat`](http://nodejs.org/api/fs.html#fs_class_fs_stats) object or `function` that takes in a vinyl file and returns a boolean or `RegularExpression` that works on the `file.path`

The condition parameter is any of the conditions supported by [gulp-match](https://github.com/robrich/gulp-match).  The `file.path` is passed into `gulp-match`.

If a function is given, then the function is passed a vinyl `file`. The function should return a `boolean`.

##### stream

Stream for gulp-if to pipe data into when condition is truthy.

##### elseStream

Optional, Stream for gulp-if to pipe data into when condition is falsey.

##### minimatchOptions

Optional, if it's a glob condition, these options are passed to [minimatch](https://github.com/isaacs/minimatch).


LICENSE
-------

(MIT License)

Copyright (c) 2014 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[condition]: https://rawgithub.com/robrich/gulp-if/master/img/condition.svg
[ternary]: https://rawgithub.com/robrich/gulp-if/master/img/ternary.svg
[exclude]: https://rawgithub.com/robrich/gulp-if/master/img/exclude.svg
[glob]: https://rawgithub.com/robrich/gulp-if/master/img/glob.svg
