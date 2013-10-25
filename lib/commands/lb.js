/*!
 * Module Dependencies.
 */

var async = require('async');
var example = require('../example');
var path = require('path');
var i8n = require('inflection');
var ws = require('loopback-workspace');
var Workspace = ws.Workspace;
var Project = ws.Project;
var mkdirp = require('mkdirp');

module.exports = function (argv, options, loader) {
  var args = argv;
  var command = args[0];
  var flags = parseFlags(args);

  if(!command) {
    return help();
  }

  var commands = {
    workspace: workspace,
    project: project,
    model: model,
    'api-example': apiExample
  };

  if(commands[command]) {
    commands[command](parseCommandArg(command, args), flags);
  } else {
    loader.error(command + ' is not a supported command');
  }

  function help() {
    console.log(loader.loadManual('lb'));
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
      Project.create(path.join(process.cwd(), dir), {name: dir}, function () {
        var ws = Workspace();
        var config = { name: dir };
        var root = path.join(process.cwd(), dir);
        var project = Project({root: root});

        config.applications = ['app'];

        async.waterfall([
          function (callback) {
            project.addModule(ws.factory('app'), 'app', config, callback);
          },
          function (callback) {
            project.addModule(ws.factory('data-source-memory'), 'db', config, callback);
          },
          function (callback) {
            project.addModule(ws.factory('docs'), 'docs', config, callback);
          },
          printNextSteps
        ], error);
      });
    } else {
      error('<name> is required when running `slc lb project <name>`!');
    }

    function printNextSteps() {
      console.log('Create a model in your app:');
      console.log('  $ cd', dir.green);
      console.log('  $ slc lb model product -i');
      console.log('Install dependencies:');
      console.log('  $ slc install');
      console.log('Run your Project:');
      console.log('  $ slc run app');
    }
  }

  function model(name, flags) {
    var config = {
      properties: {},
      name: name,
      public: flags.private ? false : true,
      'data-source': flags['data-source'] || 'db'
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

  function apiExample(name) {
    var type = 'suite';
    var repo = 'sls-sample-app';
    name = name || repo;
    return example( argv, options, loader, type, repo, name);
  }

  function createModel(config) {
    var modelFactory = Workspace().factory('model');
    var project;
    var appModuleName = 'app';

    async.waterfall([
      function(callback) {
        Project.isProject(process.cwd(), function (valid) {
          if(!valid) return callback('Project at ' + process.cwd() + ' does not exist.');
          callback();
        });
      },
      function(callback) {
        project = new Project({root: process.cwd()});
        project.addModule(modelFactory, config.name, config, callback);
      },
      function(callback) {
        if(config.public) {
          project.getModuleConfig(appModuleName, function(err, appConfig) {
            if(err) return callback(err);
            if(typeof appConfig !== 'object') {
              return callback('malformed or missing app config');
            }
            var models = appConfig.models || (appConfig.models = []);
            if(models.indexOf(config.name) === -1) models.push(config.name);
            callback(null, appConfig);
          });
        } else {
          // callback with null for appConfig
          callback(null, null);
        }
      },
      function(appConfig, callback) {
        if(!appConfig) {
          return callback();
        }

        project.setModuleConfig(appModuleName, appConfig, callback);
      },
      function(callback) {
        console.log('Created ' + config.name.green + ' model.');
      }
    ], error);
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
    loader.error(err);
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
};
