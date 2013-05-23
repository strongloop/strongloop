/**
 * Output version
 */
 
module.exports = function (parent, done) {
  return parent
    .command('version')
    .description('print node version')
    .action(function () {
      var v = require('../package.json').version
      
      console.log('strongloop', v, '(node ' + process.version + ')');
      done();
    });
}