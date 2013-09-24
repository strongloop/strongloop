/*global describe, it, beforeEach */
'use strict';

var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;
var startRegistryMock = require('npm-registry-mock');

var REGISTRY_PORT = 1331;
var A_TARBALL_URL = 'http://localhost:1331/underscore/-/underscore-1.3.1.tgz';

describe('install', function() {
  this.timeout(10000);
  beforeEach(sandbox.reset);
  beforeEach(setupProjectInSandbox);

  it('resolves version range using data from all registries', function(done) {
    spawnCliInSandbox(['install', 'async@>=0.1.22 <0.2.0'])
      .run(function(err, stdout, code) {
        if (err) done(err);
        expect(code, 'exitcode').to.equal(0);
        done();
      });
  });

  it('supports tarball URLs', function(done) {
    startRegistryMock(REGISTRY_PORT, function() {
      spawnCliInSandbox(['install', A_TARBALL_URL])
        .run(function(err, stdout, code) {
          if (err) done(err);
          expect(code, 'exitcode').to.equal(0);
          done();
        });
    });
  });
});

function setupProjectInSandbox(next) {
  fs.mkdir(sandbox.path('node_modules'), next);
}
