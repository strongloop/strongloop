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
        if (err) done(err);
        var packageMeta = parsePackageJsonOf('test-app');
        expect(packageMeta.main).to.equal('./bin/test-app');
        done();
      });
  });
});

describe('create web', function() {
  beforeEach(sandbox.reset);

  it('sets "main" entry in package.json', function (done) {
    spawnCliInSandbox(['create', 'web', 'test-app', '--no-install'])
      .run(function(err) {
        if (err) done(err);
        var packageMeta = parsePackageJsonOf('test-app');
        expect(packageMeta.main).to.equal('app.js');
        done();
      });
  });
});

function parsePackageJsonOf(appName) {
  var packageJson = path.join(sandbox.PATH, appName, 'package.json');
  var content = fs.readFileSync(packageJson, { enc: 'utf-8' });
  return JSON.parse(content);
}

