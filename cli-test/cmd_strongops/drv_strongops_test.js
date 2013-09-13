/**
 * @fileOverview
 * This script handles testing an interactive prompt using a child process
 * and streams. This is a first-cut, to see how it works If it works well,
 * we can parameterize the inputs making it re-usable.
 *
 * Here, we are tesing the 'slc strongops' command.
 */
var expectedResultSeen = false;
var spawn = require('child_process').spawn;
var fs = require('fs');
var is = require('is2');
var async = require('async');
var util = require('util');

// ensure the strings object is at least somewhat valid
var strings = require('./config').strings;   // strings with the prompts to look for

// make some convenience references
var output;
var input;
var expected;
var email;

// logic flow must be in global scope.
var prompt;
var ecount;
var debug = process.env.DEBUG;
var childShellExitTimeOut = 10000;  // 10 seconds

main();

/**
 * Drives the execution of the tests, runs pPCond to handle pre and post
 * conditions (clean up of files).
 *
 * On Success, the process exits with code 0.
 * On Fileure, the process exist with code 8888.
 */
function main() {
  // run each of the tests serially
  async.series([pPCond, testReg, pPCond, testLogin, pPCond], function(err, results) {
    if (err) {
      console.error('Error: '+util.inspect(err));
      process.exit(8888);
    }

    for (var i=0;i<results.length; ++i) {
      if (results[i]) console.log(results[i]);
    }

    process.exit(0);
  });
}

/**
 * Handle pre & post-conditions for tests.
 * @param {Function} cb Callback of type cb(Error)
 */
function pPCond(cb) {
  var files = [ './strongloop.json', './file.txt' ];

  for (var i=0; i<files.length; ++i)
    if (fs.existsSync(files[i]))  fs.unlink(files[i]);

  cb();
}

/**
 * Do a simple test of registration.
 * @param {Function} cb Callback of type cb(Error)
 */
function testReg(cb) {

  // set expected values for I/O
  prompts = strings.testReg.prompts;
  input = strings.testReg.input;
  expected = strings.testReg.expected;
  email = Date.now().toString()+input.email;
  ecount = 0;

  var fname = arguments.callee.name;  // this function's name

  // create the child process that runs the slc strongops command
  prompt  = spawn('/usr/bin/env', ['slc', 'strongops', '--register',
                  '--nocolors']);

  // handle data events on the child process's stdout stream
  // specifically, we are looking for the prompts, so we can respond
  prompt.stdout.on('data', handleStdOut);

  // display any errors - we don't expect any, but there you go.
  prompt.stderr.on('data', handleStdErr);

  var alreadyExited = false;

  // The close event occurs when the child process exits
  prompt.on('close', function(code) {
    if (alreadyExited) return;
    if (expectedResultSeen)
      cb(null, fname+': Success');
    else
      cb(new Error(fname+': Failure'));
  });

  // Needed, slc does not exit the sub-shell. :(
  setTimeout(function() {
    if (debug)
      console.error('Timeout, child process did not close.');
    alreadyExited = true;
    if (expectedResultSeen)
      cb(null, fname+': Success');
    else
      cb(new Error(fname+': Failure'));
  }, childShellExitTimeOut);
}

/**
 * Do a simple login test.
 * @param {Function} cb Callback of type cb(Error)
 */
function testLogin(cb) {

  // set expected values for I/O
  prompts = strings.testLogin.prompts;
  input = strings.testLogin.input;
  expected = strings.testLogin.expected;
  // re-use same email as before
  ecount = 0;

  var fname = arguments.callee.name;  // this function's name

  // create the child process that runs the slc strongops command
  prompt  = spawn('/usr/bin/env', ['slc', 'strongops', '--nocolors']);

  // handle data events on the child process's stdout stream
  // specifically, we are looking for the prompts, so we can respond
  prompt.stdout.on('data', handleStdOut);

  // display any errors - we don't expect any, but there you go.
  prompt.stderr.on('data', handleStdErr);

  var alreadyExited = false;

  // the close event occurs when the child process exits
  prompt.on('close', function(code) {
    if (alreadyExited) return;
    if (expectedResultSeen)
      cb(null, fname+': Success');
    else
      cb(new Error(fname+': Failure'));
  });

  // Needed, slc does not exit the sub-shell. :(
  setTimeout(function() {
    if (debug)
      console.error('Timeout, child process did not close.');
    alreadyExited = true;
    if (expectedResultSeen)
      cb(null, fname+': Success');
    else
      cb(new Error(fname+': Failure'));
  }, childShellExitTimeOut);
}

/**
 * Handle the standard error output from the child process.
 * @param {Buffer} data A node.js buffer containing the stderr text
 */
function handleStdErr(data) {
  if (debug) console.error('stderr: ' + data);
}

/**
 * Handle the standard output text from the child process.
 * @param {Buffer} data a node.js buffer with the output text
 */
function handleStdOut(data) {

  if (debug) fs.writeFileSync('file.txt', data);

  // data is a node.js buffer, it's not a String object. Let's convert to a
  // string.
  data = data.toString();

  // If you want to see what is happening, uncomment the next line
  if (debug) process.stdout.write(data);

  // does this input match any of the expected inputs?
  // for each expected string, give the correct input
  switch (true) {
  case prompts.namePrompt.test(data):
    respond(input.name);
    break;
  case prompts.emailPrompt.test(data):
    respond(email);
    break;
  case prompts.passwordPrompt.test(data):
    respond(input.password);
    break;
  case prompts.password2Prompt.test(data):
    respond(input.password);
    break;
  default:
    var lines = data.split('\n');

    for (var i=0; i<lines.length; i++) {

      // ignore empty lines
      if (lines[i] === '') continue;
      // Here we match the expected output 1 line at a time.
      // A line is what is output by the command and it may contain '/n'

      // This is a bit tricky:
      // Each time we match a line, incremement the counter,
      if (lines[i].match(expected[ecount])) {

        // If we are at the LAST expected line and the text is valid
        // then mark the global, expectedResultSeen, as true
        if (++ecount === expected.length) {
          if (fs.existsSync('./strongloop.json') &&
              isValid(require('./strongloop.json'))) {
            expectedResultSeen = true;
          }
        }
      } else if (debug && lines[i] !== '') {
        process.stdout.write('??? \''+lines[i]+'\'');
      }
    }
  }
}

/**
 * Validate the the json data spit out by the registration program.
 * @param {String} data A JSONg string holding the strongops responseA
 * @returns {Boolean} true if the string is valid and false otherwise
 */
function isValid(data) {
  var status = true;
  if (is.str(data))
    data = JSON.parse(data);

  if (!is.nonEmptyStr(data.email)) {
    console.error('Unexpected email:', data.email);
    status = false;
  }

  if (data.name !== input.name) {
    console.error('Unexpected name:', data.name);
    status = false;
  }

  if (!is.nonEmptyStr(data.id)) {
    console.error('Unexpected id:', data.id);
    status = false;
  }

  if (!is.nonEmptyStr(data.userKey)) {
    console.error('Unexpected id:', data.id);
    status = false;
  }

  if (!is.nonEmptyStr(data.created)) {
    console.error('Unexpected id:', data.id);
    status = false;
  }

  if (!is.nonEmptyStr(data.sid)) {
    console.error('Unexpected sid:', data.sid);
    status = false;
  }

  return status;
}

/**
 * Send the string to the childprocess's standard in stream.
 * @param {String} str a String with the text to send to the child
 * process's input.
 */
function respond(str) {
  prompt.stdin.write(str+'\n');
  if (debug) process.stdout.write(str+'\n');
}
