Usage: slc create <type> <name> [...]

Create node script boilerplate.

Options:

  -h, --help  print usage information
  name        name of boiler-plate to create
  ...         options specific to type, see below

Types:

  web         simple express app with optional mongoose support
  package     npm module with package.json and typical layout
  module      node single-file class module in ./lib
  cli         empty cli program (no options)


Web options:

  -E, --disable-express  disable express support
  -c, --cors             enable CORS for routes
  -m, --mongoose         add mongoose/mongodb support
  -r, --rest             add REST apis for mongoose models
  -t, --title <title>    set the title of your application

Package options:

  -i, --inherit-from     module to inherit from, default: EventEmitter

Module options:

  -i, --inherit-from     module to inherit from, default: EventEmitter
  -t, --test             included a generated test
  -s, --stream <type>    implement a stream interface (readable, writeable,
                         duplex, transform)
