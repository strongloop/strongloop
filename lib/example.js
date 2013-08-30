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

function example(name) {
  name = name || 'sls-sample-app';

  console.log('Downloading loopback-sample-app into %s', name);

  var command = 'git clone --depth 1 git@github.com:strongloop/sls-sample-app.git ' + name;
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
      // XXX Install should be optional
      console.log('Installing...');
      process.chdir(name);
      install(function (err) {
        if(err) {
          loader.error(err);
        } else {
          console.log();
          console.log('Run the example app:');
          console.log('  $ cd', name.green);
          console.log('  $ slc app');
        }
      });
    } else {
      // XXX we should exit with same code
      console.error('git exited with code %s', exitCode);
    }
  });
}

