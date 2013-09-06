/**
 * @fileOverview
 * A test for the interactive prompt in the strongops command. This does not 
 * register a user, it just prompts for data.
 */
'use strict';
var strops = require('../../lib/commands/strongops');
var overrides = {};
var defaults = {};

var cb = function(err, userData) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // display the data collected in the prompt
  console.log(JSON.stringify(userData));

  process.exit(0);
};

strops.test.promptUserForReg(overrides, defaults, cb);
