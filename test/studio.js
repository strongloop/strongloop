'use strict';

var assert = require('assert');
var spawn = require('child_process').spawn;
var sandbox = require('./helpers/sandbox.js');
var loopbackHelpers = require('generator-loopback/test/common');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;
var studioCommand = require('../lib/commands/studio');
var debug = require('debug')('studio');
var request = require('request')

describe('studio', function() {
  before(function() {
    sandbox.reset();
  });

  before(function(done) {
    loopbackHelpers.createDummyProject(sandbox.PATH, 'test-app', done);
  });

  it('should start the studio in the sandbox', function(done) {
    this.timeout(30000);

    var child = spawn('slc', ['studio'], {
      cwd: sandbox.PATH
    });

    var allOutput = '';

    child.stderr.on('data', function(buf) {
      console.error('error => ' + buf.toString());
    });

    child.stdout.on('data', function(buf) {
      allOutput += buf.toString();
      if(~allOutput.indexOf(studioCommand.STUDIO_RUNNING_MSG)) {
        var STUDIO_URL = allOutput.match(/http\:\/\/\S+/g)[0];
        request(STUDIO_URL, function(err, res) {
          assert(!err);
          assert(res.statusCode >= 200 && res.statusCode <= 400);
          done();
        });
      }
    });

    child.on('close', function (code) {
      done(new Error('studio closed unexpectedly! code ' + code));
    });
  });
});