#!/bin/sh

set -e

echo Updating example dependencies
EXAMPLES="loopback-example-app"
BRANCHES=`sl-install branches`
rm -rf data
mkdir -p data
for e in $EXAMPLES
do
  # Remove old data
  rm -rf data/$e

  npm install --ignore-scripts "strongloop/$e#production" && mv node_modules/$e data/

  # Remove the dependencies, we don't package them
  rm -rf data/$e/node_modules

  # npm shrinkwrap fails with extraneous installed modules
  rm -rf node_modules/$e
done

echo Prune oracle connector
find node_modules -depth -name loopback-connector-oracle -exec rm -rf {} \;
echo Prune test directories of dependent modules
#find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -print
find node_modules -depth -type d -regex '.*/node_modules/[^/]*/test' -exec rm -rf {} \;
