/**
 * @fileOverview
 * config.js holds answers to tests, we could later switch on an environment variable which config we
 * load for targeted tests.
 */

exports.strongops = {
  getNpmEmail: 'edmond@stdarg.com',
  getGitConfigInfo: {
    name: 'Edmond Meinfelder',
    email: 'edmond@stdarg.com'
  },
  getUserHome: '/Users/edmond',
  getDefaults: {
    name: 'Edmond Meinfelder',
    email: 'edmond@stdarg.com'
  },
  getFileSync: '/Users/edmond/.gitconfig',
};