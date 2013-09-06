/**
 * @fileOverview
 * I like to use js files for config rather than JSON because you can comments in JS files. :)
 *
 * This file stores the inputs and outputs for drv_strongops_test.js to run the test.
 */

exports.strings = {

  // the outputs expected in the strongops command
  output: {
    namePrompt: 'Please enter your: [90mfull name [39m[90m: [39m (Edmond Meinfelder) ',
    emailPrompt: 'Please enter your: [90memail address[39m[90m: [39m (edmond@stdarg.com) ',
    passwordPrompt: 'Please enter your: [90mpassword[39m[90m: [39m ',
    password2Prompt: 'Please enter your: [90mpassword again for confirmation[39m[90m: [39m ',
    msg1: 'You are now registered. Welcome to StrongOps!\n',
    msg2: 'Your StrongOps credentials were written to: ./strongloop.json\n',
    msg3: 'Please answer the following to register with StrongOps:\n\n',
  },

  // the inputs used in the strong ops command
  input: {
    name: 'E. L. Meinfelder',
    email: '-test@strongloop.com',   // we need to add a time prefix to ensure each is unique
    password: '12345678',
    error: '^[[31mError: Either the user is not registered or has a different password.^[[39m'
  },

  // the expected response
  expected: [
    /^You are now registered.+/,
    /^'Your StrongOps credentials were written/
  ],
};
