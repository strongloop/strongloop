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
  console.log('Creating %s example in %s (this may take a moment)', type, name);

  // URL schemes:
  //
  // git@github.com URLs require a github account and ssh credentials
  //
  // var url = 'http://github.com/strongloop/' + repo + '.git';
  //
  // http and https URLs work best, but git will prompt for a password for
  // the sls-sample-app until it is made public at launch.
  //
  // git protocol is inherently read-only, so also seems to work well, but
  // not with the private sls-sample-app
  //
  // Note the following undocumented feature for SL developers:
  //
  //    slc example suite --protocol=http

  var protocol = options.protocol || 'http';
  var url = protocol + '://github.com/strongloop/' + repo + '.git';
  var command = 'git clone --quiet --depth 1 ' + url + ' ' + name;

  if(process.platform === 'win32') {
    var git = spawn('cmd.exe', ['/c', command], {stdio: [0,1,2]});
  } else {
    var git = spawn('/bin/sh', ['-c', command], {stdio: [0,1,2]});
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
      console.error('git exited with code %s (`%s`)', exitCode, command);
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
