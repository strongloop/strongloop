/*global describe, it, beforeEach */
'use strict';

var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;
var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;

describe('install', function() {
  this.timeout(10000);
  beforeEach(sandbox.reset);

  it('resolves version range using data from all registries', function(done) {
    fs.mkdirSync(path.join(sandbox.PATH, 'node_modules'));
    spawnCliInSandbox(['install', 'async@>=0.1.22 <0.2.0'])
      .run(function(err, stdout, code) {
        if (err) done(err);
        expect(code, 'exitcode').to.equal(0);
        done();
      });
  });
});

