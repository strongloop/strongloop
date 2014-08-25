var path = require('path');
var studio = require('strong-studio');
var DEFAULT_STUDIO_PORT = 3030;
var DEFAULT_STUDIO_HOST = 'localhost';
var STUDIO_RUNNING_MSG = 'Your studio is running here:';

module.exports = function(argv, options, loader) {
  var WORKSPACE_DIR = process.cwd();
  var pathArg = argv[0];
  var PORT = argv[1] || DEFAULT_STUDIO_PORT;

  if(pathArg) {
    WORKSPACE_DIR = path.join(WORKSPACE_DIR, pathArg);
  }

  process.env.WORKSPACE_DIR = WORKSPACE_DIR;

  var server = studio.listen(0, function(err) {
    if(err) {
      console.error('could not start studio!');
      console.error(err);
    }

    console.log('%s http://%s:%s', STUDIO_RUNNING_MSG, DEFAULT_STUDIO_HOST, server.address().port);;
  });
}

module.exports.STUDIO_RUNNING_MSG = 'Your studio is running here:';