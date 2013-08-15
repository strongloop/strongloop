/**
 * Install modules using internal npm
 */

module.exports = function (parent, done) {
  var npm = require('npm');
  var log = require('npm/node_modules/npmlog');
  var path = require('path');
  return parent
    .command('install [module]')
    .description('install a package from npm')
    .option('-a, --allow-unsupported', 'disable supported modules check')
    .action(function (module, options) {
      module = module || '.';
      options = options || {};
      var pkg;

      // Install without module name
      if('.' === module) {
        try {
          pkg = require(path.join(process.cwd(), 'package.json'));
        } catch(e) {
          console.error('could not load package.json');
          done();
        }
      }

      pkg = pkg || {};

      npm.load(pkg, function (err) {

        log.level = 'http';

        if (err) return done(err);

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
                return done(err);
            }
          }
          done();
        });
      });
  });
};

module.exports = require('../shim')('install', module.exports);
