// example - create an example project
//
// Projects are cloned from github. A mechanism that did not depend on the
// existence of git on the developer's machine would be preferable, such as the
// template-based approach used by `slc create`.

module.exports = example;

var colors = require('colors');
var debug = require('debug')('slc');
var install = require('./install');
var spawn = require('child_process').spawn;

function example(argv, options, loader, type, repo, name) {
  console.log('Downloading %s example into %s', type, name);

  var command = 'git clone --depth 1 git@github.com:strongloop/' + repo + '.git ' + name;
  var git;

  // XXX git should be --quiet
  if(process.platform === 'win32') {
    git = spawn('cmd.exe', ['/c', command], {stdio: [0,1,2]});
  } else {
    git = spawn('/bin/sh', ['-c', command], {stdio: [0,1,2]});
  }

  git.once('error', function (err) {
    debug('git spawn errored with', err);
    switch(err.code) {
      case 128:
        loader.error(err.message);
      break;
      default:
        loader.error('An unknown error occured:\n' + err.message);
      break;
    }
  });

  git.once('exit', function (exitCode, signal) {
    if(exitCode === 0) {
      if(options.install === false) {
        return promptToRun(null, true);
      }
      console.log('Installing...');
      process.chdir(name);
      install(promptToRun);
    } else {
      console.error('git exited with code %s', exitCode);
      process.exit(exitCode);
    }
  });

  function promptToRun(err, needsInstall) {
    if(err) {
      loader.error(err);
    } else {
      console.log();
      console.log('Run the example:');
      console.log('  $ cd', name.green);
      if(needsInstall) {
        console.log('  $ slc npm install');
      }
      console.log('  $ slc run .');
    }
  }
}
