var assert = require('assert');
var debug = require('debug')('slc');
var path = require('path');
var util = require('util');

function formatReport(info, prefix) {
  var result = '';
  var names = Object.keys(info);
  for (var i = 0; i < names.length; i++) {
    var childPrefix = prefix;
    result += prefix;
    if (i === names.length - 1) {
      result += '└─';
      childPrefix += '  ';
    } else {
      result += '├─';
      childPrefix += '│ ';
    }

    var objInfo = info[names[i]];
    if (Object.keys(objInfo.dependencies).length > 0) {
      result += '┬';
    } else {
      result += '─';
    }
    result += ' ' + names[i] + '@' + objInfo.version + '\n';
    result += formatReport(objInfo.dependencies, childPrefix);
  }
  return result;
}

// The dependencies we are primarily interested in reporting about are
// those that the slc commands directly depend on. In addition, report
// the version of strong-agent.
var REPORT_DEPENDENCIES = [
  'strong-build',
  'strong-supervisor',
  'node-inspector',
  'strong-deploy',
  'strong-pm',
  'strong-registry',
  'nodefly-register',
  'generator-loopback'
];

module.exports = function() {
  var result = {};
  REPORT_DEPENDENCIES.forEach(function(name) {
    try {
      var version = require(path.join(name, 'package.json')).version;
      result[name] = {version: version, dependencies: {}};
    } catch (er) {
      console.error(
        'Dependency %s not found, try `npm install -g strong-cli`.',
        name
      );
    }
  });

  try {
    var agentVersion = require('strong-supervisor').__module.
        require(path.join('strong-agent', 'package.json')).version;
    result['strong-supervisor'].dependencies['strong-agent'] = {
      version: agentVersion,
      dependencies: {}
    };
  } catch (er) {
    console.error(
      'Dependency %s not found, try `npm install -g strong-cli`.',
      'strong-agent'
    );
  }

  var PACKAGE = require('../package.json');
  var peerDeps = PACKAGE.peerDependencies || [];
  Object.keys(peerDeps).forEach(function(name) {
    try {
      var version = require(path.join(name, 'package.json')).version;
      result[name] = {version: version, dependencies: {}};
    } catch (er) {
      console.error(
        'Peer dependency %s not found, try `npm install -g %s`.',
        name, name
      );
    }
  });

  console.log('strong-cli v%s (node %s)', PACKAGE.version, process.version);
  console.log(formatReport(result, ''));
};

// For unit test
module.exports.__REPORT_DEPENDENCIES = REPORT_DEPENDENCIES;
