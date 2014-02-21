process.env.CMD = 'slc debug'; // Used by node-debug in --help
module.exports = require('../command')('node-debug', 'node-inspector');
