## slc example -- Create example applications

Create StrongLoop example applications.

### SYNOPSIS

    slc example [type [path]] [flags]

### OPTIONS

* `-h`, `--help`:
  print usage information
* `--no-install`:
  skip the `slc npm install` step after example is created
* `type`:
   one of the supported example types, see below (defaults to `suite`)
* `path`:
   where to create the example (optional, examples have default names)

Supported example types are:

- `suite`: loopback API server, demonstrates loopback integrated with
  strongnode, this is the default type
- `chat`: web chat application, demonstrates socket.io and express integrated
  with strongnode clustering
- `urlsaver`: document storage API server, demonstrates creating an API server
  with express, request, Q, and strongnode clustering
- `blog`: weblog application, demonstates an express web app integrated with
  strongnode clustering

### Examples

Create the suite example:

        slc example

Create the chat example, in a specific path:

        slc example chat example/my-chat
