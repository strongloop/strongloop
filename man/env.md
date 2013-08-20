## slc env -- Print or configure runtime environment

With no options,
prints information about node run-time from the process module (paths, platform,
config, execPath, and features). The output can be limited by using one or more
selectors, see examples.

With `--use-npm`, sets the system npm link to either the version of npm bundled
with node ("legacy"), or the version of npm bundled with slc ("default"). No
matter which npm is installed into the path, the slc version can always be
called using `slc npm ...`.

### SYNOPSIS

    slc env [options] [selectors...]

### OPTIONS

* `-h`, `--help`:
  print usage information
* `--use-npm default|legacy`:
  Use default npm from slc, or the legacy version of npm bundled with node.


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
