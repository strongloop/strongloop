## slc clusterctl -- Control a clustered application

Control an application that has been clustered with strong-cluster-control.

### SYNOPSIS

    slc clusterctl [options] [command]

### OPTIONS

* `-h`, `--help`:
  print usage information
* `-p`, `--path`, `--port <path>`:
  cluster control socket to connect to, defaults to `./clusterctl`
* `command`:
   one of the supported commands, see below (defaults to `status`)

Supported commands are:

- `status`: report status of cluster workers, the default command
- `set-size`: set-size N, set cluster size to N workers
- `stop`: stop the cluster controller
- `restart`: restart all workers

Useful mostly for debugging:

- `disconnect`: disconnect all workers
- `fork`: fork one worker

### Examples

Run an app in the local directory, with two workers, and see status:

        slc example urlsaver my-url
        cd my-url
        slc run . --size=cpus &
        slc clusterctl # => print status of workers

Get status on an app at a specific path:

        slc clusterctl -p /apps/my-app/clusterctl status
