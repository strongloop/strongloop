/**
 * Output version
 */

module.exports = function (argv, options, loader) {
  var v = require('../../package.json').version;

  console.log('strongloop', v, '(node ' + process.version + ')');
};
