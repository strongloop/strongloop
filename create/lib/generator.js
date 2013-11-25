/**
 * Expose `Generator`.
 */

module.exports = Generator;

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , TaskEmitter = require('strong-task-emitter')
  , camelCase = require('./case').camelCase
  , debug = require('debug')('slc')
  , util = require('util')
  , inherits = util.inherits
  , fs = require('fs')
  , ejs = require('ejs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , Option = require('commander').Option
  , TEMPLATE_DIR = path.join(__dirname, '..', 'templates')
  , assert = require('assert')
  , spawn = require('child_process').spawn;

/**
 * Create a new `Generator` with the given `options`. All options are passed to
 * the generator's templates. The generator may supply a list of options
 * (`Generator.options`) with the following format.
 *
 * ```js
 * Generator.options = {
 *  'inherit-from': {
 *    alias: 'i',
 *    type: 'string'
 *  },
 *  ...
 * };
 * ```
 *
 * Option names that include seperating characters (eg. `-`, `_`) will be turned into camelCase.
 *
 * FIXME camelcasing doesn't work with short options, the short option gets
 * mapped to the real option, not the camel case version. See SLN-472.
 *
 * ```
 * 'my-option-name' => 'myOptionName'
 * 'other_option' => 'otherOption'
 * ```
 *
 * @options {Object} options
 * @prop {String} [templateDir] The directory the generator will use to find template files
 * @prop {String} [output] The root directory `files` will be written to
 * @return {Generator}
 */

function Generator(options) {
  // throw an error if args are not supplied
  assert(typeof options === 'object', 'Generator requires an options object');
  this.options = options;
  this.files = [];
  EventEmitter.call(this);

  options.templateDir = options.templateDir || TEMPLATE_DIR;

  debug('options to normalize', options);

  // normalize options
  Object.keys(options).forEach(function (k) {
    if(k !== '_') {
      debug('map option', k, 'to camelCase:', camelCase(k));
      options[camelCase(k)] = options[k];
    }
    // fix alias
    var alias = getAlias(this.constructor, k);

    if(alias) {
      options[alias] = options[k];
    }
  }.bind(this));

  debug('options after normalize', options);

  this.manifest(this.options, this.add.bind(this));
}

function getAlias(gen, key) {
  if(!gen.options) return null;
  var keys = Object.keys(gen.options);
  var opt;

  for (var i = 0; i < keys.length; i++) {
    opt = gen.options[keys[i]];
    if(opt.alias === key) {
      return keys[i];
    }
  }
}

/**
 * Inherit from `EventEmitter`.
 */

inherits(Generator, EventEmitter);

/**
 * Template directory...
 */

Generator.TEMPLATE_DIR = TEMPLATE_DIR;

/**
 * List all available generators
 */

Generator.list = function () {
  // default location (may change in the future)
  var dir = path.join(__dirname, 'generators');
  var files = fs.readdirSync(dir);
  var generators = files.filter(function(file) {
    return file[0] !== '.';
  });

  return generators.map(function (f) {
    return require(path.join(dir, f));
  });
};

/**
 * Get a generator that supports the given `typeName`.
 *
 * @param {String} typeName
 * @param {String} name
 * @return {Generator|null}
 */

Generator.fromType = function (typeName) {
  var generators = Generator.list();
  var gen;

  for (var i = 0; i < generators.length; i++) {
    gen = generators[i];
    if(Generator.supportsType.call(gen, typeName)) {
      return gen;
    }
  }

  return null;
};

/**
 * Add a template file and output path to the generator.
 *
 * Example:
 *
 *    add('foo/bar.ejs', 'foo/bar.js', {mode: 755});
 *    add({dir: 'my/empty/dir'});
 *
 * @param {String} templateFile
 * @param {String} outputPath
 * @param {Object} [options]
 */

Generator.prototype.add = function (templateFile, outputPath, options) {
  if(typeof templateFile === 'object') {
    options = templateFile;
    templateFile = null;
    outputPath = options.outputPath || outputPath;
  }

  this.files.push({
    templateFile: templateFile,
    outputPath: outputPath,
    options: options || {}
  });
};

/**
 * Generate any sub generators and output the generated file / folder.
 *
 * @param {Object} options
 * @param {Function} cb
 */

Generator.prototype.generate = function (cb) {
  var self = this;
  var te = new TaskEmitter();

  te
    .on('error', cb)
    .on('done', cb);

  te.on('render', function (f, options, content) {
    te.task(self,
      'writeFile', path.join(self.options.output, f.outputPath),
      content, options);
  });

  this.files.forEach(function (f) {
    if(f.options.dir) {
      te.task('mkdirp', mkdirp, f.options.dir);
    } else {
      te.task('render', render, f, self.options);
    }
  });

  function render(f, options, cb) {
    ejs.renderFile(path.join(options.templateDir, f.templateFile), self.options, cb);
  }
};

/**
 * Write the given `content` to the output.
 */

Generator.prototype.writeFile = function (output, content, options, cb) {
  options = options || {};
  var dir = path.dirname(output);
  var dirExists = fs.existsSync(dir);

  // if a file exists in the path of the directory
  // remove it...
  if(dirExists && !fs.statSync(dir).isDirectory()) {
    fs.unlinkSync(dir);
  }

  mkdirp(dir, function (err) {
    if(err) return cb(err);

    console.log('   \x1b[36mcreate\x1b[0m : ' + output);
    fs.writeFileSync(output, content);

    if(this.options.mode) {
      fs.chmodSync(output, options.mode);
    }
    cb();
  }.bind(this));
};

/**
 * Determine if the given type is supported by this generator.

 * @param t {String} type name eg. `slc create <t> <name>`
 * @return supports {Boolean} true if the type is supported
 */

Generator.supportsType = function (t) {
  return ~this.types.indexOf(t);
};

/*!
 * Extend an object.
 */

function extend(origin, add) {
  // don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    if(add[keys[i]] !== undefined) origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

/**
 * Check whether the generator is allowed to safely write files/dirs.
 */

Generator.prototype.canSafelyGenerate = function (cb) {
  var msg;
  var output = this.options.output;
  var te = new TaskEmitter();
  var exists = [];


  te.on('error', function  (err) {
    switch(err.code) {
    case 'ENOENT':
      // ok
      break;
    case 'ENOTDIR':
      msg = output + ' already exists';
      break;
    default:
      msg = err.message;
      break;
    }
  });

  te.on('exists', function (file, fileExists) {
    if(fileExists) exists.push(file);
  });

  te.on('done', function () {
    if(exists.length) {
      exists.forEach(function (file) {
        console.log('   \x1b[31mdelete\x1b[0m : ' + file);
      });

      return cb(
        (exists.length > 1 ? 'files' : 'file')
        + ' already '
        + (exists.length > 1 ? 'exist' : 'exists')
      );
    } else {
      cb();
    }
  });

  this.files.forEach(function (f) {
    te.task(fs, 'exists', path.join(output, f.outputPath));
  });
};
