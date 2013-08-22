/**
 * Run node scripts
 *
 * NOTE: Finishes with a call to process.exit() when running without arguments
 */
var assert = require('assert');
var debug = require('debug')('slc');
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var npm = require('npm');
var NPM_COMMANDS = Object.keys(npm.commands);

module.exports = function (argv, options, loader) {
  var script = options._[0];
  var filename;

  if (!script) {
    script = path.resolve(__dirname, '..', 'run-repl');
  }

  // Because we're the fallback command, make sure this isn't an NPM pass-through command.
  if (NPM_COMMANDS.indexOf(script) !== -1) {
    loader.run(['npm'].concat(argv));
    return;
  }

  argv = argv.slice(argv.indexOf(script) + 1);

  child.fork(path.resolve(process.cwd(), script), argv)
    .on('exit', function(exit, signal) {
      debug('script', script, 'on exit with', exit, signal);
      if (exit !== null) {
        process.exit(exit);
      } else {
        loader.error('Child process "' + script + '" was killed by signal ' + signal);
      }
    })
    .on('error', function(er) {
      loader.error('Run script "%s" failed with %s', script, er.message);
    });
};
