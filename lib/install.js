/*!
 * Module Dependencies.
 */

var npm = require('npm');
var log = require('npm/node_modules/npmlog');
var assert = require('assert');
var debug = require('debug')('slc');

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
  var args = Array.prototype.slice.call(arguments);
  cb = args.pop();
  options = args.pop();
  pkgPath = args.pop();

  if(typeof options === 'string') {
    pkgPath = options;
    options = undefined;
  }

  // defaults
  options = options || {};
  pkgPath = pkgPath || 'package.json';

  debug('install path %s cwd %s options:', pkgPath, process.cwd(), options);

  // required
  assert(cb, 'install requires a callback');

  var module = options.module || '.';
  var pkg;

  // Install without module name
  if('.' === module) {
    try {
      pkg = require(pkgPath);
    } catch(e) {
      if(e.code !== 'MODULE_NOT_FOUND') {
        console.error('could not load package.json');
        return cb();
      }
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
