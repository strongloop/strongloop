## slc debug -- Debug module with node-inspector

### SYNOPSIS

    slc debug [options] [module]

### OPTIONS

* `-h`, `--help`:
  print usage information
* `-c`, `--cli`:
  prevent auto opening web browser
* `-p`, `--port <port>`:
  start debugger on port
* `-s`, `--suspend`:
  suspend on first line
* `-d`, `--debug-port <port>`:
  use an alternate debug port
* `module`:
  module to debug.

Use `.` to debug the application in the current directory.

If no module is specified, then slc will start REPL and load the module in the
current directory.
