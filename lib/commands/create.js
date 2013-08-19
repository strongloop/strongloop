/**
 * Module dependencies.
 */

// TODO (ritch) this should be `require('slc-create')`
var Generator = require('slc-create/lib/generator');

/**
 * Build projects from templates
 */

module.exports = create;


function create(argv, options, loader) {
  var type = loader.parse(argv)._[0];
  var isHelp = options.h || options.help;

  if (!type || isHelp) {
    console.log(loader.loadManual('create'));
    process.exit(0);
  }

  var generator = Generator.fromTypeName(type);

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
    generator.generate(generator.buildOptions(options));
  }
}
