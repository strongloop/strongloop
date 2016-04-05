#!/usr/bin/env node
// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: strongloop
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

require('../lib/loader')
  .createLoader({
    manuals: require('path').resolve(__dirname, '..', 'man')
  })
  .on('error', function(err) {
    console.error(err.message);
    process.exit(1);
  })
  .run();
