// Copyright IBM Corp. 2013,2014. All Rights Reserved.
// Node module: strongloop
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

function shim(name, oldFn) {
  return function(argv, options, loader) {
    var program = require('commander');
    oldFn(program, function(err) {
      if (err) {
        loader.error(err);
      }
    });
    program.parse(['magically eaten', 'me, too', name].concat(argv));
  };
}

module.exports = shim;
