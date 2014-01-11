/**
 * Run node scripts
 *
 * NOTE: Finishes with a call to process.exit() when running without arguments
 */
var assert = require('assert');
var debug = require('debug')('slc:run');
var child = require('child_process');
var fs = require('fs');
var path = require('path');

module.exports = function (argv, options, loader) {
  var script = options._[0];
  var filename;

  if (!script) {
    script = path.resolve(__dirname, '..', 'run-repl');
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
