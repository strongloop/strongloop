function shim(name, oldFn) {
  return function (argv, options, loader) {
    var program = require('commander');
    oldFn(program, function (err) {
      if (err) {
        loader.error(err);
      }
    });
    program.parse(['magically eaten', 'me, too', name].concat(argv));
  };
}

module.exports = shim;
