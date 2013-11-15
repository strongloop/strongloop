'use strict';

var assert = require('assert');
var fs = require('fs');

var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;

describe('version', function() {
  before(function() {
    sandbox.reset();
  });

  it('should print slc and node versions', function(done) {
    spawnCliInSandbox(['version'])
      .run(function (er, stdout, status) {
        if (er) return done(er);

        assert.equal(status, 0);
        assert.equal(stdout.length, 1);
        var line0 = stdout[0];
        assert(/^slc v[.0-9]* .node v[.0-9]*.$/.test(line0));
        return done();
      });
  });
});
