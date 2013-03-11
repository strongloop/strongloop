/**
 * Print node env information...
 */
 
module.exports = function () {
  console.log({
    versions: process.versions,
    platform: process.platform,
    config: process.config,
    execPath: process.execPath,
    features: process.features
  });
}