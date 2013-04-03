/**
 * Run node scripts
 */
 
module.exports = function (parent, done) {
  var path = require('path');
  var fs = require('fs');

  function runScript() {
    if(process.title === 'npm') return; // Hack: the command has been processed by npm, skip it
    
    var args = Array.prototype.slice.call(arguments); // Convert to an array
    // commander appends one or more commands to the end of the args
    var count = 0;
    for ( var i = args.length-1; i >= 0; i--) {
      if ((typeof args[i]) !== 'string') {
        count++;
      } else {
        break;
      }
    }
    args.splice(-count, count); // Remove the commands

    if(args[0] === 'run') args.shift();
    
    var spawn = require('child_process').spawn;
    
    // node executable
    var bin = process.argv[0];

    console.log('Spawning process: ' + bin + ' ' + args)
    // run it
    var proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
    proc.on('exit', function(code){
      if (code == 127) {
        console.error('\n  %s(1) does not exist\n', bin);
      }
      if(code) {
        done(new Error('Exit code: ' +code));
      } else {
        done();
      }
    });  
  }
  
  var cmd = parent
    .command('*')
    .description('run a specified script')
    .usage('[run] script [args]')
    .action(runScript);
  
  return cmd;
}

