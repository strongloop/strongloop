/**
 * Run node scripts
 */
 
module.exports = function (options, done) {
  var path = require('path');
  
  return function (script) {
    script = path.join(process.cwd(), script);
    
    try {
      require(script);
    } catch(e) {
      if(e.code === 'MODULE_NOT_FOUND') {
        console.log(e.message);
        done();
      } else {
        done(e);
      }
    }
  }
}