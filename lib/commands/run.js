/**
 * Run node scripts
 */
var assert = require('assert');
var fork = require('child_process').fork;
var fs = require('fs');
var path = require('path');
var npm = require('npm');
var NPM_COMMANDS = Object.keys(npm.commands);

module.exports = function (argv, options, loader) {
  var script = options._[0];
  var filename;

  if (!script) {
    var manualPage = loader.loadManual('slc');
    assert(manualPage, 'loading manual page for slc');
    console.log(manualPage);
    process.exit(0);
  }

  // Because we're the fallback command, make sure this isn't an NPM passthrough command.
  if (NPM_COMMANDS.indexOf(script) !== -1) {
    loader.run(['npm'].concat(argv));
    return;
  }

  argv = argv.slice(argv.indexOf(script) + 1);
  fork(path.resolve(process.cwd(), script), argv)
    .on('exit', function(exit, signal) {
      if (exit !== null) {
        process.exit(exit);
      } else {
        console.error('Child process "' + script + '" was killed by signal ' + signal);
        process.exit(1);
      }
    });
};
