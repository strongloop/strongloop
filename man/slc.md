## slc -- StrongLoop Controller

Command-line tool for development and control of a Node application.

### SYNOPSIS

    slc [-h|--help|-v|--version] [...]
    slc <command> [--help] [...]

### OPTIONS

* `-h`, `--help`:
  print usage for slc (use `slc cmd -h` for help on `cmd`), and exit.

* `-v`, `--version`:
  print version of slc and node, and exit.

### COMMANDS

* `build`: build a node application package using strong-build
* `clusterctl`: same as `runctl`
* `debug`: debug a node script using node-inspector
* `deploy`: deploy a node application package using strong-deploy
* `env`: print node environment information
* `example`: create example applications
* `lb`: create LoopBack 1.x workspaces, applications, and models (deprecated)
* `loopback`: create LoopBack 2.x applications, datasources, models, acls, and relations
* `pm`: manage deployed node applications with strong-pm
* `pm-install`: install strong-pm as an OS service
* `registry`: switch registries and promote packages with strong-registry
* `run`: run a node script using strong-supervisor
* `runctl`: control a node script using strong-supervisor
* `strongops`: save StrongOps API key into strongloop.json
* `update`: bring strongloop and it's dependencies up-to-date

### EXAMPLES

        $ slc loopback
        $ slc loopback:model
        $ slc loopback:example
        $ slc lb project mywebapp
        $ slc run app.js
        $ slc run --cluster=CPUs app.js
        $ slc runctl status
        $ slc debug app.js
