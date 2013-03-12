/**
 * Run tests specified by package.json
 */
 
module.exports = function (options, done) {
  var spawn = require('child_process').spawn;
  var path = require('path');
  var pkg = require(path.join(process.cwd(), 'package.json'));
  
  return function () {
    var script = pkg.scripts && pkg.scripts.test;
    
    if(script) {
      console.log('running test', script);
      
      run(script);
    } else {
      console.log('No test script specified in package.json');
    }
    
    done();
  }
  
  function run(script) {
    var args = script.split(' ');
    var cmd = args.shift();
    var child = spawn(cmd, args, {stdio:  [0,1,2]});
    
    child.on('exit', function () {
      done();
    });
  }
}

