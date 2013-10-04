/*global describe, it, beforeEach */
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;

describe('create cli', function() {
  this.timeout(5000);

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
    this.timeout(60000);
    spawnCliInSandbox(['create', 'cli', 'test-app'])
      .run(function(err, stdout, code) {
        if (err) done(err);
        assert.equal(code, 0);
        checkDependencyExists('test-app', 'commander', done);
      });
  });

  it('installs into nested path', function (done) {
    spawnCliInSandbox(['create', 'cli', 'path/to/test-app'])
      .run(function(err, stdout, code) {
        if (err) done(err);
        assert.equal(code, 0);
        var packageMeta = parsePackageJsonOf('path/to/test-app');
        expect(packageMeta.name).to.equal('test-app');
        checkDependencyExists('path/to/test-app', 'commander', done);
      });
  });

  it('fails with no name argument', function (done) {
    createFailsWithNoNameArgument('cli', done);
  });
});

describe('create web', function() {
  beforeEach(sandbox.reset);

  it('sets "main" entry in package.json', function (done) {
    spawnCliInSandbox(['create', 'web', 'test-app', '--no-install'])
      .run(function(err, stdout, code) {
        if (err) return done(err);
        assert.equal(code, 0);
        var packageMeta = parsePackageJsonOf('test-app');
        expect(packageMeta.main).to.equal('app.js');
        done();
      });
  });

  it('fails with no name argument', function (done) {
    createFailsWithNoNameArgument('web', done);
  });
});

describe('create package', function() {
  beforeEach(sandbox.reset);

  it('fails with no name argument', function (done) {
    createFailsWithNoNameArgument('package', done);
  });
});

describe('create module', function() {
  beforeEach(sandbox.reset);

  it('fails with no name argument', function (done) {
    createFailsWithNoNameArgument('module', done);
  });

  it('creates somemodule', function (done) {
    spawnCliInSandbox(['create', 'module', 'somemodule'])
      .run(function(err, stdout, code) {
        console.log(arguments);
        if (err) return done(err);

        assert.equal(code, 0);

        var modulePath = sandbox.path('lib/somemodule.js');
        var moduleExport = require(modulePath);
        assert(moduleExport.create);
        assert(moduleExport.createSomemodule);
        assert.equal(moduleExport.create, moduleExport.createSomemodule);
        assert(new moduleExport());
        assert(moduleExport.create().myMethod);
        done();
      });
  });
});

describe('create', function() {
  beforeEach(sandbox.reset);

  it('fails with no type argument', function (done) {
    assertFailsToRun(['--no-install', 'create'], done);
  });

  it('fails with invalid type argument', function (done) {
    createFailsWithNoNameArgument('NO_SUCH_NAME', done);
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

function createFailsWithNoNameArgument(type, done) {
    assertFailsToRun(['create', '--no-install', type], function(err, stdout) {
      assert.equal(stdout.length, 0);
      done();
    });
}

function assertFailsToRun(args, done) {
  return spawnCliInSandbox(args)
  .run(function(err, stdout, code) {
    if (err) done(err);
    assert.equal(code, 1);
    done(err, stdout, code);
  });
}
