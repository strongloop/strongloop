'use strict';

var assert = require('assert');
var debug = require('debug')('slc:run');
var sandbox = require('./helpers/sandbox');
var spawnCli = require('./helpers/runner').spawnCliInSandbox;

describe('run', function() {
  before(function() {
    sandbox.reset();
  });

  it('should recognize that argument does not exist', function(done) {
    spawnCli(['run', 'a-file-that-does-not-exist'], {stream: 'stderr'})
      .run(function (er, output, code) {
        if (er) return done(er);
        debug('output:', output, 'code:', code);
        assert(code !== 0);
        assert.equal(output.length, 1);
        return done();
      });
  });
});
