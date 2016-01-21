var pluginLoader = require('../plugin-loader');
var _ = require('lodash');
var fsExtra = require('fs-extra');

module.exports = [
  {
    command: 'plugins:install <plugin>',
    options: [
      {flags: '-r, --registry [URL]', description: ''},
    ],
    helpInfo: null,
    action: installPlugin,
    aliases: [],
  }, {
    command: 'plugins:uninstall',
    options: [],
    helpInfo: null,
    action: uninstallPlugin,
    aliases: [],
  }, {
    command: 'plugins:list',
    options: [],
    helpInfo: null,
    action: listPlugins,
    aliases: ['plugins'],
  }
];
module.exports.name = 'plugins';

function installPlugin(pluginUri, options) {
  pluginLoader.installPlugin(pluginUri, options.registry)
    .catch(function(err) {
      console.error('Unable to install plugin from %s: %s',
        pluginUri, err.message
      );
      process.exit(1);
    });
}

function uninstallPlugin(pluginName) {
  pluginLoader.loadPlugins().then(function(plugins) {
    var pluginInfo = _(plugins).find({name: pluginName});
    if (!pluginInfo) {
      console.error('Plugin %s is not installed', pluginName);
      return process.exit(1);
    }
    if (pluginInfo.version === 'built-in') {
      console.error('Cannot remove built-in plugin %s', pluginName);
      return process.exit(1);
    }
    fsExtra.rmrf(pluginInfo.path, function(err) {
      if (err) {
        console.error('Unable to uninstall %s. Error: %s',
          pluginName, err.message);
        return process.exit(1);
      }
    });
  });
}

function listPlugins() {
  pluginLoader.loadPlugins().then(function(plugins) {
    _(plugins)
      .orderBy(['version', 'name'], ['asc', 'desc'])
      .each(function(plugin) {
        console.log('  %s %s', plugin.name, plugin.version);
      }).value();
  });
}
