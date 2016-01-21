#!/usr/bin/env node

var pluginLoader = require('../lib/plugin-loader');
var program = require('commander');
var _ = require('lodash');

var argv = process.argv;
// var $0 = process.env.CMD ? process.env.CMD : path.basename(argv[1]);

pluginLoader.loadPlugins().then(function(plugins) {
  _.each(plugins, processPlugins);
  program.parse(argv);
});

function processPlugins(plugin) {
  _.each(plugin.commands, createCommands);
}

function createCommands(cmd) {
  var c = program.command(cmd.command);
  c.helpFileName = cmd.helpFileName;
  _.each(cmd.aliases, function(alias) {
    c.alias(alias);
  });
  _.each(cmd.options, function(option) {
    c.option(option.flags, option.description);
  });
  c.action(cmd.action);
}
