/**
 * Print help for sub commands
 */
 
module.exports = function (parent, done) {
  var path = require('path');

  var cmd = parent
    .command('help [cmd]')
    .description('print usage info for [cmd]')
    .action(function (cmd) {
      if(cmd) {
        parent.commands.forEach(function (c) {
          if(c._name === cmd) {
            c.help();
          }
        });
      } else {
        parent.help();
      }
    });
  
  return cmd;
}