/**
 * @fileOverview
 * This file contains the code for the slc cli command 'strongops'. The main
 * function is to register users with the strongops (née NodeFly) platform in a
 * simple, low-friction (for the user) manner.
 */

// See the following to learn about 'use strict'
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
'use strict';

var strongopsReg = require('nodefly-register');
var ini = require('ini');
var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var async = require('async');
var is = require('is2');
var jsonFile = require('json-file-plus');

var timesSaved;
var whereSaved = '';
var errCode;

module.exports = exports = strongops;  // for slc's loader.js to execute the
                                       // code
exports.test = {};        // for testing

/**
 * The strongops command provides a means for developers to register for a
 * strongops account.  The command prompts users for the name, email and
 * password with defaults coming from the ~/.gitconfig and ~/.npmrc.
 * Additionally, the command take switches to skip prompting, e.g.: $ slc
 * strongops --name "Edmond Meinfelder" --email "elm@stdarg.com" --password
 * "12345678"
 * @param {Object} argv The command line command.
 * @param {Object} options The command line options via optimist.
 */
function strongops(argv, options) {
  errCode = 0;
  timesSaved = 0;
  var defaults = getDefaults();
  var overrides = getCmdLineOverrides(options);

  // get the registration information from the user, if we don't already have it
  promptUserForData(overrides, defaults, function(err, userEnteredData) {
    // now we have the information, so register the user with StrongOPs
    strongOpsRegister(userEnteredData, options, function(err, userData) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      // display the API key, AKA userKey to the user
      console.log('\nYou are now registered. Welcome to StrongOps!\n');
      handleCredentials(userData, options, function(err) {
        if (err) {
          console.error('There was an error saving your credentials:', err);
          errCode = 2;
        }

        // if we have not saved the strongops credentials, echo them out to
        // stdout if they have been saved, inform the user where.
        if (timesSaved === 0)
          displayCredentials(userData);
        else if (timesSaved > 0)
          console.log('Your StrongOps credentials were written to: %s',
                      whereSaved);

        process.exit(errCode);
      });
    });
  });
}
exports.test.cmd = strongops;

/**
 * strongOpsRegister does what you'd expect, given user data with a
 * name, email and password, registers the user with the strongops
 * platform.
 * @param {Object} userEnteredData An object containing the following string
 * properties: name, email, password.
 */
function strongOpsRegister(userEnteredData, options, cb) {
  strongopsReg.register(userEnteredData, function(err, userData) {
    var errStr;
    if (err)
      return cb('There was an error registering for StrongOps: '+
                JSON.stringify(err));

    if (!is.obj(userData))
      return cb('Error on strongops registration',userData);

    if (Object.keys(userData).length === 1 && is.nonEmptyStr(userData.message))
      return cb('There was an error on registration: '+
                JSON.stringify(userData.message));

    // remove loggedIn property - it's not needed
    if (userData && userData.hasOwnProperty('loggedIn'))
      delete userData.loggedIn;

    if (!is.nonEmptyObj(userData) || !is.nonEmptyStr(userData.userKey))
      return cb('There was an error. The server failed to return the user ' +
                  'key.\nThe data returned: '+JSON.stringify(userData));
    cb(undefined, userData);
  });
}
exports.test.strongOpsRegister = strongOpsRegister;

/**
 * handleCredentials checks the options and unless, options.nosave exists with
 * a truthy value, persists the user data depending on one fo teh following
 * options: global, local or package.
 * @param {Object} userData an object from the StrongOps platform with the user
 * data including the API key.
 * @param {Object} options An object containing the command line argument
 * options
 */
function handleCredentials(userData, options, cb) {
  // if the user does not want to persist the strongops credentials,
  // we are done
  if (options && options.nosave) return cb();

  // Errors are displayed previous, just left the CB in case it is needed later.
  persistUserData(userData, options, function(err) {
    // if we never saved the credentials, at least show them to the user once
    cb(err);
  });
}
exports.test.handleCredentials = handleCredentials;

