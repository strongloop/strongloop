/**
 * Print version info
 */
 
module.exports = function (done) {
  return function () {
    console.log('node', process.version);
    done();
  }
}