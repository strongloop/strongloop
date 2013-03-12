/**
 * Install modules using slnode npm
 */
 
module.exports = function (options, done) {

  var npm = require('npm');
  var path = require('path');
  
  return function (module) {
    npm.load(require(path.join(process.cwd(), 'package.json')), function (err) {
      if (err) return done(err);
      npm.commands.install([module], function (err, data) {
        if (err) return done(err);
      
        done();
      });
      npm.on("log", function (msg) { console.log(msg); });
    });
  }
}