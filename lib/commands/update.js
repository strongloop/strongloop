var debug = require('debug')('slc');
var exec = require('child_process').exec;
var map = require('async').map;

var PACKAGE = require('../../package.json');
var VERSION = PACKAGE.version;

module.exports = function(argv, options, loader) {
  if (options.help || options.h) {
    return loader.printUsage('update');
  }

  console.log('strong-cli at %s; trying self-update...', VERSION);

  var deps = Object.keys(PACKAGE.peerDependencies);

  map(deps, function(name, callback) {
    install(name, function() {
      // Discard return value, npm install fails for many reasons we don't care
      // about, we will determine success/fail using other means.
      return callback();
    });
  }, checkVersions);

  function install(name, callback) {
    console.log('npm install -g %s; this may take a moment...', name);

    exec('npm -q install -X f -g ' + name, callback);
  }

  function checkVersions() {
    install('strong-cli', function(err, stdout, stderr) {
      if(err) {
        return loader.error(stderr);
      }
      exec('slc version', function(err, stdout, stderr) {
        if(err) {
          return loader.error(stderr);
        }
        console.log('strong-cli at %s', stdout);
      });
    });
  }

  return;
};
