/**
 * Module dependencies.
 */

// TODO (ritch) this should be `require('slc-create')`
var Generator = require('slc-create/lib/generator');
var types = {};

/**
 * Build projects from templates
 */

module.exports = create;

function create(argv, options, loader) {
  var type = argv.shift();
  var name = argv.shift();
  var isHelp = options.h || options.help;

  if (!type || isHelp) {
    console.log(loader.loadManual('create'));
    process.exit(0);
  }

  var Gen = Generator.fromType(type);

  if(Gen.options) {
    options = loader.parse(argv, Generator.options);
  }

  options.name = name;
  options.output = options.output || options.name;

  var generator = new Gen(options);

  if(generator) {
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
  } else {
    loader.error(new Error(type + ' is not a supported boilerplate type'));
  }

  function generate() {
    generator.generate(function (err) {
      if(err) return loader.error(err);
      process.exit();
    });
  }
}
