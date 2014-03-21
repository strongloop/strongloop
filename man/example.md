## slc example -- Create example applications

Create StrongLoop example applications.

### SYNOPSIS

    slc example [type [path]] [flags]

### OPTIONS

* `-h`, `--help`:
  print usage information
* `--no-install`:
  skip the `npm install` step after example is created
* `type`:
   one of the supported example types, see below (defaults to `suite`)
* `path`:
   where to create the example (optional, examples have default names)

Supported example types are:

- `suite`: LoopBack API server, demonstrates LoopBack integrated with
  StrongNode, this is the default type

### Examples

Create the suite example:

        slc example
