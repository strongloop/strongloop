var Promise = require('bluebird');
var _ = require('lodash');
var d = require('debug')('strongloop:plugin-loader');
var exec = require('child_process').exec;
var f = require('util').format;
var fs = require('fs');
var fsExtra = Promise.promisifyAll(require('fs-extra'));
var mkdirp = Promise.promisify(require('mkdirp'));
var mktmpdir = require('./util').mktmpdir;
var osenv = require('osenv');
var path = require('path');
var util = require('util');
var which = require('shelljs').which;

var pluginBase = path.resolve(osenv.home(), '.slc', 'plugins', 'node_modules');
function ensurePluginDir() {
  return mkdirp(pluginBase);
}

function validatePlugin(pluginPath) {
  d('validating plugin path %s', pluginPath);
  try {
    var pluginInfo = require(path.join(pluginPath, 'package.json'));
    if (!pluginInfo.keywords ||
      pluginInfo.keywords.indexOf('strongloop-cli-plugin') === -1) {
      d('invalid plugin: missing keyword');
      return false;
    }
    var maybePluginMethods = require(pluginPath);
    if (!util.isArray(maybePluginMethods)) {
      d('invalid plugin: no commands found');
      return false;
    }
    var isCommands = _(maybePluginMethods)
      .map(function(maybeCommand) {
        d('command: %s', maybeCommand.command);
        d('action: %s', maybeCommand.action);
        d('helpInfo: %j', maybeCommand.helpInfo);
        return maybeCommand.command && maybeCommand.action &&
          maybeCommand.helpInfo;
      })
      .compact().value();

    d('plugin: # valid commands %d', isCommands.length);
    return isCommands.length > 0;
  } catch (e) {
    return false;
  }
}

function installPlugin(pluginUri, registryUri) {
  var npmScript = which('npm') || which('npm.bat');
  if (!npmScript) throw 'Ensure that npm executable is on the path';

  try {
    var maybeLocalPath = path.resolve(pluginUri);
    if (fs.statSync(maybeLocalPath)) {
      pluginUri = maybeLocalPath;
    }
  } catch (e) {
    // ignore
  }

  return mktmpdir()
    .then(installPluginInDir)
    .then(function(pluginDir) {
      if (!validatePlugin(pluginDir)) throw new Error('Invalid plugin');
      return copyPluginIntoPlace(pluginDir);
    });

  function copyPluginIntoPlace(srcDir) {
    var pluginName = path.basename(srcDir);
    var destDir = path.join(pluginBase, pluginName);
    d('copy plugin from %s to %s', srcDir, destDir);
    return fsExtra.copy(srcDir, destDir, {});
  }

  function installPluginInDir(dir) {
    var installCmd = f(
      '%s --prefix %s install %s --silent',
      npmScript, dir, pluginUri
    );
    if (registryUri)
      installCmd = f('%s --registry=%s', installCmd, registryUri);
    d(installCmd);
    return new Promise(function(resolve, reject) {
      var proc = exec(installCmd, function(err) {
        if (err) {
          d('Error running npm install: %s', err.message);
          return reject(err);
        }
        var pluginBase = path.join(dir, 'node_modules');
        var pluginDirs = fs.readdirSync(pluginBase);
        d('tmp install dir listing %j', pluginDirs);
        if (pluginDirs[0] === '.bin') pluginDirs.shift();
        if (pluginDirs.length < 1) return reject('NPM installation failed');
        d('found installed plugin in %s', pluginDirs[0]);
        return resolve(path.join(pluginBase, pluginDirs[0]));
      });
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
    });
  }
}
exports.installPlugin = installPlugin;

function loadPluginsFromDir(basedir, isBuiltin) {
  isBuiltin = isBuiltin || false;
  var pluginDirs = fs.readdirSync(basedir);
  return _(pluginDirs).map(function(dir) {
    if (!validatePlugin(path.join(basedir,dir))) return false;

    var pluginDir = path.join(basedir, dir);
    var package = require(path.join(pluginDir, 'package.json'));
    return {
      name: package.name,
      version: isBuiltin ? 'built-in' : package.version,
      commands: require(pluginDir),
      path: pluginDir,
    };
  }).compact().value();
}

function loadBuiltinPlugins() {
  var pluginDir = path.resolve(__dirname, './builtin-plugins');
  var builtinPlugins = fs.readdirSync(pluginDir);
  return _(builtinPlugins).map(function(file) {
    var pluginPath = path.join(pluginDir, file);
    var plugin = require(pluginPath);
    return {
      name: plugin.name,
      version: 'built-in',
      commands: require(pluginPath),
    };
  }).value();
}

/**
 * Load plugins from ./lib/builtin-plugins/, node_modules and
 * ~/.slc/plugins/node_modules.
 *
 * @return Array[PluginDef]
 */
function loadPlugins() {
  return ensurePluginDir().then(function() {
    return loadPluginsFromDir(path.resolve(__dirname, '../node_modules'), true)
      .concat(loadBuiltinPlugins())
      .concat(loadPluginsFromDir(pluginBase));
  });
}
exports.loadPlugins = loadPlugins;
