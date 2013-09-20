/**
 * Print help for sub commands
 *
 * Can be called explicitly (`slc help blah`), but is also used by loader
 * to satisfy a `--help` option.
 */
function run(argv, options, loader) {
  // XXX(sam) because we fallback to slc manual, which always exists, the
  // !usage case is never reachable, and it should be!
  var usage = loader.getUsage(options._[0]) || loader.loadManual('slc');

  if (!usage) {
    var name = options._[0];
    return loader.error(
      '"%s" is not an slc command. See `slc help` for more information.', name);
  } else {
    console.log(usage);
  }
}

module.exports = run;
