# gulp-zip [![Build Status](https://travis-ci.org/sindresorhus/gulp-zip.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-zip)

> ZIP compress files


## Install

```
$ npm install --save-dev gulp-zip
```


## Usage

```js
const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('default', () =>
	gulp.src('src/*')
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest('dist'))
);
```


## API

Supports [streaming mode](https://github.com/gulpjs/gulp/blob/master/docs/API.md#optionsbuffer).

### zip(filename, [options])

#### filename

Type: `string`

#### options

Type: `Object`

##### compress

Type: `boolean`<br>
Default: `true`


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
