#!/bin/sh

set -e

echo Updating example dependencies
EXAMPLES="sls-sample-app sn-example-blog sn-example-chat sn-example-urlsaver"
rm -rf data
mkdir -p data
for e in $EXAMPLES
do
  cp -fr node_modules/$e data/
  rm -rf data/$e/node_modules
done

echo Prune oracle connector
find node_modules -depth -name loopback-connector-oracle -exec rm -rf {} \;
echo Prune test directories of dependent modules
#find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -print
find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -exec rm -rf {} \;
