/**
 * Print node env info...
 */

module.exports = function (argv, options, loader) {
  console.log({
    versions: process.versions,
    platform: process.platform,
    config: process.config,
    execPath: process.execPath,
    features: process.features
  });
};
