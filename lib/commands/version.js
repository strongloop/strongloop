/**
 * Output version
 */

var json = require('../../package.json');
var fs = require('fs');


module.exports = function (argv, options, loader) {
  var sn = json.version;
  var node = process.version;
  fs.exists('slsVersion.json', function(exists){
    if (exists){
      var sls = require('../../slsVersion.json').slsVersion;
    } else {
      var sls = json.slsVersion;
    }
  console.log('strongloop suite v%s, strongnode v%s (node %s)',
             sls, sn, node);
  })
};
