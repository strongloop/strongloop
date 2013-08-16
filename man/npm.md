## slc npm -- Run an npm command

### SYNOPSIS

    slc npm [options] <npm-command> [npm-command-args]

### OPTIONS

* `-h`, `--help`:
  print usage information

Supports all npm commands, the most commonly used are:

* `install`:
  install a package from the StrongLoop registry, or from npmjs.org if a
  supported version of the package does not exist
* `ls`:
  list packages with their support status
* `update`:
  update packages to latest
