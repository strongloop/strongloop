## slc -- Utility for StrongNode development

Utility for StrongNode development.

### SYNOPSIS

    slc [options] [command] [args]
    slc <npm-command> [npm-command-args]
    slc <script-file> [args]

Note that the second and third command forms are short forms of the npm and run
commands described below. An unrecognized slc command that is an npm command
will be passed to npm, any other unrecognized command will be passed to the run
command.

### OPTIONS

* `-h`, `--help`:
  print usage information

### COMMANDS

* `npm:`:
  run a npm command
* `run:`:
  run a node script
* `env:`:
  print node environment information
* `version:`:
  print node version
* `help:`:
  print usage information for a command
* `debug:`:
  debug a script
* `create:`:
  create node script boilerplate
* `lb:`:
  create LoopBack workspaces, applications, and models
* `example:`:
  create example applications

### EXAMPLES

        $ slc create web mywebapp
        $ slc run app.js
        $ slc npm list
        $ slc npm install -f express
        $ slc install -f express
        $ slc example chat my-chat
