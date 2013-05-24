/**
 * Debug a project
 */
 
module.exports = function (parent, done) {
  return parent
  .command('debug')
  .description('debug a script')
  .action(function () {
    console.warn('The debug command is NOT implemented.');
    done();
  });
}
