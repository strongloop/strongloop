/**
 * Print node env info...
 */

var async = require('async');
var debug = require('debug')('slc');
var trace = require('debug')('slcenv');
var p = require('path');
var fs = require('fs');
var which = require('which');

/*
toSlc -> which slc
absSlc -> where it resolves to
absSlcNpm -> ... build from above

toNpm -> which npm // or derive from toSlc?
absNode = process.execPath
absNodeNpm = ... build from above

diffNpm -> path.relative(toSlc, from)

unlink
fs.symlink();

*/

function run(argv, options, loader) {
  debug('argv', argv, 'options', options);

  var selector = options._; // the argv, stripped of the flags (both -- and -)

  installPaths(function(er, paths) {
    var execPaths = resolvePaths(paths);

    execPaths['slc-npm'] = slcNpmPath(execPaths.slc);
    execPaths['node-npm'] = nodeNpmPath(execPaths.node);

    //console.log('to node npm: ', p.relative(paths.npm, execPaths['node-npm']));
    //console.log('to slc npm: ', p.relative(paths.npm, execPaths['slc-npm']));

    var env = {
      cwd: process.cwd(),
      paths: {
        link: paths,
        exec: execPaths,
      },
      versions: process.versions,
      platform: process.platform,
      config: process.config,
      // redundant with .paths: execPath: process.execPath,
      features: process.features
    };
    try {
      env = selectProperties(selector, env);//XXX argv--> includes options?
    } catch(er) {
      return loader.error(er.message);
    }
    console.log(env);
  });
}

function selectProperties(properties, obj) {
  var select = properties.shift();
  if(!select) {
    return obj;
  }
  if(obj[select] === undefined) {
    throw Error('No such property: ' + select);
  }
  // Hm, js object literals can't include key names specified as variables?
  var r = {};
  r[select] = selectProperties(properties, obj[select]);
  return r;
}

// slc npm is in ../slc/node_modules/npm/bin/npm
function slcNpmPath(slcPath) {
  return p.join(slcPath, '../../node_modules/npm/bin/npm');
}
// node npm is beside node
function nodeNpmPath(nodePath) {
  return p.join(nodePath, '../npm');
}

// return dictionary of install paths for node/npm/slc commands
function installPaths(cb) {
  async.parallel({
    node: asyncPath('node'),
    npm: asyncPath('npm'),
    slc: asyncPath('slc')
  }, cb);
}

// async compatible wrapper of which()
function asyncPath(exe) {
  return function(cb) {
    which(exe, cb);
  };
}

// resolve symlinks of all paths to eventual targets
function resolvePaths(paths) {
  var exec = {};
  var originalWd = process.cwd();
  for (var name in paths) {
    process.chdir(originalWd);
    exec[name] = resolveLink(paths[name]);
    process.chdir(originalWd);
  }
  process.chdir(originalWd);
  return exec;
}

// resolve link to absolute path
function resolveLink(path) {
  var links = readLinkRecursive(path);
  var resolved = p.resolve.apply(null, links);

  trace('links', links, 'resolves to', resolved);

  return resolved;
}

// read link, recursively, return array of links seen up to final path
function readLinkRecursive(path, seen) {
  seen = seen || [];

  seen.push(p.dirname(path));

  var next = readLink(path);

  trace('recur', seen, next);

  if(!next) {
    seen.push(p.basename(path));
    return seen;
  }
  return readLinkRecursive(next, seen);
}

// read link, return undefined if not link
function readLink(path) {
  try {
    return fs.readlinkSync(path);
  } catch(er) {
    trace('readlink failed', er);
    return undefined;
  }
}

module.exports = run;