/**
 * We display credentials in two places and I like to stay DRY.
 * @param {Object} userData An object with the StrongOps userData.
 */
function displayCredentials(userData) {
  console.log('\nAs your StrongOps credentials were not saved, here they are:');
  console.log(JSON.stringify(userData));
}
exports.test.displayCredentials = displayCredentials;

/**
 * If the file does not exist, create an empty JSON file.
 * @param {String} file The file with path.
 * @param {Function} cb The callback function.
 */
function createEmptyJsonFileIfNone(file, cb) {
  if (!is.nonEmptyStr(file))
    return cb('createEmptyJsonFile expected a filename, received: '+
              JSON.stringify(file));

  fs.exists(file, function(exists) {
    if (exists) return cb();

    fs.open(file, 'w', function(err, fd) {
      if (err) return cb(err);
      var buff = '{\n}';

      fs.write(fd, new Buffer(buff), 0, buff.length, 0, function(err) {
        if (err) return cb(err);
        fs.close(fd);
        cb();
      });
    });
  });
}
exports.test.createEmptyJsonFileIfNone = createEmptyJsonFileIfNone;

/**
 * A wrapper around the writes to persist the strongops credentials
 * to simplify the async.parallel code, which can get tedious to read.
 * We display errors here, but do not pass them on. If we can't write
 * to a file, there's not much we can do other than display the error.
 * @param {String} file The file name with path to write to.
 * @param {Object} userData The data to write to a file.
 * @param {Boolean} createIfNotThere True, if we should create the file
 * if missing and false otherwise.
 * @param {Function} cb The callback.
 */
function writeTo(file, userData, createIfNotThere, cb) {

  // for ./strongloop.json and ~/strongloop.json files
  if (createIfNotThere) {
    // create if it does not exist
    createEmptyJsonFileIfNone(file, function(err) {
      if (err) return cb('Error creating "'+file+'": '+JSON.stringify(err));

      saveCredentialsToFile(userData, file, function(err) {
        if (err) {
          return cb('Error writing to "'+file+'": '+JSON.stringify(err));
        } else {
          whereSaved += ((whereSaved.length === 0) ? '' : ', ') + file;
          timesSaved++;
        }
        return cb();
      });
    });
  } else {
    // case for package.json
    saveCredentialsToFile({strongloop: userData}, file, function(err) {
      if (err)
        console.error('Error writing to %s: %s', file, JSON.stringify(err));
      else {
        whereSaved += ((whereSaved.length === 0) ? '' : ', ') + file;
        timesSaved++;
      }
      return cb();
    });
  }
}
exports.test.writeTo = writeTo;

/**
 * Using async.parallel, persists the user data in one of three places
 * according to the options.
 * @param {Object} userData The user data to save to disk.
 * @param {Object} options The command line user options from optimist
 * @param {Function} cb The callback function.
 */
function persistUserData(userData, options, cb) {

  // if we are not saving anything exit
  if (!options.saveall && !options.local && !options.package && !options.global)
    return cb();

  var localfile = './strongloop.json';
  var packagefile = './package.json';
  var globalfile = getUserHome() + '/strongloop.json';
  var createMissingFile = true;
  var dontCreateMissingFile = false;

  async.parallel(
    [
      // write to local file
      function(cb) {
        if (!options.saveall && !options.local)
          return cb();
        writeTo(localfile, userData, createMissingFile, cb);
      },

      // update to the local package file, if present
      function(cb) {
        if (!options.saveall && !options.package)
          return cb();
        writeTo(packagefile, userData, dontCreateMissingFile, cb);
      },

      // write to the global file
      function(cb) {
        if (!options.saveall && !options.global)
          return cb();
        writeTo(globalfile, userData, createMissingFile, cb);
      }
    ],

    // error handler, and finished handler too
    function(err) { cb(err); }
  );
}
exports.test.persistUserData = persistUserData;

