#!/bin/sh

set -e

echo Updating example dependencies
(cd node_modules/sls-sample-app; npm update)
(cd node_modules/sn-example-blog; npm update)
(cd node_modules/sn-example-chat; npm update)
(cd node_modules/sn-example-urlsaver; npm update)

echo Prune oracle connector
find node_modules -depth -name loopback-connector-oracle -exec rm -rf {} \;
echo Prune test directories of dependent modules
find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -exec rm -rf {} \;

