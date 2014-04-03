/**
 * Create local copy of examples
 */

var example = require('../example');

// Map 'type' of example to a github.com:strongloop/<name>.git. The <name> is
// also used as the default name of the example, which seems the least
// surprising choice.
var examples = {
  suite: 'sls-sample-app',
};

module.exports = function(argv, options, loader) {
  if (options.help || options.h) {
    return loader.printUsage('example');
  }

  var type = options._[0] || 'suite';

  if (!examples[type]) {
    return loader.error(
      '%s is not a supported type for `slc example`, see `slc help example`',
      type);
  }
  var repo = examples[type];

  var name = options._[1] || repo;

  example(argv, options, loader, type, repo, name);
};
