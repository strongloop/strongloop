/**
 * clusterctl: control a cluster with strong-cluster-control
 */

var cli = require('strong-cluster-control').cli;

module.exports = function (argv, options, loader) {
  // cli expects 'normal' argv, which starts with node and script, but optimist
  // strips this out, so rebuild it.
  argv.unshift(process.argv[1]);
  argv.unshift(process.argv[0]);

  // We don't want control to have a version subcommand, slc handles that
  var version;

  cli(argv, version, function(erMsg) {
    if(erMsg) {
      return loader.error('slc clusterctl: ' + erMsg);
    }
  });
};
