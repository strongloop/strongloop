/**
 * Delegation to npm commands
 * <ul>
 * <li>install Install a package
 * <li>link Symlink a package folder
 * <li>ls List installed packages
 * <li>rm/uninstall Remove a package
 * <li>shrinkwrap Lock down dependency versions
 * </ul>
 */
var fork = require('child_process').fork;

module.exports = function (argv, options, loader) {
  fork(require.resolve('npm/bin/npm-cli'), argv);
};
