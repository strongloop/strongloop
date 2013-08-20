var assert = require('assert');
var is = require('is2');
var strops = require('../lib/commands/strongops');
var test = require('./config').strongops;

describe('getNpmEmail', function() {
  it('Should return the email string from ~/.npmrc', function() {
    assert.equal(test.getNpmEmail, strops.test.getNpmEmail());
  });
});

describe('getGitConfigInfo', function() {
  it('Should return the user name and email string from ~/.gitconfig', function() {
    var git = strops.test.getGitConfigInfo();
    assert.deepEqual(git, strops.test.getGitConfigInfo());
  });
});

describe('getUserHome', function() {
  it('Should return the home directory for the user', function() {
    assert.equal(test.getUserHome, strops.test.getUserHome());
  });
});

// FIXME: make another test with a config, to test .npmrc email retrieval
describe('getDefaults', function() {
  it('Should get the defaults from ~/.gitconfig and possibly ~/.npmrc', function() {
    assert.deepEqual(test.getDefaults, strops.test.getDefaults());
  });
});

describe('getCmdLineOverrides', function() {
  it('Given an empty options object, should an empty object', function() {
    assert.deepEqual({}, strops.test.getCmdLineOverrides());
  });
});

describe('getCmdLineOverrides', function() {
  it('Given an options with a name property, should an object with a name property', function() {
    var options = { name: 'E. Meinfelder' };
    assert.deepEqual({ name: 'E. Meinfelder' }, strops.test.getCmdLineOverrides(options));
  });
});

describe('getCmdLineOverrides', function() {
  it('Given options with an email property, should an object with an email property', function() {
    var options = { email: 'e@e.com' };
    assert.deepEqual({ email: 'e@e.com' }, strops.test.getCmdLineOverrides(options));
  });
});

describe('getCmdLineOverrides', function() {
  it('Given options with a password property, should an object with a password and password2 properties', function() {
    var options = { password: '12345678' };
    var expected = { password: '12345678', password2: '12345678' };
    assert.deepEqual(expected, strops.test.getCmdLineOverrides(options));
  });
});

describe('getCmdLineOverrides', function() {
  it('Given options with a name, email & password, should an object with name, email, password and password2 properties', function() {
    var options = {
      name: 'Monkey',
      email: 'monkey@monkey.com',
      password: '12345678' };
    var expected = {
      name: 'Monkey',
      email: 'monkey@monkey.com',
      password: '12345678',
      password2: '12345678' };
    assert.deepEqual(expected, strops.test.getCmdLineOverrides(options));
  });
});

describe('getCmdLineOverrides', function() {
  it('Given options with an email property, should an object with an email property', function() {
    var options = { email: 'e@e.com' };
    assert.deepEqual({ email: 'e@e.com' }, strops.test.getCmdLineOverrides(options));
  });
});

describe('getFileSync', function() {
  it('Should return false when getting a file that is not present.', function() {
    assert.ok(strops.test.getFileSync('./dhsjdhjhdjdww78783') === false);
  });
});

describe('getFileSync', function() {
  it('Should return the contents of a file when file is present.', function() {
    //console.log('getFileSync:', test.getFileSync);
    assert.ok(is.nonEmptyStr(strops.test.getFileSync(test.getFileSync)) === true);
  });
});

