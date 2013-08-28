## slc env -- Print runtime environment

Prints information about node run-time from the process module (paths, platform,
config, execPath, and features). The output can be limited by using one or more
selectors, see examples.

### SYNOPSIS

    slc env [options] [selectors...]

### OPTIONS

* `-h`, `--help`:
  print usage information

### EXAMPLES

Print zlib version:

        % slc env versions zlib
        { versions: { zlib: '1.2.3' } }

Print paths:

        % slc env paths
        { paths:
           { link:
              { node: '/usr/local/bin/node',
                npm: '/usr/local/bin/npm',
                slc: '/usr/local/bin/slc' },
             exec:
              { node: '/usr/local/stow/installed-node/bin/node',
                npm: '/usr/local/lib/node_modules/slc/node_modules/npm/bin/npm-cli.js',
                slc: '/usr/local/lib/node_modules/slc/bin/slc',
                slcNpm: '/usr/local/lib/node_modules/slc/node_modules/.bin/npm',
                nodeNpm: '/usr/local/stow/installed-node/bin/npm' } } }
