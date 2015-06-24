'use strict';

var fs = require('fs');
var http = require('http');

var debug = /test/.test(process.env.NODE_ENV);

if (debug || !inRepo()) {
  blip();
} else {
  process.exit(0);
}

return;

function inRepo() {
  try {
    return fs.statSync('.git').isDirectory();
  } catch (e) {
    return false;
  }
}

function blip() {
  var pkgName = process.env.npm_package_name;
  var pkgVersion = process.env.npm_package_version;
  var req = http.get({
    hostname: 'blip.strongloop.com',
    path: '/' + pkgName + '@' + pkgVersion,
    headers: {
      'User-Agent': process.env.npm_config_user_agent,
    },
    agent: false,
  });
  req.on('error', onError);
  req.on('response', onResponse);
  req.setTimeout(500, onTimeout);
  // also set a global timeout in case slow name resolution prevents the
  // connection from starting, thus bypassing the socket timeout
  var timer = setTimeout(onTimeout, 1000);
  timer.unref && timer.unref();
}

function onResponse(res) {
  if (debug) {
    console.log('response:', res.statusCode, res.url);
  }
  process.exit(0);
}

function onError(err) {
  if (debug) {
    console.log('error:', err);
  }
  process.exit(0);
}

function onTimeout() {
  if (debug) {
    console.log('timeout:', arguments);
  }
  process.exit(0);
}
