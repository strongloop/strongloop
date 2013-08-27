/**
 * Print node env info
 */

var async = require('async');
var debug = require('debug')('slc');
var trace = require('debug')('slcenv');
var p = require('path');
var fs = require('fs');
var which = require('which');

function run(argv, options, loader) {
  debug('argv', argv, 'options', options);

  var selector = options._; // the argv, stripped of the flags (both -- and -)

  installPaths(function(er, paths) {
    var useNpm = options['use-npm'];

    if(er) {
      return loader.error('Failed to find install paths: %s', er.message);
    }

    var execPaths = resolvePaths(paths);

    execPaths['slcNpm'] = slcNpmPath(execPaths);
    execPaths['nodeNpm'] = nodeNpmPath(execPaths);

    if(useNpm) {
      var target;
      switch(useNpm) {
        case 'legacy': target = execPaths['nodeNpm']; break;
        case 'default': target = execPaths['slcNpm']; break;
        default:
          return loader.error('--use-npm=%s, invalid option, see `slc help env`');
      }
      if(target == execPaths.npm) {
        console.log('Already using %s npm, no change to env required', useNpm);
        return;
      }
      var relative = p.relative(p.dirname(paths.npm), target);

      debug('linking npm', paths.npm, 'to', target, 'with', relative);

      try {
        fs.unlinkSync(paths.npm);
        fs.symlinkSync(relative, paths.npm);
      } catch(er) {
        return loader.error('Failed to set npm to %s: %s\n  (Usually caused by insufficient permissions.)',
                     useNpm, er.message);
      }

      return;
    }

    var env = {
      cwd: process.cwd(),
      paths: {
        link: paths,
        exec: execPaths,
      },
      versions: process.versions,
      platform: process.platform,
      config: process.config,
      execPath: process.execPath,
      features: process.features
    };
    try {
      env = selectProperties(selector, env);
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

// slc npm is in .../slc/node_modules/npm/bin/npm
function slcNpmPath(exec) {
  return p.join(exec.slc, '../../node_modules/.bin/npm')
}
// node npm is beside node
function nodeNpmPath(exec) {
  return p.join(exec.node, '../npm')
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
  }
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
  process.chdir(p.dirname(path));
  return readLinkRecursive(next, seen);
}

// read link, return undefined if not link
function readLink(path) {
  try {
    return fs.readlinkSync(path);
  } catch(er) {
    trace('readlink from %s failed', process.cwd(), er.message);
    return undefined;
  }
}

module.exports = run;
