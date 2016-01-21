var mktmpdir = require('mktmpdir');
var Promise = require('bluebird');

function defer() {
  var deferred = {};
  deferred.promise = new Promise(function(resolve, reject) {
    deferred.reject = reject;
    deferred.resolve = resolve;
  });
  return deferred;
}
exports.defer = defer;

function mktmpdirWrapper() {
  var deferred = defer();
  mktmpdir(function(err, tmpdir, done) {
    deferred.promise.finally(done);
    if (err) return deferred.reject(err);
    deferred.resolve(tmpdir);
  });
  return deferred.promise;
}
exports.mktmpdir = mktmpdirWrapper;
