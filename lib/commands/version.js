/**
 * Output version
 */

var json = require('../../package.json');
var fs = require('fs');


module.exports = function (argv, options, loader) {
  var sn = json.version;
  var node = process.version;
  try {
    var sls = require('../../slsVersion.json').slsVersion;
  } catch (err) {
      var sls = json.slsVersion;
  }
  console.log('strongloop suite v%s, strongnode v%s (node %s)',
             sls, sn, node);
};
