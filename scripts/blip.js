p = process;
e = p.env;
// for debugging..
q = // function(i) { console.log(Error(i).stack); p.exit(0); } ||
  p.exit.bind(p,0);
r = require;
t = setTimeout(q, 1000);
t.unref && t.unref();
try {
  r('fs').statSync('.git').isDirectory() && q('skip');
} catch(x) {
  r('http').get({
    // hostname: 'requestb.in',
    hostname: 'blip.strongloop.com',
    path: // '/sxy98jsx?' +
      '/' + (e.npm_package_name||'node') + '@' + (e.npm_package_version ||p.version),
    headers: {
      'User-Agent': e.npm_config_user_agent||('node/'+p.version),
    },
    agent: false,
  }).on('error', q).on('response', q).setTimeout(500, q);
}
