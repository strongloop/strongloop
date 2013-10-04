/**
 * Module dependencies.
 */

var debug = require('debug')('slc');
var install = require('../install');
var path = require('path');
var Generator = require('slc-create');

/**
 * Build projects from templates
 */

module.exports = create;

function create(argv, options, loader) {
  var type = options._[0];
  var output = options._[1];

  debug('create argv:', argv, 'options:', options);

  if(!type || !output) {
    return loader.error(
      'type and name are mandatory options for `slc create`, ' +
      'see `slc help create`'
    );
  }

  var name = path.basename(output);
  var Gen = Generator.fromType(type);

  if(!name) {
    return console.log(loader.getUsage('create'));
  }

  if(!Gen) {
    loader.error(new Error(type + ' is not a supported boilerplate type'));
    return;
  }

  if(Gen.options) {
    options = loader.parse(argv, Generator.options);
  }

  options.name = name;
  options.output = output;

  debug('create options name %s output %s', options.name, options.output);

  var generator = new Gen(options);

  generator.canSafelyGenerate(function (err) {
    if(err) {
      require('commander').confirm(err + ', continue? ', function(ok) {
        if (ok) {
          process.stdin.destroy(); // stdin prevents node exiting
          generate();
        } else {
          loader.error(err + ', not continuing.');
        }
      });
    } else {
      generate();
    }
  });

  function generate() {
    generator.generate(function (err) {
      if(err) return loader.error(err);

      if(generator.options.install !== false) {
        process.chdir(options.output);
        install(function(err) {
          if(err) {
            return loader.error(err);
          }
        });
      }
    });
  }
}
