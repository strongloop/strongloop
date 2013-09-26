'use strict';

var assert = require('assert');
var fs = require('fs');

var sandbox = require('./helpers/sandbox.js');
var spawnCliInSandbox = require('./helpers/runner.js').spawnCliInSandbox;

describe('suite example', function() {
  this.timeout(60000);

  before(function(done) {
    sandbox.reset();
    spawnCliInSandbox(['example', 'suite', '--no-install'])
      .run(done);
  });

  it('does not leave a .git folder', function () {
    var dotGit = sandbox.path('sls-sample-app', '.git', 'config');
    assert(!fs.existsSync(dotGit));
  });
});
