/*global describe, it, beforeEach */
'use strict';

var assert = require('assert');
var async = require('async');
var fs = require('fs');
var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var runner = require('./helpers/runner.js');
var spawnCliInSandbox = runner.spawnCliInSandbox;
var spawnCli = runner.spawnCli;
var Project = require('loopback-workspace').models.Project;

describe('lb', function() {
  this.timeout(10000);

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

  describe('lb help', function () {
    it('should be consistent with slc help', function (done) {
      spawnCli(['lb', 'help'], process.cwd())
        .run(function(err, stdout, code) {
          assert.equal(code, 0);
          var output = stdout.join('\n');
          assert(output.indexOf('C\bCO\bOM\bMM\bMA\bAN\bND\bDS\bS') !== -1);
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

  describe('lb datasource', function() {
    beforeEach(sandbox.reset);
    
    it('creates a loopback datasource', function(done) {
      createDataSource('test-ds-project', 'test-ds', 'mongodb', done);
    });
    it('fails without a name argument', function(done) {
      assertFailsWithoutName('datasource', done);
    });
    it('fails without a connector argument', function(done) {
      var projectName = 'test-ds-project';
      var dataSourceName = 'test-ds';
      async.waterfall([
        createDataSource.bind(null, projectName, dataSourceName, ''),
        function(stdout, code, callback) {
          assert(code > 0);
          callback();
        },
        Project.loadFromFiles.bind(Project, sandbox.path(projectName)),
        function(project, cb) {
          project.getDataSourceByName(dataSourceName, cb);
        },
        function(ds, cb) {
          assert(!ds, 'datasource should not be created');
          cb();
        }
      ], done);
    });
  });
});

function createProject(projectName, done) {
  spawnCliInSandbox(['lb', 'project', projectName])
    .run(function(err) {
      if (err) return done(err);
      var rootFiles = fs.readdirSync(sandbox.path(projectName)).sort();
      expect(rootFiles).to.eql([
        'app.js', 'models', 'package.json', 'models.json',
        'datasources.json', 'app.json'
      ].sort());
      done();
    });
}

function createModel(projectName, modelName, done) {
  createProject(projectName, function(err) {
    if(err) return done(err);

    spawnCli(['lb', 'model', modelName], sandbox.path(projectName))
      .run(function(err) {
        if (err) return done(err);
        done();
      });
  });
}

function createDataSource(projectName, dsName, connectorName, done) {
  createProject(projectName, function(err) {
    if(err) return done(err);

    spawnCli(['lb', 'datasource', dsName, '--connector', connectorName], sandbox.path(projectName))
      .run(function(err, stdout, code) {
        if (err) return done(err);
        if(connectorName) assert.equal(code, 0);
        done(err, stdout, code);
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
