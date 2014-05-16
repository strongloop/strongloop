## slc strongops -- configure StrongOps

Generate the configuration files to profile with StrongOps.

Prompts for the email address and password of your StrongOps account, and saves
the credentials in the specified configuration file.

There are no interactive prompts for data specified on the command line.

### SYNOPSIS

    slc strongops [options]

### OPTIONS

* `--email`:
  Specify the email address, e.g.: `--email someone@strongloop.com`.  The
  address found in your `~/.gitconfig` or `~/.npmrc` is offered as the default.
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

See [strong-agent](http://docs.strongloop.com/display/DOC/Working+with+strong-agent)
for a description of the format of the `package.json` and `strongloop.json`
properties used by StrongOps.

### EXAMPLES

The following will have strongops prompt for the email and password.  The
credentials are saved in the `./strongloop.json` file:

        $ slc strongops

By using the options for email and password, you can have a
non-interactive registration, e.g. that will not prompt:

        $ slc strongops --email "bw@example.com" --password "12345678"
