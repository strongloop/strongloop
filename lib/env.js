/**
 * Print node env info...
 */
 
module.exports = function (parent, done) {
  var npm = require('npm');
  var path = require('path');
  var cmd = parent.command('env');
  
  cmd
    .description('print node environment information')
    .action(function () {
      console.log({
        versions: process.versions,
        platform: process.platform,
        config: process.config,
        execPath: process.execPath,
        features: process.features
      });
    
      done();
    });
    
  return cmd;
}


