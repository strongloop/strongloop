## slc -- Utility for StrongNode development

Utility for StrongNode development.

### SYNOPSIS

    slc [-h|--help|-v|--version] [...]
    slc <command> [--help] [...]

### OPTIONS

* `-h`, `--help`:
  print usage for slc (use `slc cmd -h` for help on `cmd`), and exit.

* `-v`, `--version`:
  print version of slc and node, and exit.

### COMMANDS

* `clusterctl`: control clustering at run-time using strong-cluster-control
* `debug`: debug a node script using node-inspector
* `env`: print node environment information
* `example`: create example applications
* `lb`: create LoopBack workspaces, applications, and models
* `run`: run a node script using strong-supervisor
* `strongops`: register or login to StrongOps, create strongloop.json
* `update`: bring strong-cli and it's dependencies up-to-date

### EXAMPLES

        $ slc example
        $ slc lb project mywebapp
        $ slc run app.js
        $ slc run --cluster=CPUs app.js
        $ slc clusterctl status
        $ slc debug app.js
