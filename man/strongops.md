## slc strongops -- Register with StrongOps

The "strongops" command registers users with the StrongOps platform. The
simplest usage is `slc strongops`. The command prompts for user name, email and
a password and then displays the credentials to standard output, if the
credentials were not written to a file. If no command line options are given for
name or email, the strongops command tries to find defaults from `~/.gitconfig`
(name and email) and then `~/.npmrc` (email). However, when you specify valid
options on the command line, there are no interactive prompts for the data
specified on the command line.

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
  Saves StrongOps account credentials in a `./strongloop.json` file.
* `--package`:
  Saves StrongOps account credentials in `./package.json` file, if the file
  exists.
* `--global`:
  Saves StrongOps account credentials in a `~/strongloop.json` file.
* `--saveall`:
  Saves StrongOps account credentials to `./strongloop.json`, `./package.json` and
  `~/strongloop.json` files.

### EXAMPLES

The following will have strongops prompt for the name, email and password.  The
JSON containing the strongops credentials are sent to standard output:

    slc strongops

Next, the strongops credentials are saved to the local `./package.json` file:

    slc strongops --package

By using the options for name, email and password, you can have a
non-interactive registration, e.g. that will not prompt:

    slc strongops --name "Bill Williams" --email "bw@strongops.com" --password "12345678"

Using the saveall option causes strongops to save the credentials to
`./package.json`, `./strongloop.json` and `~/strongloop.json`:

    slc strongops --saveall