/**
 * Save the user credentials to a file
 * @param {Object} data The user data to save to a file.
 * @param {String} file The file with path.
 * @param {Function} cb The callback function.
 */
function saveCredentialsToFile(data, file, cb) {
  fs.exists(file, function(exists) {
    if (!exists) {
      console.error('The file', file, 'does not exist.');
      return cb('The file '+file+' does not exist.');
    }
    jsonFile(file, function (err, fileObj) {
      if (err) return cb(err);

      fileObj.set(data);
      fileObj.save(file, function(err) {
        return cb(err);
      });
    });
  });
}
exports.test.saveCredentialsToFile = saveCredentialsToFile;

/**
 * Using the prompt module, interactively query users for name, email and a
 * password to use as credentials for the strongops platform.
 * @param {Object} data A set of defaults, if any (from .gitconfig or .npmrc)
 * @param {Function} cb A callback, because prompt is asynchronous.
 */
function promptUserForData(overrides, defaults, cb) {
  prompt.override = overrides;
  prompt.message = 'Please enter your';

  // overwrite defaults with overrides
  for (var prop in overrides)
    defaults[prop] = overrides[prop];

  // The prompt schema describes the data we need the user to enter.
  var promptSchema = getPromptSchema(defaults);
  var result;     // storage from prompt results, so different parts of 
                  //   asynch.whilst can use
  var count = 0;  // limit the number of re-tries for entering a password to 3

  // do whilst performs the function and then the test and repeats so long
  // as the test function returns true
  async.doWhilst(
    // function to execute repeatedly until test is false
    function(cb) {
      prompt.start();   // create event to start the prompting
      // Get 3 properties from the user: email, password, and user name
      prompt.get(promptSchema, function (err, resultObj) {
        result = resultObj; // store results in outter function scope
        cb(err, result);    // we're done, go to last function in async.whilst()
      });
    },

    // the test to decide if we need to continue
    function() {

      // handle edgecase where command line can be a number
      // when we need a string
      if (is.number(result.password))
        result.password = result.password.toString();
      if (is.number(result.password2))
        result.password2 = result.password2.toString();

      // do the password and its confirmation match?
      if (result.password !== result.password2) {
        // if the user can't get it in 3 tries, give up
        if (++count > 3) {
          console.error('Giving up after 3 re-tries to enter a password and '+
                        'matching confirmation.');
          return false;
        }
        if (result.password) delete result.password;
        if (result.password2) delete result.password2;
        prompt.override = result;
        console.error('The password does not match its confirmation. '+
                      'Please try again.');
        return true;
      }
      return false;
    },

    // error handler, also triggers when test condition is false
    // we do the handling in the calling function's callback, though
    function(err) {
      // remove the 2nd password - it's only for confirmation
      if (result && result.password2) delete result.password2;
      cb(err, result);
    }
  );
}
exports.test.promptUserForData = promptUserForData;

/**
 * Get the command lines options for user name, email and password from the 
 * command line and place them in an overrides structure.
 */
function getCmdLineOverrides(options) {
  if (!is.nonEmptyObject(options))
    return {};

  var overrides = {};
  if (is.nonEmptyStr(options.name))
    overrides.name = options.name;

  if (is.nonEmptyStr(options.email))
    overrides.email = options.email;

  // the only way to get a default email is on the command line
  if (options && options.password) {
    overrides.password = options.password;
    overrides.password2 = options.password;
  }

  return overrides;
}
exports.test.getCmdLineOverrides = getCmdLineOverrides;

/**
 * Using argv options from optimist and the gitconfig & npm rc files, gather
 * up default options. Note password can only be set on the command line.
 * @returns {Object} conatining defaults for the user, name and password.
 */
function getDefaults() {

  var git = getGitConfigInfo();   // get git config info
  var npmEmail = getNpmEmail();   // get email from npmrc
  var defaults = {};

  // user data on command trumps data in gitconfig
  if (is.nonEmptyObj(git) && is.nonEmptyStr(git.name))
    defaults.name = git.name;

  // email entry on command trumps data in gitconfig
  // and gitconfig email trump npmrc email
  if (is.nonEmptyObj(git) && is.nonEmptyStr(git.email))
    defaults.email = git.email;
  else if (is.nonEmptyStr(npmEmail))
    defaults.email = npmEmail;

  return defaults;
}
exports.test.getDefaults = getDefaults;

