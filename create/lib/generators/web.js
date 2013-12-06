/**
 * Module dependencies.
 */

var Generator = require('../generator')
  , debug = require('debug')('slc')
  , util = require('util')
  , inherits = util.inherits
  , fs = require('fs')
  , assert = require('assert')
  , path = require('path');

/**
 * Expose the `Generator`
 */

module.exports = WebGenerator;

/**
 * Create a web generator from the given options.
 *
 * @param {Object} options
 */

function WebGenerator(options) {
  options.output = options.output || options.name;
  Generator.apply(this, arguments);
}

/**
 * Inherits Generator
 */

inherits(WebGenerator, Generator);

/**
 * Define the supported options.
 */

WebGenerator.options = {
  'disable-express': {
    alias: 'E'
  },
  cors: {
    alias: 'c'
  },
  mongoose: {
    alias: 'm'
  },
  rest: {
    alias: 'r'
  },
  title: {
    alias: 't',
    type: 'string'
  }
};

/**
 * Define the supported types.
 */

WebGenerator.types = ['web'];

/**
 * Override the manifest method.
 */

WebGenerator.prototype.manifest = function (options, add) {
  options.mongoose = options.mongoose || null;
  options.cors = options.cors || null;
  options.rest = options.rest || null;
  options.express = !options['disable-express'];
  options.title = options.title || options.name;

  debug('web create: mongoose %s cors %s rest %s express %s title %s name %s',
        options.mongoose, options.cors, options.rest, options.express,
        options.title, options.name);

  // default root files
  add('web/app.js.ejs', 'app.js');
  add('web/package.json.ejs', 'package.json');

  // express files
  if (options.express) {
    add('web/public/stylesheets/style.css.ejs', 'public/stylesheets/style.css');
    add('web/routes/index.js.ejs', 'routes/index.js');
    add('web/views/index.ejs.ejs', 'views/index.ejs');

    if(options.cors) {
      add('web/routes/cors.js.ejs', 'routes/cors.js');
    }
  }

  // mongoose files
  if (options.mongoose) {
    add('web/db/config.js.ejs', 'db/config.js');
    add('web/db/mongo-store.js.ejs', 'db/mongo-store.js');
    add('web/models/user.js.ejs', 'models/user.js');
  }

  // resources
  if (options.express && options.mongoose && options.rest) {
    add('web/routes/resource.js.ejs', 'routes/resource.js');
  }
};
