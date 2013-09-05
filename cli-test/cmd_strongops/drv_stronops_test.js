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

// ensure the strings object is at least somewhat valid
var strings = require('./config').strings;   // strings with the prompts to look for

// make some convenience references
var output = strings.output;
var input = strings.input;
var expected = strings.expected;

// for logic flow must be in global scope.
var prompt;
var ecount = 0;
var debug = true;
var email = Date.now().toString()+input.email;

main();

/**
 * Here we create the child process and set up the callbacks to handle
 * stdout, stdin and the close event.
 */
function main() {

  // create the child process that runs the slc strongops command
  prompt  = spawn('/usr/bin/env', ['slc', 'strongops', '--register']);

  // handle data events on the child process's stdout stream
  // specifically, we are looking for the prompts, so we can respond
  prompt.stdout.on('data', handleStdOut);

  // display any errors - we don't expect any, but there you go.
  prompt.stderr.on('data', handleStdErr);

  // the close event occurs when the child process exits, we grab
  // the childprocess exist code and pass it along '0' means success
  // and any other value means there was an error.
  prompt.on('close', handleClose);
}

/**
 *  Handle the child process's close event. We check the exit
 *  code and pass it along.
 *  @param {Number} code The child process's exit code.
 */
function handleClose(code) {
  if (!expectedResultSeen && code === 0)  code = 888;
  console.log((code === 0) ? 'Success' : 'Failure');
  process.exit(code);
}

/**
 * Handle the standard error output from the child process.
 * @param {Buffer} data A node.js buffer containing the stderr text
 */
function handleStdErr(data) {
  console.log('stderr: ' + data);
}

/**
 * Handle the standard output text from the child process.
 * @param {Buffer} data a node.js buffer with the output text
 */
function handleStdOut(data) {

  if (debug) fs.writeFileSync('file.txt', data);

  // data is a node.js buffer, it's not a String object. Let's convert to a string.
  data = data.toString();

  // If you want to see what is happening, uncomment the next line
  if (debug)
    process.stdout.write(data);

  // does this input match any of the expected inputs?
  // for each expected string, give the correct input
  switch (data) {
  case output.namePrompt:
    respond(input.name);
    break;
  case output.emailPrompt:
    respond(email);
    break;
  case output.passwordPrompt:
    respond(input.password);
    break;
  case output.password2Prompt:
    respond(input.password);
    break;
  case output.msg1:
  case output.msg2:
  case output.msg3:
  case '\n':
    break;
  default:
    var lines = data.split('\n');

    ecount = 0;
    for (var i=0; i<lines.length; i++) {
      // Here we match the expected output 1 line at a time.
      // A line is what is output by the command and it may contain '/n'

      // This is a bit tricky:
      // Each time we match a line, incremement the counter,
      if (lines[i].match(expected[ecount])) {
        ecount++;

        // If we are at the LAST expected line and the text is valid
        // then mark the global, expectedResultSeen, as true
        if (ecount > 0) {
          if (fs.existsSync('./strongloop.json') &&
              isValid(require('./strongloop.json'))) {
            expectedResultSeen = true;
            process.exit(0);
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