## slc lb -- Create LoopBack examples, apps, and workspaces

### SYNOPSIS

    slc lb <command> <arg> [flags]

### COMMANDS

Supported `lb` commands are:

* `workspace [name]`:
  Initialize a workspace as a new empty directory with an optional name.  The
  default name is "loopback-workspace".

        $ slc lb workspace my-loopback-workspace

* `project <name> [--no-install]`:
  Create a LoopBack application in a new directory within a workspace
  using the given name. The <name> argument is required. With `--no-install`,
  will not install the npm dependencies.

        $ cd my-loopback-workspace
        $ slc lb project my-app
        $ slc run my-app # to run the app

* `model <name>`:
  Create a model in an existing LoopBack application using the given name.
  If you provide the `-i` or `--interactive` flags, you will be prompted
  through a model configuration. The <name> argument is required.

        $ cd my-app
        $ slc lb model product -i

* `datasource <name>`:
  Create a datasource in an existing LoopBack application using the given name.
  You must supply a connector name using the `--connector` option.

        $ cd my-app
        $ slc lb datasource mongo --connector mongodb

* `acl`:
Add a new permission to an existing model or to all models. Creates an ACL entry
Use options described below to configure the exact permission.

**ACL Options**

 * `--model <name>`:
   Specify the model name to apply the new permissions against.
   You must supply either the `--model` or `--all-models` argument.

 * `--all-models`:
   Apply the permission to all models. You must supply either the `--model` or
   `--all-models` argument.

**ACL Access Types**

 * `--all`:
   Set the access type to the wildcard. This matches `read`, `write` and
   `execute`.

 * `--read`:
   Set the access type to `READ`.

 * `--write`:
   Set the access type to `WRITE`.

 * `--execute`:
   Set the access type to `EXECUTE`.

**ACL Properties and Methods**

 * `--property`:
    Specify a specific property to apply the permission to. Defaults to all.

 * `--method`:
    Specifiy a specific method to apply the permission to. Defaults to all.
 
 **ACL Role Identifiers**

 * `--owner`:
    Only apply this permission to users who own the specified model instance.
  
 * `--related`:
    Any user with a relationship to the object

 * `--authenticated`:
    Authenticated users

 * `--unauthenticated`:
    Unauthenticated users

 * `--everyone`:
    All users

 **ACL Permissions**

 * `--alarm`:
    Generate an alarm, in a system dependent way, the access

 * `--allow`:
    Explicitly grants access to the model.

 * `--deny`:
    Explicitly denies access to the model. 

 * `--audit`:
    Log, in a system dependent way, the access specified in the permissions
    component of the ACL entry.

**ACL Notes**

 * you may only supply a single access type
 * you may only supply a single role identifier
 * you may only supply a single permission

**ACL Examples**

    # disable all access to all models
    # note: other permissions will override this
    $ slc lb acl --deny --all-models --everyone --all

    # allow authors to edit posts
    $ slc lb acl --model post --allow --owner --all

    # only allow owners to access objects
    $ slc acl --deny --all-models --everyone --all
    $ slc acl --allow --all-models --owner --all

### OPTIONS

* `-h`, `--help`:
  Display this help text.

* `-i`, `--interactive`:
  Run an interactive model creation. Only supported with the model command.

* `--data-source <name>`:
  Supply a custom data source when creating a model. Defaults to "db".

* `--private`:
  Do not expose the model's API remotely. 

* `-c`, `--connector`:
  Specify the connector name when creating a datasource (required).
