/**
 * @fileOverview
 * config.js holds answers to tests, we could later switch on an environment variable which config we
 * load for targeted tests.
 */

var fs = require('fs');
var path = require('path');

// We need to fudge a bit for Jenkins. If under Jenkins, we point to ./test as the home directory
var home = isRunningOnJenkins() ?
  path.join(process.cwd(), 'test') :
  process.env.HOME;

var getFileSyncFile = path.join(home, '.gitconfig');

var gitConfig = fs.readFileSync(path.join(home, '.gitconfig'), 'utf-8');
var npmConfig = fs.readFileSync(path.join(home, '.npmrc'), 'utf-8');

exports.strongops = {
  getNpmEmail: getFromRc(npmConfig, 'email', 'edmond@stdarg.com'),
  getGitConfigInfo: {
    name: getFromRc(gitConfig, 'name', 'Edmond Meinfelder'),
    email: getFromRc(gitConfig, 'email', 'edmond@stdarg.com'),
  },
  getUserHome: home,
  getFileSync: getFileSyncFile,
};

exports.strongops.getDefaults = exports.strongops.getGitConfigInfo;

function isRunningOnJenkins() {
  return process.env.JENKINS_HOME || process.env.SLC_TEST;
}

function getFromRc(rcText, localName, defaultValue) {
  var regex = new RegExp('^\\s*' + localName + '\\s*=\\s*(.*)\\s*$', 'm');
  var match = rcText.match(regex);
  return match ? match[1] : defaultValue;
}
