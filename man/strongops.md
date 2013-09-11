## slc strongops -- Register with StrongOps

The "strongops" command registers users with the StrongOps platform. The
simplest usage is `slc strongops`. The command prompts for user name, email and
a password and then saves the credentials to ./strongloop.json.  If no command
line options are given for name or email, the strongops command tries to find
defaults from `~/.gitconfig` (name and email) and then `~/.npmrc` (email).
However, when you specify valid options on the command line, there are no
interactive prompts for the data specified on the command line.

### SYNOPSIS

    slc strongops [options]

### OPTIONS

* `--name`:
  Specify the full user name, e.g.: `--name 'Bob Roberts'` (quotes are
  needed as the full name contains a space).
* `--email`:
  Specify the email address, e.g.: `--email someone@strongloop.com`.
* `--password`:
  Specify your StrongOps password, e.g.: `--password 12345678`
* `--nosave`:
  Prevent saving of StrongOps account credentials, this overrides any save
  option.
* `--local`:
  Saves StrongOps account credentials in a `./strongloop.json` file. This is
set by default, if no other save options exist.
* `--package`:
  Saves StrongOps account credentials in `./package.json` file, if the file
  exists.
* `--global`:
  Saves StrongOps account credentials in a `~/strongloop.json` file.
* `--register`:
  Skips attempt to login and registers a new user. By default, the command
  logs users into StrongOps.
* `--saveall`:
  Saves StrongOps account credentials to `./strongloop.json`, `./package.json` and
  `~/strongloop.json` files.
* `--nocolors`:
  Does not use ANSI colors in the responses - this is the default.
* `--colors`: Use ANSI colors. If used with `--nocolors`, overrides
  `--nocolors`.

See [strong-agent](http://docs.strongops.com/strong-agent) for a description of
the format of the `package.json` and `strongloop.json` properties used by Strong
Ops.

### EXAMPLES

The following will have strongops prompt for the name, email and password.  The
JSON containing the strongops credentials are sent to standard output:

        $ slc strongops

Next, the strongops credentials are saved to the local `./package.json` file:

        $ slc strongops --package

By using the options for name, email and password, you can have a
non-interactive registration, e.g. that will not prompt:

        $ slc strongops --name "Bill Williams" --email "bw@strongops.com" --password "12345678"

Using the saveall option causes strongops to save the credentials to
`./package.json`, `./strongloop.json` and `~/strongloop.json`:

        $ slc strongops --saveall

Applications can be set up so that whether Strong Ops profiling occurs is
configured at deploy/run time, based on whether the credentials have been
saved. To do this, call `profile()` with no arguments, as below:

        // app.js
        // Call profile() before any modules which need profiling are
        // required. In the absence of credentials, this is effectively
        // a null op.
        require('strong-agent').profile();

        // ... rest of application is required ...
