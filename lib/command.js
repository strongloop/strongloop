var assert = require('assert');
var spawn = require('child_process').spawn;

module.exports = function Command(command, npmModule) {
  return function(argv, options, loader) {
    var options = {
      env: process.env,
      stdio: 'inherit'
    };

    // Because the commands are node scripts, on Windows, they are wrapped in a
    // command file, and command files cannot be spawned, since they aren't
    // actually executable binaries. So, we call cmd.exe to spawn them, but
    // this means we have to do the quoting ourselves, trying to deal with the
    // very different way arguments are handled on windows and unix.
    if (process.platform === 'win32') {
      var quotedArgs = argv.map(windowsQuoteArg).join('');
      var file = 'cmd.exe';
      var args = ['/s', '/c', '"' + command + quotedArgs + '"'];
      options.windowsVerbatimArguments = true;
    } else {
      var file = command;
      var args = argv;
    }

    return spawn(file, args, options)
      .on('error', function(er) {
        loader.error('Error running %s (%s), it may need installation, try `npm update -g %s`.',
          command, er.message, npmModule);
      });
  };
};

function windowsQuoteArg(arg) {
  arg = String(arg);

  // If unnecessary, don't use quotes at all.
  if (!/[ \t"]/.test(arg))
    return ' ' + arg;

  // String contains only spaces. It's sufficient to wrap in quotation marks.
  if (!/[\\"]/.test(arg))
    return ' "' + arg + '"';

  /* String needs to be fully quoted.
   * Expected input/output:
   *   input : hello"world
   *   output: "hello\"world"
   *   input : hello""world
   *   output: "hello\"\"world"
   *   input : hello\world
   *   output: hello\world
   *   input : hello\\world
   *   output: hello\\world
   *   input : hello\"world
   *   output: "hello\\\"world"
   *   input : hello\\"world
   *   output: "hello\\\\\"world"
   *   input : hello world\
   *   output: "hello world\"
   */

  var result = '"';
  var quoteFlag = true;

  for (var i = arg.length - 1; i >= 0; i--) {
    var char = arg[i];

    if (quoteFlag && char === '\\') {
      result = '\\\\' + result;
    } else if (char === '"') {
      quoteFlag = true;
      result = '\\"' + result;
    } else {
      quoteFlag = false;
      result = char + result;
    }
  }

  result = ' "' + result;

  return result;
}

if(require.main.filename === module.filename) {
  var tests = [
    ['hello"world',     ' "hello\\"world"'],
    ['hello""world',    ' "hello\\"\\"world"'],
    ['hello\\world',    ' hello\\world'],
    ['hello\\\\world',  ' hello\\\\world'],
    ['hello\\"world',   ' "hello\\\\\\"world"'],
    ['hello\\\\"world', ' "hello\\\\\\\\\"world"'],
    ['hello world\\',   ' "hello world\\"'],
  ];

  for (var i = 0; i < tests.length; i++) {
    var t = tests[i];
    assert.strictEqual(windowsQuoteArg(t[0]), t[1]);
  }
  console.log(module.filename, 'OK');
}
