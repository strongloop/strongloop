/**
 * @fileOverview
 * I like to use js files for config rather than JSON because you can comments in JS files. :)
 *
 * This file stores the inputs and outputs for drv_strongops_test.js to run the test.
 */

exports.strings = {

  // the outputs expected in the strongops command
  output: {
    namePrompt: "Please enter your: [90mfull name [39m[90m: [39m (Edmond Meinfelder) ",
    emailPrompt: "Please enter your: [90memail address[39m[90m: [39m (edmond@stdarg.com) ",
    passwordPrompt: "Please enter your: [90mpassword[39m[90m: [39m ",
    password2Prompt: "Please enter your: [90mpassword again for confirmation[39m[90m: [39m ",
  },

  // the inputs used in the strong ops command
  input: {
    name: "E. L. Meinfelder",
    email: "-test@strongloop.com",   // we need to add a time prefix to ensure each is unique
    password: "12345678",
  },

  // the expected response
  expected: [
    /^You are now registered. Welcome to StrongOps!/,
    /^Since your StrongOps credentials were not saved, here they are:$/,
    /^{"id":/
  ],
};