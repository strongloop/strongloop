// slc install: expose 'slc npm install' as 'slc install ...'
//
// For backwards compatibility, and because in the future we will do some
// special stuff here, we hope.
var debug = require('debug')('slc:install');

module.exports = function (argv, options, loader) {
  debug('slc install argv:', argv, 'options:', options);
  return loader.run(['npm', 'install'].concat(argv));
}
