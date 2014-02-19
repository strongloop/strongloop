var assert = require('assert');
var spawn = require('child_process').spawn;

module.exports = function Command(command, npmModule) {
  return function (argv, options, loader) {
    var options = {
      env: process.env,
      stdio: 'inherit'
    };

    return spawn(command, argv, options)
      .on('error', function(er) {
        loader.error('Error running %s (%s), it may need installation, try `npm update -g %s`.',
          command, er.message, npmModule);
      });
  };
}
