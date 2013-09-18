//
// # CommandLoader
//
// The CommandLoader is responsible for loading and validating Command modules
// present at a configurable location in the filesystem.
//
var assert = require('assert');
var debug = require('debug')('slc');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var optimist = require('optimist');
var util = require('util');

//
// ## CommandLoader `CommandLoader(obj)`
//
// Creates a new instance of CommandLoader with the following options:
//  * root - The location of Command modules in the filesystem, represented as a
//    String. Defaults to a sibling 'commands' folder.
//  * strict - If true, CommandLoader will emit 'error' events if its run with a
//    primary argument that doesn't exist as a command. Otherwise, that argument
//    will be included in the fallback command's arguments. Defaults to `false`.
//    Unused by slc, which has fallback to run command.
//  * usage - If `--help` or `-h` are passed as options, this command will be
//    used to generate a usage summary. Defaults to 'help'.
//  * fallback - If an unknown command is specified while running, this command
//    is used instead. Defaults to the same as `usage`.
//  * default - The command to run when no command is specified in argv.
//    Defaults to the same as `usage`.
//  * manuals - If set, this location will be used as a repository of named
//    manual files by loadManual()
//
// Commands are modules required from `root`. They must have a .run function,
// and a .usage string. Or, if module exports justa a function, that function
// will be used as the .run function, and if .usage is undefined it will be
// loaded by loadManual().
function CommandLoader(obj) {
  if (!(this instanceof CommandLoader)) {
    return new CommandLoader(obj);
  }

  obj = obj || {};

  this.root = obj.root || path.resolve(__dirname, 'commands');
  this.strict = obj.strict || false;
  this.usage = obj.usage || 'help';
  this.fallback = obj.fallback || this.usage;
  this.default = obj.default || this.usage;
  this.manuals = obj.manuals || null;
}
util.inherits(CommandLoader, EventEmitter);
CommandLoader.createLoader = CommandLoader;

//
// ## isCommand `CommandLoader.isCommand(module)`
//
// Returns `true` if **module** is a valid Command, `false` otherwise.
//
CommandLoader.isCommand = isCommand;
function isCommand(module) {
  return !!module && typeof module.run === 'function';
}

//
// ## parse `parse(argv, [options])`
//
// Parses **argv** as an Array of Strings, whether command line arguments or
// similar. If **options** is specified, is it used to configure `optimist`
// accordingly.
//
// Returns an Object with `-f` and `--foo` arguments as members and extraneous
// arguments as members of the `_` Array.
//
CommandLoader.prototype.parse = parse;
function parse(argv, options) {
  return optimist(argv).options(options || {}).argv;
}

//
// ## run `run([argv])`
//
// Synchronously parses **argv**, or `process.argv` otherwise. If a command is
// present, that command is run. If no command is run, the configured `fallback`
// command is run instead.
//
CommandLoader.prototype.run = run;
function run(argv) {
  var self = this;
  var options = self.parse(argv || (argv = process.argv.slice(2)));
  var command = null;

  debug('slc run, argv', argv, 'options', options);

  if (options.help || options.h) {
    // If we've provided --help as an option, it takes precedence. Show usage.
    command = self.getRun(self.usage);
  } else if (!options._.length) {
    command = self.getRun(self.default);
  } else {
    // Otherwise, if we've provided our own command, use that.
    command = self.getRun(options._[0]);

    // Build the new, command-local `argv` and `options`.
    if (command) {
      argv = argv.slice(argv.indexOf(options._[0]) + 1);
      options = self.parse(argv);
    } else if (self.strict) {
      return self.error(
        '"%s" is not an slc command. See `slc help` for more information.',
        options._[0]);
    } else {
      command = self.getRun(self.fallback);
    }
  }

  assert(command);

  process.env.SLC_COMMAND = command.name;
  command(argv, options, self);

  return self;
}

//
// ## loadCommand `loadCommand(name)`
//
// Synchronously loads the Command module for **name**.
//
// Returns either a Command or null if the command could not be loaded.
//
CommandLoader.prototype.loadCommand = loadCommand;
function loadCommand(name) {
  var self = this;
  var module = null;
  var command = path.resolve(this.root, String(name));

  try {
    module = require(command);
  } catch (e) {
    debug('require %s failed with', command, e);

    if (e && e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(command) !== -1) {
      // In this case, the command was not found. Without the indexOf(), if the
      // command implementation had a buggy require of a module that couldn't be
      // found, it would be handled as if the command wasn't present.
      return null;
    }

    return self.error('Error loading module "%s":\n', name, e);
  }

  if (typeof module === 'function' || typeof module.run === 'function') {
    module = {
      name: name,
      run: module.run || module,
      usage: self.loadManual(name)
    };
    assert(module.usage, 'command ' + name + ' must have usage');
  }

  if (!CommandLoader.isCommand(module)) {
    return null;
  }

  return module;
}

//
// ## getUsage `getUsage(name)`
//
// Returns the usage information for the **name** Command, represented as a
// String. If **name** cannot be found, returns `null`.
//
CommandLoader.prototype.getUsage = getUsage;
function getUsage(name) {
  var self = this;
  var module = self.loadCommand(name);

  return module ? module.usage : null;
}

//
// ## getRun `getRun(name)`
//
// Returns the run Function for the **name** Command. If **name** cannot be
// found, returns `null`.
//
CommandLoader.prototype.getRun = getRun;
function getRun(name) {
  var self = this;
  var module = self.loadCommand(name);

  debug('loadCommand', 'name', name,
    'run?', module && typeof module.run,
    'usage?', module && typeof module.usage);

  return module ? module.run : null;
}

//
// ## error `error(format, ...)`
//
// Emits a new error event for user handling, arguments are formatted
// with `util.format()`.
//
CommandLoader.prototype.error = error;
function error() {
  var self = this;
  var message = util.format.apply(null, arguments);

  self.emit('error', new Error(message));

  return self;
}

//
// ## loadManual `loadManual(name)`
//
// Synchronously loads the manual file for **name** if it exists within a
// configured `loader.manuals` folder.
//
// Returns the file's contents if it exists, `null` otherwise.
//
// Files are required to be in UTF-8 format.
//
CommandLoader.prototype.loadManual = loadManual;
function loadManual(name) {
  var self = this;
  var filename;

  if (!self.manuals) {
    return null;
  }

  filename = path.resolve(self.manuals, name);

  if (!fs.existsSync(filename)) {
    return null;
  }

  var usage = fs.readFileSync(filename, 'utf8');
  if(process.platform === 'win32') {
    var boldPair = new RegExp('.\b', 'g'); // any char, followed by a backspace
    var clean = usage.replace(boldPair, '');
    usage = clean;
  }
  return usage;
}

module.exports = CommandLoader;
