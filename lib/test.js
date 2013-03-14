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
      var spawn = require('child_process').spawn;
      var pkg = getPackage();
      var script = pkg && pkg.scripts && pkg.scripts.test;
    
      if(!pkg) {
        done(new Error('package.json was not found'));
      }
    
      if(script) {
        run(script);
      } else {
        done(new Error('No test script specified in package.json'));
      }
  
      function run(script) {
        var args = script.split(' ');
        var cmd = args.shift();
        var child = spawn(cmd, args, {stdio:  [0,1,2]});
    
        child.on('exit', function () {
          done();
        });
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