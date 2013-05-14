/**
 * Delegation to npm commands
 * <ul>
 * <li>install Install a package 
 * <li>link Symlink a package folder 
 * <li>ls List installed packages 
 * <li>rm/uninstall Remove a package 
 * <li>shrinkwrap Lock down dependency versions
 * </ul>
 */
module.exports = function(parent, done) {
  var npm = require('npm');
  var path = require('path');
  var cmd = parent.command('*')
    .description('run a npm command - [npm] <npm-command> [npm-command-args]')
    .usage('[npm] <npm-command> [npm-command-args]')
    .action(function() {
    if (arguments.length > 0 && 'run' === arguments[0]) return;
      
    var args = Array.prototype.slice.call(arguments); // Convert to an array
    
    // commander appends one or more commands to the end of the args
    var count = 0;
    for ( var i = args.length-1; i >= 0; i--) {
      if ((typeof args[i]) !== 'string') {
        count++;
      } else {
        break;
      }
    }
    args.splice(-count, count); // Remove the commands
    
    // Remove npm if necessary
    if(args[0] === 'npm') {
      args.shift();
    }
    
    var argv = ['node', 'npm'].concat(args);
    npmcli(argv, done);
  });
  // [rfeng] Hack: set the name for help 
  cmd._name = 'npm';
  return cmd;
}


/**
 * The following function is copied from npm/bin/npm-cli.js. It helps parse the command line options into npm config values.
 * 
 * @param argv An array of string arguments
 * @returns
 */
function npmcli(argv, done) { 

  process.title = "npm"
  process.argv = argv;

  var log = require("npm/node_modules/npmlog")
  log.pause() // will be unpaused when config is loaded.
  log.info("it worked if it ends with", "ok")

  var fs = require("npm/node_modules/graceful-fs")
    , path = require("path")
    , npm = require("npm/lib/npm.js")
    , npmconf = require("npm/node_modules/npmconf")
    , errorHandler = require("npm/lib/utils/error-handler.js")

    , configDefs = npmconf.defs
    , shorthands = configDefs.shorthands
    , types = configDefs.types
    , nopt = require("npm/node_modules/nopt")

  function cb(err, data) {
    errorHandler(err, data);
    // done && done(err, data); // Skip calling done as it causes npm to report "npm ERR! not ok code 0"
  }  

  log.verbose("cli", argv)

  var conf = nopt(types, shorthands)
  npm.argv = conf.argv.remain
  
  if (npm.deref(npm.argv[0])) npm.command = npm.argv.shift()
  else conf.usage = true
  
  if(!npm.command) {
    process.title = 'slnode';
    // The command is not recognized
    return;
  }
  
  if (conf.version) {
    console.log(npm.version)
    return
  }

  if (conf.versions) {
    npm.command = "version"
    conf.usage = false
    npm.argv = []
  }

  log.info("using", "npm@%s", npm.version)
  log.info("using", "node@%s", process.version)

  // make sure that this version of node works with this version of npm.
  var semver = require("npm/node_modules/semver")
    , nodeVer = process.version
    , reqVer = npm.nodeVersionRequired
  if (reqVer && !semver.satisfies(nodeVer, reqVer)) {
    return cb(new Error(
      "npm doesn't work with node " + nodeVer
      + "\nRequired: node@" + reqVer), true)
  }

  process.on("uncaughtException", cb)
  
  if (conf.usage && npm.command !== "help") {
    npm.argv.unshift(npm.command)
    npm.command = "help"
  }

  // now actually fire up npm and run the command.
  // this is how to use npm programmatically:
  conf._exit = true
  npm.load(conf, function (er) {
    if (er) return errorHandler(er)
    var npmcmd = npm.commands[npm.command];
    npmcmd(npm.argv, cb)
  })

}
