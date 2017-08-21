ternary-stream ![status](https://secure.travis-ci.org/robrich/ternary-stream.png?branch=master)
=======

A ternary stream: conditionally control the flow of stream data

## Usage

1: Conditionally filter content

**Condition**

![][condition]

if the condition returns truthy, data is piped to the child stream

```js
var ternaryStream = require('ternary-stream');

var condition = function (data) {
  return true;
};

process.stdin
  .pipe(ternaryStream(condition, process.stdout))
  .pipe(fs.createWriteStream('./out.txt'));
```

Data will conditionally go to stdout, and always go to the file

2: Ternary stream

**Ternary**

![][ternary]


```javascript
var ternaryStream = require('ternary-stream');
var through2 = require('through2');

var count = 0;
var condition = function (data) {
  count++;
  return count % 2;
};

process.stdin
  .pipe(ternaryStream(condition, fs.createWriteStream('./truthy.txt'), fs.createWriteStream('./falsey.txt')))
  .pipe(process.stdout);
```

Data will either go to truthy.txt (if condition is true) or falsey.txt (if condition is false) and will always go to stdout

## API

### ternaryStream(condition, stream [, elseStream])

ternary-stream will pipe data to `stream` whenever `condition` is truthy.

If `condition` is falsey and `elseStream` is passed, data will pipe to `elseStream`.

After data is piped to `stream` or `elseStream` or neither, data is piped down-stream.

#### Parameters

##### condition

Type: `function`: takes in stream data and returns `boolean`

```js
function (data) {
	return true; // or false
}
```

##### stream

Stream for ternary-stream to pipe data into when condition is truthy.

##### elseStream

Optional, Stream for ternary-stream to pipe data into when condition is falsey.


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

[condition]: https://rawgithub.com/robrich/ternary-stream/master/img/condition.svg
[ternary]: https://rawgithub.com/robrich/ternary-stream/master/img/ternary.svg
