/**
 * @fileOverview
 * config.js holds answers to tests, we could later switch on an environment variable which config we
 * load for targeted tests.
 */

var fs = require('fs');
var path = require('path');

// This is a duplication of the same code in the module under test
// (i.e. stronops.js) It's questionable whether such test brings any benefit
var home = process.env[(process.platform === 'win32') ? 'USERPROFILE'  : 'HOME'];

var getFileSyncFile = path.join(home, '.gitconfig');

/**
 * Configuration options as set in test gitconfig and npmrc
 */
exports.strongops = {
  npmEmail: 'npmrc@example.com',
  gitConfig: {
    name: 'GitConfig Name',
    email: 'gitconfig@example.com'
  },
  userHome: home,
  anExistingFile: path.resolve(__dirname, '.gitconfig')
};

exports.strongops.getDefaults = exports.strongops.gitConfig;

