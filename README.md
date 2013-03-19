# slnode 
**v1.0.0beta2**

`slnode` is a tool for managing **Node.js** source code.

## Install

[StrongLoop Node](http://strongloop.com/products#downloads) includes `slnode` and other tools required to build `Node.js` programs.

## Hello World

The following program will print `hello world` to the console and exit.

    console.log('hello world');
    
Save the above as `hello-world.js` and run the following command:

    $ slnode hello-world
    
This will run the `hello-world.js` script with `StrongLoop Node` and output:

    hello world
    
## Create a Simple Program

`slnode`'s `create` command allows you to generate conventional `Node.js` boilerplate for modules and entire programs.

To generate a console program for issue the following `slnode` command:

    $ slnode create cli my-console-program

The program will be available to your terminal as a command:

    $ my-console-program

This command will output:

    hello from `my-console-program`

## Create a Simple Web App

The `create` command supports several program types. The `web` type is used by default. Both of the following will do the same thing.

    $ slnode create my-app
    
or

    $ slnode create web my-app
    
By default, the generated web app will contain the following:

 - package.json - dependencies and other package configuration
 - app.js       - app entry point and runtime configuration
 - public       - static assets available over http
 - routes       - route handler functions
 - views        - templates for rendering html
 
## Adding Modules

To simplify complex applications, separate your code into small discrete modules. A module is a JavaScript file with a single distinct purpose. It should accept some form of validateable input, and generate meaningful output preferably with an asynchronous api.

Well designed modules often require a significant amount of boilerplate. This is generated for you with the following command:
    
    $ slnode create module my-module
    
This will generate a module in the lib folder `./lib/my-module.js`.

This command also supports automatically generating tests.

    $ slnode create module my-module --test

It also allows you to supply a stream type to implement

    $ slnode create module my-module --stream transform

For more information see the help for each command.

    $ slnode create -h
    $ slnode create module -h
    $ slnode test -h