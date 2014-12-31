/*global describe, it, beforeEach */
'use strict';

var chai = require('chai');
chai.use(require('chai-fs'));
chai.use(require('chai-json-schema'));
var assert = chai.assert;
var async = require('async');
var fs = require('fs');
var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var runner = require('./helpers/runner.js');
var spawnCliInSandbox = runner.spawnCliInSandbox;
var spawnCli = runner.spawnCli;
var Project = require('loopback-workspace').models.Project;

describe('lb', function() {
  // bump timeout
  this.timeout(60000);

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
          assert.ifError(err, 'should not error');
          assert.equal(code, 0);
          var output = stdout.join('\n');
          if (process.platform === 'win32') {
            assert(output.indexOf('COMMANDS') !== -1);
          } else {
            assert(output.indexOf('C\bCO\bOM\bMM\bMA\bAN\bND\bDS\bS') !== -1);
          }
          done();
        });
    });
  });

  describe('lb project', function() {
    beforeEach(sandbox.reset);

    it('creates a loopback project', function(done) {
      // 45 seconds for project install has been observed on dev machine, I will
      // allow ten times this for CI
      this.timeout(10 * 45 * 1000);

      createProject('test-project', done, true);
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
    it('creates a loopback datasource without a connector argument', function(done) {
      createDataSource('test-ds-project', 'test-ds', null, done);
    });
    it('fails without a name argument', function(done) {
      assertFailsWithoutName('datasource', done);
    });
  });

  describe('lb acl', function() {
    beforeEach(sandbox.reset);

    it('should add an acl to the model', function (done) {
      var projectName = 'test-acl-project';
      var modelName = 'test-model';
      createModel(projectName, modelName, function() {
        spawnCli(
          ['lb', 'acl',
          '--everyone',
          '--model', modelName,
          '--method', 'create',
          '--deny'],
          sandbox.path(projectName)
        ).run(function(err) {
          if(err) return done(err);

          var path = sandbox.path(projectName, 'models.json');
          expect(path).to.be.a.file().using.json.schema({
            "properties": {
              "test-model": {
                "type": "object",
                "minItems": 1,
                "uniqueItems": true,
                "items": {
                  "type": "object"
                }
              }
            }
          });

          var json = fileAsJSON(path);

          expect(json['test-model'].options.acls[0]).to.eql({
            principalType: 'ROLE',
            principalId: '$everyone',
            property: 'create',
            permission: 'DENY',
            accessType: '*'
          });

          done();
        });
      });
    });
  });
});

function createProject(projectName, done, install) {
  var installOption = install ? '--install' : '--no-install';
  spawnCliInSandbox(['lb', 'project', projectName, installOption])
    .run(function(err) {
      if (err) return done(err);
      var rootFiles = fs.readdirSync(sandbox.path(projectName)).sort();
      // node_modules exist only if project is installed
      var expectFiles = [
        'app.js', 'models', 'package.json', 'models.json',
        'datasources.json', 'app.json'
      ];
      if(install) {
        expectFiles.push('node_modules');
      }
      expect(rootFiles).to.eql(expectFiles.sort());
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

    var args = ['lb', 'datasource', dsName];
    if(connectorName) {
      args.push('--connector', connectorName);
    }
    spawnCli(args, sandbox.path(projectName))
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

function fileAsJSON(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}
