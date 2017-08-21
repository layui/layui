var stream = require("stream");

var ForkStream = module.exports = function ForkStream(options) {
  options = options || {};

  options.objectMode = true;

  stream.Writable.call(this, options);

  if (options.classifier) {
    this._classifier = options.classifier;
  }

  this.a = new stream.Readable(options);
  this.b = new stream.Readable(options);

  var self = this;

  var resume = function resume() {
    if (self.resume) {
      var r = self.resume;
      self.resume = null;
      r.call(null);
    }
  };

  this.a._read = resume;
  this.b._read = resume;

  this.on("finish", function() {
    self.a.push(null);
    self.b.push(null);
  });
};
ForkStream.prototype = Object.create(stream.Writable.prototype, {constructor: {value: ForkStream}});

ForkStream.prototype._classifier = function(e, done) {
  return done(null, !!e);
};

ForkStream.prototype._write = function _write(input, encoding, done) {
  var self = this;

  this._classifier.call(null, input, function(err, res) {
    if (err) {
      return done(err);
    }

    var out = res ? self.a : self.b;

    if (out.push(input)) {
      return done();
    } else {
      self.resume = done;
    }
  });
};
