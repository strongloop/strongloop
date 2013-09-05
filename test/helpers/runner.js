'use strict';

var path = require('path');

var nspawn = require('nexpect').spawn;
var debug = require('debug')('slc');

var sandbox = require('./sandbox.js');

/**
 * Sets up an `nexpect` session for slc program.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`
 * @returns {Object} nexpect object
 */
function spawnCliInSandbox(args) {
  var node = process.execPath;
  var slc = path.resolve(__dirname, '../../bin/slc');
  var nodeArgs = [slc].concat(args);
  var opts = {
    cwd: sandbox.PATH,
    env: envCleanOfNpm(),
    stripColors: true,
    verbose: debug.enabled // undocumented feature, means we are in debug mode
  };
  debug('nspawn node <%s> args <%s> at cwd <%s>', node, nodeArgs, opts.cwd);
  return nspawn(node, nodeArgs, opts);
}

exports.spawnCliInSandbox = spawnCliInSandbox;

/** Return process.env copy, with all variables starting with 'npm_' removed */
function envCleanOfNpm() {
  var result = {};
  for (var k in process.env) {
    if (/^npm_/.test(k))
      continue;
    result[k] = process.env[k];
  }
  return result;
}
