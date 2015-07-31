'use strict';

var debug = require('debug')('strongloop:test');
var exec = require('child_process').execFile;
var pkg = require('../package.json');
var slc = require.resolve('../bin/slc');
var tap = require('tap');

tap.test('version should print slc and node versions', function(t) {
  var args = [slc, '--version'];
  var opts = {encoding: 'utf8'};
  t.comment('exec %s arg %j opt %j', process.execPath, args, opts);
  debug = t.comment.bind(t);
  exec(process.execPath, args, opts, function(er, stdout) {
    debug('er=%j', er);
    t.ifError(er);

    debug('stdout=<\n%s>', stdout);

    // Length of expected dependencies + 1 for strong_agent
    var expected = require('../lib/version.js').__REPORT_DEPENDENCIES;
    var reported = stdout.trim().split('\n');
    debug('expected: %d - %j', expected.length, expected);
    debug('reported: %d - %j', reported.length, reported);

    t.assert(pkg.peerDependencies == null, 'package has no peer deps');
    // The strongloop and strong-agent packages are always reported in addition
    // to the strong- deps.
    t.equal(reported.length, expected.length + 2);
    var line0 = reported[0];
    t.match(line0, /^strongloop v[-.0-9]* .node v.+$/);
    t.notEqual(line0.indexOf(process.version), -1);
    t.end();
  });
});
