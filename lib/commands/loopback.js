var debug = require('debug')('slc:loopback');
var yeoman;
try {
  // Try to use the yeoman-generator from generator-loopback module
  yeoman = require('generator-loopback/node_modules/yeoman-generator');
} catch (err) {
  // Fall back the peer/parent dep
  yeoman = require('yeoman-generator');
}

module.exports = function loopback(argv, options, loader) {
  var opts = {};
  var args = process.argv.slice(2);
  debug('invoking slc %s', args.join(' '));
  var env = yeoman();

  // Make sure slc loopback is delegated to slc loopback:app (the default subgenerator)
  env.alias(/^([^:]+)$/, '$1:app');

  // lookup for every namespaces, within the environments.paths and lookups
  env.lookup();

  env.on('end', function () {
    console.log('Done running loopback generator');
  });

  env.on('error', function (err) {
    loader.error('Error', 'slc ' + args.join(' '), '\n');
    loader.error(opts.debug ? err.stack : err.message);
    process.exit(err.code || 1);
  });

  env.run(args, opts);
}
