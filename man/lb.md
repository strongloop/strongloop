## slc lb -- Create LoopBack examples, apps, and workspaces

### SYNOPSIS

    slc lb <command> <arg> [flags]

### COMMANDS

Supported `lb` commands are:

* `workspace [name]`:
  Initialize a workspace as a new empty directory with an optional name.  The
  default name is "loopback-workspace".

        $ slc lb workspace my-loopback-workspace

* `project <name>`:
  Create a LoopBack application in a new directory within a workspace
  using the given name. The <name> argument is required.

        $ cd my-loopback-workspace
        $ slc lb project my-app
        $ slc run my-app # to run the app

* `model <name>`:
  Create a model in an existing LoopBack application using the given name.
  If you provide the `-i` or `--interactive` flags, you will be prompted
  through a model configuration. The <name> argument is required.

        $ cd my-app
        $ slc lb model -i

* `api-example [name]`:
  Create a new LoopBack application from the sample template, in a directory
  with the given name (defaults to `sls-sample-app`).

        $ slc lb api-example
        $ cd sls-sample-app
        $ slc run app # to run the app

### OPTIONS

* `-h`, `--help`:
  Display this help text.
    
* `-i`, `--interactive`:
  Run an interactive model creation. Only supported with the model command.
  
* `--data-source <name>`:
  Supply a custom data source when creating a model. Defaults to "db".
    
* `--private`:
  Do not expose the model's API remotely. 

