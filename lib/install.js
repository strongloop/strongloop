/**
 * Install modules using slnode npm
 */
 
module.exports = function (parent, done) {
  var npm = require('npm');
  var path = require('path');
  return parent
    .command('install [module]')
    .description('install a packge from npm')
    .option('-a, --allow-unsupported', 'disable supported modules check')
    .action(function (module, options) {
      options = options || {};
      if(module) {
        npm.load(require(path.join(process.cwd(), 'package.json')), function (err) {
          if (err) return done(err);

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
                  done(err);
                break;
              }
            }
      
            done();
          });
          npm.on("log", function (msg) { console.log(msg); });
        });
      } else {
        this.help();
      }
    });
}