var fork = require('child_process').fork;
var fs = require('fs');
var path = require('path');
var open = require('opener');
var inspector = require('node-inspector');

var parserOptions = {
  suspend: {
    alias: 's',
    type: 'boolean'
  },
  port: {
    alias: 'p',
    type: 'number'
  },
  'debug-port': {
    alias: 'd',
    type: 'number'
  },
  cli: {
    alias: 'c',
    type: 'boolean'
  }
};

/**
 * By default:
 *
 * 1. Runs the supplied script in debug mode
 * 2. Runs node-inspector.
 * 3. Opens the user's browser, pointing it at the inspector.
 */
function debug(argv, options, loader) {
  var script = loader.parse(argv, parserOptions)._[0];

  if (!script) {
    script = path.resolve(__dirname, '..', 'run-repl');
  }

  // We want to pass along subarguments, but re-parse our arguments.
  var subprocArgs = argv.splice(argv.indexOf(script) + 1);
  options = loader.parse(argv, parserOptions);

  var inspectorPort = options.port || 8080;
  var inspectorArgs = ['--web-port=' + inspectorPort];

  var subprocPort = options['debug-port'] || 5858;
  var subprocExecArgs = ['--debug=' + subprocPort];

  var url = inspector.buildInspectorUrl(
    'localhost',
    inspectorPort,
    subprocPort
  );

  if (options.suspend) {
    subprocExecArgs.push('--debug-brk');
  }

  fork(require.resolve('node-inspector/bin/inspector'), inspectorArgs, { silent: true });

  var debuggedProcess = fork(path.resolve(process.cwd(), script), subprocArgs, {
    execArgv: subprocExecArgs
  });
  debuggedProcess.on('exit', function() { process.exit(); });

  if (!options.cli) {
    open(url);
  }

  console.log('Node-inspector is now available from %s', url);
  console.log('Debugging %s %s\n', script, subprocArgs.join(' '));
}

module.exports = debug;
