/**
 * Run node scripts
 */
 
module.exports = function (parent, done) {
  var path = require('path');
  var fs = require('fs');

  var cmd = parent
    .command('run')
    .description('run a specified script')
    .action(run);
    
  function run(script) {
    script = path.join(process.cwd(), script);
    
    try {
      require(script);
    } catch(e) {
      if(e.code === 'MODULE_NOT_FOUND') {
        console.log(e.message);
        done();
      } else {
        throw e;
      }
    }
  }
  
  parent.on('*', function (args) {
    var script = (args && args.length) && args.shift();
    
    if(script) {
      fs.exists(path.join(process.cwd(), script), function (exists) {
        if(exists) {
          run(script);
        } else {
          done(new Error(script + ' is not a known command or script!'));
        }
      });
    }
  });
  
  return cmd;
}