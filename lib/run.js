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
    if(typeof script !== 'string') {
      script = 'index.js';
    }
    
    script = path.join(process.cwd(), script);
    
    try {
      // load as the main module
      require('module')._load(script, null, true);
    } catch(e) {
      if(e.code === 'MODULE_NOT_FOUND') {
        console.log(e.message);
        done();
      } else {
        throw e;
      }
    }
  }
  
  function tryToRun(script) {
    if(script) {
      fs.exists(path.join(process.cwd(), script), function (exists) {
        if(exists) {
          run(script);
        } else if(script.substr(-3) !== '.js') {
          tryToRun(script + '.js')
        } else {
          done(new Error(script + ' is not a known command or script!'));
        }
      });
    }
  }
  
  parent.on('*', function (args) {
    var script = (args && args.length) && args.shift();
    
    tryToRun(script);
  });
  
  return cmd;
}