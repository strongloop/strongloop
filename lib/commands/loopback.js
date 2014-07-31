var debug = require('debug')('slc:loopback');
module.exports = function loopback(argv, options, loader) {
  var args = process.argv.slice(2);
  debug('invoking slc %s', args.join(' '));
  var env = require('yeoman-generator')();

// lookup for every namespaces, within the environments.paths and lookups
  env.lookup();

  env.on('end', function () {
    console.log('Done running sir');
  });

  env.on('error', function (err) {
    console.error('Error', args.join(' '), '\n');
    console.error(opts.debug ? err.stack : err.message);
    process.exit(err.code || 1);
  });

  env.run(args, {});
}