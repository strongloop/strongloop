// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strongloop
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

var nopt = require('nopt');
var path = require('path');
var debug = require('debug')('slc:loopback');
var lbGenerator = require('generator-loopback');

var yeoman = lbGenerator._yeoman; // generator-loopback should export _yeoman
if (!yeoman) {
  try {
    // Try to use the yeoman-generator from generator-loopback module
    yeoman = require('generator-loopback/node_modules/yeoman-generator');
  } catch (err) {
    // Fall back the peer/parent dep
    yeoman = require('yeoman-generator');
  }
}

module.exports = function loopback(argv, options, loader) {
  var opts = nopt({
    help: Boolean,
    version: Boolean,
    generators: Boolean
  }, {
    h: '--help',
    v: '--version',
    l: '--generators'
  });

  if (opts.version) {
    var _package = lbGenerator._package;
    if (!_package) {
      var pkg = require('generator-loopback/package.json');
      _package = pkg.name + ': ' + pkg.version;
    }
    console.log(_package);
    return;
  }

  var args = process.argv.slice(2);
  debug('invoking slc %s', args.join(' '));
  var env = yeoman();

  // Make sure slc loopback is delegated to slc loopback:app (the default
  // subgenerator)
  env.alias(/^([^:]+)$/, '$1:app');

  // Change the working directory to the generator-loopback module so that
  // yoeman can discover the generators
  var root = path.dirname(require.resolve('generator-loopback/package.json'));
  var cwd = process.cwd();
  debug('changing directory to %s', root);
  process.chdir(root);

  // lookup for every namespaces, within the environments.paths and lookups
  env.lookup();
  debug('changing directory back to %s', cwd);
  process.chdir(cwd); // Switch back

  // list generators
  if (opts.generators) {
    console.log('Available loopback generators: ');
    console.log(Object.keys(env.getGeneratorsMeta()).filter(function(name) {
      return name.indexOf('loopback:') !== -1;
    }).join('\n'));
    return;
  }

  env.on('end', function() {
    console.log('Done running loopback generator');
  });

  env.on('error', function(err) {
    loader.error('Error', 'slc ' + args.join(' '), '\n',
      opts.debug ? err.stack : err.message);
    // process.exit(err.code || 1);
  });

  env.run(args, opts);
};
