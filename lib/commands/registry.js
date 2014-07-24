process.env.CMD = 'slc registry'; // Used by sl-registry in --help
module.exports = require('../command')('bin/sl-registry', 'strong-registry');
