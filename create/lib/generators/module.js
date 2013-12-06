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

module.exports = ModuleGenerator;

/**
 * Create a module generator from the given options.
 *
 * @param {Object} options
 */

function ModuleGenerator(options) {
  Generator.apply(this, arguments);
  // overrides
  options.output = '';
  options.install = false;
}

/**
 * Inherit from `Generator`.
 */

inherits(ModuleGenerator, Generator);

/**
 * Define the supported types.
 */

ModuleGenerator.types = ['module'];

/**
 * Define the supported options.
 */

ModuleGenerator.options = {
  'inherit-from': {
    alias: 'i',
    type: 'string'
  },
  test: {
    alias: 't',
    type: 'boolean'
  },
  stream: {
    alias: 's',
    type: 'string'
  }
};

ModuleGenerator.prototype.manifest = function (options, add) {
  add('module/index.js.ejs', path.join('lib', options.name + '.js'));

  if(options.stream) {
    options.streamType = options.stream;
  } else {
    options.streamType = null;
  }

  if(options.test) {
    options.testPath = path.join('..', 'lib', options.name + '.js');
    add('module-package/test/mocha.js.ejs', 'test/' + options.name + '.test.js');
  } else {
    options.testPath = null;
  }

  options.functionName = pascalCase(options.name);
  options.debugNamespace = options.name;

  if(options.streamType) {
    options.inheritFrom = pascalCase(options.streamType);
  }
  options.inheritFrom = options.inheritFrom || 'EventEmitter';
  options.varName = camelCase(options.functionName);
};
