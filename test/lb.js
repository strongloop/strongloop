/*global describe, it, beforeEach */
'use strict';

var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var runner = require('./helpers/runner.js');
var spawnCliInSandbox = runner.spawnCliInSandbox;
var spawnCli = runner.spawnCli;

describe('lb workspace', function() {
  beforeEach(sandbox.reset);

  it('creates an empty workspace dir', function(done) {
    spawnCliInSandbox(['lb', 'workspace', 'test-workspace'])
      .run(function(err) {
        if (err) return done(err);
        var files = fs.readdirSync(sandbox.path('test-workspace'));
        expect(files).to.be.empty;
        done();
      });
  });
  it('defaults to loopback-workspace without a name argument', function(done) {
    spawnCliInSandbox(['lb', 'workspace'])
      .run(function(err) {
        if (err) return done(err);
        var files = fs.readdirSync(sandbox.path('loopback-workspace'));
        expect(files).to.be.empty;
        done();
      });
  });
});

describe('lb project', function() {
  beforeEach(sandbox.reset);

  it('creates a loopback project', function(done) {
    createProject('test-project', done);
  });
  it('fails without a name argument', function(done) {
    assertFailsWithoutName('project', done);
  });
});

describe('lb model', function() {
  beforeEach(sandbox.reset);
  
  it('creates a loopback model', function(done) {
    createModel('test-model-project', 'test-model', done);
  });
  it('fails without a name argument', function(done) {
    assertFailsWithoutName('model', done);
  });
});

function createProject(projectName, done) {
  spawnCliInSandbox(['lb', 'project', projectName])
    .run(function(err) {
      if (err) return done(err);
      var rootFiles = fs.readdirSync(sandbox.path(projectName));
      expect(rootFiles).to.eql(['app.js', 'modules', 'package.json']);
      var modules = fs.readdirSync(sandbox.path(projectName, 'modules'));
      expect(modules).to.eql(['app', 'db', 'docs']);
      done();
    });
}

function createModel(projectName, modelName, done) {
  createProject(projectName, function(err) {
    if(err) return done(err);

    spawnCli(['lb', 'model', modelName], sandbox.path(projectName))
      .run(function(err) {
        if (err) return done(err);
        var modelFiles = fs.readdirSync(sandbox.path(projectName, 'modules', modelName));
        expect(modelFiles).to.eql(
          ['config.json', 'index.js', 'module.json', 'properties.json']
        );
        done();
      });
  });
}

function assertFailsWithoutName(cmd, done) {
  assertFailsToRun(['lb', cmd], function(err, stdout) {
    if(err) return done(err);
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
