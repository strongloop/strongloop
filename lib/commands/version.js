/**
 * Output version
 */

var json = require('../../package.json');
var fs = require('fs');


module.exports = function (argv, options, loader) {
  var slc = json.version;
  var node = process.version;
  console.log('slc v%s (node %s)', slc, node);
};
