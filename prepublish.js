var shell = require('shelljs');

console.log('Updating loopback-example-app...');
shell.cd(__dirname);
shell.rm('-rf', 'data');
shell.mkdir('data');
shell.exec('git clone --depth=1 --branch=production ' +
           'https://github.com/strongloop/loopback-example-app.git ' +
           'data/loopback-example-app');
shell.rm('-rf', 'data/loopback-example-app/.git');
