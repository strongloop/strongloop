process.env.CMD = 'slc registry'; // Used by sl-registry in --help
module.exports = require('../command')('sl-registry', 'strong-registry');
