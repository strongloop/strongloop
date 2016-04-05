// Copyright IBM Corp. 2013,2015. All Rights Reserved.
// Node module: strongloop
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

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
    if (objInfo.gitCommit) {
      result += util.format(' %s@%s (%s)\n', names[i], objInfo.version,
                            objInfo.gitCommit.slice(0, 7));
    } else {
      result += util.format(' %s@%s\n', names[i], objInfo.version);
    }
    result += formatReport(objInfo.dependencies, childPrefix);
  }
  return result;
}

// The dependencies we are primarily interested in reporting about are
// those that the slc commands directly depend on. In addition, report
// the version of strong-agent.
var REPORT_DEPENDENCIES = [
  'strong-arc',
  'strong-build',
  'strong-deploy',
  'strong-mesh-models',
  'strong-pm',
  'strong-registry',
  'strong-start',
  'strong-supervisor',
  'generator-loopback',
  'node-inspector',
  'nodefly-register',
];

module.exports = function() {
  var result = {};
  REPORT_DEPENDENCIES.forEach(function(name) {
    try {
      var pkg = require(path.join(name, 'package.json'));
      result[name] = {
        version: pkg.version, dependencies: {}, gitCommit: pkg.gitHead
      };
    } catch (er) {
      console.error(
        'Dependency %s not found, try `npm install -g strongloop`.',
        name
      );
    }
  });

  try {
    var agent = require('strong-supervisor').__module.
        require(path.join('strong-agent', 'package.json'));
    result['strong-supervisor'].dependencies['strong-agent'] = {
      version: agent.version,
      dependencies: {},
      gitCommit: agent.gitHead,
    };
  } catch (er) {
    console.error(
      'Dependency %s not found, try `npm install -g strongloop`.',
      'strong-agent'
    );
  }

  var PACKAGE = require('../package.json');
  var peerDeps = PACKAGE.peerDependencies || [];
  Object.keys(peerDeps).forEach(function(name) {
    try {
      var pkg = require(path.join(name, 'package.json'));
      result[name] = {
        version: pkg.version, dependencies: {}, gitCommit: pkg.gitHead
      };
    } catch (er) {
      console.error(
        'Peer dependency %s not found, try `npm install -g %s`.',
        name, name
      );
    }
  });

  console.log('strongloop v%s (node %s)', PACKAGE.version, process.version);
  console.log(formatReport(result, ''));
};

// For unit test
module.exports.__REPORT_DEPENDENCIES = REPORT_DEPENDENCIES;
