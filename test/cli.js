var assert = require('assert');
var debug = require('debug')('cli');
var exec = require('child_process').exec;
var fs = require('fs.extra');
var path = require('path');

// cli spawns itself as a child process... this is quite sucky, not sure why it
// doesn't do require('npm').install(), but anyhow, it means we must put our own
// bin/ folder at the beginning of the path.
process.env.PATH = path.resolve('./bin') + path.delimiter + process.env.PATH;

debug('PATH:', process.env.PATH);

var CLI = 'slnode';

function cli(args) {
  return CLI + ' ' + args;
}

function assertRunOk(cmd, callback) {
  debug('exec cmd:', cmd);

  var child = exec(cmd, function(err, stdout, stderr) {
    debug('exec cmd returned: exit=', child.exitCode, err, stdout, stderr);
    if(err) throw err;
    assert.equal(child.exitCode, 0, 'cmd exits with ok');
    assert.equal(stderr, '', 'cmd exits with ok');
    return callback(err, stdout, stderr);
  });
  return child;
}

describe('cli create', function() {
  beforeEach(function() {
    fs.rmrfSync('out-web');
  });

  it('should create web with name', function(done) {
    assertRunOk(cli('create web out-web'), done);
  });
});

describe('cli', function() {
  it('should print usage when called with no arguments', function(done) {
    assertRunOk(cli(''), function(err, stdout, stderr) {
      assert(new RegExp('Usage: ' + CLI).test(stdout));
      return done();
    });
  });
});
