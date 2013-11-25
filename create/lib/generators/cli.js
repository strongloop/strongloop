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
 * Expose `CliGenerator`.
 */

module.exports = CliGenerator;

/**
 * Create a cli generator from the given options.
 *
 * @param {Object} options
 */

function CliGenerator(options) {
  Generator.apply(this, arguments);
}

/**
 * Inherits Generator
 */

inherits(CliGenerator, Generator);

/**
 * Define the supported types.
 */

CliGenerator.types = ['cli'];

/**
 * Override the manifest method.
 */

CliGenerator.prototype.manifest = function (options, add) {
  add('cli/bin/program.ejs', path.join('bin', options.name), {mode: 0755});
  add('cli/package.json.ejs', 'package.json');
};
