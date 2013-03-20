/**
 * Module dependencies.
 */

var path = require('path');

/**
 * Run tests specified by package.json
 */
 
module.exports = function (parent, done) {
  return parent
    .command('test')
    .description('run tests')
    .action(function () {
      var npm = require('npm');
      var spawn = require('child_process').spawn;
      var pkg = getPackage();
      var script = pkg && pkg.scripts && pkg.scripts.test;
    
      if(!pkg) {
        done(new Error('package.json was not found'));
      }
    
      if(script) {
        npm.load(pkg, function (err) {
          if (err) return done(err);
          
          npm.commands.test([], done);
          npm.on("log", function (msg) { console.log(msg); });
        });
      } else {
        return done(new Error('No test script specified in package.json'));
      }
    });
}

function getPackage() {
  try {
    var pkg = require(path.join(process.cwd(), 'package.json'))
  } catch(e) {
    if(e.code == 'MODULE_NOT_FOUND') {
      return pkg;
    } else {
      throw e;
    }
  }
  
  return pkg;
}