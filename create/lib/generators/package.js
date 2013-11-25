/**
 * Module dependencies.
 */

var Generator = require('../generator')
  , debug = require('debug')('web-generator')
  , util = require('util')
  , path = require('path')
  , inherits = util.inherits
  , fs = require('fs')
  , pascalCase = require('../case').pascalCase
  , camelCase = require('../case').camelCase
  , assert = require('assert');

/**
 * Expose the `Generator`
 */

module.exports = PackageGenerator;

/**
 * Create a package generator from the given options.
 *
 * @param {Object} options
 */

function PackageGenerator(options) {
  Generator.apply(this, arguments);
}

/**
 * Inherit from `Generator`.
 */

inherits(PackageGenerator, Generator);

/**
 * Define the supported types.
 */

PackageGenerator.types = ['package'];

/**
 * Define the supported options.
 */

PackageGenerator.options = {
  'inherit-from': {
    alias: 'i',
    type: 'string'
  }
};

/**
 * Override the manifest method.
 */

PackageGenerator.prototype.manifest = function (options, add) {
  // options
  options.functionName = pascalCase(options.name);
  options.debugNamespace = options.name;
  options.inheritFrom = options.inheritFrom || 'EventEmitter';
  options.varName = camelCase(options.name);
  options.testPath = '../';
  options.streamType = null;

  add('module-package/index.js.ejs', 'index.js');
  add('module-package/package.json.ejs', 'package.json');
  add('module-package/.gitignore.ejs', '.gitignore');
  add('module-package/test/mocha.js.ejs', 'test/' + options.name + '.test.js');
  add('module-package/test/support.js.ejs', 'test/support.js');
  add('module-package/example/example.js.ejs', 'example/example.js');
  add('module-package/lib/index.js.ejs', 'lib/' + options.name + '.js');
  add('module-package/README.md.ejs', 'README.md');
};
