/**
 * Run node scripts
 */
 
module.exports = function (done) {
  return function (script) {
    console.log('run', script);
    done();
  }
}