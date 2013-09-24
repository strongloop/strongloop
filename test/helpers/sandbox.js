'use strict';

var fs = require('fs.extra');
var path = require('path');

exports.PATH = path.resolve(__dirname, '..', 'sandbox');
exports.reset = reset;
exports.path = path.join.bind(null, exports.PATH);

function reset() {
  fs.rmrfSync(exports.PATH);
  fs.mkdirSync(exports.PATH);
}
