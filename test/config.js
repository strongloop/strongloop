/**
 * @fileOverview
 * config.js holds answers to tests, we could later switch on an environment variable which config we
 * load for targeted tests.
 */

var path = require('path');

// We need to fudge a bit for Jenkins. If under Jenkins, we point to ./test as the home directory
var home = (process.env['JENKINS_HOME'] || process.env['SLC_TEST']) ? path.join(process.cwd(), 'test') : '/Users/edmond';
var getFileSyncFile = path.join(home, '.gitconfig');

exports.strongops = {
  getNpmEmail: 'edmond@stdarg.com',
  getGitConfigInfo: {
    name: 'Edmond Meinfelder',
    email: 'edmond@stdarg.com'
  },
  getUserHome: home,
  getDefaults: {
    name: 'Edmond Meinfelder',
    email: 'edmond@stdarg.com'
  },
  getFileSync: getFileSyncFile,
};