/**
 * Get the path to the user's home directory in a platform independent way.
 * @returns {String} The path to the user's home directory.
 */
function getUserHome() {
  // if running under Jenkins to set HOME into test and grab
  // values from there
  if (process.env.JENKINS_HOME || process.env.SLC_TEST) {
    return path.join(process.cwd(), 'test');
  }
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}
exports.test.getUserHome = getUserHome;

/**
 * Get user name and email from .gitconfig, if possible.
 * @returns {Object} An object with the name and email from .gitconfig if
 * possible if nothing is found an empty object is returned.
 */
function getGitConfigInfo() {
  var gitConfigPath = path.resolve(getUserHome(), '.gitconfig');
  var gitconfig = false;
  var data = getFileSync(gitConfigPath);

  if (data !== false) gitconfig = ini.parse(data);

  var obj = {};
  if (gitconfig && gitconfig.user && typeof gitconfig.user.name === 'string')
    obj.name = gitconfig.user.name;
  if (gitconfig && gitconfig.user && typeof gitconfig.user.email === 'string')
    obj.email = gitconfig.user.email;

  return obj;
}
exports.test.getGitConfigInfo = getGitConfigInfo;

/**
 * Get email from ~/.npmrc if possible.
 * @returns {String|Undefined} The email address from .npmrc or undefined, if
 * none
 */
function getNpmEmail() {
  var npmrcPath = path.resolve(getUserHome(), '.npmrc');
  var data = getFileSync(npmrcPath);
  if (!data) return undefined;
  var npmrc = ini.parse(data);
  if (npmrc && npmrc.email)
    return npmrc.email;
  return undefined;
}
exports.test.getNpmEmail = getNpmEmail;

/**
 * A convenience function to return the schema for the prompt data.
 * @param {Object} defaults An object containing default values for prompts
 * @returns {Object} A schema describing the data that we need from the user.
 */
function getPromptSchema(defaults) {

  // The prompt schema describes the data we need the user to enter.
  var promptSchema = {
    properties: {
      name: {
        description: 'full name ',
        type: 'string',
        default: defaults.name,
        pattern: /^[a-zA-Z\s\-\.]+$/,
        message: 'A name may only have letters, spaces, periods and dashes.',
        required: true
      },
      email: {
        description: 'email address',
        type: 'string',
        default: defaults.email,
        pattern: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
        message: 'An email must be a valid address, qualified with a domain.',
        required: true
      },
      password: {
        description: 'password',
        pattern: /^[A-Za-z0-9!@#%&\/(){}\[\]=?+*^~\-_\.:,;]{8,64}$/,
        message: 'A password must be at least 8 characters.',
        hidden: true,
        required: true
      },
      password2: {
        description: 'password again for confirmation',
        pattern: /^[A-Za-z0-9!@#%&\/(){}\[\]=?+*^~\-_\.:,;]{8,64}$/,
        message: 'A password must be at least 8 characters.',
        hidden: true,
        required: true
      }
    }
  };

  return promptSchema;
}
exports.test.getPromptSchema = getPromptSchema;

/**
 * Read a file into a buffer using fs.readFileSync will catch in eth case the
 * file does not exist and returns false when there is no file (or it can't be
 * read) and a string with the file contents otherwise.
 * @param {String} filename a file name with path information.
 * @returns {Boolean|String} false if the file can't be read or a buffer with
 * the file contents otherwise
 */
function getFileSync(filename) {
  var data = false;

  // readFileSync throws, we must catch. :(
  try {
    data = fs.readFileSync(filename, 'utf-8');
  } catch(err) { }

  return data;
}
exports.test.getFileSync = getFileSync;
