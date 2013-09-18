/**
 * Output version
 */

var json = require('../../package.json');

module.exports = function (argv, options, loader) {
  var sn = json.version;
  var node = process.version;
  var sls = json.slsVersion;

  console.log('strongloop suite v%s, strongnode v%s (node %s)',
             sls, sn, node);
};
