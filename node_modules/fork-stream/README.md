fork-stream [![build status](https://travis-ci.org/deoxxa/fork-stream.png)](https://travis-ci.org/deoxxa/fork-stream)
===========

Fork a stream in multiple directions according to a function.

Overview
--------

fork-stream basically gives you conditional branching for streams. You supply
the logic, fork-stream supplies the streaming.

Super Quickstart
----------------

Code:

```javascript
var ForkStream = require("fork-stream");

var fork = new ForkStream({
  classifier: function classify(e, done) {
    return done(null, e.match(/[aeiou]/));
  },
});

fork.a.on("data", console.log.bind(console, "vowels:"));
fork.b.on("data", console.log.bind(console, "no vowels:"));

fork.write("hello");
fork.write("zxcbzz");
fork.write("ooooooo");

fork.end();
```

Output:

```
vowels: hello
no vowels: zxcbzz
vowels: ooooooo
```

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install fork-stream

Or via git:

> $ git clone git://github.com/deoxxa/fork-stream.git node_modules/fork-stream

API
---

**constructor**

Creates a new fork-stream.

```javascript
new ForkStream(options);
```

```javascript
var fork = new ForkStream({
  highWaterMark: 5,
  classifier: function(e, done) {
    return done(null, !!e);
  },
});
```

* _options_ - regular stream options, and a `classifier` property that
  fork-stream will use to decide what output stream to send your object down.

Example
-------

Also see [example.js](https://github.com/deoxxa/fork-stream/blob/master/example.js).

```javascript
var ForkStream = require("fork-stream");

var fork = new ForkStream({
  classifier: function classify(e, done) {
    return done(null, e >= 5);
  },
});

fork.a.on("data", console.log.bind(null, "a"));
fork.b.on("data", console.log.bind(null, "b"));

for (var i=0;i<20;++i) {
  fork.write(Math.round(Math.random() * 10));
}
```

Output:

```
b 1
a 6
a 9
a 10
a 7
a 5
b 2
b 4
a 8
b 3
a 5
b 4
a 7
a 8
b 1
a 6
b 2
b 0
a 5
b 1
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
