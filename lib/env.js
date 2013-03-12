/**
 * Print node env information...
 */
 
module.exports = function (options, done) {
  return function () {
    console.log({
      versions: process.versions,
      platform: process.platform,
      config: process.config,
      execPath: process.execPath,
      features: process.features
    });
    
    done();
  }
}