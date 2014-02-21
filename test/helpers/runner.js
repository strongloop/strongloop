'use strict';

var path = require('path');

var nspawn = require('nexpect').spawn;
var debug = require('debug')('slc');

var sandbox = require('./sandbox.js');

/**
 * Sets up an `nexpect` session for slc program in a specific working directory.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`.
 * @param {String} inPath path in which to run slc.
 * @return {Object} nexpect object
 */
function spawnCli(args, inPath) {
  var node = process.execPath;
  var slc = process.env.SLC || path.resolve(__dirname, '../../bin/slc');
  var nodeArgs = [slc].concat(args);
  var opts = {
    cwd: inPath,
    env: envCleanOfNpm(),
    stripColors: true
  };
  debug('nspawn node <%s> args <%s> at cwd <%s>', node, nodeArgs, opts.cwd);
  // Use debug() to output verbose log info, instead of what nexpect does -
  // process.stdout.write(), not distinguishing between stderr and stdout.
  var expect = nspawn(node, nodeArgs, opts);
  expect._run = expect.run;
  expect.run = function(callback) {
    var child = this._run(callback);
    child.stdout.on('data', function(data) {
      debug('nspawn stdout:', data.toString());
    });
    child.stderr.on('data', function(data) {
      debug('nspawn stderr:', data.toString());
    });
    return child;
  }
  return expect;
}

exports.spawnCli = spawnCli;

/**
 * Sets up an `nexpect` session for slc program in a sandbox working directory.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`.
 * @return {Object} nexpect object
 */
function spawnCliInSandbox(args) {
  return spawnCli(args, sandbox.PATH);
}

exports.spawnCliInSandbox = spawnCliInSandbox;

/**
 * Sets up an `nexpect` session for slc program in current working directory.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`.
 * @return {Object} nexpect object
 */
function spawnCliInCwd(args) {
  return spawnCli(args, process.cwd());
}

exports.spawnCliInCwd = spawnCliInCwd;

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
