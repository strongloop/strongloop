var assert = require('assert');
var spawn = require('child_process').spawn;

module.exports = function Command(command, npmModule) {
  return function(argv, options, loader) {
    var options = {
      env: process.env,
      stdio: 'inherit'
    };

    var resolvedCommand;
    try {
      resolvedCommand = require.resolve(npmModule + "/" + command);
    } catch (er) {
      loader.error('Error running %s (%s), it may need installation, try `npm update -g strong-cli`.',
        command, er.message);
    }

    // Transmit full original command name to children
    options.env.CMD = 'slc ' + process.env.SLC_COMMAND;

    // Build a new `argv` with full path for command
    // The first argv value should be the path to the node executable
    process.argv = [process.argv[0], resolvedCommand].concat(argv);
    require('module')._load(resolvedCommand, null, true);
  };
};
