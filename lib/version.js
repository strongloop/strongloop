/**
 * Output version
 */
 
module.exports = function (parent, done) {
  return parent
    .command('version')
    .description('print node version')
    .action(function () {
      console.log('node', process.version);
      done();
    });
}