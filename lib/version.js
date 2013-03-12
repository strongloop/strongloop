/**
 * Print version info
 */
 
module.exports = function (options, done) {
  return function () {
    console.log('node', process.version);
    done();
  } 
}