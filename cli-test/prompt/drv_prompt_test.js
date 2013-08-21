/**
 * @fileOverview
 * This script handles testing an interactive prompt using a child process
 * and streams. This is a first-cut, to see how it works If it works well,
 * we can parameterize the inputs making it re-usable.
 */

var expectedResultSeen = false;
var spawn = require('child_process').spawn;
var prompt  = spawn('/usr/bin/env', ['node', './prompt_test.js']);  // make a child process
var fs = require('fs');

// ensure the strings object is at least somewhat valid
var strings = require('./config').strings;   // strings with the prompts to look for
var assert = require('assert');
assert.ok(typeof strings === 'object');
assert.ok(typeof strings.output === 'object');
assert.ok(typeof strings.input === 'object');

// make some convenience references
var output = strings.output;
var input = strings.input;

// handle data events on the child process's stdout stream
// specifically, we are looking for the prompts, so we can respond
prompt.stdout.on('data', function (data) {

  // data is a node.js buffer, it's not a String object. Let's convert to a string.
  data = data.toString();

  // If you want to see what is happening, uncomment the next line
  //console.log('stdout: ', data);

  // does this input match any of the expected inputs?
  // for each expected string, give the correct input
  switch (data) {
  case output.namePrompt:
    prompt.stdin.write(input.name);
    break;
  case output.emailPrompt:
    prompt.stdin.write(input.email);
    break;
  case output.passwordPrompt:
    prompt.stdin.write(input.password);
    break;
  case output.password2Prompt:
    prompt.stdin.write(input.password);
    break;
  case output.data:
    expectedResultSeen = true;
    break;
  default:
  }
});

// display any errors - we don't expect any, but there you go.
prompt.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

// the close event occurs when the child process exits, we grab
// the childprocess exist code and pass it along '0' means success
// and any other value means there was an error.
prompt.on('close', function (code) {
  if (!expectedResultSeen && code === 0)  code = 888;
  if (!expectedResultSeen) console.error('Did not see expected result:', output.data);
  console.log((code === 0) ? 'Success' : 'Failure');
  process.exit(code);
});