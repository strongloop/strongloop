# slc

`slc` is a tool for StrongNode development.

## Install

[StrongNode](http://strongloop.com/products#downloads) includes `slc` and other
tools for developing with `Node.js`.

## Hello World

The following program will print `hello world` to the console and exit.

    console.log('hello world');
    
Save the above as `hello-world.js` and run the following command:

    $ slc hello-world
    
This will run the `hello-world.js` script with `StrongLoop Node` and output:

    hello world
    
## Create a Simple Program

`slc`'s `create` command allows you to generate conventional `Node.js`
boilerplate for modules and entire programs.

To generate a console program issue the following `slc` command:

    $ slc create cli my-console-program

The program will be available to your terminal as a command:

    $ ./my-console-program/bin/my-console-program

This command will output:

    hello from my-console-program

## Create a Simple Web App

The `create` command supports several program types. The following generates the boilerplate for a web app.

    $ slc create web my-app
    
By default, the generated web app will contain the following:

- `package.json`: dependencies and other package configuration
- `app.js`: app entry point and runtime configuration
- `public/`: static assets available over http
- `routes/`: route handler functions
- `views/`: templates for rendering html
 
## Adding Modules

A module is a JavaScript file with a single distinct purpose. It should
accept some form of input, and generate meaningful output preferably with an
asynchronous api.

Well designed modules often require a significant amount of boilerplate. This is
generated for you with the following command:
    
    $ slc create module my-module
    
This will generate a module in the lib folder `./lib/my-module.js`.

This command also supports automatically generating tests.

    $ slc create module my-module --test

It also allows you to supply a stream type to implement. This will generate the
methods required by the specified [streams2](http://nodejs.org/api/stream.html) interface.

 - [readable](http://nodejs.org/api/stream.html#stream_class_stream_readable)
 - [writeable](http://nodejs.org/api/stream.html#stream_class_stream_writable)
 - [duplex](http://nodejs.org/api/stream.html#stream_class_stream_duplex)
 - [transform](http://nodejs.org/api/stream.html#stream_class_stream_transform)

```sh
$ slc create module my-module --stream transform
```

For more information see the help for the create command.

    $ slc create -h

