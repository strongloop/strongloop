/**
 * Main program for slnode
 */

var program = require('commander');

/**
 * Override the parseArgs method so that it will pass in the unknown options for the action
 */
program.Command.prototype.parseArgs = function(args, unknown){
  function outputHelpIfNecessary(cmd, options) {
    options = options || [];
    for (var i = 0; i < options.length; i++) {
      if (options[i] == '--help' || options[i] == '-h') {
        cmd.outputHelp();
        process.exit(0);
      }
    }
  }
  
  var cmds = this.commands
    , len = cmds.length
    , name;

  if (args.length) {
    name = args[0];
    if (this.listeners(name).length) {
      this.emit(args.shift(), args, unknown);
    } else {
      // [rfeng] Pass in the unknown options to the * command
      if(unknown) {
        args = args.concat(unknown);
      }
      this.emit('*', args);
    }
  } else {
    outputHelpIfNecessary(this, unknown);
    
    // If there were no args and we have unknown options,
    // then they are extraneous and we need to error.
    if (unknown.length > 0) {      
      this.unknownOption(unknown[0]);
    }
  }

  return this;
};

/**
 * Usage
 */

program.usage('\n    slnode [script]' + '\n    slnode [options] [command] [args]');

/**
 * Commands
 */

var COMMANDS = {
  // Set up npm delegation
  'npm': 'run a npm command',  
  // 'build'             :   'compile a standalone version of your app',
  // 'clean'             :   'remove any built files',
  // 'doc'               :   'run dox on source files',
  'run' : 'run a specified script',
  'env' : 'print node environment information',
  // 'lint'              :   'run jshint on source files',
  // 'install' : 'install packages and dependencies',
  // 'list'              :   'list available node packages',
  // 'use'               :   'switch node versions'
  // 'test' : 'run tests',
  'version' : 'print node version',
  'help' : 'print usage info for [cmd]',
  'debug': 'run the debugger',
  // 'publish'           :   'publish "." or the given dir/tarball',
  'create' : 'scaffold projects and modules'
};

function done(err) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  } else {
    process.exit(0);
  }  
}

// Load other commands
Object.keys(COMMANDS).forEach(function(cmd) {
  var file = cmd.split(' ')[0];

  var module = require('./' + file);

  if (typeof module === 'function') {
    module(program, done);
  }

});

if (process.argv.length === 2) {
  process.argv.push('-h');
}

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ slnode create web mywebapp')
  console.log('    $ slnode run app.js');
  console.log('    $ slnode install -f express');
  console.log('    $ slnode npm list');
  console.log('');
});

program.parse(process.argv);
