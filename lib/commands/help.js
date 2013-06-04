/**
 * Print help for sub commands
 */
function run(argv, options, loader) {
  var usage = loader.getUsage(options._[0]) || loader.loadManual('slnode');

  if (!usage) {
    // TODO: Use `loader` for this message.
    loader.error(util.format('"%s" is not an slnode command. See `slnode help` for more information.', name));
  } else {
    console.log(usage);
  }
}

module.exports = run;
