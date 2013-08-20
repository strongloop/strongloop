// Load the module contained in the current directory (cwd) and start REPL

var path = require('path');
var repl = require('repl');
var Module = require('module');

var location = process.cwd();

// Hack: Trick node into changing process.mainScript to moduleToDebug
var moduleToDebug = Module._load(location, module, true);

startRepl(getModuleName());

function startRepl(name) {
  var cmd = process.env.SLC_COMMAND || 'run';
  var sample = getSampleCommand();

  console.log(
    '\nStarting the interactive shell (REPL). Type `.help` for help.\n' +
      'You can access your module as `m`%s.\n' +
      'Didn\'t want to start REPL? Run `slnode %s .` instead.',
    sample,
    cmd
  );

  var r = repl.start( { prompt: name + '> ' });
  r.context.m = moduleToDebug;
  r.on('exit', onReplExit);
}

function onReplExit() {
  console.log('\nLeaving the interactive shell (REPL).')
  process.exit();
}

function getModuleName() {
  try {
    var packageJson = require(path.join(location, 'package.json'));
    if (packageJson.name)
      return packageJson.name;
  } catch (e) {
    // ignore missing package.json
  }

  return path.basename(location);
}

function getSampleCommand() {
  var exportedSymbols = Object.keys(moduleToDebug);
  if (!exportedSymbols.length) return '';

  var sample = exportedSymbols[0];
  if (typeof(moduleToDebug[sample]) === 'function')
    sample += '()';

  return ', e.g. `m.' + sample + '`';
}
