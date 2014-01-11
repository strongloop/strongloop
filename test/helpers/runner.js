'use strict';

var debug = require('debug')('slc');
var extend = require('util')._extend;
var nspawn = require('nexpect').spawn;
var path = require('path');
var sandbox = require('./sandbox.js');

/**
 * Sets up an `nexpect` session for slc program in a specific working directory.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`
 * @param {String} inPath path in which to run slc
 * @param {Object} options extra options to nexpect
 * @returns {Object} nexpect object
 */
function spawnCli(args, inPath, options) {
  var node = process.execPath;
  var slc = process.env.SLC || path.resolve(__dirname, '../../bin/slc');
  var nodeArgs = [slc].concat(args);
  var opts = extend({
    cwd: inPath,
    env: envCleanOfNpm(),
    stripColors: true,
    verbose: debug.enabled
  }, options);
  debug('nspawn node <%s> args <%s> at cwd <%s>', node, nodeArgs, opts.cwd);
  var expect = nspawn(node, nodeArgs, opts);
/*
  // Use debug() to output verbose log info, instead of what nexpect does -
  // process.stdout.write(), not distinguishing between stderr and stdout.
  expect._run = expect.run;
  expect.run = function(callback) {
    var child = this._run(callback);
    function chomp(s) {
      if(s[s.length-1] === '\n') {
        s = s.substring(0, s.length - 1);
      }
      return s;
    }
    function debugOut(name, data) {
      data = chomp(data.toString());
      debug('nspawn ' + name + '<', data, '>');
    }
    child.stdout.on('data', function(data) {
      debugOut('stdout', data);
    });
    child.stderr.on('data', function(data) {
      debugOut('stderr', data);
    });
    return child;
  }
*/
  return expect;
}

exports.spawnCli = spawnCli;

/**
 * Sets up an `nexpect` session for slc program in a sandbox working directory.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`
 * @returns {Object} nexpect object
 */
function spawnCliInSandbox(args, options) {
  return spawnCli(args, sandbox.PATH, options);
}

exports.spawnCliInSandbox = spawnCliInSandbox;

/**
 * Sets up an `nexpect` session for slc program in current working directory.
 * @param {Array} args list of arguments for slc, e.g. `['create', 'cli']`
 * @returns {Object} nexpect object
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
