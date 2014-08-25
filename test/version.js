'use strict';

var assert = require('assert');
var fs = require('fs');

var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;

function assertMatch(actual, pattern, message) {
  if (!pattern.test(actual)) {
    assert.fail(actual, pattern, message, 'matches');
  }
}

function assertContains(actual, needle, message) {
  if (actual.indexOf(needle) === -1) {
    message = message || ('Expected "' + actual + '" to contain "' + needle + '"');
    assert.fail(actual, needle, message, 'contains');
  }
}

describe('version', function() {
  before(function() {
    sandbox.reset();
  });

  it('should print slc and node versions', function(done) {
    spawnCliInSandbox(['--version'])
      .run(function(er, stdout, status) {
        if (er) return done(er);

        // Length of expected dependencies + 1 for strong_agent
        var expectedDepsLength = require('../lib/version.js').
          __REPORT_DEPENDENCIES.length + 1;

        assert.equal(status, 0);
        var PEERS = Object.keys(require('../package.json').peerDependencies || []);
        assert.equal(stdout.length, 1 + expectedDepsLength + PEERS.length);
        var line0 = stdout[0];
        assertMatch(line0, /^strongloop v[-.0-9]* .node v.+$/);
        assertContains(line0, process.version);
        return done();
      });
  });
});
