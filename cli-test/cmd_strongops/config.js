/**
 * @fileOverview
 * I like to use js files for config rather than JSON because you can comments in JS files. :)
 *
 * This file stores the inputs and outputs for drv_strongops_test.js to run the test.
 */

exports.strings = {

  testReg: {
    // the outputs expected in the strongops command
    prompts: {
      namePrompt: /^Please enter your: full name/,
      emailPrompt: /^Please enter your: email address/,
      passwordPrompt: /^Please enter your: password/,
      password2Prompt: /^Please enter your: password again for confirmation/,
    },

    // the inputs used in the strong ops command
    input: {
      name: 'E. L. Meinfelder',
      email: '-test@strongloop.com',   // we need to add a time prefix to ensure each is unique
      password: '12345678',
    },

    // the expected response
    expected: [
      /^Please answer the following/,
      /^You are now registered./,
      /^Your StrongOps credentials were written/,
    ],
  },

  testLogin: {
    // the outputs expected in the strongops command
    prompts: {
      namePrompt: /^xxxx$/,
      emailPrompt: /^Please enter your: email address/,
      passwordPrompt: /^Please enter your: password/,
      password2Prompt: /^xxxx$/
    },

    // the inputs used in the strong ops command
    input: {
      name: 'E. L. Meinfelder',
      email: '-test@strongloop.com',   // we need to add a time prefix to ensure each is unique
      password: '12345678',
    },

    // the expected response
    expected: [
      /^You are now logged in. Welcome back./,
      /^Your StrongOps credentials were written/,
    ],
  }
};
