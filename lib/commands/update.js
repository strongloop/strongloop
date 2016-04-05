// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strongloop
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

var exec = require('child_process').exec;

var PACKAGE = require('../../package.json');
var VERSION = PACKAGE.version;

module.exports = function(argv, options, loader) {
  if (options.help || options.h) {
    return loader.printUsage('update');
  }

  console.log('strongloop at %s; trying self-update...', VERSION);

  checkVersions();

  function install(name, callback) {
    console.log('npm install -g %s; this may take a moment...', name);

    exec('npm -q install -X f -g ' + name, callback);
  }

  function checkVersions() {
    install('strongloop', function(err, stdout, stderr) {
      if (err) {
        return loader.error(stderr);
      }
      exec('slc version', function(err, stdout, stderr) {
        if (err) {
          return loader.error(stderr);
        }
        console.log('Updated to:\n%s', stdout);
      });
    });
  }
};
