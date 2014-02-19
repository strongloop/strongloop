## slc -- Utility for StrongNode development

Utility for StrongNode development.

### SYNOPSIS

    slc --help
    slc <command> [--help] [...]

### OPTIONS

* `-h`, `--help`:
  print usage information for slc

### COMMANDS

* `example:`:
  create example applications
* `lb:`:
  create LoopBack workspaces, applications, and models
* `run:`:
  run a node script using strong-supervisor
* `clusterctl`:
  configure clustering at run time using strong-cluster-control
* `debug:`:
  debug a node script
* `env:`:
  print node environment information
* `version:`:
  print node version
* `help:`:
  print usage information for a command

### EXAMPLES

        $ slc example
        $ slc lb project mywebapp
        $ slc run app.js
        $ slc run --cluster=CPUs app.js
        $ slc clusterctl status
        $ slc debug app.js
