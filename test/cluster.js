'use strict';

var control = require('strong-cluster-control');
var sandbox = require('./helpers/sandbox');
var spawnCliInCwd = require('./helpers/runner').spawnCliInCwd;

describe('cluster control cli', function() {
  beforeEach(sandbox.reset);

  it('returns status from master', function (done) {
    control.start(thenGetStatus);

    function thenGetStatus() {
      spawnCliInCwd(['clusterctl', 'status'])
      .expect('worker count: 0')
      .run(function(err) {
        if (err) return done(err);
        done();
      });
    }
  });

  afterEach(function(done) {
    control.stop(done);
  });
});
