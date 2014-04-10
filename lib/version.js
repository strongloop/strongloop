var path = require('path');

var PACKAGE = require('../package.json');

function report(name, version) {
  if(version != null) {
    console.log('%s v%s', name, version);
  } else {
    console.log('%s peer-dependency not found; try `slc update`', name)
  }
}

function check(name) {
  try {
    var v = require(path.join(name,'package.json')).version;
    report(name, v);
  } catch(er) {
    report(name);
  }
}

module.exports = function() {
  console.log('strong-cli v%s (node %s)',
      PACKAGE.version,
      process.version);
  Object.keys(PACKAGE.peerDependencies)
    .map(check);
};
