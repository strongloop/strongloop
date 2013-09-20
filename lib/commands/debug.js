var fork = require('child_process').fork;
var path = require('path');
var util = require('util');
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

var config;

/**
 * By default:
 *
 * 1. Runs the supplied script in debug mode
 * 2. Runs node-inspector.
 * 3. Opens the user's browser, pointing it at the inspector.
 *
 * NOTE: Finishes with a call to process.exit() when running without arguments
 * or when an error occured.
 */
function debug(argv, options, loader) {
  config = parseArgs(argv, options, loader);

  startInspector(function(err) {
    if (err) {
      return loader.error(formatNodeInspectorError(err));
    }

    startDebuggedProcess(function(err) {
      if (err) {
        return loader.error(
          'Cannot start %s: %s',
          config.subproc.script,
          err.message || err
        );
      }

      openBrowserAndPrintInfo();
    });
  });
}

function parseArgs(argv, options, loader) {
  var script = loader.parse(argv, parserOptions)._[0];
  var printScript = true;

  if (!script) {
    script = path.resolve(__dirname, '..', 'run-repl');
    printScript = false;
  }

  // We want to pass along subarguments, but re-parse our arguments.
  var subprocArgs = argv.splice(argv.indexOf(script) + 1);
  options = loader.parse(argv, parserOptions);

  var subprocPort = options['debug-port'] || 5858;
  var subprocExecArgs = ['--debug=' + subprocPort];

  if (options.suspend) {
    subprocExecArgs.push('--debug-brk');
  }

  var inspectorPort = options.port || 8080;
  var inspectorArgs = ['--web-port=' + inspectorPort];

  return {
    printScript: printScript,
    options: options,
    subproc: {
      script: script,
      args: subprocArgs,
      execArgs:  subprocExecArgs,
      debugPort: subprocPort
    },
    inspector: {
      port: inspectorPort,
      args: inspectorArgs
    }
  };
}

function startInspector(callback) {
  var inspectorProcess = fork(
    require.resolve('node-inspector/bin/inspector'),
    config.inspector.args,
    { silent: true }
  );

  inspectorProcess.once('message', function(msg) {
    switch (msg.event) {
    case 'SERVER.LISTENING':
      return callback(null, msg.address);
    case 'SERVER.ERROR':
      return callback(msg.error);
    default:
      console.warn('Unknown Node Inspector event: %s', msg.event);
      return callback(
        null,
        {
          address: 'localhost',
          port: config.inspector.port
        }
      );
    }
  });
}

function formatNodeInspectorError(err) {
  var reason = err.message || err.code || err;
  if (err.code === 'EADDRINUSE') {
    reason += '\nThere is another process already listening at 0.0.0.0:' +
      config.inspector.port + '.\n' +
      'Run `slc debug -p {port}` to use a different port.';
  }

  return util.format('Cannot start Node Inspector:', reason);
}

function startDebuggedProcess(callback) {
  var debuggedProcess = fork(
    path.resolve(process.cwd(), config.subproc.script),
    config.subproc.args,
    {
      execArgv: config.subproc.execArgs
    }
  );
  debuggedProcess.on('exit', function() { process.exit(); });
  callback();
}

function openBrowserAndPrintInfo() {
  var url = inspector.buildInspectorUrl(
    'localhost',
    config.inspector.port,
    config.subproc.debugPort
  );

  if (!config.options.cli) {
    open(url);
  }

  console.log('Node-inspector is now available from %s', url);
  if (config.printScript)
    console.log('Debugging `%s`\n', config.subproc.script);
}

module.exports = debug;
