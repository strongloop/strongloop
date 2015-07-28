'use strict';

var spawnCliInCwd = require('./helpers/runner.js').spawnCliInCwd;
var tap = require('tap');

tap.test('version should print slc and node versions', function(t) {
  spawnCliInCwd(['--version']).run(function(er, stdout, status) {
    t.ifError(er);

    // Length of expected dependencies + 1 for strong_agent
    var expectedDepsLength = require('../lib/version.js').
      __REPORT_DEPENDENCIES.length + 1;

    t.equal(status, 0);
    t.assert(require('../package.json').peerDependencies == null);
    t.equal(stdout.length, 1 + expectedDepsLength);
    var line0 = stdout[0];
    t.match(line0, /^strongloop v[-.0-9]* .node v.+$/);
    t.notEqual(line0.indexOf(process.version), -1);
    t.end();
  });
});
