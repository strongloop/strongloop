/**
 * Module dependencies.
 */

var Generator = require('slc-create');
var types = {};

/**
 * Build projects from templates
 */

module.exports = create;

function create(argv, options, loader) {
  var type = options._[0];
  var name = options._[1];
  var Gen = Generator.fromType(type);

  if(!Gen) {
    loader.error(new Error(type + ' is not a supported boilerplate type'));
    return;
  }

  if(Gen.options) {
    options = loader.parse(argv, Generator.options);
  }

  options.name = name;
  options.output = options.output || options.name;

  var generator = new Gen(options);

  generator.canSafelyGenerate(function (err) {
    if(err) {
     require('commander').confirm(err + ', continue? ', function(ok) {
       if (ok) {
         process.stdin.destroy(); // stdin prevents node exiting
         generate();
       } else {
         loader.error(new Error(err + ', not continuing.'));
       }
     });
    } else {
      generate();
    }
  });

  function generate() {
    generator.generate(function (err) {
      if(err) return loader.error(err);
      process.exit();
    });
  }
}
