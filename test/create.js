/*global describe, it, beforeEach */
'use strict';

var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;

describe('create cli', function() {
  beforeEach(sandbox.reset);

  it('sets "main" entry in package.json', function (done) {
    spawnCliInSandbox(['create', 'cli', 'test-app', '--no-install'])
      .run(function(err) {
        if (err) return done(err);
        var packageMeta = parsePackageJsonOf('test-app');
        expect(packageMeta.main).to.equal('./bin/test-app');
        expect(packageMeta.name).to.equal('test-app');
        done();
      });
  });

  it('installs dependencies', function (done) {
    spawnCliInSandbox(['create', 'cli', 'test-app'])
      .run(function(err) {
        if (err) done(err);
        checkDependencyExists('test-app', 'commander', done);
      });
  });

  it('installs into nested path', function (done) {
    spawnCliInSandbox(['create', 'cli', 'path/to/test-app'])
      .run(function(err) {
        if (err) done(err);
        var packageMeta = parsePackageJsonOf('path/to/test-app');
        expect(packageMeta.name).to.equal('test-app');
        checkDependencyExists('path/to/test-app', 'commander', done);
      });
  });
});

describe('create web', function() {
  beforeEach(sandbox.reset);

  it('sets "main" entry in package.json', function (done) {
    spawnCliInSandbox(['create', 'web', 'test-app', '--no-install'])
      .run(function(err) {
        if (err) return done(err);
        var packageMeta = parsePackageJsonOf('test-app');
        expect(packageMeta.main).to.equal('app.js');
        done();
      });
  });
});

function parsePackageJsonOf(appName) {
  var packageJson = sandbox.path(appName, 'package.json');
  var content = fs.readFileSync(packageJson, { enc: 'utf-8' });
  return JSON.parse(content);
}

function checkDependencyExists(pkg, dependency, cb) {
  fs.stat(sandbox.path(pkg, 'node_modules', dependency, 'package.json'), cb);
}
