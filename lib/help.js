/**
 * Print help for sub commands
 */
 
module.exports = function (parent, done) {
  var path = require('path');

  var cmd = parent
    .command('help [command]')
    .description('print usage info for [command]')
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
