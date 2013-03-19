/**
 * Install modules using slnode npm
 */
 
module.exports = function (parent, done) {
  var npm = require('npm');
  var path = require('path');
  return parent
    .command('install [module]')
    .description('install a package from npm')
    .option('-a, --allow-unsupported', 'disable supported modules check')
    .action(function (module, options) {
      module = module || '.';
      options = options || {};
      if(module) {
        var pkg;
        
        try {
          pkg = require(path.join(process.cwd(), 'package.json'));
        } catch(e) {
          console.error('could not load package.json');
          done();
        }
        
        
        npm.load(pkg, function (err) {
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