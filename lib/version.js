var assert = require('assert');
var debug = require('debug')('slc');
var path = require('path');
var shell = require('shelljs');
var util = require('util');

var PACKAGE = require('../package.json');

function report(name, version) {
  if(version != null) {
    // Normalize version, some print leading 'v', some don't.
    version = version.replace(/^v/, '');
    console.log('%s v%s', name, version);
  } else {
    console.log('%s peer-dependency not found; try `slc update`', name)
  }
}

function check(name) {
  try {
    var scripts = require(path.join(name,'package.json')).bin;
    var script = Object.keys(scripts)[0];
    var cmd = util.format('%s --version', script);
    var output = shell.exec(cmd, {silent:true});
    assert.equal(output.code, 0, 'status of ' + cmd);
    var v = output.output.split('\n')[0];
    assert(v && v.length > 0, 'output of ' + cmd);
    report(name, v);
    return;
  } catch (er) {
    debug('Failed to run %s: %s', cmd, er);
  }

  try {
    var v = require(path.join(name,'package.json')).version;
    report(name, v);
  } catch(er) {
    report(name);
  }
}

module.exports = function() {
  console.log('strong-cli v%s (node %s)',
      PACKAGE.version,
      process.version);
  Object.keys(PACKAGE.peerDependencies)
    .map(check);
};
