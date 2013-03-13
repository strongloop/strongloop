/**
 * Run tests specified by package.json
 */
 
module.exports = function (parent, done) {
  return parent
    .command('test')
    .description('run tests')
    .action(function () {
      var spawn = require('child_process').spawn;
      var path = require('path');
      var pkg = require(path.join(process.cwd(), 'package.json'));
      var script = pkg.scripts && pkg.scripts.test;
    
      if(script) {
        console.log('running test', script);
      
        run(script);
      } else {
        console.log('No test script specified in package.json');
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