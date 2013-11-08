#!/bin/sh

set -x
set -e

(cd node_modules/sls-sample-app; npm update)
(cd node_modules/sn-example-blog; npm update)
(cd node_modules/sn-example-chat; npm update)
(cd node_modules/sn-example-urlsaver; npm update)

find node_modules -depth -name loopback-connector-oracle -exec rm -rf {} \;
find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -exec rm -rf {} \;
