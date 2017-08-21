# uglify-save-license

[![NPM version](https://badge.fury.io/js/uglify-save-license.svg)](http://badge.fury.io/js/uglify-save-license)
[![Build Status](https://travis-ci.org/shinnn/uglify-save-license.svg)](https://travis-ci.org/shinnn/uglify-save-license)
[![devDependency Status](https://david-dm.org/shinnn/uglify-save-license/dev-status.svg)](https://david-dm.org/shinnn/uglify-save-license#info=devDependencies)

A support module for [UglifyJS](http://lisperator.net/uglifyjs/) to detect and preserve license comments

```javascript
//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
//...
```

↓

```javascript
//     Backbone.js 1.1.2
//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org
!function(a,b){if("function"==typeof define&&define.amd)define(["underscore","jquery","exports"],function(c,d,e){a.Backbone=b(a,e,c,d)});else if("undefined"!=typeof exports){...
```

## Overview

This module enables us to preserve license comments when using UglifyJS.

Even if the license statement is in multiple line comments, or the comment has no directive such as `@license` and `/*!`, this module keeps them readable.

## Installation

Install with [npm](https://npmjs.org/). (Make sure you have installed [Node](http://nodejs.org/download/).)

```
npm install --save-dev uglify-save-license
```

## Usage

First of all, load `uglify-save-license` module.

```javascript
var saveLicense = require('uglify-save-license');
```

### Use with [UglifyJS](https://github.com/mishoo/UglifyJS2)

Pass this module to the [`comments` option](https://github.com/mishoo/UglifyJS2#keeping-comments-in-the-output).

```javascript
var result = UglifyJS.minify('file1.js', {
  output: {
    comments: saveLicense
  }
});
```

### Use with [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify)

Pass this module to the [`preserveComments` option](https://github.com/gruntjs/grunt-contrib-uglify#preservecomments).

```javascript
grunt.initConfig({
  uglify: {
    my_target: {
      options: {
        preserveComments: saveLicense
      },    
      src: ['src/app.js'],
      dest: 'dest/app.min.js' 
    }
  }
});
```

## How it works

*uglify-save-license* checks each [comment token](http://lisperator.net/uglifyjs/ast#tokens) of a JavaScript file.
The comment will be regarded as a license statement and preserved after compression, if it meets at least one of the following requirements:

1. The comment is in the *first* line of a file.
2. [The regexp for license statement](./uglify-save-license.js#L7) matches the string of the comment. It matches, for example, `MIT` and `Copyright`.
3. There is a comment at the *previous* line, and it matches 1. 2. or 3.

## Examples

### CLI tool example

#### Main script (`uglify-example.js`)

```javascript
#!/usr/bin/env node

var UglifyJS    = require('uglify-js'),
    saveLicense = require('uglify-save-license');

var minified = UglifyJS.minify(process.argv[2], {
  output: {
    comments: saveLicense
  }
}).code;

console.log(minified);
```

#### Target file

```javascript
// First line

// (c) 2014 John  <- contains '(c)'
// The previous line is preserved

// This line won't be preserved.
(function(win, doc) {
  var str = 'Hello World! :' + doc.title;

  // This line will not, too.
  console.log(str);
}(window, document));
```

#### Command

```
node uglify-example.js <target filename>
```

#### Output

```javascript
// First line
// (c) 2014 John  <- contains '(c)'
// The previous line is preserved
!function(o,l){var n="Hello World! :"+l.title;console.log(n)}(window,document);
```

### [Gruntfile.coffee](http://gruntjs.com/getting-started#the-gruntfile) example

```coffeescript
module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  
  grunt.initConfig
    uglify:
      target:
        options:
          preserveComments: require 'uglify-save-license'
        files: [
          expand: true
          flatten: true
          cwd: 'path/to/src'
          src: ['**/*.js']
          dest: 'tmp/'
        ]

    concat:
      js:
        src: ['tmp/*.js']
        dest: 'path/to/build/app.js'

    clean:
      tmpdir: ['tmp']

  grunt.registerTask 'default' ['uglify', 'concat', 'clean']
```

## Acknowledgements

*uglify-save-license* is inspired by [grunt-license-saver](https://github.com/kyo-ago/grunt-license-saver) and I used it as reference.
Thanks, [kyo-ago](https://github.com/kyo-ago).

## License

Copyright (c) 2013 - 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT license](./LICENSE).
