/*!
 * Module Dependencies.
 */

var npm = require('npm');
var log = require('npm/node_modules/npmlog');
var path = require('path');
var assert = require('assert');

/**
 * Exports the install function.
 */

module.exports = install;


/**
 * Install a package or module.
 * 
 * @param {String} [pkgPath] Path to require the package from.
 * @options {Object} [options]
 * @prop {String} [logLevel] The npm log level
 * @prop {Boolean} [allowUnsupported] Allow modules that are unsupported
 * @prop {String} [module=.] The module to install
 * @param  {Function} cb
 */

function install (pkgPath, options, cb) {
  if(typeof pkgPath === 'function') {
    cb = pkgPath;
    pkgPath = 'package.json';
    options = {};
  }

  if(typeof options === 'function') {
    cb = options;
    options = {};
  }
  var module = options.module || '.';
  var pkg;
  options = options || {};

  // Install without module name
  if('.' === module) {
    try {
      pkg = require(pkgPath);
    } catch(e) {
      console.error('could not load package.json');
      cb();
    }
  }

  pkg = pkg || {};

  npm.load(pkg, function (err) {
    if (err) return cb(err);

    log.level = options.logLevel || 'http';

    npm.on('log', function (msg) { console.log(msg); });

    if(options.allowUnsupported) {
      npm.config.set('allow-unsupported', true);
    }

    npm.commands.install([module], function (err, data) {
      if (err) {
        switch(err.code) {
          case 'ENOTALLOWED':
            console.log(err.message);
            break;
          default:
            return cb(err);
        }
      }
      cb();
    });
  });
}
