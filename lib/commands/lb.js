/*!
 * Module Dependencies.
 */

var async = require('async');
var path = require('path');
var install = require('../install');
var i8n = require('inflection');
var ws = require('loopback-workspace');
var Project = ws.models.Project;
var ModelDefinition = ws.models.ModelDefinition;
var DatasourceDefinition = ws.models.DatasourceDefinition;
var mkdirp = require('mkdirp');
var colors = require('colors');

function printDeprecated() {
  console.error('NOTICE'.red.inverse, 'The'.red, 'slc lb'.yellow.underline, 
    'command is only available for LoopBack 1.x projects.'.red);
  console.error('Please use'.red, 'yo loopback'.yellow.underline, 
    'for LoopBack 2.x (http://docs.strongloop.com/display/LB/Yeoman+generators).'.red);
}

module.exports = function lb(argv, options, loader) {
  var args = argv;
  var command = args[0];
  var flags = parseFlags(args);

  if(!command || command === 'help' || options.help || options.h) {
    loader.printUsage('lb');
    printDeprecated();
    return;
  }

  printDeprecated();
  var commands = {
    workspace: workspace,
    project: project,
    model: model,
    datasource: dataSource,
    ds: dataSource,
    acl: addACL
  };

  if(commands[command]) {
    commands[command](parseCommandArg(command, args), flags);
  } else {
    loader.error(command + ' is not a supported command');
  }

  function workspace(dir) {
    dir = dir || 'loopback-workspace';
    mkdirp(dir, function () {
      console.log('Creating workspace', dir.green);
      console.log();
      console.log('Create an app in your workspace:');
      console.log('  $ cd', dir.green);
      console.log('  $ slc lb project my-app');
    });
  }

  function project(dir) {
    if(dir) {
      console.log('Creating app', dir.green);
      Project.createFromTemplate(dir, options.template || 'mobile', function(err) {
        if(err) return error(err);

        process.chdir(dir);
        if (options.install !== false) {
          install(function() {
            printNextSteps();
          });
        } else {
          printNextSteps(true);
        }
      });
    } else {
      error('<name> is required when running `slc lb project <name>`!');
    }

    function printNextSteps(needsInstall) {
      console.log();
      console.log('Create a model in your app:');
      console.log('  $ cd', dir.green);
      console.log('  $ slc lb model product -i');
      if (needsInstall) {
        console.log('  $ npm install');
      }
      console.log('Optional: To view your Project in the StrongOps dashboard');
      console.log('  $ slc strongops');
      console.log('Run your Project:');
      console.log('  $ slc run .');
      printDeprecated();
    }
  }

  function model(name, flags) {
    var config = {
      properties: {},
      name: name,
      public: flags.private ? false : true,
      dataSource: flags['data-source'] || 'db'
    };
    
    if(name) {
      if(flags.i || flags.interactive) {
        startModelPrompts(config.name, config, function (err, config) {
          if(err) {
            error(err);
          } else {
            createModel(config);
          }
        });
      } else {
        createModel(config);
      }
    } else {
      error('<name> is required when running `slc lb model <name>`!');
    }
  }

  function createModel(config) {
    var project;
    var properties = config.properties;
    delete config.properties;

    async.waterfall([
      function(callback) {
        Project.isValidProjectDir(process.cwd(), callback);
      },
      function(isValid, message, callback) {
        if(isValid) {
          Project.loadFromFiles(process.cwd(), function(err, obj) {
            project = obj;
            callback(err);
          });
        } else {
          callback('Project at ' + process.cwd() + ' is not an existing valid project ('+ message +').');
        }
      },
      function(callback) {
        project.models.create(config, callback);
      },
      function(model, callback) {
        async.each(Object.keys(properties), function(name, next) {
          var data = properties[name];
          data.name = name;
          model.properties.create(data, next);
        }, function(err) {
          callback(err);
        });
      },
      function(callback) {
        project.saveToFiles(process.cwd(), callback);
      },
      function(callback) {
        console.log('Created ' + config.name.green + ' model.');
      }
    ], error);
  }

  function dataSource(name, flags) {
    var config = {
      name: name,
      connector: (flags.connector || flags.c) || 'memory'
    };

    if(config.connector === true) delete config.connector;

    if(name) {
      createDataSource(config);
    } else {
      error('<name> is required when running `slc lb datasource <name>`!');
    }
  }

  function createDataSource(config) {
    var project;

    async.waterfall([
      function(callback) {
        Project.isValidProjectDir(process.cwd(), callback);
      },
      function(isValid, message, callback) {
        if(isValid) {
          Project.loadFromFiles(process.cwd(), callback);
        } else {
          callback('Project at ' + process.cwd() + ' is not an existing valid project ('+ message +').');
        }
      },
      function(project, callback) {
        project.dataSources.create(config, function(err) {
          if(err) {
            callback(err);
          } else {
            project.saveToFiles(process.cwd(), callback);
          }
        });
      },
      function(callback) {
        console.log('Created ' + config.name.green + ' datasource.');
      }
    ], error);
  }

  function addACL(arg, flags) {
    var project;

    async.waterfall([
      function(callback) {
        Project.isValidProjectDir(process.cwd(), callback);
      },
      function(isValid, message, callback) {
        if(isValid) {
          Project.loadFromFiles(process.cwd(), callback);
        } else {
          callback('Project at ' + process.cwd() + ' is not an existing valid project ('+ message +').');
        }
      },
      function(p, callback) {
        project = p;
        project.addPermission(flags, callback);
      },
      function(callback) {
        project.saveToFiles(process.cwd(), callback);
      },
      function(callback) {
        console.log('Added ' + 'ACL'.green);
      }
    ], function(err) {
      if(err) {
        switch(err.name) {
          case 'AssertionError':
            error(err.message);
          break;
          default:
            error(err);
          break;
        }
      }
    });
  }

  function isFlag(arg) {
    if(typeof arg !== 'string') return false;
    
    return arg[0] === '-';
  }

  function parseFlagName(flag) {
    var match = flag.match(/-{1,2}(\S+)/);
    return match && match[1];
  }

  function parseFlags(args) {
    var flags = {};
    var flagName;
    
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      var next = args[i + 1];
      if(isFlag(arg)) {
        flagName = parseFlagName(arg);
        flags[flagName] = true;
        if(next && !isFlag(next)) flags[flagName] = next;
      }
    }
    
    return flags;
  }

  function parseCommandArg(command, args) {
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      var next = args[i + 1];

      // ignore flags
      if(isFlag(arg)) continue;
      if(arg === command) {
        if(next && !isFlag(next)) {
          return next;
        }
      }
    }
  }

  function error(err) {
    if (isValidationErr(err)) {
      printValidationErr(err);
    } else {
      loader.error(err);
    }
  }

  function startModelPrompts(name, config, fn) {
    console.log([
      'This tool will walk you through creating a model configuration.',
      'It only covers the most common settings.',
      '',
      'See `slc lb help model` for more information about each of the prompts.',
      '',
      'Press ^C at any time to quit.',
    ].join('\n'));
    
    config.name = name;
    
    run(promptPlural, promptProperties, promptTypes, function () {
      console.log('Done defining model %s (%s).', name, config.plural);
      console.log();
      config.propertyNames.forEach(function (name) {
        console.log('  - %s (%s)', name, config.properties[name].type);
      });
      delete config.propertyNames;
      console.log();
      console.log('Create this model? (yes):');
      prompt(function (err, input) {
        if(err) {
          return fn(err);
        } else {
          input = input || 'yes';
          input = input.toLowerCase();
          if(input === 'yes' || input === 'y') {
            fn(null, config);
          } else {
            console.log('model creation canceled...');
            process.exit();
          }
        }
      });
    }, fn);
    
    // run all functions with the config
    function run() {
      var fns = Array.prototype.map.call(arguments, function (fn) {
        return function (cb) {
          fn(config, cb);
        };
      });
      
      async.series(fns);
    }
  }

  function prompt(fn) {
    console.log();
    var read = require('read');
    read({}, function (err, input) {
      var isNumber = !isNaN(input);

      if(input) console.log();
      if(isNumber) {
        input = Math.floor(Number(input));
      }

      fn.apply(this, arguments);
    });
  }

  function promptPlural(config, fn) {
    // ask for plural
    var defaultPlural = i8n.pluralize(config.name);
    console.log();
    console.log('Plural Name (%s):', defaultPlural);
    prompt(function (err, raw) {
      config.plural = raw || defaultPlural;
      fn(err);
    });
  }

  function promptProperties(config, fn) {
    console.log('Property Names:');
    console.log('  Example:');
    console.log('    title author description totalPages genre');
    prompt(function (err, input) {
      if(typeof input === 'string') {
        input = input.trim();
      }

      if(err) {
        return fn(err);
      } else if(!input) {
        error('You must provide property names...');
      } else if(input === '--help') {
        console.log('...help here...');
      } else {
        config.propertyNames = input.split(/,{0,1}\s+/g);
      }
      
      fn();
    });
  }

  function promptTypes(config, fn) {
    var fns = [];
    
    config.propertyNames.forEach(function (name) {
      fns.push(function (cb) {
        console.log([
          'Select a type for the property "%s":                               ',
          '                                                                   ',
          '  1. string                                                        ',
          '  2. number                                                        ',
          '  3. boolean                                                       ',
          '  4. object                                                        ',
          '  5. array                                                         ',
          '  6. buffer                                                        ',
          '  7. date                                                          ',
          '                                                                   ',
          'Type the number or name. Type enter to select the default (string).'
        ].join('\n'), name);
        
        function getType() {
          prompt(function (err, input) {
            if(err) {
              return cb(err);
            } else {
              var type = normalize(input);
            
              if(types.indexOf(type) > -1) {
                config.properties[name] = {type: type};
                console.log('%s: %s\n', name.green, type);
                cb();
              } else {
                console.log('"%s" is not a valid type. Try again:', type);
                getType();
              }
            }
          });
        }
        
        getType();
      });
    });
    
    var types = [
      'string',
      'number',
      'boolean',
      'object',
      'array',
      'buffer',
      'date'
    ];
    
    function normalize(input) {
      var n = Number(input);
      if(input) {
        if(n === input) {
          return types[n - 1];
        } else {
          return input;
        }
      } else {
        return 'string';
      }
    }
    
    async.series(fns, fn);
  }

  function isValidationErr(err) {
    return err.name === 'ValidationError';
  }

  function printValidationErr(err) {
    if(err.details.context) {
      console.error('Invalid "%s"', err.details.context);
    }
    if(err.details.codes) {
      console.error('Could not validate:')
      Object.keys(err.details.codes).forEach(function(code) {
        console.error(' - %s of "%s"', err.details.codes[code], code);
      })
    }
  }
};
