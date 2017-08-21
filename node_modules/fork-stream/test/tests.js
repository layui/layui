var assert = require("chai").assert;

var ForkStream = require("../");

describe("fork-stream", function() {
  it("should split objects into their correct streams", function(done) {
    var fork = new ForkStream({
      classifier: function classify(e, done) {
        return done(null, e >= 5);
      },
    });

    var expectedA = [5, 7, 9],
        expectedB = [1, 4, 3, 1];

    var actualA = [],
        actualB = [];

    fork.a.on("data", function(e) {
      actualA.push(e);
    });

    fork.b.on("data", function(e) {
      actualB.push(e);
    });

    fork.on("finish", function() {
      assert.deepEqual(expectedA, actualA);
      assert.deepEqual(expectedB, actualB);

      return done();
    });

    [1, 5, 7, 4, 9, 3, 1].forEach(function(n) {
      fork.write(n);
    });

    fork.end();
  });

  it("should respect backpressure", function(done) {
    var fork = new ForkStream({
      highWaterMark: 2,
      classifier: function classify(e, done) {
        return done(null, e >= 5);
      },
    });

    var expected = [5, 7],
        actual = [];

    fork.a.on("data", function(e) {
      actual.push(e);
    });

    var timeout = setTimeout(function() {
      assert.deepEqual(expected, actual);

      return done();
    }, 10);

    fork.on("finish", function() {
      clearTimeout(timeout);

      return done(Error("should not finish"));
    });

    [1, 5, 7, 4, 9, 3, 1].forEach(function(n) {
      fork.write(n);
    });

    fork.end();
  });

  it("should end the outputs when the input finishes", function(done) {
    var fork = new ForkStream();

    var count = 0;
    var onEnd = function onEnd() {
      if (++count === 2) {
        return done();
      }
    };

    fork.a.on("end", onEnd)
    fork.b.on("end", onEnd);

    // start "flowing" mode
    fork.a.resume();
    fork.b.resume();

    fork.end();
  });
});
